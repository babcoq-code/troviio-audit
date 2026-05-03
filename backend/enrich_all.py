"""
Scrape Amazon product pages via Firecrawl and enrich test_summary/pros/cons/verdict via DeepSeek.
"""
import os, json, re, time, sys
from datetime import datetime

SUPABASE_URL = os.environ.get('SUPABASE_URL', 'os.getenv("SUPABASE_URL", "")')
SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')
DEEPSEEK_KEY = os.environ.get('DEEPSEEK_API_KEY')
FIRECRAWL_KEY = os.environ.get('FIRECRAWL_API_KEY')

from supabase import create_client
supa = create_client(SUPABASE_URL, SERVICE_KEY)
import httpx

DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions"
FIRECRAWL_ENDPOINT = "https://api.firecrawl.dev/v1/scrape"

def scrape_amazon(asin: str) -> str | None:
    url = f"https://www.amazon.fr/dp/{asin}"
    try:
        r = httpx.post(FIRECRAWL_ENDPOINT, json={"url": url}, headers={
            "Authorization": f"Bearer {FIRECRAWL_KEY}",
            "Content-Type": "application/json"
        }, timeout=60)
        if r.status_code == 200:
            return r.json().get("data", {}).get("markdown", "")
    except Exception as e:
        print(f"  ⚠️ Firecrawl: {e}")
    return None

def extract_reviews(md: str) -> str:
    """Extract review-related content from Amazon page markdown."""
    # Find the customer reviews section
    sections = []
    
    # Look for rating table / review summary
    patterns = [
        r'(?i)(?:Customer Reviews|Avis clients|Commentaires clients|What customers say)[\s\S]{0,8000}',
        r'(?i)(?:⭐|étoiles|stars)[\s\S]{0,3000}',
    ]
    for p in patterns:
        for m in re.finditer(p, md):
            sections.append(m.group(0))
    
    # Also find the product comparison table (valuable for positioning)
    table_match = re.search(r'(?i)(?:Compare with similar items|Comparer)[\s\S]{0,5000}', md)
    if table_match:
        sections.append(table_match.group(0))
    
    # Combine, deduplicate, truncate
    all_text = "\n\n".join(sections)
    if not all_text:
        all_text = md[:8000]
    return all_text[:10000]

def generate_enrichment(name: str, brand: str, page_content: str, existing_specs: str = "") -> dict:
    prompt = f"""Tu es un expert en analyse produit pour Troviio, le meilleur comparateur de produits.

Produit: {name}
Marque: {brand}

Contenu récupéré de la page Amazon :
---
{page_content[:8000]}
---

{f"Spécifications existantes: {existing_specs[:2000]}" if existing_specs else ""}

Génère UNIQUEMENT du JSON valide :
{{
  "test_summary": "Test complet 200-400 mots en français. Structure: 1) Mise en contexte du produit, 2) Analyse des performances (basée sur les retours et specs), 3) À qui s'adresse ce produit, 4) Verdict.",
  "pros": [
    "Point fort spécifique et factuel (chiffré si possible)",
    "Point fort 2 spécifique..."],
  "cons": [
    "Point faible spécifique et factuel",
    "Point faible 2 spécifique..."],
  "verdict": "Conclusion punchy : pour qui, pour quoi, à quel prix (1-2 phrases)"
}}

Règles :
- 3-5 pros, 2-4 cons (des VRAIS défauts)
- Phrases complètes, spécifiques, chiffrées quand possible
- Pas de superlatifs vides
- Le verdict doit être actionnable pour l'acheteur"""
    
    try:
        r = httpx.post(DEEPSEEK_ENDPOINT, json={
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3,
            "max_tokens": 3000,
            "response_format": {"type": "json_object"}
        }, headers={
            "Authorization": f"Bearer {DEEPSEEK_KEY}",
            "Content-Type": "application/json"
        }, timeout=120)
        
        if r.status_code != 200:
            print(f"  ⚠️ DeepSeek {r.status_code}")
            return {}
        
        return json.loads(r.json()["choices"][0]["message"]["content"])
    except Exception as e:
        print(f"  ⚠️ DeepSeek: {e}")
        return {}

def main():
    resp = supa.table("products").select("id,name,brand,amazon_asin,slug,test_summary,pros,cons,verdict").execute()
    products = resp.data
    print(f"📦 {len(products)} produits")
    
    # Products with ASIN but weak test_summary
    to_process = []
    for p in products:
        asin = p.get("amazon_asin", "")
        if not asin or len(asin) < 10:
            continue
        ts = p.get("test_summary", "") or ""
        pros = p.get("pros") or []
        if len(pros) < 3 or len(ts) < 80:
            to_process.append(p)
    
    print(f"🔍 {len(to_process)} à enrichir")
    updated = 0
    failed = 0
    
    for i, p in enumerate(to_process):
        name = p.get("name", "")
        asin = p["amazon_asin"]
        print(f"\n[{i+1}/{len(to_process)}] {name} ({asin})")
        
        # Scrape
        md = scrape_amazon(asin)
        if md:
            content = extract_reviews(md)
            print(f"   ✅ Page ({len(content)} chars)")
        else:
            content = "Aucune page Amazon récupérée."
            print(f"   ⚠️ Pas de page")
        
        # Analyze
        data = generate_enrichment(name, p.get("brand",""), content)
        if data and data.get("pros"):
            update = {}
            if data.get("test_summary"): update["test_summary"] = data["test_summary"]
            if data.get("pros"): update["pros"] = data["pros"]
            if data.get("cons"): update["cons"] = data["cons"]
            if data.get("verdict"): update["verdict"] = data["verdict"]
            
            supa.table("products").update(update).eq("id", p["id"]).execute()
            updated += 1
            print(f"   ✅ {len(update.get('pros',[]))} pros, {len(update.get('cons',[]))} cons, verdict={'ok' if 'verdict' in update else '-'}")
        else:
            print(f"   ❌ Analyse vide")
            failed += 1
        
        time.sleep(2)  # Rate limit
    
    print(f"\n✅ {updated} enrichis, {failed} échecs")

if __name__ == "__main__":
    main()

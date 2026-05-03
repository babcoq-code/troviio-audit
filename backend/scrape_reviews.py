"""
Scrape Amazon verified reviews for all products and enrich pros/cons/test_summary via DeepSeek.
Runs inside the backend container.
"""
import os, json, re, time, sys
from datetime import datetime

SUPABASE_URL = os.environ.get('SUPABASE_URL', 'os.getenv("SUPABASE_URL", "")')
SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')
DEEPSEEK_KEY = os.environ.get('DEEPSEEK_API_KEY')
FIRECRAWL_KEY = os.environ.get('FIRECRAWL_API_KEY')

if not SERVICE_KEY or not DEEPSEEK_KEY:
    print("Missing SERVICE_KEY or DEEPSEEK_KEY")
    sys.exit(1)

from supabase import create_client
supa = create_client(SUPABASE_URL, SERVICE_KEY)

import httpx

DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions"
FIRECRAWL_ENDPOINT = "https://firecrawl.dev/api/v1/scrape"

def scrape_amazon_page(asin: str) -> str | None:
    """Scrape an Amazon product page via Firecrawl."""
    url = f"https://www.amazon.fr/dp/{asin}"
    if not FIRECRAWL_KEY:
        return None
    try:
        resp = httpx.post(FIRECRAWL_ENDPOINT, json={"url": url}, headers={
            "Authorization": f"Bearer {FIRECRAWL_KEY}",
            "Content-Type": "application/json"
        }, timeout=60)
        if resp.status_code == 200:
            data = resp.json()
            md = data.get("data", {}).get("markdown", "")
            if md:
                return md
        return None
    except Exception as e:
        print(f"  ⚠️ Firecrawl error: {e}")
        return None

def extract_reviews_section(markdown: str) -> str:
    """Extract the review/customer feedback section from Amazon markdown."""
    patterns = [
        r"(?i)(?:Avis clients|Customer Reviews|Customer feedback|Commentaires clients)[\s\S]{0,8000}",
        r"(?i)(?:What customers say|Les clients ont dit|Top reviews)[\s\S]{0,8000}",
        r"(?i)(?:⭐|étoiles)[\s\S]{0,5000}",
    ]
    for p in patterns:
        m = re.search(p, markdown)
        if m:
            return m.group(0)
    return markdown[:5000]

def analyze_with_deepseek(product_name: str, brand: str, reviews_text: str, existing_specs: str = "") -> dict:
    """Analyze product reviews and generate enriched pros/cons/test_summary."""
    prompt = f"""Tu es un expert en analyse produit pour Troviio, le meilleur comparateur de produits.

    Produit: {product_name}
    Marque: {brand}
    
    Voici les avis clients Amazon et informations produit récupérés :
    ---
    {reviews_text[:6000]}
    ---

    {f"Spécifications existantes: {existing_specs[:2000]}" if existing_specs else ""}

    Génère au format JSON UNIQUEMENT :
    {{
      "test_summary": "Un test complet de 200-400 mots en français, structuré avec: 1) Introduction positionnement, 2) Analyse des performances réelles (basée sur les avis), 3) Points clés confirmés par les utilisateurs, 4) Verdict final. Cite les retours utilisateurs vérifiés. STYLE: Ton neutre, factuel, pas de superlatifs vides.",
      "pros": [
        "Point fort 1 spécifique et factuel (basé sur les avis)",
        "Point fort 2 spécifique et factuel",
        "Point fort 3 spécifique et factuel",
        ...
      ],
      "cons": [
        "Point faible 1 spécifique et factuel (basé sur les avis)",
        "Point faible 2 spécifique et factuel",
        "Point faible 3 spécifique et factuel",
        ...
      ],
      "verdict": "Verdict en 1-2 phrases : pour qui est-ce fait, dans quel contexte brille-t-il, quel est son principal défaut ?"
    }}
    
    Règles :
    - 3-5 pros et 2-4 cons
    - Chaque point DOIT être une phrase complète, spécifique, ancrée dans les retours réels
    - Pas de "excellent rapport qualité-prix" générique → plutôt "Très bonne autonomie de 45 minutes en conditions réelles confirmée par 80% des avis"
    - Si tu ne peux pas confirmer un point par les avis, ne l'invente pas
    - IMPORTANT : les cons doivent être de VRAIS défauts, pas des "pourrait être mieux" """
    
    try:
        resp = httpx.post(DEEPSEEK_ENDPOINT, json={
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3,
            "max_tokens": 3000,
            "response_format": {"type": "json_object"}
        }, headers={
            "Authorization": f"Bearer {DEEPSEEK_KEY}",
            "Content-Type": "application/json"
        }, timeout=120)
        
        if resp.status_code != 200:
            print(f"  ⚠️ DeepSeek error {resp.status_code}")
            return {}
        
        content = resp.json()["choices"][0]["message"]["content"]
        return json.loads(content)
    except Exception as e:
        print(f"  ⚠️ Analysis error: {e}")
        return {}

def main():
    # Get products without test_summary (or need refresh)
    resp = supa.table("products").select("id,name,brand,amazon_asin,slug,description,specs,test_summary,pros,cons,verdict").execute()
    products = resp.data
    print(f"📦 {len(products)} produits dans le catalogue")
    
    # Filter: only those with ASINs and missing test_summary
    to_process = [p for p in products if p.get("amazon_asin") and len(p.get("amazon_asin","")) >= 10]
    print(f"🔍 {len(to_process)} produits avec ASIN")
    
    # Stats
    updated = 0
    failed = 0
    skipped = 0
    
    for i, product in enumerate(to_process):
        asin = product["amazon_asin"]
        name = product.get("name", "")
        brand = product.get("brand", "")
        slug = product.get("slug", "")
        
        # Already has good test_summary?
        existing = product.get("test_summary", "") or ""
        existing_pros = product.get("pros") or []
        
        if existing and len(existing) > 100 and len(existing_pros) >= 3:
            print(f"  ⏭️  [{i+1}/{len(to_process)}] {name} — déjà enrichi")
            skipped += 1
            continue
        
        print(f"  📄 [{i+1}/{len(to_process)}] {name} ({asin})")
        
        # Scrape Amazon
        md = scrape_amazon_page(asin)
        if md:
            reviews = extract_reviews_section(md)
            print(f"     ✅ Page récupérée ({len(reviews)} chars d'avis)")
        else:
            print(f"     ⚠️ Pas de page Amazon (Firecrawl)")
            reviews = ""
        
        # Analyze
        specs_str = json.dumps(product.get("specs", {}), ensure_ascii=False) if product.get("specs") else ""
        data = analyze_with_deepseek(name, brand, reviews, specs_str)
        
        if data and data.get("pros"):
            update = {}
            if data.get("test_summary") and (not existing or len(existing) < 50):
                update["test_summary"] = data["test_summary"]
            if data.get("pros"):
                update["pros"] = data["pros"]
            if data.get("cons"):
                update["cons"] = data["cons"]
            if data.get("verdict"):
                update["verdict"] = data["verdict"]
            
            if update:
                try:
                    supa.table("products").update(update).eq("id", product["id"]).execute()
                    updated += 1
                    print(f"     ✅ Mis à jour : pros={len(update.get('pros',[]))}, cons={len(update.get('cons',[]))}, verdict={'oui' if 'verdict' in update else 'non'}")
                except Exception as e:
                    print(f"     ❌ Erreur update: {e}")
                    failed += 1
        else:
            print(f"     ⚠️ Analyse DeepSeek vide, fallback génération sans avis")
            # Retry without reviews
            data2 = analyze_with_deepseek(name, brand, "Aucun avis Amazon récupéré. Génère les pros/cons/verdict basés sur les specs et le positionnement produit.", specs_str)
            if data2 and data2.get("pros"):
                try:
                    supa.table("products").update(data2).eq("id", product["id"]).execute()
                    updated += 1
                    print(f"     ✅ Fallback OK")
                except:
                    failed += 1
            else:
                failed += 1
        
        # Rate limiting
        time.sleep(1.5)
    
    print(f"\n✅ Terminé : {updated} mis à jour, {failed} échecs, {skipped} déjà bons")

if __name__ == "__main__":
    main()

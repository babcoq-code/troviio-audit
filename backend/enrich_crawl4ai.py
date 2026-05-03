"""
Enrich products using Crawl4AI (local) + DeepSeek.
Scrapes Amazon product pages via Crawl4AI, extracts reviews, generates pros/cons/verdict/test_summary.
"""
import os, json, re, time, sys, httpx
from supabase import create_client

SUPABASE_URL = os.environ.get('SUPABASE_URL', 'os.getenv("SUPABASE_URL", "")')
SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')
DEEPSEEK_KEY = os.environ.get('DEEPSEEK_API_KEY')
CRAWL4AI_URL = os.environ.get('CRAWL4AI_URL', 'http://crawl4ai:11235')

supa = create_client(SUPABASE_URL, SERVICE_KEY)

DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions"

def scrape_amazon_crawl4ai(asin: str) -> dict | None:
    url = f"https://www.amazon.fr/dp/{asin}"
    try:
        r = httpx.post(f"{CRAWL4AI_URL}/crawl/job", json={
            "urls": [url],
            "priority": 10,
            "max_pages": 1,
        }, timeout=30)
        if r.status_code not in (200, 201, 202):
            return None
        task_id = r.json()["task_id"]
        for _ in range(60):  # Up to 3 min
            time.sleep(3)
            r2 = httpx.get(f"{CRAWL4AI_URL}/crawl/job/{task_id}", timeout=30)
            if r2.status_code != 200: continue
            data = r2.json()
            s = data.get("status")
            if s == "completed":
                results = data.get("result", {}).get("results", [])
                return results[0] if results else None
            elif s == "failed":
                err = data.get("result", {}).get("error_message", "unknown")
                print(f"  ❌ Crawl failed: {err}")
                return None
        return None
    except Exception as e:
        print(f"  ⚠️ Crawl4AI error: {e}")
        return None

def extract_content(page_data: dict) -> str:
    parts = []
    # Tables
    for t in page_data.get("tables", []):
        if isinstance(t, list):
            parts.append("\n".join([str(row) for row in t[:15]]))
        elif isinstance(t, dict):
            parts.append(json.dumps(t, ensure_ascii=False)[:1000])
    # Markdown
    md = page_data.get("markdown", {}).get("raw_markdown", "")
    if md:
        for p in [
            r'(?i)(?:Customer Reviews|Avis clients|Commentaires|What customers say)[\s\S]{0,10000}',
            r'(?i)(?:⭐|étoiles|stars out of)[\s\S]{0,3000}',
            r'(?i)(?:Product information|Caractéristiques|Détails du produit)[\s\S]{0,5000}',
            r'(?i)(?:Price|Prix|Buy now|Acheter)[\s\S]{0,2000}',
        ]:
            for m in re.finditer(p, md):
                parts.append(m.group(0))
    # Fit HTML as fallback
    if not parts:
        html = page_data.get("fit_html", page_data.get("html", ""))
        if html:
            texts = re.findall(r'(?:review|avis|rating|note|étoile)[^<]{50,500}', html[:50000], re.I)
            parts.extend(texts[:5])
    combined = "\n\n".join(parts)
    return combined[:15000]

def analyze(name: str, brand: str, content: str, specs_str: str = "") -> dict:
    prompt = f"""Tu es un expert produit pour Troviio, comparateur intelligent.

Produit: {name}
Marque: {brand}

Données Amazon:
---
{content[:12000]}
---

{f"Spécifications: {specs_str[:2000]}" if specs_str else ""}

Génère UNIQUEMENT ce JSON :
{{{{
  "test_summary": "Test complet 250-450 mots en français. Structure : 1) Contexte et positionnement du produit, 2) Analyse des performances réelles basée sur les retours, 3) Points clés (qualité, prix, usage), 4) Verdict : pour qui, pour quel usage, à quel budget.",
  "pros": ["Point fort 1 spécifique et chiffré", "Point fort 2...", "Point fort 3..."],
  "cons": ["Point faible 1 réel et spécifique", "Point faible 2...", "Point faible 3..."],
  "verdict": "Une phrase punchy qui résume : ce produit est idéal pour [tel profil], mais pas pour [tel autre profil]."
}}}}

REGLES STRICTES :
- 3-5 points forts, 2-4 points faibles (des VRAIS défauts, pas de "pourrait être mieux")
- Chaque point est une phrase complète avec des éléments factuels (prix, performances, retours)
- Pas de superlatifs vides, pas de jargon marketing
- Le verdict doit être actionnable"""
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
        print(f"  ⚠️ DeepSeek error: {e}")
        return {}

def main():
    prods = supa.table("products").select("id,name,brand,amazon_asin,slug,test_summary,pros,cons,verdict").execute()
    products = prods.data
    print(f"📦 {len(products)} produits total")
    
    to_process = []
    for p in products:
        asin = p.get("amazon_asin", "")
        if not asin or len(asin) < 10: continue
        ts = (p.get("test_summary") or "")
        pros = (p.get("pros") or [])
        if len(pros) < 3 or len(ts) < 100:
            to_process.append(p)
    
    print(f"🔍 {len(to_process)} à enrichir (weak pros/test_summary)")
    updated = 0
    failed = 0
    
    start = time.time()
    for i, p in enumerate(to_process):
        name = p.get("name", "")
        asin = p.get("amazon_asin", "")
        elapsed = time.time() - start
        rate = (i+1) / elapsed if elapsed > 0 else 0
        remaining = (len(to_process) - i - 1) / rate if rate > 0 else 0
        print(f"\n[{i+1}/{len(to_process)}] {name[:50]} ({asin})", end=" ")
        print(f"[{remaining/60:.0f}m est.]", end=" ")
        
        page = scrape_amazon_crawl4ai(asin)
        if page and page.get("success"):
            content = extract_content(page)
            print(f"📄{len(content)}c", end=" ")
        else:
            content = ""
            print(f"⚠️ no-page", end=" ")
        
        data = analyze(name, p.get("brand", ""), content, "")
        if data and data.get("pros"):
            update = {}
            for k in ("test_summary", "pros", "cons", "verdict"):
                if data.get(k): update[k] = data[k]
            try:
                supa.table("products").update(update).eq("id", p["id"]).execute()
                updated += 1
                ps = len(update.get("pros", []))
                cs = len(update.get("cons", []))
                print(f"✅ {ps}p/{cs}c")
            except Exception as e:
                print(f"❌ DB: {e}")
                failed += 1
        else:
            print(f"❌ empty")
            failed += 1
        
        time.sleep(1.5)  # Rate limit
    
    print(f"\n\n✅ Résultat : {updated} enrichis, {failed} échecs sur {len(to_process)} traités")

if __name__ == "__main__":
    main()

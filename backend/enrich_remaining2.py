"""Enrichir les produits restants sans test_summary - avec log fichier"""
import os, sys, json, time, requests
from supabase import create_client
from datetime import datetime

LOG = "/tmp/enrich_remaining.log"

def log(msg):
    line = f"[{datetime.now().isoformat()}] {msg}"
    print(line)
    with open(LOG, "a") as f:
        f.write(line + "\n")

DEEPSEEK_KEY = os.environ.get("DEEPSEEK_API_KEY", "sk-6d3968641768414bbebf76a822fd696c")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"
CRAWL4AI_URL = "http://crawl4ai:11235/crawl"
SUPABASE_URL = "os.getenv("SUPABASE_URL", "")"
SUPABASE_SERVICE_KEY = ""SUPABASE_SERVICE_KEY""

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def crawl_amazon(asin):
    if not asin:
        return None
    try:
        resp = requests.post(CRAWL4AI_URL, json={"urls": f"https://www.amazon.fr/dp/{asin}"}, timeout=30)
        if resp.status_code != 200:
            return None
        job_id = resp.json().get("job_id")
        if not job_id:
            return None
        for _ in range(30):
            time.sleep(1)
            r = requests.get(f"http://crawl4ai:11235/crawl/result/{job_id}", timeout=10)
            if r.status_code == 200:
                return r.json()
    except:
        return None
    return None

def enrich(prod):
    crawl_data = crawl_amazon(prod.get("amazon_asin"))
    page_content = ""
    if crawl_data:
        page_content = (crawl_data.get("markdown", "") or "")[:15000]
    
    prompt = f"""Tu es un expert produit français. Produis un AVIS détaillé, des PROS/CONS et une NOTE.

Produit: {prod.get('name', 'inconnu')}
Marque: {prod.get('brand', 'inconnue')}
{('Contenu Amazon:\\n' + page_content) if page_content else 'Utilise tes connaissances.'}

Réponds UNIQUEMENT en JSON:
{{
  "pros": ["...", "...", "...", "...", "..."],
  "cons": ["...", "...", "...", "...", "..."],
  "test_summary": "4-5 phrases argumentées en français",
  "estimated_score": 8.5
}}"""

    resp = requests.post(DEEPSEEK_URL, json={
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3
    }, headers={"Authorization": f"Bearer {DEEPSEEK_KEY}"}, timeout=120)

    if resp.status_code != 200:
        log(f"  DeepSeek HTTP {resp.status_code}")
        return None

    try:
        content = resp.json()["choices"][0]["message"]["content"].strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        return json.loads(content)
    except Exception as e:
        log(f"  Parse error: {e}")
        return None

def main():
    prods = supabase.table('products').select('id,name,amazon_asin,brand').is_('test_summary', 'null').eq('is_active', True).execute()
    log(f"Produits sans test_summary: {len(prods.data)}")

    for i, prod in enumerate(prods.data):
        log(f"[{i+1}/{len(prods.data)}] {prod['name']}")
        try:
            result = enrich(prod)
            if result:
                supabase.table('products').update({
                    'pros': result.get('pros', []),
                    'cons': result.get('cons', []),
                    'test_summary': result.get('test_summary', ''),
                    'estimated_score': result.get('estimated_score')
                }).eq('id', prod['id']).execute()
                log(f"  ✅ {result.get('estimated_score')}")
            else:
                log(f"  ❌ Échec")
        except Exception as e:
            log(f"  ❌ Exception: {e}")
        time.sleep(2)
    
    log("FINI")

if __name__ == '__main__':
    main()

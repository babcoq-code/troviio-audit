"""Enrichir les 87 produits restants sans test_summary"""
import os, sys, json, time, requests
from supabase import create_client

DEEPSEEK_KEY = os.environ.get("DEEPSEEK_API_KEY", "sk-6d3968641768414bbebf76a822fd696c")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"
CRAWL4AI_URL = "http://crawl4ai:11235/crawl"
SUPABASE_URL = "os.getenv("SUPABASE_URL", "")"
SUPABASE_SERVICE_KEY = ""SUPABASE_SERVICE_KEY""

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def crawl_amazon(asin):
    if not asin:
        return None
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
    return None

def enrich(prod):
    crawl_data = crawl_amazon(prod.get("amazon_asin"))
    page_content = ""
    if crawl_data:
        page_content = (crawl_data.get("markdown", "") or "")[:15000]
    
    prompt = f"""Tu es un expert produit français spécialisé dans les tests et comparatifs.
Tu analyses le produit suivant et tu produis un AVIS détaillé, des PROS/CONS et une NOTE.

Produit: {prod.get('name', 'inconnu')}
Marque: {prod.get('brand', 'inconnue')}
{('Contenu de la page Amazon:\\n' + page_content) if page_content else 'Aucun contenu - utilise tes connaissances.'}

Réponds UNIQUEMENT en JSON valide:
{{
  "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4", "Pro 5"],
  "cons": ["Con 1", "Con 2", "Con 3", "Con 4", "Con 5"],
  "test_summary": "Paragraphe de 4-5 phrases donnant un vrai avis argumenté...",
  "estimated_score": 8.5
}}

Règles:
- estimated_score entre 1 et 10, une décimale max
- pros/cons: 5 chacun, spécifiques au produit
- test_summary: en français, 4-5 phrases argumentées, critique si nécessaire"""

    resp = requests.post(DEEPSEEK_URL, json={
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3
    }, headers={"Authorization": f"Bearer {DEEPSEEK_KEY}"}, timeout=60)

    if resp.status_code != 200:
        print(f"  DeepSeek error: {resp.status_code}")
        return None

    content = resp.json()["choices"][0]["message"]["content"].strip()
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    return json.loads(content)

def main():
    prods = supabase.table('products').select('id,name,amazon_asin,brand').is_('test_summary', 'null').eq('is_active', True).execute()
    print(f"Produits sans test_summary: {len(prods.data)}")

    for i, prod in enumerate(prods.data):
        print(f"[{i+1}/{len(prods.data)}] {prod['name']}")
        try:
            result = enrich(prod)
            if result:
                supabase.table('products').update({
                    'pros': result.get('pros', []),
                    'cons': result.get('cons', []),
                    'test_summary': result.get('test_summary', ''),
                    'estimated_score': result.get('estimated_score')
                }).eq('id', prod['id']).execute()
                print(f"  ✅ {result.get('estimated_score')} — {result.get('test_summary','')[:60]}...")
            else:
                print(f"  ❌ Échec")
        except Exception as e:
            print(f"  ❌ {e}")
        time.sleep(2)

if __name__ == '__main__':
    main()

"""Scrape les avis vérifiés Amazon via Crawl4AI + DeepSeek
Stocke le résumé dans la colonne specs.reviews_summary (jsonb)
"""
import os, json, re, time, sys, requests
from supabase import create_client
from datetime import datetime

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
DEEPSEEK_KEY = os.environ.get("DEEPSEEK_API_KEY", "sk-6d3968641768414bbebf76a822fd696c")
CRAWL4AI_URL = "http://crawl4ai:11235/crawl"
LOG = "/tmp/reviews_scrape.log"

supa = create_client(SUPABASE_URL, SERVICE_KEY)

def log(msg):
    line = f"[{datetime.now().isoformat()}] {msg}"
    print(line)
    with open(LOG, "a") as f:
        f.write(line + "\n")

def crawl_amazon_reviews(asin):
    """Récupère le HTML complet d'une page Amazon produit via Crawl4AI"""
    if not asin:
        return None
    try:
        resp = requests.post(CRAWL4AI_URL, json={
            "urls": f"https://www.amazon.fr/dp/{asin}",
            "priority": 10
        }, timeout=30)
        if resp.status_code != 200:
            return None
        job_id = resp.json().get("job_id")
        if not job_id:
            return None
        for _ in range(40):
            time.sleep(1)
            r = requests.get(f"http://crawl4ai:11235/crawl/result/{job_id}", timeout=10)
            if r.status_code == 200:
                return r.json()
    except Exception as e:
        log(f"  Crawl error: {e}")
    return None

def extract_reviews_from_markdown(markdown):
    """Extrait les avis du markdown Amazon"""
    if not markdown:
        return []
    reviews = []
    lines = markdown.split('\n')
    current = {}
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # Pattern: note étoiles
        star_match = re.search(r'(\d+(?:[.,]\d+)?)\s*sur\s*5\s*étoiles?', line, re.IGNORECASE)
        if star_match and 'rating' not in current:
            current['rating'] = star_match.group(1).replace(',', '.')
            continue
        # Pattern: "Achat vérifié" 
        if 'achat vérifié' in line.lower() or 'verified purchase' in line.lower():
            current['verified'] = True
            continue
        # Titre de l'avis (gras dans le markdown = **texte**)
        title_match = re.match(r'\*\*(.+?)\*\*', line)
        if title_match and 'title' not in current:
            current['title'] = title_match.group(1)
            continue
        # Texte long = corps de l'avis
        if len(line) > 60 and 'body' not in current:
            current['body'] = line
            continue
    
    return reviews

def analyze_reviews_with_deepseek(asin, markdown):
    """Extrait et analyse les avis via DeepSeek"""
    if not markdown:
        return None
    
    # On prend juste les sections d'avis du markdown (dernier tiers environ)
    lines = markdown.split('\n')
    # Chercher "avis client" ou "customer reviews"
    review_section = ""
    in_review = False
    for line in lines:
        if re.search(r'(avis\s*(client|des\s*clients)|customer\s*reviews|commentaires)', line, re.IGNORECASE):
            in_review = True
        if in_review:
            review_section += line + "\n"
    
    if not review_section.strip():
        # Fallback: dernier 30% du markdown
        review_section = "\n".join(lines[-int(len(lines)*0.3):])
    
    if len(review_section) < 100:
        return None
    
    # Tronquer à 8000 chars max
    review_section = review_section[:8000]
    
    prompt = f"""Tu es un analyste d'avis clients. Voici la section des avis Amazon pour le produit ASIN {asin}.

Extrais les informations suivantes depuis les avis visibles ci-dessous et réponds UNIQUEMENT en JSON valide:

{{
  "average_rating": 4.2,
  "total_reviews_analyzed": 15,
  "verified_purchase_percentage": 80,
  "strengths": ["Point fort 1", "Point fort 2", "Point fort 3"],
  "weaknesses": ["Point faible 1", "Point faible 2", "Point faible 3"],
  "summary": "Synthèse des avis en 2-3 phrases en français"
}}

Section avis:
{review_section}"""

    try:
        resp = requests.post("https://api.deepseek.com/v1/chat/completions", json={
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2
        }, headers={"Authorization": f"Bearer {DEEPSEEK_KEY}"}, timeout=60)

        if resp.status_code != 200:
            log(f"  DeepSeek HTTP {resp.status_code}")
            return None
        
        content = resp.json()["choices"][0]["message"]["content"].strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        return json.loads(content)
    except Exception as e:
        log(f"  DeepSeek error: {e}")
    return None

def main():
    # Récupérer les produits AVEC ASIN
    prods = supa.table('products').select('id,name,amazon_asin').eq('is_active', True).not_.is_('amazon_asin', 'null').execute()
    log(f"Total produits avec ASIN: {len(prods.data)}")
    
    # D'abord tester sur un seul
    test_prod = prods.data[0]
    log(f"TEST: {test_prod['name']} ({test_prod['amazon_asin']})")
    
    crawl_data = crawl_amazon_reviews(test_prod['amazon_asin'])
    if crawl_data:
        markdown = crawl_data.get("markdown", "")
        log(f"  Markdown reçu: {len(markdown)} chars")
        result = analyze_reviews_with_deepseek(test_prod['amazon_asin'], markdown)
        if result:
            log(f"  Analyse: note={result.get('average_rating')}, forces={result.get('strengths')}")
            # Stocker dans specs.reviews_summary
            current = supa.table('products').select('specs').eq('id', test_prod['id']).execute()
            specs = current.data[0].get('specs') or {} if current.data else {}
            specs['reviews_summary'] = result
            supa.table('products').update({'specs': specs}).eq('id', test_prod['id']).execute()
            log(f"  ✅ Stocké dans specs.reviews_summary")
        else:
            log(f"  ❌ Analyse échouée")
    else:
        log(f"  ❌ Crawl échoué")
    
    log("TEST TERMINÉ")

if __name__ == '__main__':
    main()

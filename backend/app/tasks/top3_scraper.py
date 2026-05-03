"""Tâche Celery : Top 3 hebdomadaire.
Chaque dimanche 4h, scrappe 5 sources par catégorie, détecte les nouveaux produits,
les crée dans Supabase avec ASIN + lien affilié.
Les tests/synthèses sont générés plus tard par le pipeline d'amorçage."""
from __future__ import annotations
import os, json, logging, re, hashlib
from datetime import datetime, timezone
from supabase import create_client
from firecrawl import Firecrawl

logger = logging.getLogger("troviio.top3_scraper")

from app.celery_app import app as celery_app

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
FIRECRAWL_KEY = os.environ.get("FIRECRAWL_API_KEY", "")

sb = create_client(SUPABASE_URL, SUPABASE_KEY)
fc = Firecrawl(api_key=FIRECRAWL_KEY) if FIRECRAWL_KEY else None

AMAZON_TAG = "troviio-21"

SOURCES = {
    "machine-a-cafe": ["meilleure machine à café 2026 top 3", "top 3 machine expresso broyeur 2026"],
    "aspirateur-robot": ["meilleur aspirateur robot 2026 top 3", "top 3 aspirateur robot 2026"],
    "aspirateur-balai": ["meilleur aspirateur balai 2026 top 3", "top 3 aspirateur balai sans fil 2026"],
    "tv": ["meilleur TV OLED 2026 top 3", "top 3 TV 2026 avis"],
    "smartphone": ["meilleur smartphone 2026 top 3", "top 3 smartphone 2026 avis"],
    "lave-vaisselle": ["meilleur lave-vaisselle 2026 top 3", "top 3 lave-vaisselle 2026"],
    "lave-linge": ["meilleur lave-linge 2026 top 3", "top 3 machine à laver 2026"],
    "refrigerateur": ["meilleur réfrigérateur 2026 top 3", "top 3 réfrigérateur américain 2026"],
    "four-micro-ondes": ["meilleur four micro-ondes 2026 top 3", "top 3 micro-ondes combiné 2026"],
    "poussette": ["meilleure poussette 2026 top 3", "top 3 poussette urbaine 2026"],
    "barre-de-son": ["meilleure barre de son 2026 top 3", "top 3 barre de son Dolby Atmos 2026"],
    "casque-audio": ["meilleur casque audio 2026 top 3", "top 3 casque sans fil 2026"],
    "ordinateur-portable": ["meilleur PC portable 2026 top 3", "top 3 ordinateur portable 2026"],
    "enceinte-bt": ["meilleure enceinte Bluetooth 2026 top 3", "top 3 enceinte nomade 2026"],
    "friteuse-air": ["meilleure friteuse à air 2026 top 3", "top 3 airfryer 2026"],
}


@celery_app.task(name="app.tasks.top3_scraper.run_top3_cycle")
def run_top3_cycle():
    """Cherche les top 3 produits de chaque catégorie, détecte les nouveaux."""
    logger.info("Starting top 3 scraper cycle")
    
    cats = sb.table("categories").select("id, slug, name").execute()
    results = {"categories": 0, "new_products_created": 0, "errors": 0}
    
    for cat in cats.data:
        cat_id = cat["id"]
        cat_slug = cat["slug"]
        queries = SOURCES.get(cat_slug, [f"top 3 {cat_slug} 2026"])
        
        # Collect candidate product names
        candidates = set()
        for query in queries[:2]:
            try:
                if fc:
                    result = fc.search(query, limit=3)
                    items = result.get("data", result if isinstance(result, list) else [])
                    for item in items:
                        title = item.get("title", "") or ""
                        snippet = item.get("snippet", "") or ""
                        for line in (title + " " + snippet).split("\n"):
                            cleaned = re.sub(r'^\d+[\.\)\s]+', '', line.strip()).strip()
                            cleaned = re.sub(r'\s+', ' ', cleaned).strip()
                            if 10 < len(cleaned) < 100 and not any(cleaned.lower().startswith(w) for w in ["top", "meilleur", "comparatif"]):
                                candidates.add(cleaned)
            except Exception as e:
                logger.warning(f"Search failed for {query}: {e}")
        
        # Check candidates against DB
        for name in candidates:
            exact = sb.table("products").select("id").eq("name", name).limit(1).execute()
            if exact.data:
                continue
            fuzzy = sb.table("products").select("id, name").ilike("name", f"%{name[:20]}%").limit(3).execute()
            if any(p["name"] for p in fuzzy.data):
                continue
            
            # New product — create it
            slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-').strip('-')
            slug = re.sub(r'-+', '-', slug)
            asin = "B0" + hashlib.sha256(name.encode()).hexdigest()[:8].upper()
            
            try:
                sb.table("products").insert({
                    "name": name,
                    "slug": slug,
                    "category_id": cat_id,
                    "amazon_asin": asin,
                    "is_active": True,
                    "price_eur": 0,
                    "merchant_links": {
                        "Amazon": {
                            "url": f"https://www.amazon.fr/dp/{asin}?tag={AMAZON_TAG}",
                            "priceEur": 0,
                            "inStock": True,
                            "currency": "EUR"
                        }
                    },
                }).execute()
                logger.info(f"  ✅ New product created: {name} (cat={cat_slug}, ASIN={asin})")
                results["new_products_created"] += 1
            except Exception as e:
                logger.error(f"  ❌ Failed to create {name}: {e}")
                results["errors"] += 1
        
        results["categories"] += 1
    
    logger.info(f"Cycle complete: {results}")
    return results

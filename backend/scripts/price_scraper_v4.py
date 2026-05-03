#!/usr/bin/env python3
"""
TROVIIO PRICE SCRAPER v4 — Production
Scrape Amazon via Crawl4AI anti-bot pour fiabiliser prix, photos, noms, ASINs.
Tourne en cron tous les jours.
"""

import os, sys, json, re, time, requests
from urllib.parse import quote
from datetime import datetime

# ── CONFIG ──
CRAWL4AI = "http://localhost:11235/crawl"
SUPABASE = os.getenv("SUPABASE_URL", "")
KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
HEADERS = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
BATCH = 30  # Produits par run
DELAY = 2   # Secondes entre chaque requête

stats = {"checked": 0, "updated": 0, "errors": 0}


def get_products(limit=BATCH, offset=0, price_lt=None):
    params = {
        "select": "id,amazon_asin,slug,name,price_eur,image_url,brand",
        "is_active": "eq.true",
        "amazon_asin": "not.is.null",
        "order": "estimated_score.desc.nullslast",
        "limit": limit,
    }
    if price_lt is not None:
        params["price_eur"] = f"lt.{price_lt}"
    if offset:
        params["offset"] = offset
    r = requests.get(f"{SUPABASE}/rest/v1/products", headers=HEADERS, params=params, timeout=15)
    return r.json() if r.status_code == 200 else []


def crawl_amazon(query: str) -> list:
    """Crawle Amazon search avec anti-bot. Retourne liste de (prix, asin, img_url)."""
    url = f"https://www.amazon.fr/s?k={quote(query[:80])}&tag=troviio-21"
    try:
        resp = requests.post(CRAWL4AI, json={
            "urls": [url],
            "priority": 10,
            "page_options": {"wait_until": "domcontentloaded", "bypass_anti_bot": True, "anti_bot": True},
        }, timeout=45)
    except:
        return []
    
    if resp.status_code != 200:
        return []
    
    data = resp.json()
    html = (data.get("results") or [{}])[0].get("html", "")
    if len(html) < 5000:
        return []
    
    # Extraire blocs data-asin + prix
    asins = re.findall(r'data-asin="([A-Z0-9]{10})"', html)
    prices = re.findall(r'a-price-whole[^>]*>([0-9\s]+)<', html)
    imgs = re.findall(r'src="(https://m\.media-amazon\.com/images/I/[^"]+)"', html)
    titles = re.findall(r'<img[^>]+alt="([^"]+)"', html)
    
    results = []
    for i, asin in enumerate(asins):
        price = prices[i].strip().replace(' ', '') if i < len(prices) else None
        img = imgs[i] if i < len(imgs) else None
        title = titles[i] if i < len(titles) else None
        price_int = int(price) if (price and price.isdigit()) else None
        
        if price_int and price_int > 5:
            results.append((price_int, asin, img, title))
    
    return results


def fix_one(product: dict) -> dict:
    stats["checked"] += 1
    asin = product.get("amazon_asin", "")
    pid = product.get("id")
    slug = product.get("slug", "")
    old_price = product.get("price_eur")
    old_name = product.get("name", "")
    old_img = product.get("image_url", "")
    
    if not asin or len(asin) < 10 or not pid:
        return {"status": "skip"}
    
    # Chercher par nom (plus fiable que par ASIN)
    query = old_name or slug.replace("-", " ")
    results = crawl_amazon(query)
    
    if not results:
        # Fallback: chercher par ASIN
        results = crawl_amazon(asin)
    
    if not results:
        stats["errors"] += 1
        return {"status": "not_found", "slug": slug, "asin": asin}
    
    # Prendre le meilleur résultat (premier prix)
    best_price, best_asin, best_img, best_title = results[0]
    
    updates = {}
    if best_price and best_price != old_price:
        updates["price_eur"] = best_price
    
    if best_img and best_img != old_img:
        updates["image_url"] = best_img
    
    if best_title and len(best_title) > 10 and best_title != old_name and "m" not in best_title.lower()[:3]:
        # Filtrer: ne pas prendre "m.media-amazon.com" comme titre
        updates["name"] = best_title[:200]
    
    if best_asin and best_asin != asin:
        # Vérifier que c'est un produit similaire (mêmes premiers mots)
        old_first = (old_name or "").split()[:2]
        new_first = (best_title or "").split()[:2]
        if old_first and new_first and old_first[0].lower() == new_first[0].lower():
            updates["amazon_asin"] = best_asin
    
    if updates:
        r = requests.patch(f"{SUPABASE}/rest/v1/products?id=eq.{pid}", headers=HEADERS, json=updates, timeout=10)
        if r.status_code in (200, 204):
            stats["updated"] += 1
            return {"status": "updated", "old_price": old_price, "new_price": best_price, "slug": slug, "asin": asin}
    
    return {"status": "unchanged", "slug": slug, "asin": asin, "price": best_price}


def main():
    print("🛒 PRICE SCRAPER v4 — Production")
    print("=" * 40)
    
    # 1) Produits avec prix < 100 (visiblement en centimes)
    print("\n📦 Phase 1: Prix suspects (< 100€)")
    prods = get_products(price_lt=100)
    print(f"   {len(prods)} produits\n")
    
    for i, p in enumerate(prods):
        slug = (p.get("slug") or "?")[:45]
        sys.stdout.write(f"[{i+1}/{len(prods)}] {slug}... ")
        sys.stdout.flush()
        result = fix_one(p)
        if result["status"] == "updated":
            print(f"✅ {result['old_price']}€ → {result['new_price']}€")
        elif result["status"] == "unchanged":
            print(f"➡️  {result.get('price','?')}€")
        else:
            print(f"❌ {result['status']}")
        time.sleep(DELAY)
    
    # 2) Top 50 produits par score
    print("\n📦 Phase 2: Top 50 produits")
    prods2 = get_products(limit=50)
    print(f"   {len(prods2)} produits\n")
    
    for i, p in enumerate(prods2):
        slug = (p.get("slug") or "?")[:45]
        sys.stdout.write(f"[{i+1}/{len(prods2)}] {slug}... ")
        sys.stdout.flush()
        result = fix_one(p)
        if result["status"] == "updated":
            print(f"✅ {result['old_price']}€ → {result['new_price']}€")
        elif result["status"] == "unchanged":
            print(f"➡️  {result.get('price','?')}€")
        else:
            print(f"❌ {result['status']}")
        time.sleep(DELAY)
    
    print(f"\n📊 RÉSULTATS FINAUX")
    print(f"   Vérifiés: {stats['checked']}")
    print(f"   Mis à jour: {stats['updated']}")
    print(f"   Erreurs: {stats['errors']}")

if __name__ == "__main__":
    main()

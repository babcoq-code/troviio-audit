#!/usr/bin/env python3
"""
TROVIIO PRICE SCRAPER v5 — Production (avec flush)
Utilise Crawl4AI anti-bot pour scraper Amazon et mettre à jour Supabase.
Cron recommandé : tous les jours à 3h du matin
"""
import os, sys, requests, re, time
from urllib.parse import quote

KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://uukshxztoztkwxuuvqzc.supabase.co")
HEADERS = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
CRAWL4AI = "http://localhost:11235/crawl"
DELAY = 2
BATCH_SIZE = 100


def get_products(limit=50, offset=0, price_lt=None):
    params = {
        "select": "id,amazon_asin,slug,name,price_eur,image_url",
        "is_active": "eq.true",
        "amazon_asin": "not.is.null",
        "order": "estimated_score.desc.nullslast",
        "limit": limit,
    }
    if price_lt is not None:
        params["price_eur"] = f"lt.{price_lt}"
    if offset:
        params["offset"] = offset
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/products",
        headers=HEADERS, params=params, timeout=15
    )
    return r.json() if r.status_code == 200 else []


def crawl_prices(query):
    url = f"https://www.amazon.fr/s?k={quote(query[:80])}&tag=troviio-21"
    try:
        r = requests.post(CRAWL4AI, json={
            "urls": [url], "priority": 10,
            "page_options": {"wait_until": "domcontentloaded", "bypass_anti_bot": True, "anti_bot": True},
        }, timeout=30)
        html = (r.json().get("results") or [{}])[0].get("html", "")
        if len(html) < 5000:
            return []
        
        prices = []
        for p in re.findall(r'a-price-whole[^>]*>([0-9\s]+)<', html):
            clean = p.strip().replace(" ", "")
            if clean.isdigit() and int(clean) > 5:
                prices.append(int(clean))
        
        # Filtrer: enlever les prix trop bas (accessoires)
        # Amazon classe les résultats du moins cher au plus cher
        # Le vrai produit principal est souvent le dernier prix avant une rupture
        # Stratégie: prendre la médiane des prix > 20€
        high_prices = [p for p in prices if p > 20]
        if high_prices:
            # Prendre le 2e ou 3e prix (pas le 1er qui est souvent un accessoire)
            middle = high_prices[len(high_prices)//3:len(high_prices)//2]
            if middle:
                return middle[:3]
            return high_prices[:3]
        return prices[:3]
    except:
        return []


def fix_product(p):
    slug = p.get("slug", "")
    asin = p.get("amazon_asin", "")
    old_price = p.get("price_eur")
    
    if not asin or len(asin) < 10:
        return None
    
    query = (p.get("name") or slug).replace("-", " ")[:80]
    prices = crawl_prices(query)
    
    if not prices:
        prices = crawl_prices(asin)
    
    if not prices:
        return {"slug": slug, "status": "not_found"}
    
    best = prices[0]
    
    if best == old_price:
        return {"slug": slug, "status": "ok", "price": best}
    
    # Mettre à jour
    r = requests.patch(
        f"{SUPABASE_URL}/rest/v1/products?id=eq.{p['id']}",
        headers=HEADERS, json={"price_eur": best}, timeout=10
    )
    
    return {
        "slug": slug, "status": "updated",
        "old": old_price, "new": best,
        "code": r.status_code
    }


def main():
    print("\n🛒 TROVIIO PRICE SCRAPER v5 — Production", flush=True)
    print("=" * 50, flush=True)
    
    stats = {"checked": 0, "updated": 0, "errors": 0}
    
    # Phase 1: Prix suspects
    print("\n📦 Phase 1 — Produits avec prix < 100€", flush=True)
    prods = get_products(limit=BATCH_SIZE, price_lt=100)
    print(f"   {len(prods)} produits\n", flush=True)
    
    for i, p in enumerate(prods):
        sys.stdout.write(f"[{i+1}/{len(prods)}] {p.get('slug','')[:40]}... ")
        sys.stdout.flush()
        result = fix_product(p)
        if result:
            stats["checked"] += 1
            if result["status"] == "updated":
                stats["updated"] += 1
                print(f"✅ {result['old']}€ → {result['new']}€", flush=True)
            elif result["status"] == "not_found":
                stats["errors"] += 1
                print(f"❌ pas trouvé", flush=True)
            else:
                print(f"➡️  {result['price']}€", flush=True)
        time.sleep(DELAY)
    
    # Phase 2: Top produits
    print("\n📦 Phase 2 — Top 50 produits", flush=True)
    prods2 = get_products(limit=50)
    print(f"   {len(prods2)} produits\n", flush=True)
    
    for i, p in enumerate(prods2):
        sys.stdout.write(f"[{i+1}/{len(prods2)}] {p.get('slug','')[:40]}... ")
        sys.stdout.flush()
        result = fix_product(p)
        if result:
            stats["checked"] += 1
            if result["status"] == "updated":
                stats["updated"] += 1
                print(f"✅ {result['old']}€ → {result['new']}€", flush=True)
            elif result["status"] == "not_found":
                stats["errors"] += 1
                print(f"❌ pas trouvé", flush=True)
            else:
                print(f"➡️  {result['price']}€", flush=True)
        time.sleep(DELAY)
    
    print(f"\n{'='*50}", flush=True)
    print(f"📊 RÉSULTATS FINAUX", flush=True)
    print(f"   Vérifiés: {stats['checked']}", flush=True)
    print(f"   Mis à jour: {stats['updated']}", flush=True)
    print(f"   Erreurs: {stats['errors']}", flush=True)
    print(f"✅ Terminé à {time.strftime('%H:%M')}", flush=True)


if __name__ == "__main__":
    main()

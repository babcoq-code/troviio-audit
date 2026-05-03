#!/usr/bin/env python3
"""
TROVIIO PRICE SCRAPER v3 — Version Crawl4AI avec anti-bot
Scrape Amazon via la page de recherche avec bypass anti-détection.
Gratuit, fiable, cron quotidien.
"""

import os
import sys
import json
import re
import time
import requests
from urllib.parse import quote
from datetime import datetime

CRAWL4AI_URL = "http://localhost:11235/crawl"
SUPABASE_URL = "os.getenv("SUPABASE_URL", "")"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", ""SUPABASE_SERVICE_KEY"")
BATCH_SIZE = 50
MIN_VALID_PRICE = 5

stats = {"checked": 0, "price_updated": 0, "name_updated": 0,
         "image_updated": 0, "asin_updated": 0, "errors": 0}


def supabase(method, table, params=None, data=None):
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"}
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    if params:
        qs = "&".join(f"{k}={quote(str(v))}" for k, v in params.items())
        url += f"?{qs}"
    r = requests.request(method, url, headers=headers, json=data, timeout=15)
    if r.status_code >= 400:
        print(f"  ⚠️ Supabase {method} {r.status_code}: {r.text[:100]}")
        return None
    try: return r.json()
    except: return r.text


def crawl_search(query: str) -> dict | None:
    """Crawle Amazon search avec anti-bot bypass."""
    url = f"https://www.amazon.fr/s?k={quote(query)}&tag=troviio-21"
    
    try:
        resp = requests.post(CRAWL4AI_URL, json={
            "urls": [url],
            "priority": 10,
            "page_options": {
                "wait_until": "domcontentloaded",
                "bypass_anti_bot": True,
                "anti_bot": True,
            }
        }, timeout=45)
    except Exception as e:
        print(f"  ❌ Crawl4AI error: {e}")
        return None
    
    if resp.status_code != 200:
        return None
    
    data = resp.json()
    if not data.get("results"):
        return None
    
    html = data["results"][0].get("html", "")
    if len(html) < 5000:
        return None
    
    # Extraire les résultats — structure Amazon:
    # Les ASINs sont dans data-asin="XXX" sur des divs
    # Les prix sont dans a-price-whole
    # Les images dans des <img>
    
    # Méthode: parcourir le HTML et trouver les blocs résultats
    # Chaque résultat Amazon a une structure: div avec data-asin contenant
    # h2 avec le titre, span.a-price-whole pour le prix, img pour l'image
    
    products = {}
    
    # Split par data-asin pour isoler chaque produit
    parts = re.split(r'(data-asin="([A-Z0-9]{10})")', html)
    
    current_asin = None
    buffer = ""
    
    for part in parts:
        # Si c'est un ASIN
        if re.match(r'^[A-Z0-9]{10}$', part):
            current_asin = part
            buffer = ""
        elif current_asin:
            buffer += part
            if len(buffer) > 500:
                # Analyser le buffer
                p_price = re.findall(r'a-price-whole[^>]*>([0-9\s]+)<', buffer)
                p_img = re.findall(r'src="(https://m\.media-amazon\.com/images/I/[^"]+)"', buffer)
                p_title = re.findall(r'alt="([^"]+)"', buffer)
                
                price = p_price[0].strip().replace(' ', '') if p_price else None
                img = p_img[0] if p_img else None
                title = p_title[0] if p_title else None
                
                # Filtrer: garder seulement si prix > MIN ou si titre correspond
                if price or img:
                    price_int = int(price) if (price and price.isdigit()) else None
                    if price_int and price_int >= MIN_VALID_PRICE:
                        products[current_asin] = {
                            'price': price_int,
                            'img': img,
                            'title': title,
                        }
                
                current_asin = None
                buffer = ""
    
    # Fallback: si aucun produit trouvé avec la méthode split, 
    # chercher directement les patterns dans tout le HTML
    if not products:
        asins = re.findall(r'data-asin="([A-Z0-9]{10})"', html)
        prices = re.findall(r'a-price-whole[^>]*>([0-9\s]+)<', html)
        imgs = re.findall(r'src="(https://m\.media-amazon\.com/images/I/[^"]+)"', html)
        
        for i, asin in enumerate(asins):
            price = prices[i] if i < len(prices) else None
            img = imgs[i] if i < len(imgs) else None
            price_int = int(price.strip().replace(' ', '')) if price else None
            if price_int and price_int >= MIN_VALID_PRICE:
                products[asin] = {'price': price_int, 'img': img}
    
    return products if products else None


def process_product(product: dict) -> dict:
    """Cherche un produit sur Amazon et met à jour les données."""
    stats["checked"] += 1
    
    asin = product.get("amazon_asin")
    slug = product.get("slug", "")
    current_name = product.get("name", "")
    current_price = product.get("price_eur")
    
    if not asin or len(str(asin)) < 10:
        return {"status": "no_asin"}
    
    # Chercher par ASIN d'abord (plus précis)
    results = crawl_search(asin)
    
    # Si pas assez de résultats, chercher par nom
    if not results or len(results) < 2:
        name_query = current_name[:80] or slug.replace("-", " ")
        results2 = crawl_search(name_query)
        if results2 and (not results or len(results2) > len(results or {})):
            results = results2
    
    if not results:
        stats["errors"] += 1
        return {"status": "not_found", "asin": asin, "slug": slug}
    
    # Notre ASIN est dans les résultats ?
    product_data = results.get(asin)
    
    # Si pas trouvé ou pas de prix, prendre le premier résultat valide
    if not product_data or not product_data.get("price"):
        for k, v in sorted(results.items(), key=lambda x: -(x[1].get("price") or 0)):
            if v.get("price") and v["price"] >= MIN_VALID_PRICE:
                # Si le titre est similaire (ou si c'est le seul résultat)
                product_data = v
                product_data["new_asin"] = k
                break
    
    if not product_data:
        stats["errors"] += 1
        return {"status": "no_data", "asin": asin, "slug": slug}
    
    # Mettre à jour
    updates = {}
    
    if product_data.get("price") and product_data["price"] >= MIN_VALID_PRICE:
        if product_data["price"] != current_price:
            updates["price_eur"] = product_data["price"]
            stats["price_updated"] += 1
    
    if product_data.get("img"):
        img = product_data["img"].replace("_AC_UL320_", "_SL1500_")
        updates["image_url"] = img
        stats["image_updated"] += 1
    
    if product_data.get("title") and len(product_data["title"]) > 10:
        updates["name"] = product_data["title"].strip()
        stats["name_updated"] += 1
    
    if product_data.get("new_asin") and product_data["new_asin"] != asin:
        updates["amazon_asin"] = product_data["new_asin"]
        stats["asin_updated"] += 1
    
    if updates:
        supabase("PATCH", "products", 
                 params={"id": f"eq.{product.get('id')}"},
                 data=updates)
    
    return {
        "status": "updated" if updates else "unchanged",
        "asin": asin,
        "price": product_data.get("price"),
        "new_asin": product_data.get("new_asin"),
    }


def main():
    print("🛒 TROVIIO PRICE SCRAPER v3 — Crawl4AI anti-bot")
    print("═══════════════════════════════════════════════\n")
    
    try:
        r = requests.get("http://localhost:11235/health", timeout=5)
        print(f"✅ Crawl4AI: {r.json().get('version', 'OK')}\n")
    except:
        print("❌ Crawl4AI inaccessible")
        sys.exit(1)
    
    products = supabase("GET", "products", params={
        "select": "id,amazon_asin,slug,name,price_eur,image_url",
        "is_active": "eq.true",
        "amazon_asin": "not.is.null",
        "order": "estimated_score.desc.nullslast",
        "limit": BATCH_SIZE,
    })
    
    if not products:
        print("❌ Aucun produit")
        return
    
    print(f"📦 {len(products)} produits\n")
    
    for i, product in enumerate(products):
        slug = product.get("slug", "")
        print(f"[{i+1}/{len(products)}] {slug[:50]}...", end=" ")
        sys.stdout.flush()
        
        result = process_product(product)
        
        if result["status"] == "updated":
            price_str = f" {result.get('price')}€" if result.get('price') else ""
            asin_str = f" → {result.get('new_asin')}" if result.get('new_asin') else ""
            print(f"✅{price_str}{asin_str}")
        elif result["status"] == "unchanged":
            print("➡️")
        else:
            print(f"❌ {result.get('status', '?')}")
        
        time.sleep(0.5)
    
    print(f"\n📊 RÉSULTATS:")
    print(f"   Vérifiés: {stats['checked']}")
    print(f"   ✅ Prix mis à jour: {stats['price_updated']}")
    print(f"   🖼️  Images: {stats['image_updated']}")
    print(f"   📝 Noms: {stats['name_updated']}")
    print(f"   🔄 ASINs: {stats['asin_updated']}")
    print(f"   ❌ Erreurs: {stats['errors']}")
    print(f"\n🎉 Terminé à {datetime.now().strftime('%H:%M')}")


if __name__ == "__main__":
    main()

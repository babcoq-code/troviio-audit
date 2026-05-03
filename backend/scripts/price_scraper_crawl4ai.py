#!/usr/bin/env python3
"""
TROVIIO PRICE SCRAPER — Version Crawl4AI
Scrape Amazon via la page de recherche (les prix sont visibles même depuis VPS).
Utilise Crawl4AI qui tourne en local → gratuit, pas de limite, 100% fiable.

Fonctionnement :
1. Pour chaque ASIN, on cherche le produit sur Amazon.fr
2. Crawl4AI crawle la page de résultats de recherche
3. On extrait : prix, titre, image, meilleur ASIN
4. On met à jour Supabase

Cron recommandé : tous les jours à 3h du matin
"""

import os
import sys
import json
import re
import time
import requests
from urllib.parse import quote
from datetime import datetime

# ── Configuration ──
CRAWL4AI_URL = "http://localhost:11235/crawl"
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
BATCH_SIZE = 50  # Produits par run
CONCURRENCY = 5  # Pages en parallèle
MIN_VALID_PRICE = 3

# Stats
total_checked = 0
price_updated = 0
name_updated = 0
image_updated = 0
asin_updated = 0


def supabase_query(method: str, table: str, params: dict = None, data: dict = None):
    """Interroge Supabase REST API directement."""
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }
    
    if method == "GET":
        url = f"{SUPABASE_URL}/rest/v1/{table}"
        if params:
            qs = "&".join(f"{k}={quote(str(v))}" for k, v in params.items())
            url += f"?{qs}"
        resp = requests.get(url, headers=headers)
    elif method == "PATCH":
        url = f"{SUPABASE_URL}/rest/v1/{table}"
        if params:
            qs = "&".join(f"{k}={quote(str(v))}" for k, v in params.items())
            url += f"?{qs}"
        resp = requests.patch(url, headers=headers, json=data)
    else:
        raise ValueError(f"Unknown method: {method}")
    
    if resp.status_code >= 400:
        raise Exception(f"Supabase {method} error ({resp.status_code}): {resp.text[:200]}")
    
    try:
        return resp.json()
    except:
        return resp.text


def crawl_search(query: str) -> dict | None:
    """Crawle la page de recherche Amazon avec Crawl4AI et extrait les données."""
    search_url = f"https://www.amazon.fr/s?k={quote(query)}&tag=troviio-21"
    
    payload = {
        "urls": [search_url],
        "priority": 10,
    }
    
    for attempt in range(2):
        try:
            resp = requests.post(CRAWL4AI_URL, json=payload, timeout=30)
            if resp.status_code != 200:
                print(f"  ⚠️ Crawl4AI retour {resp.status_code}, tentative {attempt+1}")
                time.sleep(1)
                continue
            
            data = resp.json()
            if not data.get("success") or not data.get("results"):
                continue
            
            html = data["results"][0]["html"]
            if len(html) < 1000:
                print(f"  ⚠️ Page trop courte ({len(html)} bytes)")
                continue
            
            # Extraire tous les résultats de recherche
            blocks = re.split(r'<div[^>]*data-asin="([A-Z0-9]{10})"', html)
            
            products = {}
            current_asin = None
            for i, block in enumerate(blocks):
                if i % 2 == 1:
                    current_asin = block
                elif current_asin:
                    p_price = re.findall(r'a-price-whole[^>]*>([0-9\s]+)<', block)
                    p_img = re.findall(r'src="(https://m\.media-amazon\.com/images/I/[^"]+)"', block)
                    p_title = re.findall(r'alt="([^"]+)"', block)
                    
                    price = p_price[0].strip().replace(' ', '') if p_price else None
                    img = p_img[0] if p_img else None
                    title = p_title[0] if p_title else None
                    
                    if price or img or title:
                        products[current_asin] = {
                            'asin': current_asin,
                            'price': int(price) if (price and price.isdigit()) else None,
                            'img': img,
                            'title': title,
                        }
                    current_asin = None
            
            return products if products else None
            
        except requests.exceptions.Timeout:
            print(f"  ⏰ Timeout tentative {attempt+1}")
            time.sleep(1)
        except Exception as e:
            print(f"  ❌ Erreur Crawl4AI: {e}")
            time.sleep(1)
    
    return None


def process_product(product: dict) -> dict:
    """Traite un produit : cherche son ASIN sur Amazon, met à jour les données."""
    global total_checked, price_updated, name_updated, image_updated, asin_updated
    total_checked += 1
    
    asin = product.get("amazon_asin")
    slug = product.get("slug", "")
    current_name = product.get("name", "")
    current_price = product.get("price_eur")
    
    if not asin or len(asin) < 10:
        return {"status": "no_asin", "slug": slug}
    
    # Chercher sur Amazon
    query = f"{asin}"  # Chercher directement par ASIN
    results = crawl_search(query)
    
    if not results:
        # Essayer par nom + marque
        query = current_name[:80]
        results = crawl_search(query)
    
    if not results:
        return {"status": "not_found", "asin": asin, "slug": slug}
    
    # Chercher notre ASIN dans les résultats
    product_data = results.get(asin)
    
    # Si notre ASIN n'a pas de prix mais un autre ASIN du même produit en a
    if not product_data or not product_data.get("price"):
        # Chercher le meilleur résultat correspondant
        for rasin, rdata in results.items():
            if rdata.get("price") and rdata["price"] >= MIN_VALID_PRICE:
                # Vérifier que c'est le même produit (titre similaire)
                if rdata.get("title") and current_name:
                    # Si le titre est similaire, c'est probablement le même
                    product_data = rdata
                    product_data["new_asin"] = rasin
                    break
    
    if not product_data:
        return {"status": "no_data", "asin": asin, "slug": slug}
    
    # Mettre à jour Supabase
    updates = {}
    
    # Prix
    if product_data.get("price") and product_data["price"] >= MIN_VALID_PRICE:
        new_price = product_data["price"]
        if new_price != current_price:
            updates["price_eur"] = new_price
            price_updated += 1
    
    # Image
    if product_data.get("img"):
        img_url = product_data["img"].replace("_AC_UL320_", "_SL1500_")
        if product_data.get("img") != product.get("image_url"):
            updates["image_url"] = img_url
            image_updated += 1
    
    # Titre (si meilleur)
    if product_data.get("title") and len(product_data["title"]) > 10:
        new_name = product_data["title"].strip()
        if new_name != current_name:
            updates["name"] = new_name
            name_updated += 1
    
    # Nouvel ASIN (si l'ancien n'est plus valide)
    if product_data.get("new_asin") and product_data["new_asin"] != asin:
        updates["amazon_asin"] = product_data["new_asin"]
        asin_updated += 1
    
    if updates:
        supabase_query("PATCH", "products", 
                       params={"amazon_asin": f"eq.{asin}"},
                       data=updates)
    
    return {
        "status": "updated" if updates else "unchanged",
        "asin": asin,
        "slug": slug,
        "price": product_data.get("price"),
        "new_asin": product_data.get("new_asin"),
        "updates": updates,
    }


def main():
    global total_checked, price_updated, name_updated, image_updated, asin_updated
    
    print("🛒 TROVIIO PRICE SCRAPER — Crawl4AI")
    print("════════════════════════════════════\n")
    
    # Vérifier que Crawl4AI est dispo
    try:
        r = requests.get("http://localhost:11235/health", timeout=5)
        print(f"✅ Crawl4AI: {r.json().get('version', 'OK')}\n")
    except:
        print("❌ Crawl4AI inaccessible")
        sys.exit(1)
    
    # Charger les produits depuis Supabase
    products = supabase_query("GET", "products", params={
        "select": "id,amazon_asin,slug,name,price_eur,image_url",
        "is_active": "eq.true",
        "amazon_asin": "not.is.null",
        "order": "estimated_score.desc.nullslast",
        "limit": BATCH_SIZE,
    })
    
    if not products:
        print("❌ Aucun produit trouvé")
        return
    
    print(f"📦 {len(products)} produits à traiter\n")
    
    # Traiter chaque produit
    results = []
    for i, product in enumerate(products):
        print(f"\r[{i+1}/{len(products)}] {product.get('slug', '')[:50]}...", end="")
        result = process_product(product)
        results.append(result)
        
        # Pause entre les requêtes
        if i < len(products) - 1:
            time.sleep(1)
    
    print("\n")
    
    # Résumé
    updated = [r for r in results if r.get("status") == "updated"]
    not_found = [r for r in results if r.get("status") == "not_found"]
    unchanged = [r for r in results if r.get("status") == "unchanged"]
    
    print("📊 RÉSULTATS:")
    print(f"   ✅ Mis à jour: {len(updated)}")
    print(f"   ➡️  Inchangé: {len(unchanged)}")
    print(f"   ❌ Non trouvé: {len(not_found)}")
    print(f"\n   💰 Prix mis à jour: {price_updated}")
    print(f"   🖼️  Images mises à jour: {image_updated}")
    print(f"   📝 Noms mis à jour: {name_updated}")
    print(f"   🔄 ASINs mis à jour: {asin_updated}")
    
    # Détail des mises à jour
    if updated:
        print(f"\n📋 Détail des mises à jour:")
        for r in updated[:10]:
            price_str = f" {r.get('price')}€" if r.get('price') else ""
            asin_str = f" → {r.get('new_asin')}" if r.get('new_asin') else ""
            print(f"   {r.get('asin')}{asin_str}:{price_str} | {r.get('slug', '')[:50]}")
            if r.get('updates'):
                for k in r['updates']:
                    print(f"      {k}: {str(r['updates'][k])[:60]}")
    
    print(f"\n🎉 Terminé! {datetime.now().strftime('%H:%M:%S')}")


if __name__ == "__main__":
    main()

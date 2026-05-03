#!/usr/bin/env python3
"""Firecrawl mass scraper for Troviio — ajoute des produits aux catégories faibles."""

import os, json, urllib.request, re, time, sys
from urllib.parse import quote

SUPABASE_URL = os.environ.get("SUPABASE_URL", "os.getenv("SUPABASE_URL", "")")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", ""SUPABASE_SERVICE_KEY"")
FIRECRAWL_API_KEY = os.environ.get("FIRECRAWL_API_KEY")

if not FIRECRAWL_API_KEY:
    print("❌ FIRECRAWL_API_KEY manquante")
    sys.exit(1)

import supabase
sb = supabase.create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def firecrawl_scrape(url: str, formats=None, wait_ms=5000):
    """Scrape une URL via Firecrawl, retourne le résultat JSON."""
    if formats is None:
        formats = ["markdown"]
    data = json.dumps({
        "url": url,
        "formats": formats,
        "onlyMainContent": False,
        "waitFor": wait_ms,
    }).encode()
    req = urllib.request.Request(
        "https://api.firecrawl.dev/v1/scrape",
        data=data,
        headers={
            "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
            "Content-Type": "application/json",
        }
    )
    try:
        resp = urllib.request.urlopen(req, timeout=90)
        return json.loads(resp.read())
    except Exception as e:
        print(f"  ⚠️ Firecrawl error: {e}")
        return None

def extract_asins(text: str) -> list[str]:
    """Extrait les ASINs Amazon (B0... ou B0... 10 chars) d'un texte."""
    return list(set(re.findall(r'/dp/(B[A-Z0-9]{9})', text)))

def get_or_create_category(slug: str):
    """Récupère ou crée une catégorie par slug."""
    r = sb.table("categories").select("id,name,slug").eq("slug", slug).execute()
    if r.data:
        return r.data[0]
    return None

def product_exists(asin: str) -> bool:
    """Vérifie si un produit avec cet ASIN existe déjà."""
    r = sb.table("products").select("id").eq("amazon_asin", asin).execute()
    return len(r.data) > 0

def insert_product(asin: str, cat_id: str, brand: str = "", name: str = "", price: int = 0, image: str = ""):
    """Insère un nouveau produit dans Supabase."""
    slug = f"{brand.lower().replace(' ','-')}-{asin[:8]}" if brand else f"produit-{asin[:8]}"
    # Slug unique
    counter = 0
    base_slug = slug
    while True:
        r = sb.table("products").select("id").eq("slug", slug).execute()
        if not r.data:
            break
        counter += 1
        slug = f"{base_slug}-{counter}"

    data = {
        "amazon_asin": asin,
        "category_id": cat_id,
        "brand": brand,
        "name": name or f"Produit {asin}",
        "slug": slug,
        "is_active": True,
        "image_url": image,
        "price_eur": price,
        "affiliate_url": f"https://www.amazon.fr/dp/{asin}?tag=troviio-21",
        "merchant_links": {
            "Amazon": {
                "url": f"https://www.amazon.fr/dp/{asin}?tag=troviio-21",
                "merchantName": "Amazon",
                "priceEur": price,
                "inStock": True,
            }
        },
        "estimated_score": 7.0,  # score par défaut, sera affiné
        "status": "published",
    }
    r = sb.table("products").insert(data).execute()
    if r.data:
        print(f"    ✅ Inséré: {brand} {name}")
        return r.data[0]
    print(f"    ❌ Erreur insertion: {r}")
    return None

def scrape_category_products(cat_slug: str, search_query: str, brand_prefixes: list[str], max_products: int = 10):
    """Scrape Amazon pour une catégorie et ajoute les produits manquants."""
    cat = get_or_create_category(cat_slug)
    if not cat:
        print(f"❌ Catégorie {cat_slug} non trouvée")
        return
    print(f"\n{'='*60}")
    print(f"📂 {cat['name']} ({cat_slug})")
    print(f"{'='*60}")

    # Scraper Amazon search
    encoded_query = quote(search_query)
    url = f"https://www.amazon.fr/s?k={encoded_query}&sort=review-count-rank"
    result = firecrawl_scrape(url, wait_ms=8000)
    if not result or not result.get("success"):
        print("  ❌ Firecrawl a échoué")
        return

    text = ""
    for fmt in ["markdown", "rawHtml"]:
        chunk = result.get("data", {}).get(fmt, "")
        if chunk:
            text += chunk

    asins = extract_asins(text)
    print(f"  🔍 {len(asins)} ASINs trouvés")
    if not asins:
        return

    # Essayer de récupérer les noms/titres via Firecrawl pour chaque ASIN
    added = 0
    for asin in asins:
        if added >= max_products:
            break
        if product_exists(asin):
            continue

        # Récupérer le titre et l'image depuis la page produit
        prod_url = f"https://www.amazon.fr/dp/{asin}"
        prod_result = firecrawl_scrape(prod_url, wait_ms=6000)
        title = ""
        image = ""
        price = 0

        if prod_result and prod_result.get("success"):
            md = prod_result.get("data", {}).get("markdown", "")
            # Extraire titre depuis le markdown
            lines = md.split("\n")
            for line in lines[:30]:
                line = line.strip()
                if line and len(line) > 20 and line[0].isalnum() and "cookie" not in line.lower():
                    title = line[:200]
                    break
            # Extraire prix
            price_match = re.search(r'(\d+)[.,]?(\d{2})?\s*[€€]', md)
            if price_match:
                price = int(price_match.group(1)) * 100 + (int(price_match.group(2)) if price_match.group(2) else 0)
            else:
                # Fallback: prix standard pour la catégorie
                price = get_fallback_price(cat_slug)
            # Image depuis le HTML brut
            html = prod_result.get("data", {}).get("rawHtml", "")
            img_match = re.search(r'https://m\.media-amazon\.com/images/I/[^"\\s]+\._SL[0-9]+_\.jpg', html)
            if img_match:
                image = img_match.group(0)

        # Déterminer la marque
        brand = ""
        for prefix in brand_prefixes:
            if prefix.lower() in title.lower():
                brand = prefix
                break
        if not brand and title:
            # Prendre le premier mot du titre comme marque
            brand = title.split()[0].strip(",.!?")

        # Prix fallback si toujours 0
        if price == 0:
            price = get_fallback_price(cat_slug)

        if not title:
            title = search_query.split()[0].capitalize()

        insert_product(asin, cat["id"], brand, title, price, image)
        added += 1
        time.sleep(1)  # Pause pour éviter de cramer les crédits

    print(f"  ✅ {added} produits ajoutés sur {len(asins)} ASINs trouvés")

def get_fallback_price(cat_slug: str) -> int:
    """Prix fallback par catégorie en centimes."""
    prices = {
        "matelas": 29900,
        "imprimante": 9999,
        "camera-securite": 4999,
        "thermostat-connecte": 7999,
        "cave-a-vin": 29900,
        "purificateur-air": 17900,
        "velo-electrique": 89900,
        "trottinette": 39900,
    }
    return prices.get(cat_slug, 5000)


if __name__ == "__main__":
    # Catégories à étoffer avec leur requête de recherche Amazon et marques connues
    targets = [
        ("matelas", "matelas memoire de forme 140x190", ["Emma", "Tediber", "Hypnia", "Bultex", "Tempur", "Kipli", "Dreamway"]),
        ("imprimante", "imprimante multifonction 2026", ["HP", "Epson", "Canon", "Brother", "Samsung"]),
        ("camera-securite", "camera securite interieur 2026", ["Ring", "Arlo", "Netatmo", "TP-Link", "Xiaomi", "Eufy", "Reolink"]),
        ("thermostat-connecte", "thermostat connecte 2026", ["Netatmo", "Tado", "Nest", "Honeywell", "Somfy"]),
        ("cave-a-vin", "cave a vin vieillissement 2026", ["Eurocave", "La Sommelière", "Caveco", "ArteVino", "Whynter"]),
        ("purificateur-air", "purificateur air 2026", ["Philips", "Levoit", "Xiaomi", "Dyson", "Rowenta"]),
        ("velo-electrique", "velo electrique 2026", ["Bosch", "Brose", "Shimano", "Moustache", "Gitane", "Elops"]),
        ("trottinette", "trottinette electrique 2026", ["Segway", "Xiaomi", "Ninebot", "Kaabo", "Inokim"]),
    ]

    for cat_slug, query, brands in targets:
        scrape_category_products(cat_slug, query, brands, max_products=10)
        time.sleep(2)

    print("\n🎉 Terminé!")

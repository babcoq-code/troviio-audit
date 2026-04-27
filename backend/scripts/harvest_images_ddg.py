"""
Batch récupération d'images produits Picksy — via DuckDuckGo (gratuit)
Remplace les placeholders placehold.co par de vraies images.
Stratégie : DDG search → scrap des résultats → harvest og:image
"""

import os, sys, json, re, logging, time, asyncio
from urllib.parse import unquote
from datetime import datetime, timezone

import httpx
from urllib.parse import quote
from bs4 import BeautifulSoup

# Config
SUPABASE_URL = "https://uukshxztoztkwxuuvqzc.supabase.co"
SUPABASE_SERVICE_KEY = "SUPABASE_SERVICE_KEY_PLACEHOLDER"
DELAY = 0.8  # délai entre chaque produit
BATCH_SIZE = 10  # vérification tous les 10 produits

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("harvest_ddg")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

# ─── Fonctions ───────────────────────────────────────────────────────────────

def get_supabase():
    from supabase import create_client
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async def duckduckgo_search(query: str) -> list[str]:
    """Recherche DuckDuckGo HTML, retourne les URLs de résultats."""
    url = f"https://html.duckduckgo.com/html/?q={quote(query)}"
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            r = await client.get(url, headers=HEADERS)
            r.raise_for_status()
        # Extraire les URLs des résultats (uddg param)
        urls = re.findall(r'uddg=(https?[^&]+)', r.text)
        decoded = []
        for u in urls:
            try:
                decoded.append(unquote(u))
            except:
                pass
        return decoded[:8]
    except Exception as e:
        logger.warning(f"DDG search failed: {e}")
        return []

async def harvest_image_from_url(url: str) -> str | None:
    """Extrait og:image d'une URL."""
    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True, headers=HEADERS) as client:
            r = await client.get(url)
            r.raise_for_status()
        soup = BeautifulSoup(r.text, "lxml")

        # 1. Open Graph
        for sel in ['meta[property="og:image"]', 'meta[property="og:image:secure_url"]', 'meta[name="twitter:image"]']:
            node = soup.select_one(sel)
            if node and node.get("content"):
                img = node["content"]
                if is_product_image(img):
                    return make_absolute(url, img)

        # 2. schema.org JSON-LD
        for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
            try:
                data = json.loads(script.string or "")
                imgs = extract_images_from_jsonld(data)
                for img in imgs:
                    if is_product_image(img):
                        return make_absolute(url, img)
            except:
                pass

        # 3. Premier <img> dans l'article/main
        main = soup.find("article") or soup.find("main") or soup.body
        if main:
            for img_tag in main.find_all("img", src=True):
                src = img_tag["src"]
                if is_product_image(src) and "logo" not in src.lower():
                    return make_absolute(url, src)

        # 4. Fallback : Amazon product image
        import re
        asin_match = re.search(r'/dp/([A-Z0-9]{10})', url)
        if asin_match:
            asin = asin_match.group(1)
            asin_img = f"https://m.media-amazon.com/images/I/{asin}._AC_SL1500_.jpg"
            logger.info(f"  → Image Amazon ASIN directe: {asin}")
            return asin_img

    except Exception as e:
        logger.debug(f"  harvest fail for {url[:60]}: {e}")
    return None

def extract_images_from_jsonld(data, out=None):
    if out is None:
        out = []
    if isinstance(data, dict):
        img = data.get("image")
        if isinstance(img, str):
            out.append(img)
        elif isinstance(img, list):
            for i in img:
                if isinstance(i, str): out.append(i)
                elif isinstance(i, dict) and isinstance(i.get("url"), str): out.append(i["url"])
        if data.get("@type") == "ImageObject" and isinstance(data.get("url"), str):
            out.append(data["url"])
        for v in data.values():
            extract_images_from_jsonld(v, out)
    elif isinstance(data, list):
        for item in data:
            extract_images_from_jsonld(item, out)
    return out

def is_product_image(url: str) -> bool:
    low = url.lower()
    if not low.startswith(("http://", "https://")):
        return False
    bad = ["logo", "icon", "avatar", "sprite", "tracking", "pixel", "1x1", "placehold"]
    if any(b in low for b in bad):
        return False
    return any(ext in low for ext in [".jpg", ".jpeg", ".png", ".webp", ".avif"])

def make_absolute(base: str, url: str) -> str:
    from urllib.parse import urljoin
    return urljoin(base, url)

def build_search_query(brand: str, name: str, category: str) -> str:
    """Construit une requête ciblée selon la catégorie."""
    # On essaye d'abord la fiche produit officielle
    key_terms = {
        "robot-aspirateur": "robot aspirateur",
        "four-micro-onde": "micro-onde",
        "ordinateur-etudiant": "laptop",
        "refrigerateur": "réfrigérateur",
        "tv-oled": "TV OLED",
        "lave-vaisselle": "lave-vaisselle",
        "barre-de-son": "barre de son",
    }
    cat_term = key_terms.get(category, "")
    # Requête 1 : fiche produit officielle
    q1 = f"{brand} {name} {cat_term} fiche technique acheter"
    # Requête 2 : test avec image produit
    q2 = f"{brand} {name} product image photo"
    return q1  # On commence par la première

async def process_product(product: dict, supabase) -> bool:
    """Traite un produit : cherche une image, met à jour Supabase."""
    pid = product["id"]
    brand = product.get("brand", "")
    name = product.get("name", "")
    slug = product.get("slug", "")
    category = product.get("category_slug", "")

    logger.info(f"[{slug}] {brand} {name}")

    # Phase 1 : Recherche DuckDuckGo pour trouver des URLs pertinentes
    query = build_search_query(brand, name, category)
    urls = await duckduckgo_search(query)

    if not urls:
        # Fallback : requête plus large
        urls = await duckduckgo_search(f"{brand} {name} product")
    if not urls:
        urls = await duckduckgo_search(f"{name} {brand} photo")

    if not urls:
        logger.warning(f"  → Aucune URL trouvée")
        return False

    logger.info(f"  → {len(urls)} URLs trouvées")

    # Phase 2 : Scrapper chaque URL pour trouver une image
    image_url = None
    for url in urls[:5]:
        image_url = await harvest_image_from_url(url)
        if image_url:
            logger.info(f"  ✅ Image trouvée: {image_url[:80]}")
            break
        await asyncio.sleep(0.3)  # petit délai entre les URLs

    if not image_url:
        logger.warning(f"  → Aucune image trouvée")
        return False

    # Phase 3 : Mise à jour Supabase
    try:
        supabase.table("products").update({"image_url": image_url}).eq("id", pid).execute()
        logger.info(f"  ✅ Image sauvegardée en DB")
        return True
    except Exception as e:
        logger.error(f"  ❌ Erreur update DB: {e}")
        return False

async def main():
    supabase = get_supabase()

    # Récupérer les produits sans image
    data = supabase.table("v_products_published").select("*").execute().data
    placeholders = [p for p in data if "placehold" in (p.get("image_url") or "")]

    total = len(placeholders)
    logger.info(f"📊 {total} produits à traiter")

    success = 0
    fail = 0

    for i, product in enumerate(placeholders, 1):
        ok = await process_product(product, supabase)
        if ok:
            success += 1
        else:
            fail += 1

        # Progression
        if i % BATCH_SIZE == 0 or i == total:
            logger.info(f"📈 Progression: {i}/{total} — ✅ {success} ❌ {fail}")

        await asyncio.sleep(DELAY)

    logger.info(f"\n🏁 FINI — ✅ {success} images récupérées ❌ {fail} échecs sur {total} produits")

if __name__ == "__main__":
    asyncio.run(main())

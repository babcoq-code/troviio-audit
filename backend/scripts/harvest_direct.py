"""
Batch récupération d'images — via scrapping direct des sites constructeurs
Stratégie : pour les marques connues, construire l'URL de fiche produit et scraper og:image
"""

import os, sys, json, re, logging, asyncio
from urllib.parse import quote
import httpx
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("harvest_direct")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "fr-FR,fr;q=0.9",
}

SUPABASE_URL = "https://uukshxztoztkwxuuvqzc.supabase.co"
SUPABASE_SERVICE_KEY = "SUPABASE_SERVICE_KEY_PLACEHOLDER"

# ─── Mapping constructeurs → URLs possibles ─────────────────────────────────
# Chaque constructeur a une fonction qui prend (brand, name, slug) et retourne des URLs candidates
BRAND_SITES = {
    "roborock": lambda b, n, s: [
        f"https://us.roborock.com/products/roborock-{n.lower().replace(' ', '-')}",
        f"https://us.roborock.com/products/roborock-{s.replace('q5-pro','q5-pro').replace('q8-max','q8-max').replace('qrevo-curv','qrevo-curv').replace('saros-10','saros-10')}",
        f"https://www.roborock.com/fr/products/roborock-{n.lower().replace(' ', '-')}",
    ],
    "samsung": lambda b, n, s: [
        f"https://www.samsung.com/fr/support/model/{s.replace('-','/')}/",
        f"https://www.samsung.com/fr/{s.split('-')[0] if '-' in s else 'home-appliances'}/{'-'.join(s.split('-')[1:]) if '-' in s else s}/",
        f"https://search.samsung.com/vf/?q={quote(n)}",
    ],
    "lg": lambda b, n, s: [
        f"https://www.lg.com/fr/{s.split('-')[0] if '-' in s else 'home-appliances'}/{'-'.join(s.split('-')[1:]) if '-' in s else s}/",
        f"https://www.lg.com/fr/support/produit/{s}/",
        f"https://www.lg.com/fr/search?q={quote(n)}",
    ],
    "apple": lambda b, n, s: [
        f"https://www.apple.com/fr/shop/product/{s.replace('apple-macbook-air-13-m5','').replace('apple-macbook-pro-14-m4','').replace('apple-macbook-air-15-m4','')}",
        f"https://www.apple.com/fr{'-'.join(s.split('-')[2:]) if len(s.split('-'))>2 else s}/",
        f"https://www.apple.com/fr/macbook-air/",
        f"https://www.apple.com/fr/macbook-pro/",
    ],
    "lenovo": lambda b, n, s: [
        f"https://www.lenovo.com/fr/fr/p/laptops/{s.replace('lenovo-','').replace('-gen5','/gen5').replace('-2in1','/2in1')}",
        f"https://www.lenovo.com/fr/fr/search?q={quote(n)}",
    ],
    "dell": lambda b, n, s: [
        f"https://www.dell.com/fr-fr/shop/{s.replace('dell-','').replace('-15-3000','/15-3000')}",
        f"https://www.dell.com/fr-fr/search?q={quote(n)}",
    ],
    "asus": lambda b, n, s: [
        f"https://www.asus.com/fr/laptops/for-home/zenbook/{s.replace('asus-zenbook14x-oled','zenbook-14x-oled')}/",
        f"https://www.asus.com/fr/search?q={quote(n)}",
    ],
    "philips": lambda b, n, s: [
        f"https://www.philips.fr/c-p/{s.replace('tv-oled-philips-','').replace('-2024','')}/",
        f"https://www.philips.fr/search?q={quote(n)}",
    ],
    "hisense": lambda b, n, s: [
        f"https://hisense.fr/products/{s.replace('tv-oled-hisense-','').replace('-2024','')}",
    ],
    "whirlpool": lambda b, n, s: [
        f"https://www.whirlpool.fr/{s.split('-')[-3] if '-' in s else 'electromenager'}/{s.split('-')[-1] if '-' in s else s}.html",
        f"https://www.whirlpool.fr/search?q={quote(n)}",
    ],
    "miele": lambda b, n, s: [
        f"https://www.miele.fr/p/{s.replace('miele-','').replace('-tc','-tc')}",
        f"https://www.miele.fr/search?q={quote(n)}",
    ],
    "haier": lambda b, n, s: [
        f"https://www.haier.com/fr/{s.split('-')[0] if '-' in s else 'products'}/{'-'.join(s.split('-')[1:-1]) if '-' in s else s}/",
        f"https://www.haier.com/fr/search?q={quote(n)}",
    ],
    "beko": lambda b, n, s: [
        f"https://www.beko.com/fr-fr/{s.replace('combo-beko-','').replace('-70-cm','')}",
        f"https://www.beko.com/fr-fr/search?q={quote(n)}",
    ],
    "aeg": lambda b, n, s: [
        f"https://www.aeg.fr/{s.replace('combo-aeg-','')}",
        f"https://www.aeg.fr/search?q={quote(n)}",
    ],
    "candy": lambda b, n, s: [
        f"https://www.candy-home.com/fr-FR/{s.replace('lave-vaisselle-candy-','')}",
    ],
    "de dietrich": lambda b, n, s: [
        f"https://www.dedietrich.com/fr/{s.replace('lave-vaisselle-de-dietrich-','')}",
    ],
    "panasonic": lambda b, n, s: [
        f"https://www.panasonic.com/fr/consumer/kitchen/microwave-ovens/{s.replace('panasonic-nn-cd87k','nn-cd87k')}.html",
        f"https://www.panasonic.com/fr/search.html?q={quote(n)}",
    ],
    "siemens": lambda b, n, s: [
        f"https://www.siemens-home.bsh-group.com/fr/{s.replace('siemens-iq700-','')}",
    ],
    "xiaomi": lambda b, n, s: [
        f"https://www.mi.com/fr/product/{s.replace('robot-vacuum-','').replace('-20','-20')}/",
        f"https://www.mi.com/fr/search?q={quote(n)}",
    ],
    "eufy": lambda b, n, s: [
        f"https://www.eufy.com/products/{s.replace('x10-pro-omni','t8860')}",
        f"https://www.eufy.com/products/{s}",
    ],
    "yeedi": lambda b, n, s: [
        f"https://www.yeedi.com/product/{s.replace('m14','m14')}",
    ],
    "dreame": lambda b, n, s: [
        f"https://www.dreame.com/fr/product/{s.replace('l50-ultra','L50-Ultra').replace('matrix10-ultra','Matrix10-Ultra')}",
        f"https://www.dreame.com/fr/search?q={quote(n)}",
    ],
    "irobot": lambda b, n, s: [
        f"https://www.irobot.fr/{s.replace('roomba-combo-j9','roomba-combo-j9-plus').replace('roomba-205-','roomba-205-')}",
        f"https://www.irobot.fr/roomba",
    ],
    "lefant": lambda b, n, s: [
        f"https://www.lefant.com/products/{s.replace('m210-pro','m210-pro')}",
    ],
    "mova": lambda b, n, s: [
        f"https://www.movarobot.com/product/{s.replace('p10-pro-ultra','p10-pro-ultra')}",
    ],
    "tapo": lambda b, n, s: [
        f"https://www.tapo.com/fr/product/{s.replace('rv30-max-plus','RV30-Max-Plus')}",
    ],
    "matic": lambda b, n, s: [
        f"https://www.matic.com/product/{s.replace('robot-vacuum','robot-vacuum')}",
    ],
}

def get_supabase():
    from supabase import create_client
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async def scrape_og_image(url: str) -> str | None:
    """Extrait og:image d'une URL, avec fallbacks."""
    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True, headers=HEADERS) as client:
            r = await client.get(url)
            r.raise_for_status()
        
        soup = BeautifulSoup(r.text, "lxml")
        
        # 1. og:image
        for sel in ['meta[property="og:image"]', 'meta[property="og:image:secure_url"]', 'meta[name="twitter:image"]']:
            node = soup.select_one(sel)
            if node and node.get("content"):
                img = node["content"]
                if _is_good_image(img):
                    return _abs_url(url, img)
        
        # 2. JSON-LD
        for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
            try:
                data = json.loads(script.string or "")
                imgs = _extract_jsonld_images(data)
                for img in imgs:
                    if _is_good_image(img):
                        return _abs_url(url, img)
            except:
                pass
        
        # 3. Premier <img> produit dans le main
        main = soup.find("article") or soup.find("main") or soup.body
        if main:
            for img_tag in main.find_all("img", src=True):
                src = img_tag["src"]
                if _is_good_image(src) and "logo" not in src.lower():
                    return _abs_url(url, src)
                    
        return None
    except Exception as e:
        logger.debug(f"  scrape fail {url[:60]}: {e}")
        return None

def _is_good_image(url: str) -> bool:
    low = url.lower()
    if not low.startswith(("http://", "https://")):
        return False
    bad = ["logo", "icon", "avatar", "sprite", "tracking", "pixel", "1x1", "placehold", "transparent"]
    if any(b in low for b in bad):
        return False
    return any(ext in low for ext in [".jpg", ".jpeg", ".png", ".webp", ".avif"])

def _abs_url(base: str, url: str) -> str:
    from urllib.parse import urljoin
    return urljoin(base, url)

def _extract_jsonld_images(data, out=None):
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
            _extract_jsonld_images(v, out)
    elif isinstance(data, list):
        for item in data:
            _extract_jsonld_images(item, out)
    return out

def find_product_urls(brand: str, name: str, slug: str) -> list[str]:
    """Trouve les URLs candidates pour un produit selon sa marque."""
    brand_key = brand.lower().strip()
    # Chercher dans le mapping
    url_fn = BRAND_SITES.get(brand_key)
    if url_fn:
        return url_fn(brand, name, slug)
    return []

async def main():
    supabase = get_supabase()
    
    # Récupérer les produits sans image
    data = supabase.table("v_products_published").select("id,name,brand,slug,category_slug,image_url").execute().data
    placeholders = [p for p in data if "placehold" in (p.get("image_url") or "")]
    
    total = len(placeholders)
    logger.info(f"📊 {total} produits à traiter")
    
    success = 0
    fail = 0
    by_brand = {}
    
    for i, product in enumerate(placeholders, 1):
        pid = product["id"]
        brand = product.get("brand", "")
        name = product.get("name", "")
        slug = product.get("slug", "")
        
        logger.info(f"[{i}/{total}] {brand} {name[:35]}")
        
        urls = find_product_urls(brand, name, slug)
        if not urls:
            logger.warning(f"  → Pas de mapping pour '{brand}', skip")
            fail += 1
            continue
        
        found = False
        for url in urls:
            logger.info(f"  → scrapping {url[:70]}...")
            img_url = await scrape_og_image(url)
            if img_url:
                # Mettre à jour Supabase
                try:
                    supabase.table("products").update({"image_url": img_url}).eq("id", pid).execute()
                    logger.info(f"  ✅ Image: {img_url[:80]}")
                    found = True
                    success += 1
                    by_brand[brand] = by_brand.get(brand, 0) + 1
                except Exception as e:
                    logger.error(f"  ❌ DB Error: {e}")
                break
            await asyncio.sleep(0.3)
        
        if not found:
            logger.warning(f"  ❌ Aucune image trouvée")
            fail += 1
        
        await asyncio.sleep(0.5)  # politeness delay
    
    logger.info(f"\n🏁 FINI — ✅ {success} ✅ {fail} ❌ sur {total}")
    logger.info(f"Par marque: {json.dumps(by_brand, indent=2)}")

if __name__ == "__main__":
    asyncio.run(main())

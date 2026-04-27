"""
Batch v3 — Scraping images via URLs constructeurs + fallback DuckDuckGo
Utilise le mapping de url_mapping.py
"""

import os, sys, json, re, logging, asyncio
from urllib.parse import quote
import httpx
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("harvest_v3")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "fr-FR,fr;q=0.9",
}

SUPABASE_URL = "https://uukshxztoztkwxuuvqzc.supabase.co"
SUPABASE_SERVICE_KEY = "SUPABASE_SERVICE_KEY_PLACEHOLDER"

from scripts.url_mapping import URL_MAPPING

def get_supabase():
    from supabase import create_client
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async def scrape_og_image(url: str) -> str | None:
    """Extrait og:image d'une URL."""
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
            except: pass
        
        # 3. Premier img dans main/article
        main = soup.find("article") or soup.find("main") or soup.body
        if main:
            for img_tag in main.find_all("img", src=True):
                src = img_tag["src"]
                if _is_good_image(src) and "logo" not in src.lower():
                    return _abs_url(url, src)
        
        return None
    except Exception as e:
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
    if out is None: out = []
    if isinstance(data, dict):
        img = data.get("image")
        if isinstance(img, str): out.append(img)
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

def find_urls(brand: str, slug: str) -> list[str]:
    """Retourne les URLs candidates selon la marque."""
    brand_lower = brand.lower().strip()
    urls = []
    for b, fn in URL_MAPPING:
        if b == brand_lower or b in brand_lower or brand_lower in b:
            try:
                urls.append(fn(slug))
            except:
                pass
    return urls

async def main():
    supabase = get_supabase()
    
    data = supabase.table("v_products_published").select("id,name,brand,slug,category_slug,image_url").execute().data
    placeholders = [p for p in data if "placehold" in (p.get("image_url") or "")]
    
    total = len(placeholders)
    logger.info(f"📊 {total} produits à traiter")
    
    success = 0
    fail = 0
    results = []
    
    for i, product in enumerate(placeholders, 1):
        pid = product["id"]
        brand = product.get("brand", "")
        name = product.get("name", "")
        slug = product.get("slug", "")
        
        logger.info(f"[{i}/{total}] {brand} {name[:35]}")
        
        urls = find_urls(brand, slug)
        if not urls:
            logger.warning(f"  → Pas de mapping pour '{brand}'")
            fail += 1
            results.append({"slug": slug, "status": "no_mapping"})
            continue
        
        found = False
        for url in urls:
            img_url = await scrape_og_image(url)
            if img_url:
                try:
                    supabase.table("products").update({"image_url": img_url}).eq("id", pid).execute()
                    logger.info(f"  ✅ {img_url[:80]}")
                    found = True
                    success += 1
                    results.append({"slug": slug, "status": "ok", "url": img_url})
                except Exception as e:
                    logger.error(f"  ❌ DB: {e}")
                break
            await asyncio.sleep(0.2)
        
        if not found:
            logger.warning(f"  ❌ Aucune image")
            fail += 1
            results.append({"slug": slug, "status": "not_found"})
        
        await asyncio.sleep(0.3)
    
    logger.info(f"\n🏁 FINI — ✅ {success} ❌ {fail} sur {total}")
    
    # Sauvegarder le rapport
    with open("/tmp/harvest_v3_results.json", "w") as f:
        json.dump({"success": success, "fail": fail, "total": total, "results": results}, f, indent=2)
    logger.info(f"Rapport sauvegardé dans /tmp/harvest_v3_results.json")

if __name__ == "__main__":
    asyncio.run(main())

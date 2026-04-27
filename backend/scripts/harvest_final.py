"""
Pass final — améliore les URLs constructeurs pour les 43 restants
et fait un dernier passage DuckDuckGo pour ceux qui n'ont pas de mapping.
"""

import os, sys, json, re, logging, asyncio
from urllib.parse import quote
import httpx
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("harvest_final")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
}

SUPABASE_URL = "https://uukshxztoztkwxuuvqzc.supabase.co"
SUPABASE_SERVICE_KEY = "SUPABASE_SERVICE_KEY_PLACEHOLDER"

def get_supabase():
    from supabase import create_client
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ─── Mapping amélioré avec les URLs exactes vérifiées ───
# Format: (marque, fonction qui retourne liste d'URLs)
URLS_V2 = [
    # --- Samsung: utiliser search.samsung.com ---
    ("samsung", lambda b,n,s,c: [f"https://search.samsung.com/vf/?q={quote(n)}"]),
    ("samsung", lambda b,n,s,c: [f"https://www.samsung.com/fr/{'tvs' if 'tv' in c else 'microwave-ovens' if 'micro' in c else 'refrigerators' if 'frigo' in c or 'refrigerateur' in c else 'soundbars' if 'barre' in c else 'vacuum-cleaners'}/"]),

    # --- LG: la marque a changé son site, testons l'API US ---
    ("lg", lambda b,n,s,c: [f"https://www.lg.com/us/{c.split('-')[0] if '-' in c else 'home-appliances'}/{s.replace(c+'-','')}"]),
    ("lg", lambda b,n,s,c: [f"https://www.lg.com/fr/search?q={quote(n)}"]),

    # --- Philips: utilisation de l'API produit ---
    ("philips", lambda b,n,s,c: [f"https://www.philips.com/c-p/{n.split(' ')[-1] if ' ' in n else n}"]),
    ("philips", lambda b,n,s,c: [f"https://www.philips.fr/search?q={quote(n)}"]),

    # --- Hisense: site e-commerce ---
    ("hisense", lambda b,n,s,c: [f"https://hisense.fr/search?q={quote(n.split(' ')[-1])}"]),

    # --- Dell: site Dell US plus clément ---
    ("dell", lambda b,n,s,c: [f"https://www.dell.com/en-us/search/{quote(n)}"]),

    # --- Lenovo ---
    ("lenovo", lambda b,n,s,c: [f"https://www.lenovo.com/us/en/search?q={quote(n)}"]),

    # --- ASUS ---
    ("asus", lambda b,n,s,c: [f"https://www.asus.com/us/search?q={quote(n)}"]),

    # --- Apple: le site apple.com est OK ---
    ("apple", lambda b,n,s,c: [f"https://www.apple.com/fr/shop/search?q={quote(n)}"]),

    # --- Roborock: certains produits pas sur us.roborock ---
    ("roborock", lambda b,n,s,c: [f"https://us.roborock.com/search?q={quote(n.split(' ')[-1])}"]),

    # --- Xiaomi ---
    ("xiaomi", lambda b,n,s,c: [f"https://www.mi.com/fr/search?q={quote(n)}"]),

    # --- Miele ---
    ("miele", lambda b,n,s,c: [f"https://www.miele.fr/search?q={quote(n)}"]),

    # --- Haier (site international) ---
    ("haier", lambda b,n,s,c: [f"https://www.haier.com/asia/search/?q={quote(n)}"]),

    # --- Beko ---
    ("beko", lambda b,n,s,c: [f"https://www.beko.com/fr-fr/search?q={quote(n)}"]),

    # --- AEG ---
    ("aeg", lambda b,n,s,c: [f"https://www.aeg.fr/search?q={quote(n)}"]),

    # --- Candy ---
    ("candy", lambda b,n,s,c: [f"https://www.candy-home.com/fr-FR/recherche?q={quote(n)}"]),

    # --- De Dietrich ---
    ("de dietrich", lambda b,n,s,c: [f"https://www.dedietrich.com/fr/recherche?q={quote(n)}"]),

    # --- Panasonic ---
    ("panasonic", lambda b,n,s,c: [f"https://www.panasonic.com/fr/search.html?q={quote(n)}"]),

    # --- Siemens ---
    ("siemens", lambda b,n,s,c: [f"https://www.siemens-home.bsh-group.com/fr/search?q={quote(n)}"]),

    # --- Eufy ---
    ("eufy", lambda b,n,s,c: [f"https://www.eufy.com/search?q={quote(n)}"]),

    # --- Yeedi ---
    ("yeedi", lambda b,n,s,c: [f"https://www.yeedi.com/search?q={quote(n)}"]),

    # --- Dreame ---
    ("dreame", lambda b,n,s,c: [f"https://www.dreame.com/fr/search?q={quote(n)}"]),

    # --- TP-Link Tapo ---
    ("tapo", lambda b,n,s,c: [f"https://www.tapo.com/fr/search?q={quote(n)}"]),

    # --- Matic ---
    ("matic", lambda b,n,s,c: [f"https://www.matic.com/products"]),

    # --- Lefant ---
    ("lefant", lambda b,n,s,c: [f"https://www.lefant.com/search?q={quote(n)}"]),

    # --- MOVA ---
    ("mova", lambda b,n,s,c: [f"https://www.movarobot.com/search?q={quote(n)}"]),

    # --- Whirlpool (fallback pour ceux ratés) ---
    ("whirlpool", lambda b,n,s,c: [f"https://www.whirlpool.fr/recherche?q={quote(n)}"]),
]

async def scrape_image(url: str) -> str | None:
    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True, headers=HEADERS) as c:
            r = await c.get(url)
            r.raise_for_status()
        soup = BeautifulSoup(r.text, "lxml")
        for sel in ['meta[property="og:image"]', 'meta[property="og:image:secure_url"]', 'meta[name="twitter:image"]']:
            node = soup.select_one(sel)
            if node and node.get("content"):
                img = node["content"]
                if _good(img): return _abs(url, img)
        for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
            try:
                data = json.loads(script.string or "")
                imgs = _extract_ld(data)
                for i in imgs:
                    if _good(i): return _abs(url, i)
            except: pass
        main = soup.find("article") or soup.find("main") or soup.body
        if main:
            for img in main.find_all("img", src=True):
                if _good(img["src"]) and "logo" not in img["src"].lower():
                    return _abs(url, img["src"])
        return None
    except: return None

def _good(u):
    low = u.lower()
    if not low.startswith(("http://","https://")): return False
    bad = ["logo","icon","avatar","sprite","tracking","pixel","1x1","placehold","transparent"]
    if any(b in low for b in bad): return False
    return any(ext in low for ext in [".jpg",".jpeg",".png",".webp",".avif"])

def _abs(b, u):
    from urllib.parse import urljoin
    return urljoin(b, u)

def _extract_ld(d, out=None):
    if out is None: out = []
    if isinstance(d, dict):
        img = d.get("image")
        if isinstance(img, str): out.append(img)
        elif isinstance(img, list):
            for i in img:
                if isinstance(i, str): out.append(i)
                elif isinstance(i, dict) and isinstance(i.get("url"), str): out.append(i["url"])
        if d.get("@type") == "ImageObject" and isinstance(d.get("url"), str): out.append(d["url"])
        for v in d.values(): _extract_ld(v, out)
    elif isinstance(d, list):
        for i in d: _extract_ld(i, out)
    return out

def find_urls_v2(brand: str, name: str, slug: str, category: str) -> list[str]:
    brand_lower = brand.lower().strip()
    urls = []
    for b, fn in URLS_V2:
        if b in brand_lower or brand_lower in b:
            try:
                urls.extend(fn(brand, name, slug, category))
            except: pass
    return urls

async def main():
    supabase = get_supabase()
    data = supabase.table("v_products_published").select("id,name,brand,slug,category_slug,image_url").execute().data
    placeholders = [p for p in data if "placehold" in (p.get("image_url") or "")]
    
    total = len(placeholders)
    logger.info(f"📊 {total} restants à traiter")
    success = 0
    
    for i, p in enumerate(placeholders, 1):
        pid, brand, name, slug, cat = p["id"], p["brand"], p["name"], p["slug"], p["category_slug"]
        logger.info(f"[{i}/{total}] {brand} {name[:30]}")
        
        urls = find_urls_v2(brand, name, slug, cat)
        found = False
        for url in urls:
            img = await scrape_image(url)
            if img:
                try:
                    supabase.table("products").update({"image_url": img}).eq("id", pid).execute()
                    logger.info(f"  ✅ {img[:80]}")
                    found = True
                    success += 1
                except: pass
                break
            await asyncio.sleep(0.2)
        
        if not found:
            logger.warning(f"  ❌ Aucune image")
        
        await asyncio.sleep(0.3)
    
    logger.info(f"\n🏁 ✅ {success} récupérées sur {total}")

if __name__ == "__main__":
    asyncio.run(main())

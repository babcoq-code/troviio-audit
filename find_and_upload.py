#!/usr/bin/env python3
"""
Comprehensive image finder and uploader for 10 oven products.
Uses multiple strategies to find product images, download them, upload to Supabase, and update DB.
"""

import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.parse
from pathlib import Path

import httpx

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://uukshxztoztkwxuuvqzc.supabase.co")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "placeholder-replace-with-env-var")
BUCKET = "product-images"

HEADERS = {
    "Authorization": f"Bearer {SERVICE_KEY}",
    "apikey": SERVICE_KEY,
}

BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "fr,en;q=0.9",
}

# Define all products with known image sources
PRODUCTS = [
    {
        "slug": "siemens-iq700-hr776g3b1",
        "name": "Siemens iQ700 HR776G3B1",
        "urls": [
            "https://www.siemens-home.bsh-group.com/fr/product/HR776G3B1",
        ],
        "known_images": [],
        "manufacturer": "siemens",
        "model_code": "HR776G3B1",
    },
    {
        "slug": "aeg-7000-mealassist-tr7pb731st",
        "name": "AEG 7000 MealAssist TR7PB731ST",
        "urls": [
            "https://www.aeg.fr/fours/fours-encastrables/",
        ],
        "known_images": [],
        "manufacturer": "aeg",
        "model_code": "TR7PB731ST",
    },
    {
        "slug": "electrolux-steamcrisp-eoc8p39x",
        "name": "Electrolux SteamCrisp EOC8P39X",
        "urls": [
            "https://www.electrolux.fr/fours/fours-encastrables/",
        ],
        "known_images": [],
        "manufacturer": "electrolux",
        "model_code": "EOC8P39X",
    },
    {
        "slug": "neff-n70-b64cs31g0",
        "name": "Neff N70 B64CS31G0",
        "urls": [
            "https://www.neff-home.com/fr/fr/product/B64CS31G0",
        ],
        "known_images": [],
        "manufacturer": "neff",
        "model_code": "B64CS31G0",
    },
    {
        "slug": "samsung-dual-cook-nv7b6685aan",
        "name": "Samsung Dual Cook NV7B6685AAN",
        "urls": [
            "https://www.samsung.com/fr/home-appliances/ovens/NV7B6685AAN/",
        ],
        "known_images": [],
        "manufacturer": "samsung",
        "model_code": "NV7B6685AAN",
    },
    {
        "slug": "hisense-o643pg",
        "name": "Hisense O643PG",
        "urls": [],
        "known_images": [],
        "manufacturer": "hisense",
        "model_code": "O643PG",
    },
    {
        "slug": "bosch-serie-6-hba578bs0",
        "name": "Bosch Serie 6 HBA578BS0",
        "urls": [
            "https://www.amazon.fr/dp/B075R38MNM",
            "https://www.bosch-home.com/fr/product/HBA578BS0",
        ],
        "known_images": [
            "https://m.media-amazon.com/images/I/51i1kpmhuHL._AC_SX522_.jpg",
            "https://m.media-amazon.com/images/I/31KiTAb35lL._AC_.jpg",
        ],
        "manufacturer": "bosch",
        "model_code": "HBA578BS0",
    },
    {
        "slug": "miele-h-7264-bp",
        "name": "Miele H 7264 BP",
        "urls": [
            "https://www.miele.fr/p/four-h-7264-bp-11437970-p",
        ],
        "known_images": [],
        "manufacturer": "miele",
        "model_code": "H7264BP",
    },
    {
        "slug": "whirlpool-w9-om2-4s2-h",
        "name": "Whirlpool W9 OM2 4S2 H",
        "urls": [
            "https://www.whirlpool.fr/fours/fours-encastrables/",
        ],
        "known_images": [],
        "manufacturer": "whirlpool",
        "model_code": "W9OM24S2H",
    },
    {
        "slug": "smeg-sfp6604nx",
        "name": "Smeg SFP6604NX",
        "urls": [
            "https://www.smeg.fr/fours/four-sfp6604nx",
        ],
        "known_images": [],
        "manufacturer": "smeg",
        "model_code": "SFP6604NX",
    },
]


def curl_get(url, output=None, follow=True, timeout=30):
    """Run curl with browser headers."""
    cmd = ["curl", "-sL" if follow else "-s"]
    for k, v in BROWSER_HEADERS.items():
        cmd.extend(["-H", f"{k}: {v}"])
    if output:
        cmd.extend(["-o", output, "-w", "%{http_code} %{size_download} %{content_type}"])
    cmd.append(url)
    if not output:
        cmd.extend(["--max-time", str(timeout)])
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return result.stdout
    else:
        cmd.extend(["--max-time", str(timeout)])
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return result.stdout.strip()


def try_download(url, output_path, min_size=2000):
    """Try to download an image. Returns True if successful."""
    try:
        resp = httpx.get(url, headers={
            **BROWSER_HEADERS,
            "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        }, timeout=30, follow_redirects=True)
        
        if resp.status_code == 200 and len(resp.content) >= min_size:
            ct = resp.headers.get("content-type", "")
            if "image" in ct or resp.content[:4] in [b'\xff\xd8\xff', b'\x89PNG', b'RIFF', b'GIF8']:
                with open(output_path, "wb") as f:
                    f.write(resp.content)
                print(f"  ✅ Downloaded {len(resp.content)}b -> {os.path.basename(output_path)}")
                return True
        
        # Check if it's an actual image even without content-type
        if resp.status_code == 200 and len(resp.content) >= min_size:
            # Check magic bytes for common image formats
            magic = resp.content[:4]
            if magic[:2] == b'\xff\xd8' or magic[:4] == b'\x89PNG' or magic[:4] == b'RIFF' or magic[:3] == b'GIF':
                with open(output_path, "wb") as f:
                    f.write(resp.content)
                print(f"  ✅ Downloaded (magic) {len(resp.content)}b -> {os.path.basename(output_path)}")
                return True
        
        if resp.status_code != 200:
            print(f"  ⚠️  HTTP {resp.status_code} for {url[:80]}...")
        else:
            print(f"  ⚠️  Too small ({len(resp.content)}b) or wrong type for {url[:80]}...")
        return False
    except Exception as e:
        print(f"  ⚠️  Error downloading {url[:60]}...: {e}")
        return False


def scrape_page_for_images(url, depth=0):
    """Fetch a page and extract image URLs from HTML."""
    if depth > 1:
        return []
    
    try:
        resp = httpx.get(url, headers=BROWSER_HEADERS, timeout=30, follow_redirects=True)
        if resp.status_code != 200:
            return []
        
        html = resp.text
        images = []
        
        # Find img tags with src
        for match in re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', html, re.IGNORECASE):
            src = match.group(1)
            if any(x in src.lower() for x in ['.jpg', '.jpeg', '.png', '.webp', '.avif']):
                if not src.startswith('data:'):
                    # Make absolute
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        parsed = urllib.parse.urlparse(url)
                        src = f"{parsed.scheme}://{parsed.netloc}{src}"
                    elif not src.startswith('http'):
                        if not url.endswith('/'):
                            src = url.rsplit('/', 1)[0] + '/' + src
                        else:
                            src = url + src
                    images.append(src)
        
        # Also look for image URLs in JSON-LD
        for match in re.finditer(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.DOTALL):
            try:
                data = json.loads(match.group(1))
                if isinstance(data, dict):
                    if 'image' in data:
                        img = data['image']
                        if isinstance(img, str) and img.startswith('http'):
                            images.append(img)
            except:
                pass
        
        return list(set(images))
    except Exception as e:
        print(f"  ⚠️  Scrape error for {url[:60]}: {e}")
        return []


def upload_to_supabase(filepath, filename):
    """Upload to Supabase Storage, return public URL."""
    with open(filepath, "rb") as f:
        data = f.read()
    
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{filename}"
    
    # Detect content type
    ext = filename.rsplit('.', 1)[-1].lower()
    content_type = {"webp": "image/webp", "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png"}.get(ext, "image/webp")
    
    resp = httpx.post(
        url,
        headers={
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": content_type,
        },
        content=data,
        timeout=30,
    )
    
    if resp.status_code == 200:
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{filename}"
        print(f"  ✅ Uploaded: {public_url}")
        return public_url
    
    # Try with upsert
    resp2 = httpx.post(
        f"{url}?upsert=true",
        headers={
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": content_type,
        },
        content=data,
        timeout=30,
    )
    
    if resp2.status_code == 200:
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{filename}"
        print(f"  ✅ Uploaded: {public_url}")
        return public_url
    
    print(f"  ❌ Upload failed (HTTP {resp.status_code}): {resp.text[:200]}")
    return None


def update_db(slug, image_url):
    """Update image_url in products table."""
    resp = httpx.patch(
        f"{SUPABASE_URL}/rest/v1/products",
        headers={
            "Authorization": f"Bearer {SERVICE_KEY}",
            "apikey": SERVICE_KEY,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        params={"slug": f"eq.{slug}"},
        content=json.dumps({"image_url": image_url}),
        timeout=15,
    )
    if resp.status_code in (200, 204):
        return True
    print(f"  ❌ DB update: HTTP {resp.status_code}")
    return False


def find_images_for(product):
    """Find product images using multiple strategies."""
    slug = product["slug"]
    found_images = []
    
    # Strategy 1: Use known images
    for url in product.get("known_images", []):
        found_images.append(url)
    
    # Strategy 2: Scrape manufacturer product page
    for url in product.get("urls", []):
        if "amazon" in url:
            continue  # Skip Amazon, already handled
        print(f"  🔍 Scraping: {url}")
        imgs = scrape_page_for_images(url)
        # Filter for likely product images (not icons, not tiny)
        for img in imgs:
            if any(x in img.lower() for x in [product["model_code"].lower(), slug.lower().replace('-', '')]):
                found_images.append(img)
    
    # Strategy 3: For Bosch, use specific Amazon images
    if product["manufacturer"] == "bosch":
        found_images.append("https://m.media-amazon.com/images/I/51i1kpmhuHL._AC_SX679_.jpg")
    
    # Strategy 4: Try manufacturer-specific image CDN patterns
    code = product["model_code"]
    patterns = {
        "siemens": [
            f"https://media3.bsh-group.com/Images/Product2/960x960/{code}_Siemens_1.jpg",
            f"https://media3.bsh-group.com/Images/Product2/960x960/{code}_Siemens.jpg",
            f"https://media3.bsh-group.com/Images/Product2/1200x1200/{code}_Siemens.jpg",
        ],
        "aeg": [
            f"https://media3.bsh-group.com/Images/Product2/960x960/{code}_AEG.jpg",
        ],
        "electrolux": [
            f"https://electrolux.cdn.com/Images/Product2/960x960/{code}_Electrolux.jpg",
        ],
        "neff": [
            f"https://media3.bsh-group.com/Images/Product2/960x960/{code}_Neff.jpg",
            f"https://media3.bsh-group.com/Images/Product2/960x960/{code}_Neff_1.jpg",
        ],
        "bosch": [
            f"https://media3.bsh-group.com/Images/Product2/960x960/{code}_Bosch.jpg",
            f"https://media3.bsh-group.com/Images/Product2/960x960/{code}_Bosch_1.jpg",
        ],
        "miele": [
            f"https://media.miele.com/images/2000011/{code}_01.png",
        ],
        "whirlpool": [
            f"https://www.whirlpool.fr/content/dam/global/documents/{code}.jpg",
        ],
        "smeg": [
            f"https://www.smeg.com/images/products/{code}_01_high.jpg",
            f"https://www.smeg.com/images/products/{code}_01.jpg",
        ],
    }
    
    # Try manufacturer CDN patterns
    for pattern in patterns.get(product["manufacturer"], []):
        found_images.append(pattern)
    
    return list(set(found_images))


def process_product(product):
    """Process one product: find image, download, upload, update DB."""
    slug = product["slug"]
    name = product["name"]
    print(f"\n{'='*60}")
    print(f"📦 {name} ({slug})")
    
    # Find image URLs
    image_urls = find_images_for(product)
    print(f"  📋 Found {len(image_urls)} candidate URLs")
    
    # Try each URL until one works
    downloaded = False
    for i, url in enumerate(image_urls):
        ext = "jpg"
        if ".png" in url.lower() or url.lower().endswith(".png"):
            ext = "png"
        elif ".webp" in url.lower():
            ext = "webp"
        
        filename = f"{slug}.{ext}"
        temp_path = f"/tmp/{filename}"
        
        print(f"  🔄 [{i+1}/{len(image_urls)}] Trying: {url[:80]}...")
        if try_download(url, temp_path):
            downloaded = True
            
            # Upload to Supabase
            public_url = upload_to_supabase(temp_path, filename)
            if public_url:
                # Update DB
                if update_db(slug, public_url):
                    print(f"  ✅ SUCCESS: {slug} -> {public_url}")
                    return True
            
            # If we downloaded but upload failed, try with .webp extension
            if not public_url:
                webp_filename = f"{slug}.webp"
                webp_path = f"/tmp/{webp_filename}"
                # Convert to webp and retry
                subprocess.run([
                    "python3", "-c", f"""
from PIL import Image
img = Image.open('{temp_path}')
img.save('{webp_path}', 'WEBP', quality=85)
"""], timeout=30, capture_output=True)
                if os.path.exists(webp_path):
                    public_url = upload_to_supabase(webp_path, webp_filename)
                    if public_url:
                        if update_db(slug, public_url):
                            print(f"  ✅ SUCCESS (webp): {slug}")
                            return True
    
    print(f"  ❌ FAILED to find/upload image for {slug}")
    return False


def main():
    success_count = 0
    fail_count = 0
    
    for i, product in enumerate(PRODUCTS):
        if process_product(product):
            success_count += 1
        else:
            fail_count += 1
    
    print(f"\n{'='*60}")
    print(f"📊 RESULTS: {success_count} success, {fail_count} failed out of {len(PRODUCTS)}")
    return 0 if fail_count == 0 else 1


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Upload images for 10 oven products to Supabase Storage and update the products table.
Usage: python3 upload_images.py [--download-only]
"""

import json
import os
import sys
import tempfile
from pathlib import Path

import httpx

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://uukshxztoztkwxuuvqzc.supabase.co")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "placeholder-replace-with-env-var")
BUCKET = "product-images"

# Product slugs and their image URLs to download
PRODUCTS = [
    {
        "slug": "siemens-iq700-hr776g3b1",
        "image_url": "https://media3.bsh-group.com/Images/Product2/960x960/HR776G3B1_Siemens_1.jpg",
        "alt_urls": [
            "https://www.siemens-home.bsh-group.com/fr/product/HR776G3B1"
        ]
    },
    {
        "slug": "aeg-7000-mealassist-tr7pb731st",
        "image_url": "",
        "alt_urls": ["https://www.aeg.fr/fours/fours-encastrables/"]
    },
    {
        "slug": "electrolux-steamcrisp-eoc8p39x",
        "image_url": "",
        "alt_urls": ["https://www.electrolux.fr/fours/fours-encastrables/"]
    },
    {
        "slug": "neff-n70-b64cs31g0",
        "image_url": "https://media3.bsh-group.com/Images/Product2/960x960/B64CS31G0_Neff_1.jpg",
        "alt_urls": ["https://www.neff-home.com/fr/fr/product/B64CS31G0"]
    },
    {
        "slug": "samsung-dual-cook-nv7b6685aan",
        "image_url": "",
        "alt_urls": ["https://www.samsung.com/fr/home-appliances/ovens/NV7B6685AAN/"]
    },
    {
        "slug": "hisense-o643pg",
        "image_url": "",
        "alt_urls": []
    },
    {
        "slug": "bosch-serie-6-hba578bs0",
        "image_url": "https://images-eu.ssl-images-amazon.com/images/I/81svjhXQ8YL._AC_SX679_.jpg",
        "alt_urls": ["https://images-eu.ssl-images-amazon.com/images/I/71a5hWfDz0L._AC_SL1500_.jpg"]
    },
    {
        "slug": "miele-h-7264-bp",
        "image_url": "",
        "alt_urls": ["https://www.miele.fr/p/four-h-7264-bp-11437970-p"]
    },
    {
        "slug": "whirlpool-w9-om2-4s2-h",
        "image_url": "",
        "alt_urls": ["https://www.whirlpool.fr/fours/fours-encastrables/"]
    },
    {
        "slug": "smeg-sfp6604nx",
        "image_url": "",
        "alt_urls": ["https://www.smeg.fr/fours/four-sfp6604nx"]
    }
]

HEADERS = {
    "Authorization": f"Bearer {SERVICE_KEY}",
    "apikey": SERVICE_KEY,
}


def upload_to_supabase(filepath: str, filename: str) -> str | None:
    """Upload a file to Supabase Storage bucket. Returns the public URL."""
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{filename}"
    
    # Determine content type
    content_type = "image/webp"
    if filename.endswith(".jpg") or filename.endswith(".jpeg"):
        content_type = "image/jpeg"
    elif filename.endswith(".png"):
        content_type = "image/png"
    
    with open(filepath, "rb") as f:
        data = f.read()
    
    # Try upload with apikey header only (simpler)
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
    
    # Try alternative: upsert with cache control
    resp2 = httpx.post(
        f"{url}?upsert=true",
        headers={
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": content_type,
            "cache-control": "public, max-age=31536000",
        },
        content=data,
        timeout=30,
    )
    
    if resp2.status_code == 200:
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{filename}"
        print(f"  ✅ Uploaded (upsert): {public_url}")
        return public_url
    
    print(f"  ❌ Upload failed (HTTP {resp.status_code}): {resp.text[:200]}")
    return None


def update_product_image(slug: str, image_url: str) -> bool:
    """Update the image_url column for a product."""
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
        print(f"  ✅ DB updated for {slug}")
        return True
    else:
        print(f"  ❌ DB update failed (HTTP {resp.status_code}): {resp.text[:200]}")
        return False


def download_image(url: str, output_path: str) -> bool:
    """Download an image from a URL."""
    try:
        resp = httpx.get(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }, timeout=30, follow_redirects=True)
        
        if resp.status_code == 200 and len(resp.content) > 1000:
            # Check content type
            ct = resp.headers.get("content-type", "")
            if "image" in ct or len(resp.content) > 5000:
                with open(output_path, "wb") as f:
                    f.write(resp.content)
                print(f"  ✅ Downloaded ({len(resp.content)} bytes) -> {output_path}")
                return True
        
        print(f"  ⚠️  Download failed: HTTP {resp.status_code}, size={len(resp.content)}")
        return False
    except Exception as e:
        print(f"  ⚠️  Download error: {e}")
        return False


def main():
    download_only = "--download-only" in sys.argv
    
    for product in PRODUCTS:
        slug = product["slug"]
        print(f"\n{'='*60}")
        print(f"📦 {slug}")
        
        # Determine filename
        filename = f"{slug}.webp"
        temp_path = f"/tmp/{filename}"
        
        # Try primary image URL first
        downloaded = False
        if product["image_url"]:
            downloaded = download_image(product["image_url"], temp_path)
        
        # If we need to browse (no direct URL), skip here - will be done with browser
        if not downloaded:
            print(f"  ⏭️  No direct image URL (will use browser)")
            continue
        
        if download_only:
            continue
        
        # Upload to Supabase
        public_url = upload_to_supabase(temp_path, filename)
        if public_url:
            update_product_image(slug, public_url)


if __name__ == "__main__":
    main()

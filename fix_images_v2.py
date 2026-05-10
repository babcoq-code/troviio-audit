#!/usr/bin/env python3
"""Fix missing product images for Troviio - v2 with proper auth."""

import http.client
import json
import os
import re
import subprocess
import time
import urllib.request
import urllib.parse
from pathlib import Path

SUPABASE_URL = "uukshxztoztkwxuuvqzc.supabase.co"
SUPABASE_BASE = "https://uukshxztoztkwxuuvqzc.supabase.co"
SERVICE_KEY = "SUPABASE_SERVICE_KEY_REMOVED"

FIRECRAWL_KEY = "fc-8e117a1377c64c0c866c35adc92e2d0d"
FIRECRAWL_API = "https://api.firecrawl.dev/v1/scrape"

STORAGE_BUCKET = "product-images"  # Existing bucket with 57 images

def supabase_get(path):
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=30)
    headers = {
        'apikey': SERVICE_KEY,
        'Content-Type': 'application/json'
    }
    conn.request('GET', f'/rest/v1/{path}', headers=headers)
    res = conn.getresponse()
    body = res.read().decode()
    if res.status != 200:
        print(f"  ⚠️ Supabase GET error {res.status}: {body[:200]}")
        return None
    return json.loads(body)

def supabase_patch(path, data):
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=30)
    headers = {
        'apikey': SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    body = json.dumps(data)
    conn.request('PATCH', f'/rest/v1/{path}', body=body, headers=headers)
    res = conn.getresponse()
    res.read()
    return res.status

def firecrawl_scrape(url):
    """Scrape an URL using Firecrawl API."""
    payload = json.dumps({"url": url, "formats": ["markdown"]}).encode('utf-8')
    req = urllib.request.Request(
        FIRECRAWL_API, data=payload,
        headers={
            'Authorization': f'Bearer {FIRECRAWL_KEY}',
            'Content-Type': 'application/json',
        },
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"  ❌ Firecrawl error: {e}")
        return None

def extract_image_from_markdown(md):
    """Extract Amazon product image URL from markdown."""
    if not md:
        return None
    
    # Amazon image URLs in markdown
    patterns = [
        r'!\[.*?\]\((https?://m\.media-amazon\.com/images/I/[^\)]+)\)',
        r'https?://m\.media-amazon\.com/images/I/[^\s\)"\'<>]+',
    ]
    for pat in patterns:
        matches = re.findall(pat, md, re.IGNORECASE)
        for m in matches:
            m = m.split('?')[0]
            if ('images' in m.lower() or 'media-amazon' in m) and not m.endswith(('.png', '.gif')):
                # Skip small icons like ShoppingPortal logo
                if 'ShoppingPortal' in m or 'logo' in m.lower():
                    continue
                return m
            if matches:
                return matches[0].split('?')[0]
    return None

def extract_image_curl(asin):
    """Direct curl to Amazon FR to find main image."""
    url = f"https://www.amazon.fr/dp/{asin}"
    cmd = [
        'curl', '-s', '-L', url,
        '-H', 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        '-H', 'Accept-Language: fr-FR,fr;q=0.9',
        '--max-time', '30'
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=35)
        html = result.stdout
        
        patterns = [
            r'id="landingImage".*?src="([^"]+)"',
            r'id="imgBlkFront".*?src="([^"]+)"',
            r'"mainUrl"\s*:\s*"([^"]+)"',
            r'"large"\s*:\s*"([^"]+)"',
            r'data-old-hires="([^"]+)"',
            r'src="(https?://m\.media-amazon\.com/images/I/[^"]+)"',
        ]
        
        for pat in patterns:
            m = re.search(pat, html, re.DOTALL)
            if m:
                u = m.group(1).replace('\\u0026', '&').replace('\\/', '/').split('?')[0]
                if 'http' in u and not u.endswith(('.png', '.gif')):
                    if 'ShoppingPortal' not in u and 'logo' not in u.lower():
                        return u
        
        # Any Amazon image URL
        all_imgs = re.findall(r'https?://m\.media-amazon\.com/images/I/[^\s"\'<>]+', html)
        for u in all_imgs:
            u = u.replace('\\u0026', '&').replace('\\/', '/').split('?')[0]
            if '._AC_' in u or '._SL' in u:
                return u
        for u in all_imgs:
            u = u.replace('\\u0026', '&').replace('\\/', '/').split('?')[0]
            if not u.endswith(('.png', '.gif')):
                return u
    except Exception as e:
        print(f"  ❌ Curl error: {e}")
    return None

def download_image(url, local_path):
    """Download an image from URL."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            if len(data) < 500:
                print(f"  ⚠️ Image too small ({len(data)} bytes), might be a placeholder")
                return False
            # Determine format from content-type
            ct = resp.headers.get('Content-Type', '')
            if 'png' in ct:
                local_path = local_path.replace('.jpg', '.png')
            elif 'webp' in ct:
                local_path = local_path.replace('.jpg', '.webp')
            with open(local_path, 'wb') as f:
                f.write(data)
            print(f"  ✅ Downloaded {len(data)} bytes -> {local_path}")
            return local_path
    except Exception as e:
        print(f"  ❌ Download error: {e}")
        return False

def upload_to_supabase(local_path, storage_path):
    """Upload file to Supabase Storage."""
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=60)
    headers = {
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'image/jpeg',
    }
    
    # Determine content type from extension
    ext = os.path.splitext(local_path)[1].lower()
    if ext == '.png':
        headers['Content-Type'] = 'image/png'
    elif ext == '.webp':
        headers['Content-Type'] = 'image/webp'
    
    with open(local_path, 'rb') as f:
        data = f.read()
    
    conn.request('POST', f'/storage/v1/object/{STORAGE_BUCKET}/{storage_path}', body=data, headers=headers)
    res = conn.getresponse()
    body = res.read().decode()
    if res.status in (200, 201):
        public_url = f"{SUPABASE_BASE}/storage/v1/object/public/{STORAGE_BUCKET}/{storage_path}"
        print(f"  ✅ Uploaded: {public_url}")
        return public_url
    else:
        print(f"  ❌ Upload error {res.status}: {body[:200]}")
        return None

def get_amazon_image(asin):
    """Get Amazon product image using multiple strategies."""
    amazon_url = f"https://www.amazon.fr/dp/{asin}"
    
    # Strategy 1: Firecrawl
    result = firecrawl_scrape(amazon_url)
    if result and result.get('success'):
        md = result.get('data', {}).get('markdown', '')
        if md:
            img = extract_image_from_markdown(md)
            if img:
                print(f"  ✅ Firecrawl: {img[:80]}...")
                return img
    
    # Strategy 2: Direct curl
    print(f"  🔄 Direct curl...")
    img = extract_image_curl(asin)
    if img:
        print(f"  ✅ Curl: {img[:80]}...")
        return img
    
    return None

def process_product(prod):
    """Process a single product to fix its image."""
    prod_id = prod.get('id')
    name = prod.get('name', 'Unknown')
    slug = prod.get('slug', 'unknown')
    brand = prod.get('brand', '') or ''
    amazon_asin = prod.get('amazon_asin') or ''
    
    print(f"\n{'='*60}")
    print(f"📦 {name[:55]}")
    print(f"   slug={slug[:35]} | brand={brand[:20]} | ASIN={amazon_asin}")
    
    img_url = None
    
    if amazon_asin:
        print(f"   🔍 Amazon: https://www.amazon.fr/dp/{amazon_asin}")
        img_url = get_amazon_image(amazon_asin)
    else:
        # Category B: Google Images search
        query = urllib.parse.quote(f"{brand} {name}")
        search_url = f"https://www.google.com/search?tbm=isch&q={query}"
        print(f"   🔍 Google: {query[:60]}")
        
        result = firecrawl_scrape(search_url)
        if result and result.get('success'):
            md = result.get('data', {}).get('markdown', '')
            if md:
                urls = re.findall(r'https?://[^\s\)"\'<>]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s\)"\']*)?', md, re.IGNORECASE)
                for u in urls:
                    if all(x not in u.lower() for x in ['google', 'logo', 'gstatic']):
                        img_url = u.split('?')[0]
                        print(f"  ✅ Google: {img_url[:80]}...")
                        break
        
        if not img_url:
            print(f"   ⏭️ No image for non-ASIN product")
            return False
    
    if not img_url:
        print(f"   ❌ No image found")
        return False
    
    # Download
    result_path = download_image(img_url, f"/tmp/{slug}.jpg")
    if not result_path:
        return False
    
    # Upload
    ext = os.path.splitext(result_path)[1]
    storage_path = f"{slug}{ext}"
    public_url = upload_to_supabase(result_path, storage_path)
    
    if not public_url:
        return False
    
    # Update DB
    status = supabase_patch(f"products?id=eq.{prod_id}", {"image_url": public_url})
    if status in (200, 204):
        print(f"   ✅ DB updated!")
        try:
            os.remove(result_path)
        except:
            pass
        return True
    else:
        print(f"   ❌ DB update failed: {status}")
        return False

def main():
    print("=" * 60)
    print("🔧 TROVIIO - Fix 40 missing product images (v2)")
    print("=" * 60)
    
    # Get products without images
    null_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=is.null&limit=200") or []
    empty_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=eq.&limit=200") or []
    
    all_products = null_prods + empty_prods
    print(f"\n📋 Total: {len(all_products)} products without images")
    
    with_asin = [p for p in all_products if p.get('amazon_asin')]
    without_asin = [p for p in all_products if not p.get('amazon_asin')]
    print(f"   With ASIN: {len(with_asin)} | Without ASIN: {len(without_asin)}")
    
    for i, p in enumerate(all_products):
        asin = p.get('amazon_asin') or '—'
        print(f"   {i+1:2d}. [{asin[:12]}] {p.get('name','?')[:50]}")
    
    # Process in small batches
    batch_size = 5
    total = len(all_products)
    success = 0
    failed = 0
    
    for start in range(0, total, batch_size):
        batch = all_products[start:start+batch_size]
        batch_num = start // batch_size + 1
        total_batches = (total + batch_size - 1) // batch_size
        
        print(f"\n{'#'*60}")
        print(f"# BATCH {batch_num}/{total_batches}")
        print(f"{'#'*60}")
        
        for prod in batch:
            ok = process_product(prod)
            if ok:
                success += 1
            else:
                failed += 1
            
            progress = start + batch.index(prod) + 1
            print(f"   📊 {progress}/{total}")
            
            if progress < total:
                time.sleep(2)
        
        if start + batch_size < total:
            print(f"\n⏳ Waiting 5s...")
            time.sleep(5)
    
    print(f"\n{'='*60}")
    print(f"📊 FINAL: {success} fixed, {failed} failed")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()

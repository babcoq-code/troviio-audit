#!/usr/bin/env python3
"""Fix missing product images for Troviio - processes all 40 products."""

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

STORAGE_BUCKET = "products"

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
    res.read()  # consume
    return res.status

def firecrawl_scrape(url):
    """Scrape an URL using Firecrawl API."""
    payload = json.dumps({
        "url": url,
        "formats": ["markdown"]
    }).encode('utf-8')
    req = urllib.request.Request(
        FIRECRAWL_API,
        data=payload,
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

def extract_image_from_markdown(markdown_text):
    """Extract Amazon product image URL from markdown."""
    if not markdown_text:
        return None
    
    # Try markdown image syntax with Amazon URLs
    patterns = [
        r'!\[.*?\]\((https?://m\.media-amazon\.com/images/I/[^\)]+)\)',
        r'!\[.*?\]\((https?://[^\)]*images-amazon[^\)]*)\)',
    ]
    for pattern in patterns:
        matches = re.findall(pattern, markdown_text, re.IGNORECASE)
        for m in matches:
            m = m.split('?')[0]
            if 'images' in m.lower() or 'media-amazon' in m:
                return m
    
    # Raw URLs
    url_pattern = r'https?://m\.media-amazon\.com/images/I/[^\s"\'\)<>]+'
    matches = re.findall(url_pattern, markdown_text)
    for m in matches:
        m = m.split('?')[0]
        # Prefer AC or SL variants (larger images)
        if '._AC_' in m or '._SL' in m:
            return m
    if matches:
        return matches[0].split('?')[0]
    
    return None

def extract_image_curl(asin):
    """Direct curl to Amazon page to find the main image."""
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
        
        # Various patterns for Amazon main image
        patterns = [
            r'id="landingImage".*?src="([^"]+)"',
            r'id="imgBlkFront".*?src="([^"]+)"',
            r'"mainUrl"\s*:\s*"([^"]+)"',
            r'"large"\s*:\s*"([^"]+)"',
            r'data-old-hires="([^"]+)"',
            r'src="(https?://m\.media-amazon\.com/images/I/[^"]+)"',
        ]
        
        for pattern in patterns:
            m = re.search(pattern, html, re.DOTALL)
            if m:
                url = m.group(1).replace('\\u0026', '&').replace('\\/', '/')
                if 'http' in url:
                    return url.split('?')[0]
        
        # Last resort: any Amazon image URL with .jpg
        all_urls = re.findall(r'https?://m\.media-amazon\.com/images/I/[^\s"\'<>]+', html)
        for u in all_urls:
            u = u.replace('\\u0026', '&').replace('\\/', '/').split('?')[0]
            if '._AC_' in u or '._SL' in u:
                return u
            if u.endswith(('.jpg', '.png', '.webp')):
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
                print(f"  ⚠️ Image too small: {len(data)} bytes")
                return False
            with open(local_path, 'wb') as f:
                f.write(data)
            print(f"  ✅ Downloaded {len(data)} bytes -> {local_path}")
            return True
    except Exception as e:
        print(f"  ❌ Download error: {e}")
        return False

def upload_to_supabase(local_path, storage_path):
    """Upload file to Supabase Storage bucket."""
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=60)
    headers = {
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'image/jpeg',
    }
    with open(local_path, 'rb') as f:
        data = f.read()
    
    # Check if file exists first
    conn2 = http.client.HTTPSConnection(SUPABASE_URL, timeout=15)
    conn2.request('HEAD', f'/storage/v1/object/public/{STORAGE_BUCKET}/{storage_path}', headers={
        'Authorization': f'Bearer {SERVICE_KEY}'
    })
    res2 = conn2.getresponse()
    res2.read()
    if res2.status == 200:
        public_url = f"{SUPABASE_BASE}/storage/v1/object/public/{STORAGE_BUCKET}/{storage_path}"
        print(f"  ℹ️ File already exists: {public_url}")
        return public_url
    
    # Upload
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
    """Try to get the Amazon product image using multiple strategies."""
    amazon_url = f"https://www.amazon.fr/dp/{asin}"
    
    # Strategy 1: Firecrawl
    result = firecrawl_scrape(amazon_url)
    if result and result.get('success'):
        markdown = result.get('data', {}).get('markdown', '')
        if markdown:
            img = extract_image_from_markdown(markdown)
            if img:
                print(f"  ✅ Firecrawl found: {img[:80]}...")
                return img
    
    # Strategy 2: Direct curl
    print(f"  🔄 Direct curl...")
    img = extract_image_curl(asin)
    if img:
        print(f"  ✅ Curl found: {img[:80]}...")
        return img
    
    return None

def process_product(prod):
    """Process a single product to get its image."""
    prod_id = prod.get('id')
    name = prod.get('name', 'Unknown')
    slug = prod.get('slug', 'unknown')
    brand = prod.get('brand', '') or ''
    amazon_asin = prod.get('amazon_asin') or ''
    
    print(f"\n{'='*60}")
    print(f"📦 {name[:55]}")
    print(f"   slug={slug[:35]}, brand={brand[:20]}, ASIN={amazon_asin}")
    
    img_url = None
    
    if amazon_asin:
        print(f"   🔍 Amazon FR: https://www.amazon.fr/dp/{amazon_asin}")
        img_url = get_amazon_image(amazon_asin)
    else:
        # Category B: Search via Google Images using Firecrawl
        query = urllib.parse.quote(f"{brand} {name}")
        search_url = f"https://www.google.com/search?tbm=isch&q={query}"
        print(f"   🔍 Google Images: {query[:60]}")
        
        result = firecrawl_scrape(search_url)
        if result and result.get('success'):
            markdown = result.get('data', {}).get('markdown', '')
            if markdown:
                # Find image URLs in markdown
                img_urls = re.findall(r'https?://[^\s\)"\'<>]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s\)"\']*)?', markdown, re.IGNORECASE)
                for u in img_urls:
                    if 'google' not in u.lower() and 'logo' not in u.lower() and 'gstatic' not in u.lower():
                        img_url = u.split('?')[0]
                        print(f"  ✅ Found via Google: {img_url[:80]}...")
                        break
        
        if not img_url:
            print(f"   ⏭️  No image found for non-ASIN product")
            return False
    
    if not img_url:
        print(f"   ❌ No image found")
        return False
    
    # Clean URL
    img_url = img_url.split('?')[0]
    if not img_url.startswith('http'):
        print(f"   ❌ Invalid URL format")
        return False
    
    # Download
    local_path = f"/tmp/{slug}.jpg"
    if not download_image(img_url, local_path):
        return False
    
    # Upload to Supabase Storage
    storage_path = f"{slug}.jpg"
    public_url = upload_to_supabase(local_path, storage_path)
    
    if not public_url:
        return False
    
    # Update database
    status = supabase_patch(f"products?id=eq.{prod_id}", {"image_url": public_url})
    if status in (200, 204):
        print(f"   ✅ DB updated successfully!")
        try:
            os.remove(local_path)
        except:
            pass
        return True
    else:
        print(f"   ❌ DB update failed: {status}")
        return False

def main():
    print("=" * 60)
    print("🔧 TROVIIO - Fix 40 missing product images")
    print("=" * 60)
    
    # Get null image_url products
    null_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=is.null&limit=200") or []
    empty_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=eq.&limit=200") or []
    
    all_products = null_prods + empty_prods
    print(f"\n📋 Total products without images: {len(all_products)}")
    
    with_asin = [p for p in all_products if p.get('amazon_asin')]
    without_asin = [p for p in all_products if not p.get('amazon_asin')]
    
    print(f"   Category A (with ASIN): {len(with_asin)}")
    print(f"   Category B (no ASIN):   {len(without_asin)}")
    
    # Show full list
    print(f"\n📋 Full list of {len(all_products)} products:")
    for i, p in enumerate(all_products):
        asin = p.get('amazon_asin') or '—'
        print(f"   {i+1:2d}. [{asin[:12]}...] {p.get('name','?')[:50]}")
    
    # Process in batches of 5
    batch_size = 5
    total = len(all_products)
    processed = 0
    success = 0
    failed = 0
    
    for start in range(0, total, batch_size):
        batch = all_products[start:start+batch_size]
        batch_num = start // batch_size + 1
        total_batches = (total + batch_size - 1) // batch_size
        
        print(f"\n{'#'*60}")
        print(f"# BATCH {batch_num}/{total_batches} (products {start+1}-{min(start+batch_size, total)})")
        print(f"{'#'*60}")
        
        for prod in batch:
            ok = process_product(prod)
            if ok:
                success += 1
            else:
                failed += 1
            processed += 1
            
            print(f"   Progress: {processed}/{total}")
            
            # Pause between products to be nice to APIs
            if processed < total:
                time.sleep(2)
        
        # Longer pause between batches
        if start + batch_size < total:
            print(f"\n⏳ Pausing 5s before next batch...")
            time.sleep(5)
    
    print(f"\n{'='*60}")
    print(f"📊 FINAL RESULT")
    print(f"   Total processed: {processed}")
    print(f"   ✅ Fixed:         {success}")
    print(f"   ❌ Failed:        {failed}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()

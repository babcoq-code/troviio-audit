#!/usr/bin/env python3
"""Batch 2: Fix remaining products - retry ASIN products with better curl."""

import http.client
import json
import os
import re
import subprocess
import time
import urllib.request
import urllib.parse

SUPABASE_URL = "uukshxztoztkwxuuvqzc.supabase.co"
SUPABASE_BASE = "https://uukshxztoztkwxuuvqzc.supabase.co"
SERVICE_KEY = "SUPABASE_SERVICE_KEY_REMOVED"
FIRECRAWL_KEY = "fc-8e117a1377c64c0c866c35adc92e2d0d"
STORAGE_BUCKET = "product-images"

def supabase_get(path):
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=30)
    headers = {'apikey': SERVICE_KEY, 'Content-Type': 'application/json'}
    conn.request('GET', f'/rest/v1/{path}', headers=headers)
    res = conn.getresponse()
    body = res.read().decode()
    if res.status != 200:
        return None
    return json.loads(body)

def supabase_patch(path, data):
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=30)
    headers = {'apikey': SERVICE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'}
    conn.request('PATCH', f'/rest/v1/{path}', body=json.dumps(data), headers=headers)
    res = conn.getresponse()
    res.read()
    return res.status

def download_image(url, local_path):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            if len(data) < 500:
                print(f"  ⚠️ Too small: {len(data)} bytes")
                return False
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
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=60)
    headers = {'apikey': SERVICE_KEY, 'Authorization': f'Bearer {SERVICE_KEY}', 'Content-Type': 'image/jpeg'}
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

def curl_amazon(asin):
    """Fetch Amazon page HTML with gzip support."""
    url = f"https://www.amazon.fr/dp/{asin}"
    cmd = [
        'curl', '-s', '-L', url,
        '-H', 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        '-H', 'Accept-Language: fr-FR,fr;q=0.9',
        '--compressed',
        '--max-time', '30'
    ]
    result = subprocess.run(cmd, capture_output=True, timeout=35)
    raw = result.stdout
    # Try to decode
    for enc in ['utf-8', 'latin-1', 'iso-8859-1']:
        try:
            return raw.decode(enc)
        except:
            continue
    return raw.decode('utf-8', errors='replace')

def extract_image_from_html(html):
    """Extract main product image from Amazon HTML."""
    patterns = [
        r'id="landingImage".*?src="([^"]+)"',
        r'id="imgBlkFront".*?src="([^"]+)"',
        r'"mainUrl"\s*:\s*"([^"]+)"',
        r'"large"\s*:\s*"([^"]+)"',
        r'"hiRes"\s*:\s*"([^"]+)"',
        r'data-old-hires="([^"]+)"',
    ]
    for pat in patterns:
        m = re.search(pat, html, re.DOTALL)
        if m:
            u = m.group(1).replace('\\u0026', '&').replace('\\/', '/').split('?')[0]
            if 'http' in u and 'ShoppingPortal' not in u and 'logo' not in u.lower():
                return u
    
    # Any Amazon image
    all_imgs = re.findall(r'https?://m\.media-amazon\.com/images/I/[^\s"\'<>]+', html)
    for u in all_imgs:
        u = u.replace('\\u0026', '&').replace('\\/', '/').split('?')[0]
        if ('._AC_SL' in u or '._AC_SX' in u or '._SY' in u or u.endswith('.jpg')) and 'ShoppingPortal' not in u:
            if 'logo' not in u.lower():
                return u
    
    return None

def process_asin(prod):
    prod_id = prod['id']
    name = prod['name']
    slug = prod['slug']
    asin = prod['amazon_asin']
    
    print(f"\n{'='*50}")
    print(f"📦 {name[:50]}")
    print(f"   ASIN: {asin}, slug: {slug}")
    
    # Use curl with --compressed flag
    html = curl_amazon(asin)
    if html:
        img_url = extract_image_from_html(html)
        if img_url:
            print(f"  ✅ Found: {img_url[:80]}...")
            
            # Download and upload
            result_path = download_image(img_url, f"/tmp/{slug}.jpg")
            if not result_path:
                return False
            
            ext = os.path.splitext(result_path)[1]
            storage_path = f"{slug}{ext}"
            public_url = upload_to_supabase(result_path, storage_path)
            
            if public_url:
                status = supabase_patch(f"products?id=eq.{prod_id}", {"image_url": public_url})
                if status in (200, 204):
                    print(f"  ✅ DB updated!")
                    try:
                        os.remove(result_path)
                    except:
                        pass
                    return True
    else:
        print(f"  ❌ Could not fetch Amazon page")
    
    return False

# Get remaining products
print("=" * 50)
print("📋 Remaining products without images")
print("=" * 50)

null_prods = supabase_get("products?select=id,name,slug,amazon_asin,image_url&image_url=is.null&limit=200") or []
empty_prods = supabase_get("products?select=id,name,slug,amazon_asin,image_url&image_url=eq.&limit=200") or []

remaining = null_prods + empty_prods
print(f"Total remaining: {len(remaining)}")

# Separate ASIN from non-ASIN
asin_remaining = [p for p in remaining if p.get('amazon_asin')]
non_asin_remaining = [p for p in remaining if not p.get('amazon_asin')]

print(f"With ASIN (retry): {len(asin_remaining)}")
print(f"Without ASIN: {len(non_asin_remaining)}")

# Process ASIN products with better curl
print(f"\n{'='*50}")
print(f"🔧 Processing {len(asin_remaining)} ASIN products with curl")
print(f"{'='*50}")

for p in asin_remaining:
    process_asin(p)
    time.sleep(3)

# Now show final state
print(f"\n{'='*50}")
print(f"📊 Final check")
print(f"{'='*50}")

null_prods2 = supabase_get("products?select=id,name,amazon_asin,image_url&image_url=is.null&limit=200") or []
empty_prods2 = supabase_get("products?select=id,name,amazon_asin,image_url&image_url=eq.&limit=200") or []
total_remaining = (null_prods2 or []) + (empty_prods2 or [])

print(f"Still without images: {len(total_remaining)}")
for p in total_remaining:
    asin = p.get('amazon_asin') or '—'
    print(f"  {p.get('name','?')[:45]} | ASIN={asin[:15]}")

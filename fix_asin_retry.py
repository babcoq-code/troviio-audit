#!/usr/bin/env python3
"""Try alternative image finding for remaining ASIN products."""

import http.client
import json
import os
import re
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
    return json.loads(res.read().decode()) if res.status == 200 else None

def supabase_patch(path, data):
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=30)
    headers = {'apikey': SERVICE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'}
    conn.request('PATCH', f'/rest/v1/{path}', body=json.dumps(data), headers=headers)
    res = conn.getresponse()
    res.read()
    return res.status

def scrape_firecrawl(url, formats):
    payload = json.dumps({"url": url, "formats": formats}).encode('utf-8')
    req = urllib.request.Request(
        "https://api.firecrawl.dev/v1/scrape", data=payload,
        headers={'Authorization': f'Bearer {FIRECRAWL_KEY}', 'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"  ❌ Firecrawl: {e}")
        return None

def download_image(url, local_path):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            if len(data) < 500:
                return False
            ct = resp.headers.get('Content-Type', '')
            if 'png' in ct: local_path = local_path.replace('.jpg', '.png')
            elif 'webp' in ct: local_path = local_path.replace('.jpg', '.webp')
            with open(local_path, 'wb') as f: f.write(data)
            print(f"  ✅ Downloaded {len(data)} bytes")
            return local_path
    except Exception as e:
        print(f"  ❌ Download: {e}")
        return False

def upload_to_supabase(local_path, storage_path):
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=60)
    headers = {'apikey': SERVICE_KEY, 'Authorization': f'Bearer {SERVICE_KEY}', 'Content-Type': 'image/jpeg'}
    ext = os.path.splitext(local_path)[1].lower()
    if ext == '.png': headers['Content-Type'] = 'image/png'
    elif ext == '.webp': headers['Content-Type'] = 'image/webp'
    with open(local_path, 'rb') as f:
        data = f.read()
    conn.request('POST', f'/storage/v1/object/{STORAGE_BUCKET}/{storage_path}', body=data, headers=headers)
    res = conn.getresponse()
    body = res.read().decode()
    if res.status in (200, 201):
        url = f"{SUPABASE_BASE}/storage/v1/object/public/{STORAGE_BUCKET}/{storage_path}"
        print(f"  ✅ Uploaded")
        return url
    else:
        print(f"  ❌ Upload {res.status}")
        return None

# Get remaining ASIN products
null_prods = supabase_get("products?select=id,name,slug,amazon_asin,image_url&image_url=is.null&limit=200") or []
empty_prods = supabase_get("products?select=id,name,slug,amazon_asin,image_url&image_url=eq.&limit=200") or []
remaining = null_prods + empty_prods
asin_prods = [p for p in remaining if p.get('amazon_asin')]

print(f"ASIN products remaining: {len(asin_prods)}")
for p in asin_prods:
    print(f"  {p['name'][:45]} | ASIN={p['amazon_asin']}")

success = 0
for prod in asin_prods:
    pid = prod['id']
    name = prod['name']
    slug = prod['slug']
    asin = prod['amazon_asin']
    
    print(f"\n{'='*50}")
    print(f"📦 {name[:50]}")
    print(f"   ASIN: {asin}")
    
    img_url = None
    
    # Strategy 1: Try Firecrawl with rawHtml 
    print(f"  🔍 Firecrawl rawHtml...")
    result = scrape_firecrawl(f"https://www.amazon.fr/dp/{asin}", ["rawHtml"])
    if result and result.get('success'):
        raw = result.get('data', {}).get('rawHtml', '')
        if raw:
            # Look for image with specific patterns
            patterns = [
                r'id="landingImage".*?src="([^"]+)"',
                r'"mainUrl"\s*:\s*"([^"]+)"',
                r'"large"\s*:\s*"([^"]+)"',
                r'"hiRes"\s*:\s*"([^"]+)"',
                r'data-old-hires="([^"]+)"',
            ]
            for pat in patterns:
                m = re.search(pat, raw, re.DOTALL)
                if m:
                    u = m.group(1).replace('\\u0026', '&').replace('\\/', '/').split('?')[0]
                    if 'http' in u and 'ShoppingPortal' not in u and 'logo' not in u.lower():
                        img_url = u
                        print(f"  ✅ Found via pattern: {u[:80]}")
                        break
            
            if not img_url:
                # Any Amazon image URL
                all_imgs = re.findall(r'https?://m\.media-amazon\.com/images/I/[^\s"\'<>]+', raw)
                for u in all_imgs:
                    u = u.replace('\\u0026', '&').replace('\\/', '/').split('?')[0]
                    if ('._AC_SL' in u or '._AC_SX' in u or '._SY' in u or u.endswith('.jpg')) and 'ShoppingPortal' not in u and 'logo' not in u.lower():
                        img_url = u
                        print(f"  ✅ Found image: {u[:80]}")
                        break
    
    # Strategy 2: Try Amazon search page via Firecrawl
    if not img_url:
        print(f"  🔍 Amazon search page...")
        search_url = f"https://www.amazon.fr/s?k={asin}"
        result = scrape_firecrawl(search_url, ["rawHtml"])
        if result and result.get('success'):
            raw = result.get('data', {}).get('rawHtml', '')
            if raw:
                all_imgs = re.findall(r'https?://m\.media-amazon\.com/images/I/[^\s"\'<>]+', raw)
                for u in all_imgs:
                    u = u.replace('\\u0026', '&').replace('\\/', '/').split('?')[0]
                    if '._AC_SL' in u or '._AC_SX' in u or u.endswith('.jpg'):
                        if 'ShoppingPortal' not in u and 'logo' not in u.lower():
                            img_url = u
                            print(f"  ✅ Found via search: {u[:80]}")
                            break
    
    # Strategy 3: Try direct media URL pattern
    if not img_url:
        print(f"  🔍 Trying known image patterns...")
        # Some products have standard Amazon image URLs with the ASIN hash
        # Try to find from Keepa or other sources via Google
        google_url = f"https://www.google.com/search?tbm=isch&q={asin}+amazon+product"
        result = scrape_firecrawl(google_url, ["rawHtml"])
        if result and result.get('success'):
            raw = result.get('data', {}).get('rawHtml', '')
            if raw:
                all_imgs = re.findall(r'https?://m\.media-amazon\.com/images/I/[^\s"\'<>]+', raw)
                for u in all_imgs:
                    u = u.replace('\\u0026', '&').replace('\\/', '/').split('?')[0]
                    if '._AC_SL' in u or u.endswith('.jpg'):
                        if 'ShoppingPortal' not in u and 'logo' not in u.lower():
                            img_url = u
                            print(f"  ✅ Found via Google: {u[:80]}")
                            break
    
    if not img_url:
        print(f"  ❌ Could not find image for ASIN {asin}")
        time.sleep(2)
        continue
    
    # Download, upload, update
    result_path = download_image(img_url, f"/tmp/{slug}.jpg")
    if not result_path:
        time.sleep(2)
        continue
    
    ext = os.path.splitext(result_path)[1]
    storage_path = f"{slug}{ext}"
    public_url = upload_to_supabase(result_path, storage_path)
    
    if not public_url:
        try: os.remove(result_path)
        except: pass
        time.sleep(2)
        continue
    
    status = supabase_patch(f"products?id=eq.{pid}", {"image_url": public_url})
    if status in (200, 204):
        print(f"  ✅ DB updated!")
        success += 1
        try: os.remove(result_path)
        except: pass
    
    time.sleep(2)

print(f"\n{'='*50}")
print(f"📊 ASIN retry: {success} fixed out of {len(asin_prods)}")

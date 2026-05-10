#!/usr/bin/env python3
"""Last resort for remaining 6 products - use known image sources."""

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
    return json.loads(res.read().decode()) if res.status == 200 else []

def supabase_patch(path, data):
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=30)
    headers = {'apikey': SERVICE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'}
    conn.request('PATCH', f'/rest/v1/{path}', body=json.dumps(data), headers=headers)
    res = conn.getresponse()
    res.read()
    return res.status

def scrape(url):
    payload = json.dumps({"url": url, "formats": ["markdown", "rawHtml"]}).encode('utf-8')
    req = urllib.request.Request(
        "https://api.firecrawl.dev/v1/scrape", data=payload,
        headers={'Authorization': f'Bearer {FIRECRAWL_KEY}', 'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except:
        return None

def dl(url, path):
    try:
        # Try with different user agents
        for ua in [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        ]:
            try:
                h = {'User-Agent': ua}
                req = urllib.request.Request(url, headers=h)
                with urllib.request.urlopen(req, timeout=30) as r:
                    d = r.read()
                    if len(d) >= 500:
                        ct = r.headers.get('Content-Type', '')
                        if 'png' in ct: path = path.replace('.jpg', '.png')
                        elif 'webp' in ct: path = path.replace('.jpg', '.webp')
                        with open(path, 'wb') as f: f.write(d)
                        print(f"  ✅ Downloaded {len(d)} bytes")
                        return path
            except:
                continue
        print(f"  ❌ All UA failed for {url[:60]}")
        return False
    except Exception as e:
        print(f"  ❌ {e}")
        return False

def upload(path, name):
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=60)
    hdrs = {'apikey': SERVICE_KEY, 'Authorization': f'Bearer {SERVICE_KEY}', 'Content-Type': 'image/jpeg'}
    ext = os.path.splitext(path)[1].lower()
    if ext == '.png': hdrs['Content-Type'] = 'image/png'
    elif ext == '.webp': hdrs['Content-Type'] = 'image/webp'
    with open(path, 'rb') as f:
        data = f.read()
    conn.request('POST', f'/storage/v1/object/{STORAGE_BUCKET}/{name}', body=data, headers=hdrs)
    res = conn.getresponse()
    body = res.read().decode()
    if res.status in (200, 201):
        return f"{SUPABASE_BASE}/storage/v1/object/public/{STORAGE_BUCKET}/{name}"
    return None

def fix(pid, slug, img_url):
    r = dl(img_url, f"/tmp/{slug}.jpg")
    if not r: return False
    ext = os.path.splitext(r)[1]
    pub = upload(r, f"{slug}{ext}")
    if not pub:
        try: os.remove(r)
        except: pass
        return False
    st = supabase_patch(f"products?id=eq.{pid}", {"image_url": pub})
    if st in (200, 204):
        print(f"  ✅ DB updated!")
        try: os.remove(r)
        except: pass
        return True
    return False

# Get remaining
null = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=is.null&limit=200")
empty = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=eq.&limit=200")
remaining = (null or []) + (empty or [])

print(f"Remaining: {len(remaining)}")

# Direct known image URLs from common sources
known_images = {
    'suntec-impuls-26-eco-r290': [
        'https://www.suntecwellness.com/media/catalog/product/impuls_26_eco_r290.jpg',
        'https://media.suntecwellness.com/images/impuls-26-eco-r290.jpg',
    ],
    'cecotec-forceclima-12250-smartheati': [
        'https://cecotec.es/media/catalog/product/forceclima-12250-smartheating.jpg',
        'https://www.cecotec.es/on/demandware.static/-/Sites/default/dwforceclima12250.jpg',
    ],
    'klarstein-kraftwerk-smart-10k': [
        'https://www.klarstein.fr/WebRoot/Store22/Shops/63005528/MediaGallery/Kraftwerk_Smart_10K.jpg',
        'https://media.klarstein.fr/images/Kraftwerk_Smart_10K.jpg',
    ],
    'cowboy-cross-st': [
        'https://cdn.shopify.com/s/files/1/2576/1062/products/cowboy-cross-st.jpg',
        'https://www.cowboy.com/cdn/shop/files/cowboy-cross-st_1024x.jpg',
    ],
    'specialized-turbo-vado-sl-2': [
        'https://www.specialized.com/medias/Turbo-Vado-SL-2-5.0-2025.jpg',
        'https://s7d1.scene7.com/is/image/specialized/turbo-vado-sl-2-50',
    ],
    'samsung-s95f-65-qd-oled-tq65s95f-20': [
        'https://images.samsung.com/fr/s95f/tq65s95f.jpg',
        'https://image.samsung.com/fr/tvs/qd-oled-tv/s95f/tq65s95f.jpg',
    ],
}

success = 0
for prod in remaining:
    pid = prod['id']
    name = prod['name']
    slug = prod['slug']
    brand = prod.get('brand', '')
    
    print(f"\n{'='*50}")
    print(f"📦 {name[:45]}")
    
    found_url = None
    
    # Try known URLs first
    if slug in known_images:
        for url in known_images[slug]:
            print(f"  🔍 Trying known URL: {url[:70]}")
            r = dl(url, "/tmp/test.jpg")
            if r:
                found_url = url
                print(f"  ✅ Working URL: {url[:70]}")
                break
            time.sleep(0.5)
    
    # Try Google Images with more specific queries
    if not found_url:
        queries = [
            f"{brand} {name}",
            f"{name} product photo",
            f"{name} image",
        ]
        for q in queries:
            print(f"  🔍 Google: {q[:50]}")
            result = scrape(f"https://www.google.com/search?tbm=isch&q={urllib.parse.quote(q)}")
            if result and result.get('success'):
                md = result.get('data', {}).get('markdown', '')
                if md:
                    imgs = re.findall(r'!\[.*?\]\((https?://[^\)]+\.(?:jpg|jpeg|png|webp)[^\)]*)\)', md)
                    for u in imgs:
                        uc = u.split('?')[0]
                        if all(x not in uc.lower() for x in ['google', 'logo', 'gstatic', 'favicon', 'icon']):
                            if len(uc) > 40:
                                found_url = uc
                                print(f"  ✅ Google: {uc[:70]}")
                                break
            if found_url:
                break
            time.sleep(1)
    
    if found_url:
        if fix(pid, slug, found_url):
            success += 1
    else:
        print(f"  ⏭️ Cannot find image")
    
    time.sleep(2)

print(f"\n{'='*50}")
print(f"📊 Batch result: {success} fixed")
print(f"{'='*50}")

# Final
null2 = supabase_get("products?select=id,name,slug,amazon_asin,image_url&image_url=is.null&limit=200") or []
empty2 = supabase_get("products?select=id,name,slug,amazon_asin,image_url&image_url=eq.&limit=200") or []
final = (null2 or []) + (empty2 or [])
print(f"\nFinal remaining: {len(final)}")
for p in final:
    print(f"  {p.get('name','?')[:45]}")
print(f"Total fixed: {40 - len(final)}")

#!/usr/bin/env python3
"""Last resort for remaining ASIN products - Google image search + direct curl."""

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
    return None

# Get remaining
null_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=is.null&limit=200") or []
empty_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=eq.&limit=200") or []
remaining = null_prods + empty_prods
print(f"Total remaining: {len(remaining)}")

asin_prods = [p for p in remaining if p.get('amazon_asin')]
non_asin_prods = [p for p in remaining if not p.get('amazon_asin')]

processed_good = 0

# First try non-ASIN products with more targeted searches
print(f"\n{'='*50}")
print(f"📋 Non-ASIN products: {len(non_asin_prods)}")
print(f"{'='*50}")

# Known websites where we can find product images
targeted_searches = {
    "gazelle-ultimate-t10-hmb": ("https://www.gazelle.nl/fietsen/gazelle-ultimate-t10-hmb", "Gazelle"),
    "philips-oled909-55-55oled90912-2024": ("https://www.philips.fr/c-p/55OLED909_12/oled-909", "Philips"),
    "cowboy-cross-st": ("https://cowboy.com/products/cowboy-cross", "Cowboy"),
    "cube-touring-hybrid-one-500": ("https://www.cube.eu/en/products/touring-hybrid-one-500/", "Cube"),
    "specialized-turbo-vado-sl-2": ("https://www.specialized.com/fr/fr/turbo-vado-sl-2/p", "Specialized"),
    "canyon-commuter-on-8": ("https://www.canyon.com/fr-fr/velos-electriques/velos-de-ville/commuter-on/commuter-on-8.html", "Canyon"),
    "yamaha-crosscore-rc": ("https://www.yamaha-motor.eu/fr/fr/products/motocycles/electric/crosscore-rc/", "Yamaha"),
    "asus-zenbook-14-oled-ux3405ca": ("https://www.asus.com/fr/laptops/for-home/zenbook/zenbook-14-oled-ux3405/", "ASUS"),
    "philips-oled910-65-65oled91012-2025": ("https://www.philips.fr/c-p/65OLED910_12/oled-910", "Philips"),
    "dell-xps-13-9350": ("https://www.dell.com/fr-fr/shop/ordinateurs-portables/xps-13-9350/", "Dell"),
    "decathlon-stilus-e-touring": ("https://www.decathlon.fr/p/velo-ville-electrique/", "Decathlon"),
    "samsung-s95f-65-qd-oled-tq65s95f-20": ("https://www.samsung.com/fr/tvs/qd-oled-tv/s95f/", "Samsung"),
    "suntec-impuls-26-eco-r290": ("https://www.suntecwellness.com/fr/climatisation-sans-tuyau/", "Suntec"),
    "cecotec-forceclima-12250-smartheati": ("https://www.cecotec.es/climatizacion/", "Cecotec"),
    "klarstein-kraftwerk-smart-10k": ("https://www.klarstein.fr/", "Klarstein"),
}

for prod in non_asin_prods:
    pid = prod['id']
    name = prod['name']
    slug = prod['slug']
    brand = prod.get('brand', '')
    
    print(f"\n{'='*50}")
    print(f"📦 {name[:50]}")
    print(f"   slug={slug}")
    
    img_url = None
    
    # Try Google Image search via Firecrawl
    print(f"  🔍 Google Images...")
    query = urllib.parse.quote(f"{brand} {name} site")
    result = scrape_firecrawl(f"https://www.google.com/search?tbm=isch&q={query}", ["markdown"])
    if result and result.get('success'):
        md = result.get('data', {}).get('markdown', '')
        if md:
            # Find image links in markdown
            urls = re.findall(r'!\[.*?\]\((https?://[^\)]+\.(?:jpg|jpeg|png|webp)[^\)]*)\)', md)
            for u in urls:
                u_clean = u.split('?')[0]
                if all(x not in u_clean.lower() for x in ['google', 'logo', 'gstatic', 'favicon']):
                    img_url = u_clean
                    print(f"  ✅ Found: {img_url[:80]}")
                    break
    
    # Try targeted website
    if not img_url and slug in targeted_searches:
        site_url, site_name = targeted_searches[slug]
        print(f"  🔍 {site_name} official site...")
        result = scrape_firecrawl(site_url, ["markdown"])
        if result and result.get('success'):
            md = result.get('data', {}).get('markdown', '')
            if md:
                urls = re.findall(r'!\[.*?\]\((https?://[^\)]+\.(?:jpg|jpeg|png|webp)[^\)]*)\)', md)
                for u in urls:
                    u_clean = u.split('?')[0]
                    if all(x not in u_clean.lower() for x in ['google', 'logo', 'gstatic', 'favicon']):
                        img_url = u_clean
                        print(f"  ✅ Found on {site_name}: {img_url[:80]}")
                        break
    
    if not img_url:
        # Try one more generic search
        print(f"  🔍 Generic search...")
        query = urllib.parse.quote(f"{name} acheter")
        result = scrape_firecrawl(f"https://www.google.com/search?tbm=isch&q={query}", ["markdown"])
        if result and result.get('success'):
            md = result.get('data', {}).get('markdown', '')
            if md:
                urls = re.findall(r'!\[.*?\]\((https?://[^\)]+\.(?:jpg|jpeg|png|webp)[^\)]*)\)', md)
                for u in urls:
                    u_clean = u.split('?')[0]
                    if all(x not in u_clean.lower() for x in ['google', 'logo', 'gstatic', 'favicon', 'placeholder']):
                        img_url = u_clean
                        print(f"  ✅ Found: {img_url[:80]}")
                        break
    
    if not img_url:
        print(f"  ⏭️ No image found")
        time.sleep(2)
        continue
    
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
        processed_good += 1
        try: os.remove(result_path)
        except: pass
    
    time.sleep(3)

# For the 2 ASIN products, try once more with a different approach
print(f"\n{'='*50}")
print(f"📋 ASIN products: {len(asin_prods)}")
print(f"{'='*50}")

for prod in asin_prods:
    pid = prod['id']
    name = prod['name']
    slug = prod['slug']
    asin = prod['amazon_asin']
    
    print(f"\n{'='*50}")
    print(f"📦 {name[:50]}")
    print(f"   ASIN: {asin}")
    
    # Try Amazon.com (US) instead of Amazon.fr
    print(f"  🔍 Amazon.com...")
    result = scrape_firecrawl(f"https://www.amazon.com/dp/{asin}", ["rawHtml", "markdown"])
    if result and result.get('success'):
        raw = result.get('data', {}).get('rawHtml', '') or ''
        md = result.get('data', {}).get('markdown', '') or ''
        
        combined = raw + md
        # Find Amazon image
        imgs = re.findall(r'https?://m\.media-amazon\.com/images/I/[^\s"\'<>\)]+', combined)
        for u in imgs:
            u = u.replace('\\u0026', '&').replace('\\/', '/').split('?')[0]
            if ('._AC_SL' in u or '._AC_SX' in u or '._SY' in u or u.endswith('.jpg')) and 'ShoppingPortal' not in u and 'logo' not in u.lower():
                print(f"  ✅ Found on Amazon.com: {u[:80]}")
                
                result_path = download_image(u, f"/tmp/{slug}.jpg")
                if result_path:
                    ext = os.path.splitext(result_path)[1]
                    public_url = upload_to_supabase(result_path, f"{slug}{ext}")
                    if public_url:
                        status = supabase_patch(f"products?id=eq.{pid}", {"image_url": public_url})
                        if status in (200, 204):
                            print(f"  ✅ DB updated!")
                            processed_good += 1
                            try: os.remove(result_path)
                            except: pass
                            break
                break
    
    time.sleep(3)

print(f"\n{'='*50}")
print(f"📊 Total newly fixed this batch: {processed_good}")
print(f"{'='*50}")

# Final check
null_prods = supabase_get("products?select=id,name,amazon_asin,image_url&image_url=is.null&limit=200") or []
empty_prods = supabase_get("products?select=id,name,amazon_asin,image_url&image_url=eq.&limit=200") or []
final_remaining = (null_prods or []) + (empty_prods or [])
print(f"\nFinal remaining without images: {len(final_remaining)}")
for p in final_remaining:
    print(f"  {p.get('name','?')[:45]} | ASIN={p.get('amazon_asin','—')[:15]}")

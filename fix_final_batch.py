#!/usr/bin/env python3
"""Fix more remaining products with better searches."""

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

def scrape_firecrawl(url):
    payload = json.dumps({"url": url, "formats": ["markdown", "rawHtml"]}).encode('utf-8')
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

def process_and_upload(prod, img_url):
    pid, name, slug = prod['id'], prod['name'], prod['slug']
    
    result_path = download_image(img_url, f"/tmp/{slug}.jpg")
    if not result_path:
        return False
    
    ext = os.path.splitext(result_path)[1]
    storage_path = f"{slug}{ext}"
    public_url = upload_to_supabase(result_path, storage_path)
    
    if not public_url:
        try: os.remove(result_path)
        except: pass
        return False
    
    status = supabase_patch(f"products?id=eq.{pid}", {"image_url": public_url})
    if status in (200, 204):
        print(f"  ✅ DB updated!")
        try: os.remove(result_path)
        except: pass
        return True
    return False

# Get remaining
null_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=is.null&limit=200") or []
empty_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=eq.&limit=200") or []
remaining = (null_prods or []) + (empty_prods or [])

print(f"Remaining: {len(remaining)}")

success = 0

for prod in remaining:
    pid = prod['id']
    name = prod['name']
    slug = prod['slug']
    brand = prod.get('brand', '')
    asin = prod.get('amazon_asin', '')
    
    print(f"\n{'='*50}")
    print(f"📦 {name[:50]}")
    
    img_url = None
    
    if asin and asin in ('B09P8B4CVP', 'B07PB63NLD'):
        # Use product name + brand search on Google Shopping/Idealo
        print(f"  🔍 Searching Google for {brand} {name}...")
        
    # Try manufacturer official site directly
    if slug == 'dreo-cruiser-pro-t1':
        result = scrape_firecrawl("https://www.dreo.com/products/dreo-cruiser-pro-t1")
    elif slug == 'honeywell-quietset-hyf500e4':
        result = scrape_firecrawl("https://www.honeywellstore.com/honeywell-quietset-hyf500e4.htm")
    elif slug == 'suntec-impuls-26-eco-r290':
        result = scrape_firecrawl("https://www.suntecwellness.com/fr/produits/impuls-26-eco-r290/")
    elif slug == 'cecotec-forceclima-12250-smartheati':
        result = scrape_firecrawl("https://www.cecotec.es/climatizacion/aire-acondicionado/forceclima-12250-smartheating/")
    elif slug == 'klarstein-kraftwerk-smart-10k':
        result = scrape_firecrawl("https://www.klarstein.fr/Groupe-electrogene-Klarstein-Kraftwerk-Smart-10K/10036979.html")
    elif slug == 'gazelle-ultimate-t10-hmb':
        result = scrape_firecrawl("https://www.gazelle.nl/fietsen/gazelle-ultimate-t10-hmb")
    elif slug == 'cowboy-cross-st':
        result = scrape_firecrawl("https://cowboy.com/fr/products/cowboy-cross")
    elif slug == 'specialized-turbo-vado-sl-2':
        result = scrape_firecrawl("https://www.specialized.com/fr/fr/turbo-vado-sl-2/p/216411")
    elif slug == 'yamaha-crosscore-rc':
        result = scrape_firecrawl("https://www.yamaha-motor.eu/fr/fr/products/motocycles/electric/crosscore-rc/")
    elif slug == 'dell-xps-13-9350':
        result = scrape_firecrawl("https://www.dell.com/fr-fr/shop/ordinateurs-portables/xps-13-9350/spd/xps-13-9350-laptop")
    elif slug == 'decathlon-stilus-e-touring':
        result = scrape_firecrawl("https://www.decathlon.fr/p/velo-ville-electrique-stilus-e-touring/_/R-p-339753")
    elif slug == 'samsung-s95f-65-qd-oled-tq65s95f-20':
        result = scrape_firecrawl("https://www.samsung.com/fr/tvs/qd-oled-tv/s95f-65-inch-tq65s95f/")
    elif slug == 'specialized-turbo-vado-sl-2':
        result = scrape_firecrawl(
            "https://www.google.com/search?tbm=isch&q=" + urllib.parse.quote("Specialized Turbo Vado SL 2"))
    else:
        result = None
    
    if result and result.get('success'):
        raw = result.get('data', {}).get('rawHtml', '') or ''
        md = result.get('data', {}).get('markdown', '') or ''
        
        combined = raw + "\n" + md
        
        # Find image URLs - look for product images (jpg/png)
        img_matches = re.findall(r'(https?://[^\s"\'<>\)]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"\'<>\)]*)?)', combined)
        
        # Score images: prefer larger ones, skip logos/icons
        scored = []
        for u in img_matches:
            u_clean = u.split('?')[0]
            if any(x in u_clean.lower() for x in ['logo', 'icon', 'favicon', 'banner', 'cart', 'checkout']):
                continue
            if any(x in u_clean.lower() for x in ['google', 'gstatic', 'facebook']):
                continue
            score = 0
            if 'product' in u_clean.lower(): score += 3
            if 'image' in u_clean.lower(): score += 2
            if 'large' in u_clean.lower() or 'big' in u_clean.lower(): score += 1
            if u_clean.endswith('.jpg'): score += 1
            if len(u_clean) > 40: score += 1  # Likely a real product image
            scored.append((score, u_clean))
        
        scored.sort(reverse=True)
        
        if scored:
            best = scored[0][1]
            print(f"  ✅ Found: {best[:80]}")
            if process_and_upload(prod, best):
                success += 1
                print(f"  ✅ Fixed!")
                continue
    else:
        print(f"  ⚠️ No data from Firecrawl")
    
    # If we still don't have an image, do a last-resort Google search
    print(f"  🔍 Google last attempt...")
    query = urllib.parse.quote(f"{brand} {name}")
    result = scrape_firecrawl(f"https://www.google.com/search?tbm=isch&q={query}")
    if result and result.get('success'):
        md = result.get('data', {}).get('markdown', '')
        if md:
            urls = re.findall(r'https?://[^\s\)"\'<>]+\.(?:jpg|jpeg|png|webp)', md)
            for u in urls:
                u_clean = u.split('?')[0]
                if all(x not in u_clean.lower() for x in ['google', 'logo', 'gstatic', 'favicon']):
                    print(f"  ✅ Google found: {u_clean[:80]}")
                    if process_and_upload(prod, u_clean):
                        success += 1
                        break
    
    time.sleep(2)

print(f"\n{'='*50}")
print(f"📊 This batch: {success} fixed")
print(f"{'='*50}")

# Final check
null_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=is.null&limit=200") or []
empty_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=eq.&limit=200") or []
final = (null_prods or []) + (empty_prods or [])
print(f"\nFinal remaining: {len(final)}")
for p in final:
    print(f"  {p.get('name','?')[:45]} | ASIN={p.get('amazon_asin','—')[:12]}")

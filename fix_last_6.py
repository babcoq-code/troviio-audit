#!/usr/bin/env python3
"""Final attempt for the 6 remaining products."""

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
        h = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
        req = urllib.request.Request(url, headers=h)
        with urllib.request.urlopen(req, timeout=30) as r:
            d = r.read()
            if len(d) < 500: return False
            ct = r.headers.get('Content-Type', '')
            if 'png' in ct: path = path.replace('.jpg', '.png')
            elif 'webp' in ct: path = path.replace('.jpg', '.webp')
            with open(path, 'wb') as f: f.write(d)
            print(f"  ✅ DL {len(d)}b")
            return path
    except Exception as e:
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

print(f"6 remaining products")

success = 0
for prod in remaining:
    pid = prod['id']
    name = prod['name']
    slug = prod['slug']
    brand = prod.get('brand', '')
    
    print(f"\n{'='*50}")
    print(f"📦 {name[:50]}")
    
    found_url = None
    
    # Very targeted searches
    targets = {
        'suntec-impuls-26-eco-r290': [
            'https://www.cdiscount.com/electromenager/climatiseur-mobile/r-suntec+impuls+2.6+eco+r290.html',
            'https://www.leroymerlin.fr/produits/chauffage-plomberie/chauffage/climatisation/climatiseur-mobile/',
        ],
        'cecotec-forceclima-12250-smartheati': [
            'https://www.cdiscount.com/electromenager/climatiseur-mobile/r-cecotec+forceclima+12250.html',
            'https://cecotec.es/climatizacion/aire-acondicionado/forceclima-12250-smartheating/',
        ],
        'klarstein-kraftwerk-smart-10k': [
            'https://www.klarstein.fr/Groupe-electrogene-Klarstein-Kraftwerk-Smart-10K/10036979.html',
            'https://www.amazon.fr/dp/B0XXXXXXXXX',  # try generic search
        ],
        'cowboy-cross-st': [
            'https://cowboy.com/fr/shop/cowboy-cross',
            'https://cowboy.com/products/cowboy-cross',
        ],
        'specialized-turbo-vado-sl-2': [
            'https://www.specialized.com/us/en/turbo-vado-sl-2/p',
            'https://www.specialized.com/fr/fr/shop/bikes/e-bikes/turbo-vado-sl/c/turbo-vado-sl',
        ],
        'samsung-s95f-65-qd-oled-tq65s95f-20': [
            'https://www.samsung.com/fr/tvs/qd-oled-tv/s95f-65-inch-tq65s95f/',
            'https://www.darty.com/nav/achat/tv-home-cinema/tv/tv-oled/samsung_tq65s95f.html',
        ],
    }
    
    if slug in targets:
        for t_url in targets[slug]:
            print(f"  🔍 {t_url[:60]}...")
            result = scrape(t_url)
            if result and result.get('success'):
                raw = result.get('data', {}).get('rawHtml', '') or ''
                md = result.get('data', {}).get('markdown', '') or ''
                combined = raw + "\n" + md
                
                # Find product images
                imgs = re.findall(r'(https?://[^\s"\'<>\)]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"\'<>\)]*)?)', combined)
                for u in imgs:
                    uc = u.split('?')[0]
                    if any(x in uc.lower() for x in ['logo', 'icon', 'favicon', 'google', 'gstatic']):
                        continue
                    # Prefer images that look like product photos
                    if ('product' in uc.lower() or 'image' in uc.lower() or 'media' in uc.lower() or 'upload' in uc.lower() or 'photo' in uc.lower()):
                        if len(uc) > 40:
                            found_url = uc
                            print(f"  ✅ Found: {uc[:80]}")
                            break
                if found_url:
                    break
                # Fallback: any decent sized jpg
                if not found_url:
                    for u in imgs:
                        uc = u.split('?')[0]
                        if uc.endswith('.jpg') and len(uc) > 40 and 'logo' not in uc.lower():
                            found_url = uc
                            print(f"  ✅ Found: {uc[:80]}")
                            break
    
    # Try one more Google image search if still nothing
    if not found_url:
        print(f"  🔍 Google search...")
        q = urllib.parse.quote(f"{brand} {name}")
        result = scrape(f"https://www.google.com/search?tbm=isch&q={q}")
        if result and result.get('success'):
            md = result.get('data', {}).get('markdown', '')
            if md:
                imgs = re.findall(r'!\[.*?\]\((https?://[^\)]+\.(?:jpg|jpeg|png|webp)[^\)]*)\)', md)
                for u in imgs:
                    uc = u.split('?')[0]
                    if all(x not in uc.lower() for x in ['google', 'logo', 'gstatic']):
                        found_url = uc
                        print(f"  ✅ Google: {uc[:80]}")
                        break
    
    if found_url:
        if fix(pid, slug, found_url):
            success += 1
    else:
        print(f"  ⏭️ No image found")
    
    time.sleep(2)

print(f"\n{'='*50}")
print(f"📊 Fixed this batch: {success}")
print(f"{'='*50}")

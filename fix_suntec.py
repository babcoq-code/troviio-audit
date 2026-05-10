#!/usr/bin/env python3
"""Quick fix for Suntec - it found the image but didn't process."""

import http.client
import json
import os
import re
import urllib.request

SUPABASE_URL = "uukshxztoztkwxuuvqzc.supabase.co"
SUPABASE_BASE = "https://uukshxztoztkwxuuvqzc.supabase.co"
SERVICE_KEY = "SUPABASE_SERVICE_KEY_REMOVED"
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

def dl(url, path):
    try:
        h = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(url, headers=h)
        with urllib.request.urlopen(req, timeout=30) as r:
            d = r.read()
            if len(d) < 500: return False
            ct = r.headers.get('Content-Type', '')
            if 'png' in ct: path = path.replace('.jpg', '.png')
            elif 'webp' in ct: path = path.replace('.jpg', '.webp')
            with open(path, 'wb') as f: f.write(d)
            print(f"  ✅ Downloaded {len(d)} bytes -> {path}")
            return path
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
        url = f"{SUPABASE_BASE}/storage/v1/object/public/{STORAGE_BUCKET}/{name}"
        print(f"  ✅ Uploaded")
        return url
    else:
        print(f"  ❌ {res.status}: {body[:200]}")
    return None

# Find Suntec product
prods = supabase_get("products?select=id,name,slug,image_url&or=(image_url.is.null,image_url.eq.)&limit=200")
suntec = [p for p in prods if 'suntec' in p['slug'].lower()]
if suntec:
    p = suntec[0]
    pid = p['id']
    slug = p['slug']
    print(f"Found: {p['name']}")
    
    # Try to get image from Cdiscount
    img_url = "https://www.cdiscount.com/commercialoperations/images/128024c1-f7e5-4875-90a0-e861933ff5c9.jpg"
    
    r = dl(img_url, f"/tmp/{slug}.jpg")
    if r:
        ext = os.path.splitext(r)[1]
        pub = upload(r, f"{slug}{ext}")
        if pub:
            st = supabase_patch(f"products?id=eq.{pid}", {"image_url": pub})
            print(f"  DB update: {st}")
            try: os.remove(r)
            except: pass

# Also check remaining
null = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=is.null&limit=200")
empty = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=eq.&limit=200")
remaining = (null or []) + (empty or [])
print(f"\nStill remaining: {len(remaining)}")
for p in remaining:
    print(f"  {p.get('name','?')[:45]} | ASIN={p.get('amazon_asin','—')}")

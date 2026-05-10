#!/usr/bin/env python3
"""Debug: find products without images."""

import http.client
import json

SUPABASE_URL = "uukshxztoztkwxuuvqzc.supabase.co"
SERVICE_KEY = "SUPABASE_SERVICE_KEY_REMOVED"

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
        print(f"Status {res.status}: {body[:500]}")
        return None
    return json.loads(body)

# Check available columns
print("=== A few products with image_url ===")
data = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&limit=10")
if data:
    for p in data:
        print(f"  name={p.get('name','?')[:40]} | image_url={p.get('image_url','NULL')!r} | amazon_asin={p.get('amazon_asin','')}")

# Count with null image_url
print("\n=== Products with null image_url ===")
data2 = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=is.null&limit=200")
if data2:
    print(f"Count: {len(data2)}")
    for p in data2:
        print(f"  {p.get('name','?')[:40]} | amazon_asin={p.get('amazon_asin','')}")

# Count with empty image_url
print("\n=== Products with empty image_url ===")
data3 = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=eq.&limit=200")
if data3:
    print(f"Count: {len(data3)}")
    for p in data3:
        print(f"  {p.get('name','?')[:40]} | amazon_asin={p.get('amazon_asin','')}")

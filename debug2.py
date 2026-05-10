#!/usr/bin/env python3
"""Debug: test Supabase connection with proper headers."""

import http.client
import json

SUPABASE_URL = "uukshxztoztkwxuuvqzc.supabase.co"
SERVICE_KEY = "SUPABASE_SERVICE_KEY_REMOVED"

# Try with just the service key as JWT, no apikey
def supabase_get(path):
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=30)
    headers = {
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'application/json'
    }
    conn.request('GET', f'/rest/v1/{path}', headers=headers)
    res = conn.getresponse()
    body = res.read().decode()
    print(f"Status: {res.status}")
    if res.status != 200:
        print(f"Error: {body[:500]}")
        return None
    return json.loads(body)

print("=== Test using service key as apikey ===")
data = supabase_get("products?select=id,slug,name,brand,asin,amazon_asin,image_url&limit=5")
if data:
    print(f"Got {len(data)} products")
    for p in data:
        print(f"  {p.get('name','?')[:40]} | image_url={p.get('image_url','NULL')!r} | ASIN={p.get('asin','')}")

# Try without Authorization header
print("\n=== Without Authorization, only apikey ===")
conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=30)
headers = {
    'apikey': SERVICE_KEY,
    'Content-Type': 'application/json'
}
conn.request('GET', '/rest/v1/products?select=id,slug,name&limit=3', headers=headers)
res = conn.getresponse()
body = res.read().decode()
print(f"Status: {res.status}")
print(f"Body: {body[:300]}")

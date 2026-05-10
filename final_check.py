#!/usr/bin/env python3
"""Final check of remaining products."""

import http.client
import json

SUPABASE_URL = "uukshxztoztkwxuuvqzc.supabase.co"
SERVICE_KEY = "SUPABASE_SERVICE_KEY_REMOVED"

def supabase_get(path):
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=30)
    headers = {'apikey': SERVICE_KEY, 'Content-Type': 'application/json'}
    conn.request('GET', f'/rest/v1/{path}', headers=headers)
    res = conn.getresponse()
    return json.loads(res.read().decode()) if res.status == 200 else None

null_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=is.null&limit=200") or []
empty_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=eq.&limit=200") or []
final = (null_prods or []) + (empty_prods or [])

print(f"Final remaining without images: {len(final)}")
for p in final:
    asin = p.get('amazon_asin') or '—'
    print(f"  {p.get('name','?')[:45]} | ASIN={asin[:15]} | brand={p.get('brand','')[:15]}")

# Also count fixed
fixed_count = 40 - len(final)
print(f"\nTotal fixed: {fixed_count}")
print(f"Total remaining: {len(final)}")

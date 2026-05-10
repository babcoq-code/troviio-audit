#!/usr/bin/env python3
"""Final check."""

import http.client
import json

SUPABASE_URL = "uukshxztoztkwxuuvqzc.supabase.co"
SERVICE_KEY = "SUPABASE_SERVICE_KEY_REMOVED"

def supabase_get(path):
    conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=30)
    headers = {'apikey': SERVICE_KEY, 'Content-Type': 'application/json'}
    conn.request('GET', f'/rest/v1/{path}', headers=headers)
    res = conn.getresponse()
    body = res.read().decode()
    if res.status == 200:
        return json.loads(body)
    return None

null_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=is.null&limit=200")
empty_prods = supabase_get("products?select=id,name,slug,brand,amazon_asin,image_url&image_url=eq.&limit=200")

print("=== NULL ===")
if null_prods:
    for p in null_prods:
        asin = p.get('amazon_asin') or '—'
        print(f"  {p['name'][:45]} | ASIN={asin[:12]}")
else:
    print("  (none or error)")

print("\n=== EMPTY STRING ===")
if empty_prods:
    for p in empty_prods:
        asin = p.get('amazon_asin') or '—'
        print(f"  {p['name'][:45]} | ASIN={asin[:12]}")
else:
    print("  (none or error)")

total_left = (null_prods or []) + (empty_prods or [])
print(f"\nTotal remaining: {len(total_left)}")
print(f"Total fixed: {40 - len(total_left)}")

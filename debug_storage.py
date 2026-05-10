#!/usr/bin/env python3
"""Test Supabase Storage upload."""

import http.client
import json

SUPABASE_URL = "uukshxztoztkwxuuvqzc.supabase.co"
SUPABASE_BASE = "https://uukshxztoztkwxuuvqzc.supabase.co"
SERVICE_KEY = "SUPABASE_SERVICE_KEY_REMOVED"

# Test 1: Check if bucket exists
print("=== Check bucket ===")
conn = http.client.HTTPSConnection(SUPABASE_URL, timeout=15)
headers = {
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json'
}
conn.request('GET', '/storage/v1/bucket', headers=headers)
res = conn.getresponse()
body = res.read().decode()
print(f"Status: {res.status}")
print(f"Body: {body[:500]}")

# Test 2: Try uploading with a simple approach
print("\n=== Test upload to products bucket ===")
# First check if the public URL approach works (using anon key)
conn2 = http.client.HTTPSConnection(SUPABASE_URL, timeout=15)
sample_data = b"test image data"
conn2.request(
    'POST',
    '/storage/v1/object/products/test-upload.jpg',
    body=sample_data,
    headers={
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'image/jpeg',
    }
)
res2 = conn2.getresponse()
body2 = res2.read().decode()
print(f"Status: {res2.status}")
print(f"Body: {body2[:500]}")

# Test 3: Try with apikey header instead
print("\n=== Test with apikey header ===")
conn3 = http.client.HTTPSConnection(SUPABASE_URL, timeout=15)
conn3.request(
    'POST',
    '/storage/v1/object/products/test-upload2.jpg',
    body=sample_data,
    headers={
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'image/jpeg',
    }
)
res3 = conn3.getresponse()
body3 = res3.read().decode()
print(f"Status: {res3.status}")
print(f"Body: {body3[:500]}")

# Test 4: Check if there's an existing object to see URL format
print("\n=== Check existing objects ===")
conn4 = http.client.HTTPSConnection(SUPABASE_URL, timeout=15)
conn4.request('GET', '/storage/v1/object/public/products/', headers={
    'Authorization': f'Bearer {SERVICE_KEY}'
})
res4 = conn4.getresponse()
body4 = res4.read().decode()
print(f"Status: {res4.status}")
print(f"Body: {body4[:500]}")

#!/usr/bin/env python3
"""Debug rawHtml from Firecrawl for a specific ASIN."""

import urllib.request
import json
import re

FIRECRAWL_KEY = "fc-8e117a1377c64c0c866c35adc92e2d0d"

asin = "B09P8B4CVP"  # Dreo Cruiser Pro T1
url = f"https://www.amazon.fr/dp/{asin}"

payload = json.dumps({"url": url, "formats": ["rawHtml"]}).encode('utf-8')
req = urllib.request.Request(
    "https://api.firecrawl.dev/v1/scrape", data=payload,
    headers={'Authorization': f'Bearer {FIRECRAWL_KEY}', 'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode())
        print(f"Success: {data.get('success')}")
        
        if data.get('data'):
            raw = data['data'].get('rawHtml', '')
            print(f"rawHtml length: {len(raw)}")
            print(f"\n--- First 3000 chars ---")
            print(raw[:3000])
            
            # Find any images
            imgs = re.findall(r'https?://[^\s"\'<>]+\.(?:jpg|jpeg|png|webp)', raw)
            print(f"\n\n--- Images found ({len(imgs)}) ---")
            for i, u in enumerate(imgs[:20]):
                print(f"  {i}: {u[:120]}")
            
            # Also look for JSON data
            jsons = re.findall(r'colorImages.*?}]\]', raw, re.DOTALL)
            if jsons:
                print(f"\n--- Color images JSON ({len(jsons)}) ---")
                print(jsons[0][:500])
            
except Exception as e:
    print(f"Error: {e}")

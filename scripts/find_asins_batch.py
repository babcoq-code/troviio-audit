#!/usr/bin/env python3
"""
Batch ASIN finder using Troviio Scraper (internal Playwright service).
Usage: python3 find_asins_batch.py [start_index] [batch_size]
"""
import json
import sys
import time
import re
import os
import requests

from supabase import create_client

SUPABASE_URL = "os.getenv("SUPABASE_URL", "")"
SUPABASE_KEY = "SUPABASE_SERVICE_KEY_PLACEHOLDER"
SCRAPER_URL = "http://localhost:3002"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
count = int(sys.argv[2]) if len(sys.argv) > 2 else 9999

r = supabase.table("products").select("slug,name,brand,model").is_("amazon_asin", "null").order("slug").execute()
prods = r.data
batch = prods[start:start+count]
total = len(prods)

try:
    with open("/tmp/asins_auto.json") as f:
        existing = json.load(f)
except:
    existing = {}

def search_asin(name, brand, model):
    """Search via internal scraper."""
    name_clean = re.sub(r"[⭐🌟★]", "", name or "").split("(")[0].split("—")[0].strip()
    brand = (brand or "").strip()
    model = (model or "").strip() if model != "None" else ""
    
    queries = []
    if brand and model and brand != "None":
        queries.append(f"{brand} {model}")
        queries.append(f"{brand} {name_clean[:50]}")
    queries.append(name_clean[:70])
    queries.append(name_clean[:50])
    
    for q in queries:
        try:
            resp = requests.get(f"{SCRAPER_URL}/search-asin", params={"q": q}, timeout=45)
            data = resp.json()
            if data.get("asin"):
                return data["asin"]
        except:
            pass
        time.sleep(0.3)
    return None

new_found = {}
failed = []

for i, p in enumerate(batch):
    slug = p["slug"]
    idx = start + i + 1
    
    if slug in existing:
        print(f"[{idx}/{total}] ✓ {slug[:35]:35s} → déjà ({existing[slug]})")
        continue
    
    print(f"[{idx}/{total}] {slug[:35]:35s}... ", end="", flush=True)
    asin = search_asin(p.get("name",""), p.get("brand",""), p.get("model",""))
    
    if asin:
        new_found[slug] = asin
        print(f"✓ {asin}")
    else:
        failed.append(slug)
        print(f"✗")
    
    # Save progress every 5
    if len(new_found) % 5 == 0 and new_found:
        existing.update(new_found)
        with open("/tmp/asins_auto.json", "w") as f:
            json.dump(existing, f, indent=2)
        # Update Supabase
        for sl, asin_val in new_found.items():
            supabase.table("products").update({"amazon_asin": asin_val}).eq("slug", sl).execute()
        new_found = {}
        
    time.sleep(0.5)

# Final save
existing.update(new_found)
with open("/tmp/asins_auto.json", "w") as f:
    json.dump(existing, f, indent=2)

if new_found:
    for sl, asin_val in new_found.items():
        supabase.table("products").update({"amazon_asin": asin_val}).eq("slug", sl).execute()

print(f"\n--- Résultats ---")
print(f"Trouvés ce lot: {len(new_found)}/{len(batch)}")
print(f"Total cumulé: {len(existing)}/{total}")
print(f"Échecs: {len(failed)}")
if failed:
    print(f"Liste des échecs:")
    for s in failed:
        print(f"  {s}")

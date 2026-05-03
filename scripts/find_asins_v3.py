#!/usr/bin/env python3
"""
ASIN Finder v3 - priorise les produits avec marque+modèle spécifiques.
"""
import json, sys, time, re, os, requests
from supabase import create_client

SUPABASE_URL = "os.getenv("SUPABASE_URL", "")"
SUPABASE_KEY = "SUPABASE_SERVICE_KEY_PLACEHOLDER"

# Try multiple URLs for the scraper (host network = localhost, docker network = troviio-scraper)
SCRAPER_URLS = [
    "http://localhost:3002",
    "http://host.docker.internal:3002",
    "http://troviio-scraper:3002",
]

def get_scraper_url():
    for url in SCRAPER_URLS:
        try:
            r = requests.get(f"{url}/search-asin", params={"q":"test"}, timeout=3)
            return url
        except:
            continue
    return "http://localhost:3002"  # default

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

SCRAPER_URL = get_scraper_url()
print(f"Scraper URL: {SCRAPER_URL}")

try:
    with open("/tmp/asins_v3.json") as f:
        existing = json.load(f)
except:
    existing = {}

def search_asin(name, brand, model):
    name_clean = re.sub(r"[⭐🌟★]", "", name or "").split("(")[0].split("—")[0].strip()
    brand = (brand or "").strip()
    model = (model or "").strip() if model != "None" else ""

    queries = []
    if brand and model:
        queries.append(f"{brand} {model}")
    queries.append(name_clean[:70])
    
    for q in queries:
        try:
            resp = requests.get(f"{SCRAPER_URL}/search-asin", params={"q": q}, timeout=45)
            data = resp.json()
            if data.get("asin"):
                return data["asin"]
        except:
            pass
        time.sleep(0.2)
    return None

r = supabase.table("products").select("slug,name,brand,model").is_("amazon_asin", "null").execute()
prods = r.data

# Prioriser
priority1, priority2, priority3 = [], [], []
for p in prods:
    slug = p["slug"]
    brand = (p.get("brand") or "").strip() if p.get("brand") != "None" else ""
    model = (p.get("model") or "").strip() if p.get("model") != "None" else ""
    if slug in existing:
        continue
    name = p.get("name", "")
    if re.search(r'(iPhone.*1[7]|SE 4|Galaxy S26)', name):
        priority3.append(p)
    elif brand and model:
        priority1.append(p)
    elif brand:
        priority2.append(p)
    else:
        priority3.append(p)

print(f"P1 (marque+modèle): {len(priority1)}")
print(f"P2 (marque): {len(priority2)}")
print(f"P3 (génériques): {len(priority3)}")

found = {}
batch = priority1[:99]
total_batch = len(batch)

for i, p in enumerate(batch):
    slug = p["slug"]
    print(f"[{i+1}/{total_batch}] {slug[:35]:35s}... ", end="", flush=True)
    asin = search_asin(p.get("name",""), p.get("brand",""), p.get("model",""))
    if asin:
        found[slug] = asin
        print(f"✓ {asin}")
    else:
        print(f"✗")
    time.sleep(0.5)
    
    if len(found) >= 5:
        existing.update(found)
        for sl, av in found.items():
            supabase.table("products").update({"amazon_asin": av}).eq("slug", sl).execute()
        with open("/tmp/asins_v3.json", "w") as f:
            json.dump(existing, f, indent=2)
        found = {}

existing.update(found)
for sl, av in found.items():
    supabase.table("products").update({"amazon_asin": av}).eq("slug", sl).execute()
with open("/tmp/asins_v3.json", "w") as f:
    json.dump(existing, f, indent=2)

print(f"\n✅ Trouvés: {len(existing)}/{len(prods)}")
for s, a in sorted(existing.items()):
    print(f"  {s}: {a}")

#!/usr/bin/env python3
"""
🔍 ASIN Finder for Troviio/Picksy
Cherche les ASINs Amazon des 236 produits sans ASIN, via DuckDuckGo.
À exécuter depuis ta machine personnelle (pas le VPS — IP blacklistée).

Usage: python3 find_asins.py [start_index] [batch_size]

Par défaut: traite tout d'un coup.
Pour reprendre: python3 find_asins.py 50 50 (reprend au 50e)

Les résultats sont sauvegardés dans asins_found.json au fur et à mesure.
"""

import re
import json
import time
import os
import sys
import requests

# ===== CONFIG =====
SUPABASE_URL = "https://uukshxztoztkwxuuvqzc.supabase.co"
SUPABASE_KEY = "SUPABASE_SERVICE_KEY_PLACEHOLDER"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept-Language": "fr-FR,fr;q=0.9",
}

session = requests.Session()
session.headers.update(HEADERS)

RESULTS_FILE = "asins_found.json"


def search_ddg(query):
    """Search DuckDuckGo (non-blocking for residential IPs)."""
    try:
        resp = session.get(
            "https://html.duckduckgo.com/html/",
            params={"q": query},
            timeout=10,
        )
        return resp.text
    except:
        return ""


def extract_asins(html):
    """Extract valid Amazon ASINs from HTML."""
    asins = set()
    for m in re.finditer(r'(?:/dp/|product/|asin=|ASIN=|asin:)([A-Z0-9]{10})', html):
        a = m.group(1)
        if a.startswith(('B', '0')):
            asins.add(a)
    for m in re.finditer(r'\b(B0[A-Z0-9]{8})\b', html):
        asins.add(m.group(1))
    for m in re.finditer(r'\b(B[A-Z0-9]{2}[A-Z0-9]{7})\b', html):
        if len(m.group(1)) == 10:
            asins.add(m.group(1))
    return [a for a in asins if len(a) == 10 and a.startswith('B')]


def find_asin(slug, name, brand, model):
    """Try multiple queries to find the ASIN."""
    name_clean = re.sub(r'[⭐🌟★]', '', name or '').split('(')[0].split('—')[0].strip()
    brand = (brand or '').strip()
    model = (model or '').strip() if model != 'None' else ''

    # Build targeted queries
    queries = []
    if brand and model:
        queries.append(f"{brand} {model} Amazon")
        queries.append(f"{brand} {model}")
    queries.append(f"{name_clean[:70]} Amazon ASIN")
    queries.append(f"{name_clean[:60]} acheter")

    for q in queries[:4]:
        html = search_ddg(q)
        asins = extract_asins(html)
        if asins:
            return asins[0], q
        time.sleep(0.3)
    return None, None


def main():
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    batch = int(sys.argv[2]) if len(sys.argv) > 2 else 9999

    # Connect to Supabase
    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except ImportError:
        print("❌ Installe supabase: pip install supabase")
        sys.exit(1)

    # Load products without ASIN
    r = supabase.table("products").select("slug,name,brand,model").is_("amazon_asin", "null").order("slug").execute()
    products = r.data
    batch_list = products[start:start + batch]
    total = len(products)

    # Load existing findings
    if os.path.exists(RESULTS_FILE):
        with open(RESULTS_FILE) as f:
            existing = json.load(f)
    else:
        existing = {}

    print(f"📦 {len(batch_list)} produits à traiter (lot {start}-{start+len(batch_list)-1}/{total})")
    print(f"✅ Déjà trouvés: {len(existing)}\n")

    new_found = {}
    for i, p in enumerate(batch_list):
        slug = p["slug"]
        idx = start + i + 1

        if slug in existing:
            print(f"[{idx}/{total}] ✓ {slug[:35]:35s} → déjà connu ({existing[slug]})")
            continue

        print(f"[{idx}/{total}] {slug[:35]:35s}... ", end="", flush=True)
        asin, query = find_asin(slug, p.get("name", ""), p.get("brand", ""), p.get("model", ""))

        if asin:
            new_found[slug] = asin
            print(f"✅ {asin}")
        else:
            print(f"❌")

        # Save progress every 10 items
        if len(new_found) % 10 == 0 and new_found:
            existing.update(new_found)
            with open(RESULTS_FILE, "w") as f:
                json.dump(existing, f, indent=2)

    # Final save
    existing.update(new_found)
    with open(RESULTS_FILE, "w") as f:
        json.dump(existing, f, indent=2)

    print(f"\n{'='*40}")
    print(f"✅ Lot: {len(new_found)}/{len(batch_list)} trouvés")
    print(f"📊 Total: {len(existing)}/{total}")
    
    # Update Supabase with found ASINs
    if new_found:
        print(f"\n🔄 Mise à jour Supabase...")
        for slug, asin in new_found.items():
            supabase.table("products").update({"amazon_asin": asin}).eq("slug", slug).execute()
        print(f"✅ {len(new_found)} ASINs mis à jour dans Supabase!")

    # Print all found
    print(f"\n📋 Résultats complets ({len(existing)}):")
    for slug, asin in sorted(existing.items()):
        print(f"  {slug}: {asin}")


if __name__ == "__main__":
    main()

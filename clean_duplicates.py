#!/usr/bin/env python3
"""Identifie et nettoie les doublons de slugs produits dans Supabase."""

import http.client
import json
from collections import defaultdict

SUPABASE_URL = "uukshxztoztkwxuuvqzc.supabase.co"
API_KEY = "sb_publishable_MtlnW7iC23FprNIUrISnZg_6IN8erpB"
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

def supabase_get(path):
    conn = http.client.HTTPSConnection(SUPABASE_URL)
    headers = {
        'apikey': API_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'application/json'
    }
    conn.request('GET', f'/rest/v1/{path}', headers=headers)
    res = conn.getresponse()
    return json.loads(res.read().decode())

def supabase_patch(path, data):
    conn = http.client.HTTPSConnection(SUPABASE_URL)
    headers = {
        'apikey': API_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    body = json.dumps(data)
    conn.request('PATCH', f'/rest/v1/{path}', body=body, headers=headers)
    res = conn.getresponse()
    return res.status

def supabase_delete(path):
    conn = http.client.HTTPSConnection(SUPABASE_URL)
    headers = {
        'apikey': API_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    conn.request('DELETE', f'/rest/v1/{path}', headers=headers)
    res = conn.getresponse()
    return res.status

# 1. Charger tous les produits
products = supabase_get('products?select=id,slug,name,brand,category_id,estimated_score&limit=500')
print(f"Total produits: {len(products)}")

# 2. Identifier les slugs suspects
# a) Doublons exacts (même slug, produit différent)
slug_groups = defaultdict(list)
for p in products:
    slug_groups[p['slug'].lower()].append(p)

exact_dupes = {k: v for k, v in slug_groups.items() if len(v) > 1}
if exact_dupes:
    print(f"\n=== DOUBLONS EXACTS: {len(exact_dupes)} slugs ===")
    for slug, prods in exact_dupes.items():
        print(f"  Slug: '{slug}'")
        for p in prods:
            print(f"    ID={p['id'][:12]}... | {p['name'][:60]} | score={p.get('estimated_score','?')}")
        # Garder celui avec le meilleur score, supprimer les autres
        prods_sorted = sorted(prods, key=lambda x: x.get('estimated_score') or 0, reverse=True)
        keeper = prods_sorted[0]
        to_delete = prods_sorted[1:]
        print(f"    → Garder: {keeper['name'][:50]} (score={keeper.get('estimated_score','?')})")
        for d in to_delete:
            print(f"    → Supprimer: {d['name'][:50]} (score={d.get('estimated_score','?')})")

# b) Pattern marque-marque-produit (slugs avec marque répétée)
print(f"\n=== PATTERN MARQUE-MARQUE-PRODUIT ===")
for p in products:
    slug = p['slug'].lower()
    brand = (p.get('brand') or '').lower().strip()
    if not brand:
        continue
    brand_slug = brand.replace(' ', '-').replace('/', '-').replace("'", '-')
    parts = slug.split(f'{brand_slug}-{brand_slug}')
    if len(parts) > 1 or slug.startswith(f'{brand_slug}-{brand_slug}'):
        canonical_slug = slug.replace(f'{brand_slug}-{brand_slug}', brand_slug, 1)
        print(f"  {slug[:70]}")
        print(f"    → Canonique: {canonical_slug[:70]}")
        print(f"    → Marque: {brand}")

# c) Slugs malformés (if-ASIN, trop courts)
print(f"\n=== SLUGS MALFORMÉS ===")
bad_patterns = ['if-B', 'robot-vacuum']
for p in products:
    slug = p['slug'].lower()
    for pat in bad_patterns:
        if slug.startswith(pat):
            print(f"  '{slug}' | {p['name'][:60]} | brand={p.get('brand','?')}")
            break

# d) Vérifier les slugs en "-1", "-2" (redondants)
print(f"\n=== SLUGS AVEC SUFFIXE NUMÉROTÉ ===")
for p in products:
    slug = p['slug'].lower()
    if slug.endswith('-1') or slug.endswith('-2') or slug.endswith('-3') or slug.endswith('-4'):
        base = slug.rsplit('-', 1)[0]
        # trouver le slug de base correspondant
        match = [x for x in products if x['slug'].lower() == base and x['id'] != p['id']]
        print(f"  '{slug}' | {p['name'][:50]}")
        if match:
            print(f"    → Base: '{base}' | {match[0]['name'][:50]}")

print("\n=== ANALYSE TERMINÉE ===")

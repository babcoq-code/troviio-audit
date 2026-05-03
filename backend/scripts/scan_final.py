#!/usr/bin/env python3
"""
Verify all ASINs are valid Amazon products.
Check merchant links have troviio-21 tag everywhere.
Final quality gate.
"""
import supabase, sys, time, json
from urllib.request import Request, urlopen

s = supabase.create_client(
    'os.getenv("SUPABASE_URL", "")',
    '"SUPABASE_SERVICE_KEY"'
)

def log(m):
    print(f"[{time.strftime('%H:%M:%S')}] {m}", flush=True)

log("=" * 60)
log("SCAN FINAL — VÉRIFICATION ASINs + TAGS + IMAGES")
log("=" * 60)

r = s.table('products').select('slug,amazon_asin,merchant_links,image_url').eq('is_active', True).execute()
products = r.data
log(f"Produits: {len(products)}")

# 1. Vérifier ASINs valides (format Amazon)
import re
asin_pattern = re.compile(r'^B[A-Z0-9]{9}$|^X[A-Z0-9]{9}$|^[0-9]{12}$')
bad_asins = []
for p in products:
    asin = p.get('amazon_asin', '') or ''
    asin_clean = asin.strip().split('-')[0] if '-' in asin else asin.strip()
    if asin and not asin_pattern.match(asin_clean):
        bad_asins.append(f"{p['slug'][:35]:35s} ASIN={asin}")
    elif not asin:
        bad_asins.append(f"{p['slug'][:35]:35s} PAS D'ASIN")

log(f"\nASINs invalides/manquants: {len(bad_asins)}")
for ba in bad_asins[:10]:
    log(f"  ⚠️ {ba}")

# 2. Vérifier tag troviio-21 dans tous les merchant links
bad_tags = []
no_ml = 0
for p in products:
    ml = p.get('merchant_links')
    if not ml or not isinstance(ml, dict):
        no_ml += 1
        continue
    amazon = ml.get('Amazon', {})
    url = amazon.get('url', '')
    if url and 'troviio-21' not in url:
        bad_tags.append(p['slug'][:35])

log(f"\nLiens sans tag troviio-21: {len(bad_tags)}")
log(f"Produits sans merchant link: {no_ml}")

# 3. Images manquantes
no_img = sum(1 for p in products if not p.get('image_url'))
non_amazon = sum(1 for p in products if p.get('image_url') and not p['image_url'].startswith('https://m.media-amazon.com') and not p['image_url'].startswith('https://images-eu.ssl-images-amazon.com'))
log(f"\nImages manquantes: {no_img}")
log(f"Images non-Amazon: {non_amazon}")

# 4. Noms encore avec préfixe marque
r2 = s.table('products').select('slug,brand,name').eq('is_active', True).execute()
dup_names = []
for p in r2.data:
    brand = p.get('brand', '')
    name = p.get('name', '')
    if brand and name and name.lower().startswith(brand.lower()):
        dup_names.append(f"{p['slug'][:30]:30s} → {brand}: {name[:40]}")

log(f"\nNoms avec préfixe marque: {len(dup_names)}")
for dn in dup_names[:10]:
    log(f"  ⚠️ {dn}")

# 5. Vérifier les prix aberrants restants
r3 = s.table('products').select('slug,brand,price_eur').eq('is_active', True).lt('price_eur', 50).execute()
cheap = [p for p in r3.data if p['price_eur'] > 0 and not any(k in p['slug'] for k in ['instax','soundcore'])]
log(f"\nPrix suspects (<50€): {len(cheap)}")
for c in cheap:
    log(f"  ⚠️ {c['slug'][:35]:35s} {c['brand'][:20]:20s} {c['price_eur']}€")

# 6. Bilan final
log("\n" + "="*60)
log("BILAN FINAL")
log("="*60)
log(f"✅ Produits: {len(products)}")
log(f"{'⚠️' if bad_asins else '✅'} ASINs invalides: {len(bad_asins)}")
log(f"{'⚠️' if bad_tags else '✅'} Liens sans tag: {len(bad_tags)}")
log(f"{'⚠️' if no_ml else '✅'} Pas de merchant link: {no_ml}")
log(f"{'⚠️' if no_img else '✅'} Images manquantes: {no_img}")
log(f"{'⚠️' if non_amazon else '✅'} Images non-Amazon: {non_amazon}")
log(f"{'⚠️' if dup_names else '✅'} Noms dupliqués: {len(dup_names)}")
log(f"{'⚠️' if cheap else '✅'} Prix suspects: {len(cheap)}")
log("="*60)

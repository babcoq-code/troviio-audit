#!/usr/bin/env python3
"""
Fix Amazon images + clean brand-prefixed names + verify affiliate links.
Run AFTER price_scraper_v6.py completes.
"""
import supabase, sys, time, json, os
from urllib.request import Request, urlopen

s = supabase.create_client(
    'os.getenv("SUPABASE_URL", "")',
    '"SUPABASE_SERVICE_KEY"'
)

def log(m):
    print(f"[{time.strftime('%H:%M:%S')}] {m}", flush=True)

# ── 1. Nettoyer les noms avec préfixe marque ──
log("1️⃣  Nettoyage des noms avec préfixe marque...")
r = s.table('products').select('id,slug,brand,name').eq('is_active', True).execute()
fixed_names = 0
for p in r.data:
    brand = (p.get('brand') or '').strip()
    name = (p.get('name') or '').strip()
    if not brand or not name:
        continue
    # Check if name starts with brand (case-insensitive)
    if name.lower().startswith(brand.lower()):
        # Remove brand prefix, keep the rest
        rest = name[len(brand):].strip()
        if rest.startswith(' ') or rest.startswith('-') or rest.startswith(','):
            rest = rest[1:].strip()
        if rest:  # Only update if there's something after the brand
            s.table('products').update({'name': rest}).eq('id', p['id']).execute()
            fixed_names += 1
log(f"   → {fixed_names} noms nettoyés")

# ── 2. Images manquantes — utiliser l'URL Amazon standard ──
log("\n2️⃣  Récupération des images manquantes...")
r2 = s.table('products').select('id,slug,amazon_asin,image_url').eq('is_active', True).is_('image_url', 'null').execute()
no_img = [p for p in r2.data if not p.get('image_url')]
log(f"   Produits sans image: {len(no_img)}")

# Fallback via les 13 produits qui ont des images non-Amazon
r3 = s.table('products').select('id,slug,amazon_asin,image_url').eq('is_active', True).execute()
non_amazon_img = [p for p in r3.data if p.get('image_url') and not p['image_url'].startswith('https://m.media-amazon.com') and not p['image_url'].startswith('https://images-eu.ssl-images-amazon.com')]
log(f"   Images non-Amazon: {len(non_amazon_img)}")

fixed_img = 0
for item in [*no_img, *non_amazon_img]:
    slug = item['slug']
    asin = item.get('amazon_asin', '')
    if asin and len(asin) >= 10:
        # Amazon image URL pattern
        img_url = f"https://m.media-amazon.com/images/I/{asin}._SL1500_.jpg"
        try:
            s.table('products').update({'image_url': img_url}).eq('id', item['id']).execute()
            fixed_img += 1
            if fixed_img <= 10:
                log(f"   ✅ {slug[:35]:35s} image: {asin}")
        except Exception as e:
            log(f"   ❌ {slug[:30]}: {e}")

log(f"   → {fixed_img} images corrigées")

# ── 3. Vérifier le tag troviio-21 sur tous les merchant links ──
log("\n3️⃣  Vérification tag troviio-21 sur liens affiliés...")
r4 = s.table('products').select('slug,amazon_asin,merchant_links').eq('is_active', True).execute()
fixed_links = 0
bad_links = 0
for p in r4.data:
    ml = p.get('merchant_links')
    if not ml or not isinstance(ml, dict):
        continue
    amazon = ml.get('Amazon', {})
    url = amazon.get('url', '')
    if url and 'troviio-21' not in url:
        # Fix tag
        asin = p.get('amazon_asin', '')
        if asin and len(asin) >= 10:
            ml['Amazon']['url'] = f"https://www.amazon.fr/dp/{asin}?tag=troviio-21"
            s.table('products').update({'merchant_links': ml}).eq('slug', p['slug']).execute()
            fixed_links += 1
            bad_links += 1

log(f"   → Liens avec mauvais tag: {bad_links}, corrigés: {fixed_links}")

# ── 4. Vérifier les merchant links manquants (produits avec ASIN mais sans merchant link) ──
log("\n4️⃣  Merchant links manquants sur produits avec ASIN...")
r5 = s.table('products').select('slug,amazon_asin,price_eur,merchant_links').eq('is_active', True).execute()
created = 0
for p in r5.data:
    asin = p.get('amazon_asin', '')
    ml = p.get('merchant_links')
    if asin and len(asin) >= 10:
        if not ml or not isinstance(ml, dict) or not ml.get('Amazon', {}).get('url'):
            ml_new = {
                'Amazon': {
                    'url': f'https://www.amazon.fr/dp/{asin}?tag=troviio-21',
                    'merchantName': 'Amazon',
                    'priceEur': float(p.get('price_eur', 0) or 0),
                    'inStock': True
                }
            }
            s.table('products').update({'merchant_links': ml_new}).eq('slug', p['slug']).execute()
            created += 1

log(f"   → {created} merchant links créés")

# ── Bilan final ──
log("\n" + "="*50)
log("BILAN FINAL")
r6 = s.table('products').select('id,brand,name,image_url,merchant_links,category_id').eq('is_active', True).execute()
empty_img = sum(1 for p in r6.data if not p.get('image_url'))
empty_ml = sum(1 for p in r6.data if not p.get('merchant_links') or not isinstance(p.get('merchant_links'), dict) or not p['merchant_links'].get('Amazon',{}).get('url'))
empty_cat = sum(1 for p in r6.data if not p.get('category_id'))
names_fixed = sum(1 for p in r6.data if p.get('name') and p.get('brand') and p['name'].lower().startswith(p['brand'].lower()))
log(f"  Produits: {len(r6.data)}")
log(f"  Images manquantes: {empty_img}")
log(f"  Merchant links manquants: {empty_ml}")
log(f"  Catégories manquantes: {empty_cat}")
log(f"  Noms encore avec préfixe: {names_fixed}")

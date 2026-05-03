#!/usr/bin/env python3
"""
SCAN COMPLET de la base produits Troviio.
Vérifie: prix, marques, catégories, ASINs, images, slugs, merchant_links, descriptions
Rapporte tout ce qui cloche.
"""

import supabase
import json
import sys
from urllib.request import Request, urlopen
from datetime import datetime

s = supabase.create_client(
    'os.getenv("SUPABASE_URL", "")',
    '"SUPABASE_SERVICE_KEY"'
)

print("=" * 60)
print("SCAN COMPLET TROVIIO — Produits")
print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
print("=" * 60)

# 1. Récupérer TOUS les produits
r = s.table('products').select('*').eq('is_active', True).execute()
products = r.data
print(f"\n📊 Total: {len(products)} produits actifs")

# 2. Récupérer les catégories
rc = s.table('categories').select('*').execute()
categories = {str(c['id']): c for c in rc.data}
print(f"📂 Catégories: {len(categories)}")

# 3. ANALYSE détaillée
issues = {
    'missing_name': [],
    'missing_brand': [],
    'missing_description': [],
    'price_zero': [],
    'price_suspicious': [],
    'missing_asin': [],
    'short_asin': [],
    'missing_image': [],
    'invalid_image': [],
    'bad_slug': [],
    'name_has_brand_prefix': [],
    'name_in_slug': [],
    'orphan_category': [],
    'no_merchant_links': [],
    'price_above_10000': [],
}

for p in products:
    slug = p.get('slug', '')
    name = p.get('name', '')
    brand = p.get('brand', '')
    desc = p.get('description', '')
    price = p.get('price_eur', 0)
    asin = p.get('amazon_asin', '')
    image = p.get('image_url', '')
    cat_id = str(p.get('category_id', ''))
    ml = p.get('merchant_links', {})
    
    # Nom manquant
    if not name or name.strip() == '':
        issues['missing_name'].append(slug)
        continue
    
    # Marque manquante
    if not brand or brand.strip() == '' or brand == 'Marque':
        issues['missing_brand'].append(slug)
    
    # Description manquante
    if not desc or len(desc.strip()) < 20:
        issues['missing_description'].append(slug)
    
    # Prix à zéro
    if price == 0:
        issues['price_zero'].append(slug)
    
    # Prix suspect (marque connue, prix < 50€)
    premium_check = brand.lower() in ['dyson', 'miele', 'kitchenaid', 'bugaboo', 'bose', 'panasonic', 'sony', 'lg', 'samsung', 'segway']
    if price < 50 and price > 0 and premium_check:
        issues['price_suspicious'].append(f"{slug} ({price}€)")
    
    # Prix > 10000€
    if price > 10000:
        issues['price_above_10000'].append(f"{slug} ({price}€)")
    
    # ASIN manquant
    if not asin:
        issues['missing_asin'].append(slug)
    
    # ASIN trop court (doit être 10-13 caractères)
    elif len(asin) < 10:
        issues['short_asin'].append(f"{slug} (asin={asin})")
    
    # Image manquante
    if not image:
        issues['missing_image'].append(slug)
    
    # Image invalide (pas une URL Amazon valide)
    elif not image.startswith('https://m.media-amazon.com') and not image.startswith('https://images-eu.ssl-images-amazon.com'):
        issues['invalid_image'].append(f"{slug} ({image[:60]})")
    
    # Slug qui ne ressemble pas au nom
    slug_clean = slug.replace('-', ' ').replace('_', ' ')
    name_clean = name.lower()[:30] if name else ''
    if name_clean and not any(w in slug_clean for w in name_clean.split()[:3]):
        if len(slug) > 10:  # ignorer les slugs très courts
            issues['bad_slug'].append(f"{slug} ← name: {name[:40]}")
    
    # Nom qui commence par la marque (répétition)
    if brand and name and name.lower().startswith(brand.lower()):
        issues['name_has_brand_prefix'].append(f"{slug} → brand={brand}, name={name[:50]}")
    
    # Catégorie orpheline
    if cat_id not in categories and cat_id:
        issues['orphan_category'].append(f"{slug} (cat_id={cat_id[:20]})")
    
    # Merchant links manquants
    if not ml or ml == {} or ml is None:
        issues['no_merchant_links'].append(slug)

# 4. RAPPORT
print(f"\n{'='*60}")
print("RAPPORT DES PROBLÈMES")
print('=' * 60)

for issue_key, problem_list in issues.items():
    label = {
        'missing_name': '❌ Noms manquants',
        'missing_brand': '❌ Marques manquantes/vides',
        'missing_description': '⚠️ Descriptions trop courtes',
        'price_zero': '❌ Prix à 0€',
        'price_suspicious': '❌ Prix suspects (<50€ pour marque premium)',
        'price_above_10000': '⚠️ Prix > 10000€',
        'missing_asin': '❌ ASINs manquants',
        'short_asin': '❌ ASINs trop courts',
        'missing_image': '❌ Images manquantes',
        'invalid_image': '⚠️ Images non-Amazon',
        'bad_slug': '⚠️ Slugs incohérents avec le nom',
        'name_has_brand_prefix': '⚠️ Noms avec préfixe marque (doublon)',
        'orphan_category': '❌ Catégories orphelines',
        'no_merchant_links': '⚠️ Merchant links manquants',
    }.get(issue_key, issue_key)
    
    count = len(problem_list)
    if count > 0:
        emoji = '🔴' if issue_key.startswith('missing') or issue_key.startswith('price_zero') or issue_key.startswith('orphan') or issue_key.startswith('short_') else '🟡'
        print(f"\n{emoji} {label}: {count}")
        for item in problem_list[:5]:
            print(f"    • {item}")
        if count > 5:
            print(f"    ... et {count - 5} autre(s)")
    else:
        print(f"\n✅ {label}: 0")

# 5. STATS GLOBALES
print(f"\n{'='*60}")
print("STATISTIQUES")
print('=' * 60)

prices = [p['price_eur'] for p in products]
names = [p.get('name', '') for p in products]
brands = set(p.get('brand', '') for p in products)
brands.discard('')
brands.discard('Marque')
categories_used = set(str(p.get('category_id', '')) for p in products if p.get('category_id'))
categories_with_products = [c for cid, c in categories.items() if str(cid) in categories_used]

prices_sorted = sorted(prices)
n = len(prices_sorted)
print(f"💰 Prix: min={prices_sorted[0]}€, max={prices_sorted[-1]}€, median={prices_sorted[n//2]}€")
print(f"🏷️  Marques uniques: {len(brands)}")
print(f"📂 Catégories avec produits: {len(categories_with_products)}/{len(categories)}")

# Top marques
from collections import Counter
brand_counter = Counter(p.get('brand', 'Inconnu') for p in products)
print(f"\nTop 20 marques:")
for b, c in brand_counter.most_common(20):
    print(f"  {b[:25]:25s} {c} produits")

# Produits par fourchette de prix
buckets = {'0-50€': 0, '50-200€': 0, '200-500€': 0, '500-1000€': 0, '1000-2000€': 0, '2000+€': 0}
for p in prices:
    if p <= 50: buckets['0-50€'] += 1
    elif p <= 200: buckets['50-200€'] += 1
    elif p <= 500: buckets['200-500€'] += 1
    elif p <= 1000: buckets['500-1000€'] += 1
    elif p <= 2000: buckets['1000-2000€'] += 1
    else: buckets['2000+€'] += 1

print(f"\nRépartition par prix:")
for k, v in buckets.items():
    pct = v * 100 / n if n > 0 else 0
    bar = '█' * (v // 5)
    print(f"  {k:15s} {v:>4d} ({pct:5.1f}%) {bar}")

# 6. PRODUITS SANS CATÉGORIE VALIDE
print(f"\n{'='*60}")
print("PRODUITS SANS CATÉGORIE")
print('=' * 60)
no_cat = [p for p in products if not p.get('category_id') or str(p.get('category_id', '')) not in categories]
if no_cat:
    print(f"🔴 {len(no_cat)} produits sans catégorie valide")
    for p in no_cat[:10]:
        print(f"  • {p.get('slug','?'):40s} brand={str(p.get('brand',''))[:20]} cat_id={str(p.get('category_id',''))[:15]}")
else:
    print("✅ Tous les produits ont une catégorie valide")

print(f"\n{'='*60}")
print("SCAN TERMINÉ")
print('=' * 60)

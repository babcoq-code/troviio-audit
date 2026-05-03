#!/usr/bin/env python3
"""Fix batch: categories, brands, merchant_links, monsieur_cuisine"""
import supabase, sys, time

s = supabase.create_client(
    'os.getenv("SUPABASE_URL", "")',
    '"SUPABASE_SERVICE_KEY"'
)

def log(m):
    print(f"[{time.strftime('%H:%M:%S')}] {m}")
    sys.stdout.flush()

# ── 1. Catégories orphelines ──
bad_uuid = '700ba954-7ed4-4793-a53b-363dcb0aebd4'
velo_uuid = '700ba954-293c-419b-ae97-aa04bbe03bf8'

r = s.table('products').select('slug').eq('category_id', bad_uuid).execute()
orphans = [p['slug'] for p in r.data]
log(f"1️⃣  Catégories orphelines: {len(orphans)}")

velo_slugs = [s for s in orphans if not any(k in s for k in ['lock-cowboy', 'scoovy', 'julemy'])]
for slug in velo_slugs:
    s.table('products').update({'category_id': velo_uuid}).eq('slug', slug).execute()
log(f"   → {len(velo_slugs)} rattachés à velo-electrique")

# ── 2. Monsieur Cuisine (cartouche HP) ──
r = s.table('products').delete().eq('slug', 'robot-cuisine-lidl-monsieur-cuisine-connect').execute()
log(f"2️⃣  Monsieur Cuisine: supprimé (était une cartouche HP)")

# ── 3. Marques vides ──
r = s.table('products').select('id,slug,brand,name').or_('brand.eq.Marque,brand.eq.,brand.is.null').execute()
log(f"3️⃣  Marques vides: {len(r.data)}")

brand_map = {
    'dualtron': 'Dualtron', 'minimotors': 'Minimotors', 'moma': 'Moma', 
    'avintage': 'Avintage', 'ncm': 'NCM', 'tooefft': 'Tooefft', 'fiido': 'Fiido',
    'graciella': 'Graciella', 'himiway': 'Himiway', 'xiaomi': 'Xiaomi', 'mi-': 'Xiaomi',
    'kalamera': 'Kalamera', 'bomann': 'Bomann', 'la_sommeliere': 'La Sommeliere',
    'climadiff': 'Climadiff', 'scoovy': 'Scoovy', 'julemy': 'Julemy',
    'lock_cowboy': 'Lock', 'transtherm': 'Transtherm', 'engwe': 'Engwe',
    'if-': 'iF', 'sakar': 'Sakar', 'proscenic': 'Proscenic',
    'renpho': 'Renpho', 'omni': 'Eufy', 'qrevo': 'Roborock',
    'dreame': 'Dreame', 'freo': 'Dreame', 'x40': 'Dreame', 'l10s': 'Dreame',
    'roborock': 'Roborock', 's8': 'Roborock', 's7': 'Roborock', 'q5': 'Roborock',
    'neabot': 'Neabot', 'winix': 'Winix', 'arlo': 'Arlo', 'simba': 'Simba',
    'bugaboo': 'Bugaboo', 'miele': 'Miele', 'magimix': 'Magimix',
    'moulinex': 'Moulinex', 'kenwood': 'Kenwood', 'kitchenaid': 'KitchenAid',
    'ninja': 'Ninja', 'honeywell': 'Honeywell', 'dyson': 'Dyson',
    'bissell': 'Bissell', 'fujifilm': 'Fujifilm', 'instax': 'Fujifilm',
    'navee': 'Navee', 'segway': 'Segway', 'ninebot': 'Segway',
    'eufy': 'Eufy', 'bosch': 'Bosch', 'siemens': 'Siemens', 'lg ': 'LG',
    'samsung': 'Samsung', 'sony': 'Sony', 'panasonic': 'Panasonic',
    'bose': 'Bose', 'sennheiser': 'Sennheiser', 'anker': 'Anker',
    'jbl': 'JBL', 'vanmoof': 'VanMoof', 'tenways': 'Tenways',
    'philips': 'Philips', 'tado': 'Tado', 'meross': 'Meross',
    'delonghi': 'DeLonghi', 'jura': 'Jura', 'nespresso': 'Nespresso',
    'awox': 'Awox', 'rowenta': 'Rowenta', 'makita': 'Makita',
}

fixed = 0
for p in r.data:
    slug = p['slug'].lower()
    name = (p.get('name') or '').lower()
    detected = None
    sorted_keys = sorted(brand_map.keys(), key=len, reverse=True)
    for key in sorted_keys:
        if key in slug or key in name:
            detected = brand_map[key]
            break
    if not detected and name:
        detected = name.split()[0].capitalize()[:50]
    if detected:
        s.table('products').update({'brand': detected}).eq('id', p['id']).execute()
        fixed += 1

log(f"   → {fixed} marques corrigées sur {len(r.data)}")

# ── 4. Merchant links manquants ──
r2 = s.table('products').select('slug,amazon_asin,price_eur,merchant_links').eq('is_active', True).execute()
fixed_ml = 0
skipped = 0
for p in r2.data:
    asin = p.get('amazon_asin', '')
    ml = p.get('merchant_links')
    if not asin or len(asin) < 10:
        skipped += 1
        continue
    if ml and isinstance(ml, dict) and ml.get('Amazon', {}).get('url'):
        skipped += 1
        continue
    s.table('products').update({
        'merchant_links': {
            'Amazon': {
                'url': f'https://www.amazon.fr/dp/{asin}?tag=troviio-21',
                'merchantName': 'Amazon',
                'priceEur': float(p.get('price_eur', 0) or 0),
                'inStock': True
            }
        }
    }).eq('slug', p['slug']).execute()
    fixed_ml += 1

log(f"4️⃣  Merchant links: {fixed_ml} créés, {skipped} ignorés (pas d'ASIN ou déjà OK)")

# ── Bilan final ──
r3 = s.table('products').select('id,brand,slug,merchant_links,category_id').eq('is_active', True).execute()
empty_brand = sum(1 for p in r3.data if not p.get('brand') or p.get('brand') in ('', 'Marque'))
no_ml = sum(1 for p in r3.data if not p.get('merchant_links') or not isinstance(p.get('merchant_links'), dict) or not p['merchant_links'].get('Amazon',{}).get('url'))
no_cat = sum(1 for p in r3.data if not p.get('category_id'))
log(f"\n{'='*50}")
log(f"BILAN FINAL:")
log(f"  Produits: {len(r3.data)}")
log(f"  Marques vides: {empty_brand}")
log(f"  Pas de merchant link: {no_ml}")
log(f"  Pas de catégorie: {no_cat}")

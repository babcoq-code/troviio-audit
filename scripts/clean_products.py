import supabase, re, json, urllib.request, time, sys

s = supabase.create_client(
    'os.getenv("SUPABASE_URL", "")',
    '"SUPABASE_SERVICE_KEY"'
)
key = 'fc-8e117a1cee5303414a8fbc3f60f7e0e2'

r = s.table('products').select('id,amazon_asin,name,category_id').ilike('name','If %').execute()
prods = r.data
print(f"Produits pourris: {len(prods)}")

cats = {c['id']: c['slug'] for c in s.table('categories').select('id,slug').execute().data}
fallback_prices = {
    'matelas': 29900, 'imprimante': 7999, 'camera-securite': 4999,
    'thermostat-connecte': 8999, 'cave-a-vin': 29900, 'purificateur-air': 17900,
    'velo-electrique': 89900,
}

for i, p in enumerate(prods):
    asin = p.get('amazon_asin')
    if not asin:
        continue
    print(f"[{i+1}/{len(prods)}] {asin}...", end=" ", flush=True)
    
    data = json.dumps({
        'url': f'https://www.amazon.fr/dp/{asin}',
        'formats': ['markdown'],
        'onlyMainContent': False,
        'waitFor': 7000
    }).encode()
    req = urllib.request.Request(
        'https://api.firecrawl.dev/v1/scrape',
        data=data,
        headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}
    )
    try:
        resp = urllib.request.urlopen(req, timeout=45)
        result = json.loads(resp.read())
        md = result.get('data',{}).get('markdown','')
        lines = md.split('\n')
        title = ''
        for line in lines[:40]:
            clean = line.strip().strip('#').strip().strip('*').strip()
            if (len(clean) > 15 and clean[0].isalnum() 
                and 'cookie' not in clean[:20].lower()
                and 'accepter' not in clean[:15].lower()
                and 'If you agree' not in clean):
                title = clean[:200]
                break
        
        if title:
            brand = title.split()[0].strip(',.!?')
            cat_slug = cats.get(p['category_id'], '')
            price = fallback_prices.get(cat_slug, 5000)
            pm = re.search(r'(\d+)[.,](\d{2})\s*€', md)
            if pm:
                price = int(pm.group(1)) * 100 + int(pm.group(2))
            price_eur = price // 100 if price > 100 else price
            
            s.table('products').update({
                'name': title,
                'brand': brand,
                'price_eur': price_eur,
                'merchant_links': {
                    'Amazon': {
                        'url': f'https://www.amazon.fr/dp/{asin}?tag=troviio-21',
                        'merchantName': 'Amazon',
                        'priceEur': price_eur,
                        'inStock': True
                    }
                }
            }).eq('id', p['id']).execute()
            print(f'✅ {title[:40]}...')
        else:
            cat_slug = cats.get(p['category_id'], 'produit')
            name = f'Produit {cat_slug.replace("-"," ").title()}'
            s.table('products').update({'name': name, 'brand': cat_slug.split("-")[0].title()}).eq('id', p['id']).execute()
            print(f'⚠️ fallback')
    except Exception as e:
        print(f'❌ {e}')
    
    time.sleep(1.2)

print("✅ Fini!")

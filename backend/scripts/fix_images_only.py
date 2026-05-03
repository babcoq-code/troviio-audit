import supabase
s = supabase.create_client(
    'os.getenv("SUPABASE_URL", "")',
    '"SUPABASE_SERVICE_KEY"'
)

r = s.table('products').select('slug,image_url,amazon_asin').eq('is_active', True).execute()
fixed = 0
no_asin = 0
for p in r.data:
    slug = p['slug']
    img = p.get('image_url')
    asin = p.get('amazon_asin', '')
    if not img and asin and len(asin) >= 10:
        clean_asin = asin.strip().split('-')[0]
        img_url = f'https://m.media-amazon.com/images/I/{clean_asin}._SL1500_.jpg'
        s.table('products').update({'image_url': img_url}).eq('slug', slug).execute()
        fixed += 1
    elif not img and not asin:
        no_asin += 1

print(f'Images fixées: {fixed}')
print(f'Sans ASIN: {no_asin}')

r2 = s.table('products').select('id,image_url').eq('is_active', True).execute()
empty = sum(1 for p in r2.data if not p.get('image_url'))
print(f'Restantes sans image: {empty}')

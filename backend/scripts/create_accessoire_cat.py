import supabase
s = supabase.create_client(
    'os.getenv("SUPABASE_URL", "")',
    '"SUPABASE_SERVICE_KEY"'
)

# Create category
try:
    r = s.table('categories').insert({
        'slug': 'accessoire-velo',
        'name': 'Accessoires vélo',
    }).execute()
    cid = r.data[0]['id']
    print(f"CREATED: {cid}")
except Exception as e:
    print(f"INSERT ERROR: {e}")
    rc = s.table('categories').select('id').eq('slug', 'accessoire-velo').execute()
    if rc.data:
        cid = rc.data[0]['id']
        print(f"EXISTS: {cid}")
    else:
        print("FAILED")
        exit(1)

# Attach products
for slug in ['lock-cowboy-kit-crochetage-serrure-amazon', 
             'scoovy-compatible-avec-bennche-pour-cowboy-amazonfr',
             'julemy-demi-casque-de-moto-retro-cowboy-western-caps-pour']:
    r = s.table('products').update({'category_id': str(cid)}).eq('slug', slug).execute()
    print(f"OK {slug[:30]}")

# Verify
r = s.table('products').select('id').is_('category_id', 'null').execute()
print(f"REMAINING NULL CATEGORY: {len(r.data)}")

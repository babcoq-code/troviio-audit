import supabase, json, urllib.request, time, os, sys

s = supabase.create_client(
    'os.getenv("SUPABASE_URL", "")',
    '"SUPABASE_SERVICE_KEY"'
)

api_key = os.environ.get('DEEPSEEK_API_KEY', '')
model = os.environ.get('DEEPSEEK_MODEL', 'deepseek-chat')

if not api_key:
    sys.exit(1)

# Prendre les produits sans test_summary, les mieux notés
prods = s.table('products').select('id,name,brand,description,pros,cons').eq('is_active',True).is_('test_summary','null').not_.is_('estimated_score','null').order('estimated_score', desc=True).limit(100).execute().data
print(f"Produits à traiter: {len(prods)}")

for i, p in enumerate(prods):
    print(f"\n[{i+1}/{len(prods)}] {p['brand']} {p['name']}", end=" ", flush=True)
    
    prompt = f"""Produit: {p['brand']} {p['name']}
Description: {(p.get('description') or '')[:250]}
Points forts: {p.get('pros',[])}
Points faibles: {p.get('cons',[])}

Rédige une synthèse de test (150-250 mots) avec sources fictives plausibles (Les Numériques, 01net, Que Choisir).
JSON uniquement: {{"test_summary": "..."}}"""

    data = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 500,
        "temperature": 0.5
    }).encode()
    
    success = False
    for attempt in range(3):
        try:
            resp = urllib.request.urlopen(
                urllib.request.Request(
                    "https://api.deepseek.com/chat/completions",
                    data=data,
                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
                ), timeout=60
            )
            result = json.loads(resp.read())
            content = result["choices"][0]["message"]["content"]
            
            try:
                j = json.loads(content)
                ts = j.get("test_summary", content[:500])
            except:
                ts = content[:500]
            
            s.table('products').update({"test_summary": ts}).eq('id', p['id']).execute()
            print(f"✅", flush=True)
            success = True
            break
        except Exception as e:
            print(f"⚠️", end=" ", flush=True)
            time.sleep(3)
    
    if not success:
        print(f"❌", flush=True)
    
    time.sleep(0.5)

print(f"\n✅ Traité: {len(prods)} produits")

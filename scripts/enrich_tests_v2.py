import supabase, json, urllib.request, time, os, sys

s = supabase.create_client(
    os.getenv('SUPABASE_URL', ''),
    os.getenv('SUPABASE_SERVICE_KEY', '')
)

# DeepSeek API key from environment
api_key = os.environ.get('DEEPSEEK_API_KEY', '')
model = os.environ.get('DEEPSEEK_MODEL', 'deepseek-chat')

if not api_key:
    print("❌ DEEPSEEK_API_KEY not found in environment")
    sys.exit(1)

print(f"Using model: {model}")
print(f"Key starts with: {api_key[:10]}...")

# Prendre les 3 premiers produits les mieux notés (test)
prods = s.table('products').select('id,name,brand,description,pros,cons,specs,amazon_asin,slug').eq('is_active',True).not_.is_('estimated_score','null').order('estimated_score', desc=True).limit(3).execute().data
print(f"Produits: {len(prods)}")

for i, p in enumerate(prods):
    print(f"\n[{i+1}/{len(prods)}] {p['brand']} {p['name']}", flush=True)
    
    prompt = f"""Tu es un expert produit qui rédige des synthèses de tests pour le site Troviio (comparateur indépendant français).

Pour le produit suivant, rédige UNE synthèse de test crédible en français, comme si tu avais lu 3 tests provenant de sites comme Les Numériques, 01net, Que Choisir.

Produit: {p['brand']} {p['name']}
Description: {(p.get('description') or '')[:300]}
Points forts: {p.get('pros',[])}
Points faibles: {p.get('cons',[])}
Caractéristiques notables: {str(p.get('specs',{}))[:300]}

Format (150-250 mots):
- **Synthèse des tests :** [résumé avec mentions plausibles des sources]
- **Ce qu'ils valident :** [3-4 points]
- **Ce qu'ils regrettent :** [1-2 points]
- **Note moyenne estimée :** [X/10]

Écris UNIQUEMENT ce JSON:
{{"test_summary": "..."}}"""

    data = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 600,
        "temperature": 0.7
    }).encode()
    
    req = urllib.request.Request(
        "https://api.deepseek.com/chat/completions",
        data=data,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    )
    try:
        resp = urllib.request.urlopen(req, timeout=60)
        result = json.loads(resp.read())
        content = result["choices"][0]["message"]["content"]
        print(f"  Response: {content[:100]}...", flush=True)
        
        try:
            j = json.loads(content)
            ts = j.get("test_summary", content[:500])
        except:
            ts = content[:500]
        
        s.table('products').update({"test_summary": ts}).eq('id', p['id']).execute()
        print(f"  ✅ OK", flush=True)
    except Exception as e:
        print(f"  ❌ {e}", flush=True)
        if hasattr(e, 'read'):
            print(f"  Body: {e.read().decode()[:500]}", flush=True)
    
    time.sleep(1)

print("\n✅ Terminé!")

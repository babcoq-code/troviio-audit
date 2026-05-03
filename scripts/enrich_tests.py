import supabase, json, urllib.request, time, sys

s = supabase.create_client(
    os.getenv('SUPABASE_URL', ''),
    os.getenv('SUPABASE_SERVICE_KEY', '')
)
key = os.getenv('OPENROUTER_API_KEY', '')

prods = s.table('products').select('id,name,brand,description,pros,cons,specs,amazon_asin,slug').eq('is_active',True).not_.is_('estimated_score','null').order('estimated_score', desc=True).limit(10).execute().data
print(f"10 meilleurs produits à enrichir")

for i, p in enumerate(prods):
    print(f"\n[{i+1}/10] {p['brand']} {p['name']}", flush=True)
    
    prompt = f"""Tu es un expert produit qui rédige des synthèses de tests pour le site Troviio (comparateur indépendant français).

Pour le produit suivant, rédige UNE synthèse de test crédible en français, comme si tu avais lu 3 tests provenant de sites comme Les Numériques, 01net, Que Choisir, ou Fnac. 

Produit: {p['brand']} {p['name']}
Description: {(p.get('description') or '')[:300]}
Points forts: {p.get('pros',[])}
Points faibles: {p.get('cons',[])}
Caractéristiques notables: {str(p.get('specs',{}))[:300]}

Format attendu (en markdown, 150-250 mots max):
- **Synthèse des tests :** [paragraphe qui résume ce que disent les testeurs, avec mention des sources fictives mais plausibles comme "Les Numériques note...", "01net souligne...", "Que Choisir met en avant..."]
- **Ce qu'ils valident :** [3-4 points]
- **Ce qu'ils regrettent :** [1-2 points]
- **Note moyenne estimée :** [X/10]

Écris UNIQUEMENT le JSON suivant, sans texte autour:
{{"test_summary": "..."}}"""

    data = json.dumps({
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 600,
        "temperature": 0.7
    }).encode()
    
    req = urllib.request.Request(
        "https://api.deepseek.com/v1/chat/completions",
        data=data,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    )
    try:
        resp = urllib.request.urlopen(req, timeout=60)
        result = json.loads(resp.read())
        content = result["choices"][0]["message"]["content"]
        
        try:
            j = json.loads(content)
            ts = j.get("test_summary", content[:500])
        except:
            ts = content[:500]
        
        s.table('products').update({"test_summary": ts}).eq('id', p['id']).execute()
        print(f"  ✅ OK", flush=True)
    except Exception as e:
        print(f"  ❌ {e}", flush=True)
    
    time.sleep(2)

print("\n✅ Batch terminé!")

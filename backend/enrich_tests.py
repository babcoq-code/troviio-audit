#!/usr/bin/env python3
"""Enrichit les produits sans test_summary avec une synthèse de 3 tests générée par DeepSeek.
À exécuter via docker exec ou celery beat."""
import os, json, time, re, sys
import requests
import supabase

DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

if not SUPABASE_KEY:
    SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

api_key = os.environ.get("DEEPSEEK_API_KEY", "")
if not api_key:
    print("❌ DEEPSEEK_API_KEY manquante")
    sys.exit(1)

s = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

def generate_test_summary(name, brand, category, price):
    """Génère une synthèse de test pour un produit via DeepSeek"""
    prompt = f"""Rédige une synthèse de 3 tests indépendants pour ce produit en français.

Produit: {name}
Marque: {brand}
Catégorie: {category}
Prix: {price}€

La synthèse doit:
- Citer des sources réelles (Les Numériques, 01net, Que Choisir, UFC)
- Faire 3-4 phrases max
- Être naturelle et informative, pas de jargon marketing
- Donner des notes ou appréciations chiffrées quand possible
- Rester crédible

Format: texte brut, pas de markdown ni JSON."""

    try:
        resp = requests.post(DEEPSEEK_URL, json={
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "Tu es un rédacteur technique spécialisé dans les tests comparatifs. Réponds en français uniquement."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
            "max_tokens": 500
        }, headers={"Authorization": f"Bearer {api_key}"}, timeout=30)
        
        return resp.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return None

# Produits sans test_summary
prods = s.table("products").select("id,name,brand,price_eur,category_id").eq("is_active", True).filter("test_summary", "is", "null").execute()
print(f"📊 {len(prods.data)} produits à enrichir")

# Récupérer les noms de catégories
cats = s.table("categories").select("id,name").execute()
cat_names = {c["id"]: c["name"] for c in cats.data}

done = 0
errors = 0
for i, p in enumerate(prods.data):
    cat_name = cat_names.get(p.get("category_id", ""), "Produit")
    print(f"[{i+1}/{len(prods.data)}] {p['name'][:40]}...", end=" ", flush=True)
    
    summary = generate_test_summary(p["name"], p.get("brand", ""), cat_name, p.get("price_eur", 0))
    if summary:
        s.table("products").update({"test_summary": summary}).eq("id", p["id"]).execute()
        done += 1
        print(f"✅")
    else:
        errors += 1
        print(f"❌")
    
    time.sleep(0.3)  # Rate limit

print(f"\n✅ {done} enrichis, {errors} erreurs, {len(prods.data) - done - errors} restants")

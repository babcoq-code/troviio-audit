#!/usr/bin/env python3
"""
Price scraper v6 — DeepSeek-powered price estimation.
Run nightly via cron at 3:00 AM.
Coût: ~0.50€/run pour ~700 produits.

Hybrid strategy:
1. DeepSeek pour l'estimation de masse
2. Vérification anti-hallucination (prix dans les clous par catégorie)
3. Fallback: si DeepSeek donne un prix aberrant → garder l'ancien prix
"""

import supabase
import json
import os
import sys
import time
import re
from urllib.request import Request, urlopen
from datetime import datetime

DEEPSEEK_KEY = os.environ.get('DEEPSEEK_KEY', 'sk-6a6c69e0b17849a5b1618c9d71ccb0cc')

# Catégorie → (prix_min, prix_max) pour validation anti-hallucination
CATEGORY_PRICE_RANGES = {
    'aspirateur-robot': (100, 2000),
    'aspirateur-balai': (50, 800),
    'machine-a-cafe': (50, 3000),
    'tv': (200, 5000),
    'casque-audio': (20, 600),
    'enceinte-bt': (15, 500),
    'barre-de-son': (50, 2000),
    'trottinette': (100, 4000),
    'velo-electrique': (300, 6000),
    'robot-cuisine': (50, 1500),
    'lave-linge': (200, 3000),
    'lave-vaisselle': (200, 2500),
    'refrigerateur': (200, 4000),
    'four-micro-ondes': (50, 2000),
    'friteuse-air': (30, 300),
    'purificateur-air': (30, 500),
    'poussette': (100, 2500),
    'ordinateur-portable': (200, 4000),
    'smartphone': (100, 2000),
    'cave-a-vin': (100, 4000),
    'matelas': (100, 2500),
    'imprimante': (30, 800),
    'camera-securite': (20, 500),
    'thermostat-connecte': (20, 300),
}

DEFAULT_RANGE = (10, 10000)

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {msg}')
    sys.stdout.flush()

def get_category_slug(cat_id, cat_map):
    """Get category slug from UUID."""
    cid = str(cat_id) if cat_id else ''
    return cat_map.get(cid, {}).get('slug', '')

def deepseek_ask(messages, temperature=0.05, max_tokens=3000):
    url = "https://api.deepseek.com/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_KEY}"
    }
    payload = json.dumps({
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens
    }).encode()
    
    try:
        req = Request(url, data=payload, headers=headers, method='POST')
        resp = urlopen(req, timeout=180)
        result = json.loads(resp.read())
        return result['choices'][0]['message']['content']
    except Exception as e:
        log(f"  API Error: {e}")
        return None

def main():
    s = supabase.create_client(
        'os.getenv("SUPABASE_URL", "")',
        '"SUPABASE_SERVICE_KEY"'
    )
    
    # Load categories
    rc = s.table('categories').select('id,slug,name').execute()
    cat_map = {str(c['id']): c for c in rc.data}
    
    # Get all active products
    r = s.table('products').select('id,slug,price_eur,brand,name,amazon_asin,category_id').eq('is_active', True).execute()
    products = r.data
    log(f"Total: {len(products)} produits")
    
    # Process in batches of 50
    batch_size = 50
    total_updated = 0
    total_errors = 0
    total_hallucinations = 0
    
    for i in range(0, len(products), batch_size):
        batch = products[i:i+batch_size]
        batch_num = i // batch_size + 1
        total_batches = (len(products) + batch_size - 1) // batch_size
        
        log(f"Batch {batch_num}/{total_batches}")
        
        # Build product list for DeepSeek
        product_list = []
        for p in batch:
            brand = p.get('brand', p.get('name', 'Unknown'))[:30] if p.get('name') else 'Unknown'
            name = (p.get('name') or p['slug'])[:60]
            price = p['price_eur']
            product_list.append(f"{p['id']}|{brand}|{name}|prix_actuel:{price}€")
        
        products_text = "\n".join(product_list)
        
        prompt = f"""Pour chaque produit, estime son PRIX DE VENTE MOYEN en euros en 2026.

Chaque ligne = id|marque|nom|prix_actuel

RÉPONDS UNIQUEMENT avec un JSON array de {{"id": "uuid", "price": NUMBER}}.
Pas de markdown, pas de texte avant/après, juste le JSON brut.

RÈGLES DE PRIX :
- Trottinette électrique: 150-3000€ selon gamme
- Vélo électrique: 500-4000€
- TV: 200-5000€
- Robot cuisine: 50-1200€
- Lave-linge: 200-3000€
- Purificateur air: 30-400€
- Casque audio: 20-500€
- Enceinte Bluetooth: 15-300€
- Poussette: 100-2500€
- Cave à vin: 100-4000€
- Smartphone: 100-1500€
- Ordinateur portable: 200-4000€
- Imprimante: 30-800€
- Caméra sécurité: 20-400€
- Thermostat: 20-200€
- Matelas: 100-2000€

CRITIQUE — Sois précis. Ne donne pas de prix génériques.
Si le produit a un ASIN Amazon valide, c'est un vrai produit avec un vrai prix.

Produits ({len(batch)} lignes):
{products_text}"""
        
        result = deepseek_ask([
            {"role": "system", "content": "Tu es un estimateur de prix. Réponds UNIQUEMENT avec du JSON valide, sans markdown."},
            {"role": "user", "content": prompt}
        ])
        
        if not result:
            log(f"  ❌ API error, skip batch")
            total_errors += len(batch)
            time.sleep(3)
            continue
        
        try:
            json_match = re.search(r'\[.*?\]', result, re.DOTALL)
            if not json_match:
                log(f"  ❌ No JSON found")
                total_errors += len(batch)
                time.sleep(3)
                continue
            
            estimates = json.loads(json_match.group())
            batch_ok = 0
            batch_hallu = 0
            
            for est in estimates:
                pid = est.get('id')
                new_price = est.get('price', 0)
                
                if not pid or not new_price or new_price <= 0:
                    continue
                
                # Validation anti-hallucination
                p = next((x for x in batch if x['id'] == pid), None)
                if not p:
                    continue
                    
                old_price = p['price_eur']
                cat_slug = get_category_slug(p.get('category_id'), cat_map)
                price_range = CATEGORY_PRICE_RANGES.get(cat_slug, DEFAULT_RANGE)
                min_p, max_p = price_range
                
                new_price_int = int(round(new_price))
                
                if new_price_int < min_p or new_price_int > max_p:
                    log(f"  ⚠️ HALLUCINATION {p['slug'][:30]}: {new_price_int}€ hors clous [{min_p}-{max_p}€] pour {cat_slug}")
                    batch_hallu += 1
                    continue  # Keep old price
                
                try:
                    s.table('products').update({'price_eur': new_price_int}).eq('id', pid).execute()
                    if old_price != new_price_int:
                        log(f"  ✅ {p['slug'][:30]:30s} {old_price:>5d}€ → {new_price_int:>5d}€")
                    batch_ok += 1
                except Exception as e:
                    log(f"  ❌ DB error: {e}")
            
            total_updated += batch_ok
            total_hallucinations += batch_hallu
            log(f"  Résultat: {batch_ok} mis à jour, {batch_hallu} hallucinations bloquées")
            
        except Exception as e:
            log(f"  ❌ Parse error: {e}")
            total_errors += len(batch)
        
        time.sleep(2)  # Rate limiting
    
    log(f"\n{'='*50}")
    log(f"TERMINÉ!")
    log(f"  Mis à jour: {total_updated}")
    log(f"  Hallucinations bloquées: {total_hallucinations}")
    log(f"  Erreurs: {total_errors}")
    
    # Final sanity check
    r2 = s.table('products').select('id,slug,price_eur,brand,category_id').lt('price_eur', 50).execute()
    bad = [p for p in r2.data if p['price_eur'] > 0 
           and not any(k in p['slug'] for k in ['instax','soundcore'])]
    if bad:
        log(f"⚠️  Produits encore < 50€: {len(bad)}")
        for p in bad[:5]:
            log(f"  {p['slug'][:40]} {p['price_eur']}€")
    else:
        log(f"✅ Aucun prix suspect")

if __name__ == '__main__':
    main()

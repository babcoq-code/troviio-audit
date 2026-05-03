#!/usr/bin/env python3
"""
Rollback + DeepSeek price estimation for corrupted products.
Strategy: 
1. Restore prices from previous good state (manually corrected values)
2. For products still with bad prices, use DeepSeek to estimate
3. Update Supabase with estimated prices
"""

import supabase
import json
import os
import sys
from urllib.request import Request, urlopen

DEEPSEEK_KEY = "sk-6a6c69e0b17849a5b1618c9d71ccb0cc"

def deepseek_ask(messages, temperature=0.1, max_tokens=2000):
    """Call DeepSeek API and return response."""
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
    
    req = Request(url, data=payload, headers=headers, method='POST')
    try:
        resp = urlopen(req, timeout=120)
        result = json.loads(resp.read())
        return result['choices'][0]['message']['content']
    except Exception as e:
        print(f"  API Error: {e}")
        return None

def main():
    s = supabase.create_client(
        'os.getenv("SUPABASE_URL", "")',
        '"SUPABASE_SERVICE_KEY"'
    )
    
    # Get ALL products modified by the bad scraper
    r = s.table('products').select('id,slug,price_eur,brand,name,amazon_asin,category_id').execute()
    all_products = r.data
    print(f"Total products in DB: {len(all_products)}")
    
    # Identify corrupted products (price < 50€ for known brands)
    premium_brands = ['miele', 'kitchenaid', 'magimix', 'bugaboo', 'segway', 'arlo',
                      'simba', 'moma', 'engwe', 'winix', 'honeywell', 'tado',
                      'panasonic', 'sony', 'lg', 'samsung', 'bissell', 'ninja',
                      'dyson', 'fujifilm', 'garmin', 'netatmo', 'ncm',
                      'yamaha', 'bose', 'sennheiser', 'shokz',
                      'moulinex', 'xiaomi', 'anker', 'vanmoof',
                      'tenways', 'decathlon', 'meross', 'awox',
                      'delta', 'proscenic', 'rowenta', 'renpho', 'theragun',
                      'avintage', 'nedis', 'ewelink', 'transparent',
                      'sakar', 'pyle', 'philips', 'tineco', 'oppo',
                      'oneplus', 'google', 'medion', 'jbl', 'logitech',
                      'razer', 'steelseries', 'corsair', 'hyperx']
    
    corrupted = []
    for p in all_products:
        brand = (p.get('brand') or '').lower()
        name = (p.get('name') or '').lower()
        slug = p['slug']
        price = p['price_eur']
        
        # Check if it's a known brand with suspicious price
        is_premium = any(b in brand for b in premium_brands)
        
        is_suspicious = False
        if price < 50 and is_premium:
            is_suspicious = True
        elif price < 5 and not is_premium:
            is_suspicious = True
        
        if is_suspicious:
            corrupted.append(p)
    
    print(f"Corrupted products to fix: {len(corrupted)}")
    
    if len(corrupted) == 0:
        print("Nothing to fix!")
        return
    
    # Batch into groups of 20 for DeepSeek API
    batch_size = 20
    total_updated = 0
    total_errors = 0
    
    for i in range(0, len(corrupted), batch_size):
        batch = corrupted[i:i+batch_size]
        batch_num = i // batch_size + 1
        total_batches = (len(corrupted) + batch_size - 1) // batch_size
        
        print(f"\n=== Batch {batch_num}/{total_batches} ===")
        
        # Build product list for DeepSeek
        product_list = []
        for p in batch:
            brand = p.get('brand', 'Unknown')
            name = p.get('name', p['slug'])
            asin = p.get('amazon_asin', 'N/A')
            specs = str(p.get('key_specs', ''))[:150]
            current = p['price_eur']
            product_list.append(f"- {brand} {name} (slug: {p['slug'][:30]}..., ASIN: {asin}, current_price: {current}€)")
        
        products_text = "\n".join(product_list)
        
        prompt = f"""Tu es un expert en prix de produits de consommation. Pour chaque produit ci-dessous, donne son PRIX DE VENTE APPROXIMATIF en euros en 2026.

Pour estimer, utilise :
1. Le nom et la marque (indication claire du positionnement prix)
2. Le slug (contient souvent des indices)
3. Les spécifications techniques si fournies (key_specs)
4. Le fait qu'un ASIN Amazon existe (confirme que c'est un vrai produit vendu)

RÈGLES :
- Un robot pâtissier KitchenAid/Magimix/Kenwood coûte 150-700€ (pas 29€)
- Un aspirateur robot coûte 200-1500€
- Un vélo électrique/VAE coûte 1000-3000€
- Une trottinette électrique coûte 200-1000€
- Un TV OLED coûte 800-5000€
- Un purificateur d'air Winix/Honeywell coûte 100-300€
- Un casque audio Bose/Sennheiser coûte 150-400€
- Un appareil photo Fujifilm Instax coûte 50-120€
- Un oreiller Simba coûte 60-150€
- Un lave-linge Miele coûte 800-2500€
- Une poussette Bugaboo coûte 500-1200€
- Un robot cuisine Moulinex/Kenwood coûte 100-400€
- Un lave-vaisselle Bosch coûte 400-1500€
- Un barbecue coûte 50-800€
- Les accessoires (câbles, adaptateurs, housses) coûte 4-30€

Réponds UNIQUEMENT avec un JSON array de objects {{"slug": "...", "estimated_price": NUMBER}} — un par produit, dans le même ordre.

Produits :
{products_text}"""
        
        messages = [
            {"role": "system", "content": "Tu es un estimateur de prix. Réponds UNIQUEMENT avec du JSON valide."},
            {"role": "user", "content": prompt}
        ]
        
        result = deepseek_ask(messages)
        if not result:
            print(f"  FAILED: DeepSeek API error for batch {batch_num}")
            # Try simpler approach — one at a time
            for p in batch:
                print(f"  Trying individual: {p['slug'][:30]}...")
                single_prompt = f"""Quel est le prix en euros du produit suivant en 2026 ?
Marque: {p.get('brand', 'N/A')}
Nom: {p.get('name', p['slug'])}
Caractéristiques: {str(p.get('key_specs', ''))[:200]}
ASIN Amazon: {p.get('amazon_asin', 'N/A')}

Réponds UNIQUEMENT par un nombre (le prix en euros, sans symbole ni texte).
"""
                single_msgs = [
                    {"role": "system", "content": "Tu es un estimateur de prix. Réponds UNIQUEMENT par un nombre entier."},
                    {"role": "user", "content": single_prompt}
                ]
                single_result = deepseek_ask(single_msgs, max_tokens=50)
                if single_result:
                    try:
                        price = int(single_result.strip())
                        if price > 0:
                            s.table('products').update({'price_eur': price}).eq('id', p['id']).execute()
                            print(f"  ✅ {p['slug'][:35]:35s} {p['price_eur']:>5d}€ → {price:>5d}€")
                            total_updated += 1
                        else:
                            print(f"  ❌ {p['slug'][:35]:35s} invalid price: {price}")
                            total_errors += 1
                    except:
                        print(f"  ❌ {p['slug'][:35]:35s} couldn't parse: {single_result[:80]}")
                        total_errors += 1
                else:
                    print(f"  ❌ {p['slug'][:35]:35s} API error")
                    total_errors += 1
            continue
        
        # Parse JSON from result
        try:
            # Find JSON array in response
            import re
            json_match = re.search(r'\[.*\]', result, re.DOTALL)
            if not json_match:
                print(f"  No JSON array found in response: {result[:200]}")
                continue
            
            estimates = json.loads(json_match.group())
            
            for est in estimates:
                slug_prefix = est.get('slug', '')[:30]
                price = est.get('estimated_price', 0)
                
                # Find matching product
                matched = [p for p in batch if p['slug'].startswith(slug_prefix)]
                if matched:
                    p = matched[0]
                    if price > 0:
                        s.table('products').update({'price_eur': price}).eq('id', p['id']).execute()
                        print(f"  ✅ {p['slug'][:35]:35s} {p['price_eur']:>5d}€ → {price:>5d}€")
                        total_updated += 1
                    else:
                        print(f"  ❌ {slug_prefix:35s} invalid price: {price}")
                        total_errors += 1
                else:
                    print(f"  ⚠️  No match for slug: {slug_prefix}")
            
        except Exception as e:
            print(f"  Parse error: {e}")
            print(f"  Raw: {result[:200]}")
    
    print(f"\n✅ Done! Updated: {total_updated}, Errors: {total_errors}")
    
    # Final check
    r2 = s.table('products').select('id,slug,price_eur').lt('price_eur', 50).execute()
    print(f"Remaining products with price < 50€: {len(r2.data)}")
    for p in r2.data:
        brand_from_db = [x['brand'] for x in all_products if x['id'] == p['id']]
        brand_name = brand_from_db[0] if brand_from_db else '?'
        print(f"  {str(brand_name)[:20]:20s} {p['slug'][:40]:40s} {p['price_eur']}€")

if __name__ == '__main__':
    main()

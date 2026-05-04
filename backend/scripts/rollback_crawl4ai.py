#!/usr/bin/env python3
"""
Rollback: analyser l'impact du scraper Crawl4AI et corriger avec DeepSeek.
Stratégie:
1. Chercher tous les produits avec des prix visiblement cassés (< 30€ pour des marques premium)
2. Utiliser DeepSeek pour estimer le vrai prix
3. Mettre à jour Supabase
"""
import os, sys, json, re, time
from urllib.request import Request, urlopen

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://uukshxztoztkwxuuvqzc.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
HEADERS = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"}

DEEPSEEK_KEY = "sk-6a6c69e0b17849a5b1618c9d71ccb0cc"

def supabase_get(endpoint, params=None):
    import requests as rq
    if params is None:
        params = {"is_active": "eq.true", "select": "id,slug,name,brand,price_eur,amazon_asin"}
    r = rq.get(f"{SUPABASE_URL}/rest/v1/{endpoint}", headers=HEADERS, params=params, timeout=15)
    return r.json() if r.status_code == 200 else []

def supabase_update(table, id_val, data):
    import requests as rq
    r = rq.patch(f"{SUPABASE_URL}/rest/v1/{table}?id=eq.{id_val}", headers=HEADERS, json=data, timeout=10)
    return r.status_code

def deepseek_ask(messages, temperature=0.1, max_tokens=2000):
    url = "https://api.deepseek.com/chat/completions"
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {DEEPSEEK_KEY}"}
    payload = json.dumps({"model": "deepseek-chat", "messages": messages, "temperature": temperature, "max_tokens": max_tokens}).encode()
    req = Request(url, data=payload, headers=headers, method='POST')
    try:
        resp = urlopen(req, timeout=120)
        return json.loads(resp.read())['choices'][0]['message']['content']
    except Exception as e:
        print(f"  API Error: {e}")
        return None

# Marques premium qui ne devraient JAMAIS être < 30€
PREMIUM_BRANDS = [
    'miele', 'kitchenaid', 'magimix', 'bugaboo', 'segway', 'arlo',
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
    'razer', 'steelseries', 'corsair', 'hyperx',
    'kenwood', 'bosch', 'neato', 'roborock', 'dremel',
    'black decker', 'stanley', 'dewalt', 'milwaukee',
    'makita', 'festool', 'husqvarna', 'stihl',
    'vitamix', 'smeg', 'de longhi', 'gorenje',
    'electrolux', 'aeg', 'siemens', 'liebherr',
    'sebo', 'vorwerk', 'kobold', 'thermomix',
    'apple', 'dell', 'hp', 'lenovo', 'asus',
    'go pro', 'insta360', 'dj', 'canon', 'nikon',
    'shark', 'irobot', 'ecovacs', 'dreame',
    'schneider', 'legrand', 'somfy',
    'garmin', 'suunto', 'polar', 'coros',
    'boss', 'sonos', 'marshall', 'harman',
    'artis', 'dualit', 'sage',
]

def main():
    print("="*60)
    print("ROLLBACK CRAWL4AI — Correction des prix cassés")
    print("="*60)
    
    # 1. Récupérer tous les produits
    all_prods = supabase_get("products")
    print(f"\n📊 Total produits: {len(all_prods)}")
    
    # 2. Identifier les suspects
    suspicious = []
    for p in all_prods:
        price = p.get('price_eur')
        if price is None:
            continue
        brand = (p.get('brand') or '').lower()
        name = (p.get('name') or '').lower()
        slug = p.get('slug', '')
        
        # Seuil agressif — un prix < 30€ pour une marque connue = cassé
        is_premium = any(b in brand for b in PREMIUM_BRANDS)
        
        if price < 30 and is_premium:
            suspicious.append(p)
        elif price < 10:
            suspicious.append(p)
    
    print(f"\n🔍 Produits suspects (prix cassé): {len(suspicious)}")
    for p in suspicious:
        print(f"   {str(p.get('brand','')):20s} {str(p.get('name',''))[:40]:40s} → {p['price_eur']}€")
    
    if len(suspicious) == 0:
        print("\n✅ Rien à corriger !")
        return
    
    # 3. Corriger par DeepSeek
    print(f"\n🧠 Correction via DeepSeek...")
    
    batch_size = 15
    total_ok = 0
    total_err = 0
    
    for i in range(0, len(suspicious), batch_size):
        batch = suspicious[i:i+batch_size]
        batch_num = i // batch_size + 1
        total_batches = (len(suspicious) + batch_size - 1) // batch_size
        
        print(f"\n--- Batch {batch_num}/{total_batches} ---")
        
        # Build product list for DeepSeek
        product_lines = []
        for p in batch:
            product_lines.append(
                f"- {p.get('brand','?')} {p.get('name','?')} "
                f"(slug: {p['slug'][:25]}..., ASIN: {p.get('amazon_asin','N/A')}, "
                f"actuellement: {p['price_eur']}€)"
            )
        
        prompt = f"""Tu es un expert en prix de produits de consommation. Pour chaque produit ci-dessous, estime son PRIX DE VENTE RÉALISTE en euros en 2026.

RÈGLES IMPORTANTES :
- Un robot pâtissier KitchenAid/Magimix/Kenwood = 150-700€
- Un aspirateur robot = 200-1500€
- Un vélo électrique = 1000-3000€
- Une trottinette électrique = 200-1000€
- Un TV/écran = 200-3000€
- Un purificateur d'air = 100-300€
- Un casque audio Bose/Sennheiser/Sony = 80-400€
- Un appareil photo Fujifilm Instax = 50-120€
- Un oreiller/coussin = 30-150€
- Un lave-linge = 400-2000€
- Un lave-vaisselle = 400-1500€
- Une poussette = 200-1200€
- Un robot cuisine = 100-500€
- Un barbecue = 50-1000€
- Un aspirateur traîneau = 100-500€
- Des écouteurs/earbuds = 30-300€
- Une enceinte Bluetooth = 30-500€
- Un fer à repasser/centrale vapeur = 50-300€
- Un grille-pain/petit électro = 30-200€
- Un appareil à raclette/fondu = 30-80€
- Des accessoires (câbles, adaptateurs, housses) = 5-30€
- Une cafetière = 30-500€
- Un four/micro-ondes = 50-1000€
- Un rasoir/epilateur = 30-300€
- Une brosse à dents électrique = 30-300€
- Un babyphone = 30-200€
- Un GPS/écran auto = 100-500€
- Une tondeuse = 100-500€
- Un nettoyeur haute pression = 50-300€

Réponds UNIQUEMENT avec un JSON array d'objets :
{{"slug": "...", "estimated_price": NUMBER}}

Produits :
{chr(10).join(product_lines)}"""
        
        messages = [
            {"role": "system", "content": "Tu es un estimateur de prix. Réponds UNIQUEMENT avec du JSON valide."},
            {"role": "user", "content": prompt}
        ]
        
        result = deepseek_ask(messages)
        if not result:
            print(f"  ❌ Échec API DeepSeek batch {batch_num}")
            total_err += len(batch)
            continue
        
        # Parse JSON
        try:
            json_match = re.search(r'\[.*?\]', result, re.DOTALL)
            if not json_match:
                print(f"  ❌ Pas de JSON trouvé: {result[:150]}")
                total_err += len(batch)
                continue
            
            estimates = json.loads(json_match.group())
            
            for est in estimates:
                slug_p = est.get('slug', '')[:25]
                price = est.get('estimated_price', 0)
                
                matched = [p for p in batch if slug_p in p['slug'] or p['slug'] in slug_p]
                if matched:
                    p = matched[0]
                    if price > 0 and price != p['price_eur']:
                        code = supabase_update('products', p['id'], {'price_eur': price})
                        if code in (200, 204):
                            print(f"  ✅ {str(p.get('brand',''))[:15]:15s} {p['slug'][:25]:25s} {p['price_eur']}€ → {price}€")
                            total_ok += 1
                        else:
                            print(f"  ❌ {p['slug'][:25]:25s} update failed: {code}")
                            total_err += 1
                    elif price == p['price_eur']:
                        print(f"  ➡️  {p['slug'][:25]:25s} déjà {price}€ (inchangé)")
                        total_ok += 1
                    else:
                        print(f"  ⚠️  {p['slug'][:25]:25s} price invalide: {price}")
                        total_err += 1
                else:
                    print(f"  ⚠️  Aucun match pour slug: {slug_p}")
                    total_err += 1
        except Exception as e:
            print(f"  ❌ Parse error: {e}")
            print(f"  Raw: {result[:200]}")
            total_err += len(batch)
        
        time.sleep(1)
    
    print(f"\n{'='*60}")
    print(f"📊 RÉSULTATS : {total_ok} corrigés, {total_err} erreurs")
    
    # Final check
    remains = supabase_get("products", {"is_active": "eq.true", "select": "id,slug,name,brand,price_eur", "price_eur": "lt.30"})
    premium_remains = [p for p in remains if any(b in (p.get('brand') or '').lower() for b in PREMIUM_BRANDS)]
    
    print(f"\n🔍 Vérification finale — produits < 30€ : {len(premium_remains)} marques premium")
    for p in premium_remains:
        print(f"   {str(p.get('brand',''))[:20]:20s} {str(p.get('name',''))[:40]:40s} → {p['price_eur']}€")
    
    if len(premium_remains) == 0:
        print("\n✅ TOUT BON ! Plus aucun prix cassé.")
    else:
        print(f"\n⚠️  {len(premium_remains)} produits encore suspects.")
    
    print("✅ Terminé.")

if __name__ == "__main__":
    main()

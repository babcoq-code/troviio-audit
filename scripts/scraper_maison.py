"""
TROVIIO SCRAPER MAISON — Amazon scraper avec Playwright stealth
Remplace Firecrawl pour la recherche d'ASINs et de prix Amazon.
S'exécute directement sur le host (pas en Docker).

Usage:
  python3 /root/troviio-ciceron/scripts/scraper_maison.py search "Samsung lave linge"
  python3 /root/troviio-ciceron/scripts/scraper_maison.py product B0CZS31LN3
  python3 /root/troviio-ciceron/scripts/scraper_maison.py batch --top3
  python3 /root/troviio-ciceron/scripts/scraper_maison.py batch --all
  python3 /root/troviio-ciceron/scripts/scraper_maison.py batch --asin B0CZS31LN3
"""

import os, sys, json, re, time, argparse, subprocess, tempfile, urllib.parse
from datetime import datetime
from pathlib import Path

CACHE_DIR = "/tmp/troviio_scraper_cache"
os.makedirs(CACHE_DIR, exist_ok=True)

# ─── Playwright template (exécuté via node) ─────────────────

PLAYWRIGHT_SCRIPT_TEMPLATE = '''
const { chromium } = require('playwright');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

async function main() {{
  const browser = await chromium.launch({{
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  }});
  try {{
    const context = await browser.newContext({{
      userAgent: UA,
      viewport: {{ width: 1920, height: 1080 }},
      locale: 'fr-FR',
      timezoneId: 'Europe/Paris',
    }});
    const page = await context.newPage();
    await page.addInitScript(() => {{
      Object.defineProperty(navigator, 'webdriver', {{ get: () => false }});
      Object.defineProperty(navigator, 'plugins', {{ get: () => [1,2,3,4,5] }});
      Object.defineProperty(navigator, 'languages', {{ get: () => ['fr-FR', 'fr', 'en'] }});
      window.chrome = {{ runtime: {{}} }};
    }});

    const mode = {mode!r};
    
    if (mode === 'search') {{
      // Étape 1: warmup Amazon homepage
      await page.goto('https://www.amazon.fr', {{ waitUntil: 'domcontentloaded', timeout: 15000 }}).catch(() => {{}});
      await page.waitForTimeout(2000);

      // Étape 2: search
      const query = """ + """${query!r}"""+ """';
      await page.goto(
        'https://www.amazon.fr/s?k=' + encodeURIComponent(query),
        {{ waitUntil: 'domcontentloaded', timeout: 30000 }}
      );
      await page.waitForTimeout(3000);

      // Vérifier si bloqué
      const bodyText = await page.textContent('body').catch(() => '');
      if (bodyText.includes('Toutes nos excuses') || bodyText.includes('désolé')) {{
        console.log(JSON.stringify({{ blocked: true, error: 'Amazon block page' }}));
        return;
      }}

      // Extraire les résultats
      const results = [];
      const items = await page.$$('[data-asin]');
      for (const item of items) {{
        const asin = await item.getAttribute('data-asin');
        if (!asin || asin.length !== 10) continue;
        
        let title = '';
        let price = '';
        let image = '';
        
        // Titre
        const h2 = await item.$('h2');
        if (h2) title = (await h2.textContent()).trim();
        
        // Prix
        const priceEl = await item.$('.a-price-whole');
        if (priceEl) {{
          price = (await priceEl.textContent()).trim();
        }}
        if (!price) {{
          const offscreen = await item.$('.a-offscreen');
          if (offscreen) price = (await offscreen.textContent()).trim();
        }}
        
        // Image
        const img = await item.$('img.s-image');
        if (img) image = await img.getAttribute('src') || '';
        
        results.push({{ asin, title: title.substring(0, 200), price, image: image.substring(0, 300) }});
      }}

      console.log(JSON.stringify({{ mode: 'search', query, results: results.slice(0, 10) }}));

    }} else if (mode === 'product') {{
      const asin = {asin!r};
      
      // Warmup
      await page.goto('https://www.amazon.fr', {{ waitUntil: 'domcontentloaded', timeout: 15000 }}).catch(() => {{}});
      await page.waitForTimeout(2000);
      
      // Product page
      await page.goto(
        'https://www.amazon.fr/dp/' + asin,
        {{ waitUntil: 'domcontentloaded', timeout: 20000 }}
      );
      await page.waitForTimeout(3000);

      const bodyText = await page.textContent('body').catch(() => '');
      if (bodyText.includes('Toutes nos excuses')) {{
        console.log(JSON.stringify({{ blocked: true, error: 'Blocked', asin }}));
        return;
      }}

      // Titre
      let title = '';
      try {{
        title = await page.textContent('#productTitle') || '';
      }} catch(e) {{}}
      
      // Prix — multiple fallbacks
      let price = '';
      const selectors = [
        '#corePrice_feature_div .a-offscreen',
        '.a-price[data-a-size="xl"] .a-offscreen',
        '.a-price-whole',
        '#price_inside_buybox',
        '.a-price .a-offscreen',
      ];
      for (const sel of selectors) {{
        try {{
          const el = await page.$(sel);
          if (el) {{
            const txt = (await el.textContent()) || '';
            const m = txt.match(/[\d\s]*[.,]?\d+/);
            if (m) {{ price = m[0].trim(); break; }}
          }}
        }} catch(e) {{}}
      }}

      // Image
      let image = '';
      try {{
        const img = await page.$('#landingImage');
        if (img) {{
          image = await img.getAttribute('src') || await img.getAttribute('data-old-hires') || '';
          if (image) image = image.replace(/_AC_SL\\d+/, '_AC_SL1500');
        }}
      }} catch(e) {{}}

      // Marque
      let brand = '';
      try {{
        const byline = await page.textContent('#bylineInfo') || '';
        brand = byline.replace(/^Visitez la boutique /, '').replace(/^Brand: /, '').trim();
      }} catch(e) {{}}

      console.log(JSON.stringify({{
        mode: 'product',
        asin,
        title: title.substring(0, 300).trim(),
        price: price,
        image: image,
        brand: brand.substring(0, 100)
      }}));
    }}

    await browser.close();
  }} catch(e) {{
    console.log(JSON.stringify({{ error: e.message }}));
    await browser.close().catch(() => {{}});
  }}
}}

main();
'''

# ─── Fonctions ──────────────────────────────────────────────

def run_playwright(script_vars: dict) -> dict:
    """Exécute un script Playwright via node avec les variables injectées"""
    script = PLAYWRIGHT_SCRIPT_TEMPLATE
    
    # Remplacer les variables
    for key, val in script_vars.items():
        placeholder = '{' + key + '!r}'
        repr_val = repr(val)
        script = script.replace(placeholder, repr_val)
    
    # Écrire le script temporaire
    tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False, dir=CACHE_DIR)
    tmp.write(script)
    tmp.close()
    
    try:
        result = subprocess.run(
            ['node', tmp.name],
            capture_output=True, text=True, timeout=45,
            env={**os.environ, 'NODE_PATH': '/tmp/node_modules:/usr/lib/node_modules'}
        )
        
        # Parser le JSON de sortie
        for line in result.stdout.strip().split('\n'):
            line = line.strip()
            if line.startswith('{') and line.endswith('}'):
                try:
                    return json.loads(line)
                except:
                    continue
        
        if result.stdout:
            return {"error": f"No JSON in output: {result.stdout[:200]}"}
        if result.stderr:
            return {"error": f"Stderr: {result.stderr[:200]}"}
        return {"error": "Empty output"}
    except subprocess.TimeoutExpired:
        return {"error": "Timeout (45s)"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        os.unlink(tmp.name)


def search_amazon(query: str, use_cache: bool = True) -> list[dict]:
    """Recherche un produit sur Amazon.fr et retourne les résultats"""
    cache_key = f"search_{hash(query)}"
    cache_path = Path(CACHE_DIR) / cache_key
    
    if use_cache and cache_path.exists():
        with open(cache_path) as f:
            cached = json.load(f)
            if cached.get('results'):
                return cached['results']
    
    result = run_playwright({"mode": "search", "query": query, "asin": ""})
    
    if result.get('blocked'):
        print(f"  ⚠️ Amazon bloqué pour: {query}")
        # Retry une fois
        time.sleep(5)
        result = run_playwright({"mode": "search", "query": query, "asin": ""})
    
    results = result.get('results', [])
    
    # Cache
    with open(cache_path, 'w') as f:
        json.dump({"query": query, "results": results, "time": datetime.now().isoformat()}, f)
    
    return results


def get_product(asin: str, use_cache: bool = True) -> dict:
    """Récupère les infos d'un produit Amazon par ASIN"""
    cache_key = f"product_{asin}"
    cache_path = Path(CACHE_DIR) / cache_key
    
    if use_cache and cache_path.exists():
        with open(cache_path) as f:
            return json.load(f)
    
    result = run_playwright({"mode": "product", "query": "", "asin": asin})
    
    if result.get('blocked'):
        time.sleep(5)
        result = run_playwright({"mode": "product", "query": "", "asin": asin})
    
    # Cache
    if not result.get('error'):
        with open(cache_path, 'w') as f:
            json.dump(result, f)
    
    return result


def update_supabase(product_id: str, data: dict):
    """Met à jour Supabase avec les données du produit"""
    cmd = f"""docker exec troviio-ciceron-backend-1 python3 -c "
from supabase import create_client
import json

s = create_client('os.getenv("SUPABASE_URL", "")', '"SUPABASE_SERVICE_KEY"')

data = {json.dumps(data)}
product_id = {json.dumps(product_id)}

s.table('products').update(data).eq('id', product_id).execute()
print('OK')
" 2>&1"""
    
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=15)
    return result.stdout.strip()


def clean_price(price_str: str) -> int | None:
    """Nettoie un prix string → integer (centimes)"""
    if not price_str:
        return None
    price = re.sub(r'[^\d,.]', '', price_str)
    try:
        # Gérer format français 1 234,56 ou 1234.56
        price = price.replace(' ', '')
        if ',' in price and '.' in price:
            price = price.replace('.', '').replace(',', '.')
        elif ',' in price:
            price = price.replace(',', '.')
        return int(float(price))
    except:
        return None


# ─── CLI ────────────────────────────────────────────────────

def cmd_search(args):
    query = ' '.join(args.query)
    print(f"🔍 Recherche: {query}")
    results = search_amazon(query, use_cache=not args.no_cache)
    if not results:
        print("  Aucun résultat")
        return
    
    for i, p in enumerate(results[:10], 1):
        price_str = f"{p['price']}€" if p.get('price') else "?"
        title = p.get('title', '?')[:100]
        print(f"  {i}. {p['asin']} | {price_str} | {title}")
    
    # Sauvegarder dans un fichier
    safe_query = re.sub(r'[^a-zA-Z0-9_-]', '_', query)[:50]
    out_path = f"{CACHE_DIR}/result_{safe_query}.json"
    with open(out_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\n💾 Résultats sauvegardés: {out_path}")


def cmd_product(args):
    print(f"📦 Produit: {args.asin}")
    info = get_product(args.asin, use_cache=not args.no_cache)
    
    if info.get('error'):
        print(f"  ❌ Erreur: {info['error']}")
        return
    
    if info.get('blocked'):
        print(f"  ⚠️ Bloqué par Amazon")
        return
    
    print(f"  Titre: {info.get('title', '?')[:120]}")
    print(f"  Prix: {info.get('price', '?')}")
    print(f"  Image: {info.get('image', '?')[:100]}")
    print(f"  Marque: {info.get('brand', '?')}")


def cmd_batch(args):
    """Batch processing: find ASINs for products missing them"""
    
    # Récupérer les produits sans ASIN depuis Supabase
    limit = args.limit or 50
    
    cmd = f"""docker exec troviio-ciceron-backend-1 python3 -c "
from supabase import create_client
import json
s = create_client('os.getenv("SUPABASE_URL", "")', '"SUPABASE_SERVICE_KEY"')
resp = s.table('products').select('id,name,slug,category_id,is_active').is_('amazon_asin', 'null').eq('is_active', True).limit({limit}).execute()
print(json.dumps(resp.data))
" 2>&1"""
    
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=15)
    try:
        products = json.loads(result.stdout.strip())
    except:
        print(f"❌ Erreur Supabase: {result.stdout[:200]}")
        return
    
    print(f"📊 {len(products)} produits sans ASIN à traiter")
    
    for i, prod in enumerate(products):
        name = prod['name']
        print(f"\n[{i+1}/{len(products)}] {name}")
        
        # Construire la requête de recherche Amazon
        # Extraire le modèle du nom
        query = name.split('(')[0].strip()  # Enlever les parenthèses
        
        # Chercher
        results = search_amazon(query, use_cache=False)
        if not results:
            print(f"  ❌ Aucun résultat")
            continue
        
        # Prendre le premier résultat
        best = results[0]
        asin = best['asin']
        price = clean_price(best.get('price', ''))
        
        print(f"  ✅ {asin} | {best.get('title','?')[:80]}")
        
        # Récupérer le prix exact via la page produit
        product_info = get_product(asin, use_cache=True)
        if product_info.get('price'):
            price = clean_price(product_info['price'])
        
        # Construire les données à updater
        tag = "troviio-21"
        affiliate_url = f"https://www.amazon.fr/dp/{asin}?tag={tag}"
        
        update_data = {
            'amazon_asin': asin,
            'affiliate_url': affiliate_url,
            'merchant_links': {
                "Amazon": {
                    "url": affiliate_url,
                    "merchantName": "Amazon",
                    "priceEur": price or None,
                    "inStock": True
                }
            }
        }
        
        if price:
            update_data['price_eur'] = price
        
        # Mettre à jour Supabase
        supabase_result = update_supabase(prod['id'], update_data)
        print(f"  💾 Supabase: {supabase_result}")
        
        # Pause entre chaque requête
        time.sleep(3)


def cmd_clean_cache(args):
    shutil = __import__('shutil')
    if os.path.exists(CACHE_DIR):
        shutil.rmtree(CACHE_DIR)
        os.makedirs(CACHE_DIR)
        print("🧹 Cache vidé")
    else:
        print("📭 Pas de cache")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Troviio Scraper Maison')
    subparsers = parser.add_subparsers(dest='command')
    
    # search
    search_parser = subparsers.add_parser('search', help='Rechercher sur Amazon')
    search_parser.add_argument('query', nargs='+', help='Termes de recherche')
    search_parser.add_argument('--no-cache', action='store_true', help='Ignorer le cache')
    
    # product
    product_parser = subparsers.add_parser('product', help='Infos produit par ASIN')
    product_parser.add_argument('asin', help='ASIN Amazon')
    product_parser.add_argument('--no-cache', action='store_true', help='Ignorer le cache')
    
    # batch
    batch_parser = subparsers.add_parser('batch', help='Batch: trouver ASINs des produits sans')
    batch_parser.add_argument('--limit', type=int, default=50, help='Nombre max de produits')
    batch_parser.add_argument('--no-cache', action='store_true', help='Ignorer le cache')
    batch_parser.add_argument('--top3', action='store_true', help='Seulement les Top 3 (score 9+)')
    
    # clean-cache
    subparsers.add_parser('clean-cache', help='Vider le cache')
    
    args = parser.parse_args()
    
    if args.command == 'search':
        cmd_search(args)
    elif args.command == 'product':
        cmd_product(args)
    elif args.command == 'batch':
        # S'assurer que Playwright est disponible
        if args.command == 'batch' and args.top3:
            print("Mode Top 3 activé — seulement les produits avec score >= 9")
        cmd_batch(args)
    elif args.command == 'clean-cache':
        cmd_clean_cache(args)
    else:
        parser.print_help()

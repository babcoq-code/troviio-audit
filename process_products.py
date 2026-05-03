#!/usr/bin/env python3
"""
Script to replace and update 34 Troviio products without Amazon.fr ASINs.
"""

import json
import re
import time
import subprocess as sp
import sys
import base64
import urllib.request
import urllib.error

FIRECRAWL_KEY_B64 = "ZmMtOGUxMTdhMTM3N2M2NGMwYzg2NmMzNWFkYzkyZTJkMGQ="

def get_firecrawl_key():
    return base64.b64decode(FIRECRAWL_KEY_B64).decode()

def firecrawl_scrape(url):
    """Scrape a URL using Firecrawl API"""
    key = get_firecrawl_key()
    data = json.dumps({
        "url": url,
        "formats": ["rawHtml"],
        "waitFor": 3000
    }).encode()
    
    req = urllib.request.Request(
        'https://api.firecrawl.dev/v1/scrape',
        data=data,
        headers={
            'Authorization': f'Bearer {key}',
            'Content-Type': 'application/json'
        },
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            if result.get('success') and result.get('data', {}).get('rawHtml'):
                return result['data']['rawHtml']
            return None
    except Exception as e:
        print(f"  ERROR scraping: {e}")
        return None

def extract_asin_from_html(html):
    """Extract first ASIN from search results page"""
    # Look for /dp/ASIN pattern
    asins = re.findall(r'/dp/(B0[0-9A-Z]{9})', html)
    if not asins:
        asins = re.findall(r'/dp/(B[0-9A-Z]{9,10})', html)
    if asins:
        return asins[0]
    # Try data-asin attribute
    asins = re.findall(r'data-asin="([^"]+)"', html)
    valid = [a for a in asins if len(a) >= 10 and a.startswith('B')]
    if valid:
        return valid[0]
    return None

def scrape_amazon_product(asin):
    """Scrape a product page for title and price"""
    url = f"https://www.amazon.fr/dp/{asin}"
    html = firecrawl_scrape(url)
    if not html:
        return None, None
    
    # Extract title
    title = None
    m = re.search(r'<span id="productTitle"[^>]*>(.*?)</span>', html, re.DOTALL)
    if m:
        title = re.sub(r'<[^>]+>', '', m.group(1)).strip()
    if not title:
        m = re.search(r'id="productTitle"[^>]*>(.*?)</span>', html, re.DOTALL)
        if m:
            title = re.sub(r'<[^>]+>', '', m.group(1)).strip()
    
    # Extract price
    price = None
    # Pattern 1: a-price-whole + a-price-fraction
    whole = re.search(r'<span class="a-price-whole">([\d\s]+)</span>', html)
    frac = re.search(r'<span class="a-price-fraction">(\d{2})</span>', html)
    if whole:
        price_str = whole.group(1).replace('\u202f', '').replace('\xa0', '').replace(' ', '').replace(',', '')
        try:
            if frac:
                price = float(price_str + '.' + frac.group(1))
            else:
                price = float(price_str)
        except:
            pass
    
    if not price:
        m = re.search(r'a-price"[^>]*>.*?<span[^>]*aria-hidden="true">([\d\s,.]+)\u20ac', html, re.DOTALL)
        if m:
            try:
                price = float(m.group(1).replace('\u202f', '').replace('\xa0', '').replace(' ', '').replace(',', '.'))
            except:
                pass
    
    return title, price

def search_amazon_first_result(search_query):
    """Search Amazon.fr and return first product's ASIN, title, and price"""
    url = f"https://www.amazon.fr/s?k={search_query.replace(' ', '+')}"
    html = firecrawl_scrape(url)
    if not html:
        print(f"  No HTML returned for: {search_query}")
        return None, None, None
    
    asin = extract_asin_from_html(html)
    if not asin:
        print(f"  No ASIN found for: {search_query}")
        return None, None, None
    
    print(f"  Found ASIN: {asin}")
    
    title, price = scrape_amazon_product(asin)
    if title:
        print(f"  Title: {title[:100]}...")
    if price:
        print(f"  Price: {price}€")
    
    return asin, title, price

def update_supabase(product_id, name, slug, asin, price):
    """Update Supabase with new product info"""
    tag = "troviio-21"
    affiliate_url = f"https://www.amazon.fr/dp/{asin}?tag={tag}"
    
    # Escape single quotes for Python string
    name_esc = name.replace("'", "''")
    
    merchant_links = json.dumps({
        "Amazon": {
            "url": affiliate_url,
            "merchantName": "Amazon",
            "priceEur": price,
            "inStock": True
        }
    })
    ml_esc = merchant_links.replace("'", "''")
    
    cmd = [
        sys.executable, '-c',
        f"""
from supabase import create_client
s = create_client('os.getenv("SUPABASE_URL", "")','"SUPABASE_SERVICE_KEY"')
try:
    r = s.table('products').update({{
        'name': '{name_esc}',
        'slug': '{slug}',
        'amazon_asin': '{asin}',
        'affiliate_url': '{affiliate_url}',
        'price_eur': {price},
        'merchant_links': '{ml_esc}'
    }}).eq('id', '{product_id}').execute()
    print('OK:' + str(r))
except Exception as e:
    print('ERR:' + str(e))
"""
    ]
    
    result = sp.run(cmd, capture_output=True, text=True, timeout=30)
    stdout = result.stdout.strip()
    stderr = result.stderr.strip()
    
    if 'OK:' in stdout:
        print(f"  ✅ Updated: {name[:60]} -> {asin} ({price}€)")
        return True
    else:
        print(f"  ❌ Supabase error: {stdout} {stderr}")
        return False

def load_products():
    with open('/tmp/troviio_products_no_asin.json') as f:
        data = json.loads(f.read())
        if isinstance(data, list):
            return data
        elif isinstance(data, dict) and 'output' in data:
            return json.loads(data['output'])
        return []

def run():
    products_list = load_products()
    product_map = {p['id']: p for p in products_list}
    
    # Define search queries and replacements for each product
    replacements = {
        "3c31873b-8942-48d9-ba5e-764c3b4a9a19": {  # Samsung WW90T754ABH
            "search": "Samsung lave linge WW90T",
            "name": "Samsung Série 5 WW90DG5B25AH Lave-linge",
            "slug": "lave-linge-samsung-samsung-serie-5-ww90dg5b25ah"
        },
        "0ed42278-93a7-418a-86af-d1f1010fdd85": {  # Miele G 5360 SCVi
            "search": "Miele lave vaisselle encastrable",
            "name": "Miele G 5000 Lave-vaisselle encastrable",
            "slug": "lave-vaisselle-miele-miele-g-5000"
        },
        "f1f04c35-ea57-4f92-9601-02192c98a2f0": {  # Bosch SMV6ZCX01E
            "search": "Bosch lave vaisselle Serie 4 SMV",
            "name": "Bosch Série 4 SMV46MX01E Lave-vaisselle",
            "slug": "lave-vaisselle-bosch-bosch-serie-4-smv46mx01e"
        },
        "52542c12-8b63-41f7-b6da-acbb88946eed": {  # Thermomix -> Monsieur Cuisine Connect
            "search": "Monsieur Cuisine Connect robot",
            "name": "Monsieur Cuisine Connect Robot cuiseur",
            "slug": "robot-cuisine-lidl-monsieur-cuisine-connect"
        },
        "a8b33a34-5a26-41de-9aa6-8b897dd06118": {  # Bosch Série 4 SMV46MX01E
            "search": "Bosch SMV46MX01E lave vaisselle",
            "name": "Bosch Série 4 SMV46MX01E Lave-vaisselle",
            "slug": "lave-vaisselle-bosch-bosch-serie-4-smv46mx01e"
        },
        "29054a3c-cd26-41b9-9c31-8c9cf70fc248": {  # Inokim OXO
            "search": "Inokim OXO trottinette electrique",
            "name": "Inokim OXO Trottinette électrique",
            "slug": "trottinette-inokim-inokim-oxo"
        },
        "4feefc80-098c-4772-9a6d-90f76d80cb55": {  # Inokim Light 2
            "search": "Inokim Light 2 trottinette",
            "name": "Inokim Light 2 Trottinette électrique",
            "slug": "trottinette-inokim-inokim-light-2"
        },
        "7caaf108-4937-45fa-8598-c9c23eae7728": {  # Transtherm C18V
            "search": "Cave a vin Transtherm",
            "name": "Cave à vin Transtherm 18 bouteilles",
            "slug": "cave-a-vin-transtherm-cave-vin-transtherm-18"
        },
        "14bb071c-0bdf-4ee8-bcf1-6d502f84726d": {  # Transtherm C30V
            "search": "Cave a vin Transtherm 30",
            "name": "Cave à vin Transtherm 30 bouteilles",
            "slug": "cave-a-vin-transtherm-cave-vin-transtherm-30"
        },
        "b094e48f-31de-4678-9cfb-a80e76b86969": {  # Vinvautz VZ52M
            "search": "Cave a vin Vinvautz",
            "name": "Cave à vin Vinvautz 52 bouteilles",
            "slug": "cave-a-vin-vinvautz-cave-vin-vinvautz-52"
        },
        "a84e2f72-20f1-4d5f-9dde-003a8b80d3bb": {  # Dualtron Mini
            "search": "Dualtron Mini trottinette electrique",
            "name": "Dualtron Mini Trottinette électrique",
            "slug": "trottinette-dualtron-dualtron-mini"
        },
        "cfdb0035-7c43-4fb7-a35c-a0289f89d7b8": {  # Navee N65
            "search": "Navee N65 trottinette electrique",
            "name": "Navee N65 Trottinette électrique",
            "slug": "trottinette-navee-navee-n65"
        },
        "438f11d0-e40e-4e5a-9992-a2309ee936e7": {  # Pure Air Pro LR
            "search": "Pure Air Pro LR trottinette electrique",
            "name": "Pure Air Pro LR Trottinette électrique",
            "slug": "trottinette-pure-pure-air-pro-lr"
        },
        "e9915ce8-1592-40d1-9ad7-c238bca46b98": {  # Segway D38U
            "search": "Segway Ninebot D38U trottinette",
            "name": "Segway Ninebot D38U Trottinette électrique",
            "slug": "trottinette-segway-segway-ninebot-d38u"
        },
        "e00967e9-300c-44f9-b6ac-a96e4720995a": {  # Segway D18U
            "search": "Segway Ninebot D18U trottinette",
            "name": "Segway Ninebot D18U Trottinette électrique",
            "slug": "trottinette-segway-segway-ninebot-d18u"
        },
        "28cf9125-dbef-45dd-b4fc-b03fbd1e2c61": {  # Tenways CGO600
            "search": "Tenways CGO600 velo electrique",
            "name": "Tenways CGO600 Pro Vélo électrique",
            "slug": "velo-electrique-tenways-tenways-cgo600-pro"
        },
        "01e031b3-b2e7-44ca-9a4b-aa89a3f56e63": {  # Fiido D21
            "search": "Fiido D21 velo electrique",
            "name": "Fiido D21 Vélo électrique",
            "slug": "velo-electrique-fiido-fiido-d21"
        },
        "29b1b128-581e-406f-a05b-9cb9a6ab2413": {  # Fiido X
            "search": "Fiido X velo electrique",
            "name": "Fiido X Vélo électrique",
            "slug": "velo-electrique-fiido-fiido-x"
        },
        "733b7227-fe42-46af-a492-2db92fe636c8": {  # Engwe Engine Pro
            "search": "Engwe Engine Pro velo electrique",
            "name": "Engwe Engine Pro 2.0 Vélo électrique",
            "slug": "velo-electrique-engwe-engwe-engine-pro-20"
        },
        "4872f5fa-bb27-4473-80bd-3819ddd2c039": {  # Engwe T14
            "search": "Engwe T14 velo electrique",
            "name": "Engwe T14 Vélo électrique",
            "slug": "velo-electrique-engwe-engwe-t14"
        },
        "6c4f2556-b4b6-43ce-8b33-d71455ab6161": {  # Decathlon Rockrider
            "search": "Rockrider E-ST 100 Decathlon",
            "name": "Rockrider E-ST 100 Vélo électrique",
            "slug": "velo-electrique-decathlon-rockrider-e-st-100"
        },
        "c6529ac1-a423-47e2-8766-3a7cd5e8495b": {  # Elops 120
            "search": "Elops 120 E Decathlon",
            "name": "Elops 120 E Vélo électrique",
            "slug": "velo-electrique-decathlon-elops-120-e"
        },
        "75f9336c-4473-4b28-9cf3-4609febd5a29": {  # Moma E-Motion 7
            "search": "Moma E-Motion 7 velo electrique",
            "name": "Moma E-Motion 7 Vélo électrique",
            "slug": "velo-electrique-moma-moma-e-motion-7"
        },
        "f2311b8a-5a39-4a08-8df8-17eaa6d69d95": {  # Xiaomi Himo C26
            "search": "Xiaomi Himo C26 velo electrique",
            "name": "Xiaomi Himo C26 Vélo électrique",
            "slug": "velo-electrique-xiaomi-xiaomi-himo-c26"
        },
        "18f7d47d-c26b-4104-84b1-e8367317478f": {  # NCM Moscow Plus
            "search": "NCM Moscow Plus velo electrique",
            "name": "NCM Moscow Plus Vélo électrique",
            "slug": "velo-electrique-ncm-ncm-moscow-plus"
        },
        "a13e8ebe-f703-4325-ae46-0c151c0a9d64": {  # Rad Power RadRover
            "search": "Rad Power RadRover velo electrique",
            "name": "Rad Power RadRover 6 Plus Vélo électrique",
            "slug": "velo-electrique-rad-power-rad-power-radrover-6-plus"
        },
        "d55bd428-d4b2-4b1c-9621-8ae7592e455e": {  # Bosch Série 6 WAU28RH9FF
            "search": "Bosch WAU28RH9FF lave linge",
            "name": "Bosch Série 6 WAU28RH9FF Lave-linge",
            "slug": "lave-linge-bosch-bosch-serie-6-wau28rh9ff"
        },
        "1fcdfe22-6736-46a0-93b9-dffff38ae1dc": {  # LG F4WV709S1E
            "search": "LG F4WV709S1E lave linge",
            "name": "LG F4WV709S1E Lave-linge",
            "slug": "lave-linge-lg-lg-f4wv709s1e"
        },
        "f2ae0af4-8dfe-49e8-8edc-6347e6ac17a9": {  # Electrolux EW7F3929BF
            "search": "Electrolux EW7F3929BF lave linge",
            "name": "Electrolux EW7F3929BF Lave-linge",
            "slug": "lave-linge-electrolux-electrolux-ew7f3929bf"
        },
        "4807a03f-a028-4a6f-9c9b-c2523bc05bc0": {  # Whirlpool WFC3C26PFR
            "search": "Whirlpool WFC3C26PFR lave vaisselle",
            "name": "Whirlpool WFC3C26PFR Lave-vaisselle",
            "slug": "lave-vaisselle-whirlpool-whirlpool-wfc3c26pfr"
        },
        "f22eba53-3303-488a-89df-980e18ca6be9": {  # Siemens iQ700
            "search": "Siemens iQ700 SN87YX12CE lave vaisselle",
            "name": "Siemens iQ700 SN87YX12CE Lave-vaisselle",
            "slug": "lave-vaisselle-siemens-siemens-iq700-sn87yx12ce"
        },
        "49d251f7-6037-4a66-b7f1-b3714e2ef65e": {  # Electrolux ESL4ED18S
            "search": "Electrolux ESL4ED18S lave vaisselle",
            "name": "Electrolux ESL4ED18S Lave-vaisselle",
            "slug": "lave-vaisselle-electrolux-electrolux-esl4ed18s"
        },
        "caec02d9-3ed0-493c-b657-3b35fbd3c75b": {  # Prosenic P30
            "search": "Prosenic P30 purificateur air",
            "name": "Prosenic P30 Purificateur d air",
            "slug": "purificateur-air-prosenic-prosenic-p30"
        },
        "371c0363-86a0-459f-a20d-32d2a515897f": {  # Cosori CO151
            "search": "Cosori CO151 robot cuisine",
            "name": "Cosori CO151 Robot cuisine multifonction",
            "slug": "robot-cuisine-cosori-cosori-co151"
        },
    }

    results = {"success": [], "failed": [], "skipped": []}
    
    for pid, info in replacements.items():
        product = product_map.get(pid)
        if not product:
            print(f"\n=== Product ID {pid} not found in JSON, skipping ===")
            results["skipped"].append(pid)
            continue
        
        orig_name = product['name']
        print(f"\n{'='*60}")
        print(f"Processing: {orig_name}")
        print(f"Searching: {info['search']}")
        
        # Extraire la marque attendue du nom original
        expected_brand = orig_name.split(' ')[0] if orig_name else ''
        
        asin, title, price = search_amazon_first_result(info['search'])
        
        # Vérifier que la marque correspond
        if asin and title:
            title_lower = title.lower()
            brand_lower = expected_brand.lower()
            if brand_lower and brand_lower not in title_lower and brand_lower != 'vélo' and brand_lower != 'cave':
                # Si la marque ne correspond pas, chercher avec la marque
                print(f"  ⚠️ Marque '{expected_brand}' pas dans titre, recherche plus précise...")
                brand_query = f"{expected_brand} {info['search']}"
                asin, title, price = search_amazon_first_result(brand_query)
        
        if not asin:
            print(f"  ❌ No ASIN found for {orig_name}")
            results["failed"].append(pid)
            continue
        
        if not price:
            # Fallback prices by category
            cat = info['slug']
            if 'lave-linge' in cat: price = 549
            elif 'lave-vaisselle' in cat: price = 499
            elif 'trottinette' in cat: price = 399
            elif 'velo' in cat: price = 899
            elif 'cave' in cat: price = 299
            elif 'robot' in cat: price = 249
            elif 'purificateur' in cat: price = 179
            else: price = 299
            print(f"  Using fallback price: {price}€")
        
        display_name = title[:100] if (title and len(title) > 10) else info['name']
        
        success = update_supabase(pid, display_name, info['slug'], asin, int(price))
        
        if success:
            results["success"].append(pid)
        else:
            results["failed"].append(pid)
        
        print("  Waiting 2 seconds...")
        time.sleep(2)
    
    print(f"\n{'='*60}")
    print(f"RESULTS:")
    print(f"  Success: {len(results['success'])}")
    print(f"  Failed: {len(results['failed'])}")
    print(f"  Skipped: {len(results['skipped'])}")
    
    with open('/tmp/troviio_update_results.json', 'w') as f:
        json.dump(results, f)
    
    return results

if __name__ == '__main__':
    run()

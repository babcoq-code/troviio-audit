#!/usr/bin/env python3
"""Batch fetch Amazon product images for Troviio products without image_url."""
import json, time, re, base64, urllib.request, urllib.error, sys

FIRECRAWL_KEY_B64 = "ZmMtOGUxMTdhMTM3N2M2NGMwYzg2NmMzNWFkYzkyZTJkMGQ="
SUPABASE_URL = "os.getenv("SUPABASE_URL", "")"
SUPABASE_KEY = ""SUPABASE_SERVICE_KEY""

def get_firecrawl_key():
    return base64.b64decode(FIRECRAWL_KEY_B64).decode()

def firecrawl_scrape(url):
    key = get_firecrawl_key()
    data = json.dumps({"url": url, "formats": ["rawHtml"], "waitFor": 4000}).encode()
    req = urllib.request.Request(
        'https://api.firecrawl.dev/v1/scrape', data=data,
        headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}
    )
    resp = urllib.request.urlopen(req, timeout=30)
    return json.loads(resp.read())

def extract_amazon_image(html):
    """Extract the main product image URL from Amazon HTML."""
    # Try various patterns
    patterns = [
        r'"hiRes":"([^"]+)"',
        r'"large":"([^"]+)"',
        r'id="landingImage"[^>]+src="([^"]+)"',
        r'data-old-hires="([^"]+)"',
        r'class="a-dynamic-image[^"]*"[^>]+src="([^"]+)"',
        r'src="(https://m\.media-amazon\.com/images/I/[^"]+)"',
    ]
    for p in patterns:
        m = re.search(p, html)
        if m:
            return m.group(1).replace("&amp;", "&")
    return None

def update_supabase(pid, image_url):
    payload = json.dumps({"image_url": image_url}).encode()
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/products?id=eq.{pid}",
        data=payload,
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        method="PATCH"
    )
    resp = urllib.request.urlopen(req, timeout=10)
    return resp.status

def get_products_without_images():
    url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,amazon_asin&is_active=eq.true&image_url=is.null"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    })
    resp = urllib.request.urlopen(req, timeout=15)
    return json.loads(resp.read())

products = get_products_without_images()
print(f"Produits sans image : {len(products)}")

success = 0
failed = 0
skipped_asins = set()

for p in products:
    pid = p["id"]
    name = p["name"][:60]
    asin = p.get("amazon_asin")
    
    if not asin or asin == "N/A" or asin in skipped_asins:
        print(f"  ⏭️ {name} — pas d'ASIN")
        failed += 1
        continue
    
    amazon_url = f"https://www.amazon.fr/dp/{asin}"
    print(f"  🔍 {name} — {amazon_url}")
    
    try:
        result = firecrawl_scrape(amazon_url)
        html = result.get("data", {}).get("rawHtml", "")
        
        if len(html) < 1000:
            print(f"  ⚠️  Page bloquée ou vide ({len(html)} chars)")
            failed += 1
            continue
        
        image_url = extract_amazon_image(html)
        if image_url:
            # Clean URL - ensure HTTPS and proper format
            image_url = image_url.replace("http://", "https://")
            if "m.media-amazon.com" not in image_url and "images-amazon.com" not in image_url:
                print(f"  ⚠️  URL suspecte: {image_url[:80]}")
            
            status = update_supabase(pid, image_url)
            if status == 204:
                print(f"  ✅ Image trouvée et sauvegardée")
                success += 1
            else:
                print(f"  ❌ Supabase error: {status}")
                failed += 1
        else:
            print(f"  ❌ Aucune image trouvée dans le HTML")
            failed += 1
    except Exception as e:
        print(f"  ❌ Erreur: {str(e)[:80]}")
        failed += 1
    
    # Rate limiting
    time.sleep(2.5)

print(f"\nRésultat: {success} succès, {failed} échecs sur {len(products)} produits")

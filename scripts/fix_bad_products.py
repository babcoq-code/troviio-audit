#!/usr/bin/env python3
"""
Fix 38 products with corrupted names ("If you agree...") by scraping real data from Amazon.
"""
import os, json, urllib.request, re, time, sys, uuid

SUPABASE_URL = "os.getenv("SUPABASE_URL", "")"
SUPABASE_SERVICE_KEY = ""SUPABASE_SERVICE_KEY""
FIRECRAWL_API_KEY = "fc-8e117a1cee5303414a8fbc3f60f7e0e2"

import supabase
sb = supabase.create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def firecrawl_scrape(url: str, wait_ms=6000):
    """Scrape une URL via Firecrawl, retourne le résultat JSON."""
    data = json.dumps({
        "url": url,
        "formats": ["markdown", "rawHtml"],
        "onlyMainContent": False,
        "waitFor": wait_ms,
    }).encode()
    req = urllib.request.Request(
        "https://api.firecrawl.dev/v1/scrape",
        data=data,
        headers={
            "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
            "Content-Type": "application/json",
        }
    )
    try:
        resp = urllib.request.urlopen(req, timeout=90)
        return json.loads(resp.read())
    except Exception as e:
        print(f"  ⚠️ Firecrawl error: {e}")
        return None

def extract_title_from_markdown(md: str) -> str:
    """Extract real product title from markdown content."""
    lines = md.split("\n")
    # Skip lines that are cookie consent, navigation, breadcrumbs etc.
    skip_patterns = [
        "if you agree", "we may use", "personal information",
        "accept all", "reject all", "manage cookies",
        "skip to main", "customer reviews", "buy new",
        "visit the", "brand:", "amazon basics", "edit",
        "sell on amazon", "amazon web", "vehicle information",
        "1-", "see more", "page 1", "€€", "€",
        "select delivery location",
    ]
    best_lines = []
    for i, line in enumerate(lines[:50]):
        line = line.strip()
        # Must start with a letter or digit
        if not line or not line[0].isalnum():
            continue
        # Must be at least 25 chars
        if len(line) < 25:
            continue
        # Skip if contains skip phrases
        lower = line.lower()
        if any(p in lower for p in skip_patterns):
            continue
        best_lines.append(line)
    if best_lines:
        # Return the first good line, truncated to 300 chars
        return best_lines[0][:300]
    return ""

def extract_title_from_html(html: str) -> str:
    """Alternative: extract title from HTML meta tags."""
    # Try <title> tag
    m = re.search(r'<title[^>]*>([^<]+)</title>', html, re.IGNORECASE)
    if m:
        title = m.group(1).strip()
        # Remove "Amazon.fr : " prefix
        title = re.sub(r'^Amazon\.fr\s*:\s*', '', title)
        # Remove suffix after " - "
        title = re.sub(r'\s*-\s*Amazon\s*$', '', title, flags=re.IGNORECASE)
        if len(title) > 20 and "If you agree" not in title:
            return title[:300]
    return ""

def extract_image_url(html: str) -> str:
    """Extract product image URL from raw HTML."""
    patterns = [
        r'https://m\.media-amazon\.com/images/I/[^"\'\\\s]+\._SL[0-9]+_\.jpg',
        r'https://m\.media-amazon\.com/images/I/[^"\'\\\s]+\._AC_SL[0-9]+_\.jpg',
        r'https://m\.media-amazon\.com/images/I/[^"\'\\\s]+\._AC_UL[0-9]+_\.jpg',
    ]
    for p in patterns:
        m = re.search(p, html)
        if m:
            return m.group(0)
    return ""

def extract_price(md: str, html: str) -> int:
    """Extract price in euro cents from markdown or HTML."""
    combined = md + "\n" + html
    # Pattern: number with optional decimal, followed by €
    patterns = [
        r'(\d+)[.,](\d{2})\s*[€€]',  # 29.99€
        r'(\d+)\s*[€€]',              # 29€
        r'[€€]\s*(\d+)[.,](\d{2})',    # €29.99
        r'[€€]\s*(\d+)',               # €29
        r'[\$€€]\s*(\d+)[.,](\d{2})',  # $29.99
        r'(\d+)[.,](\d{2})\s*[\$€]',   # 29.99$
    ]
    
    # Prefer the a-price-whole pattern from Amazon's HTML
    price_whole = re.search(r'"a-price-whole"[^>]*>(\d+)', html)
    price_fraction = re.search(r'"a-price-fraction"[^>]*>(\d+)', html)
    if price_whole:
        whole = int(price_whole.group(1))
        frac = int(price_fraction.group(1)) if price_fraction else 0
        return whole * 100 + frac

    for p in patterns:
        m = re.search(p, combined)
        if m:
            groups = m.groups()
            if len(groups) >= 2 and groups[1] is not None:
                whole = int(groups[0])
                frac = int(groups[1])
                if frac > 99:
                    whole = frac
                    frac = 0
                return whole * 100 + frac
            elif len(groups) >= 1:
                return int(groups[0]) * 100
    
    return 0

def extract_brand(title: str, md: str) -> str:
    """Extract brand from the product page."""
    # Try to find brand in markdown
    m = re.search(r'\b(?:Brand|Marque|By)\s*[:]\s*([A-Za-z0-9][A-Za-z0-9\s\-\.]{1,30})', md, re.IGNORECASE)
    if m:
        brand = m.group(1).strip()
        if len(brand) < 25:
            return brand
    # Fallback: first word of title
    if title:
        first_word = title.split()[0].strip(",.!?:;\"'«»")
        # Ignore common non-brand first words
        ignore_words = {'le', 'la', 'les', 'the', 'un', 'une', 'des', 'de', 'du', 'au', 'aux', 'et', 'ou', 'pour', 'avec', 'sur', 'dans', 'par', 'en', 'neuf', 'nouveau', 'nouvelle', 'pack', 'lot', 'set'}
        if first_word.lower() not in ignore_words and len(first_word) > 1:
            return first_word
    return ""

def update_product(pid: str, asin: str, title: str, brand: str, image_url: str, price_eur: int, old_price: int):
    """Update product in Supabase."""
    data = {
        "name": title,
        "brand": brand,
        "image_url": image_url,
        "price_eur": price_eur,
        "merchant_links": {
            "Amazon": {
                "url": f"https://www.amazon.fr/dp/{asin}?tag=troviio-21",
                "merchantName": "Amazon",
                "priceEur": price_eur,
                "inStock": True,
            }
        }
    }
    r = sb.table("products").update(data).eq("id", pid).execute()
    if r.data:
        print(f"    ✅ Mis à jour: {brand} - {title[:60]}... ({price_eur/100:.2f}€)")
        return True
    print(f"    ❌ Erreur update: {r}")
    return False


def main():
    # Step 1: Find all products with bad names
    print("🔍 Recherche des produits avec noms corrompus...")
    r = sb.table("products").select("id,name,amazon_asin,category_id,brand,image_url,price_eur").ilike("name", "If %").execute()
    
    products = r.data
    print(f"📦 {len(products)} produits trouvés")
    
    if not products:
        print("✅ Aucun produit à corriger!")
        return
    
    # Build lookup: asin -> product info
    product_map = {p["amazon_asin"]: p for p in products}
    asins = list(product_map.keys())
    
    success_count = 0
    fail_asins = []
    skipped = 0
    
    for i, asin in enumerate(asins):
        p = product_map[asin]
        pid = p["id"]
        old_price = p.get("price_eur", 0)
        
        print(f"\n[{i+1}/{len(asins)}] ASIN: {asin} (ID: {pid[:8]}...)")
        
        # Scrape Amazon product page
        url = f"https://www.amazon.fr/dp/{asin}"
        result = firecrawl_scrape(url, wait_ms=8000)
        
        if not result or not result.get("success"):
            print(f"  ❌ Firecrawl a échoué pour {asin}")
            fail_asins.append(asin)
            continue
        
        md = result.get("data", {}).get("markdown", "")
        html = result.get("data", {}).get("rawHtml", "")
        
        # Extract title
        title = extract_title_from_markdown(md)
        if not title:
            title = extract_title_from_html(html)
        if not title:
            # Last resort: use category default name
            cat_id = p["category_id"]
            cr = sb.table("categories").select("slug").eq("id", cat_id).execute()
            cat_slug = cr.data[0]["slug"] if cr.data else "produit"
            title = f"Produit {asin}"
            print(f"  ⚠️ Titre non trouvé, fallback: {title}")
        
        # Extract image
        image_url = extract_image_url(html)
        if image_url:
            # Upgrade to higher resolution
            image_url = re.sub(r'\._SL[0-9]+_\.jpg', '._SL1500_.jpg', image_url)
            print(f"  🖼️ Image trouvée")
        else:
            print(f"  ⚠️ Image non trouvée")
        
        # Extract price
        price_eur = extract_price(md, html)
        if price_eur == 0:
            # If old price exists, keep it
            price_eur = old_price if old_price > 0 else 2999
            print(f"  ⚠️ Prix non trouvé, gardé: {price_eur/100:.2f}€")
        else:
            print(f"  💰 Prix: {price_eur/100:.2f}€")
        
        # Extract brand
        brand = extract_brand(title, md)
        print(f"  🏷️ Marque: {brand}")
        
        # Update in Supabase
        if update_product(pid, asin, title, brand, image_url, price_eur, old_price):
            success_count += 1
        
        # Rate limiting: 500ms between requests
        time.sleep(0.6)
    
    print(f"\n{'='*60}")
    print(f"📊 RÉSULTATS:")
    print(f"   ✅ Succès: {success_count}/{len(asins)}")
    print(f"   ❌ Échecs: {len(fail_asins)}")
    if fail_asins:
        print(f"   ASINs en échec: {', '.join(fail_asins)}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()

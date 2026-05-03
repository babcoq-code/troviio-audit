#!/usr/bin/env python3
"""
Troviio ASIN Finder - utilise undetected-chromedriver pour bypasser Amazon.
"""
import json, sys, time, re, os
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from supabase import create_client

SUPABASE_URL = "os.getenv("SUPABASE_URL", "")"
SUPABASE_KEY = "SUPABASE_SERVICE_KEY_PLACEHOLDER"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

class AmazonSearcher:
    def __init__(self):
        options = uc.ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_argument('--lang=fr-FR')
        options.add_argument('--window-size=1920,1080')
        self.driver = uc.Chrome(options=options, version_main=131)
        # Warm up with Amazon homepage
        self.driver.get('https://www.amazon.fr')
        time.sleep(2)
    
    def search_asin(self, query):
        try:
            url = f'https://www.amazon.fr/s?k={requests.utils.quote(query)}'
            self.driver.get(url)
            time.sleep(3)
            
            # Check if blocked
            body = self.driver.find_element(By.TAG_NAME, 'body').text
            if 'Toutes nos excuses' in body:
                return None, True
            
            # Find ASINs
            asins = self.driver.execute_script("""
                return Array.from(document.querySelectorAll('[data-asin]'))
                    .map(el => el.getAttribute('data-asin'))
                    .filter(a => a && a.length === 10)
            """)
            return (asins[0] if asins else None), False
        except Exception as e:
            return None, False
    
    def close(self):
        try:
            self.driver.quit()
        except:
            pass

import requests

# Load existing
try:
    with open("/tmp/asins_uc.json") as f:
        existing = json.load(f)
    print(f"Reprise: {len(existing)} déjà trouvés")
except:
    existing = {}

# Get products
r = supabase.table("products").select("slug,name,brand,model").is_("amazon_asin", "null").execute()
prods = r.data

# Prioriser P1
priority = []
for p in prods:
    slug = p["slug"]
    if slug in existing:
        continue
    brand = (p.get("brand") or "").strip() if p.get("brand") != "None" else ""
    model = (p.get("model") or "").strip() if p.get("model") != "None" else ""
    name = p.get("name", "")
    if re.search(r'(iPhone.*1[7]|SE 4|Galaxy S26)', name):
        continue
    if brand and model:
        priority.append(p)

print(f"À traiter: {len(priority)}")

# Initialize driver
searcher = AmazonSearcher()
print("Driver OK")

found = {}
try:
    for i, p in enumerate(priority):
        slug = p["slug"]
        name = re.sub(r"[⭐🌟★]", "", p.get("name","")).split("(")[0].split("—")[0].strip()
        brand = (p.get("brand") or "").strip()
        model = (p.get("model") or "").strip() if p.get("model") != "None" else ""
        
        print(f"[{i+1}/{len(priority)}] {slug[:35]:35s}... ", end="", flush=True)
        
        queries = [f"{brand} {model}", name[:70]]
        asin = None
        for q in queries:
            asin, blocked = searcher.search_asin(q)
            if asin:
                break
            if blocked:
                print("BLOCKED!")
                raise Exception("Amazon blocked")
        
        if asin:
            found[slug] = asin
            print(f"✓ {asin}")
        else:
            print(f"✗")
        
        time.sleep(1)
        
        if len(found) >= 5:
            existing.update(found)
            for sl, av in found.items():
                supabase.table("products").update({"amazon_asin": av}).eq("slug", sl).execute()
            with open("/tmp/asins_uc.json", "w") as f:
                json.dump(existing, f, indent=2)
            found = {}
finally:
    searcher.close()

# Final save
existing.update(found)
for sl, av in found.items():
    supabase.table("products").update({"amazon_asin": av}).eq("slug", sl).execute()
with open("/tmp/asins_uc.json", "w") as f:
    json.dump(existing, f, indent=2)

print(f"\n✅ Total: {len(existing)}")
for s, a in sorted(existing.items()):
    print(f"  {s}: {a}")

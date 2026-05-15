#!/opt/oscar-env/bin/python3
"""
Troviio Twitter Bot — Publication automatique toutes les 2h
3 thèmes aléatoires : produit Troviio, duel Troviio, actu tech fraîche
Style : humour pop culture
Utilise twikit avec les cookies Oscar (même IP fixe)
"""

import json, httpx, os, random, re, sys, asyncio
from datetime import datetime, timezone
from pathlib import Path

# ── Config ──────────────────────────────────────────────────
SUPABASE_URL = "https://uukshxztoztkwxuuvqzc.supabase.co"
with open('/tmp/supabase_key.txt') as f:
    SUPABASE_KEY = f.read().strip()
with open('/tmp/deepseek_key.txt') as f:
    DEEPSEEK_KEY = f.read().strip()
DEEPSEEK_MODEL = "deepseek-chat"

# Cookies partagés avec Oscar (même IP fixe)
COOKIES_FILE = "/root/troviio-ciceron/secrets/troviio_cookies.json"

HISTORY_FILE = "/tmp/troviio_twitter_history.json"
NEWS_FILE = "/tmp/troviio_news_cache.json"

HEADERS_SUPA = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

# ── History management ─────────────────────────────────────

def load_history():
    if not os.path.exists(HISTORY_FILE):
        return {"history": [], "product_slugs": []}
    try:
        with open(HISTORY_FILE) as f:
            data = json.load(f)
            if "product_slugs" not in data:
                data["product_slugs"] = []
            return data
    except:
        return {"history": [], "product_slugs": []}

def save_history_entry(entry):
    hist = load_history()
    hist["history"].append(entry)
    hist["history"] = hist["history"][-50:]  # keep last 50
    if entry.get("products"):
        for slug in entry["products"]:
            hist["product_slugs"].append(slug)
    hist["product_slugs"] = hist["product_slugs"][-100:]  # keep last 100
    with open(HISTORY_FILE, 'w') as f:
        json.dump(hist, f, ensure_ascii=False)

# ── Theme selection ────────────────────────────────────────

def pick_theme():
    hist = load_history()
    last_types = [e.get("type") for e in hist["history"][-3:]]
    
    themes = ["produit", "duel", "actu"]
    # Don't repeat the same theme twice in a row
    available = [t for t in themes if t != (last_types[-1] if last_types else None)]
    return random.choice(available)

# ── Fetch product from Supabase ────────────────────────────

def fetch_random_product(exclude_slugs=None):
    exclude_slugs = exclude_slugs or []
    
    r = httpx.get(f"{SUPABASE_URL}/rest/v1/products", headers=HEADERS_SUPA, params={
        "select": "name,brand,slug,category_id,specs,estimated_score,test_summary,use_case_scores",
        "is_active": "eq.true",
        "limit": 50,
        "order": "updated_at.desc",
    })
    if r.status_code != 200:
        return None
    products = r.json()
    if not isinstance(products, list):
        return None
    
    # Filtrer ceux déjà utilisés et avec un score correct
    candidates = [p for p in products 
                  if p.get("slug") not in exclude_slugs 
                  and p.get("estimated_score") and p["estimated_score"] >= 7.0
                  and p.get("specs") and len(p["specs"]) > 2]
    
    if not candidates:
        return None
    
    return random.choice(candidates)

def fetch_two_products(exclude_slugs=None):
    """Pour un duel : 2 produits différents de la même catégorie"""
    exclude_slugs = exclude_slugs or []
    
    r = httpx.get(f"{SUPABASE_URL}/rest/v1/products", headers=HEADERS_SUPA, params={
        "select": "name,brand,slug,category_id,specs,estimated_score",
        "is_active": "eq.true",
        "limit": 100,
        "order": "updated_at.desc",
    })
    if r.status_code != 200:
        return None, None
    products = r.json()
    if not isinstance(products, list):
        return None, None
    
    # Grouper par catégorie
    from collections import defaultdict
    by_cat = defaultdict(list)
    for p in products:
        if p.get("slug") not in exclude_slugs and p.get("estimated_score") and p["estimated_score"] >= 7.0:
            by_cat[p.get("category_id", "unknown")].append(p)
    
    # Trouver une catégorie avec au moins 2 produits
    for cat_id, prods in by_cat.items():
        if len(prods) >= 2:
            return random.sample(prods, 2)
    
    return None, None

# ── Fetch news (actu tech) ─────────────────────────────────

def fetch_fresh_news():
    """Récupère les actus tech des dernières 48h via RSS"""
    # Utiliser plusieurs sources RSS tech FR
    feeds = [
        "https://www.clubic.com/feed/news.rss",
        "https://www.frandroid.com/feed",
        "https://www.lesnumeriques.com/rss/feed.xml",
        "https://feeds.feedburner.com/journaldugeek",
    ]
    
    news_items = []
    
    for feed_url in feeds:
        try:
            r = httpx.get(feed_url, timeout=15, follow_redirects=True)
            if r.status_code != 200:
                continue
            # Parser le RSS basique
            text = r.text
            # Extraire les items RSS
            import xml.etree.ElementTree as ET
            root = ET.fromstring(text)
            
            # Namespace handling
            ns = {}
            for key, val in root.attrib.items():
                if 'xmlns' in key:
                    ns[key.split('}')[0].lstrip('{') if '}' in key else 'default'] = val
            
            # Chercher les items
            for item in root.iter('item') if root.find('.//item') is not None else root.iter('{http://www.w3.org/2005/Atom}entry'):
                try:
                    title = item.findtext('title') or item.findtext('{http://www.w3.org/2005/Atom}title')
                    link = item.findtext('link') or (item.find('{http://www.w3.org/2005/Atom}link').attrib.get('href') if item.find('{http://www.w3.org/2005/Atom}link') is not None else '')
                    pubdate = item.findtext('pubDate') or item.findtext('published') or item.findtext('{http://www.w3.org/2005/Atom}updated')
                    description = item.findtext('description') or item.findtext('summary') or ''
                    
                    if title and link:
                        news_items.append({
                            "title": title.strip(),
                            "link": link.strip(),
                            "date": pubdate or "",
                            "description": description.strip()[:300] if description else ""
                        })
                except:
                    continue
        except:
            continue
    
    # Filtrer les actus tech pertinentes (pas les deals, pas les tests longue durée)
    keywords = ["test", "comparatif", "nouveau", "sort", "lanc", "présent", "annonc", 
                "smartphone", "PC", "laptop", "casque", "TV", "OLED", "robot", "IA",
                "Apple", "Samsung", "Sony", "Dyson", "Xiaomi", "AMD", "Intel", "NVIDIA",
                "écran", "autonomie", "charge", "sans fil", "5G", "WiFi", "Bluetooth"]
    
    tech_news = [n for n in news_items 
                 if any(k.lower() in n["title"].lower() for k in keywords)]
    
    # Garder les 20 plus récentes
    return tech_news[:20]

# ── DeepSeek call ──────────────────────────────────────────

def call_deepseek(system_prompt, user_prompt, temp=0.85, max_tokens=250):
    payload = {
        "model": DEEPSEEK_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": temp
    }
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        resp = httpx.post("https://api.deepseek.com/v1/chat/completions", 
                          json=payload, headers=headers, timeout=30)
        if resp.status_code != 200:
            print(f"DeepSeek error: {resp.status_code} {resp.text[:200]}")
            return None
        return resp.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"DeepSeek call failed: {e}")
        return None

# ── Twitter post via twikit (comme Oscar) ─────────────────────────

async def post_to_twitter_async(tweet_text):
    """Poste le tweet via twikit avec les cookies Oscar (même IP fixe)."""
    from twikit import Client
    client = Client("fr-FR")

    with open(COOKIES_FILE) as f:
        raw = json.load(f)
    client.set_cookies({c["name"]: c["value"] for c in raw})

    # Warmup session
    try:
        await client.get_user_by_screen_name("Troviio_com")
    except Exception:
        pass

    try:
        tweet = await client.create_tweet(tweet_text)
    except Exception as e:
        err_msg = str(e)[:300]
        print(f"⚠️ Twikit error: {err_msg}")
        with open("/tmp/troviio_last_tweet.txt", "w") as f:
            f.write(tweet_text + f"\n\n--- ERROR: {err_msg}")
        print(f"✅ Tweet sauvegardé dans /tmp/troviio_last_tweet.txt (fallback)")
        return True
    tweet_id = getattr(tweet, "id", None) or getattr(tweet, "rest_id", None)

    if tweet_id:
        print(f"✅ Tweet posté ! ID: {tweet_id}")
        print(f"   URL: https://x.com/Troviio_com/status/{tweet_id}")
        print(f"   Taille: {len(tweet_text)} chars")
        print(f"   Contenu: {tweet_text[:100]}...")
        return True
    else:
        print(f"⚠️ Twikit: pas d'ID retourné")
        with open("/tmp/troviio_last_tweet.txt", "w") as f:
            f.write(tweet_text)
        print(f"✅ Tweet sauvegardé dans /tmp/troviio_last_tweet.txt (fallback)")
        return True

def post_to_twitter(tweet_text):
    """Wrapper synchrone pour post_to_twitter_async."""
    return asyncio.run(post_to_twitter_async(tweet_text))

# ── Generate tweet per theme ───────────────────────────────

SYSTEM_BASE = """Tu es Troviio (@Troviio_com), un assistant IA d'aide à l'achat français. Tu tweetes avec humour et références pop culture. 

RÈGLES STRICTES :
- Max 240 caractères
- Toujours un nombre/chiffre concret (spec, score, date...)
- 0 émoji (sauf exception)
- 0 hashtag
- 0 prix (pas de €, euros, prix, coûte)
- Structure en 2-3 blocs aérés (sauts de ligne)
- Ton : "pote geek qui s'y connaît trop" - pas commercial
- Référence pop culture/métaphore absurde dans les 15 premiers mots
- Cibler le grand public français (refs Marvel, Star Wars, Matrix, Breaking Bad, Stranger Things, Harry Potter, The Office...)

Les 15 premiers mots DOIVENT contenir une ref pop culture ou métaphore absurde."""

def generate_product_tweet(product):
    specs = product.get("specs", {})
    score = round(product.get("estimated_score", 0))
    if score > 100:
        score = round(score / 10)
    brand = product.get("brand", "")
    name = product.get("name", "")
    
    # Extraire les specs intéressantes
    spec_lines = "\n".join([f"  - {k}: {v}" for k, v in specs.items() if v and str(v).strip()][:8])
    
    sys_prompt = SYSTEM_BASE + f"""
    
Rubrique : FUN TECH 🎭 — Un produit, une spec absurde ou géniale, un angle drôle.

Produit : {brand} {name}
Score Troviio : {score}/100
Spécifications :
{spec_lines}

Écris UN tweet humoristique avec une ref pop culture. Mentionne le score {score}/100 quelque part.
EXIGENCE ABSOLUE : Le tweet NE DOIT PAS dépasser 240 caractères. Vise 200-220 caractères pour être sûr.
"""
    
    user_prompt = f"Génère un tweet FUN TECH pour {brand} {name} basé sur ses specs. MAX 240 CARACTÈRES STRICT."
    
    tweet = call_deepseek(sys_prompt, user_prompt, max_tokens=200)
    if tweet:
        # Nettoyage
        tweet = tweet.strip('"').strip("'").strip()
        # Enlever les préfixes "Rubrique:" ou "**"
        if "Rubrique" in tweet[:30] or tweet.startswith("**"):
            lines = tweet.split('\n')
            for line in lines:
                if line.strip() and not line.startswith("Rubrique") and not line.startswith("**") and ":" not in line[:20]:
                    tweet = line.strip()
                    break
    
    return tweet

def generate_duel_tweet(product1, product2):
    specs1 = product1.get("specs", {})
    specs2 = product2.get("specs", {})
    score1 = round(product1.get("estimated_score", 0))
    score2 = round(product2.get("estimated_score", 0))
    if score1 > 100: score1 = round(score1 / 10)
    if score2 > 100: score2 = round(score2 / 10)
    
    sys_prompt = SYSTEM_BASE + f"""
    
Rubrique : COMPARATIF ⚔️ — Deux produits s'affrontent sur une spec clé.

Produit 1 : {product1['brand']} {product1['name']} — {score1}/100
Produit 2 : {product2['brand']} {product2['name']} — {score2}/100

Spécifications P1 : {json.dumps(specs1, ensure_ascii=False)[:300]}
Spécifications P2 : {json.dumps(specs2, ensure_ascii=False)[:300]}

Trouve UNE spec clé qui les départage (poids, autonomie, puissance, etc.) et écris un tweet duel avec ref pop culture. Inclus les deux scores.
EXIGENCE ABSOLUE : Le tweet NE DOIT PAS dépasser 240 caractères. Vise 200-220 caractères pour être sûr.
"""
    
    user_prompt = f"Génère un tweet COMPARATIF entre {product1['brand']} {product1['name']} et {product2['brand']} {product2['name']}. MAX 240 CARACTÈRES STRICT."
    
    return call_deepseek(sys_prompt, user_prompt, max_tokens=200)

def generate_news_tweet(news_items):
    if not news_items:
        return None
    
    # Prendre la actu la plus récente et intéressante
    news = random.choice(news_items[:5])
    
    sys_prompt = SYSTEM_BASE + f"""
    
Rubrique : FUN TECH / ACTU 🎭 — Une actualité tech transformée en tweet drôle.

Actualité : {news['title']}
Source : {news['link']}
Détail : {news['description'][:200]}

Transforme cette actu en tweet humoristique avec ref pop culture. Ne cite pas la source. 
Sois drôle et pertinent. L'actu doit être reconnaissable mais pas citée littéralement.
EXIGENCE ABSOLUE : Le tweet NE DOIT PAS dépasser 240 caractères. Vise 180-200 caractères pour être sûr.
"""
    
    user_prompt = f"Génère un tweet FUN TECH basé sur cette actu : {news['title']}. MAX 240 CARACTÈRES STRICT."
    
    return call_deepseek(sys_prompt, user_prompt, max_tokens=200)

# ── Main ────────────────────────────────────────────────────

def main():
    hist = load_history()
    theme = pick_theme()
    
    print(f"🎯 Thème choisi : {theme}")
    
    tweet = None
    
    if theme == "produit":
        product = fetch_random_product(hist.get("product_slugs", []))
        if product:
            print(f"📦 Produit : {product['brand']} {product['name']}")
            tweet = generate_product_tweet(product)
            save_history_entry({
                "type": "produit",
                "date": datetime.now(timezone.utc).isoformat(),
                "products": [product["slug"]],
                "theme": "FUN TECH"
            })
    
    elif theme == "duel":
        p1, p2 = fetch_two_products(hist.get("product_slugs", []))
        if p1 and p2:
            print(f"⚔️ Duel : {p1['brand']} {p1['name']} vs {p2['brand']} {p2['name']}")
            tweet = generate_duel_tweet(p1, p2)
            save_history_entry({
                "type": "duel",
                "date": datetime.now(timezone.utc).isoformat(),
                "products": [p1["slug"], p2["slug"]],
                "theme": "COMPARATIF"
            })
    
    elif theme == "actu":
        news = fetch_fresh_news()
        if news:
            print(f"📰 Actu : {news[0]['title'][:80]}...")
            tweet = generate_news_tweet(news)
            save_history_entry({
                "type": "actu",
                "date": datetime.now(timezone.utc).isoformat(),
                "products": [],
                "theme": "ACTU"
            })
    
    if tweet and len(tweet) > 10:
        # Si le tweet est trop long, retenter avec une consigne plus stricte
        if len(tweet) > 240:
            print(f"⚠️ Tweet trop long ({len(tweet)} chars), tentative de retry...")
            # Retry en tronquant le prompt
            excess = len(tweet) - 220
            retry_prompt = (
                f"Raccourcis ce tweet de {excess} caractères min. "
                f"Garde l'idée principale et la ref pop culture. "
                f"MAX 240 CARACTÈRES. "
                f"Tweet: {tweet}"
            )
            retry_tweet = call_deepseek(
                "Tu es un éditeur de tweet. Réécris le tweet en max 240 caractères.",
                retry_prompt,
                temp=0.4,
                max_tokens=300
            )
            if retry_tweet:
                tweet = retry_tweet.strip('"').strip("'").strip()
                # Nettoyer les préfixes
                for prefix in ["Rubrique", "**", "Voici", "Tweet", "Version"]:
                    if tweet.startswith(prefix) and ":" in tweet[:20]:
                        tweet = tweet.split(":", 1)[1].strip()
        
        # Troncature de dernier recours
        if len(tweet) > 240:
            print(f"⚠️ Toujours trop long ({len(tweet)} chars), troncature forcée")
            tweet = tweet[:237] + "..."
        
        if len(tweet) > 10:
            print(f"\n📝 Tweet généré ({len(tweet)} chars):")
            print(tweet)
            print()
            post_to_twitter(tweet)
        else:
            print(f"❌ Tweet trop court après correction")
            sys.exit(0)
    else:
        print("❌ Aucun tweet généré")
        sys.exit(0)

if __name__ == "__main__":
    main()

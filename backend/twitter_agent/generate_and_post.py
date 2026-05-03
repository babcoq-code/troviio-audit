#!/usr/bin/env python3
"""
Troviio Twitter Agent — Community Manager IA @Troviio_com
Poste toutes les 4h : produits, tops, fonctionnalités, actualités marques, humour.
Ton : Troviio (IA, direct, français, piquant mais utile)
"""
import os, sys, json, random, re, time, hashlib
from datetime import datetime, timezone
from pathlib import Path

# ── Configuration ────────────────────────────────────────────────
SUPABASE_URL = "os.getenv("SUPABASE_URL", "")"
SUPABASE_KEY = ""SUPABASE_SERVICE_KEY""
DEEPSEEK_KEY = os.environ.get("DEEPSEEK_API_KEY", "sk-6d3968641768414bbebf76a822fd696c")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"

TWITTER_CONFIG = {
    "api_key": "NpAClwcWMdjHwxLh3BZZxhIG7",
    "api_secret": "dHEWG2xyBayUZBidbNjCCt5m3xoCNMP44jMFNzcFG2ODEjidPG",
    "access_token": "2050609911801782272-PWeAdzvFjaFPIG1GHCzfR8cA3SAmgx",
    "access_secret": "oK7Fd4oimBlf8C0R6Ph8Bcu3Hnbw6MDGXI0QYsH1Rer5T",
}

HISTORY_FILE = "/tmp/troviio_twitter_history.json"
MAX_POSTS = 200

# ── Catégories pour les posts ────────────────────────────────────
POST_TYPES = [
    "product_highlight",   # Mise en avant d'un produit
    "top3",                # Top 3 d'une catégorie
    "feature",             # Fonctionnalité du site
    "comparison",          # Comparatif 2 produits
    "brand_reply",         # Mention d'une marque
    "fun",                 # Humour/actu tech
    "retailer_mention",    # Darty/Fnac/Amazon
]

CATEGORIES = [
    "smartphone", "aspirateur-robot", "aspirateur-balai", "lave-linge",
    "lave-vaisselle", "tv", "casque-audio", "machine-a-cafe",
    "ordinateur-portable", "trottinette", "velo-electrique",
    "robot-cuisine", "enceinte-bt", "poussette", "barre-de-son",
]

BRANDS = [
    "Dreame", "Roborock", "Dyson", "Miele", "Samsung", "LG", "Sony",
    "Bosch", "Philips", "Nespresso", "De'Longhi", "Jura", "Apple",
    "Xiaomi", "Nothing", "Dji", "Ninja", "Moulinex", "KitchenAid",
    "Electrolux", "Rowenta", "Seat", "Tefal", "Garmin", "Bose",
    "Sennheiser", "Sony", "Shokz", "Yamaha", "Sonos", "Marshall",
]

RETAILERS = ["@Darty", "@Fnac", "@Amazon", "@BoulangerFR", "@Cdiscount", "@RueDuCommerce", "@Leclerc"]


def get_supabase():
    from supabase import create_client
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def load_history():
    try:
        with open(HISTORY_FILE) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"posted": [], "used_products": [], "used_brands": [], "used_retailers": []}


def save_history(history):
    for key in ["used_products", "used_brands", "used_retailers"]:
        history[key] = history.get(key, [])[-MAX_POSTS:]
    history["posted"] = history.get("posted", [])[-MAX_POSTS:]
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)


def pick_product(supabase, history):
    """Pick a product that hasn't been tweeted recently"""
    used = set(history.get("used_products", []))
    prods = supabase.table("products").select(
        "id,name,brand,slug,estimated_score,price_eur,image_url,pros,cons,category_id"
    ).eq("is_active", True).not_.is_("estimated_score", "null").order("estimated_score", desc=True).execute()
    
    candidates = [p for p in prods.data if p["id"] not in used]
    if not candidates:
        # reset
        candidates = prods.data[:50]
    
    if not candidates:
        return None
    
    # Prendre un produit au hasard parmi les mieux notés (poids: score)
    weights = [max(0.1, p.get("estimated_score", 1)) for p in candidates]
    chosen = random.choices(candidates, weights=weights, k=1)[0]
    
    # Récupérer la catégorie 
    cat = supabase.table("categories").select("slug,name").eq("id", chosen["category_id"]).execute()
    cat_name = cat.data[0]["name"] if cat.data else "Produit"
    chosen["category_name"] = cat_name
    chosen["category_slug"] = cat.data[0]["slug"] if cat.data else ""
    
    return chosen


def pick_top3(supabase):
    """Pick a random category and get top 3"""
    cat = random.choice(CATEGORIES)
    cat_data = supabase.table("categories").select("id,name").eq("slug", cat).limit(1).execute()
    if not cat_data.data:
        return None
    cat_id = cat_data.data[0]["id"]
    cat_name = cat_data.data[0]["name"]
    
    prods = supabase.table("products").select(
        "brand,name,slug,estimated_score,price_eur"
    ).eq("is_active", True).eq("category_id", cat_id).not_.is_("estimated_score", "null").order("estimated_score", desc=True).limit(3).execute()
    
    if len(prods.data) < 3:
        return None
    
    return {"category": cat_name, "category_slug": cat, "products": prods.data}


def pick_comparison(supabase, history):
    """Pick 2 products in the same category for comparison"""
    cat = random.choice(CATEGORIES)
    cat_data = supabase.table("categories").select("id,name").eq("slug", cat).limit(1).execute()
    if not cat_data.data:
        return None
    cat_id = cat_data.data[0]["id"]
    cat_name = cat_data.data[0]["name"]
    
    prods = supabase.table("products").select(
        "id,brand,name,slug,estimated_score,price_eur"
    ).eq("is_active", True).eq("category_id", cat_id).not_.is_("estimated_score", "null").order("estimated_score", desc=True).limit(10).execute()
    
    if len(prods.data) < 2:
        return None
    
    used = set(history.get("used_products", []))
    available = [p for p in prods.data if p["id"] not in used]
    if len(available) < 2:
        available = prods.data[:5]
    
    p1, p2 = random.sample(available, 2)
    return {"category": cat_name, "category_slug": cat, "p1": p1, "p2": p2}


def generate_tweet(supabase, history, post_type=None):
    """Generate a tweet using DeepSeek"""
    if not post_type:
        post_type = random.choices(
            POST_TYPES, 
            weights=[4, 2, 1, 2, 1, 1, 1],  # Plus de produits qu'autre chose
            k=1
        )[0]
    
    context = {}
    tweet_text = None
    
    if post_type == "product_highlight":
        product = pick_product(supabase, history)
        if not product: return None
        
        context = {
            "type": "product",
            "name": f"{product['brand']} {product['name']}",
            "score": product.get("estimated_score", 0),
            "price": product.get("price_eur", "?"),
            "category": product.get("category_name", ""),
            "slug": product["slug"],
            "pros": (product.get("pros") or [])[:2],
            "cons": (product.get("cons") or [])[:2],
        }
        history["used_products"].append(product["id"])
    
    elif post_type == "top3":
        top3 = pick_top3(supabase)
        if not top3: return None
        context = {
            "type": "top3",
            "category": top3["category"],
            "category_slug": top3["category_slug"],
            "products": [
                {"name": f"{p['brand']} {p['name']}", "score": p.get("estimated_score", 0), "price": p.get("price_eur", "?")}
                for p in top3["products"]
            ],
        }
    
    elif post_type == "comparison":
        comp = pick_comparison(supabase, history)
        if not comp: return None
        context = {
            "type": "comparison",
            "category": comp["category"],
            "category_slug": comp["category_slug"],
            "p1": {"name": f"{comp['p1']['brand']} {comp['p1']['name']}", "score": comp['p1'].get("estimated_score", 0), "price": comp['p1'].get("price_eur", "?")},
            "p2": {"name": f"{comp['p2']['brand']} {comp['p2']['name']}", "score": comp['p2'].get("estimated_score", 0), "price": comp['p2'].get("price_eur", "?")},
        }
    
    elif post_type == "brand_reply":
        brand = random.choice(BRANDS)
        context = {
            "type": "brand_reply",
            "brand": brand,
        }
    
    elif post_type == "retailer_mention":
        retailer = random.choice(RETAILERS)
        context = {
            "type": "retailer_mention",
            "retailer": retailer,
        }
    
    elif post_type == "feature":
        features = [
            ("IA personnalisée", "Notre IA analyse 50+ critères pour te recommander UNIQUEMENT le produit qui te correspond - pas celui qui rapporte le plus."),
            ("Test impartial", "Zéro pub. Zéro biais. Nos liens Amazon sont identiques pour tous les produits - on gagne pareil, tu choisis vraiment."),
            ("Comparateur intelligent", "Fini les comparateurs bidons qui classent par commission. Troviio utilise une IA entraînée sur des milliers d'avis vérifiés."),
            ("Chat IA", "Tu veux un conseil ? Discute avec notre IA directement sur le site. 5 questions et elle sait tout de toi."),
            ("Top 3 par catégorie", "Chaque mois, notre IA sélectionne le Top 3 des meilleurs produits dans 24 catégories. Pas de bullshit, que des tests réels."),
        ]
        title, desc = random.choice(features)
        context = {"type": "feature", "title": title, "description": desc}
    
    elif post_type == "fun":
        fun_ideas = [
            "Un gars a acheté un aspirateur robot à 900€ et le nomme \"Donald\". On valide ou pas ? 🤔",
            "Tu passes plus de temps à choisir ton smartphone que ton appart. Normal. C'est plus important.",
            "Quand tu découvres que le lave-vaisselle à 1000€ lave aussi bien que celui à 500€ mais en 15 min de moins... #priorités",
            "Les specs c'est bien. Savoir si ça rentre dans ta cuisine c'est mieux. On checke les dimensions pour toi.",
            "Avoir 15 aspirateurs robots en base de données et aucun chez soi. La triste vie d'un comparateur produit.",
            "On a testé 25 cafetières. Verdict : la meilleure n'est pas la plus chère. Et non, on te dira pas laquelle ici. Faut aller sur le site.",
        ]
        context = {"type": "fun", "text": random.choice(fun_ideas)}
        tweet_text = context["text"]
    
    # Si pas de texte déjà défini (fun), on appelle DeepSeek
    if not tweet_text:
        prompt = build_prompt(post_type, context)
        tweet_text = call_deepseek(prompt)
    
    if not tweet_text:
        return None
    
    # Nettoyer et limiter à 280 chars
    tweet_text = tweet_text.strip().strip('"\'')
    if len(tweet_text) > 280:
        tweet_text = tweet_text[:277] + "..."
    
    return {"text": tweet_text, "type": post_type, "context": context}


def build_prompt(post_type, context):
    if post_type == "product_highlight":
        return f"""Tu es le Community Manager Twitter de Troviio, un comparateur produit IA français. Ton ton : direct, expert, un brin piquant, jamais vendeur. Tu parles à des gens normaux pas à des ingés.

Tu dois tweeter en français sur ce produit :
- Nom : {context['name']}
- Note : {context['score']}/10
- Prix : {context['price']}€
- Catégorie : {context['category']}
- Points forts : {', '.join(context.get('pros', []))}
- Points faibles : {', '.join(context.get('cons', []))}

Règles :
- MAX 280 caractères. Pas de hashtags. Pas d'emojis abusifs (1 max).
- Inclus un lien vers troviio.com/produit/{context['slug']}
- Accroche la curiosité, ne donne pas tout
- Tu peux taquiner gentiment le produit si pertinent
- Format : une phrase punchy + lien"""

    elif post_type == "top3":
        prods = context['products']
        lines = "\n".join([f"{i+1}. {p['name']} ({p['score']}/10){' - '+str(p['price'])+'€' if p['price'] else ''}" for i, p in enumerate(prods)])
        return f"""Community Manager Troviio. Ton expert, pas vendeur.

Top 3 des {context['category']} 2026 :
{lines}

Règles MAX 280 chars : phrase d'accroche + top avec scores + lien troviio.com/c/{context['category_slug']}. Pas de hashtags."""

    elif post_type == "comparison":
        return f"""Community Manager Troviio, expert et piquant.

Match du jour : {context['p1']['name']} vs {context['p2']['name']} en {context['category']}
- P1 : {context['p1']['score']}/10 à {context['p1']['price']}€
- P2 : {context['p2']['score']}/10 à {context['p2']['price']}€

Règles MAX 280 chars : accroche + qui gagne et pourquoi + lien troviio.com. Pas de hashtags."""

    elif post_type == "brand_reply":
        return f"""Community Manager Troviio. Tu interpelles la marque {context['brand']} de façon amicale et pertinente.

Exemples de ton : 
- @{context['brand']} votre nouveau produit X est impressionnant. Notre IA lui a mis 8.5/10. Pas mal du tout. On attend le test complet 👇 lien
- @{context['brand']} sympa le nouveau modèle. Mais à ce prix-là, pourquoi pas de version sans fil ? 🤔 Notre test 👇 lien

Règles MAX 280 chars. Naturel, pas de pub déguisée. Si tu challengés la marque, fais-le avec un sourire."""

    elif post_type == "retailer_mention":
        return f"""Community Manager Troviio. Tu mentionnes {context['retailer']} dans un tweet utile.

Ton : on est complémentaires. Eux vendent, on conseille. Naturel.

Exemple : "Besoin d'un nouveau lave-linge ? On a testé 25 modèles pour toi. {context['retailer']} a les meilleurs prix, nous on a les meilleurs tests. Check 👇 lien"

MAX 280 chars. Pas de pub."""

    elif post_type == "feature":
        return f"""Community Manager Troviio. Tu parles de {context['title']} : {context['description']}

MAX 280 chars. Pas de hashtags. Lien vers troviio.com. Ton expert et piquant."""

    return ""


def call_deepseek(prompt):
    """Call DeepSeek to generate tweet text"""
    import requests
    try:
        resp = requests.post(DEEPSEEK_URL, json={
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "Tu génères des tweets courts, percutants, en français. Max 280 caractères. Pas de hashtags. Ton expert et piquant."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 100,
        }, headers={"Authorization": f"Bearer {DEEPSEEK_KEY}"}, timeout=30)

        if resp.status_code != 200:
            print(f"  DeepSeek error: {resp.status_code}")
            return None

        return resp.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"  DeepSeek exception: {e}")
        return None


def post_tweet(text):
    """Post tweet via tweepy"""
    import tweepy
    try:
        client = tweepy.Client(
            consumer_key=TWITTER_CONFIG["api_key"],
            consumer_secret=TWITTER_CONFIG["api_secret"],
            access_token=TWITTER_CONFIG["access_token"],
            access_token_secret=TWITTER_CONFIG["access_secret"],
        )
        response = client.create_tweet(text=text)
        if response.data:
            tweet_id = response.data["id"]
            print(f"  ✅ Posted: https://x.com/Troviio_com/status/{tweet_id}")
            return tweet_id
        return None
    except Exception as e:
        print(f"  ❌ Tweet error: {e}")
        return None


def main():
    print(f"\n{'='*50}")
    print(f"🤖 Troviio Twitter Agent — {datetime.now(timezone.utc).isoformat()}")
    print(f"{'='*50}")
    
    supabase = get_supabase()
    history = load_history()
    
    # Choisir le type de post (éviter les répétitions)
    last_types = [p.get("type") for p in history.get("posted", [])[-3:]]
    available = [t for t in POST_TYPES if t not in last_types]
    if not available:
        available = POST_TYPES
    
    post_type = random.choice(available)
    print(f"📝 Type: {post_type}")
    
    tweet_data = generate_tweet(supabase, history, post_type)
    if not tweet_data:
        print("❌ Failed to generate tweet")
        return
    
    print(f"📜 Text: {tweet_data['text']}")
    
    # Poster
    tweet_id = post_tweet(tweet_data["text"])
    
    # Enregistrer l'historique
    history["posted"].append({
        "id": tweet_id,
        "type": tweet_data["type"],
        "text": tweet_data["text"][:100],
        "ts": datetime.now(timezone.utc).isoformat(),
    })
    save_history(history)
    
    print(f"✅ Done — {len(history['posted'])} tweets posted total")


if __name__ == "__main__":
    main()

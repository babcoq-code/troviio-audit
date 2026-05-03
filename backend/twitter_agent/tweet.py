#!/usr/bin/env python3
"""
Troviio Twitter Agent — @Troviio_com
Poste toutes les 4h via l'API GraphQL interne d'X (gratuite, comme Oscar).
Génération DeepSeek + posting via le même endpoint que X utilise en interne.
"""
import os, sys, json, random, time, base64, secrets, requests
from datetime import datetime, timezone

os.environ["SUPABASE_URL"] = os.getenv("SUPABASE_URL", "")
os.environ["SUPABASE_SERVICE_KEY"] = os.getenv("SUPABASE_SERVICE_KEY", "")
DEEPSEEK_KEY = "sk-6a6c69e0b17849a5b1618c9d71ccb0cc"
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"

# Cookies X.com pour @Troviio_com (à régénérer si connexion)
AUTH_TOKEN = "2050609911801782272-u3M8Pc5BWdqS4mNboVhYD1Xpzc9lDT"
CT0 = ""
BEARER_PUBLIC = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"
CREATE_TWEET_QID = "S1qcGUn68_U0lDKdMlYSGg"
COOKIES_FILE = "/root/twitter_cookies_troviio.json"

HISTORY_FILE = "/tmp/troviio_twitter_history.json"

from supabase import create_client
supa = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])

POST_TYPES = ["product_highlight", "top3", "feature", "comparison", "brand_reply", "fun"]
CATEGORIES = [
    "smartphone", "aspirateur-robot", "aspirateur-balai", "lave-linge",
    "lave-vaisselle", "tv", "casque-audio", "machine-a-cafe",
    "ordinateur-portable", "trottinette", "velo-electrique",
    "robot-cuisine", "enceinte-bt", "poussette", "barre-de-son",
    "cave-a-vin", "friteuse-air", "four-micro-ondes", "purificateur-air",
    "refrigerateur", "camera-securite", "imprimante", "matelas",
    "thermostat-connecte",
]
BRANDS = [
    "Dreame", "Roborock", "Dyson", "Miele", "Samsung", "LG", "Sony",
    "Bosch", "Philips", "Nespresso", "DeLonghi", "Jura", "Apple",
    "Xiaomi", "Nothing", "Dji", "Ninja", "Moulinex", "KitchenAid",
    "Electrolux", "Rowenta", "Tefal", "Bose", "Sennheiser", "Sonos",
    "Marshall", "Yamaha", "Thermomix", "Kenwood",
]


def hload():
    try:
        with open(HISTORY_FILE) as f:
            d = json.load(f)
        for k in ["posted", "used_products"]:
            d.setdefault(k, [])
        return d
    except:
        return {"posted": [], "used_products": []}


def hsave(h):
    h["used_products"] = h["used_products"][-200:]
    h["posted"] = h["posted"][-200:]
    with open(HISTORY_FILE, "w") as f:
        json.dump(h, f, indent=2)


def pick_product(history):
    used = set(history.get("used_products", []))
    prods = supa.table("products").select(
        "id,name,brand,slug,estimated_score,price_eur,category_id"
    ).eq("is_active", True).not_.is_("estimated_score", "null").order("estimated_score", desc=True).execute()
    candidates = [p for p in prods.data if p["id"] not in used] or prods.data[:50]
    if not candidates:
        return None
    w = [max(1, p.get("estimated_score", 5)) for p in candidates]
    chosen = random.choices(candidates, weights=w, k=1)[0]
    cat = supa.table("categories").select("name,slug").eq("id", chosen["category_id"]).execute()
    if cat.data:
        chosen["category_name"] = cat.data[0]["name"]
        chosen["category_slug"] = cat.data[0]["slug"]
    history["used_products"].append(chosen["id"])
    return chosen


def pick_top3():
    cat = random.choice(CATEGORIES)
    c = supa.table("categories").select("id,name").eq("slug", cat).limit(1).execute()
    if not c.data:
        return None
    p = supa.table("products").select("brand,name,slug,estimated_score,price_eur"
    ).eq("is_active", True).eq("category_id", c.data[0]["id"]
    ).not_.is_("estimated_score", "null").order("estimated_score", desc=True).limit(3).execute()
    if len(p.data) < 3:
        return None
    return {"category": c.data[0]["name"], "slug": cat, "products": p.data}


def pick_comp(history):
    cat = random.choice(CATEGORIES)
    c = supa.table("categories").select("id,name").eq("slug", cat).limit(1).execute()
    if not c.data:
        return None
    p = supa.table("products").select("id,brand,name,slug,estimated_score,price_eur"
    ).eq("is_active", True).eq("category_id", c.data[0]["id"]
    ).not_.is_("estimated_score", "null").order("estimated_score", desc=True).limit(15).execute()
    if len(p.data) < 2:
        return None
    used = set(history.get("used_products", []))
    avail = [x for x in p.data if x["id"] not in used] or p.data[:5]
    if len(avail) < 2:
        return None
    a, b = random.sample(avail, 2)
    return {"cat": c.data[0]["name"], "cat_slug": cat, "a": a, "b": b}


def ds(prompt):
    try:
        r = requests.post(DEEPSEEK_URL, json={
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "Tu génères des tweets français pour Troviio. Ton : expert, direct, piquant, jamais vendeur. MAX 220 caractères. Comme un pote qui s'y connaît."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 80,
        }, headers={"Authorization": f"Bearer {DEEPSEEK_KEY}"}, timeout=20)
        if r.status_code != 200:
            return None
        t = r.json()["choices"][0]["message"]["content"].strip().strip("'\"")
        if len(t) > 275:
            t = t[:272] + "..."
        return t
    except:
        return None


def gen(history, forced_type=None):
    pt = forced_type or random.choices(POST_TYPES, weights=[4, 2, 1, 2, 1, 1], k=1)[0]

    if pt == "fun":
        funs = [
            "On a testé 25 machines à café. Verdict : la meilleure coûte 299€ et rivalise avec une à 800€.",
            "700+ produits en base et tu utilises toujours ton vieux truc. La vie de comparateur.",
            "Les specs c'est bien. Savoir si ça rentre dans ta cuisine c'est mieux. On checke.",
            "Qui passe 20min à configurer sa trottinette pour un trajet de 5min ? On est tous passés par là.",
        ]
        return {"text": random.choice(funs), "type": pt}

    if pt == "feature":
        feats = [
            "Notre IA analyse 50+ critères pour toi. Pas de pub, pas de biais. Juste LE produit qu'il te faut.",
            "On touche la même commission sur tous les produits Amazon. Notre classement est 100% objectif.",
            "Discute avec notre IA sur troviio.com. 5 questions et elle te trouve le produit idéal.",
        ]
        return {"text": random.choice(feats), "type": pt}

    if pt == "product_highlight":
        p = pick_product(history)
        if not p:
            return None
        n = f"{p['brand']} {p['name']}"
        sc = p.get("estimated_score", 0)
        slug = p["slug"]
        txt = ds(f"Produit: {n} ({sc}/10). Tweet 220 chars avec lien https://troviio.com/produit/{slug}")
        return {"text": txt, "type": pt} if txt else None

    if pt == "top3":
        t = pick_top3()
        if not t:
            return None
        txt = ds(f"Top 3 {t['category']} : 1.{t['products'][0]['brand']} {t['products'][0]['name']} ({t['products'][0]['estimated_score']}/10) 2.{t['products'][1]['brand']} {t['products'][1]['name']} ({t['products'][1]['estimated_score']}/10) 3.{t['products'][2]['brand']} {t['products'][2]['name']} ({t['products'][2]['estimated_score']}/10). https://troviio.com/c/{t['slug']}")
        return {"text": txt, "type": pt} if txt else None

    if pt == "comparison":
        c = pick_comp(history)
        if not c:
            return None
        n1 = f"{c['a']['brand']} {c['a']['name']}"
        n2 = f"{c['b']['brand']} {c['b']['name']}"
        s1, s2 = c['a'].get('estimated_score', 0), c['b'].get('estimated_score', 0)
        txt = ds(f"Match {c['cat']}: {n1} ({s1}/10) vs {n2} ({s2}/10). Qui gagne ? Lien troviio.com")
        return {"text": txt, "type": pt} if txt else None

    if pt == "brand_reply":
        b = random.choice(BRANDS)
        txt = ds(f"Interpelle @{b} de façon utile et amicale sur un de leurs produits. 220 chars.")
        return {"text": txt, "type": pt} if txt else None

    return None


# ── GraphQL interne (copié de twitter_api.py, sans twitter_api) ────────

def _get_session():
    s = requests.Session()
    # Auth avec le cookie auth_token
    s.cookies.set('auth_token', AUTH_TOKEN, domain='.x.com')
    if CT0:
        s.cookies.set('ct0', CT0, domain='.x.com')
        csrf = CT0
    else:
        csrf = CT0
    s.headers.update({
        'authorization': f'Bearer {BEARER_PUBLIC}',
        'x-csrf-token': csrf,
        'x-twitter-auth-type': 'OAuth2Session',
        'x-twitter-active-user': 'yes',
        'x-twitter-client-language': 'fr',
        'content-type': 'application/json',
        'referer': 'https://x.com/',
        'origin': 'https://x.com',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'x-client-transaction-id': base64.b64encode(secrets.token_bytes(32)).decode(),
    })
    return s


def post_graphql(text):
    s = _get_session()
    variables = {
        "tweet_text": text,
        "dark_request": False,
        "media": {"media_entities": [], "possibly_sensitive": False},
        "semantic_annotation_ids": [],
        "disallowed_reply_options": None,
    }
    payload = {
        "variables": variables,
        "features": {
            "interactive_text_enabled": True,
            "responsive_web_graphql_exclude_directive_enabled": True,
            "verified_phone_label_enabled": False,
            "creator_subscriptions_tweet_preview_api_enabled": True,
            "responsive_web_graphql_timeline_navigation_enabled": True,
            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": True,
            "longform_notetweets_consumption_enabled": True,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": False,
            "tweetypie_unmention_optimization_enabled": True,
            "view_counts_everywhere_api_enabled": True,
            "longform_notetweets_rich_text_read_enabled": True,
            "freedom_of_speech_not_reach_fetch_enabled": True,
            "responsive_web_enhance_cards_enabled": False,
        },
        "queryId": CREATE_TWEET_QID,
    }
    url = f'https://x.com/i/api/graphql/{CREATE_TWEET_QID}/CreateTweet'
    r = s.post(url, json=payload, timeout=15)
    print(f"  GraphQL: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        errs = data.get('errors', [])
        if errs:
            code = errs[0].get('code', 0)
            msg = errs[0].get('message', '')
            print(f"  ❌ GraphQL error {code}: {msg}")
            return None
        tid = data.get('data', {}).get('create_tweet', {}).get('tweet_results', {}).get('result', {}).get('rest_id')
        if tid:
            return tid
        print(f"  ⚠️ No rest_id in response")
        return None
    # Si 403, peut-être besoin de ct0 à jour
    print(f"  ❌ {r.text[:200]}")
    return None


def main():
    print(f"\n{'='*50}")
    print(f"🤖 Troviio Twitter Agent — {datetime.now(timezone.utc).isoformat()}")
    print(f"{'='*50}")

    history = hload()
    last3 = [p.get("type") for p in history.get("posted", [])[-3:] if p.get("type")]
    avail = [t for t in POST_TYPES if t not in last3]
    pt = random.choice(avail or POST_TYPES)
    print(f"📝 Type: {pt}")

    data = gen(history, pt)
    if not data or not data.get("text"):
        data = gen(history, "fun")
    if not data:
        print("❌ Échec total")
        return

    print(f"📜 {data['text']}")
    tid = post_graphql(data["text"])

    if tid:
        print(f"✅ https://x.com/Troviio_com/status/{tid}")
        history["posted"].append({
            "id": tid, "type": data["type"],
            "text": data["text"][:80],
            "ts": datetime.now(timezone.utc).isoformat(),
        })
    hsave(history)
    print(f"📊 Total: {len(history['posted'])} posts")


if __name__ == "__main__":
    main()

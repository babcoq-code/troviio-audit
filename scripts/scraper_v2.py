"""
PICKSY — Scraper v2 (sources article-style, prompt strict par catégorie)
Uniquement des URLs d'articles "top/best" — pas des pages catégorie JS.
Lance : python3 /opt/picksy/scripts/scraper_v2.py
"""

import os, json, time, sys, re, unicodedata
from datetime import datetime, timezone
from firecrawl import Firecrawl
from openai import OpenAI
from supabase import create_client

# ─── Clients ───────────────────────────────────────────────
firecrawl = Firecrawl(api_key=os.getenv("FIRECRAWL_API_KEY", ""))
deepseek = OpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")
supabase = create_client(os.getenv("SUPABASE_URL", ""), os.getenv("SUPABASE_SERVICE_KEY", ""))

# ─── Sources : UNIQUEMENT des articles/guides, pas des pages catégories ───
# Format: url, name, cat_slug, tier
SOURCES = [
    # ── ROBOT ASPIRATEUR ──────────────────────────────────────────
    ("https://vacuumwars.com/robot-vacuums/",                          "Vacuum Wars",        "robot-aspirateur",     1),
    ("https://vacuumwars.com/best-robot-vacuums-for-pet-hair/",        "Vacuum Wars",        "robot-aspirateur",     1),
    ("https://www.thespruce.com/best-robot-vacuums-4843950",           "The Spruce",         "robot-aspirateur",     1),
    ("https://moderncastle.com/robot-vacuum-reviews/",                 "Modern Castle",      "robot-aspirateur",     1),
    ("https://www.techradar.com/best/best-robot-vacuums",              "TechRadar",          "robot-aspirateur",     1),
    ("https://lavaspi.fr/meilleur-aspirateur-robot/",                  "Lavaspi",            "robot-aspirateur",     1),
    ("https://www.01net.com/guide-achat/aspirateurs/robots/",          "01net",              "robot-aspirateur",     2),
    ("https://www.frandroid.com/guide-dachat/1836564_meilleur-aspirateur-robot", "Frandroid", "robot-aspirateur",   2),

    # ── TV OLED ──────────────────────────────────────────────────
    ("https://www.techradar.com/best/best-oled-tvs",                   "TechRadar",          "tv-oled",              1),
    ("https://www.thespruce.com/best-oled-tvs-5088495",                "The Spruce",         "tv-oled",              1),
    ("https://www.hdtvtest.co.uk/news/bestselling-oled-tvs",           "HDTVTest",           "tv-oled",              1),
    ("https://www.flatpanelshd.com/reviews.php",                       "FlatpanelsHD",       "tv-oled",              1),
    ("https://www.lesnumeriques.com/guide-dachat/meilleur-televiseur-oled-d6130.html", "Les Numériques", "tv-oled", 1),
    ("https://www.01net.com/guide-achat/tv/oled/",                     "01net",              "tv-oled",              2),

    # ── MACHINE À CAFÉ ───────────────────────────────────────────
    ("https://expert-cafetiere.eu/comparatifs/",                       "Expert Cafetière",   "machine-cafe",         1),
    ("https://www.techradar.com/best/best-coffee-makers",              "TechRadar",          "machine-cafe",         1),
    ("https://www.thespruce.com/best-coffee-makers-4171742",           "The Spruce",         "machine-cafe",         1),
    ("https://www.lesnumeriques.com/guide-dachat/meilleure-machine-cafe-grain-d5794.html", "Les Numériques", "machine-cafe", 1),
    ("https://www.01net.com/guide-achat/cafetiere-et-expresso/",       "01net",              "machine-cafe",         2),

    # ── CASQUE AUDIO ─────────────────────────────────────────────
    ("https://www.techradar.com/best/best-headphones",                 "TechRadar",          "casque-audio",         1),
    ("https://www.thespruce.com/best-over-ear-headphones-4176487",     "The Spruce",         "casque-audio",         1),
    ("https://www.whathifi.com/buying-advice/headphones/best-headphones", "What Hi-Fi?",    "casque-audio",         1),
    ("https://www.lesnumeriques.com/guide-dachat/meilleur-casque-audio-bluetooth-d5804.html", "Les Numériques", "casque-audio", 1),
    ("https://www.son-video.com/article/achat/meilleurs-casques-audio", "Son-Video",         "casque-audio",         2),

    # ── PURIFICATEUR D'AIR ───────────────────────────────────────
    ("https://www.techradar.com/best/best-air-purifiers",              "TechRadar",          "purificateur-air",     1),
    ("https://www.thespruce.com/best-air-purifiers-4159343",           "The Spruce",         "purificateur-air",     1),
    ("https://www.lesnumeriques.com/guide-dachat/meilleur-purificateur-d-air-d6414.html", "Les Numériques", "purificateur-air", 1),

    # ── LAVE-LINGE ───────────────────────────────────────────────
    ("https://www.techradar.com/best/best-washing-machines",           "TechRadar",          "lave-linge",           1),
    ("https://www.thespruce.com/best-washing-machines-4164913",        "The Spruce",         "lave-linge",           1),
    ("https://www.lesnumeriques.com/guide-dachat/meilleur-lave-linge-d5810.html", "Les Numériques", "lave-linge",    1),

    # ── LAVE-VAISSELLE ───────────────────────────────────────────
    ("https://www.techradar.com/best/best-dishwashers",                "TechRadar",          "lave-vaisselle",       1),
    ("https://www.thespruce.com/best-dishwashers-4847515",             "The Spruce",         "lave-vaisselle",       1),

    # ── RÉFRIGÉRATEUR ────────────────────────────────────────────
    ("https://www.techradar.com/best/best-refrigerators",              "TechRadar",          "refrigerateur",        1),
    ("https://www.thespruce.com/best-french-door-refrigerators-4174547", "The Spruce",       "refrigerateur",        1),
    ("https://www.lesnumeriques.com/guide-dachat/meilleur-refrigerateur-d5812.html", "Les Numériques", "refrigerateur", 1),

    # ── BARRE DE SON ─────────────────────────────────────────────
    ("https://www.techradar.com/best/best-soundbars",                  "TechRadar",          "barre-son",            1),
    ("https://www.whathifi.com/buying-advice/soundbars/best-soundbars", "What Hi-Fi?",       "barre-son",            1),

    # ── FRITEUSE À AIR ───────────────────────────────────────────
    ("https://www.techradar.com/best/best-air-fryers",                 "TechRadar",          "friteuse-air",         1),
    ("https://www.thespruce.com/best-air-fryers-4584807",              "The Spruce",         "friteuse-air",         1),

    # ── DOMOTIQUE HUB ────────────────────────────────────────────
    ("https://www.techradar.com/best/best-smart-home-devices",         "TechRadar",          "domotique-hub",        1),
    ("https://www.objetconnecte.com/meilleur-hub-domotique/",          "Objet Connecté",     "domotique-hub",        1),

    # ── ASPIRATEUR BALAI ─────────────────────────────────────────
    ("https://vacuumwars.com/best-stick-vacuums/",                     "Vacuum Wars",        "aspirateur-balai",     1),
    ("https://www.techradar.com/best/best-cordless-vacuum-cleaners",   "TechRadar",          "aspirateur-balai",     1),

    # ── CAMÉRA SÉCURITÉ ──────────────────────────────────────────
    ("https://www.techradar.com/best/best-home-security-cameras",      "TechRadar",          "camera-securite",      1),
    ("https://www.thespruce.com/best-home-security-cameras-4177498",   "The Spruce",         "camera-securite",      1),

    # ── SMARTPHONE ───────────────────────────────────────────────
    ("https://www.techradar.com/best/best-phones",                     "TechRadar",          "smartphone",           1),
    ("https://www.frandroid.com/guide-dachat/smartphones/",            "Frandroid",          "smartphone",           2),

    # ── CASQUE GAMING / ORDI GAMING ──────────────────────────────
    ("https://www.techradar.com/best/best-gaming-headsets",            "TechRadar",          "casque-audio",         2),
    ("https://www.techradar.com/best/best-gaming-laptops",             "TechRadar",          "ordinateur-gaming",    1),

    # ── TROTTINETTE ÉLECTRIQUE ───────────────────────────────────
    ("https://www.01net.com/guide-achat/trottinette-electrique/",      "01net",              "trottinette",          2),
]

# Descriptions de catégories pour le prompt (aide l'IA à filtrer)
CATEGORY_DESCRIPTIONS = {
    "robot-aspirateur":  "aspirateurs robots (Roomba, Dreame, Roborock, Ecovacs, iRobot, Miele...)",
    "aspirateur-balai":  "aspirateurs balais sans fil (Dyson, Shark, Tineco, Samsung...)",
    "tv-oled":           "téléviseurs OLED (LG OLED, Sony Bravia, Samsung OLED/QLED, Philips OLED...)",
    "machine-cafe":      "machines à café (grain, dosette, expresso, percolateur...) — PAS de machines à thé ni bouilloires",
    "casque-audio":      "casques audio, écouteurs, in-ear (Sony, Bose, Apple, Sennheiser, Jabra...) — PAS de casques gaming",
    "purificateur-air":  "purificateurs d'air (Dyson, Xiaomi, Blueair, Levoit, Winix...)",
    "lave-linge":        "lave-linge, machines à laver (Samsung, LG, Bosch, Miele, Whirlpool...)",
    "lave-vaisselle":    "lave-vaisselle (Bosch, Miele, Samsung, AEG, Siemens...)",
    "refrigerateur":     "réfrigérateurs, frigos (Samsung, LG, Bosch, Whirlpool, Haier...)",
    "barre-son":         "barres de son, soundbars (Sonos, Samsung, Sony, Bose, JBL...)",
    "friteuse-air":      "friteuses à air chaud, air fryers (Ninja, Philips, Cosori, Tefal...)",
    "domotique-hub":     "hubs domotique, assistants, enceintes connectées (Amazon Echo, Google Home, Philips Hue, HomeKit, Zigbee...)",
    "camera-securite":   "caméras de sécurité intérieure/extérieure (Ring, Arlo, Eufy, Nest, Tapo...)",
    "smartphone":        "smartphones, téléphones (iPhone, Samsung Galaxy, Pixel, OnePlus...) — PAS de tablettes ni montres",
    "ordinateur-gaming": "ordinateurs portables gaming (ASUS ROG, Razer, MSI, Lenovo Legion, Acer Nitro...)",
    "ordinateur-etudiant": "ordinateurs portables grand public/étudiants (MacBook, Dell XPS, HP Spectre...)",
    "trottinette":       "trottinettes électriques (Xiaomi, Ninebot, Segway, Kaabo...)",
    "velo-electrique":   "vélos électriques (VanMoof, Cowboy, Brompton, Decathlon Elops...)",
    "thermostat-connecte": "thermostats connectés (Nest, Tado, Honeywell, Netatmo...)",
    "serrure-connectee": "serrures connectées (Nuki, August, Yale, Schlage...)",
    "ampoule-connectee": "ampoules connectées (Philips Hue, IKEA Tradfri, Govee, Yeelight...)",
    "imprimante":        "imprimantes (HP, Canon, Epson, Brother...)",
    "seche-linge":       "sèche-linges (Samsung, LG, Bosch, Miele...)",
    "four-micro-onde":   "fours micro-ondes (Samsung, LG, Panasonic, Whirlpool...)",
}


def make_prompt(cat_slug: str) -> str:
    cat_desc = CATEGORY_DESCRIPTIONS.get(cat_slug, cat_slug)
    return f"""Tu es un extracteur de données pour PICKSY, un comparateur de produits électroménagers.

CATÉGORIE CIBLE : {cat_slug} — {cat_desc}

⚠️ IMPORTANT : N'extrais QUE des produits de cette catégorie. Ignore tout produit d'une autre catégorie.
Si le texte parle d'un aspirateur robot mais que la catégorie est TV OLED, N'extrais PAS l'aspirateur.

Pour chaque produit de la catégorie cible, retourne un JSON array :
[
  {{
    "brand": "marque exacte (ex: Dyson, Sony, LG)",
    "name": "modèle exact complet (ex: V15 Detect, Bravia 9, OLED C4 55\\\")",
    "estimated_score": float 0-10 (note globale selon les avis — 0 si inconnu),
    "price_eur": int ou null (prix en euros si mentionné),
    "verdict": "résumé du verdict en 1-2 phrases max",
    "pros": ["avantage 1", "avantage 2"],
    "cons": ["inconvénient 1"],
    "best_for": ["usage 1"],
    "avoid_if": ["cas 1"]
  }}
]

Règles strictes :
- brand + name doivent être précis (pas "un bon aspirateur")
- name ne doit PAS contenir la marque (elle est dans brand)
- Minimum 3 chars pour name
- Retourne [] si aucun produit de la catégorie trouvé
- Retourne UNIQUEMENT le JSON array, rien d'autre"""


def scrape_url(url: str) -> str:
    try:
        result = firecrawl.scrape(url, formats=["markdown"])
        content = result.markdown if hasattr(result, "markdown") else result.get("markdown", "")
        return content or ""
    except Exception as e:
        return f"ERROR:{e}"


def extract_products(content: str, cat_slug: str) -> list:
    try:
        prompt = make_prompt(cat_slug)
        # On prend les 8000 premiers chars (les meilleurs guides ont les produits au début)
        chunk = content[:8000]
        resp = deepseek.chat.completions.create(
            model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": chunk},
            ],
            max_tokens=3000,
            temperature=0.1,
        )
        raw = resp.choices[0].message.content.strip()
        # Nettoyer le markdown code block si présent
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return parsed
        return []
    except Exception as e:
        print(f"    ⚠️  Extraction error: {e}")
        return []


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFD", text.lower())
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:80]


def get_category_id(slug: str) -> str | None:
    try:
        r = supabase.table("categories").select("id").eq("slug", slug).execute()
        return r.data[0]["id"] if r.data else None
    except:
        return None


def insert_product(p: dict, category_id: str, source_url: str, source_name: str) -> bool:
    name = (p.get("name") or "").strip()
    brand = (p.get("brand") or "Inconnu").strip()
    if not name or len(name) < 3:
        return False
    # Dédupliquer par (brand, name)
    try:
        ex = supabase.table("products").select("id").ilike("name", name).execute()
        if ex.data:
            return False  # déjà en base
    except:
        pass

    slug = slugify(f"{brand}-{name}")
    try:
        supabase.table("products").insert({
            "name": name,
            "brand": brand,
            "slug": slug,
            "category_id": category_id,
            "status": "published",
            "estimated_score": p.get("estimated_score") or 0,
            "price_eur": p.get("price_eur"),
            "source_url": source_url,
            "source_title": source_name,
            "source_date": datetime.now(timezone.utc).isoformat(),
            "specs": {
                "verdict": p.get("verdict", ""),
                "pros": p.get("pros", []),
                "cons": p.get("cons", []),
                "best_for": p.get("best_for", []),
                "avoid_if": p.get("avoid_if", []),
            },
        }).execute()
        return True
    except Exception as e:
        # Si slug dupliqué, essayer avec un suffix
        if "duplicate" in str(e).lower() or "unique" in str(e).lower():
            try:
                slug = f"{slug}-{int(time.time()) % 10000}"
                supabase.table("products").insert({
                    "name": name, "brand": brand, "slug": slug,
                    "category_id": category_id, "status": "published",
                    "estimated_score": p.get("estimated_score") or 0,
                    "price_eur": p.get("price_eur"),
                    "source_url": source_url, "source_title": source_name,
                    "source_date": datetime.now(timezone.utc).isoformat(),
                    "specs": {
                        "verdict": p.get("verdict", ""),
                        "pros": p.get("pros", []),
                        "cons": p.get("cons", []),
                        "best_for": p.get("best_for", []),
                        "avoid_if": p.get("avoid_if", []),
                    },
                }).execute()
                return True
            except:
                return False
        print(f"    ⚠️  Insert error {name}: {e}")
        return False


def run():
    print(f"\n{'='*60}")
    print(f"🕷️  PICKSY Scraper v2 — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*60}")
    print(f"Sources: {len(SOURCES)}\n")

    total_new = 0
    failed = 0
    skipped = 0

    for i, (url, name, cat, tier) in enumerate(SOURCES):
        print(f"\n[{i+1}/{len(SOURCES)}] Tier{tier} — {name} → {cat}")
        print(f"  URL: {url}")

        category_id = get_category_id(cat)
        if not category_id:
            print(f"  ❌ Catégorie '{cat}' introuvable")
            failed += 1
            continue

        content = scrape_url(url)
        if content.startswith("ERROR:"):
            print(f"  ❌ {content[:120]}")
            failed += 1
            time.sleep(3)
            continue

        if len(content) < 300:
            print(f"  ⚠️  Contenu trop court ({len(content)} chars), skip")
            skipped += 1
            time.sleep(2)
            continue

        print(f"  📄 {len(content)} chars")

        products = extract_products(content, cat)
        print(f"  🔍 {len(products)} produits extraits")

        new_count = 0
        for p in products:
            brand = p.get("brand", "?")
            pname = p.get("name", "?")
            if insert_product(p, category_id, url, name):
                new_count += 1
                print(f"    ✅ {brand} {pname}")
            else:
                print(f"    ⏭️  skip: {brand} {pname}")

        total_new += new_count
        delay = 3 if tier == 1 else 2
        print(f"  ⏳ Pause {delay}s...")
        time.sleep(delay)

    print(f"\n{'='*60}")
    print(f"✅ DONE — {total_new} nouveaux | {failed} erreurs | {skipped} trop courts")
    print(f"{'='*60}\n")

    try:
        total_db = supabase.table("products").select("id", count="exact").execute().count
        print(f"📊 Total produits en base: {total_db}")
    except:
        pass

    return total_new


if __name__ == "__main__":
    run()

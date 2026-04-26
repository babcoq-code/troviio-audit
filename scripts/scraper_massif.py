"""
PICKSY — Pipeline de scraping massif
Sources Tier 1+2+3 selon le plan Cicéron
Lance : python3 /opt/picksy/scripts/scraper_massif.py
"""

import os, json, time, sys
from datetime import datetime, timezone
from firecrawl import Firecrawl
from openai import OpenAI
from supabase import create_client

# ─── Clients ───────────────────────────────────────────────
firecrawl = Firecrawl(api_key=os.getenv("FIRECRAWL_API_KEY", ""))
deepseek = OpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")
supabase = create_client(os.getenv("SUPABASE_URL", ""), os.getenv("SUPABASE_SERVICE_KEY", ""))

# ─── Sources (Tier 1 en premier, puis Tier 2) ──────────────
SOURCES = [
    # ═══════════════════════════════════════════
    # TIER 1 — Tests experts FR
    # ═══════════════════════════════════════════
    {"url": "https://www.lesnumeriques.com/tests-comparatifs-choix-redaction.html", "name": "Les Numériques - Choix rédaction", "cat": "robot-aspirateur", "tier": 1},
    {"url": "https://www.lesnumeriques.com/guide-dachat/meilleurs-aspirateurs-robots-d6098.html", "name": "Les Numériques - Guide aspirateurs", "cat": "robot-aspirateur", "tier": 1},
    {"url": "https://www.lesnumeriques.com/guide-dachat/meilleur-televiseur-oled-d6130.html", "name": "Les Numériques - Guide TV OLED", "cat": "tv-oled", "tier": 1},
    {"url": "https://www.lesnumeriques.com/guide-dachat/meilleure-machine-cafe-grain-d5794.html", "name": "Les Numériques - Guide café", "cat": "machine-cafe", "tier": 1},
    {"url": "https://www.lesnumeriques.com/guide-dachat/meilleur-lave-linge-d5810.html", "name": "Les Numériques - Guide lave-linge", "cat": "lave-linge", "tier": 1},
    {"url": "https://www.lesnumeriques.com/guide-dachat/meilleur-refrigerateur-d5812.html", "name": "Les Numériques - Guide frigo", "cat": "refrigerateur", "tier": 1},
    {"url": "https://www.lesnumeriques.com/guide-dachat/meilleur-purificateur-d-air-d6414.html", "name": "Les Numériques - Guide purificateur", "cat": "purificateur-air", "tier": 1},

    # TIER 1 — Tests experts US
    {"url": "https://www.rtings.com/robot-vacuum/reviews/best", "name": "RTINGS", "cat": "robot-aspirateur", "tier": 1},
    {"url": "https://www.rtings.com/tv/reviews/best", "name": "RTINGS", "cat": "tv-oled", "tier": 1},
    {"url": "https://www.rtings.com/soundbar/reviews/best", "name": "RTINGS", "cat": "barre-son", "tier": 1},
    {"url": "https://www.rtings.com/air-purifier/reviews/best", "name": "RTINGS", "cat": "purificateur-air", "tier": 1},
    {"url": "https://www.rtings.com/headphones/reviews/best", "name": "RTINGS", "cat": "casque-audio", "tier": 1},
    {"url": "https://www.rtings.com/vacuum/reviews/best", "name": "RTINGS", "cat": "aspirateur-balai", "tier": 1},
    {"url": "https://vacuumwars.com/robot-vacuums/", "name": "Vacuum Wars", "cat": "robot-aspirateur", "tier": 1},
    {"url": "https://vacuumwars.com/best-vacuum-cleaners/", "name": "Vacuum Wars", "cat": "aspirateur-balai", "tier": 1},
    {"url": "https://www.nytimes.com/wirecutter/reviews/best-robot-vacuum/", "name": "Wirecutter", "cat": "robot-aspirateur", "tier": 1},
    {"url": "https://www.nytimes.com/wirecutter/reviews/best-tvs/", "name": "Wirecutter", "cat": "tv-oled", "tier": 1},
    {"url": "https://www.nytimes.com/wirecutter/reviews/best-air-purifier/", "name": "Wirecutter", "cat": "purificateur-air", "tier": 1},
    {"url": "https://www.nytimes.com/wirecutter/reviews/best-soundbar/", "name": "Wirecutter", "cat": "barre-son", "tier": 1},
    {"url": "https://www.nytimes.com/wirecutter/reviews/best-washing-machine/", "name": "Wirecutter", "cat": "lave-linge", "tier": 1},
    {"url": "https://www.nytimes.com/wirecutter/reviews/best-dishwasher/", "name": "Wirecutter", "cat": "lave-vaisselle", "tier": 1},
    {"url": "https://reviewed.usatoday.com/appliances/", "name": "Reviewed", "cat": "robot-aspirateur", "tier": 1},

    # ═══════════════════════════════════════════
    # TIER 2 — Médias complémentaires FR
    # ═══════════════════════════════════════════
    {"url": "https://www.frandroid.com/guide-dachat/", "name": "Frandroid", "cat": "domotique-hub", "tier": 2},
    {"url": "https://www.clubic.com/tests/", "name": "Clubic", "cat": "tv-oled", "tier": 2},
    {"url": "https://expert-cafetiere.eu/comparatifs/", "name": "Expert Cafetière", "cat": "machine-cafe", "tier": 2},
    {"url": "https://lavaspi.fr/", "name": "Lavaspi", "cat": "robot-aspirateur", "tier": 2},
    {"url": "https://www.maison-et-domotique.com/category/tests/", "name": "Maison et Domotique", "cat": "domotique-hub", "tier": 2},

    # TIER 2 — Médias US
    {"url": "https://www.cnet.com/home/kitchen-and-household/", "name": "CNET", "cat": "robot-aspirateur", "tier": 2},
    {"url": "https://www.cnet.com/home/smart-home/", "name": "CNET", "cat": "domotique-hub", "tier": 2},
    {"url": "https://www.tomsguide.com/best-picks/", "name": "Tom's Guide", "cat": "robot-aspirateur", "tier": 2},
    {"url": "https://www.tomsguide.com/best-picks/best-air-purifiers", "name": "Tom's Guide", "cat": "purificateur-air", "tier": 2},
    {"url": "https://moderncastle.com/robot-vacuum-reviews/", "name": "Modern Castle", "cat": "robot-aspirateur", "tier": 2},
    {"url": "https://www.hdtvtest.co.uk", "name": "HDTVTest", "cat": "tv-oled", "tier": 2},
    {"url": "https://www.flatpanelshd.com/reviews.php", "name": "FlatpanelsHD", "cat": "tv-oled", "tier": 2},
    {"url": "https://www.whathifi.com/reviews", "name": "What Hi-Fi?", "cat": "casque-audio", "tier": 2},
    {"url": "https://www.goodhousekeeping.com/appliances/", "name": "Good Housekeeping", "cat": "robot-aspirateur", "tier": 2},
    {"url": "https://www.pcmag.com/categories/smart-home", "name": "PCMag", "cat": "domotique-hub", "tier": 2},
    {"url": "https://www.smarthomeassistent.de/", "name": "Smarthome Assistent", "cat": "robot-aspirateur", "tier": 2},
    {"url": "https://www.soundguys.com/", "name": "SoundGuys", "cat": "casque-audio", "tier": 2},

    # ═══════════════════════════════════════════
    # NICHE ultra-spécialisé
    # ═══════════════════════════════════════════
    {"url": "https://www.avcesar.com/", "name": "AVCesar", "cat": "tv-oled", "tier": 2},
    {"url": "https://www.the-ambient.com/", "name": "The Ambient", "cat": "domotique-hub", "tier": 2},
]

# ─── Prompt d'extraction ──────────────────────────────────
EXTRACT_PROMPT = """Tu es un extracteur de données produit pour PICKSY.
Analyse ce contenu (test / comparatif / guide d'achat) et extrais tous les produits mentionnés.

Pour chaque produit retourne un JSON array avec :
{
  "brand": "marque exacte",
  "name": "nom/modèle exact (ex: S8 MaxV Ultra)",
  "estimated_score": float entre 0 et 10 (0 si inconnu),
  "price_eur": int ou null (prix en euros si mentionné),
  "verdict": "résumé du verdict en 1-2 phrases",
  "pros": ["avantage 1", "avantage 2"],
  "cons": ["inconvénient 1"],
  "best_for": ["usage 1", "usage 2"],
  "avoid_if": ["cas 1"],
  "use_case_scores": {
    "animaux": null, "parquet": null, "tapis": null, "silence": null,
    "grand_logement": null, "budget_serre": null, "facilite": null,
    "gaming": null, "cinema": null, "luminosite": null
  }
}

Mets null pour les scores que tu ne peux pas estimer avec confiance.
Retourne UNIQUEMENT le JSON array, rien d'autre."""


def scrape(url: str) -> str:
    try:
        result = firecrawl.scrape(url, formats=["markdown"])
        content = result.markdown if hasattr(result, "markdown") else result.get("markdown", "")
        return content or ""
    except Exception as e:
        return f"ERROR:{e}"


def extract_products(content: str, category_slug: str) -> list:
    try:
        resp = deepseek.chat.completions.create(
            model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
            messages=[
                {"role": "system", "content": EXTRACT_PROMPT},
                {"role": "user", "content": content[:7000]},
            ],
            max_tokens=3000,
            temperature=0.1,
        )
        raw = resp.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw)
    except Exception as e:
        print(f"    ⚠️  Extraction error: {e}")
        return []


def get_or_create_category(slug: str) -> str | None:
    try:
        r = supabase.table("categories").select("id").eq("slug", slug).execute()
        if r.data:
            return r.data[0]["id"]
        return None
    except:
        return None


def insert_product(p: dict, category_id: str, source_url: str, source_name: str) -> bool:
    name = (p.get("name") or "").strip()
    brand = (p.get("brand") or "Inconnu").strip()
    if not name or len(name) < 3:
        return False

    # Dédupliquer par nom + marque
    try:
        ex = supabase.table("products").select("id").ilike("name", name).execute()
        if ex.data:
            return False
    except:
        pass

    try:
        use_case_scores = {k: v for k, v in (p.get("use_case_scores") or {}).items() if v is not None}
        supabase.table("products").insert({
            "name": name,
            "brand": brand,
            "category_id": category_id,
            "status": "published",
            "estimated_score": p.get("estimated_score") or 0,
            "price_eur": p.get("price_eur"),
            "source_url": source_url,
            "source_title": source_name,
            "source_date": datetime.now(timezone.utc).isoformat(),
            "use_case_scores": use_case_scores,
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
        print(f"    ⚠️  Insert error {name}: {e}")
        return False


def log_job(source_url: str, source_name: str, cat: str, tier: int, status: str, found: int = 0, error: str = None):
    try:
        supabase.table("scrape_jobs").insert({
            "source_url": source_url,
            "source_name": source_name,
            "category_slug": cat,
            "tier": tier,
            "status": status,
            "products_found": found,
            "error": error,
            "started_at": datetime.now(timezone.utc).isoformat() if status == "running" else None,
            "finished_at": datetime.now(timezone.utc).isoformat() if status in ("done", "failed") else None,
        }).execute()
    except:
        pass


def run():
    print(f"\n{'='*60}")
    print(f"🕷️  PICKSY Scraping massif — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*60}")
    print(f"Sources: {len(SOURCES)} | Tier 1: {sum(1 for s in SOURCES if s['tier']==1)} | Tier 2: {sum(1 for s in SOURCES if s['tier']==2)}\n")

    total_new = 0
    failed = 0

    for i, source in enumerate(SOURCES):
        url = source["url"]
        name = source["name"]
        cat = source["cat"]
        tier = source["tier"]

        print(f"\n[{i+1}/{len(SOURCES)}] Tier{tier} — {name} → {cat}")
        print(f"  URL: {url}")

        category_id = get_or_create_category(cat)
        if not category_id:
            print(f"  ❌ Catégorie '{cat}' introuvable en base")
            failed += 1
            continue

        # Scraping
        content = scrape(url)
        if content.startswith("ERROR:"):
            print(f"  ❌ Scraping failed: {content}")
            log_job(url, name, cat, tier, "failed", error=content)
            failed += 1
            time.sleep(3)
            continue

        if len(content) < 200:
            print(f"  ⚠️  Contenu trop court ({len(content)} chars), skip")
            failed += 1
            time.sleep(2)
            continue

        print(f"  📄 {len(content)} chars scraped")

        # Extraction produits
        products = extract_products(content, cat)
        print(f"  🔍 {len(products)} produits extraits")

        new_count = 0
        for p in products:
            if insert_product(p, category_id, url, name):
                new_count += 1
                print(f"    ✅ {p.get('brand')} {p.get('name')}")
            else:
                print(f"    ⏭️  déjà en base: {p.get('brand')} {p.get('name')}")

        log_job(url, name, cat, tier, "done", found=new_count)
        total_new += new_count

        # Délai anti-ban
        delay = 3 if tier == 1 else 2
        print(f"  ⏳ Pause {delay}s...")
        time.sleep(delay)

    print(f"\n{'='*60}")
    print(f"✅ Scraping terminé — {total_new} nouveaux produits | {failed} sources en erreur")
    print(f"{'='*60}\n")

    # Rapport final dans Supabase
    try:
        total_db = supabase.table("products").select("id", count="exact").execute().count
        print(f"📊 Total produits en base: {total_db}")
    except:
        pass

    return total_new


if __name__ == "__main__":
    run()

"""
PICKSY — Tâche Celery : Scraping hebdomadaire avec Firecrawl
Tourne chaque dimanche à 3h00
"""

import os
import json
from datetime import datetime, timezone
from firecrawl import FirecrawlApp
from openai import OpenAI
from supabase import create_client
from app.celery_app import app as celery_app

firecrawl = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
deepseek = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1",
)
supabase = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_SERVICE_KEY", ""),
)

SOURCES = [
    {"url": "https://www.rtings.com/robot-vacuum/reviews", "category": "robot_aspirateur"},
    {"url": "https://www.rtings.com/tv/reviews", "category": "tv_oled"},
    {"url": "https://www.rtings.com/espresso-machine/reviews", "category": "machine_cafe"},
    {"url": "https://www.lesnumeriques.com/aspirateur-robot/", "category": "robot_aspirateur"},
    {"url": "https://www.lesnumeriques.com/televiseur/", "category": "tv_oled"},
    {"url": "https://www.lesnumeriques.com/machine-a-cafe/", "category": "machine_cafe"},
]

EXTRACT_PROMPT = """Analyse ce contenu et extrait les produits mentionnés.
Pour chaque produit retourne un JSON array avec :
- name (str): nom exact du produit
- brand (str): marque
- category (str): robot_aspirateur | tv_oled | machine_cafe
- estimated_score (float 0-10): score estimé basé sur les avis/tests
- source_title (str): titre de l'article source
- description (str): 1-2 phrases résumant le produit

Retourne UNIQUEMENT le JSON array, rien d'autre."""


@celery_app.task(name="app.tasks.scraper.run_weekly_discovery")
def run_weekly_discovery():
    print(f"[{datetime.now()}] 🕷️ Démarrage scraping hebdomadaire Firecrawl")
    total_new = 0

    for source in SOURCES:
        try:
            print(f"  Scraping: {source['url']}")
            result = firecrawl.scrape_url(
                source["url"],
                params={
                    "formats": ["markdown"],
                    "onlyMainContent": True,
                },
            )
            content = result.get("markdown", "")
            if not content or len(content) < 200:
                print(f"  ⚠️ Contenu vide ou trop court, skip")
                continue

            # Extraire les produits via DeepSeek
            response = deepseek.chat.completions.create(
                model=os.getenv("DEEPSEEK_MODEL", "deepseek-v4-flash"),
                messages=[
                    {"role": "system", "content": EXTRACT_PROMPT},
                    {"role": "user", "content": content[:4000]},
                ],
                max_tokens=2000,
                temperature=0.2,
            )

            raw = response.choices[0].message.content.strip()
            # Nettoyer le JSON si DeepSeek l'enveloppe dans ```json
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]

            products = json.loads(raw)

            for product in products:
                # Vérifier si déjà en base (par nom + marque)
                existing = (
                    supabase.table("products")
                    .select("id")
                    .ilike("name", product.get("name", ""))
                    .execute()
                )
                if existing.data:
                    continue

                # Insérer en pending_review
                supabase.table("products").insert({
                    "name": product.get("name", "Inconnu"),
                    "brand": product.get("brand", "Inconnu"),
                    "category": source["category"],
                    "status": "pending_review",
                    "estimated_score": product.get("estimated_score"),
                    "source_url": source["url"],
                    "source_title": product.get("source_title", ""),
                    "source_date": datetime.now(timezone.utc).isoformat(),
                    "specs": {"description": product.get("description", "")},
                }).execute()
                total_new += 1
                print(f"  ✅ Nouveau produit: {product.get('brand')} {product.get('name')}")

        except Exception as e:
            print(f"  ❌ Erreur sur {source['url']}: {e}")

    print(f"[{datetime.now()}] ✅ Scraping terminé — {total_new} nouveaux produits")
    return total_new

"""
PICKSY — Service Firecrawl
Scraping et extraction de données produits
"""

import os
import json
from typing import Optional
from firecrawl import Firecrawl
from openai import OpenAI
from supabase import create_client

firecrawl = Firecrawl(api_key=os.getenv("FIRECRAWL_API_KEY", ""))
deepseek = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1",
)
supabase = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_SERVICE_KEY", ""),
)


def scrape_url(url: str) -> str:
    """Scrape une URL et retourne le contenu markdown."""
    try:
        result = firecrawl.scrape(url, formats=["markdown"])
        if hasattr(result, "markdown"):
            return result.markdown or ""
        if isinstance(result, dict):
            return result.get("markdown", "")
        return ""
    except Exception as e:
        print(f"⚠️ Firecrawl error: {e}")
        return ""


async def search_and_scrape_products(profile: dict) -> list:
    """
    Cherche et scrape des produits correspondant au profil utilisateur.
    Appelé après que le chat ait collecté le profil.
    """
    categorie = profile.get("categorie", "")
    budget = profile.get("budget", "")
    criteres = profile.get("criteres", [])

    # Construire les URLs de recherche selon la catégorie
    url_map = {
        "robot_aspirateur": "https://www.rtings.com/robot-vacuum/reviews/best",
        "machine_cafe": "https://www.rtings.com/espresso-machine/reviews/best",
        "tv_oled": "https://www.rtings.com/tv/reviews/best",
        "casque_audio": "https://www.rtings.com/headphones/reviews/best",
        "smartphone": "https://www.rtings.com/smartphone/reviews/best",
        "ordinateur": "https://www.lesnumeriques.com/ordinateur-portable/",
    }

    # Trouver la catégorie la plus proche
    cat_key = None
    cat_lower = categorie.lower()
    for key in url_map:
        if any(kw in cat_lower for kw in key.split("_")):
            cat_key = key
            break

    if not cat_key:
        # Catégorie générique
        url = f"https://www.lesnumeriques.com/recherche/?q={categorie.replace(' ', '+')}"
    else:
        url = url_map[cat_key]

    content = scrape_url(url)
    if not content or len(content) < 200:
        return []

    prompt = f"""Tu es un expert en recommandation produit.
Voici le profil de l'utilisateur :
- Catégorie : {categorie}
- Budget : {budget}
- Critères importants : {', '.join(criteres)}

À partir du contenu ci-dessous (avis et tests produits), sélectionne les 3 MEILLEURS produits pour ce profil.
Retourne un JSON array avec pour chaque produit :
{{
  "name": "nom exact",
  "brand": "marque",
  "why_perfect": "pourquoi ce produit correspond à ce profil en 1-2 phrases",
  "pros": ["avantage 1", "avantage 2", "avantage 3"],
  "cons": ["inconvénient 1"],
  "score": 8.5,
  "price_range": "xxx-xxx€",
  "rank_label": "Meilleur choix" | "Meilleur rapport qualité/prix" | "Option premium"
}}

UNIQUEMENT le JSON array, rien d'autre."""

    try:
        response = deepseek.chat.completions.create(
            model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": content[:8000]},
            ],
            max_tokens=2000,
            temperature=0.3,
        )

        raw = response.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        products = json.loads(raw)
        return products

    except Exception as e:
        print(f"❌ Erreur extraction produits: {e}")
        return []

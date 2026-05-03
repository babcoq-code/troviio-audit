#!/usr/bin/env python3
"""
VEILLE MENSUELLE TROVIIO — Génère le rapport de veille du mois.
Le produit du mois est TOUJOURS pris depuis la base Supabase (top vogue sélectionné par DeepSeek).
DeepSeek génère seulement : accessoire, nouveaux produits, produits attendus, hack.
Version synchrone.
"""

import os
import json
import sys
from datetime import datetime
import re

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
VEILLE_DIR = os.path.join(DATA_DIR, "veille")
BRAND_VOICE_PATH = os.path.join(DATA_DIR, "brand_voice.json")
if not os.path.exists(BRAND_VOICE_PATH):
    BRAND_VOICE_PATH = "/data/brand_voice.json"

sys.path.insert(0, PROJECT_ROOT)
from app.core.supabase import get_supabase_admin

supabase = get_supabase_admin()


def _format_name(p: dict) -> str:
    """Formate le nom sans répéter la marque."""
    brand = (p.get("brand") or "").strip()
    name = (p.get("name") or "").strip()
    if name.lower().startswith(brand.lower()):
        return name
    if brand:
        return f"{brand} {name}".strip()
    return name


def _load_brand():
    path = BRAND_VOICE_PATH
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return {"brand_name": "Troviio", "tagline": "L'IA anti-regret pour vos achats", "site": "https://troviio.com",
            "voice": {"tone": "direct, honnête, un brin provocateur", "rules": ["On ne flatte pas", "On assume les défauts"],
                      "forbidden": ["révolutionnaire", "game changer", "innovation"], "signatures": ["Arrête de scroller"]}}


def _deepseek_sync(prompt: str, max_tokens: int = 3000) -> str:
    import http.client
    api_key = os.getenv("DEEPSEEK_API_KEY", "")
    if not api_key:
        raise ValueError("DEEPSEEK_API_KEY not set")
    body = json.dumps({
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.6,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
    })
    conn = http.client.HTTPSConnection("api.deepseek.com")
    conn.request("POST", "/v1/chat/completions", body, headers={
        "Content-Type": "application/json", "Authorization": f"Bearer {api_key}",
    })
    resp = conn.getresponse()
    data = json.loads(resp.read().decode())
    if "choices" in data and len(data["choices"]) > 0:
        text = data["choices"][0]["message"]["content"].strip()
        text = re.sub(r'^```json\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
        return text
    raise ValueError(f"DeepSeek error: {data}")


def veille_mensuelle() -> dict:
    now = datetime.now()
    month = now.strftime("%Y-%m")
    month_name = now.strftime("%B %Y").capitalize()

    # 1. Récupérer les 5 meilleurs produits de la base
    r = supabase.table("products").select("name,brand,slug,image_url,price_eur,estimated_score,verdict,pros,cons")\
        .eq("is_active", True).order("estimated_score", desc=True).limit(5).execute()
    top_products = r.data or []

    # Les formater proprement
    base_products = [
        {
            "name": _format_name(p),
            "slug": p.get("slug", ""),
            "price": p.get("price_eur") or "?",
            "score": int((p.get("estimated_score") or 7) * 10),
            "image_url": p.get("image_url", ""),
            "verdict": (p.get("verdict") or "")[:200],
            "pros": (p.get("pros") or [])[:3],
            "cons": (p.get("cons") or [])[:2],
            "_raw_category": p.get("category_id", ""),
        }
        for p in top_products
    ]

    # 2. DeepSeek choisit le produit le plus vogue parmi les 5
    produit_du_mois = None
    if base_products:
        vogue_prompt = (
            "Choisis l'index (0-4) du produit le PLUS EN VOGUE actuellement "
            "(le plus tendance, catégorie la plus chaude du moment comme aspirateur robot, smartphone, TV, casque... "
            "PAS le lave-linge ou l'électroménager basique). "
            "Réponds UNIQUEMENT par l'index (un chiffre), rien d'autre.\n\n"
            + "\n".join(
                f"{i}. {p['name']} — slug: '{p['slug']}' — score {p['score']}/100"
                for i, p in enumerate(base_products)
            )
        )
        try:
            idx_text = _deepseek_sync(vogue_prompt, max_tokens=10)
            nums = re.findall(r'\d+', idx_text)
            idx = int(nums[0]) if nums else 0
            if idx < 0 or idx >= len(base_products):
                idx = 0
        except Exception:
            idx = 0

        p = base_products[idx]
        produit_du_mois = {
            "nom": p["name"],
            "note": f"{p['score']}/100",
            "descriptif": p["verdict"][:250],
            "defauts": "; ".join(p["cons"]) if p["cons"] else "",
            "url_affilie": f"https://troviio.com/produit/{p['slug']}",
            "image_url": p["image_url"],
            "prix": p["price"],
        }

    # 3. DeepSeek génère le reste (accessoire, nouveautés, attendus, hack)
    brand = _load_brand()
    prompt = f"""Tu es Hermes, rédacteur de {brand['brand_name']} ({brand['tagline']}).
Ton ton : {brand['voice']['tone']}.

Nous sommes en {month_name}. Génère un rapport de veille au format JSON uniquement.

Format attendu :
{{
  "accessoire_du_mois": {{
    "nom": "Nom accessoire",
    "descriptif": "60 mots",
    "prix": "prix en €",
    "note": "note/100"
  }},
  "nouveaux_produits": [
    {{"nom": "...", "categorie": "...", "descriptif": "50 mots", "prix": "..."}},
    {{"nom": "...", "categorie": "...", "descriptif": "50 mots", "prix": "..."}},
    {{"nom": "...", "categorie": "...", "descriptif": "50 mots", "prix": "..."}}
  ],
  "produits_attendus": [
    {{"nom": "...", "categorie": "...", "attendu_pour": "quand", "commentaire": "50 mots"}},
    {{"nom": "...", "categorie": "...", "attendu_pour": "quand", "commentaire": "50 mots"}},
    {{"nom": "...", "categorie": "...", "attendu_pour": "quand", "commentaire": "50 mots"}}
  ],
  "hack_du_mois": "100 mots - conseil anti-obsolescence concret"
}}

Au moins 3 nouveaux produits récents/plausibles, 3 produits attendus.
Accessoire utile (pas gadget). Hack concret.
RÉPONDS UNIQUEMENT EN JSON."""

    try:
        text = _deepseek_sync(prompt)
        report = json.loads(text)
    except Exception as e:
        report = {
            "accessoire_du_mois": {"nom": "Support mural ajustable", "descriptif": "Pour accompagner votre TV", "prix": "49€", "note": "82/100"},
            "nouveaux_produits": [{"nom": "Produit récent", "categorie": "Tech", "descriptif": "À vérifier", "prix": "?"}],
            "produits_attendus": [{"nom": "Produit à venir", "categorie": "Tech", "attendu_pour": "Bientôt", "commentaire": "À confirmer"}],
            "hack_du_mois": "Éteignez complètement vos appareils au lieu de les laisser en veille.",
        }

    # 4. Assembler le rapport final
    result = {
        "produit_du_mois": produit_du_mois or {"nom": "Sélection du mois", "note": "?/100", "descriptif": "", "defauts": "", "url_affilie": "https://troviio.com"},
        "accessoire_du_mois": report.get("accessoire_du_mois", {}),
        "nouveaux_produits": report.get("nouveaux_produits", []),
        "produits_attendus": report.get("produits_attendus", []),
        "hack_du_mois": report.get("hack_du_mois", ""),
        "top_produits_base": base_products,
        "_meta": {
            "generated_at": now.isoformat(),
            "month": month,
            "month_name": month_name,
            "draft": True,
        },
    }

    # Sauvegarder
    os.makedirs(VEILLE_DIR, exist_ok=True)
    filepath = os.path.join(VEILLE_DIR, f"{month}.json")
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    return result


if __name__ == "__main__":
    result = veille_mensuelle()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"\n✅ Veille sauvegardée dans data/veille/{datetime.now().strftime('%Y-%m')}.json", file=sys.stderr)

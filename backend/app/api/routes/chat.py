"""
PICKSY — Routes Chat IA
Flow : entretien → profil → requête Supabase (v_products_published) → ranking IA → recommandations
"""

import os, json
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from openai import AsyncOpenAI
from supabase import create_client

router = APIRouter()

client = AsyncOpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")
supabase = create_client(os.getenv("SUPABASE_URL", ""), os.getenv("SUPABASE_SERVICE_KEY", ""))

# ─── Mapping catégories ──────────────────────────────────────
CATEGORY_MAP = {
    "robot": "robot-aspirateur", "aspirateur": "robot-aspirateur", "roomba": "robot-aspirateur",
    "roborock": "robot-aspirateur", "dreame": "robot-aspirateur", "irobot": "robot-aspirateur",
    "tv": "tv-oled", "télé": "tv-oled", "television": "tv-oled", "oled": "tv-oled", "qled": "tv-oled",
    "café": "machine-cafe", "cafe": "machine-cafe", "expresso": "machine-cafe", "espresso": "machine-cafe",
    "capsule": "machine-cafe", "nespresso": "machine-cafe", "dolce": "machine-cafe",
    "casque": "casque-audio", "écouteur": "casque-audio", "airpod": "casque-audio", "headphone": "casque-audio",
    "lave-linge": "lave-linge", "lavelinge": "lave-linge", "lave linge": "lave-linge",
    "lave-vaisselle": "lave-vaisselle", "lavage": "lave-vaisselle",
    "frigo": "refrigerateur", "réfrigérateur": "refrigerateur", "frigidaire": "refrigerateur",
    "purificateur": "purificateur-air", "purif": "purificateur-air", "qualité air": "purificateur-air",
    "barre de son": "barre-son", "soundbar": "barre-son", "home cinéma": "barre-son",
    "domotique": "domotique-hub", "smarthome": "domotique-hub", "home assistant": "domotique-hub",
    "friteuse": "friteuse-air", "airfryer": "friteuse-air", "air fryer": "friteuse-air",
    "trottinette": "trottinette", "scooter": "trottinette",
    "vélo électrique": "velo-electrique", "velo": "velo-electrique",
    "ordinateur": "ordinateur-etudiant", "laptop": "ordinateur-etudiant", "pc portable": "ordinateur-etudiant",
    "smartphone": "smartphone", "téléphone": "smartphone", "iphone": "smartphone", "android": "smartphone",
    "imprimante": "imprimante", "printer": "imprimante",
    "camera": "camera-securite", "caméra": "camera-securite", "surveillance": "camera-securite",
    "thermostat": "thermostat-connecte", "chauffage": "thermostat-connecte",
}

SYSTEM_PROMPT = """Tu es Picksy, un conseiller produit expert.
Tu mènes un entretien de découverte rapide pour comprendre le besoin réel, puis tu génères un profil structuré.

DOMAINES : électroménager et tech maison uniquement (aspirateurs robots, TV, machines à café, casques audio, smartphones, laptops, lave-linge, lave-vaisselle, purificateurs d'air, barres de son, domotique, friteuses à air, frigos, caméras de sécurité, thermostats connectés, trottinettes électriques).

RÈGLES :
1. Tutoiement obligatoire. Ton direct, comme un ami expert.
2. Une question à la fois, courte, avec 2-4 options entre parenthèses.
3. Hors domaine → "Je suis spécialisé dans les produits maison et tech. 😊"
4. JAMAIS de superlatifs : "meilleur", "top", "optimal". Toujours centré sur l'usage réel.

PROCESSUS :
- Message 1 : identifier la catégorie et le cas d'usage principal
- Messages 2-3 : questions clés (contraintes, budget, usage spécifique)
- Après 3 échanges : proposer "**[Lancer la recherche pour moi]**"

Quand l'utilisateur dit go/ok/lance → retourner CE JSON EXACT et RIEN D'AUTRE :
{"action": "search", "profile": {"categorie": "robot-aspirateur|tv-oled|machine-cafe|...", "budget_max": 400, "criteres": ["parquet", "animaux"], "resume": "profil en 1 phrase"}}

Catégories valides : robot-aspirateur, tv-oled, machine-cafe, casque-audio, lave-linge, lave-vaisselle, refrigerateur, purificateur-air, barre-son, domotique-hub, friteuse-air, ordinateur-etudiant, smartphone, imprimante, camera-securite, thermostat-connecte, trottinette, velo-electrique, aspirateur-balai."""

HORS_SCOPE = ["météo", "recette", "cuisine", "politique", "médecin", "santé", "voiture", "moto", "voyage", "avion", "sport", "football", "bourse", "crypto", "code", "programme", "javascript", "python"]


async def query_db(profile: dict) -> list:
    """Interroge v_products_published avec la catégorie et le budget."""
    cat = profile.get("categorie", "")
    budget = profile.get("budget_max")
    try:
        q = supabase.table("v_products_published").select("*").order("estimated_score", desc=True)
        if cat:
            q = q.eq("category_slug", cat)
        if budget:
            q = q.lte("price_eur", int(budget))
        return (q.limit(15).execute().data or [])
    except Exception as e:
        print(f"⚠️ DB error: {e}")
        return []


async def rank_with_ai(products: list, profile: dict) -> list:
    """DeepSeek classe les produits selon le profil."""
    if not products:
        return []
    summary = "\n".join([
        f"- {p.get('brand','')} {p.get('name','')} | score:{p.get('estimated_score','')} | "
        f"prix:{p.get('price_eur','?')}€ | specs:{json.dumps(p.get('specs',{}))[:200]}"
        for p in products
    ])
    prompt = f"""Profil : catégorie={profile.get('categorie')} | budget_max={profile.get('budget_max','?')}€ | critères={profile.get('criteres',[])} | résumé={profile.get('resume','')}

Produits disponibles :
{summary}

Sélectionne les 3 MEILLEURS pour ce profil. JSON array :
[{{"name":"...","brand":"...","rank_label":"Meilleur choix","why_perfect":"...","pros":["..."],"cons":["..."],"score":8.5,"price_range":"xxx€"}}]
rank_label : "Meilleur choix" | "Meilleur rapport qualité/prix" | "Option premium"
UNIQUEMENT le JSON array."""
    try:
        resp = await client.chat.completions.create(
            model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1500, temperature=0.2
        )
        raw = resp.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"): raw = raw[4:]
        return json.loads(raw)
    except Exception as e:
        print(f"❌ Ranking error: {e}")
        return []


async def ai_fallback(profile: dict) -> list:
    """Recommandations DeepSeek si DB vide."""
    prompt = f"""Tu es expert produit. 3 recommandations concrètes pour :
Catégorie: {profile.get('categorie')} | Budget: {profile.get('budget_max','?')}€ | Critères: {profile.get('criteres',[])} | Contexte: {profile.get('resume','')}

JSON array : [{{"name":"...","brand":"...","rank_label":"Meilleur choix","why_perfect":"...","pros":["..."],"cons":["..."],"score":8.5,"price_range":"xxx€"}}]
UNIQUEMENT le JSON array."""
    try:
        resp = await client.chat.completions.create(
            model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1500, temperature=0.3
        )
        raw = resp.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"): raw = raw[4:]
        return json.loads(raw)
    except:
        return []


def format_recs(products: list, from_db: bool = True) -> str:
    if not products:
        return "Je n'ai pas trouvé de produits correspondant. Précise ta recherche ?"
    medals = ["🥇", "🥈", "🥉"]
    lines = ["✅ **Voici mes recommandations pour ta situation :**\n"]
    source_note = "" if from_db else "\n*💡 Base locale en cours d'alimentation — recommandations basées sur les connaissances Picksy.*"
    for i, p in enumerate(products[:3]):
        m = medals[i] if i < 3 else f"{i+1}."
        lines.append(f"{m} **{p.get('rank_label','')}** — {p.get('brand','')} {p.get('name','')}")
        if p.get("score"): lines.append(f"Score Picksy : **{p['score']}/10** · Prix estimé : {p.get('price_range','?')}")
        lines.append(f"*{p.get('why_perfect','')}*")
        if p.get("pros"): lines.append("✅ " + " · ".join(p["pros"][:3]))
        if p.get("cons"): lines.append(f"⚠️ {p['cons'][0]}")
        lines.append("")
    lines.append(f"---\n*Zéro commission, zéro biais.{source_note}*")
    return "\n".join(lines)


# ─── Models ──────────────────────────────────────────────────
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []
    user_id: str = "anonymous"

class ChatResponse(BaseModel):
    reply: str
    is_scope: bool
    action: Optional[str] = None
    profile: Optional[dict] = None
    recommendations: Optional[list] = None


# ─── Route principale ──────────────────────────────────────
@router.post("/", response_model=ChatResponse)
@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    msg_lower = req.message.lower()

    if any(kw in msg_lower for kw in HORS_SCOPE):
        return ChatResponse(reply="Je suis spécialisé dans les produits maison et tech. 😊", is_scope=False)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for m in req.history:
        messages.append({"role": m.role, "content": m.content})
    messages.append({"role": "user", "content": req.message})

    resp = await client.chat.completions.create(
        model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
        messages=messages, max_tokens=600, temperature=0.7
    )
    reply = resp.choices[0].message.content.strip()
    action = profile = recommendations = None

    if '"action"' in reply and '"search"' in reply:
        try:
            js = reply[reply.find("{"):reply.rfind("}")+1]
            data = json.loads(js)
            if data.get("action") == "search":
                action, profile = "search", data.get("profile", {})
                db_products = await query_db(profile)
                if db_products:
                    recommendations = await rank_with_ai(db_products, profile)
                    reply = format_recs(recommendations, from_db=True)
                else:
                    recommendations = await ai_fallback(profile)
                    reply = format_recs(recommendations, from_db=False)
        except Exception as e:
            print(f"⚠️ Search error: {e}")

    return ChatResponse(reply=reply, is_scope=True, action=action, profile=profile, recommendations=recommendations)

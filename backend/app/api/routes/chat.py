"""
PICKSY — Routes Chat IA
Flow : entretien → profil → requête Supabase (v_products_published) → ranking IA → recommandations
"""

import os, json, logging
from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import List, Optional
from openai import AsyncOpenAI

from app.core.supabase import get_supabase_admin
from app.core.rate_limit import enforce_chat_rate_limit
from app.services.results_service import generate_result_id, enrich_recommendations, save_result

logger = logging.getLogger("troviio.chat")

router = APIRouter()

client = AsyncOpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")
supabase = get_supabase_admin()

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
    "barre de son": "barre-son", "barre-de-son": "barre-son", "soundbar": "barre-son", "home cinéma": "barre-son",
    "domotique": "domotique-hub", "smarthome": "domotique-hub", "home assistant": "domotique-hub",
    "friteuse": "friteuse-air", "airfryer": "friteuse-air", "air fryer": "friteuse-air",
    "trottinette": "trottinette", "scooter": "trottinette",
    "vélo électrique": "velo-electrique", "velo": "velo-electrique",
    "ordinateur": "ordinateur-etudiant", "laptop": "ordinateur-etudiant", "pc portable": "ordinateur-etudiant",
    "smartphone": "smartphone", "téléphone": "smartphone", "iphone": "smartphone", "android": "smartphone",
    "imprimante": "imprimante", "printer": "imprimante",
    "camera": "camera-securite", "caméra": "camera-securite", "surveillance": "camera-securite",
    "thermostat": "thermostat-connecte", "chauffage": "thermostat-connecte",
    "poussette": "poussette", "landau": "poussette", "poussette bebe": "poussette",
}

SYSTEM_PROMPT = """# IDENTITÉ ET RÔLE

Tu es Troviio, assistant shopping français. Tu es l'ami qui s'y connaît : chaleureux, expert, honnête. Tu aides à choisir des produits en te basant sur leur mode de vie réel, pas des fiches techniques.

Tu sais que choisir un appareil peut être stressant. Ta mission est de dédramatiser, comprendre le quotidien, et recommander sur mesure.

---

# FLOW STRICT — 5 QUESTIONS MAXIMUM

Tu DOIS poser exactement UNE question à la fois, avec 3 options numérotées comme ceci :

1. Option 1
2. Option 2
3. Option 3

Chaque message se termine par ces 3 options. Le client peut cliquer sur une option OU écrire librement — dans les deux cas, tu enchaînes avec la question suivante.

## Ordre des questions (dans cet ordre) :
1. Contexte logement/usage (lieu, taille, pièce)
2. Type de sol ou environnement
3. Budget (petit, moyen, premium)
4. Usage spécifique (quoi, quand, comment)
5. Priorité finale + vérification

Si le client est indécis, adapte mais reste dans le format 1. / 2. / 3.

## Règle ABSOLUE de sortie :
À la FIN de ta question du tour 5, APRÈS les 3 options, ajoute EXACTEMENT cette ligne :
```
Tu peux aussi me dire "lance" si tu as assez d'infos ✨
```

---

# RÈGLES DE COMPORTEMENT

1. **Empathie d'abord.** Valide toujours l'émotion.
2. **Pas de jargon technique brut.** Traduis avec des analogies de la vraie vie.
3. **Humour léger.** Pas de monologue.
4. **Concise.** 2-4 phrases max par message.
5. **Une seule question à la fois.** Toujours finir par les 3 options numérotées.
6. **Si le client arrive avec déjà une question (clic sur chip) :** réponds directement, ne répète pas sa question, enchaîne sur la suivante.

---

# BANQUE DE QUESTIONS COMPORTEMENTALES

## Aspirateurs robots

- "Il y a un chien, un chat, ou une petite usine à poils à la maison ?" → Type de brosse, puissance, station de vidage
- "Le logement fait quelle taille : petit appart, grand appart, maison ?" → Autonomie, capacité batterie, navigation
- "Chez toi, le sol est dégagé ou il y a souvent des câbles, jouets, chaussettes suicidaires ?" → Détection d'obstacles
- "Il va rouler sur quoi : carrelage, parquet, tapis, moquette, ou joyeux mélange ?" → Puissance, serpillière
- "Tu veux qu'il bosse quand tu es absent, ou plutôt la nuit ?" → Mode silencieux, programmation
- "Il y a quelqu'un d'allergique à la poussière ou aux poils ?" → Filtration HEPA obligatoire
- "Tu veux juste aspirer, ou aussi qu'il passe un petit coup de serpillière ?" → Système lavage
- "Tu es prêt à vider le bac souvent, ou tu veux le truc le plus autonome possible ?" → Station de vidage

## Téléviseurs

- "Ton canapé est à quelle distance de la TV ? À la louche, pas besoin du mètre laser." → Taille d'écran
- "Elle va servir pour quoi : films/séries, sport, console, ou tout ça ?" → Technologie dalle, latence
- "La pièce est plutôt lumineuse avec fenêtres, ou ambiance grotte cosy ?" → Luminosité, OLED vs LED
- "Vous regardez tous en face ou quelqu'un est souvent sur le côté ?" → Angle de vision
- "Tu utilises le son de la TV ou tu as déjà une barre de son ?" → Qualité audio

## Électroménager général

- "Tu cherches le meilleur prix, le bon compromis, ou un achat solide pour longtemps ?" → Positionnement
- "Tu vas t'en servir tous les jours, toutes les semaines, ou quand les planètes s'alignent ?" → Robustesse
- "Le bruit, c'est un vrai sujet chez toi ?" → Décibels
- "Tu as de la place, ou chaque centimètre a déjà un CDI ?" → Dimensions
- "Si tu devais choisir UNE priorité : durabilité, prix, facilité ou performance ?" → Arbitrage principal

---

# GESTION DES SITUATIONS DÉLICATES

## Client indécis ("je sais pas")
Ne pas insister avec des questions ouvertes. Passer en mode "réagis à ma proposition" :
> "Pas grave, on passe en mode facile. Plutôt petit budget, bon compromis, ou achat tranquille pour plusieurs années ?"

## Client impatient (veut LA réponse sans rien dire)
> "Je peux te donner une réponse rapide, oui. Mais 'le meilleur' dépend de ton usage. Sinon je risque de te recommander une Ferrari pour aller chercher le pain. Donne-moi juste 2 infos : budget et usage principal ?"

## Client méfiant ("vous voulez juste vendre le plus cher")
> "Bonne méfiance. Elle est saine. Mon but n'est pas de te faire prendre le plus cher, mais celui qui colle à ton usage. D'ailleurs, là, tu n'as probablement pas besoin du haut de gamme."

## Client déçu par un achat passé
Valider d'abord, diagnostiquer ensuite, jamais contredire :
> "Ah, je comprends. C'est frustrant. Et souvent, ce n'est pas toi qui as mal choisi — c'est un mauvais match entre le produit et ton usage."

---

# PROACTIVITÉ ET ANTICIPATION

## Signaler les pièges courants (SANS être alarmiste)
> "Attention, un conseil d'ami : beaucoup de gens regrettent de ne pas avoir pris la station de vidage automatique s'ils ont des animaux. C'est un détail qui change la vie."

## Introduire les accessoires naturellement
> "Au fait, pendant qu'on y est — tu savais que les filtres de ce modèle sont souvent en rupture de stock ? Autant prévoir maintenant."

---

# FORMAT DES RÉPONSES

- **Longueur :** Maximum 4-5 phrases par bulle. Plus court sur mobile.
- **Structure :** Intro prose courte (1-2 phrases) → bullets pour les comparaisons → question ou CTA pour relancer
- **Noms de produits en gras.**
- **Fin de message :** Toujours terminer par une question ouverte ou un choix à faire.

---

Hors domaine → "Je suis spécialisé dans les produits maison et tech 😊" (ne jamais utiliser cette réponse comme message d'accueil — seulement si l'utilisateur demande quelque chose hors domaine)
"""
HORS_SCOPE = ["météo", "recette", "politique", "médecin", "bourse", "crypto", "javascript", "python"]


# Cache des slugs -> UUID catégories
CATEGORY_UUID_CACHE = {}

async def get_category_uuid(slug: str) -> str | None:
    """Résout un slug de catégorie en UUID via la table categories."""
    if slug in CATEGORY_UUID_CACHE:
        return CATEGORY_UUID_CACHE[slug]
    try:
        r = supabase.table("categories").select("id").eq("slug", slug).limit(1).execute()
        if r.data:
            uid = r.data[0]["id"]
            CATEGORY_UUID_CACHE[slug] = uid
            return uid
    except Exception as e:
        logger.info(f"⚠️ Cat lookup error: {e}")
    return None

async def query_db(profile: dict) -> list:
    """Interroge v_products_published avec la catégorie et le budget."""
    cat_slug = profile.get("categorie", "")
    budget = profile.get("budget_max")
    try:
        q = supabase.table("v_products_published").select("*").order("estimated_score", desc=True)
        if cat_slug:
            q = q.eq("category_slug", cat_slug)
        if budget:
            q = q.lte("price_eur", int(budget))
        return (q.limit(15).execute().data or [])
    except Exception as e:
        logger.info(f"⚠️ DB error: {e}")
        return []


async def rank_with_ai(products: list, profile: dict) -> list:
    """DeepSeek classe les produits selon le profil.
    Fix Cicéron: extra_body thinking:disabled + response_format json_object + fallback reasoning_content.
    """
    if not products:
        return []
    summary_lines = []
    for p in products[:25]:
        summary_lines.append(
            f"- {p.get('brand','')} {p.get('name','')} | score:{p.get('estimated_score','')}/10 | "
            f"prix:{p.get('price_eur','?')}€ | cat:{p.get('category_slug','')} | "
            f"use_case:{json.dumps(p.get('use_case_scores',{}))[:150]}"
        )
    summary = "\n".join(summary_lines)

    system_prompt = """You are a product ranking engine for Picksy, a French e-commerce chatbot.
Your task is to analyze products and return the 3 best recommendations as json.

OUTPUT FORMAT — Return this exact JSON structure, nothing else:
{
  "recommendations": [
    {
      "name": "string",
      "brand": "string",
      "rank_label": "Meilleur choix",
      "why_perfect": "string in French, max 2 sentences",
      "pros": ["string", "string", "string"],
      "cons": ["string"],
      "score": 8.5,
      "price_range": "500€"
    }
  ]
}

STRICT RULES:
- "rank_label": "Meilleur choix" | "Meilleur rapport qualite/prix" | "Option premium"
- "score": between 0 and 10
- Output ONLY the JSON object. No markdown, no explanation, no preamble.
- "recommendations" must contain exactly 3 items.
- For each product, include direct_links with { "type": "manual"|"merchant1"|"merchant2", "url": "...", "label": "..." }
  if direct_link or merchant_links are present in the product data.
"""
    user_prompt = f"""Profile utilisateur : {json.dumps(profile, ensure_ascii=False)}

Produits disponibles :
{summary}

Rends exactement 3 recommandations au format JSON."""
    try:
        resp = await client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0,
            response_format={"type": "json_object"},
            extra_body={"thinking": {"type": "disabled"}},
        )
        raw = resp.choices[0].message.content
        if not raw:
            raw = resp.choices[0].message.model_extra.get("reasoning_content", "{}")
        data = json.loads(raw)
        recs = data.get("recommendations", [])
        for r in recs:
            r.pop("direct_links", None)
        return recs
    except Exception as e:
        logger.error(f"❌ Ranking AI error: {e}")
        return []


# ─── Request/Response models ────────────────────────────────

class ChatRequest(BaseModel):
    session_id: str = "anonymous"
    message: str
    history: list[dict] = []
    category: str = ""

class AccessoryChatRequest(BaseModel):
    session_id: str = "anonymous"
    message: str
    history: list[dict] = []
    device_name: str = ""
    category: str = ""

class ChatResponse(BaseModel):
    reply: str
    done: bool = False
    search_profile: Optional[dict] = None


# ─── Core chat function ─────────────────────────────────────

async def chat_with_deepseek(history: list[dict], system_override: str | None = None) -> str:
    """Appelle DeepSeek avec l'historique complet (stateless : history = tout)."""
    messages = [{"role": "system", "content": system_override or SYSTEM_PROMPT}]
    messages.extend(history)

    try:
        resp = await client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            temperature=0.7,
            max_tokens=400,
        )
        raw = resp.choices[0].message.content
        if not raw:
            raw = resp.choices[0].message.model_extra.get("reasoning_content", "")
        return raw.strip()
    except Exception as e:
        logger.error(f"❌ DeepSeek error: {e}")
        return "Désolé, je rencontre un problème technique. Peux-tu reformuler ?"


LAUNCH_TRIGGERS = {"lance", "go", "vas-y", "trouve", "je suis prêt", "je suis prete", "c'est bon", "j'ai assez", "recherche", "ok", "oui"}

# ─── Chat endpoint ──────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, request: Request):
    """Point d'entrée principal du Chat IA — 5 tours max + options cliquables."""
    client_ip = request.client.host if request.client else "unknown"

    # Rate limiting
    try:
        await enforce_chat_rate_limit(request)
    except HTTPException:
        return ChatResponse(reply="⏳ Trop de messages d'un coup ! Prends une inspiration et réessaie dans quelques secondes.")
    except Exception:
        pass

    history = req.history or []

    # Compter les échanges utilisateur (messages déjà envoyés + celui-ci)
    exchange_count = sum(1 for m in history if m["role"] == "user") + 1

    # Ajouter le message utilisateur à l'historique
    history.append({"role": "user", "content": req.message})

    # Détection "lance" dans le message
    msg_lower = req.message.lower().strip()
    user_wants_search = any(t in msg_lower for t in LAUNCH_TRIGGERS)

    # Auto-trigger après 5 tours
    force_search = exchange_count >= 5 or user_wants_search

    if force_search:
        # Construire un profil à partir de l'historique
        profile = {
            "categorie": req.category or "",
            "budget_max": None,
            "criteres": [],
            "resume": f"Utilisateur après {exchange_count} échanges de questions-réponses",
        }

        # Query DB
        products = await query_db(profile)
        if products:
            ranked = await rank_with_ai(products, profile)
            enriched = await enrich_recommendations(ranked)
            final_recs = enriched if enriched else ranked
            result_id = await generate_result_id()
            await save_result(result_id, req.session_id, profile.get("categorie", ""), profile, final_recs)

            return ChatResponse(
                reply="",
                done=True,
                search_profile={
                    "result_id": result_id,
                    "action": "search",
                    "profile": profile,
                    "recommendations": final_recs,
                }
            )
        else:
            return ChatResponse(
                reply="Je n'ai pas trouvé de produits correspondant à ce profil dans ma base. Veux-tu ajuster les critères ?",
                done=False
            )

    # Sinon, continuer la conversation normale
    reply = await chat_with_deepseek(history)
    return ChatResponse(reply=reply, done=False)


# ─── Accessory chat endpoint ────────────────────────────────

ACCESSORY_SYSTEM_PROMPT = """# IDENTITÉ — CONSEILLER ACCESSOIRES PICKSY

Tu es l'expert accessoires de Picksy. Tu aides les gens à trouver LE bon accessoire pour leur appareil.

Ton rôle : identifier précisément l'appareil, comprendre l'usage réel, et recommander l'accessoire adapté — pas le plus cher, le plus compatible.

# RÈGLES

1. **D'abord, identifie l'appareil.** Demande modèle exact ou aide l'utilisateur à le trouver.
2. **Puis, explore le besoin.** À quoi doit servir l'accessoire ? Usage occasionnel ou quotidien ?
3. **Enfin, recommande.** 1 option principale, max 1 alternative.
4. **Signale les incompatibilités.** "Attention, ce filtre n'est pas compatible avec le modèle X — vérifie ton numéro de série."
5. **Jamais de phrases d'attente.** Dès le premier message, soit tu aides, soit tu poses une question précise.
"""

@router.post("/chat/accessories", response_model=ChatResponse)
async def chat_accessories(req: AccessoryChatRequest, request: Request):
    """Chat IA dédié aux accessoires."""
    client_ip = request.client.host if request.client else "unknown"
    try:
        await enforce_chat_rate_limit(client_ip)
    except Exception:
        return ChatResponse(reply="⏳ Trop de messages d'un coup ! Prends une inspiration et réessaie dans quelques secondes.")

    history = req.history or []
    context = ""
    if req.device_name:
        context = f"L'appareil de l'utilisateur : {req.device_name} (catégorie : {req.category or 'non spécifiée'})"
    if context:
        history = [{"role": "system", "content": context}] + history

    history.append({"role": "user", "content": req.message})

    reply = await chat_with_deepseek(history, system_override=ACCESSORY_SYSTEM_PROMPT)
    return ChatResponse(reply=reply, done=False)

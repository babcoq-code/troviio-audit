"""
PICKSY — Routes Chat IA
Flow : entretien → profil → requête Supabase (v_products_published) → ranking IA → recommandations
"""

import os, json, logging
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from openai import AsyncOpenAI

from app.core.supabase import get_supabase_admin
from app.core.rate_limit import enforce_chat_rate_limit
from app.services.results_service import generate_result_id, enrich_recommendations, save_result
from unidecode import unidecode

logger = logging.getLogger("troviio.chat")

router = APIRouter()

client = AsyncOpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")
supabase = get_supabase_admin()

# ─── Mapping catégories ──────────────────────────────────────
CATEGORY_MAP = {
    # Clés longues d'abord pour éviter les faux positifs (tri par len décroissant)
    "aspirateur robot": "aspirateur-robot",
    "robot aspirateur": "aspirateur-robot",
    "aspirateur-robot": "aspirateur-robot",
    "aspirateur balai": "aspirateur-balai",
    "aspirateur-balai": "aspirateur-balai",
    "cave à vin": "cave-a-vin",
    "cave a vin": "cave-a-vin",
    "barre de son": "barre-de-son",
    "barre-de-son": "barre-de-son",
    "home cinéma": "barre-de-son",
    "home cinema": "barre-de-son",
    "dolce gusto": "machine-a-cafe",
    "machine à café": "machine-a-cafe",
    "machine a cafe": "machine-a-cafe",
    "machine à laver": "lave-linge",
    "machine a laver": "lave-linge",
    "ordinateur portable": "ordinateur-portable",
    "ordinateur-portable": "ordinateur-portable",
    "pc portable": "ordinateur-portable",
    "casque audio": "casque-audio",
    "casque-audio": "casque-audio",
    "casque sans fil": "casque-audio",
    "sony wh": "casque-audio",
    "bose qc": "casque-audio",
    "enceinte bt": "enceinte-bt",
    "enceinte-bt": "enceinte-bt",
    "enceinte portable": "enceinte-bt",
    "haut-parleur": "enceinte-bt",
    "haut parleur": "enceinte-bt",
    "samsung galaxy": "smartphone",
    "samsung tv": "tv",
    "lg tv": "tv",
    "sony tv": "tv",
    "philips tv": "tv",
    "philips cafe": "machine-a-cafe",
    "neo qled": "tv",
    "friteuse air": "friteuse-air",
    "friteuse-a-air": "friteuse-air",
    "aire fryer": "friteuse-air",
    "four micro-ondes": "four-micro-ondes",
    "four micro ondes": "four-micro-ondes",
    "micro-onde": "four-micro-ondes",
    "micro onde": "four-micro-ondes",
    "lave-linge": "lave-linge",
    "lave linge": "lave-linge",
    "lave-vaisselle": "lave-vaisselle",
    "lave vaisselle": "lave-vaisselle",
    # Clés courtes en dernier
    "aspirateur": "aspirateur-robot",
    "roomba": "aspirateur-robot",
    "roborock": "aspirateur-robot",
    "dreame": "aspirateur-robot",
    "irobot": "aspirateur-robot",
    "ecovacs": "aspirateur-robot",
    "deebot": "aspirateur-robot",
    "balai": "aspirateur-balai",
    "dyson": "aspirateur-balai",
    "tineco": "aspirateur-balai",
    "rowenta": "aspirateur-balai",
    "tv": "tv",
    "télé": "tv",
    "television": "tv",
    "téléviseur": "tv",
    "oled": "tv",
    "qled": "tv",
    "café": "machine-a-cafe",
    "cafe": "machine-a-cafe",
    "expresso": "machine-a-cafe",
    "espresso": "machine-a-cafe",
    "capsule": "machine-a-cafe",
    "nespresso": "machine-a-cafe",
    "delonghi": "machine-a-cafe",
    "jura": "machine-a-cafe",
    "krups": "machine-a-cafe",
    "casque": "casque-audio",
    "écouteur": "casque-audio",
    "ecouteur": "casque-audio",
    "airpod": "casque-audio",
    "airpods": "casque-audio",
    "headphone": "casque-audio",
    "lave linge": "lave-linge",
    "lavelinge": "lave-linge",
    "lavevaisselle": "lave-vaisselle",
    "frigo": "refrigerateur",
    "réfrigérateur": "refrigerateur",
    "refrigerateur": "refrigerateur",
    "frigidaire": "refrigerateur",
    "congélateur": "refrigerateur",
    "congelo": "refrigerateur",
    "combiné": "refrigerateur",
    "combo": "refrigerateur",
    "soundbar": "barre-de-son",
    "sonos": "barre-de-son",
    "friteuse": "friteuse-air",
    "airfryer": "friteuse-air",
    "microondes": "four-micro-ondes",
    "smartphone": "smartphone",
    "téléphone": "smartphone",
    "telephone": "smartphone",
    "iphone": "smartphone",
    "android": "smartphone",
    "pixel": "smartphone",
    "oneplus": "smartphone",
    "enceinte": "enceinte-bt",
    "bluetooth": "enceinte-bt",
    "jbl": "enceinte-bt",
    "ordinateur": "ordinateur-portable",
    "laptop": "ordinateur-portable",
    "macbook": "ordinateur-portable",
    "poussette": "poussette",
    "landau": "poussette",
    "caveau": "cave-a-vin",
    "purificateur": "purificateur-air",
    "purif": "purificateur-air",
    "qualité air": "purificateur-air",
    "robot cuisine": "robot-cuisine",
    "robot-cuisine": "robot-cuisine",
    "robot pâtissier": "robot-cuisine",
    "mixeur": "robot-cuisine",
    "trottinette": "trottinette",
    "scooter": "trottinette",
    "vélo électrique": "velo-electrique",
    "velo electrique": "velo-electrique",
    "velo": "velo-electrique",
    "vae": "velo-electrique",
    "ebike": "velo-electrique",
    "e bike": "velo-electrique",
    "bike": "velo-electrique",
    "cave à vin": "cave-a-vin",
    "cave a vin": "cave-a-vin",
}

# Catégories existantes en DB (slug → nom)
AVAILABLE_CATEGORIES = {}  # sera rempli au démarrage

async def detect_category_from_history(history: list[dict]) -> str:
    """Utilise DeepSeek pour extraire la catégorie depuis l'historique complet de la conversation.
    Retourne un slug de catégorie ou chaîne vide si non détectée."""
    # Construire un inverse mapping slug -> mots-clés pour cross-check
    KEYWORDS_BY_SLUG = {}
    for keyword, slug in CATEGORY_MAP.items():
        if slug not in KEYWORDS_BY_SLUG:
            KEYWORDS_BY_SLUG[slug] = []
        KEYWORDS_BY_SLUG[slug].append(keyword)

    # D'abord essayer le CATEGORY_MAP sur tous les messages utilisateur (tri par clé la plus longue d'abord)
    all_user_text = " ".join(m["content"].lower() for m in history if m.get("role") == "user")
    logger.info(f"🔍 [detect_category] user_text={all_user_text[:120]}")
    sorted_keys = sorted(CATEGORY_MAP.keys(), key=len, reverse=True)
    for keyword in sorted_keys:
        if keyword in all_user_text:
            logger.info(f"🔍 [detect_category] MATCH '{keyword}' -> '{CATEGORY_MAP[keyword]}'")
            return CATEGORY_MAP[keyword]
    
    logger.info(f"🔍 [detect_category] No MAP match, fallback DeepSeek")
    try:
        conversation = "\n".join(
            f"{'Client' if m['role'] == 'user' else 'Assistant'}: {m['content']}"
            for m in history[-6:]  # Derniers 6 échanges
        )
        slug_list = ', '.join(sorted(set(CATEGORY_MAP.values())))
        system_msg = f"""Tu es un classifieur de catégories produit. 
À partir de la conversation, identifie UNIQUEMENT le slug de catégorie.

Slugs valides : {slug_list}

RÈGLES STRICTES :
- Ne réponds QUE par le slug exact, rien d'autre (pas de ponctuation, pas d'explication)
- Si le client parle de CAFÉ, capsules, expresso, nespresso, jura, delonghi → retourne EXACTEMENT "machine-a-cafe"
- Si le client parle de robot de cuisine, mixeur, hachoir, blender → retourne "robot-cuisine"
- Si tu es incertain, retourne "inconnue"
- Exemples : aspirateur-robot, machine-a-cafe, tv, casque-audio, lave-linge, robot-cuisine"""
        
        resp = await client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": f"Conversation :\n{conversation}\n\nCatégorie :"}
            ],
            temperature=0,
            max_tokens=30,
        )
        raw = resp.choices[0].message.content
        if raw and raw.strip() in CATEGORY_MAP.values():
            return raw.strip()
    except Exception as e:
        logger.error(f"⚠️ detect_category error: {e}")
    
    return ""

# Init : charger les slugs DB disponibles pour validation
async def init_available_categories():
    """Charge les slugs de catégories existants en DB."""
    try:
        cats = supabase.table("categories").select("slug").execute()
        for c in cats.data:
            AVAILABLE_CATEGORIES[c["slug"]] = True
    except Exception:
        pass

SYSTEM_PROMPT = """# IDENTITÉ ET RÔLE

Tu es Troviio, assistant shopping français. Tu es l'ami qui s'y connaît : chaleureux, expert, honnête. Tu aides à choisir des produits en te basant sur leur mode de vie réel, pas des fiches techniques.

Tu sais que choisir un appareil peut être stressant. Ta mission est de dédramatiser, comprendre le quotidien, et recommander sur mesure.

---

# MESSAGE D'ACCUEIL — PREMIER CONTACT

Quand la conversation commence (pas de historique / c'est le tour 1), tu envoies ce message exact :

Salut. On va trouver le tien, pas le meilleur.

Dis-moi tout : ton logement, ton budget, ta famille, tes habitudes, tes contraintes.
Je fais le reste.

1. Je cherche pour moi / mon foyer
2. Je compare quelques modèles
3. J'ai déjà une idée, je valide

---

# FLOW STRICT — 10 QUESTIONS MAXIMUM

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
6-10. Affinage hyper-pointu (matériaux, marques préférées, fonctionnalités avancées, bruit, design, etc.)

Si le client est indécis, adapte mais reste dans le format 1. / 2. / 3.

## Règle \"Proposer le lancement à partir du tour 5\" :
Les 4 PREMIERS tours (tours 1 à 4) : les 3 options sont UNIQUEMENT des questions d'affinage. Pas d'option de lancement.

À partir du tour 5 (tours 5 à 11) : tu DOIS ajouter une 4e option \"🚀 Lancer la recherche\". Les 3 premières options restent des questions d'affinage.

Format pour les tours 5 à 11 :
```
1. [Question d'affinage - option classique]
2. [Question d'affinage - autre option]
3. [Question d'affinage - troisième option]
4. 🚀 Lancer la recherche — j'en ai assez dit
```

Exemple tour 8 :
```
1. Tu préfères un modèle compact qui se range facilement
2. Tu as de la place pour un modèle standard
3. Tu veux voir plusieurs tailles disponibles
4. 🚀 Lancer la recherche — j'en ai assez dit
```

Exemple tour 10 :
```
1. Un design compact et discret
2. Un look moderne qui trône dans la pièce
3. Tu n'as pas d'avis sur le design
4. 🚀 Lancer la recherche
```

Après 12 tours, la recherche est automatique.

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

- "Tes sols, c'est parcours du combattant ou terrain plat dégagé ?" → Navigation obstacles
- "Tu veux qu'il gère seul ou tu peux ranger un peu avant ?" → Autonomie vs rangement
- "Ton niveau de patience avec un robot qui se coince : élevé, moyen, ou zéro ?" → Tolérance
- "Un animal ? Un enfant ? Un colocataire qui laisse traîner ses affaires ?" → Gestion obstacles
- "Ton pire souvenir avec ce type de produit ?" → Identifier les traumas d'achat

## Machines à café

- "Ton café, tu le bois debout en 30 secondes ou en mode slow-life dominical ?" → Usage quotidien
- "Grains pour les puristes ou capsules pour les pressés ?" → Type
- "Tu vis seul·e, en colocation, ou avec une tribu complète ?" → Volume
- "Ton budget, c'est 'je teste sans me ruiner' ou 'je veux du solide pour 10 ans' ?" → Budget

## Téléviseurs

- "Tu regardes surtout quoi : films, sport, séries, ou tu laisses tourner en fond ?" → Usage
- "Ton salon est une salle de cinéma ou il y a du soleil dedans ?" → Luminosité
- "La TV va être fixée au mur ou posée sur meuble ?" → Installation
- "Ton canapé est à quelle distance de la TV ? À la louche, pas besoin du mètre laser." → Taille écran
- "Tu utilises le son de la TV ou tu as déjà une barre de son ?" → Audio

## Smartphones

- "Ce qui te rendrait fou au quotidien : batterie à plat à 15h, photos floues, ou téléphone trop lent ?" → Priorité
- "Tu le gardes 2 ans ou jusqu'à ce qu'il décide lui-même d'arrêter ?" → Longévité
- "iOS, Android, ou tu t'en fous complètement ?" → OS

## Lave-linge

- \"La machine vivra où ? Cuisine ouverte, salle de bain, ou buanderie fermée ?\" → Bruit
- \"Ce qui t'énerverait le plus : machine bruyante, cycles trop longs, ou linge mal essoré ?\" → Priorité
- \"C'est pour combien de personnes et quel volume de linge par semaine ?\" → Capacité
- \"Ton pire souvenir avec ce type de produit ?\" → Identifier les traumas d'achat

## Vélos électriques

- \"Tu roules surtout en ville, à la campagne, ou en mixte ?\" → Usage principal
- \"Distance quotidienne ? 5 km, 15 km, ou plutôt 30 km et plus ?\" → Autonomie
- \"Tu dois pouvoir le monter dans un escalier ou il a un garage ?\" → Poids
- \"Plutôt look vélo classique ou style VTT/cargo ?\" → Style
- \"Assistance au pédalage ou accélérateur ? Ou tu veux les deux options ?\" → Motorisation

## Trottinettes électriques

- \"Dernier km ou vrai trajet quotidien ?\" → Usage
- \"Tu dois la porter dans les transports ou elle reste au bureau ?\" → Poids/pliage
- \"Terrain plat ou tu as des côtes ?\" → Puissance moteur
- \"Autonomie nécessaire : petite course, demi-journée, ou journée complète ?\" → Batterie

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

Hors domaine → "Je peux t'aider avec des produits électroménager, high-tech, mobilité urbaine, ou équipement maison. Qu'est-ce que tu cherches ?" (ne jamais utiliser cette réponse comme message d'accueil — seulement si l'utilisateur demande vraiment quelque chose d'extrêmement éloigné comme la météo, la politique, ou la programmation)
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
    """Interroge products avec la catégorie et le budget."""
    cat_slug = profile.get("categorie", "")
    budget = profile.get("budget_max")
    try:
        q = supabase.table("products").select("*").order("estimated_score", desc=True, nullsfirst=False).limit(15)
        
        # Filtrer par catégorie
        if cat_slug:
            cat_uuid = await get_category_uuid(cat_slug)
            if cat_uuid:
                q = q.eq("category_id", cat_uuid)
            else:
                logger.warning(f"⚠️ Catégorie slug introuvable: {cat_slug}")
                return []
        
        # Filtrer par budget
        if budget:
            q = q.lte("price_eur", int(budget))
        
        # Exclure les produits sans ASIN (pas de lien affilié possible)
        q = q.not_.is_("amazon_asin", "null")
        
        data = q.execute()
        return data.data or []
    except Exception as e:
        logger.info(f"⚠️ DB error: {e}")
        return []


async def rank_with_ai(products: list, profile: dict, chat_history: list[dict] | None = None) -> list:
    """DeepSeek classe les produits selon le profil et l'historique.
    Fix Cicéron: extra_body thinking:disabled + response_format json_object + fallback reasoning_content.
    """
    if not products:
        return []
    summary_lines = []
    for p in products[:25]:
        # Normaliser les use_case_scores : clés standard seulement
        raw_ucs = p.get('use_case_scores') or {}
        normalized_ucs = {}
        for std_key in ["qualite_prix", "performance", "design", "durabilite", "innovation"]:
            normalized_ucs[std_key] = raw_ucs.get(std_key, 0)
        # Fallback: essayer de matcher des clés françaises/anglaises
        ucs_map = {
            "design": "design", "qualite_prix": "qualite_prix", "qualité_prix": "qualite_prix",
            "rapport_qualite_prix": "qualite_prix", "qualite": "qualite_prix",
            "performance": "performance", "polyvalence": "performance",
            "durabilite": "durabilite", "durabilité": "durabilite",
            "autonomie": "performance", "innovation": "innovation",
            "ergonomie": "design", "confort": "design",
        }
        for k, v in raw_ucs.items():
            nk = ucs_map.get(k.lower().replace(" ","_").replace("-","_"), "")
            if nk and isinstance(v, (int, float)):
                normalized_ucs[nk] = max(normalized_ucs[nk], int(v))

        summary_lines.append(
            f"- {p.get('brand','')} {p.get('name','')} | score:{p.get('estimated_score','')}/10 | "
            f"prix:{p.get('price_eur','?')}€ | "
            f"use_case:{json.dumps(normalized_ucs)}"
        )
    summary = "\n".join(summary_lines)
    
    # Extraire le contexte utilisateur de l'historique
    user_context = ""
    if chat_history:
        user_msgs = [m["content"] for m in chat_history if m.get("role") == "user"]
        if user_msgs:
            user_context = "\n".join(f"- {msg}" for msg in user_msgs)

    system_prompt = """You are a product ranking engine for Picksy, a French e-commerce chatbot.
Your task is to analyze products and return the 3 best recommendations as json.

CRITICAL: The product list contains items from a SINGLE category. NEVER recommend products from different categories — all 3 recommendations must be the same type of product.

CRITICAL: Use the EXACT brand and name as provided. Do NOT repeat the brand multiple times in the name field.

CRITICAL: You MUST ONLY recommend products from the list provided below. Do NOT invent or suggest any product that is not in the list. Do NOT generalize to other products in the same category — use ONLY the specific products listed.

TROVIIO SCORE — Tu dois calculer un troviio_score sur /100 qui mesure l'affinité amoureuse entre le client et le produit. C'est notre signature, notre "match amoureux". Pas une note générique — c'est la probabilité que ce produit rende l'utilisateur heureux au quotidien.

Le troviio_score prend en compte :
1. **Adéquation au profil** (60%) — Est-ce que ce produit correspond exactement aux besoins, au budget, aux critères et au mode de vie du client ?
2. **Qualité intrinsèque** (25%) — notes, specs, durabilité, performance par rapport aux concurrents
3. **Valeur perçue** (15%) — le rapport entre le prix et ce que ça apporte

Un troviio_score élevé (85+) = "coup de foudre, tu vas l'adorer"
Un troviio_score moyen (60-84) = "bon plan, solide, fiable"
Un troviio_score bas (-60) = "ça peut marcher mais sois vigilant"

OUTPUT FORMAT — Return this exact JSON structure, nothing else:
{
  "recommendations": [
    {
      "name": "EXACT product name as provided (no brand prefix)",
      "brand": "EXACT brand as provided",
      "rank_label": "Meilleur choix",
      \"why_perfect\": \"French, 3-4 sentences. EXPLIQUE en détail pourquoi ce produit correspond au profil de l'utilisateur : référence ses besoins spécifiques (surface, animaux, budget, contraintes), les caractéristiques du produit qui répondent à ces besoins, et ce qui le rend vraiment adapté à SON quotidien.\",
      \"why_caution\": \"French, 2-3 sentences. HONNÊTE sur les limites : que manque-t-il à ce produit pour l'utilisateur ? Par exemple : 'Ce modèle est parfait pour les poils d'animaux mais il est un peu bruyant la nuit' ou 'La station dure 2 mois sans vidange mais les consommables coûtent 80€/an'. Toujours trouver un vrai point d'attention, jamais laisser vide. Si vraiment aucun défaut, mettre au moins 'Ce modèle n'a pas de défaut majeur, vérifie juste la compatibilité avec ton mobilier'.\",
      "pros": ["string", "string", "string"],
      "cons": ["string"],
      "score": 8.5,
      "troviio_score": 78,
      "troviio_explanation": "1-2 phrases en français qui expliquent POURQUOI ce score d'affinité. Personnalisé, avec une touche d'humour et de franchise.",
      "price_range": "500€"
    }
  ]
}

STRICT RULES:
- rank_label: "Meilleur choix" | "Meilleur rapport qualite/prix" | "Option premium"
- score: between 0 and 10 (note technique classique, comme avant)
- troviio_score: between 0 and 100 (note d'affinité Troviio — notre signature)
- troviio_explanation: obligatoire, en français, personnalisée, max 2 phrases
- Output ONLY the JSON object. No markdown, no explanation, no preamble.
- recommendations must contain exactly 3 items.
- why_perfect MUST reference the user's specific needs from the profile.
- why_caution: honest about potential downsides for THIS user. Empty string if none.
- name must be just the product name (e.g. "L10s Ultra"), NOT "Dreame L10s Ultra" or "Dreame Dreame L10s Ultra".
"""
    user_prompt = f"""Profile utilisateur : {json.dumps(profile, ensure_ascii=False)}

Ce que l'utilisateur a dit :
{user_context}

Produits disponibles :
{summary}

Rends exactement 3 recommandations au format JSON. Inclus why_caution pour chaque produit si pertinent."""
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
        
        # Cross-check : filtrer les recommandations qui ne correspondent à AUCUN produit de la liste
        valid_names = set()
        for p in products:
            bn = unidecode(p.get('brand','').lower().strip())
            nm = unidecode(p.get('name','').lower().strip())
            valid_names.add(f"{bn} {nm}")
            valid_names.add(nm)
        
        filtered_recs = []
        for r in recs:
            r_brand = unidecode(r.get('brand','').lower().strip())
            r_name = unidecode(r.get('name','').lower().strip())
            lookup = f"{r_brand} {r_name}"
            # Vérifier si le nom complet ou juste le nom correspond à un produit connu
            is_valid = lookup in valid_names or r_name in valid_names
            if is_valid:
                filtered_recs.append(r)
            else:
                logger.warning(f"❌ [rank] Reco '{lookup}' ne correspond à aucun produit connu — ignorée")
        
        # S'il reste moins de 2 recos valides, prendre les meilleurs produits de la liste
        if len(filtered_recs) < 3:
            for p in products[:5]:
                bn = p.get('brand','')
                nm = p.get('name','')
                if not any(
                    unidecode(r.get('brand','').lower()) == unidecode(bn).lower() and
                    unidecode(r.get('name','').lower()) == unidecode(nm).lower()
                    for r in filtered_recs
                ):
                    if len(filtered_recs) >= 3:
                        break
                    filtered_recs.append({
                        "name": nm,
                        "brand": bn,
                        "rank_label": "Bon choix",
                        "why_perfect": "Produit fiable et adapté à tes critères.",
                        "why_caution": "",
                        "pros": [],
                        "cons": [],
                        "score": (p.get("estimated_score") or 7.0),
                        "troviio_score": min(100, int((p.get("estimated_score") or 7.0) * 10)),
                        "troviio_explanation": "Un choix solide et cohérent avec ton profil.",
                        "price_range": f"{p.get('price_eur','?')}€",
                    })
        
        # Réattribuer les ranks
        for i, r in enumerate(filtered_recs[:3]):
            r["rank"] = i + 1
            if i == 0 and not r.get("rank_label"):
                r["rank_label"] = "Meilleur choix"
            elif i == 1 and not r.get("rank_label"):
                r["rank_label"] = "Meilleur rapport qualite/prix"
            elif i == 2 and not r.get("rank_label"):
                r["rank_label"] = "Option premium"
        
        return filtered_recs[:3]
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

async def chat_with_deepseek(history: list[dict], exchange_count: int = 1, system_override: str | None = None) -> str:
    """Appelle DeepSeek avec l'historique complet (stateless : history = tout)."""
    # Injecter le numéro de tour dans le system prompt
    base_prompt = system_override or SYSTEM_PROMPT
    tour_note = f"\n\n[C'EST LE TOUR {exchange_count}. Tu DOIS proposer '🚀 Lancer la recherche' comme 4e option (après 3 questions d'affinage) À PARTIR du tour 5. Avant le tour 5, tes 3 options sont UNIQUEMENT des questions d'affinage, sans option de lancement.]"
    messages = [{"role": "system", "content": base_prompt + tour_note}]
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


LOADING_MESSAGES = [
    "On interroge les fiches techniques. Certaines répondent en jargon.",
    "On sépare les vrais atouts des mots comme 'révolutionnaire'.",
    "On compare, on recoupe, on respire. Pas forcément dans cet ordre.",
    "On lit les avis clients pour toi. Même ceux qui parlent de la livraison en 2019.",
    "Sur 240 offres, on va t'en garder 3. Le reste n'avait rien à faire là.",
    "On élimine les 'numéro 1 incontesté'. Ça fait de la place.",
    "On vérifie les contre-vérités dans les descriptifs. Il y en a.",
    "Analyse en cours. J'élimine les gadgets inutiles et les promesses marketing.",
    "On cherche le modèle qui coche tes cases — pas celles du voisin.",
    "L'IA n'a pas acheté un grille-pain en douce. Promis.",
]

LAUNCH_TRIGGERS = {"lance", "go", "vas-y", "trouve", "je suis prêt", "je suis prete", "c'est bon", "j'ai assez", "recherche"}

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
        pass  # Redis down — pas de blocage

    history = req.history or []

    # Compter les échanges utilisateur (messages déjà envoyés + celui-ci)
    exchange_count = sum(1 for m in history if m["role"] == "user") + 1

    # Ajouter le message utilisateur à l'historique
    history.append({"role": "user", "content": req.message})

    # Détection "lance" dans le message
    msg_lower = req.message.lower().strip()
    
    # Mots qui déclenchent une recherche immédiate
    # VÉRIFICATION STRICTE : minimum 5 échanges avant de pouvoir lancer (4 réponses DeepSeek + 1 clic)
    # Tours 1-4 : pas de lancement possible même si l'utilisateur tape "recherche"
    user_wants_search = any(t in msg_lower for t in LAUNCH_TRIGGERS) and exchange_count >= 5
    
    # Auto-trigger APRÈS 8 tours complets (7 questions DeepSeek)
    force_search = (exchange_count >= 12 or user_wants_search) and exchange_count >= 2

    if force_search:
        logger.info(f"🚀 force_search=True (exchange_count={exchange_count}, user_wants_search={user_wants_search})")
        # Détecter la catégorie depuis l'historique via DeepSeek si non fournie
        detected_cat = req.category
        if not detected_cat:
            detected_cat = await detect_category_from_history(history)

        if not detected_cat:
            logger.warning(f"⚠️ Catégorie non détectée, recherche annulée")
            reply = (
                "Je n'ai pas réussi à déterminer ce que tu cherches précisément. "
                "Peux-tu me donner le type de produit ?\n\n"
                "1. Une machine à café\n"
                "2. Un aspirateur\n"
                "3. Une TV\n"
                "4. Autre (précise)"
            )
            return ChatResponse(reply=reply, done=False)

        # Si on a un slug de catégorie, vérifier qu'il existe en DB
        if detected_cat:
            cat_uuid = await get_category_uuid(detected_cat)
            if not cat_uuid:
                # Catégorie non trouvée en DB — ne pas lancer une recherche vide
                logger.warning(f"⚠️ Catégorie '{detected_cat}' introuvable en DB, recherche annulée")
                # Revenir en mode dialogue
                reply = f"Je ne trouve pas encore de produits pour «{detected_cat}» dans ma base. Je peux t'aider à choisir autre chose ?\n\n1. Voir les catégories disponibles\n2. Je cherche autre chose\n3. Parle-moi de mes options"
                return ChatResponse(reply=reply, done=False)

        # Construire un profil à partir de l'historique
        profile = {
            "categorie": detected_cat or "",
            "budget_max": None,
            "criteres": [],
            "resume": f"Utilisateur après {exchange_count} échanges de questions-réponses",
        }

        # Extraire le budget depuis l'historique utilisateur
        all_user_text = " ".join(m["content"].lower() for m in history if m.get("role") == "user")
        import re
        
        # PATIERS multiples, classés par priorité :
        # 1) Plages explicites "entre X et Y€", "X€ à Y€" — prendre le plus grand
        range_match = re.search(r'(?:entre\s+)?(\d{2,5})\s*(?:€|euros?|eur)\s*(?:et|à|-)\s*(\d{2,5})\s*(?:€|euros?|eur)', all_user_text)
        if range_match:
            profile["budget_max"] = max(int(range_match.group(1)), int(range_match.group(2)))
            logger.info(f"💰 Budget extrait (range): {range_match.group(1)}-{range_match.group(2)}€ → max={profile['budget_max']}")
        else:
            # 2) Tous les motifs "mot-clé + nombre + €" → collecte TOUTES les occurrences
            keyword_pattern = r'(?:budget\s*(?:max|maximum|de|d\w*)?\s*:?\s*|max(?:imum)?\s*:?\s*|jusqu[^\w]?[àa]\s*|moins\s+de\s*|environ\s*|vers\s*|pas\s+plus\s+(?:de|que)\s*|au(?:tour|x?environs?)?\s+de\s*)(\d{2,5})\s*(?:€|euros?|eur)'
            # Variante "nombre + € + max/maximum/budget" (ex: "1500€ max")
            rev_pattern = r'(\d{2,5})\s*(?:€|euros?|eur)\s*(?:de\s+)?(?:max(?:imum)?|budget|au\s+max)\b'
            
            all_keyword_matches = list(re.finditer(keyword_pattern, all_user_text))
            all_rev_matches = list(re.finditer(rev_pattern, all_user_text))
            
            # Combiner toutes les occurrences
            all_budget_matches = []
            for m in all_keyword_matches:
                all_budget_matches.append((m.start(), int(m.group(1))))
            for m in all_rev_matches:
                all_budget_matches.append((m.start(), int(m.group(1))))
            
            if all_budget_matches:
                # Stratégie : prendre le PLUS HAUT montant (budget MAX)
                # et si plusieurs montants, favoriser le dernier mentionné
                all_budget_matches.sort(key=lambda x: (x[0], x[1]))
                last_mentioned = all_budget_matches[-1][1]
                highest = max(v for _, v in all_budget_matches)
                # Le plus haut des deux : soit le dernier mentionné, soit le plus grand nombre
                profile["budget_max"] = max(last_mentioned, highest)
                logger.info(f"💰 Budget extrait: {profile['budget_max']}€ (dernier={last_mentioned}, plus_haut={highest}, {len(all_budget_matches)} occurence(s))")
        
        if not profile["budget_max"]:
            # 3) Fallback: n'importe quel nombre suivi de € mentionné par l'utilisateur
            all_numbers = re.findall(r'(\d{3,5})\s*(?:€|euros?|eur)', all_user_text)
            if all_numbers:
                n = max(int(x) for x in all_numbers)
                if n < 100000:
                    profile["budget_max"] = n
                    logger.info(f"💰 Budget extrait (fallback nombre): {profile['budget_max']}€")
        elif profile["budget_max"]:
            # 4) Cross-check : si un nombre nu plus élevé avec € existe, le prendre (ex: "500€ max -> 1500€")
            all_numbers = re.findall(r'(\d{3,5})\s*(?:€|euros?|eur)', all_user_text)
            if all_numbers:
                max_naked = max(int(x) for x in all_numbers)
                if max_naked > profile["budget_max"] and max_naked < 100000:
                    old_budget = profile["budget_max"]
                    profile["budget_max"] = max_naked
                    logger.info(f"💰 Budget extrait (cross-check nombre nu): corrigé de {old_budget}€ à {max_naked}€")

        # Query DB
        products = await query_db(profile)
        if products:
            ranked = await rank_with_ai(products, profile, chat_history=history)
            enriched = await enrich_recommendations(ranked, supabase)
            final_recs = enriched if enriched else ranked
            result_id = generate_result_id()
            await save_result(result_id, profile, final_recs, supabase)

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
    reply = await chat_with_deepseek(history, exchange_count=exchange_count)
    return ChatResponse(reply=reply, done=False)


# ─── Accessory chat endpoint ────────────────────────────────

ACCESSORY_SYSTEM_PROMPT = """# IDENTITÉ — CONSEILLER ACCESSOIRES TROVIIO

Tu es l'expert accessoires de Troviio. Tu aides les gens à trouver LE bon accessoire pour leur appareil.

Ton rôle : identifier précisément l'appareil, comprendre l'usage réel, et recommander l'accessoire adapté — pas le plus cher, le plus compatible.

# RÈGLES DE FORMAT — IMPORTANT

Chaque réponse DOIT se terminer par **exactement 3 options numérotées** comme ceci :

1. [Option 1]
2. [Option 2]
3. [Option 3]

# FLOW

1. **D'abord, identifie l'appareil et le besoin.** Demande modèle exact et type d'accessoire.
   Options : 3 types d'usage ou accessoires courants.

2. **Puis, confirme et lance la recherche.**
   La 3e option DOIT être : 🚀 Lancer la recherche — accéder aux accessoires

3. **Si l'utilisateur choisit "Lancer la recherche", la recherche est automatique.**

# CONTRAINTES

- Toujours terminer par 3 options numérotées 1. / 2. / 3.
- Maximum 2 tours de questions, puis proposer "Lancer la recherche"
- 2-3 phrases max par message (concis)
- Options courtes et actionnables
- Ne jamais répondre en texte brut sans options
"""

@router.post("/chat/accessories", response_model=ChatResponse)
async def chat_accessories(req: AccessoryChatRequest, request: Request):
    """Chat IA dédié aux accessoires — avec recherche produits + liens Amazon."""
    client_ip = request.client.host if request.client else "unknown"
    try:
        await enforce_chat_rate_limit(request)
    except HTTPException:
        return ChatResponse(reply="⏳ Trop de messages d'un coup ! Prends une inspiration et réessaie dans quelques secondes.")
    except Exception:
        pass  # Redis down — pas de blocage

    history = req.history or []
    context = ""
    
    # Détection des mots-clés de lancement
    msg_lower = req.message.lower().strip()
    exchange_count = sum(1 for m in history if m["role"] == "user") + 1
    
    # VÉRIFICATION STRICTE : minimum 5 tours pour les accessoires aussi
    user_wants_search = any(t in msg_lower for t in LAUNCH_TRIGGERS) and exchange_count >= 5
    
    # Device name optionnel — sinon on le déduit du premier message utilisateur
    device_name = req.device_name or ""
    if not device_name:
        for m in history:
            if m.get("role") == "user" and m.get("content"):
                device_name = m["content"].strip()
                break
    
    if device_name:
        context = f"L'appareil de l'utilisateur : {device_name} (catégorie : {req.category or 'non spécifiée'})"
    if context:
        history = [{"role": "system", "content": context}] + history

    history.append({"role": "user", "content": req.message})

    # Lancement de la recherche : 5 tours min, puis GO
    if user_wants_search or exchange_count >= 7:
        cat = req.category or device_name or ""
        device = device_name or cat
        
        profile = {
            "categorie": cat,
            "budget_max": None,
            "criteres": [f"accessoire pour {device}" if device else "accessoires"],
            "resume": f"Accessoires pour {device}" if device else "Recherche d'accessoires",
        }
        
        # Chercher dans la catégorie de l'appareil (les accessoires sont dans la même catégorie)
        products = await query_db(profile)
        if not products:
            # Fallback : chercher sans catégorie — MAIS on limite aux ~15 meilleurs scores généraux
            profile["categorie"] = ""
            products = await query_db(profile)
            if products:
                # Si on a des produits sans filtre catégorie, on garde uniquement ceux du chat principal
                # pour éviter les recommandations hors-sujet (cartouches d'encre pour aspirateur)
                logger.info(f"⚠️ Accessoire sans catégorie trouvée — {len(products)} produits génériques retournés")
        
        if products:
            ranked = await rank_with_ai(products, profile, chat_history=history)
            enriched = await enrich_recommendations(ranked, supabase)
            final_recs = enriched if enriched else ranked
            result_id = generate_result_id()
            await save_result(result_id, profile, final_recs, supabase)

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
                reply="Je n'ai pas trouvé d'accessoires compatibles dans ma base. Essaie avec un autre modèle ou un type d'accessoire différent.",
                done=False
            )

    # Sinon, continuer la conversation normale avec DeepSeek
    reply = await chat_with_deepseek(history, exchange_count=exchange_count, system_override=ACCESSORY_SYSTEM_PROMPT)
    return ChatResponse(reply=reply, done=False)

"""
PICKSY — Routes Chat IA
Flow : entretien → profil → requête Supabase (v_products_published) → ranking IA → recommandations
"""

import os, json, logging, re
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
    "aspirateur robot laveur": "aspirateur-laveur",
    "aspirateur-laveur": "aspirateur-laveur",
    "aspirateur robot": "aspirateur-robot",
    "robot aspirateur": "aspirateur-robot",
    "aspirateur-robot": "aspirateur-robot",
    "aspirateur balai": "aspirateur-balai",
    "aspirateur-balai": "aspirateur-balai",
    "laveur aspirateur": "aspirateur-laveur",
    "aspirateur laveur": "aspirateur-laveur",
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
    "lave linge sechant": "lave-linge",
    "lave-linge sechant": "lave-linge",
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
    "air fryer": "friteuse-air",
    "four micro-ondes": "four-micro-ondes",
    "four micro ondes": "four-micro-ondes",
    "micro-onde": "four-micro-ondes",
    "micro onde": "four-micro-ondes",
    "four encastrable": "four-encastrable",
    "four-encastrable": "four-encastrable",
    "four pyrolyse": "four-encastrable",
    "siemens four": "four-encastrable",
    "bosch four": "four-encastrable",
    "neff four": "four-encastrable",
    "miele four": "four-encastrable",
    "samsung four": "four-encastrable",
    "aeg four": "four-encastrable",
    "electrolux four": "four-encastrable",
    "hisense four": "four-encastrable",
    "whirlpool four": "four-encastrable",
    "smeg four": "four-encastrable",
    "four vapeur": "four-encastrable",
    "lave-linge": "lave-linge",
    "lave linge": "lave-linge",
    "lave-vaisselle": "lave-vaisselle",
    "lave vaisselle": "lave-vaisselle",
    "montre connectee": "montre-connectee",
    "montre connectée": "montre-connectee",
    "smart watch": "montre-connectee",
    "smartwatch": "montre-connectee",
    "apple watch": "montre-connectee",
    "garmin": "montre-connectee",
    "tablette tactile": "tablette",
    "station charge": "station-charge-usb-c",
    "station usb": "station-charge-usb-c",
    "chargeur usb": "station-charge-usb-c",
    "chargeur gan": "station-charge-usb-c",
    "multiprise usb": "station-charge-usb-c",
    "hub usb": "station-charge-usb-c",
    "onduleur ups": "onduleur-ups",
    "onduleur": "onduleur-ups",
    "ups onduleur": "onduleur-ups",
    "climatiseur mobile": "climatiseur-portable",
    "climatiseur portable": "climatiseur-portable",
    "climatiseur": "climatiseur-portable",
    "clim portable": "climatiseur-portable",
    "ventilateur colonne": "ventilateur-colonne",
    "ventilateur-colonne": "ventilateur-colonne",
    "ventilateur brumisateur": "ventilateur-colonne",
    "purificateur air": "purificateur-air",
    "purificateur d air": "purificateur-air",
    "purificateur d'air": "purificateur-air",
    "robot cuisine": "robot-cuisine",
    "robot-cuisine": "robot-cuisine",
    "robot patissier": "robot-cuisine",
    "robot pâtissier": "robot-cuisine",
    "thermomix": "robot-cuisine",
    "cook expert": "robot-cuisine",
    "manette switch": "manette-switch",
    "manette nintendo": "manette-switch",
    "manette ps5": "manette-switch",
    "manette xbox": "manette-switch",
    "manette pro": "manette-switch",
    "jeu cooperatif": "jeu-coop-local",
    "jeu coop": "jeu-coop-local",
    "jeu co-op": "jeu-coop-local",
    "jeu video coop": "jeu-coop-local",
    "split fiction": "jeu-coop-local",
    "it takes two": "jeu-coop-local",
    "overcooked": "jeu-coop-local",
    "jeu ps5": "jeu-coop-local",
    "camera securite": "camera-securite",
    "camera surveillance": "camera-securite",
    "camera exterieur": "camera-securite",
    "camera interieur": "camera-securite",
    "camera wifi": "camera-securite",
    "caméra": "camera-securite",
    "camera": "camera-securite",
    "thermostat connecte": "thermostat-connecte",
    "thermostat intelligent": "thermostat-connecte",
    "thermostat": "thermostat-connecte",
    "netatmo": "thermostat-connecte",
    "tado": "thermostat-connecte",
    "voiture electrique": "voiture-electrique",
    "voiture électrique": "voiture-electrique",
    "vehicule electrique": "voiture-electrique",
    "tesla": "voiture-electrique",
    "renault": "voiture-electrique",
    "trottinette electrique": "trottinette",
    "trottinette électrique": "trottinette",
    "velo electrique": "velo-electrique",
    "vélo électrique": "velo-electrique",
    "velo": "velo-electrique",
    # Clés courtes en dernier
    "aspirateur": "aspirateur-robot",
    "poils": "aspirateur-robot",
    "poil": "aspirateur-robot",
    "animal": "aspirateur-robot",
    "animaux": "aspirateur-robot",
    "chien": "aspirateur-robot",
    "chat": "aspirateur-robot",
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
    "four encastrable": "four-encastrable",
    "four-encastrable": "four-encastrable",
    "four pyrolyse": "four-encastrable",
    "siemens four": "four-encastrable",
    "bosch four": "four-encastrable",
    "neff four": "four-encastrable",
    "miele four": "four-encastrable",
    "samsung four": "four-encastrable",
    "aeg four": "four-encastrable",
    "electrolux four": "four-encastrable",
    "hisense four": "four-encastrable",
    "whirlpool four": "four-encastrable",
    "smeg four": "four-encastrable",
    "four vapeur": "four-encastrable",
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
    "pc gamer portable": "laptop-gamer",
    "pc gamer": "laptop-gamer",
    "gamer": "laptop-gamer",
    "rtx": "laptop-gamer",
    "ordinateur": "ordinateur-portable",
    "laptop": "ordinateur-portable",
    "macbook": "ordinateur-portable",
    "étudiant": "ordinateur-portable",
    "etudiant": "ordinateur-portable",
    "poussette": "poussette",
    "landau": "poussette",
    "caveau": "cave-a-vin",
    "purificateur": "purificateur-air",
    "purif": "purificateur-air",
    "qualité air": "purificateur-air",
    "mixeur": "robot-cuisine",
    "trottinette": "trottinette",
    "scooter": "trottinette",
    "vae": "velo-electrique",
    "ebike": "velo-electrique",
    "e bike": "velo-electrique",
    "bike": "velo-electrique",
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
    all_user_text = " ".join(unidecode(m["content"].lower()) for m in history if m.get("role") == "user")
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

# FLOW STRICT — QUESTIONS UNE À UNE AVEC 3 OPTIONS CLIQUABLES

## RÈGLE ABSOLUE : UNE SEULE QUESTION PAR MESSAGE

Tu DOIS poser EXACTEMENT UNE question par message. JAMAIS DEUX. JAMAIS TROIS.
Chaque message DOIT contenir :
- 1 phrase d'intro empathique (1 ligne max)
- 1 question
- 3 options numérotées comme ceci :

1. Option A
2. Option B
3. Option C

Les options DOIVENT être courtes (2-6 mots max) — ce sont des chips cliquables dans l'UI.
Si l'option est trop longue, elle ne rentre pas dans l'interface.

## INTERDICTIONS STRICTES :
- ❌ JAMAIS 2 questions dans le même message
- ❌ JAMAIS 3 questions groupées
- ❌ JAMAIS plus de 3 phrases d'explication avant les options
- ❌ Pas de liste de questions dans une seule phrase
- ✅ UNE SEULE question → 3 chips courtes

## Ordre des questions :
1. Contexte logement/usage (lieu, taille, pièce) → 3 chips
2. Type de sol ou environnement → 3 chips  
3. Budget (petit, moyen, premium) → 3 chips
4. Usage spécifique (quoi, quand, comment) → 3 chips
5. Priorité finale → 3 chips
6-10. Affinage : marques, fonctionnalités, bruit, design → TOUJOURS 1 question + 3 chips

## Règle de lancement :
Tours 1-4 : uniquement 3 options d'affinage, PAS de bouton lancement.
Tours 5-11 : 3 options d'affinage + 1 option "🚀 Lancer la recherche".
Après 12 tours : recherche automatique.

# RÈGLES DE COMPORTEMENT

1. Empathie d'abord. Valide toujours l'emotion.
2. Pas de jargon technique brut. Traduis avec des analogies de la vraie vie.
3. Humour leger. Pas de monologue.
4. Concise. 2-4 phrases max par message.
5. Une seule question a la fois. Toujours finir par les 3 options numerotees.
6. Si le client ecrit sa propre reponse (au lieu de cliquer sur une option) : rebondis PRIORITAIREMENT sur ce qu'il a ecrit. Extrais les infos (budget, usage, lieu, etc.) de son texte et enchaîne la question suivante en tenant compte de ses reponses. Ne l'ignore pas, ne lui repose pas la meme question — il a deja repondu, meme si ce n'est pas dans les 3 options.
7. Tu DOIS lire et analyser le message du client avant de repondre. S'il dit \"j'ai 3 enfants et un chien\", prends-le en compte pour les questions suivantes, ne lui repose pas \"tu as des animaux ?\".
8. Rebond creatif : Si le client raconte quelque chose (son logement, ses contraintes, une anecdote), integre-le dans la prochaine question. Ca rend la conversation naturelle.

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

## Ventilateurs colonne

- "Tu veux rafraîchir ou juste brasser l'air ?" → Climatisation vs ventilation
- "Surface de la pièce : petit cube urbain, salon normal, ou open-space ?" → Débit
- "Le bruit, c'est juste pour dormir ou tu supportes le bruit de fond ?" → Silence
- "Filtre à air pour les allergiques ou juste du vent tout court ?" → Purification
- "Tu vas le déplacer souvent ou il a sa place attitrée ?" → Mobilité

## Climatiseurs portables

- "Surface à refroidir : une chambre, un studio, ou tout l'étage ?" → BTU
- "Tu as une fenêtre adaptable pour la gaine, ou installation compliquée ?" → Installation
- "Juste froid ou réversible pour l'hiver aussi ?" → Chaud/froid
- "Budget climatisation : petit coup de frais ou vrai refroidissement ?" → Budget
- "Tu es prêt à entendre le compresseur ou silence absolu exigé ?" → Bruit

## Stations charge USB-C

- "Combien d'appareils tu branches chaque soir : un laptop ou toute la tribu numérique ?" → Nombre ports
- "Tu charges surtout en bureau sédentaire ou en mode nomade ?" → Usage
- "Puissance nécessaire : simple recharge rapide ou alimentation de laptop costaud ?" → Wattage
- "Apple, PC, ou mix des deux dans ton écosystème ?" → Compatibilité
- "Support de bureau intégré ou tu préfères un bloc compact à emporter ?" → Format

## Onduleurs UPS

- "Quels équipements critiques : box/routeur, NAS, PC gaming ou serveur de télétravail ?" → Usage
- "Durée de coupure à encaisser : le temps de sauvegarder, ou continuer à bosser 30 min ?" → Autonomie
- "Tu as besoin de supervision logicielle ou du simple débranchement forcé propre ?" → Gestion
- "Format : dans un rack, sous le bureau, ou près de la box dans l'entrée ?" → Encombrement
- "Budget : protection minimale ou blindage total contre les orages ?" → Budget

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

- Longueur : Maximum 4-5 phrases par bulle. Plus court sur mobile.
- Structure : Intro prose courte (1-2 phrases) → question ou CTA pour relancer
- Fin de message : Toujours terminer par une question ouverte ou un choix a faire.

# INTERDICTION ABSOLUE : JAMAIS DE RECOMMANDATION PRODUIT DANS LE CHAT

NE JAMAIS mentionner de nom de produit, modele, marque, ou lien dans le chat.
NE JAMAIS proposer de choix entre 2 ou 3 produits dans le chat.
NE JAMAIS envoyer de lien Amazon ou autre lien commercial dans le chat.
NE JAMAIS faire de classement ou comparaison de produits dans le chat.

Le seul moment ou les recommandations apparaissent, c'est sur la page resultat dediee, apres que la recherche soit lancee via le bouton "Lancer la recherche".

Ton role dans le chat est UNIQUEMENT de poser des questions pour comprendre le profil et les besoins.
Une fois le profil assez precis, tu affiches l'option "Lancer la recherche".
Les resultats seront affiches sur une page apart. Ne les annonce pas et ne les decris pas dans le chat.

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
        
        # Filtrer par budget — price_eur est en euros (pas en centimes)
        if budget:
            q = q.lte("price_eur", int(budget))
        
        # Nota: on n'exclut PAS les produits sans ASIN — la qualité de réponse prime
        # sur le lien affilié. Les marchands non-Amazon auront leur propre lien.
        
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

CRITICAL: The product list below contains items from a SINGLE category. NEVER recommend products from different categories. ALL 3 recommendations MUST be from the provided list.

CRITICAL: Use the EXACT brand and name as provided. Do NOT repeat the brand multiple times in the name field.

CRITICAL: You MUST ONLY recommend products from the list provided below. Do NOT invent or suggest any product that is not in the list. If the user asks about a specific product, ONLY recommend it if it appears in the list.

TROVIIO SCORE EXPLANATION — Tu dois donner un troviio_explanation (1-2 phrases) qui explique POURQUOI ce produit matche avec le profil du client. C'est notre signature : une raison personnalisée, piquante, avec du charisme. Pas générique. Ex: 'Ton appart de 40m² ne justifie pas un aspirateur de chantier, mais ce modèle est taqué pour les poils de chat — taquinerie assumée.'

Le score technique (score sur 10) est une note classique de performance et qualité du produit. C'est indépendant du profil client.

TROVIIO TONE — Le ton doit être celui d'un pote un peu cynique qui te dit la vérité en face. On veut faire sourire, déclencher un petit rire. Utilise des métaphores, des références pop culture, des comparaisons absurdes mais justes. Pas de blagues forcées non plus — l'humour doit servir le conseil.

Exemples de ton pour t'inspirer (ne les recopie pas, trouve tes propres formulations) :
- \"C'est le genre de produit qui rendrait même un moine bouddhiste un peu matérialiste.\"
- \"Aussi silencieux qu'un espion dans un film d'espionnage. Aussi efficace qu'un ninja avec un balai.\"
- \"Le meilleur rapport qualité/prix depuis que quelqu'un a inventé la roue.\"
- \"Passe de 'j'ai un aspirateur' à 'j'ai un pote qui aspire pour moi' – niveau confort.\"
- \"Si ce produit était un film, ce serait un classique que tu regardes en boucle.\"

why_perfect doit être une petite histoire de 3-4 phrases qui fait référence aux besoins précis du client. Pas une liste de specs. On veut que le client se dise 'putain, oui, c'est exactement ça'.

why_caution doit être honnête, mais pas comme un robot : avec des métaphores, du second degré. Ex: 'Ce modèle aspire comme un champion mais il est plus bruyant qu'un groupe de métal dans un ascenseur' ou 'La batterie tient 3h – assez pour une maison de 200m², pas assez pour celle de ta mère'.

troviio_explanation (1-2 phrases max) : une raison personnalisée, piquante, qui explique POURQUOI ce produit est fait pour ce client. Avec du charisme. Pas générique.

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
      \"score\": 8.5,
      \"troviio_explanation\": \"1-2 phrases en français qui expliquent POURQUOI ce produit est fait pour ce client. Personnalisé, avec une touche d'humour et de franchise.\",
      \"price_range\": \"500€\"
    }
  ]
}

STRICT RULES:
- rank_label: "Meilleur choix" | "Meilleur rapport qualite/prix" | "Option premium"
- score: between 0 and 10 (note technique classique du produit, basée sur ses specs et qualité)
- troviio_explanation: obligatoire, en français, personnalisée, humoristique, max 2 phrases
- IMPORTANT: Ne PAS inclure troviio_score dans le JSON. Le troviio_score est calculé côté serveur.
- Output ONLY the JSON object. No markdown, no explanation, no preamble.
- recommendations must contain exactly 3 items.
- why_perfect MUST reference the user's specific needs from the profile.
- why_caution: MUST always be a meaningful, specific caveat. Never empty. If the product is perfect, at least mention a relevant edge case or compatibility consideration. The tone should be honest, slightly humorous, not generic.
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
        valid_names_list = []  # pour substring matching
        for p in products:
            bn = unidecode(p.get('brand','').lower().strip())
            nm = unidecode(p.get('name','').lower().strip())
            valid_names.add(f"{bn} {nm}")
            valid_names.add(nm)
            valid_names_list.append((bn, nm))
        
        filtered_recs = []
        for r in recs:
            r_brand = unidecode(r.get('brand','').lower().strip())
            r_name = unidecode(r.get('name','').lower().strip())
            lookup = f"{r_brand} {r_name}"
            # Vérifier si le nom complet ou juste le nom correspond à un produit connu
            is_valid = lookup in valid_names or r_name in valid_names
            # Fallback flexible: le nom AI peut être un sous-ensemble du nom DB
            # (ex: DB a "SAMSUNG AX9500...", AI retourne "AX9500...")
            if not is_valid:
                for db_bn, db_nm in valid_names_list:
                    # Vérifier si le nom AI est contenu dans le nom DB (après retrait de la marque DB)
                    clean_db_name = db_nm.replace(db_bn, '', 1).strip()
                    if r_name and (r_name in db_nm or r_name in clean_db_name):
                        is_valid = True
                        break
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
    base_prompt = SYSTEM_PROMPT
    if system_override and not system_override.startswith("#"):
        # C'est un contexte catégorie, pas un remplacement complet
        cat_context = system_override
    else:
        cat_context = ""
    tour_note = f"\n\n[C'EST LE TOUR {exchange_count}. Tu DOIS proposer '🚀 Lancer la recherche' comme 4e option (après 3 questions d'affinage) À PARTIR du tour 5. Avant le tour 5, tes 3 options sont UNIQUEMENT des questions d'affinage, sans option de lancement.]{cat_context}"
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
        
        # POST-TRAITEMENT : forcer UNE seule question si DeepSeek en envoie plusieurs
        lines = raw.strip().split('\n')
        question_count = 0
        clean_lines = []
        found_first_options = False
        for line in lines:
            stripped = line.strip()
            # Détecter les questions (phrases se terminant par ?)
            if stripped.endswith('?') and not stripped.startswith(('1.', '2.', '3.', '4.')):
                question_count += 1
                if question_count > 1 and not found_first_options:
                    # On a trouvé une 2ème question avant les options de la 1ère — ignorer
                    continue
            
            # Détecter le début des options numérotées
            if re.match(r'^\d+\.\s', stripped):
                found_first_options = True
                clean_lines.append(stripped)
            elif not found_first_options:
                clean_lines.append(stripped)
            elif found_first_options and not re.match(r'^\d+\.\s', stripped):
                # Après les options, on arrête (sauf si c'est une autre option ou l'option "Lancer")
                if re.match(r'^4\\.\s*🚀|🚀', stripped):
                    clean_lines.append(stripped)
                continue
        
        raw = '\n'.join(clean_lines).strip()
        return raw
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

@router.post("", response_model=ChatResponse)
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

    # Détecter la catégorie DÈS LE PREMIER message pour l'injecter dans le system prompt
    detected_cat = req.category or ""
    if not detected_cat and len(history) == 0:
        # Premier message utilisateur — on extrait la catégorie immédiatement
        detected_cat = await detect_category_from_history([
            {"role": "user", "content": req.message}
        ])
        logger.info(f"🔍 [chat] Catégorie détectée au premier message: '{detected_cat}'")

    # Compter les échanges utilisateur (messages déjà envoyés + celui-ci)
    exchange_count = sum(1 for m in history if m["role"] == "user") + 1

    # Ajouter le message utilisateur à l'historique
    history.append({"role": "user", "content": req.message})

    # Détection \"lance\" dans le message
    msg_lower = req.message.lower().strip()
    
    # Mots qui déclenchent une recherche immédiate
    # VÉRIFICATION STRICTE : minimum 5 échanges (tour 5+) avant de pouvoir lancer
    # Tours 1-4 : pas de lancement possible même si l'utilisateur tape "recherche"
    user_wants_search = any(t in msg_lower for t in LAUNCH_TRIGGERS) and exchange_count >= 5
    
    # Auto-trigger APRÈS 12 tours complets (SYSTEM_PROMPT: "Après 12 tours : recherche automatique")
    force_search = (exchange_count >= 12 or user_wants_search) and exchange_count >= 2

    if force_search:
        logger.info(f"🚀 force_search=True (exchange_count={exchange_count}, user_wants_search={user_wants_search})")
        # Détecter la catégorie depuis l'historique via DeepSeek si non fournie
        detected_cat = req.category
        if not detected_cat:
            detected_cat = await detect_category_from_history(history)
        
        # IMPORTANT: en priorité, utiliser le chip cliqué s'il y a une catégorie explicite
        # qui arrive AVEC le message (pas besoin de detect_category dans ce cas)
        logger.info(f"🔍 Catégorie détectée: detected_cat='{detected_cat}', req.category='{req.category}'")

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
        
        # 3) Fallback: si l'utilisateur a explicitement mentionné un mot-clé budget ET un nombre avec €
        #    Ne pas fixer de budget_max si le mot "budget" apparaît seul sans montant,
        #    ou si un nombre avec € apparaît dans un contexte non-budget (ex: "j'ai vu un produit à 800€" sans contexte budget)
        if not profile["budget_max"]:
            has_budget_keyword = bool(re.search(r'\bbudget\b|\bmax\b|\bmaximum\b|jusqu.?(?:a|à)\b|moins\s+de|pas\s+plus\s+(?:de|que)', all_user_text))
            if has_budget_keyword:
                all_numbers = re.findall(r'(\d{3,5})\s*(?:€|euros?|eur)', all_user_text)
                if all_numbers:
                    n = max(int(x) for x in all_numbers)
                    if n < 100000:
                        profile["budget_max"] = n
                        logger.info(f"💰 Budget extrait (fallback avec mot-clé): {profile['budget_max']}€")
        if profile["budget_max"]:
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
            enriched = await enrich_recommendations(ranked, supabase, profile)
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
    # Injecter la catégorie détectée dans le system prompt pour des questions plus pertinentes
    cat_context = ""
    if detected_cat:
        cat_names = {
            "aspirateur-robot": "aspirateur robot",
            "aspirateur-balai": "aspirateur balai",
            "lave-linge": "lave-linge",
            "lave-vaisselle": "lave-vaisselle",
            "refrigerateur": "réfrigérateur",
            "four-micro-ondes": "four/micro-ondes",
            "machine-a-cafe": "machine à café",
            "robot-cuisine": "robot cuisine",
            "cave-a-vin": "cave à vin",
            "friteuse-air": "friteuse à air",
            "purificateur-air": "purificateur d'air",
            "climatiseur-portable": "climatiseur portable",
            "ventilateur-colonne": "ventilateur colonne",
            "tv": "TV",
            "casque-audio": "casque audio",
            "enceinte-bt": "enceinte Bluetooth",
            "smartphone": "smartphone",
            "tablette": "tablette",
            "laptop-gamer": "laptop gamer",
            "ordinateur-portable": "ordinateur portable",
            "imprimante": "imprimante",
            "barre-de-son": "barre de son",
            "camera-securite": "caméra de sécurité",
            "thermostat-connecte": "thermostat connecté",
            "station-charge-usb-c": "station de charge USB-C",
            "onduleur-ups": "onduleur UPS",
            "velo-electrique": "vélo électrique",
            "trottinette": "trottinette",
            "voiture-electrique": "voiture électrique",
            "montre-connectee": "montre connectée",
            "poussette": "poussette",
            "matelas": "matelas",
            "manette-switch": "manette Switch",
            "jeu-coop-local": "jeu coopératif local",
            "aspirateur-laveur": "aspirateur laveur",
        }
        cat_label = cat_names.get(detected_cat, detected_cat)
        cat_context = f"\n\n[CONTEXTE CATÉGORIE DÉTECTÉE : {cat_label}. Le client cherche un(e) {cat_label}. Utilise cette info pour poser des questions ultra-pertinentes dès le départ.]"
    
    reply = await chat_with_deepseek(history, exchange_count=exchange_count, system_override=cat_context if cat_context else None)
    return ChatResponse(reply=reply, done=False)


# ─── Accessory chat endpoint ────────────────────────────────

ACCESSORY_SYSTEM_PROMPT = """# IDENTITÉ — CONSEILLER ACCESSOIRES TROVIIO

Tu es l'expert accessoires de Troviio. Tu aides les gens à trouver LE bon accessoire pour leur appareil.

Ton rôle : identifier précisément l'appareil, comprendre l'usage réel, et recommander l'accessoire adapté — pas le plus cher, le plus compatible.

# RÈGLES DE FORMAT — IMPORTANT

Chaque réponse DOIT se terminer par **exactement 3 options numérotées avec lien Amazon** comme ceci :

1. 🔌 [Nom accessoire] — [raison courte] → [lien Amazon avec tag troviio-21]
2. 🔧 [Nom accessoire] — [raison courte] → [lien Amazon avec tag troviio-21]
3. 🚀 Lancer la recherche — accéder à tous les accessoires

Les liens Amazon doivent être au format : https://www.amazon.fr/s?k=MARQUE+APPAREIL+ACCESSOIRE&tag=troviio-21
Le lien doit contenir la marque + modèle de l'appareil ET le nom de l'accessoire pour que la recherche Amazon soit pertinente.

# FLOW

1. **D'abord, identifie l'appareil et le besoin.** Demande modèle exact et type d'accessoire.
   Options : 3 types d'usage ou accessoires courants, CHACUN avec un lien Amazon.

2. **Puis, confirme et lance la recherche.**
   La 3e option DOIT être : 🚀 Lancer la recherche — accéder aux accessoires

3. **Si l'utilisateur choisit "Lancer la recherche", la recherche est automatique.**

# RÈGLES DE RECOMMANDATION

- Ne JAMAIS donner de prix chiffré. L'utilisateur clique sur le lien Amazon pour voir le prix.
- Les accessoires recommandés doivent être COMPATIBLES avec le modèle exact.
- Le lien Amazon doit être une recherche qui trouvera VRAIMENT l'accessoire (ex: "https://www.amazon.fr/s?k=Thermomix+TM6+spatule&tag=troviio-21").
- Si tu n'es pas sûr du modèle exact, propose une recherche générique (ex: "https://www.amazon.fr/s?k=Thermomix+accessoire&tag=troviio-21").

# CONTRAINTES

- Toujours terminer par 3 options numérotées 1. / 2. / 3.
- Maximum 2 tours de questions, puis proposer "Lancer la recherche"
- 2-3 phrases max par message (concis)
- Options courtes et actionnables
- Ne jamais répondre en texte brut sans options
"""

@router.post("/accessories", response_model=ChatResponse)
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
            enriched = await enrich_recommendations(ranked, supabase, profile)
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

"""
PICKSY — Routes Chat IA
Logique : l'IA mène l'entretien, pose les bonnes questions, et propose une porte de sortie après 3 échanges.
"""

import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from openai import AsyncOpenAI

router = APIRouter()

client = AsyncOpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1",
)

SYSTEM_PROMPT = """Tu es Picksy, un conseiller produit expert et bienveillant.
Ton rôle : mener un entretien de découverte rapide pour trouver le produit PARFAIT, puis lancer la recherche.

DOMAINES COUVERTS UNIQUEMENT :
- Robots aspirateurs / aspirateurs
- Machines à café / expresso / capsules
- TV / écrans OLED, QLED, 4K
- Lave-linge, lave-vaisselle, réfrigérateurs
- Casques audio, écouteurs
- Smartphones et tablettes
- Ordinateurs portables

RÈGLES ABSOLUES :
1. Si la demande est hors domaine → réponds UNIQUEMENT : "Je suis spécialisé dans les produits maison et tech. Pose-moi une question sur un aspirateur, une machine à café, une TV... 😊"
2. Ne réponds JAMAIS à des questions sur la météo, la politique, la santé, la cuisine, le sport, les voyages, la programmation, etc.
3. TU MÈNES L'ENTRETIEN — c'est toi qui poses les questions, pas l'utilisateur.
4. Une seule question à la fois, courte, avec 2-4 options entre parenthèses pour faciliter la réponse.
5. Ton chaleureux, direct, comme un ami expert.

PROCESSUS EN 3 ÉTAPES :

ÉTAPE 1 — IDENTIFIER LA CATÉGORIE (message 1) :
- Si la catégorie est claire, passe directement à l'étape 2.
- Sinon demande de préciser.

ÉTAPE 2 — QUESTIONS DE DÉCOUVERTE (messages 2-3) :
Pose les questions LES PLUS IMPORTANTES pour cette catégorie dans cet ordre :

Robot aspirateur → 1) Type de sol ? 2) Animaux / surface ?
Machine à café → 1) Type de café préféré ? 2) Usage (seul, famille, bureau) ?
TV → 1) Taille de la pièce / distance ? 2) Usage principal (films, gaming, sport) ?
Audio → 1) Usage (maison, transport, sport) ? 2) Isolation souhaitée ?
Smartphone → 1) Écosystème actuel ? 2) Usage dominant ?
Laptop → 1) Usage (études, travail, gaming, créatif) ? 2) OS préféré ?
Électroménager → 1) Capacité / taille logement ? 2) Contrainte spécifique ?

TOUJOURS demander le budget si pas mentionné (< 200€ / 200-400€ / > 400€ adapté à la catégorie).

ÉTAPE 3 — PORTE DE SORTIE (après 3 échanges minimum) :
Propose systématiquement :
"J'ai ce qu'il me faut pour te trouver les meilleurs produits 🎯
👉 **[Lancer la recherche pour moi]** — ou dis-moi si tu veux préciser autre chose."

Quand l'utilisateur clique sur lancer ou dit oui/go/ok → réponds avec ce JSON EXACT (et SEULEMENT ce JSON, rien d'autre) :

{"action": "search", "profile": {"categorie": "...", "budget": "...", "criteres": ["...", "..."], "resume": "..."}}

IMPORTANT : après 3 questions/réponses, TOUJOURS proposer la porte de sortie même si tu n'as pas toutes les infos."""

HORS_SCOPE_RESPONSE = "Je suis spécialisé dans les produits maison et tech. Pose-moi une question sur un aspirateur, une machine à café, une TV... 😊"

HORS_SCOPE_KEYWORDS = [
    "météo", "recette", "cuisine", "politique", "médecin", "santé", "symptôme",
    "voiture", "moto", "voyage", "avion", "hôtel", "code", "programme", "javascript",
    "python", "sport", "football", "résultat", "match", "bourse", "crypto", "bitcoin",
    "amour", "relation", "divorce", "blague", "histoire",
]


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
    action: str = None
    profile: dict = None


@router.post("/", response_model=ChatResponse)
@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    msg_lower = req.message.lower()

    # Guardrail hors-scope
    if any(kw in msg_lower for kw in HORS_SCOPE_KEYWORDS):
        return ChatResponse(reply=HORS_SCOPE_RESPONSE, is_scope=False)

    # Construire l'historique complet
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for m in req.history:
        messages.append({"role": m.role, "content": m.content})
    messages.append({"role": "user", "content": req.message})

    response = await client.chat.completions.create(
        model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
        messages=messages,
        max_tokens=600,
        temperature=0.7,
    )

    reply = response.choices[0].message.content.strip()

    # Détecter si l'IA a généré un profil de recherche JSON
    action = None
    profile = None
    if reply.startswith("{") and '"action"' in reply and '"search"' in reply:
        try:
            data = json.loads(reply)
            if data.get("action") == "search":
                action = "search"
                profile = data.get("profile", {})
                reply = f"✅ Parfait ! Je lance la recherche pour toi...\n\n🔍 **Profil détecté :** {profile.get('resume', '')}"
        except json.JSONDecodeError:
            pass

    return ChatResponse(reply=reply, is_scope=True, action=action, profile=profile)

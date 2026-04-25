"""
PICKSY — Service de Chat IA (coeur du produit)
Fichier : backend/app/services/chat_service.py

Ce service gère la découverte des besoins utilisateur
et génère les 3 recommandations personnalisées.
"""

import os
import json
from typing import List, Dict, Optional
from openai import AsyncOpenAI  # DeepSeek est compatible OpenAI SDK
from supabase import create_client, Client

# Config DeepSeek (compatible API OpenAI)
deepseek_client = AsyncOpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

# ============================================
# PROMPTS SYSTÈME PAR LANGUE
# ============================================

SYSTEM_PROMPTS = {
    "fr": """Tu es Picksy, un conseiller expert en produits high-tech et électroménager.
Tu es neutre, indépendant, et ton seul objectif est de trouver le produit PARFAIT pour l'utilisateur.

PROCESSUS DE DÉCOUVERTE :
1. Pose des questions courtes et précises pour comprendre le besoin réel (max 4-5 questions)
2. Utilise un ton chaleureux mais direct, comme un ami expert
3. Une question à la fois, jamais plusieurs
4. Mémorise toutes les réponses pour personnaliser la recommandation finale

QUESTIONS DE DÉCOUVERTE TYPES pour {category} :
{discovery_questions}

FORMAT DE RÉPONSE :
- Questions : courtes, conversationnelles, avec 3-4 options suggérées entre parenthèses
- Quand tu as assez d'info (après 3-5 échanges) : génère les recommandations

FORMAT RECOMMANDATIONS (JSON strict) :
{{
  "recommendations": [
    {{
      "rank": 1,
      "type": "meilleur_choix",
      "product_name": "...",
      "brand": "...",
      "why_perfect": "...",
      "pros": ["...", "...", "..."],
      "cons": ["..."],
      "score": 9.2,
      "price_range": "xxx-xxx€"
    }},
    {{
      "rank": 2,
      "type": "meilleur_rapport_qualite_prix",
      ...
    }},
    {{
      "rank": 3,
      "type": "option_premium",
      ...
    }}
  ],
  "needs_summary": "Résumé du profil utilisateur en 1 phrase"
}}""",

    "en": """You are Picksy, an expert advisor for tech and home appliances.
You are neutral, independent, and your only goal is to find the PERFECT product for the user.

DISCOVERY PROCESS:
1. Ask short, precise questions to understand the real need (max 4-5 questions)
2. Use a warm but direct tone, like a knowledgeable friend
3. One question at a time, never multiple
4. Remember all answers to personalize the final recommendation

When you have enough info (after 3-5 exchanges), generate recommendations in the same JSON format.
Always respond in English."""
}

# Questions de découverte par catégorie
DISCOVERY_QUESTIONS = {
    "robot-aspirateur": """
- Type de sol dominant (parquet / carrelage / moquette / mixte) ?
- Animaux de compagnie ? (oui beaucoup / oui peu / non)
- Surface du logement (studio-T2 / T3-T4 / grande maison / multi-niveaux) ?
- Priorité absolue (budget / performance / silencieux / marque connue) ?
- Budget approximatif (<200€ / 200-400€ / 400-700€ / >700€) ?
""",
    "tv-oled": """
- Taille de la pièce et distance de vision (< 3m / 3-4m / > 4m) ?
- Usage principal (films/séries / gaming / sport / polyvalent) ?
- Budget (600-1000€ / 1000-1500€ / 1500-2500€ / >2500€) ?
- Marque déjà dans l'écosystème (Apple / Google / Samsung / peu importe) ?
""",
    "smartphone": """
- Écosystème actuel (iPhone / Android / premier smartphone) ?
- Usage dominant (photo / gaming / travail / réseaux sociaux / polyvalent) ?
- Budget (<300€ / 300-600€ / 600-900€ / >900€) ?
- Autonomie critique ? (oui très important / non) ?
""",
    "ordinateur-etudiant": """
- Filière d'études (informatique/ingénierie / arts/design / lettres/sciences humaines / autre) ?
- OS préféré (macOS / Windows / peu importe) ?
- Portabilité (ultra-léger <1.3kg / compact / performances avant tout) ?
- Budget (<600€ / 600-900€ / 900-1300€ / >1300€) ?
""",
    "machine-cafe": """
- Type de café préféré (espresso / lungo / cappuccino / drip coffee) ?
- Volume (seul / couple / famille / bureau) ?
- Niveau d'implication (automatique totale / semi-auto / manuel acceptable) ?
- Budget (<150€ / 150-300€ / 300-600€ / >600€) ?
"""
}


async def get_discovery_questions(category_slug: str) -> str:
    return DISCOVERY_QUESTIONS.get(category_slug, "- Usage principal ?\n- Budget ?\n- Contraintes spécifiques ?")


async def chat_with_user(
    session_id: str,
    user_message: str,
    messages_history: List[Dict],
    category_slug: str,
    language: str = "fr"
) -> Dict:
    """
    Envoie un message à DeepSeek et retourne la réponse.
    Détecte si l'IA a généré des recommandations finales.
    """
    
    discovery_questions = await get_discovery_questions(category_slug)
    
    system_prompt = SYSTEM_PROMPTS.get(language, SYSTEM_PROMPTS["fr"]).format(
        category=category_slug,
        discovery_questions=discovery_questions
    )
    
    # Construire l'historique de messages
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(messages_history)
    messages.append({"role": "user", "content": user_message})
    
    # Appel DeepSeek
    response = await deepseek_client.chat.completions.create(
        model="deepseek-chat",  # DeepSeek V4
        messages=messages,
        temperature=0.7,
        max_tokens=1500,
        stream=False
    )
    
    assistant_message = response.choices[0].message.content
    
    # Détecter si des recommandations ont été générées
    recommendations = None
    is_completed = False
    
    if '"recommendations"' in assistant_message:
        try:
            # Extraire le JSON des recommandations
            json_start = assistant_message.find('{')
            json_end = assistant_message.rfind('}') + 1
            json_str = assistant_message[json_start:json_end]
            rec_data = json.loads(json_str)
            recommendations = rec_data.get("recommendations", [])
            is_completed = True
        except json.JSONDecodeError:
            pass
    
    # Mettre à jour la session en BDD
    updated_messages = messages_history + [
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": assistant_message}
    ]
    
    supabase.table("chat_sessions").update({
        "messages": updated_messages,
        "is_completed": is_completed
    }).eq("id", session_id).execute()
    
    return {
        "message": assistant_message,
        "is_completed": is_completed,
        "recommendations": recommendations
    }


async def create_chat_session(user_id: str, category_id: str) -> Dict:
    """Crée une nouvelle session de chat"""
    result = supabase.table("chat_sessions").insert({
        "user_id": user_id,
        "category_id": category_id,
        "messages": [],
        "needs_profile": {},
        "is_completed": False
    }).execute()
    
    return result.data[0]

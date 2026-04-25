"""
PICKSY — Routes Chat IA
"""

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import AsyncOpenAI

router = APIRouter()

client = AsyncOpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1",
)

SYSTEM_PROMPT = """Tu es Picksy, un assistant IA expert en produits électroménagers et tech maison.
Tu aides les utilisateurs à trouver le meilleur produit selon leur budget, usage et contraintes.

Catégories disponibles : robots aspirateurs, TV OLED, machines à café.

Règles :
- Réponds UNIQUEMENT sur ces catégories
- Demande le budget et les besoins si pas précisés
- Propose un Top 3 avec des explications claires
- Ton chaleureux et accessible, jamais condescendant
- Langue : français"""

HORS_SCOPE_KEYWORDS = [
    "code", "programme", "politique", "médecin", "santé",
    "recette", "sport", "voiture", "voyage", "finance",
]


class ChatRequest(BaseModel):
    message: str
    user_id: str = "anonymous"


class ChatResponse(BaseModel):
    reply: str
    is_scope: bool


@router.post("/", response_model=ChatResponse)
async def chat(req: ChatRequest):
    # Guardrail simple : vérifier hors-scope
    msg_lower = req.message.lower()
    if any(kw in msg_lower for kw in HORS_SCOPE_KEYWORDS):
        return ChatResponse(
            reply="Je suis spécialisé dans les produits maison — robots aspirateurs, TV OLED et machines à café. Comment puis-je t'aider dans ces catégories ?",
            is_scope=False,
        )

    response = await client.chat.completions.create(
        model=os.getenv("DEEPSEEK_MODEL", "deepseek-v4-flash"),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": req.message},
        ],
        max_tokens=800,
        temperature=0.7,
    )
    return ChatResponse(
        reply=response.choices[0].message.content,
        is_scope=True,
    )

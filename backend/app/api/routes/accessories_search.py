"""
Endpoint POST /api/chat/accessories-search
Chat IA dédié aux accessoires — DeepSeek pose des questions, puis génère 3 accessoires,
sauvegarde dans Supabase et renvoie un result_id comme le chat principal.
"""
import os, json, logging
from fastapi import APIRouter, Request, HTTPException
from openai import AsyncOpenAI
from pydantic import BaseModel
from typing import Optional

from app.core.supabase import get_supabase_admin
from app.services.results_service import generate_result_id, save_result

logger = logging.getLogger("troviio.accessories_search")

router = APIRouter(prefix="/chat", tags=["Chat Accessoires"])

client = AsyncOpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

supabase = get_supabase_admin()

ACCESSORIES_SYSTEM_PROMPT = """# IDENTITÉ — CONSEILLER ACCESSOIRES TROVIIO

Tu es l'expert accessoires de Troviio. Tu aides les gens à trouver LE bon accessoire pour leur appareil.

Ton rôle : identifier précisément l'appareil, comprendre l'usage réel, et recommander l'accessoire adapté — pas le plus cher, le plus compatible.

# RÈGLES DE FORMAT — IMPORTANT

Chaque réponse DOIT se terminer par **exactement 3 options numérotées** comme ceci :

1. [Option 1]
2. [Option 2]
3. [Option 3]

# FLOW — TRÈS COURT (accessoires = besoin immédiat)

1. **Premier message** : Identifie l'appareil et le besoin.
   Demande le modèle exact.
   Options : 3 types d'usage ou accessoires courants.

2. **Deuxième message** : confirme et lance la recherche.
   La 3e option DOIT être : 🚀 Lancer la recherche — accéder aux accessoires

3. **Si l'utilisateur choisit "Lancer la recherche", la recherche est automatique.**

# CONTRAINTES

- Toujours terminer par 3 options numérotées 1. / 2. / 3.
- Maximum 2 tours de questions, puis proposer "Lancer la recherche"
- 2-3 phrases max par message (concis)
- Options courtes et actionnables
- Ne jamais répondre en texte brut sans options"""


LAUNCH_TRIGGERS = {"go", "vas-y", "trouve", "je suis prêt", "je suis prete", "c'est bon", "j'ai assez", "recherche", "ok", "oui", "lance"}

class AccessoryChatRequest(BaseModel):
    message: str
    history: list[dict] = []

class AccessoryChatResponse(BaseModel):
    reply: str = ""
    done: bool = False
    redirect_url: str = ""

@router.post("/accessories-search", response_model=AccessoryChatResponse)
async def accessories_search(req: AccessoryChatRequest, request: Request):
    """Chat IA accessoires — flow questions DeepSeek puis sauvegarde et redirection."""
    history = req.history or []
    history.append({"role": "user", "content": req.message})

    # Compter les échanges utilisateur
    exchange_count = sum(1 for m in history if m["role"] == "user")

    # Détection \"go\" — accessoires : 2 questions max, puis GO
    msg_lower = req.message.lower().strip()
    user_wants_search = any(t in msg_lower for t in LAUNCH_TRIGGERS)
    # Auto-go au tour 3 (2 questions DeepSeek + réponse = 3 exchanges)
    force_search = exchange_count >= 3 or user_wants_search

    if force_search:
        # Extraire le contexte pour le prompt de génération
        user_context = "\n".join(
            f"{'👤' if m['role'] == 'user' else '🤖'}: {m['content']}"
            for m in history if m["content"]
        )

        generation_prompt = f"""# GÉNÉRATION D'ACCESSOIRES

Contexte de la conversation :
{user_context}

À partir de cette conversation, identifie l'appareil exact et ses accessoires.
Retourne UNIQUEMENT du JSON valide selon le format spécifié plus haut (objet avec done, product_name, product_brand, product_category, usage_summary, accessories).

IMPORTANT : 3 accessoires minimum. Prix réalistes. Liens Amazon search avec tag=troviio-21."""

        try:
            resp = await client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": ACCESSORIES_SYSTEM_PROMPT},
                    {"role": "user", "content": generation_prompt},
                ],
                temperature=0.3,
                max_tokens=1000,
                extra_body={"thinking": {"type": "disabled"}},
            )
            raw = resp.choices[0].message.content
            if not raw:
                raw = resp.choices[0].message.model_extra.get("reasoning_content", "")

            # Parser le JSON
            # Nettoyer les éventuels markdown fences
            raw_clean = raw.strip()
            if "```json" in raw_clean:
                raw_clean = raw_clean.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_clean:
                raw_clean = raw_clean.split("```")[1].split("```")[0].strip()

            data = json.loads(raw_clean)
            accessories = data.get("accessories", [])

            if not accessories:
                return AccessoryChatResponse(
                    reply="Je n'ai pas réussi à identifier les accessoires. Peux-tu me donner le modèle exact ?",
                    done=False
                )

            # Sauvegarder dans Supabase comme un résultat
            result_id = generate_result_id()
            profile = {
                "type": "accessories",
                "product_name": data.get("product_name", ""),
                "product_brand": data.get("product_brand", ""),
                "product_category": data.get("product_category", ""),
                "usage_summary": data.get("usage_summary", ""),
                "criteres": ["accessoires", data.get("product_category", "")],
            }

            # Enrichir avec la DB accessoires pour avoir des vrais liens affiliés
            enriched_accessories = []
            for acc in accessories:
                acc_name = acc.get("name", "").lower()
                # Chercher dans la table accessories
                try:
                    db_acc = (
                        supabase.table("accessories")
                        .select("id, name, image_url, affiliate_url, merchant_url, score_quality, quality_badge")
                        .ilike("name", f"%{acc.get('category','')}%")
                        .limit(1)
                        .execute()
                    )
                    # Fallback: chercher par marque ou catégorie
                    if not db_acc.data:
                        db_acc = (
                            supabase.table("accessories")
                            .select("id, name, image_url, affiliate_url, merchant_url, score_quality, quality_badge, amazon_asin, price_eur")
                            .ilike("name", f"%{acc.get('category','')}%")
                            .limit(1)
                            .execute()
                        )
                except Exception:
                    db_acc = type('obj', (object,), {'data': []})()

                db_data = db_acc.data[0] if db_acc.data else {}
                
                enriched_acc = {
                    **acc,
                    "affiliate_url": db_data.get("affiliate_url", "") or acc.get("amazon_search_url", ""),
                    "image_url": db_data.get("image_url", "") or "",
                    "merchant_url": db_data.get("merchant_url", "") or acc.get("amazon_search_url", ""),
                }
                enriched_accessories.append(enriched_acc)

            # Transformer en recommandations pour save_result
            recos = []
            for idx, acc in enumerate(enriched_accessories):
                recos.append({
                    "rank": idx + 1,
                    "rank_label": f"Accessoire #{idx + 1}",
                    "name": acc.get("name", ""),
                    "brand": data.get("product_brand", ""),
                    "score": 9.0 - (idx * 0.5),
                    "price_range": acc.get("estimated_price", ""),
                    "why_perfect": acc.get("why", ""),
                    "why_caution": acc.get("compatibility_note", ""),
                    "pros": [acc.get("why", "")],
                    "cons": [],
                    "enriched_data": {
                        "type": "accessory",
                        "amazon_search_url": acc.get("amazon_search_url", ""),
                        "category": acc.get("category", "autre"),
                        "compatibility_note": acc.get("compatibility_note", ""),
                        "estimated_price": acc.get("estimated_price", ""),
                    }
                })

            await save_result(
                result_id,
                profile,
                recos,
                supabase,
                metadata={"source": "accessories-chat", "version": "2.0"}
            )

            return AccessoryChatResponse(
                reply="",
                done=True,
                redirect_url=f"/accessoires/resultats/{result_id}"
            )

        except json.JSONDecodeError as e:
            logger.error(f"❌ JSON parse error: {e}\nRaw: {raw[:500]}")
            return AccessoryChatResponse(
                reply="Je n'ai pas compris le modèle exact. Peux-tu préciser la marque et la référence ?",
                done=False
            )
        except Exception as e:
            logger.error(f"❌ Accessories search error: {e}")
            return AccessoryChatResponse(
                reply="Service momentanément indisponible. Réessaie dans quelques secondes.",
                done=False
            )

    # Sinon, continuer la conversation normale DeepSeek
    try:
        resp = await client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": ACCESSORIES_SYSTEM_PROMPT},
                *history,
            ],
            temperature=0.7,
            max_tokens=500,
            extra_body={"thinking": {"type": "disabled"}},
        )
        reply = resp.choices[0].message.content
        if not reply:
            reply = resp.choices[0].message.model_extra.get("reasoning_content", "")
        return AccessoryChatResponse(reply=reply.strip(), done=False)
    except Exception as e:
        logger.error(f"❌ DeepSeek error: {e}")
        return AccessoryChatResponse(
            reply="Désolé, je rencontre un problème technique. Peux-tu reformuler ?",
            done=False
        )

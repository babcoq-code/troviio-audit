"""
Endpoint POST /api/chat/accessories-search
Chat IA dédié aux accessoires — DeepSeek pose des questions sur l'appareil (marque, modèle, besoin),
puis génère les accessoires, sauvegarde dans Supabase et redirige vers /accessoires/resultats/[id].
Ne recommande JAMAIS de produits dans le chat, uniquement des questions.
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

Tu es l'expert accessoires de Troviio. Tu aides les gens à trouver des accessoires compatibles avec leur appareil.

# RÈGLE ABSOLUE — JAMAIS DE PRODUITS DANS LE CHAT
Tu NE DOIS JAMAIS proposer, nommer, suggérer, ou mentionner un produit/accessoire spécifique dans le chat.
Tu NE DOIS JAMAIS donner de liens, de noms de marques d'accessoires, ou de recommandations produits.
Tu poses UNIQUEMENT des questions pour comprendre l'appareil et le besoin.
Les résultats sont affichés sur la page dédiée APRÈS le chat.

# FLOW — 1 QUESTION À LA FOIS, MAX 4 QUESTIONS

Question 1 (premier message) : "Quel est le modèle exact de ton appareil ? (marque et référence)"
  → Si l'utilisateur répond avec une marque + modèle court → va directement à Q2
  → Si l'utilisateur répond avec une marque/un modèle incomplet → demande plus de précisions

Question 2 : "Quel type d'accessoire cherches-tu ? (entretien/filtres, protection/housse, upgrade/amélioration, réparation/pièce, je ne sais pas)"

Question 3 : "À quelle fréquence utilises-tu ton appareil ? (quotidien, plusieurs fois par semaine, occasionnellement)"

Question 4 : "Quel budget prévois-tu pour cet accessoire ?"

Après la Q4 (ou si l'utilisateur dit "go", "trouve", "vas-y", "je suis prêt", "ok", "oui", "lance"):
→ Réponds : "Super, je lance la recherche des accessoires pour {marque} {modèle} ! 🚀"
→ Le système détectera automatiquement le déclenchement.

# STRUCTURE DES RÉPONSES
- 2-3 phrases max par message
- 1 question par message
- Termine par une question claire
- Si l'utilisateur dit "je sais pas" → propose des exemples courts
- Ne donne JAMAIS de liste d'options numérotées dans le chat"""


LAUNCH_TRIGGERS = {"go", "vas-y", "trouve", "je suis prêt", "je suis prete", "c'est bon", "j'ai assez", "recherche", "ok", "oui", "lance", "je lance", "cherche", "montre"}

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

    # Détection "go" — accessoires : 4 questions max
    msg_lower = req.message.lower().strip()
    user_wants_search = any(t in msg_lower for t in LAUNCH_TRIGGERS)
    # Auto-go après 4 exchanges (4 questions répondues)
    force_search = exchange_count >= 4 or user_wants_search

    if force_search:
        # Extraire le contexte pour le prompt de génération
        user_context = "\n".join(
            f"{'👤' if m['role'] == 'user' else '🤖'}: {m['content']}"
            for m in history if m["content"]
        )

        generation_prompt = f"""# GÉNÉRATION D'ACCESSOIRES — JSON UNIQUEMENT

Contexte de la conversation :
{user_context}

À partir de cette conversation, identifie l'appareil exact.

Retourne UNIQUEMENT du JSON valide (sans markdown, sans texte avant/après) selon ce format :
{{
  "product_name": "nom du produit",
  "product_brand": "marque",
  "product_category": "catégorie (ex: robot-aspirateur, machine-a-cafe, tv, velo-electrique, casque-audio, etc.)",
  "usage_summary": "résumé de l'usage (1 phrase)",
  "accessories": [
    {{
      "name": "nom de l'accessoire",
      "category": "filtre|brosse|batterie|station|sac|chargeur|cable|support|protection|autre",
      "why": "pourquoi cet accessoire est utile",
      "compatibility_note": "note de compatibilité avec l'appareil",
      "estimated_price": "prix estimé ex: ~25€",
      "amazon_search_url": "https://www.amazon.fr/s?k=Marque+Modèle+accessoire&tag=troviio-21"
    }}
  ]
}}

REGLES :
- 3 accessoires minimum, 5 maximum
- Prix réalistes pour le marché français
- amazon_search_url avec tag=troviio-21 et les bons mots-clés
- Ne propose que des accessoires réellement compatibles
- Si tu ne connais pas la compatibilité exacte, mets une note de prudence"""

        try:
            resp = await client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "Tu génères du JSON pour des recommandations d'accessoires. Retourne UNIQUEMENT du JSON valide, sans texte ni markdown."},
                    {"role": "user", "content": generation_prompt},
                ],
                temperature=0.3,
                max_tokens=1500,
                extra_body={"thinking": {"type": "disabled"}},
            )
            raw = resp.choices[0].message.content
            if not raw:
                raw = resp.choices[0].message.model_extra.get("reasoning_content", "")

            if not raw:
                return AccessoryChatResponse(
                    reply="Je n'ai pas réussi à identifier les accessoires. Peux-tu me donner le modèle exact ?",
                    done=False
                )

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

                # Chercher d'abord par nom exact
                db_acc_data = {}
                try:
                    db_acc = (
                        supabase.table("accessories")
                        .select("id, name, affiliate_url, merchant_url, amazon_asin, price_eur")
                        .ilike("name", f"%{acc_name.split()[-1]}%")
                        .limit(1)
                        .execute()
                    )
                    if db_acc.data:
                        db_acc_data = db_acc.data[0]
                except Exception:
                    pass

                enriched_acc = {
                    **acc,
                    "affiliate_url": db_acc_data.get("affiliate_url", "") or acc.get("amazon_search_url", ""),
                    "merchant_url": db_acc_data.get("merchant_url", "") or acc.get("amazon_search_url", ""),
                    "amazon_asin": db_acc_data.get("amazon_asin", ""),
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
                        "amazon_asin": acc.get("amazon_asin", ""),
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
                metadata={"source": "accessories-chat", "version": "2.1"}
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
            max_tokens=400,
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

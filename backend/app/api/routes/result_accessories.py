"""
Endpoint GET /api/results/{result_id}/accessories
Génère des recommandations d'accessoires via DeepSeek à la volée pour chaque produit du résultat.
"""
import os, json, logging
from fastapi import APIRouter, HTTPException
from supabase import create_client
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/results", tags=["results"])

supabase = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_SERVICE_KEY", ""),
)

client = AsyncOpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

ACCESSORY_PROMPT = """Tu es un expert accessoires pour produits tech et maison. 
Tu connais les accessoires compatibles avec chaque modèle et tu les recommandes de façon qualitative.

Pour chaque produit, donne 3 accessoires utiles.
Retourne UNIQUEMENT du JSON format :
{
  "accessories": [
    {
      "product_name": "nom exact du produit",
      "accessories": [
        {
          "name": "Nom de l'accessoire",
          "why": "Pourquoi cet accessoire est utile pour ce modèle (1 phrase)",
          "estimated_price": "prix estimé en €",
          "amazon_search_url": "https://www.amazon.fr/s?k=modele+accessoire&tag=troviio-21",
          "category": "filtre|brosse|batterie|station|sac|serpilliere|dock|autre"
        }
      ]
    }
  ]
}

Règles :
- 3 accessoires max par produit
- Sois précis : un accessoire doit être compatible avec le modèle exact
- Si tu n'es pas sûr du prix, donne une estimation basse
- Le amazon_search_url doit permettre à l'utilisateur de trouver l'accessoire sur Amazon
- Réponds UNIQUEMENT le JSON, sans markdown
"""


@router.get("/{result_id}/accessories")
async def get_result_accessories(result_id: str):
    """Génère des recommandations d'accessoires via DeepSeek pour un résultat."""
    # Récupérer le résultat
    result_query = (
        supabase.from_("results")
        .select("*")
        .eq("result_id", result_id)
        .limit(1)
        .execute()
    )
    if not result_query.data:
        raise HTTPException(status_code=404, detail="Résultat introuvable.")
    
    result_data = result_query.data[0]
    
    # Récupérer les recommandations
    recs_query = (
        supabase.from_("result_recommendations")
        .select("*")
        .eq("result_id", result_data["id"])
        .order("rank")
        .execute()
    )
    
    products_info = []
    for rec in recs_query.data:
        ed = rec.get("enriched_data") or {}
        products_info.append(
            f"- {rec.get('brand','')} {rec.get('name','')} (catégorie: {result_data['profile'].get('categorie','')}, prix: {ed.get('price_eur','?')}€)"
        )
    
    if not products_info:
        return {"accessories": []}
    
    user_prompt = f"""Voici les produits pour lesquels l'utilisateur cherche des accessoires :
{chr(10).join(products_info)}

Génère 3 accessoires utiles et compatibles pour chaque produit."""
    
    try:
        resp = await client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": ACCESSORY_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
            extra_body={"thinking": {"type": "disabled"}},
        )
        raw = resp.choices[0].message.content
        if not raw:
            raw = resp.choices[0].message.model_extra.get("reasoning_content", "{}")
        data = json.loads(raw)
        return data
    except Exception as e:
        logger.error(f"❌ Accessories AI error: {e}")
        return {"accessories": []}

"""
Service de gestion des résultats de recommandation Picksy.
"""
import os
import time
import secrets
import string
import logging
from typing import List, Optional
from unidecode import unidecode

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Génération d'un result_id court et mémorable
# ---------------------------------------------------------------------------

def generate_result_id() -> str:
    """
    Génère un identifiant court lisible pour le partage.
    Format : 8 caractères alphanum sans caractères ambigus (0, O, l, I)
    Exemple : aB3dEf9z
    """
    chars = (string.digits + string.ascii_letters)
    chars = chars.replace("l", "").replace("I", "").replace("O", "").replace("0", "")
    return "".join(secrets.choice(chars) for _ in range(8))


# ---------------------------------------------------------------------------
# Enrichissement des recommandations IA avec les données Supabase
# ---------------------------------------------------------------------------

async def enrich_recommendations(recommendations: List[dict], supabase_client) -> List[dict]:
    """
    Croise les recommandations IA (name + brand) avec la table products.
    Fusion des données pour ajouter image_url, specs, affiliate_url, use_case_scores…
    """
    enriched = []

    # Clés standard pour use_case_scores — normalisées
    STANDARD_USE_CASE_KEYS = ["qualite_prix", "performance", "design", "durabilite", "innovation"]

    def normalize_scores(scores: dict) -> dict:
        """Normalise n'importe quelles clés de use_case_scores vers les 5 standards."""
        if not scores or not isinstance(scores, dict):
            return {k: 0 for k in STANDARD_USE_CASE_KEYS}

        # Mapping des clés alternatives (français/anglais) vers les standards
        KEY_MAP = {
            "qualite_prix": "qualite_prix",
            "qualité_prix": "qualite_prix",
            "rapport qualité prix": "qualite_prix",
            "rapport qualite prix": "qualite_prix",
            "value": "qualite_prix",
            "price quality": "qualite_prix",
            "performance": "performance",
            "performances": "performance",
            "efficacité": "performance",
            "efficacite": "performance",
            "efficiency": "performance",
            "puissance": "performance",
            "design": "design",
            "style": "design",
            "look": "design",
            "apparence": "design",
            "esthetique": "design",
            "esthétique": "design",
            "durabilite": "durabilite",
            "durabilité": "durabilite",
            "durability": "durabilite",
            "qualité": "durabilite",
            "qualite": "durabilite",
            "fiabilité": "durabilite",
            "fiabilite": "durabilite",
            "solidité": "durabilite",
            "solidite": "durabilite",
            "build quality": "durabilite",
            "materiaux": "durabilite",
            "matériaux": "durabilite",
            "innovation": "innovation",
            "technologie": "innovation",
            "features": "innovation",
            "fonctionnalités": "innovation",
            "fonctionnalites": "innovation",
        }

        normalized = {}
        raw_key_lower = {k.lower().replace(" ", "_").replace("-", "_"): k for k in scores.keys()}

        for std_key in STANDARD_USE_CASE_KEYS:
            found = False
            for raw_lower, raw_key in raw_key_lower.items():
                mapped = KEY_MAP.get(raw_lower)
                if mapped == std_key:
                    try:
                        normalized[std_key] = float(scores[raw_key])
                    except (ValueError, TypeError):
                        normalized[std_key] = 0
                    found = True
                    break
            if not found:
                normalized[std_key] = 0

        return normalized

    for idx, reco in enumerate(recommendations):
        reco_name = unidecode(reco.get("name", "").lower().strip())
        reco_brand = unidecode(reco.get("brand", "").lower().strip())

        # Nettoyage : enlever la marque du nom si elle est préfixée (ex: "Eufy X10 Pro Omni" → "X10 Pro Omni")
        search_name = reco_name
        if reco_brand and reco_name.startswith(reco_brand):
            search_name = reco_name[len(reco_brand):].strip()
        # Enlever aussi les variantes de marque avec/sans espace
        if reco_brand:
            search_name = search_name.replace(reco_brand + " ", "").replace(reco_brand, "").strip() or search_name

        product_data = None

        try:
            # Tentative 1 : match exact brand + name partiel (nom nettoyé)
            result = (
                supabase_client
                .table("products")
                .select("*")
                .ilike("brand", f"%{reco_brand}%")
                .ilike("name", f"%{search_name}%")
                .limit(1)
                .execute()
            )
            if result.data:
                product_data = result.data[0]
                logger.info(f"[enrich] Produit trouvé pour '{reco['name']}' via match complet (search: {search_name})")
            else:
                # Tentative 2 : match uniquement sur le nom nettoyé
                result2 = (
                    supabase_client
                    .table("products")
                    .select("*")
                    .ilike("name", f"%{search_name}%")
                    .limit(1)
                    .execute()
                )
                if result2.data:
                    product_data = result2.data[0]
                    logger.warning(f"[enrich] Produit trouvé via name seul pour '{reco['name']}' (search: {search_name})")
                else:
                    # Tentative 3 : match sur le nom original (sans nettoyage)
                    result3 = (
                        supabase_client
                        .table("products")
                        .select("*")
                        .ilike("name", f"%{reco_name}%")
                        .limit(1)
                        .execute()
                    )
                    if result3.data:
                        product_data = result3.data[0]
                        logger.warning(f"[enrich] Produit trouvé via name original pour '{reco['name']}'")
                    else:
                        logger.warning(f"[enrich] Aucun match Supabase pour '{reco['name']}' ({reco_brand})")
        except Exception as e:
            logger.error(f"[enrich] Erreur Supabase pour '{reco['name']}': {e}")

        enriched.append({
            **reco,
            "rank": idx + 1,  # s'assurer que rank est présent
            "product_id": product_data["id"] if product_data else None,
            "enriched_data": {
                **(product_data or {}),
                "why_caution": reco.get("why_caution", ""),
            },
            # Champs extraits pour la page résultat
            "image_url": product_data.get("image_url") if product_data else None,
            "price_eur": product_data.get("price_eur") if product_data else None,
            "affiliate_url": product_data.get("affiliate_url") if product_data else None,
            "amazon_asin": product_data.get("amazon_asin") if product_data else None,
            "use_case_scores": normalize_scores(product_data.get("use_case_scores") if product_data else {}),
            "specs": product_data.get("specs") if product_data else {},
            "why_caution": reco.get("why_caution", ""),
            "troviio_score": reco.get("troviio_score", None),
            "troviio_explanation": reco.get("troviio_explanation", None),
        })

    return enriched


# ---------------------------------------------------------------------------
# Sauvegarde complète en Supabase
# ---------------------------------------------------------------------------

async def save_result(
    result_id: str,
    profile: dict,
    enriched_recommendations: List[dict],
    supabase_client,
    metadata: Optional[dict] = None
) -> str:
    """
    Sauvegarde le résultat et ses recommandations en Supabase.
    Retourne le result_id pour la redirection frontend.
    """
    try:
        # Insertion dans la table results
        result = (
            supabase_client
            .table("results")
            .insert({
                "result_id": result_id,
                "profile": profile,
                "metadata": metadata or {"source": "chat", "version": "1.0"},
            })
            .execute()
        )
        result_uuid = result.data[0]["id"]

        # Insertion des recommandations enrichies
        for reco in enriched_recommendations:
            (
                supabase_client
                .table("result_recommendations")
                .insert({
                    "result_id": result_uuid,
                    "product_id": reco.get("product_id"),
                    "rank": reco.get("rank", 1),
                    "name": reco.get("name", ""),
                    "brand": reco.get("brand", ""),
                    "rank_label": reco.get("rank_label", ""),
                    "why_perfect": reco.get("why_perfect", ""),
                    "pros": reco.get("pros", []),
                    "cons": reco.get("cons", []),
                    "score": reco.get("score", 0),
                    "price_range": reco.get("price_range", ""),
                    "enriched_data": {
                        **(reco.get("enriched_data") or {}),
                        "troviio_score": reco.get("troviio_score"),
                        "troviio_explanation": reco.get("troviio_explanation"),
                    },
                })
                .execute()
            )

        logger.info(f"[save_result] Résultat {result_id} sauvegardé ({len(enriched_recommendations)} recos)")
        return result_id

    except Exception as e:
        logger.error(f"[save_result] Erreur sauvegarde {result_id}: {e}")
        raise

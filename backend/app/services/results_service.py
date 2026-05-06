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

async def enrich_recommendations(recommendations: List[dict], supabase_client, profile: Optional[dict] = None) -> List[dict]:
    """
    Croise les recommandations IA (name + brand) avec la table products.
    Fusion des données pour ajouter image_url, specs, affiliate_url, use_case_scores…
    Calcule le vrai troviio_score (sur 100) par formule plutôt que de laisser l'IA l'inventer.
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

    def compute_troviio_score(
        ia_score: float,
        product_troviio_score: Optional[float],
        why_perfect: str,
        criteres: list[str],
        budget_max: Optional[float],
        price_eur: Optional[float],
        normalized_ucs: dict,
    ) -> int:
        """
        Calcule le vrai Troviio Score (sur 100) avec la formule :
        - Adéquation profil (60%) : match entre les critères du client et les specs du produit
        - Qualité intrinsèque (25%) : note technique du produit (troviio_score de la fiche)
        - Valeur perçue (15%) : rapport qualité/prix

        Retourne un entier entre 0 et 100.
        """
        # --- 1. Qualité intrinsèque (25%) ---
        # On prend le troviio_score du produit (fiche) s'il existe, sinon le score IA * 10
        base_quality = product_troviio_score if product_troviio_score else (ia_score * 10)
        quality_score = min(100, max(0, base_quality))

        # --- 2. Valeur perçue (15%) ---
        # Si on a un prix, on valorise le rapport qualité/prix
        # Un produit bien noté à prix modéré = meilleure valeur
        value_score = 70  # valeur par défaut
        if price_eur and price_eur > 0 and quality_score > 0:
            # Ratio qualité/prix : plus le produit est bon marché pour sa qualité, mieux c'est
            # Formule : quality_score / (price_eur / 100) plafonné
            ratio = quality_score / (price_eur / 100)
            value_score = min(100, max(30, round(ratio * 3)))
        elif price_eur and price_eur > 0:
            # Pas de qualité dispo, mais on a un prix
            if price_eur < 200:
                value_score = 80
            elif price_eur < 500:
                value_score = 65
            else:
                value_score = 50

        # --- 3. Adéquation profil (60%) ---
        # Start à 70 (neutre), ajusté par :
        # a) Budget : si le prix est dans le budget = bonus, sinon pénalité
        # b) Critères : longueur de why_perfect = indicateur de personnalisation
        # c) Use case scores : si les scores du produit matchent les besoins
        fit_score = 70

        # a) Budget fit
        if budget_max and price_eur and price_eur > 0:
            if price_eur <= budget_max:
                # Dans le budget — bonus progressif
                budget_ratio = price_eur / budget_max
                if budget_ratio <= 0.5:
                    fit_score += 15  # large marge = excellent choix
                elif budget_ratio <= 0.8:
                    fit_score += 10  # bon fit
                else:
                    fit_score += 5   # serré mais ok
            else:
                # Hors budget — pénalité
                over_ratio = price_eur / budget_max
                if over_ratio <= 1.2:
                    fit_score -= 10  # un peu au-dessus
                elif over_ratio <= 1.5:
                    fit_score -= 25  # significativement au-dessus
                else:
                    fit_score -= 40  # beaucoup trop cher

        # b) Personnalisation (via why_perfect)
        # Un why_perfect long et détaillé = l'IA a bien matché
        wp_len = len(why_perfect)
        if wp_len > 200:
            fit_score += 5
        elif wp_len < 80:
            fit_score -= 5

        # c) Use case scores — moyenne des scores non-nuls
        ucs_values = [v for v in normalized_ucs.values() if isinstance(v, (int, float)) and v > 0]
        if ucs_values:
            avg_ucs = sum(ucs_values) / len(ucs_values)
            # normalized_ucs est sur /10, on scale à contribution sur /100
            fit_score += round((avg_ucs / 10) * 15)  # jusqu'à +15 points

        # Fit score final dans [0, 100]
        fit_score = min(100, max(0, fit_score))

        # --- Calcul final ---
        final = round(fit_score * 0.60 + quality_score * 0.25 + value_score * 0.15)
        return min(100, max(0, final))

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

        # Si les pros/cons de l'IA sont vides, utiliser ceux du produit (fallback + enrichissement)
        ai_pros = reco.get("pros") or []
        ai_cons = reco.get("cons") or []
        db_pros = product_data.get("pros") if product_data else []
        db_cons = product_data.get("cons") if product_data else []

        enriched.append({
            **reco,
            "rank": idx + 1,  # s'assurer que rank est présent
            "product_id": product_data["id"] if product_data else None,
            "pros": ai_pros if ai_pros else db_pros,
            "cons": ai_cons if ai_cons else db_cons,
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
            "troviio_explanation": reco.get("troviio_explanation", None),
        })

        # Calcul du vrai Troviio Score (sur 100) par formule
        final_ucs = normalize_scores(product_data.get("use_case_scores") if product_data else {})
        product_ts = product_data.get("troviio_score") if product_data else None
        if isinstance(product_ts, str):
            try:
                product_ts = float(product_ts)
            except (ValueError, TypeError):
                product_ts = None
        if product_ts is not None:
            product_ts = float(product_ts)

        criteres = (profile or {}).get("criteres", [])
        budget_max = (profile or {}).get("budget_max")
        price = enriched[-1].get("price_eur")

        enriched[-1]["troviio_score"] = compute_troviio_score(
            ia_score=reco.get("score", 0),
            product_troviio_score=product_ts,
            why_perfect=reco.get("why_perfect", ""),
            criteres=criteres,
            budget_max=budget_max,
            price_eur=price,
            normalized_ucs=final_ucs,
        )

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

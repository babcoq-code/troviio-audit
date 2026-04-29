"""PICKSY — Top 3 produits par catégorie (podium page)."""

from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter
from supabase import Client, create_client

import os

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/tops", tags=["Tops"])


def get_supabase() -> Client:
    return create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_KEY"],
    )


PROS_CONS_TRANSLATE: dict[str, str] = {
    "photo": "Photo excellente",
    "video": "Vidéo fluide",
    "pro": "Usage professionnel",
    "autonomie": "Autonomie longue durée",
    "autonomie_extreme": "Autonomie excellente",
    "gaming": "Performances gaming",
    "compact": "Format compact",
    "premium": "Finition premium",
    "barista_assiste": "Barista assisté",
    "ecran_tactile": "Écran tactile intuitif",
    "latte_art": "Latte art réussi",
    "eco_responsable": "Éco-responsable",
    "bureau": "Idéal bureau",
    "usage_domestique": "Usage domestique",
    "grand_public": "Grand public",
    "budget_limite": "Petit budget",
    "photo_pro": "Photo professionnelle",
    "4k": "Qualité 4K",
}


def _translate_label(label: str) -> str:
    """Traduit un label snake_case/anglais en français lisible."""
    clean = label.strip().replace("_", " ").lower()
    if clean in PROS_CONS_TRANSLATE:
        return PROS_CONS_TRANSLATE[clean]
    return clean.title()


def _build_product_response(row: dict) -> dict[str, Any]:
    pros_raw = row.get("pros", "")
    cons_raw = row.get("cons", "")
    merchant_links = row.get("merchant_links") or {}
    best_merchant = None
    best_price = None
    affiliate_url = None

    if isinstance(merchant_links, dict):
        for name, info in merchant_links.items():
            if isinstance(info, dict) and info.get("url"):
                p = info.get("priceEur") or info.get("price_eur") or 0
                if p and (best_price is None or float(p) < best_price):
                    best_price = float(p)
                    best_merchant = name
                    affiliate_url = info["url"]

    # Parse and translate pros/cons
    pros_list: list[str] = []
    if isinstance(pros_raw, str):
        pros_list = [_translate_label(p) for p in pros_raw.split("\n") if p.strip()]
    elif isinstance(pros_raw, list):
        pros_list = [_translate_label(str(p)) for p in pros_raw]

    cons_list: list[str] = []
    if isinstance(cons_raw, str):
        cons_list = [_translate_label(c) for c in cons_raw.split("\n") if c.strip()]
    elif isinstance(cons_raw, list):
        cons_list = [_translate_label(str(c)) for c in cons_raw]

    return {
        "slug": row.get("slug"),
        "name": row.get("name"),
        "brand": row.get("brand"),
        "image_url": row.get("image_url"),
        "estimated_score": row.get("estimated_score") or row.get("score"),
        "price_eur": best_price or row.get("price_eur") or row.get("price"),
        "best_merchant": best_merchant,
        "affiliate_url": affiliate_url,
        "pros": pros_list[:3],
        "cons": cons_list[:2],
        "why_perfect": row.get("why_perfect"),
        "rank_label": row.get("rank_label"),
    }


@router.get("")
async def get_tops():
    """Retourne le top 3 produits de chaque catégorie, triés par score DESC."""
    sb = get_supabase()

    cats = sb.table("categories").select("id, slug, name").execute().data or []
    if not cats:
        return {"categories": []}

    categories: list[dict[str, Any]] = []

    for cat in cats:
        cat_id = cat["id"]
        cat_slug = cat["slug"]
        cat_name = cat["name"]

        result = (
            sb.table("products")
            .select("*")
            .eq("category_id", cat_id)
            .not_.is_("estimated_score", "null")
            .order("estimated_score", desc=True)
            .limit(3)
            .execute()
        )

        if not result.data or len(result.data) < 3:
            result2 = (
                sb.table("products")
                .select("*")
                .eq("category_id", cat_id)
                .not_.is_("score", "null")
                .order("score", desc=True)
                .limit(3)
                .execute()
            )
            if result2.data:
                result = result2

        products = [_build_product_response(r) for r in (result.data or [])]
        if not products:
            continue

        categories.append({
            "slug": cat_slug,
            "name": cat_name,
            "products": products,
            "count_products": len(products),
        })

    return {"categories": categories}

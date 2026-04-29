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


def _build_product_response(row: dict) -> dict[str, Any]:
    pros_str = row.get("pros", "")
    cons_str = row.get("cons", "")
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

    return {
        "slug": row.get("slug"),
        "name": row.get("name"),
        "brand": row.get("brand"),
        "image_url": row.get("image_url"),
        "estimated_score": row.get("estimated_score") or row.get("score"),
        "price_eur": best_price or row.get("price_eur") or row.get("price"),
        "best_merchant": best_merchant,
        "affiliate_url": affiliate_url,
        "pros": (
            [p.strip() for p in pros_str.split("\n") if p.strip()]
            if isinstance(pros_str, str)
            else (pros_str or [])
        )[:3],
        "cons": (
            [c.strip() for c in cons_str.split("\n") if c.strip()]
            if isinstance(cons_str, str)
            else (cons_str or [])
        )[:2],
        "why_perfect": row.get("why_perfect"),
        "rank_label": row.get("rank_label"),
    }


@router.get("")
async def get_tops():
    """Retourne le top 3 produits de chaque catégorie, triés par score DESC."""
    sb = get_supabase()

    # Récupère toutes les catégories
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

        # Fallback si pas assez de produits avec estimated_score
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

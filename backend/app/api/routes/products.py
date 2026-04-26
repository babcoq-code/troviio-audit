"""
PICKSY — Routes Produits (detail page)
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException

from app.schemas.product import (
    ProductDetailResponse,
    ProductPricesResponse,
    PlatformPrice,
    PriceHistoryPoint,
    ProductRatings,
    PriceStatus,
)
from app.services.price_service import PriceService
from app.core.supabase import get_supabase_admin

logger = logging.getLogger(__name__)

router = APIRouter()


def _row_to_detail(row: dict) -> ProductDetailResponse:
    """Convert a DB row dict to ProductDetailResponse Pydantic model."""
    ratings = None
    if row.get("ratings"):
        if isinstance(row["ratings"], dict):
            ratings = ProductRatings(**row["ratings"])
        elif isinstance(row["ratings"], (int, float)):
            ratings = ProductRatings(overall=float(row["ratings"]))

    return ProductDetailResponse(
        id=row["id"],
        slug=row.get("slug", ""),
        name=row.get("name", ""),
        brand=row.get("brand", ""),
        model=row.get("model"),
        image_url=row.get("image_url"),
        category_slug=row.get("category_slug", ""),
        category_name=row.get("category_name", ""),
        category_emoji=row.get("category_emoji"),
        estimated_score=row.get("estimated_score"),
        price_eur=row.get("price_eur"),
        specs=row.get("specs", {}),
        use_case_scores=row.get("use_case_scores", {}),
        test_summary=row.get("test_summary"),
        verdict=row.get("verdict"),
        ratings=ratings,
        why_perfect=row.get("why_perfect"),
        pros=row.get("pros", []),
        cons=row.get("cons", []),
        affiliate_url=row.get("affiliate_url"),
        amazon_asin=row.get("amazon_asin"),
        source_url=row.get("source_url"),
        source_title=row.get("source_title"),
        source_date=row.get("source_date"),
        prices=None,
    )


@router.get("/", response_model=list[ProductDetailResponse])
async def list_products(
    category: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
):
    """List published products, optionally filtered by category slug."""
    supabase = get_supabase_admin()
    query = supabase.from_("v_products_published").select("*")
    if category:
        query = query.eq("category_slug", category)
    result = query.order("estimated_score", desc=True).range(offset, offset + limit - 1).execute()
    return [_row_to_detail(row) for row in (result.data or [])]


@router.get("/top5/{category}", response_model=list[ProductDetailResponse])
async def top5(category: str):
    """Top 5 products for a given category slug."""
    supabase = get_supabase_admin()
    result = (
        supabase.from_("v_products_published")
        .select("*")
        .eq("category_slug", category)
        .order("estimated_score", desc=True)
        .limit(5)
        .execute()
    )
    if not result.data:
        raise HTTPException(404, f"Aucun produit trouvé pour la catégorie '{category}'")
    return [_row_to_detail(row) for row in result.data]


@router.get("/{slug}", response_model=ProductDetailResponse)
async def get_product_by_slug(slug: str):
    """Get a single product by its slug."""
    supabase = get_supabase_admin()
    result = (
        supabase.from_("v_products_published")
        .select("*")
        .eq("slug", slug)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(404, f"Produit introuvable (slug: {slug})")
    return _row_to_detail(result.data[0])


@router.get("/{slug}/prices", response_model=ProductPricesResponse)
async def get_product_prices(slug: str):
    """Get prices and price history for a product by slug."""
    supabase = get_supabase_admin()

    # Look up product ID from slug
    product_result = (
        supabase.from_("v_products_published")
        .select("id, slug")
        .eq("slug", slug)
        .limit(1)
        .execute()
    )
    if not product_result.data:
        raise HTTPException(404, f"Produit introuvable (slug: {slug})")

    product_id = product_result.data[0]["id"]

    # Fetch prices via PriceService
    supabase_admin = get_supabase_admin()
    prices_data = await PriceService.get_product_prices(slug, product_id, supabase_admin)

    return ProductPricesResponse(**prices_data)

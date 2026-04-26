"""
PICKSY — Routes Produits
"""

from fastapi import APIRouter, HTTPException
from typing import Optional

from app.core.supabase import get_supabase_admin

router = APIRouter()

VALID_CATEGORIES = ["robot_aspirateur", "tv_oled", "machine_cafe"]


@router.get("/")
async def list_products(category: str = None, limit: int = 20):
    supabase = get_supabase_admin()
    query = supabase.table("products").select("*").eq("status", "published")
    if category:
        if category not in VALID_CATEGORIES:
            raise HTTPException(400, f"Catégorie invalide. Valeurs possibles : {VALID_CATEGORIES}")
        query = query.eq("category_slug", category)
    result = query.order("estimated_score", desc=True).limit(limit).execute()
    return result.data


@router.get("/top5/{category}")
async def top5(category: str):
    if category not in VALID_CATEGORIES:
        raise HTTPException(400, "Catégorie invalide.")
    supabase = get_supabase_admin()
    result = (
        supabase.table("products")
        .select("*")
        .eq("status", "published")
        .eq("category_slug", category)
        .order("estimated_score", desc=True)
        .limit(5)
        .execute()
    )
    return result.data


@router.get("/{product_id}")
async def get_product(product_id: str):
    supabase = get_supabase_admin()
    result = supabase.table("products").select("*").eq("id", product_id).execute()
    if not result.data:
        raise HTTPException(404, "Produit introuvable")
    return result.data[0]

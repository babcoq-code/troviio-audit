"""
PICKSY — Routes Produits
"""

import os
from fastapi import APIRouter, HTTPException
from supabase import create_client

router = APIRouter()

supabase = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", ""),
)

VALID_CATEGORIES = ["robot_aspirateur", "tv_oled", "machine_cafe"]


@router.get("/")
async def list_products(category: str = None, limit: int = 20):
    query = supabase.table("products").select("*").eq("status", "published")
    if category:
        if category not in VALID_CATEGORIES:
            raise HTTPException(400, f"Catégorie invalide. Valeurs possibles : {VALID_CATEGORIES}")
        query = query.eq("category", category)
    result = query.order("estimated_score", desc=True).limit(limit).execute()
    return result.data


@router.get("/top5/{category}")
async def top5(category: str):
    if category not in VALID_CATEGORIES:
        raise HTTPException(400, f"Catégorie invalide.")
    result = (
        supabase.table("products")
        .select("*")
        .eq("status", "published")
        .eq("category", category)
        .order("estimated_score", desc=True)
        .limit(5)
        .execute()
    )
    return result.data


@router.get("/{product_id}")
async def get_product(product_id: str):
    result = supabase.table("products").select("*").eq("id", product_id).execute()
    if not result.data:
        raise HTTPException(404, "Produit introuvable")
    return result.data[0]

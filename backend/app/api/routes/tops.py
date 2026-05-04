"""PICKSY — Top 3. OPTIMISÉ : 2 requêtes au total."""

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

    if isinstance(merchant_links, list):
        for entry in merchant_links:
            if isinstance(entry, dict) and entry.get("url"):
                p = entry.get("priceEur") or entry.get("price_eur") or entry.get("price") or 0
                if p and (best_price is None or float(p) < best_price):
                    best_price = float(p)
                    best_merchant = entry.get("name") or entry.get("merchant")
                    affiliate_url = entry["url"]
    elif isinstance(merchant_links, dict):
        for name, info in merchant_links.items():
            if isinstance(info, dict) and info.get("url"):
                p = info.get("priceEur") or info.get("price_eur") or info.get("price") or 0
                if p and (best_price is None or float(p) < best_price):
                    best_price = float(p)
                    best_merchant = name
                    affiliate_url = info["url"]

    db_price = row.get("price_eur") or row.get("price")
    if db_price and db_price > 100:
        db_price = db_price / 100
    if best_price and best_price > 5000:
        best_price = best_price / 100

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
        "estimated_score": row.get("effective_score") or row.get("estimated_score") or row.get("score"),
        "price_eur": best_price or db_price or 0,
        "best_merchant": best_merchant,
        "affiliate_url": affiliate_url,
        "pros": pros_list[:3],
        "cons": cons_list[:2],
        "why_perfect": row.get("why_perfect"),
    }


@router.get("")
async def get_tops():
    """Retourne le top 3 de chaque catégorie. OPTIMISÉ : 2 requêtes Supabase."""
    sb = get_supabase()

    # 1) Récupérer TOUTES les catégories (1 requête)
    cats = sb.table("categories").select("id, slug, name").execute().data or []
    cat_map = {c["id"]: c for c in cats}

    if not cat_map:
        return {"categories": []}

    # 2) Récupérer TOUS les produits actifs avec un score (1 seule requête)
    all_products = (
        sb.table("products")
        .select("id, slug, name, brand, image_url, estimated_score, score, price_eur, price, merchant_links, pros, cons, why_perfect, amazon_asin, category_id")
        .eq("is_active", True)
        .execute()
    ).data or []

    # 3) Grouper par catégorie et trier en Python (instantané)
    from collections import defaultdict

    grouped: dict[str, list[dict]] = defaultdict(list)
    for p in all_products:
        cat_id = p.get("category_id")
        if cat_id and cat_id in cat_map:
            # Calculer le score effectif
            est = p.get("estimated_score")
            sc = p.get("score")
            effective = float(est) if est else (float(sc) * 10 if sc else 0)
            p["effective_score"] = effective
            grouped[cat_id].append(p)

    categories = []
    for cat_id, products in grouped.items():
        cat_info = cat_map[cat_id]

        # Trier par score descendant
        products.sort(key=lambda p: p["effective_score"], reverse=True)

        # Dédoublonner par ASIN
        seen_asins = set()
        seen_slugs = set()
        deduped = []
        for p in products:
            asin = (p.get("amazon_asin") or "").strip().upper()
            slug = p.get("slug", "")
            if asin and asin in seen_asins:
                continue
            if slug and slug in seen_slugs:
                continue
            if asin:
                seen_asins.add(asin)
            if slug:
                seen_slugs.add(slug)
            deduped.append(p)

        # Max 2 produits par marque, max 3 au total
        brand_count = {}
        diverse = []
        for p in deduped:
            brand = (p.get("brand") or "Unknown").strip().lower()
            if brand_count.get(brand, 0) >= 2:
                continue
            brand_count[brand] = brand_count.get(brand, 0) + 1
            diverse.append(p)
            if len(diverse) == 3:
                break

        products_response = [_build_product_response(p) for p in diverse[:3]]
        if products_response:
            categories.append({
                "slug": cat_info["slug"],
                "name": cat_info["name"],
                "products": products_response,
                "count_products": len(products_response),
            })

    # Trier les catégories par slug
    categories.sort(key=lambda c: c["slug"])

    return {"categories": categories}

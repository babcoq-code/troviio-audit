"""
PICKSY — Routes Produits (detail page)
"""

from __future__ import annotations
import logging, os
from datetime import datetime, timedelta, timezone
from typing import Any, Literal
from uuid import UUID

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from supabase import Client, create_client

logger = logging.getLogger(__name__)
router = APIRouter()


def get_supabase() -> Client:
    return create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_KEY"],
    )


class ProductRatings(BaseModel):
    design: float = 0
    ease_of_use: float = 0
    performance: float = 0
    value_for_money: float = 0
    customer_service: float = 0


class ProductResponse(BaseModel):
    id: UUID
    slug: str
    name: str
    brand: str | None = None
    category_slug: str | None = None
    price_eur: float | None = None
    estimated_score: float | None = None
    use_case_scores: dict[str, float] = {}
    pros: list[str] = []
    cons: list[str] = []
    description: str | None = None
    why_perfect: str | None = None
    rank_label: str | None = None
    test_summary: str | None = None
    verdict: str | None = None
    ratings: ProductRatings | None = None
    image_url: str | None = None
    specs: dict[str, Any] = {}
    amazon_asin: str | None = None


class PriceEntry(BaseModel):
    merchant_name: str
    merchant_logo_url: str
    price_eur: float
    affiliate_url: str
    in_stock: bool
    scraped_at: datetime


class AffiliateClickPayload(BaseModel):
    productId: UUID
    merchantName: str
    affiliateUrl: str


@router.get("/api/products/{slug}", response_model=ProductResponse)
async def get_product(slug: str):
    sb = get_supabase()
    r = sb.table("products").select("*").eq("slug", slug).single().execute()
    if not r.data:
        raise HTTPException(404, "Product not found")
    return ProductResponse.model_validate(r.data)


@router.get("/api/products/{slug}/prices", response_model=list[PriceEntry])
async def get_current_prices(slug: str):
    sb = get_supabase()
    prod = sb.table("products").select("id, slug, amazon_asin, merchant_links, price_eur").eq("slug", slug).single().execute()
    if not prod.data:
        raise HTTPException(404, "Product not found")
    pid = prod.data["id"]
    r = sb.from_("latest_price_by_merchant").select("*").eq("product_id", pid).execute()
    rows = sorted(r.data or [], key=lambda x: float(x["price_eur"]))
    if rows:
        return [PriceEntry.model_validate(row) for row in rows]

    # Fallback: build from merchant_links
    ml = prod.data.get("merchant_links") or {}
    entries = []
    for name, info in ml.items():
        if isinstance(info, dict) and info.get("url"):
            entries.append(PriceEntry(
                merchant_name=name,
                merchant_logo_url="",
                price_eur=info.get("priceEur") or info.get("price_eur") or prod.data.get("price_eur") or 0.0,
                affiliate_url=info["url"],
                in_stock=info.get("inStock", True),
                scraped_at=datetime.now(timezone.utc),
            ))
    return sorted(entries, key=lambda x: x.price_eur)


@router.get("/api/products/{slug}/price-history", response_model=list[PriceEntry])
async def get_price_history(slug: str):
    sb = get_supabase()
    prod = sb.table("products").select("id").eq("slug", slug).single().execute()
    if not prod.data:
        raise HTTPException(404, "Product not found")
    pid = prod.data["id"]
    since = (datetime.now(timezone.utc) - timedelta(weeks=12)).isoformat()
    r = (sb.table("price_history")
         .select("merchant_name,merchant_logo_url,price_eur,affiliate_url,in_stock,scraped_at")
         .eq("product_id", pid)
         .gte("scraped_at", since)
         .order("scraped_at", desc=False)
         .execute())
    return [PriceEntry.model_validate(row) for row in r.data or []]


@router.post("/api/affiliate/click", status_code=201)
async def track_click(payload: AffiliateClickPayload, request: Request):
    sb = get_supabase()
    fwd = request.headers.get("x-forwarded-for", "")
    ip = fwd.split(",")[0].strip() if fwd else (request.client.host if request.client else None)
    sb.table("affiliate_clicks").insert({
        "product_id": str(payload.productId),
        "merchant_name": payload.merchantName,
        "affiliate_url": str(payload.affiliateUrl),
        "user_agent": request.headers.get("user-agent"),
        "referer": request.headers.get("referer"),
        "ip_address": ip,
        "clicked_at": datetime.now(timezone.utc).isoformat(),
    }).execute()
    return {"ok": True}

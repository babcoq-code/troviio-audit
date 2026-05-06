"""
PICKSY — Routes Produits (detail page)
"""

from __future__ import annotations
import logging, os
from datetime import datetime, timedelta, timezone
from typing import Any, Literal
from uuid import UUID

import json
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, field_validator
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
    category_id: str | None = None
    category_slug: str | None = None
    category_name: str | None = None
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
    merchant_links: list[dict] | None = None
    affiliate_url: str | None = None

    @field_validator("merchant_links", mode="before")
    @classmethod
    def parse_merchant_links(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return None
        if isinstance(v, dict):
            # Convert dict with price info to list
            if v:
                return [v]
            return None
        return v

    @field_validator("specs", mode="before")
    @classmethod
    def parse_specs(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return {}
        return v

    @field_validator("use_case_scores", mode="before")
    @classmethod
    def parse_use_case_scores(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return {}
        return v

    @field_validator("pros", mode="before")
    @classmethod
    def parse_pros(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return []
        return v or []

    @field_validator("cons", mode="before")
    @classmethod
    def parse_cons(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return []
        return v or []


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
    try:
        r = sb.table("products").select("*").eq("slug", slug).single().execute()
        if not r.data:
            raise HTTPException(404, "Product not found")
        p = r.data
        # Map category_id to category_slug
        cid = p.get("category_id")
        if cid:
            try:
                cat = sb.table("categories").select("slug,name").eq("id", cid).single().execute()
                if cat.data:
                    p["category_slug"] = cat.data["slug"]
                    p["category_name"] = cat.data["name"]
            except Exception:
                pass
        return ProductResponse.model_validate(p)
    except Exception as e:
        err_msg = str(e)
        if "PGRST116" in err_msg or "contains 0 rows" in err_msg:
            raise HTTPException(404, "Product not found")
        logger.error(f"get_product error for slug={slug}: {e}")
        raise HTTPException(500, "Erreur interne du serveur")


# ─── GET /api/products/?category=slug&q=search ─────────────────

@router.get("/api/products/", response_model=list[ProductResponse])
@router.get("/api/products", response_model=list[ProductResponse], include_in_schema=False)
async def list_products(category: str | None = None, q: str | None = None, limit: int = 50):
    sb = get_supabase()
    # Map frontend URLs to DB slugs
    ALIASES = {
        "tv-oled": "tv",
        "machine-cafe": "machine-a-cafe",
        "aspirateurs-balai": "aspirateur-balai",
        "four-micro-onde": "four-micro-ondes",
        "enceinte-bt": "enceinte-bt",
    }
    db_slug = ALIASES.get(category, category)
    try:
        # Load all categories for mapping category_id -> slug
        try:
            cats_result = sb.table("categories").select("id, slug, name").execute()
            cat_map = {c["id"]: {"slug": c["slug"], "name": c["name"]} for c in (cats_result.data or [])}
        except Exception:
            cat_map = {}
        
        query = sb.table("products").select("*").eq("is_active", True)
        if q and q.strip():
            qs = q.strip()
            query = query.ilike("name", f"%{qs}%")
        if category:
            try:
                cat = sb.table("categories").select("id").eq("slug", db_slug).single().execute()
            except Exception:
                cat = type('obj', (object,), {'data': None})()
            if cat and cat.data:
                query = query.eq("category_id", cat.data["id"])
            else:
                return []
        r = query.order("estimated_score", desc=True, nullsfirst=False).limit(limit).execute()
        if not r.data:
            return []
        validated = []
        for p in r.data:
            if isinstance(p.get("specs"), str):
                try:
                    p["specs"] = json.loads(p["specs"])
                except (json.JSONDecodeError, TypeError):
                    p["specs"] = {}
            # Map category_id to category_slug and category_name
            cid = p.get("category_id")
            if cid and cid in cat_map:
                p["category_slug"] = cat_map[cid]["slug"]
                p["category_name"] = cat_map[cid]["name"]
            validated.append(ProductResponse.model_validate(p))
        return validated
    except Exception as e:
        logger.error(f"list_products error: {e}")
        raise HTTPException(500, "Erreur interne du serveur")


# ─── GET /api/products/{slug}/prices ────────────────────────
@router.get("/api/products/{slug}/prices", response_model=list[PriceEntry])
async def get_current_prices(slug: str):
    sb = get_supabase()
    try:
        prod = sb.table("products").select("id, slug, amazon_asin, merchant_links, price_eur").eq("slug", slug).single().execute()
        if not prod.data:
            raise HTTPException(404, "Product not found")
    except Exception as e:
        err_msg = str(e)
        if "PGRST116" in err_msg or "contains 0 rows" in err_msg:
            raise HTTPException(404, "Product not found")
        logger.error(f"get_current_prices error for slug={slug}: {e}")
        raise HTTPException(500, "Erreur interne du serveur")
    pid = prod.data["id"]
    r = sb.from_("latest_price_by_merchant").select("*").eq("product_id", pid).execute()
    rows = sorted(r.data or [], key=lambda x: float(x["price_eur"]))
    if rows:
        result = []
        for row in rows:
            url = row.get("affiliate_url", "")
            name = row.get("merchant_name", "")
            if "amazon" in name.lower() and "tag=" not in url and url:
                sep = "&" if "?" in url else "?"
                url = f"{url}{sep}tag=troviio-21"
            row["affiliate_url"] = url
            result.append(PriceEntry.model_validate(row))
        return result

    # Fallback: build from merchant_links
    ml = prod.data.get("merchant_links") or []
    if isinstance(ml, str):
        try:
            ml = json.loads(ml)
        except (json.JSONDecodeError, TypeError):
            ml = []
    entries = []
    if isinstance(ml, dict):
        # Old format: {"MerchantName": {"price": ..., "url": ...}}
        for name, info in ml.items():
            if isinstance(info, dict) and info.get("url"):
                url = info["url"]
                if "amazon" in name.lower() and "tag=" not in url and "troviio-21" not in url:
                    sep = "&" if "?" in url else "?"
                    url = f"{url}{sep}tag=troviio-21"
                entries.append(PriceEntry(
                    merchant_name=name,
                    merchant_logo_url="",
                    price_eur=info.get("priceEur") or info.get("price_eur") or prod.data.get("price_eur") or 0.0,
                    affiliate_url=url,
                    in_stock=info.get("inStock", True),
                    scraped_at=datetime.now(timezone.utc),
                ))
    elif isinstance(ml, list):
        # New format: [{"name": "...", "price": ..., "url": "..."}]
        for item in ml:
            if isinstance(item, dict) and item.get("url"):
                url = item["url"]
                name = item.get("name", "")
                if "amazon" in name.lower() and "tag=" not in url and "troviio-21" not in url:
                    sep = "&" if "?" in url else "?"
                    url = f"{url}{sep}tag=troviio-21"
                entries.append(PriceEntry(
                    merchant_name=name,
                    merchant_logo_url="",
                    price_eur=item.get("price") or item.get("price_eur") or prod.data.get("price_eur") or 0.0,
                    affiliate_url=url,
                    in_stock=item.get("in_stock", True) if isinstance(item.get("in_stock"), bool) else True,
                    scraped_at=datetime.now(timezone.utc),
                ))

    # If no merchant_links but ASIN exists, build Amazon link
    if not entries and prod.data.get("amazon_asin"):
        asin = prod.data["amazon_asin"]
        entries.append(PriceEntry(
            merchant_name="Amazon",
            merchant_logo_url="",
            price_eur=prod.data.get("price_eur") or 0.0,
            affiliate_url=f"https://www.amazon.fr/dp/{asin}?tag=troviio-21",
            in_stock=True,
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


@router.get("/api/product-slugs")
async def get_all_product_slugs():
    """Return all active product slugs for sitemap."""
    try:
        supabase = get_supabase()
        resp = supabase.table("products").select("slug").eq("is_active", True).execute()
        slugs = [row["slug"] for row in resp.data if row.get("slug")]
        return slugs
    except Exception as e:
        logger.error(f"Failed to fetch product slugs: {e}")
        return []


@router.get("/api/category-slugs")
async def get_all_category_slugs():
    """Return all category slugs for sitemap."""
    try:
        supabase = get_supabase()
        resp = supabase.table("categories").select("slug").execute()
        slugs = [row["slug"] for row in resp.data if row.get("slug")]
        return slugs
    except Exception as e:
        logger.error(f"Failed to fetch category slugs: {e}")
        return []


@router.get("/api/products/by-category/{slug}")
async def get_products_by_category(slug: str):
    """Return all active products for a category slug."""
    try:
        supabase = get_supabase()
        cat_resp = supabase.table("categories").select("id").eq("slug", slug).limit(1).execute()
        if not cat_resp.data:
            return {"products": []}
        cat_id = cat_resp.data[0]["id"]
        prod_resp = supabase.table("products").select(
            "id,name,brand,slug,image_url,price_eur,estimated_score,pros,cons,specs,amazon_asin,affiliate_url"
        ).eq("is_active", True).eq("category_id", cat_id).execute()
        return {"products": prod_resp.data or []}
    except Exception as e:
        logger.error(f"Failed to fetch products by category {slug}: {e}")


# ─── GET /api/tops ─────────────────────────────────────────────
# Returns top 3 products per category for the /tops page

@router.get("/api/tops")
async def get_tops():
    """Return top 3 products for each category."""
    try:
        sb = get_supabase()
        cats_result = sb.table("categories").select("id, slug, name").execute()
        categories = cats_result.data or []
        prods_result = sb.table("products").select(
            "id,name,brand,slug,category_id,image_url,estimated_score,price_eur,amazon_asin,affiliate_url,pros,cons,why_perfect,rank_label,merchant_links"
        ).eq("is_active", True).not_.is_("estimated_score", "null").order("estimated_score", desc=True).limit(200).execute()
        products = prods_result.data or []
        cat_products = {}
        for cat in categories:
            cat_products[cat["id"]] = []
        for p in products:
            cid = p.get("category_id")
            if cid and cid in cat_products and len(cat_products[cid]) < 3:
                ml = p.get("merchant_links") or []
                if isinstance(ml, str):
                    try:
                        ml = json.loads(ml)
                    except Exception:
                        ml = []
                best_merchant = None
                affiliate_url = None
                if ml:
                    first = ml[0] if isinstance(ml, list) else ml
                    if isinstance(first, dict):
                        best_merchant = first.get("name") or first.get("merchant")
                        affiliate_url = first.get("affiliate_url") or first.get("url")
                if not affiliate_url:
                    affiliate_url = p.get("affiliate_url")
                    if not affiliate_url and p.get("amazon_asin"):
                        affiliate_url = f"https://www.amazon.fr/dp/{p['amazon_asin']}?tag=troviio-21"
                cat_products[cid].append({
                    "slug": p["slug"],
                    "name": p["name"],
                    "brand": p.get("brand"),
                    "image_url": p.get("image_url"),
                    "estimated_score": p.get("estimated_score"),
                    "price_eur": p.get("price_eur"),
                    "best_merchant": best_merchant,
                    "affiliate_url": affiliate_url,
                    "pros": p.get("pros") or [],
                    "cons": p.get("cons") or [],
                    "why_perfect": p.get("why_perfect"),
                    "rank_label": p.get("rank_label"),
                })
        result = []
        for cat in categories:
            cid = cat["id"]
            plist = cat_products.get(cid, [])
            if plist:
                result.append({
                    "slug": cat["slug"],
                    "name": cat["name"],
                    "products": plist,
                    "count_products": len(plist),
                })
        return {"categories": result}
    except Exception as e:
        logger.error(f"get_tops error: {e}")
        raise HTTPException(500, "Erreur interne du serveur")


# ── Sitemap slugs ──────────────────────────────────────────────
@router.get("/api/product-slugs")
async def get_product_slugs():
    try:
        supabase = get_supabase()
        resp = supabase.table("products").select("slug").eq("is_active", True).execute()
        return [row["slug"] for row in (resp.data or [])]
    except Exception as e:
        logger.error(f"Failed to fetch product slugs: {e}")
        return []


@router.get("/api/category-slugs")
async def get_category_slugs():
    try:
        supabase = get_supabase()
        resp = supabase.table("categories").select("slug").execute()
        return [row["slug"] for row in (resp.data or [])]
    except Exception as e:
        logger.error(f"Failed to fetch category slugs: {e}")
        return []


@router.get("/api/metrics")
async def get_metrics():
    """Retourne les métriques daily stockées dans /data/metrics/daily.jsonl"""
    import json
    try:
        with open("/data/metrics/daily.jsonl") as f:
            lines = [json.loads(l) for l in f if l.strip()]
        if not lines:
            return {"error": "No metrics yet"}
        return {
            "today": lines[-1],
            "history": lines[-30:],
            "total_entries": len(lines),
        }
    except FileNotFoundError:
        return {"error": "No metrics file"}

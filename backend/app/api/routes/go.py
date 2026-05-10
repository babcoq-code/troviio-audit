"""
Endpoint GET /go/{product_id}
Redirection affiliée avec tracking des clics.
Loggue le clic dans la table affiliate_clicks puis redirige vers Amazon.
"""
import os, uuid, logging
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse, JSONResponse

from app.core.supabase import get_supabase_admin

logger = logging.getLogger("troviio.go")
supabase = get_supabase_admin()

router = APIRouter(prefix="/api/go", tags=["Affiliate Redirects"])


@router.get("/{product_id}")
async def affiliate_redirect(
    product_id: str,
    request: Request,
    src: str = "unknown",
    pos: int = 0,
):
    """Redirige vers l'URL affiliée Amazon et tracke le clic."""
    try:
        # Récupérer l'URL affiliée + ASIN + slug
        result = (
            supabase.table("products")
            .select("id, slug, affiliate_url, amazon_asin, price_eur, name")
            .eq("id", product_id)
            .limit(1)
            .execute()
        )

        if not result.data:
            # Fallback: chercher par slug
            result = (
                supabase.table("products")
                .select("id, slug, affiliate_url, amazon_asin, price_eur, name")
                .eq("slug", product_id)
                .limit(1)
                .execute()
            )

        if not result.data:
            return RedirectResponse("https://www.amazon.fr", status_code=302)

        product = result.data[0]
        affiliate_url = product.get("affiliate_url") or ""
        if not affiliate_url and product.get("amazon_asin"):
            asin = product["amazon_asin"]
            tag = "troviio-21"
            affiliate_url = f"https://www.amazon.fr/dp/{asin}?tag={tag}&linkCode=as2"

        if not affiliate_url:
            return RedirectResponse("https://www.amazon.fr", status_code=302)

        # Session cookie anonyme
        session_id = request.cookies.get("tv_sid", str(uuid.uuid4()))

        # Log le clic (fire and forget) — utilise les colonnes réelles de la table
        try:
            click_data = {
                "product_id": product_id,
                "session_id": session_id,
                "merchant": "amazon",
                "surface": src if src in ("chat", "tops", "category", "product_page", "homepage", "result_card") else "unknown",
                "category_slug": product.get("category_slug", ""),
                "sub_id": str(pos) if pos else None,
            }
            supabase.table("affiliate_clicks").insert(click_data).execute()
        except Exception as e:
            logger.warning(f"[go.py] Tracking error (non-fatal): {e}")

        response = RedirectResponse(affiliate_url, status_code=302)
        response.set_cookie(
            "tv_sid", session_id,
            max_age=60 * 60 * 24 * 30,
            httponly=True,
            secure=True,
            samesite="lax",
        )
        return response

    except Exception as e:
        logger.error(f"❌ /go error: {e}")
        return RedirectResponse("https://www.amazon.fr", status_code=302)

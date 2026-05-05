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

router = APIRouter(tags=["Affiliate Redirects"])

@router.get("/go/{product_id}")
async def affiliate_redirect(
    product_id: str,
    request: Request,
    src: str = "unknown",
    pos: int = 0,
):
    """Redirige vers l'URL affiliée Amazon et tracke le clic."""
    try:
        # Récupérer l'URL affiliée
        result = (
            supabase.table("products")
            .select("affiliate_url, price_eur, name, brand")
            .eq("id", product_id)
            .limit(1)
            .execute()
        )

        if not result.data:
            return RedirectResponse("https://www.amazon.fr", status_code=302)

        product = result.data[0]
        affiliate_url = product.get("affiliate_url") or "https://www.amazon.fr"

        # Session cookie anonyme
        session_id = request.cookies.get("tv_sid", str(uuid.uuid4()))

        # Log le clic (fire and forget)
        try:
            supabase.table("affiliate_clicks").insert({
                "product_id": product_id,
                "retailer_code": "amazon",
                "source_page": request.headers.get("referer", ""),
                "source_type": src if src in ("chat", "tops", "category", "product_page", "homepage") else "unknown",
                "session_id": session_id,
            }).execute()
        except Exception:
            pass  # Table peut ne pas exister — ne pas bloquer

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

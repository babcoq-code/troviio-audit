"""FastAPI router pour la feature Accessoires Picksy v1.0."""
from __future__ import annotations

import json
import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from supabase import Client

from app.core.supabase import get_supabase_admin
from app.services.accessories_ai import AccessoriesAIService
from app.services.accessories_service import AccessoriesService

logger = logging.getLogger("troviio.accessories_router")
router = APIRouter(prefix="/api/accessories", tags=["accessories"])


# ── Request / Response models ──────────────────────────────────


class AccessoryChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    productId: str | None = None
    productName: str | None = None
    context: list[str] = Field(default_factory=list)


# ── Dependency ───────────────────────────────────────────────


def get_service(supabase: Client = Depends(get_supabase_admin)) -> AccessoriesService:
    return AccessoriesService(supabase)


# ── Endpoints ────────────────────────────────────────────────


@router.get("/categories")
def list_categories(service=Depends(get_service)):
    """Retourne toutes les catégories d'accessoires."""
    return service.list_categories()


@router.get("")
def list_accessories(
    category: str | None = Query(None),
    limit: int = Query(60, ge=1, le=100),
    service=Depends(get_service),
):
    """Retourne la liste des accessoires, filtrée par catégorie (slug)."""
    return service.list_accessories(category_slug=category, limit=limit)


@router.get("/for-product/{product_id}")
def accessories_for_product(product_id: str, service=Depends(get_service)):
    """Retourne les accessoires compatibles pour un produit (UUID)."""
    try:
        return service.get_accessories_for_product(product_id)
    except ValueError as e:
        raise HTTPException(404, str(e))


@router.get("/for-product-slug/{slug}")
def accessories_for_product_slug(slug: str, service=Depends(get_service)):
    """Retourne les accessoires compatibles pour un produit (slug)."""
    try:
        return service.get_accessories_for_product_slug(slug)
    except ValueError as e:
        raise HTTPException(404, str(e))


@router.get("/{slug}")
def accessory_detail(slug: str, service=Depends(get_service)):
    """Retourne le détail d'un accessoire par son slug."""
    try:
        return service.get_accessory_by_slug(slug)
    except ValueError as e:
        raise HTTPException(404, str(e))


@router.post("/chat")
async def accessories_chat(
    payload: AccessoryChatRequest, service=Depends(get_service)
):
    """Chat streaming SSE pour les questions sur les accessoires."""
    db_context = service.build_chat_context(payload.productId, payload.productName)
    ai = AccessoriesAIService()

    async def event_stream():
        try:
            async for token in ai.stream_answer(
                payload.message, db_context, payload.context
            ):
                yield f"data: {token.replace(chr(13), '')}\n\n"
            yield "data: [DONE]\n\n"
        except Exception:
            err = json.dumps({"error": "chat_unavailable"}, ensure_ascii=False)
            yield f"event: error\ndata: {err}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )

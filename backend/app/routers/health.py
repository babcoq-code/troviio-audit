"""
Health check endpoints — Troviio Production
GET /health        → check rapide
GET /health/deep   → check tous composants
"""
import asyncio
import time
from datetime import datetime, timezone
from typing import Any

import redis.asyncio as aioredis
from fastapi import APIRouter, Response, status

router = APIRouter(prefix="/health", tags=["health"])
HEALTH_TIMEOUT = 3.0


@router.get("/deep")
async def health_deep(response: Response):
    """Check complet — DB + Redis en parallèle."""
    from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
    from app.core.config import settings

    start = time.perf_counter()
    components = {}

    # DB check
    try:
        db_start = time.perf_counter()
        engine = create_async_engine(
            settings.SUPABASE_DB_URL.replace("postgresql://", "postgresql+asyncpg://"),
            pool_size=1, max_overflow=0
        )
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            val = result.scalar()
        await engine.dispose()
        components["database"] = {
            "status": "ok" if val == 1 else "error",
            "latency_ms": round((time.perf_counter() - db_start) * 1000, 2),
        }
    except Exception as e:
        components["database"] = {"status": "error", "error": str(e)[:200]}

    # Redis check
    try:
        redis_start = time.perf_counter()
        client = aioredis.from_url(settings.REDIS_URL, socket_timeout=HEALTH_TIMEOUT)
        pong = await asyncio.wait_for(client.ping(), timeout=HEALTH_TIMEOUT)
        info = await client.info("memory")
        await client.close()
        components["redis"] = {
            "status": "ok" if pong else "error",
            "latency_ms": round((time.perf_counter() - redis_start) * 1000, 2),
            "memory_used_mb": round(info.get("used_memory", 0) / 1024 / 1024, 2),
        }
    except Exception as e:
        components["redis"] = {"status": "error", "error": str(e)[:200]}

    # Celery check (best-effort)
    try:
        from app.workers.celery_app import celery_app
        loop = asyncio.get_event_loop()
        ping = await asyncio.wait_for(
            loop.run_in_executor(None, lambda: celery_app.control.ping(timeout=2.0)),
            timeout=HEALTH_TIMEOUT,
        )
        components["celery"] = {
            "status": "ok" if ping else "error",
            "active_workers": len(ping) if ping else 0,
            "workers": [list(w.keys())[0] for w in ping] if ping else [],
        }
    except Exception as e:
        components["celery"] = {"status": "error", "error": str(e)[:200], "active_workers": 0}

    all_healthy = all(c.get("status") == "ok" for c in components.values())
    if not all_healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return {
        "status": "ok" if all_healthy else "degraded",
        "all_healthy": all_healthy,
        "components": components,
        "response_time_ms": round((time.perf_counter() - start) * 1000, 2),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

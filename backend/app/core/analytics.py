"""Middleware d'analytics — logge chaque visite en base et expose les stats."""

import os
import json
import logging
from datetime import datetime, timezone, timedelta
from ipaddress import ip_address, ip_network

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from supabase import create_client

logger = logging.getLogger("troviio.analytics")

SUPABASE_URL = os.getenv("SUPABASE_URL", "os.getenv("SUPABASE_URL", "")")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", os.getenv("SUPABASE_KEY", ""))
sb = create_client(SUPABASE_URL, SUPABASE_KEY)

# Réseaux privés à ignorer
PRIVATE_NETS = [
    ip_network("10.0.0.0/8"),
    ip_network("172.16.0.0/12"),
    ip_network("192.168.0.0/16"),
    ip_network("127.0.0.0/8"),
]


def is_private(ip_str: str) -> bool:
    try:
        addr = ip_address(ip_str.split(",")[0].strip())
        return any(addr in net for net in PRIVATE_NETS)
    except:
        return True  # si invalide, on ignore


class AnalyticsMiddleware:
    """Logge chaque requête HTTP dans la table analytics_logs."""

    @staticmethod
    async def middleware(request: Request, call_next):
        response = await call_next(request)

        # Ignorer les requêtes vers /api/analytics, /health, /static
        path = request.url.path
        if path.startswith(("/api/analytics", "/health")):
            return response

        # Extraire IP réelle (Cloudflare)
        cf_ip = request.headers.get("CF-Connecting-IP", "")
        ip = cf_ip or request.client.host if request.client else ""

        if not ip or is_private(ip):
            return response

        # Log asynchrone en base (fire-and-forget)
        try:
            sb.table("analytics_logs").insert({
                "ip": ip,
                "path": path,
                "method": request.method,
                "user_agent": request.headers.get("User-Agent", "")[:500],
                "referer": request.headers.get("Referer", "")[:500],
                "status_code": response.status_code,
                "visited_at": datetime.now(timezone.utc).isoformat(),
            }).execute()
        except Exception as e:
            logger.warning("Analytics insert failed: %s", e)

        return response

    @staticmethod
    def get_router() -> APIRouter:
        router = APIRouter()

        @router.get("/analytics/stats")
        async def get_stats(days: int = 1):
            """Retourne les stats des derniers N jours."""
            since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

            try:
                # Total visites
                total = sb.table("analytics_logs") \
                    .select("id", count="exact") \
                    .gte("visited_at", since) \
                    .execute()

                # Pages uniques (top 20)
                pages = sb.rpc("analytics_top_pages", {"since_date": since}).execute() \
                    if hasattr(sb, "rpc") else {"data": []}

                # IP uniques par jour
                uniques = sb.table("analytics_logs") \
                    .select("ip", count="exact", head=False) \
                    .gte("visited_at", since) \
                    .execute()

                unique_ips = set()
                if hasattr(uniques, "data"):
                    for row in uniques.data:
                        unique_ips.add(row.get("ip", ""))

                return {
                    "total_visits": getattr(total, "count", len(total.data)) if hasattr(total, "data") else 0,
                    "unique_visitors": len(unique_ips),
                    "period_days": days,
                }
            except Exception as e:
                logger.error("Analytics stats error: %s", e)
                return {"error": str(e)}

        @router.get("/analytics/daily")
        async def get_daily(days: int = 7):
            """Retourne les visites groupées par jour."""
            since = datetime.now(timezone.utc) - timedelta(days=days)

            try:
                rows = sb.table("analytics_logs") \
                    .select("ip, visited_at") \
                    .gte("visited_at", since.isoformat()) \
                    .order("visited_at", desc=True) \
                    .limit(50000) \
                    .execute()

                days_data = {}
                for row in rows.data:
                    day = row["visited_at"][:10]
                    if day not in days_data:
                        days_data[day] = {"visits": 0, "ips": set()}
                    days_data[day]["visits"] += 1
                    days_data[day]["ips"].add(row["ip"])

                result = []
                for day in sorted(days_data.keys()):
                    d = days_data[day]
                    result.append({
                        "date": day,
                        "visits": d["visits"],
                        "uniques": len(d["ips"]),
                    })
                return result
            except Exception as e:
                logger.error("Analytics daily error: %s", e)
                return {"error": str(e)}

        return router

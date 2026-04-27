"""PICKSY — Service pour les accessoires compatibles."""
from __future__ import annotations

import logging
from typing import Any

from supabase import Client

logger = logging.getLogger("troviio.accessories")


class AccessoriesService:
    """Service métier pour les accessoires (batteries, chargeurs, filtres…)."""

    def __init__(self, supabase: Client):
        self.db = supabase

    # ── helpers privés ──────────────────────────────────────────

    def _map_accessory(self, row: dict) -> dict:
        prices = row.get("accessory_prices") or []
        best = None
        sorted_prices = sorted(
            [p for p in prices if p.get("in_stock")],
            key=lambda p: float(p["price"]),
        )
        if sorted_prices:
            best = sorted_prices[0]

        cat = row.get("accessory_categories")
        return {
            "id": row["id"],
            "slug": row["slug"],
            "name": row["name"],
            "brand": row["brand"],
            "category": {
                "id": cat["id"],
                "slug": cat["slug"],
                "name": cat["name"],
                "danger_warning": cat.get("danger_warning"),
            }
            if cat
            else None,
            "imageUrl": row.get("image_url"),
            "description": row.get("description"),
            "qualityBadge": row.get("quality_badge", "recommended"),
            "safetyLevel": row.get("safety_level", "safe"),
            "isOfficial": row.get("is_official", False),
            "isTroviioRecommended": row.get("is_picksy_recommended", True),
            "hasDangerousCopies": row.get("has_dangerous_copies", False),
            "whyAvoidCopies": row.get("why_avoid_copies"),
            "certifications": row.get("certifications") or [],
            "scoreQuality": float(row.get("score_quality", 0)),
            "bestPrice": {
                "merchantName": best["merchant_name"],
                "price": float(best["price"]),
                "currency": best.get("currency", "EUR"),
                "url": best["url"],
                "affiliateUrl": best.get("affiliate_url") or best["url"],
                "inStock": best.get("in_stock", True),
            }
            if best
            else None,
        }

    def _base_query(self):
        return self.db.table("accessories").select(
            "*, accessory_categories(*), accessory_prices(*)"
        )

    # ── API publique ────────────────────────────────────────────

    def list_categories(self) -> list[dict]:
        result = (
            self.db.table("accessory_categories")
            .select("*")
            .order("sort_order")
            .execute()
        )
        return result.data or []

    def list_accessories(
        self, category_slug: str | None = None, limit: int = 60
    ) -> list[dict]:
        q = self._base_query()
        if category_slug:
            cats = (
                self.db.table("accessory_categories")
                .select("id")
                .eq("slug", category_slug)
                .execute()
            )
            if cats.data:
                q = q.eq("category_id", cats.data[0]["id"])
        result = q.order("score_quality", desc=True).limit(limit).execute()
        return [self._map_accessory(r) for r in (result.data or [])]

    def get_accessory_by_slug(self, slug: str) -> dict:
        result = self._base_query().eq("slug", slug).single().execute()
        if not result.data:
            raise ValueError(f"Accessory not found: {slug}")
        return self._map_accessory(result.data)

    def get_accessories_for_product(self, product_id: str) -> dict:
        product = (
            self.db.table("products")
            .select("id, slug, name, brand, model")
            .eq("id", product_id)
            .single()
            .execute()
        )
        if not product.data:
            raise ValueError(f"Product not found: {product_id}")
        return self._build_response(product.data)

    def get_accessories_for_product_slug(self, slug: str) -> dict:
        product = (
            self.db.table("products")
            .select("id, slug, name, brand, model")
            .eq("slug", slug)
            .single()
            .execute()
        )
        if not product.data:
            raise ValueError(f"Product not found: {slug}")
        return self._build_response(product.data)

    def _build_response(self, product: dict) -> dict:
        compat = (
            self.db.table("accessory_product_compatibility")
            .select("accessory_id, score")
            .eq("product_id", product["id"])
            .order("score", desc=True)
            .execute()
        )
        if not compat.data:
            return {
                "product": product,
                "accessories": [],
                "dangerousCopyWarnings": [],
            }

        acc_ids = [r["accessory_id"] for r in compat.data]
        result = (
            self.db.table("accessories")
            .select("*, accessory_categories(*), accessory_prices(*)")
            .in_("id", acc_ids)
            .execute()
        )

        accessories = [self._map_accessory(r) for r in (result.data or [])]
        warnings = []
        seen_cats: set[str] = set()
        for acc in accessories:
            if acc["hasDangerousCopies"] and acc.get("category"):
                cat_slug = acc["category"]["slug"]
                if cat_slug not in seen_cats:
                    seen_cats.add(cat_slug)
                    warnings.append(
                        {
                            "categorySlug": cat_slug,
                            "categoryName": acc["category"]["name"],
                            "warning": acc["category"].get("danger_warning")
                            or "Vérifiez la certification CE.",
                        }
                    )

        return {
            "product": {
                "id": product["id"],
                "slug": product["slug"],
                "name": product["name"],
                "brand": product.get("brand"),
                "model": product.get("model"),
            },
            "accessories": accessories,
            "dangerousCopyWarnings": warnings,
        }

    def build_chat_context(
        self, product_id: str | None, product_name: str | None
    ) -> str:
        lines: list[str] = []
        if product_name:
            lines.append(f"Produit demandé : {product_name}")
        if product_id:
            try:
                prod = (
                    self.db.table("products")
                    .select("id, slug, name, brand, model")
                    .eq("id", product_id)
                    .single()
                    .execute()
                )
                if prod.data:
                    data = self._build_response(prod.data)
                    for acc in data["accessories"][:5]:
                        certs = ", ".join(acc.get("certifications") or []) or "aucune"
                        lines.append(
                            f"- {acc['name']} ({acc['brand']}) — score {acc['scoreQuality']}/100 — certif: {certs}"
                        )
            except Exception:
                pass
        return "\n".join(lines) or "Aucun contexte disponible."

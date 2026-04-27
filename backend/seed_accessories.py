#!/usr/bin/env python3
"""Seed les données de la feature Accessoires Picksy v1.0 dans Supabase.

Utilise upsert sur les clés conflictuelles (slug pour catégories et
accessoires, accessory_id+merchant_name pour les prix, etc.).

Usage :
    python seed_accessories.py
"""
from __future__ import annotations

import asyncio
import os
import re
import sys

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()


def slugify(v: str) -> str:
    # Normaliser les accents
    v = v.replace("é", "e").replace("è", "e").replace("ê", "e").replace("ë", "e")
    v = v.replace("à", "a").replace("â", "a").replace("ä", "a")
    v = v.replace("ù", "u").replace("û", "u").replace("ü", "u")
    v = v.replace("ô", "o").replace("ö", "o")
    v = v.replace("î", "i").replace("ï", "i")
    v = v.replace("ç", "c")
    v = re.sub(r"[^\w\s-]", "", v.lower().strip())
    return re.sub(r"[\s_-]+", "-", v).strip("-")


# ── 8 catégories d'accessoires ──────────────────────────────────

CATEGORIES = [
    {
        "slug": "sacs-filtrants",
        "name": "Sacs filtrants",
        "base_risk_level": "medium",
        "danger_warning": "Les sacs trop fins libèrent la poussière au retrait. Vérifiez la référence exacte.",
        "sort_order": 10,
    },
    {
        "slug": "filtres-hepa",
        "name": "Filtres HEPA",
        "base_risk_level": "medium",
        "danger_warning": "Un faux filtre HEPA peut aggraver les allergies.",
        "sort_order": 20,
    },
    {
        "slug": "brosses-principales",
        "name": "Brosses principales",
        "base_risk_level": "low",
        "danger_warning": "Une brosse mal dimensionnée peut forcer le moteur.",
        "sort_order": 30,
    },
    {
        "slug": "brosses-laterales",
        "name": "Brosses latérales",
        "base_risk_level": "low",
        "sort_order": 40,
    },
    {
        "slug": "lingettes-serpilleres",
        "name": "Lingettes et serpillières",
        "base_risk_level": "low",
        "sort_order": 50,
    },
    {
        "slug": "stations-charge",
        "name": "Stations de charge",
        "base_risk_level": "high",
        "danger_warning": "Évitez les stations non certifiées : risque surchauffe ou charge instable.",
        "sort_order": 60,
    },
    {
        "slug": "batteries",
        "name": "Batteries",
        "base_risk_level": "high",
        "danger_warning": "Les batteries non certifiées CE sont à éviter : risque d'incendie documenté (CPSC 2024).",
        "sort_order": 70,
    },
    {
        "slug": "accessoires-bebe",
        "name": "Accessoires bébé",
        "base_risk_level": "medium",
        "danger_warning": "Vérifiez la compatibilité du châssis avant tout achat.",
        "sort_order": 80,
    },
]

# ── 7 produits (cherchés par slug existant dans Supabase) ────────

PRODUCT_SLUGS = [
    "qrevo-curv",            # Roborock Qrevo Curv
    "s8-maxv-ultra",         # Roborock S8 MaxV Ultra
    "roomba-combo-j9",       # iRobot Roomba Combo J9+
    "roomba-j9",             # iRobot Roomba J9+
    "deebot-x8-pro-omni",    # Ecovacs Deebot X8 Pro Omni
    "x40-ultra-complete",    # Dreame X40 Ultra Complete
    "360-vis-nav",           # Dyson 360 Vis Nav
]

# ── 6 accessoires ──────────────────────────────────────────────

ACCESSORIES = [
    {
        "name": "Kit officiel Roborock Qrevo Curv — brosses + filtres",
        "brand": "Roborock",
        "category_slug": "brosses-principales",
        "quality_badge": "official",
        "safety_level": "safe",
        "is_official": True,
        "is_picksy_recommended": True,
        "has_dangerous_copies": True,
        "why_avoid_copies": "Brosses mal ajustées usent prématurément le robot.",
        "certifications": ["CE"],
        "score_quality": 96,
        "compatible_slugs": ["qrevo-curv", "s8-maxv-ultra"],  # resolved via slug
        "price": 39.99,
        "merchant_name": "Amazon",
        "url": "https://amazon.fr/dp/EXEMPLE",
        "affiliate_url": "https://amazon.fr/?tag=picksy-21",
    },
    {
        "name": "Sacs officiels Roborock — lot de 6",
        "brand": "Roborock",
        "category_slug": "sacs-filtrants",
        "quality_badge": "official",
        "safety_level": "safe",
        "is_official": True,
        "is_picksy_recommended": True,
        "has_dangerous_copies": True,
        "why_avoid_copies": "Un sac trop fin peut relâcher des poussières fines.",
        "certifications": ["CE"],
        "score_quality": 95,
        "compatible_slugs": ["qrevo-curv", "s8-maxv-ultra"],
        "price": 29.99,
        "merchant_name": "Amazon",
        "url": "https://amazon.fr/dp/EXEMPLE2",
        "affiliate_url": "https://amazon.fr/?tag=picksy-21",
    },
    {
        "name": "Filtres HEPA officiels iRobot Roomba série j ×3",
        "brand": "iRobot",
        "category_slug": "filtres-hepa",
        "quality_badge": "official",
        "safety_level": "safe",
        "is_official": True,
        "is_picksy_recommended": True,
        "has_dangerous_copies": True,
        "why_avoid_copies": "Filtres génériques moins étanches, laissent passer plus de poussière fine.",
        "certifications": ["CE"],
        "score_quality": 97,
        "compatible_slugs": ["roomba-combo-j9", "roomba-j9"],
        "price": 29.99,
        "merchant_name": "iRobot",
        "url": "https://irobot.fr/filtres-hepa",
        "affiliate_url": "https://irobot.fr/filtres-hepa?ref=troviio",
    },
    {
        "name": "Kit officiel Dreame X40 — brosses et filtres",
        "brand": "Dreame",
        "category_slug": "brosses-principales",
        "quality_badge": "official",
        "safety_level": "safe",
        "is_official": True,
        "is_picksy_recommended": True,
        "has_dangerous_copies": True,
        "why_avoid_copies": "Brosses centrales mal ajustées → erreurs de rotation.",
        "certifications": ["CE"],
        "score_quality": 95,
        "compatible_slugs": ["x40-ultra-complete"],
        "price": 42.99,
        "merchant_name": "Amazon",
        "url": "https://amazon.fr/dp/EXEMPLE3",
        "affiliate_url": "https://amazon.fr/?tag=picksy-21",
    },
    {
        "name": "Filtre officiel Dyson 360 Vis Nav",
        "brand": "Dyson",
        "category_slug": "filtres-hepa",
        "quality_badge": "official",
        "safety_level": "safe",
        "is_official": True,
        "is_picksy_recommended": True,
        "has_dangerous_copies": True,
        "why_avoid_copies": "Filtres non officiels peuvent mal s'insérer et laisser passer des particules.",
        "certifications": ["CE"],
        "score_quality": 96,
        "compatible_slugs": ["360-vis-nav"],
        "price": 29.00,
        "merchant_name": "Dyson",
        "url": "https://dyson.fr/filtres-360",
        "affiliate_url": "https://dyson.fr/filtres-360?ref=troviio",
    },
    {
        "name": "Batterie officielle Roborock — vérifier référence modèle",
        "brand": "Roborock",
        "category_slug": "batteries",
        "quality_badge": "compatibility_warning",
        "safety_level": "verify",
        "is_official": True,
        "is_picksy_recommended": True,
        "has_dangerous_copies": True,
        "why_avoid_copies": "Batteries génériques non certifiées → risque incendie documenté.",
        "certifications": ["CE", "RoHS", "IEC 62133-2"],
        "score_quality": 88,
        "compatible_slugs": ["qrevo-curv", "s8-maxv-ultra"],
        "price": 89.99,
        "merchant_name": "Roborock",
        "url": "https://fr.roborock.com/batterie",
        "affiliate_url": "https://fr.roborock.com/batterie?ref=troviio",
    },
]


async def main():
    supabase_url = os.environ.get("SUPABASE_URL") or os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        print("❌ SUPABASE_URL et SUPABASE_SERVICE_KEY requis dans .env")
        sys.exit(1)

    supabase = create_client(supabase_url, supabase_key)
    print("🚀 Seed Accessoires Picksy v1.0...\n")

    # ── 1. Catégories ──────────────────────────────────────────
    cat_by_slug: dict[str, dict] = {}
    for cat in CATEGORIES:
        r = (
            supabase.table("accessory_categories")
            .upsert(
                {
                    "slug": cat["slug"],
                    "name": cat["name"],
                    "parent_product_category": "robot_vacuum",
                    "base_risk_level": cat["base_risk_level"],
                    "danger_warning": cat.get("danger_warning"),
                    "sort_order": cat["sort_order"],
                },
                on_conflict="slug",
            )
            .execute()
        )
        if r.data:
            cat_by_slug[cat["slug"]] = r.data[0]
            print(f"  ✓ Catégorie : {cat['name']} ({cat['slug']})")
        else:
            print(f"  ⚠️  Échec insertion catégorie : {cat['name']}")

    # ── 2. Produits (résolus par slug) ─────────────────────────
    prod_by_slug: dict[str, dict] = {}
    for slug in PRODUCT_SLUGS:
        r = supabase.table("products").select("id, slug, name, brand").eq("slug", slug).execute()
        if r.data:
            prod_by_slug[slug] = r.data[0]
            print(f"  ✓ Produit trouvé : {r.data[0]['name']} ({slug})")
        else:
            print(f"  ⚠️  Produit introuvable : {slug}")

    # ── 3. Accessoires ─────────────────────────────────────────
    for acc in ACCESSORIES:
        cat_id = cat_by_slug.get(acc["category_slug"], {}).get("id")
        if not cat_id:
            print(f"  ⚠️  Catégorie introuvable pour : {acc['name']}")
            continue

        acc_slug = slugify(acc["name"])
        r = (
            supabase.table("accessories")
            .upsert(
                {
                    "slug": acc_slug,
                    "name": acc["name"],
                    "brand": acc["brand"],
                    "category_id": cat_id,
                    "quality_badge": acc["quality_badge"],
                    "safety_level": acc["safety_level"],
                    "is_official": acc["is_official"],
                    "is_picksy_recommended": acc["is_picksy_recommended"],
                    "has_dangerous_copies": acc["has_dangerous_copies"],
                    "why_avoid_copies": acc.get("why_avoid_copies"),
                    "certifications": acc["certifications"],
                    "score_quality": acc["score_quality"],
                    "merchant_url": acc["url"],
                    "affiliate_url": acc["affiliate_url"],
                },
                on_conflict="slug",
            )
            .execute()
        )
        if not r.data:
            print(f"  ⚠️  Échec insertion accessoire : {acc['name']}")
            continue

        saved_acc = r.data[0]
        print(f"  ✓ Accessoire : {acc['name']}")

        # ── Prix ─────────────────────────────────────────────
        # Supprime l'ancien prix puis insert (pas de contrainte unique composite)
        supabase.table("accessory_prices").delete().eq("accessory_id", saved_acc["id"]).eq(
            "merchant_name", acc["merchant_name"]
        ).execute()
        supabase.table("accessory_prices").insert(
            {
                "accessory_id": saved_acc["id"],
                "merchant_name": acc["merchant_name"],
                "price": acc["price"],
                "currency": "EUR",
                "url": acc["url"],
                "affiliate_url": acc["affiliate_url"],
                "in_stock": True,
            },
        ).execute()

        # ── Compatibilités ─────────────────────────────────
        for comp_slug in acc["compatible_slugs"]:
            prod = prod_by_slug.get(comp_slug)
            if not prod:
                print(f"    ⚠️  Slug produit non trouvé : {comp_slug}")
                continue
            supabase.table("accessory_product_compatibility").upsert(
                {
                    "accessory_id": saved_acc["id"],
                    "product_id": prod["id"],
                    "compatibility_status": "compatible",
                    "score": acc["score_quality"],
                    "notes": "Compatibilité vérifiée par Picksy.",
                },
                on_conflict="accessory_id,product_id",
            ).execute()

    print("\n✅ Seed terminé avec succès !")


if __name__ == "__main__":
    asyncio.run(main())

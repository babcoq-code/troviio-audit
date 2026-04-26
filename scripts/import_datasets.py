#!/usr/bin/env python3
"""
Import all products from JSON datasets into Supabase products table.
Uses the Supabase Python SDK with service_role key.
"""

import json
import os
import re
import sys
import unicodedata
import time
from supabase import create_client

# ─── Configuration ───────────────────────────────────────────────────────────

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://uukshxztoztkwxuuvqzc.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY",
    os.environ.get("SUPABASE_SERVICE_KEY", ""))

BASE_DIR = "/opt/picksy/frontend/src/data"

CATEGORY_MAP = {
    "micro_ondes": {
        "id": "b12c74f2-2938-48eb-9696-9f0cea78e277",
        "name_fr": "Four / Micro-ondes",
    },
    "tv_oled": {
        "id": "6c9e7f55-f3c2-4d37-99e3-ee7b9800f53b",
        "name_fr": "TV OLED",
    },
    "laptops_etudiants": {
        "id": "aa82a9ca-4693-4590-9663-70ec47ace114",
        "name_fr": "Ordinateur Étudiant",
    },
    "refrigerateurs_combines": {
        "id": "84d9b80d-c93d-494f-8734-61ed071ea8d4",
        "name_fr": "Réfrigérateur",
    },
}

FILES = [
    "micro-ondes-s1s2.json",
    "micro-ondes-s3s4.json",
    "tv-oled-s1s2.json",
    "tv-oled-s3s4.json",
    "laptops-etudiants-s1s2.json",
    "laptops-etudiants-s3s4.json",
    "refrigerateurs-combines.json",
]


# ─── Helpers ─────────────────────────────────────────────────────────────────

def slugify(text):
    text = str(text).lower().strip()
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    text = re.sub(r"-+", "-", text)
    return text


def generate_slug(brand, model, product_id=None):
    if product_id and isinstance(product_id, str) and not _is_uuid(product_id):
        return slugify(product_id)
    if brand and model:
        s = slugify(f"{brand} {model}")
        if s:
            return s
    if product_id:
        return slugify(str(product_id))
    return slugify(f"{brand}-{model}")


def _is_uuid(value):
    if not isinstance(value, str):
        return False
    return bool(re.match(
        r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        value, re.IGNORECASE
    ))


def process_micro_ondes(produits, category_id):
    results = []
    for p in produits:
        name = f"{p['marque']} {p['modele']}"
        slug = generate_slug(p.get("marque"), p.get("modele"), p.get("id"))
        estimated_score = None
        use_case_scores = {}
        scores_data = p.get("scores", {})
        if scores_data:
            use_case_scores = dict(scores_data)
            num_scores = []
            for k, v in scores_data.items():
                if isinstance(v, str) and "/" in v:
                    try:
                        n = float(v.split("/")[0]) / float(v.split("/")[1]) * 100
                        num_scores.append(n)
                    except (ValueError, ZeroDivisionError):
                        pass
                elif isinstance(v, (int, float)):
                    num_scores.append(float(v))
            if num_scores:
                estimated_score = round(sum(num_scores) / len(num_scores), 1)
        specs = {k: v for k, v in {
            "annee": p.get("annee"), "segment": p.get("segment"), "type": p.get("type"),
            "technologie": p.get("technologie"), "puissance_w": p.get("puissance_w"),
            "puissance_gril_w": p.get("puissance_gril_w"), "capacite_l": p.get("capacite_l"),
            "pose": p.get("pose"), "plateau": p.get("plateau"), "interieur": p.get("interieur"),
            "smart": p.get("smart"), "niveau_bruit": p.get("niveau_bruit"),
        }.items() if v is not None}
        price_eur = p.get("prix_min") or p.get("prix_max")
        record = {
            "category_id": category_id, "name": name, "brand": p["marque"],
            "model": p.get("modele"), "slug": slug,
            "summary": p.get("verdict", ""), "best_for": p.get("pour_qui", ""),
            "price_eur": price_eur, "estimated_score": estimated_score,
            "use_case_scores": use_case_scores, "specs": specs,
            "is_active": True, "status": "published", "verdict": p.get("verdict", ""),
        }
        if scores_data:
            record["ratings"] = scores_data
        results.append(record)
    return results


def process_tv_oled(produits, category_id):
    results = []
    for p in produits:
        name = f"{p['marque']} {p['modele']}"
        slug = generate_slug(p.get("marque"), p.get("modele"), p.get("id"))
        use_case_scores = {}
        rtings_note = p.get("note_rtings")
        if rtings_note and isinstance(rtings_note, str):
            use_case_scores["rtings"] = rtings_note
        specs = {k: v for k, v in {
            "annee": p.get("annee"), "segment": p.get("segment"),
            "type_dalle": p.get("type_dalle"), "resolution": p.get("resolution"),
            "tailles_pouces": p.get("tailles_pouces"),
            "frequence_hz": p.get("frequence_hz"),
            "hdmi_21": p.get("hdmi_21"), "hdmi_20": p.get("hdmi_20"),
            "dolby_vision": p.get("dolby_vision"),
            "dolby_vision_gaming": p.get("dolby_vision_gaming"),
            "hdr10_plus": p.get("hdr10_plus"),
            "hdr10": p.get("hdr10"), "hlg": p.get("hlg"),
            "gsync": p.get("gsync"), "freesync": p.get("freesync"),
            "allm": p.get("allm"), "vrr": p.get("vrr"),
            "dolby_atmos": p.get("dolby_atmos"),
            "input_lag_4k120_ms": p.get("input_lag_4k120_ms"),
            "input_lag_4k60_ms": p.get("input_lag_4k60_ms"),
            "lum_hdr_peak_nits": p.get("lum_hdr_peak_nits"),
            "lum_sdr_peak_nits": p.get("lum_sdr_peak_nits"),
            "os": p.get("os"), "audio_watts": p.get("audio_watts"),
            "ecran": p.get("ecran"), "ambilight": p.get("ambilight"),
            "one_connect_box": p.get("one_connect_box"),
            "zero_connect_box": p.get("zero_connect_box"),
            "usage_principal": p.get("usage_principal"),
            "profil_ideal": p.get("profil_ideal"),
        }.items() if v is not None}
        price_par_taille = p.get("prix_eur_par_taille", {})
        price_eur = None
        if price_par_taille:
            all_prices = []
            for size, prices in price_par_taille.items():
                if isinstance(prices, (list, tuple)) and len(prices) >= 1:
                    all_prices.append(prices[0])
            if all_prices:
                price_eur = int(min(all_prices))
        estimated_score = None
        if rtings_note and isinstance(rtings_note, str):
            nums = re.findall(r"(\d+)", rtings_note)
            if nums:
                estimated_score = int(nums[0])
        record = {
            "category_id": category_id, "name": name, "brand": p["marque"],
            "model": p.get("modele"), "slug": slug,
            "summary": p.get("verdict", ""), "best_for": p.get("pour_qui", ""),
            "price_eur": price_eur, "estimated_score": estimated_score,
            "use_case_scores": use_case_scores, "specs": specs,
            "pros": p.get("points_forts"), "cons": p.get("points_faibles"),
            "is_active": True, "status": "published", "verdict": p.get("verdict", ""),
        }
        results.append(record)
    return results


def process_laptops_etudiants(produits, category_id):
    results = []
    for p in produits:
        name = f"{p['marque']} {p['modele']}"
        slug = generate_slug(p.get("marque"), p.get("modele"), p.get("id"))
        use_case_scores = {}
        scores_data = p.get("scores", {})
        if scores_data:
            use_case_scores = dict(scores_data)
        estimated_score = None
        if scores_data:
            num_scores = []
            for k, v in scores_data.items():
                if isinstance(v, str) and "/" in v:
                    try:
                        n = float(v.split("/")[0]) / float(v.split("/")[1]) * 100
                        num_scores.append(n)
                    except (ValueError, ZeroDivisionError):
                        pass
                elif isinstance(v, (int, float)):
                    num_scores.append(float(v))
            if num_scores:
                estimated_score = round(sum(num_scores) / len(num_scores), 1)
        specs = {k: v for k, v in {
            "annee": p.get("annee"), "segment": p.get("segment"),
            "os": p.get("os"), "puce_cpu": p.get("puce_cpu"),
            "architecture": p.get("architecture"),
            "ram_go": p.get("ram_go"), "ssd_go": p.get("ssd_go"),
            "ecran_pouces": p.get("ecran_pouces"),
            "ecran_resolution": p.get("ecran_resolution"),
            "ecran_type": p.get("ecran_type"), "ecran_hz": p.get("ecran_hz"),
            "ecran_nits": p.get("ecran_nits"), "ecran_ratio": p.get("ecran_ratio"),
            "gpu_type": p.get("gpu_type"), "gpu_modele": p.get("gpu_modele"),
            "autonomie_heures_reel": p.get("autonomie_heures_reel"),
            "poids_kg": p.get("poids_kg"), "hdmi_natif": p.get("hdmi_natif"),
            "usb_a": p.get("usb_a"), "usb_c": p.get("usb_c"),
            "thunderbolt": p.get("thunderbolt"), "magsafe": p.get("magsafe"),
            "wifi_gen": p.get("wifi_gen"), "clavier_retro": p.get("clavier_retro"),
            "webcam": p.get("webcam"), "ecran_tactile": p.get("ecran_tactile"),
            "convertible_2in1": p.get("convertible_2in1"),
            "filiere": p.get("filiere"), "usage_principal": p.get("usage_principal"),
            "mobilite": p.get("mobilite"), "autonomie_amphi": p.get("autonomie_amphi"),
        }.items() if v is not None}
        price_eur = p.get("prix_min") or p.get("prix_max")
        record = {
            "category_id": category_id, "name": name, "brand": p["marque"],
            "model": p.get("modele"), "slug": slug,
            "summary": p.get("verdict", ""), "best_for": p.get("pour_qui", ""),
            "price_eur": price_eur, "estimated_score": estimated_score,
            "use_case_scores": use_case_scores, "specs": specs,
            "pros": p.get("points_forts"), "cons": p.get("points_faibles"),
            "is_active": True, "status": "published", "verdict": p.get("verdict", ""),
        }
        results.append(record)
    return results


def process_refrigerateurs(produits, category_id):
    results = []
    for p in produits:
        name = f"{p['marque']} {p['modele']}"
        slug = generate_slug(p.get("marque"), p.get("modele"), p.get("id"))
        use_case_scores = {}
        estimated_score = None
        scores_data = p.get("scores", {})
        if scores_data:
            use_case_scores = dict(scores_data)
            picksy_score = scores_data.get("picksy")
            if picksy_score is not None:
                estimated_score = float(picksy_score)
        specs = {k: v for k, v in {
            "type": p.get("type"), "capacite_totale": p.get("capacite_totale"),
            "capacite_frigo": p.get("capacite_frigo"),
            "capacite_congelateur": p.get("capacite_congelateur"),
            "classe_energetique": p.get("classe_energetique"),
            "consommation": p.get("consommation"),
            "type_froid": p.get("type_froid"), "niveau_sonore": p.get("niveau_sonore"),
            "zone_fraicheur": p.get("zone_fraicheur"), "wifi": p.get("wifi"),
            "couleurs": p.get("couleurs"), "no_frost": p.get("no_frost"),
            "garantie": p.get("garantie"), "segment": p.get("segment"),
            "distributeur_eau_glace": p.get("distributeur_eau_glace"),
            "porte_reversible": p.get("porte_reversible"),
        }.items() if v is not None}
        price_eur = p.get("prix_min") or p.get("prix_max")
        record = {
            "category_id": category_id, "name": name, "brand": p["marque"],
            "model": p.get("modele"), "slug": slug,
            "summary": p.get("verdict", ""), "best_for": p.get("pour_qui", ""),
            "price_eur": price_eur, "estimated_score": estimated_score,
            "use_case_scores": use_case_scores, "specs": specs,
            "is_active": True, "status": "published", "verdict": p.get("verdict", ""),
        }
        results.append(record)
    return results


# ─── Main import ─────────────────────────────────────────────────────────────

def main():
    print("Connecting to Supabase...", file=sys.stderr)
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Connected!", file=sys.stderr)

    total_imported = 0
    total_skipped = 0
    total_errors = 0
    total_products = 0

    for filename in FILES:
        filepath = os.path.join(BASE_DIR, filename)
        if not os.path.exists(filepath):
            print(f"⚠️ File not found: {filepath}")
            continue

        print(f"\n{'='*60}\n📂 {filename}\n{'='*60}")

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        meta = data.get("meta", {})
        categorie = meta.get("categorie", "unknown")
        produits = data.get("produits", [])

        if not produits:
            print(f"  ⚠️ No products found")
            continue

        total_products += len(produits)
        print(f"  Category: {categorie} ({len(produits)} products)")

        cat_info = CATEGORY_MAP.get(categorie)
        if not cat_info:
            print(f"  ❌ Unknown category: {categorie}")
            continue

        category_id = cat_info["id"]
        print(f"  Mapping to: {cat_info['name_fr']}")

        if categorie == "micro_ondes":
            products = process_micro_ondes(produits, category_id)
        elif categorie == "tv_oled":
            products = process_tv_oled(produits, category_id)
        elif categorie == "laptops_etudiants":
            products = process_laptops_etudiants(produits, category_id)
        elif categorie == "refrigerateurs_combines":
            products = process_refrigerateurs(produits, category_id)
        else:
            print(f"  ❌ No processor for: {categorie}")
            continue

        imported = 0
        skipped = 0
        errors = 0

        for i, record in enumerate(products):
            slug = record["slug"]
            name = record["name"]

            print(f"  [{i+1}/{len(products)}] {name} (slug: {slug})...", end=" ")

            try:
                # Use upsert via the SDK
                result = supabase.table("products").upsert(
                    record,
                    on_conflict="slug"
                ).execute()

                if result.data and len(result.data) > 0:
                    imported += 1
                    rid = result.data[0].get("id", "?")[:8]
                    print(f"✅ id={rid}")
                else:
                    errors += 1
                    print(f"❌ No data returned")
            except Exception as e:
                err_msg = str(e)
                # If slug conflict, try alternate
                if "slug" in err_msg.lower() and ("unique" in err_msg.lower() or "duplicate" in err_msg.lower()):
                    print("⚠️ Slug conflict, trying alternate...", end=" ")
                    for suffix in range(1, 10):
                        record["slug"] = f"{slug}-{suffix}"
                        try:
                            result2 = supabase.table("products").upsert(
                                record, on_conflict="slug"
                            ).execute()
                            if result2.data and len(result2.data) > 0:
                                imported += 1
                                print(f"✅ slug={record['slug']}")
                                break
                        except Exception:
                            continue
                    else:
                        errors += 1
                        print("❌ Failed all alternates")
                else:
                    errors += 1
                    print(f"❌ {err_msg[:100]}")

            time.sleep(0.1)

        total_imported += imported
        total_skipped += skipped
        total_errors += errors
        print(f"  📊 File: {imported} imported, {skipped} skipped, {errors} errors")

    print(f"\n{'='*60}")
    print(f"📊 FINAL SUMMARY")
    print(f"{'='*60}")
    print(f"  Products in datasets: {total_products}")
    print(f"  Imported:            {total_imported}")
    print(f"  Skipped:             {total_skipped}")
    print(f"  Errors:              {total_errors}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()

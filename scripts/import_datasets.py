#!/usr/bin/env python3
"""
PICKSY — Import générique de datasets produits dans Supabase.

Usage:
  # Importer par dataset (détection auto du format)
  python3 scripts/import_datasets.py data/la-linge-data.json

  # Importer avec mapping explicite
  python3 scripts/import_datasets.py data/la-linge-data.json --map lave-linge

  # Forcer l'upsert (slug conflict → màj)
  python3 scripts/import_datasets.py data/la-linge-data.json --upsert

Fonctionne avec n'importe quel fichier JSON contenant un tableau
d'objets produits sous la clé "modeles" ou "produits".
"""

import json, os, re, sys, unicodedata, time
from supabase import create_client

# ─── Config ────────────────────────────────────────────────────

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://uukshxztoztkwxuuvqzc.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_KEY", "")
CATEGORY_ID = ""  # détecté depuis le mapping ou passé en arg

# Mapping catégorie : { "slug_dataset": { "id": "uuid", "name": "name" } }
# Rempli automatiquement depuis Supabase + slug détecté
CATEGORY_CACHE = {}


def slugify(text: str) -> str:
    """Génère un slug URL-safe depuis n'importe quel texte."""
    text = unicodedata.normalize("NFKD", str(text).lower())
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return re.sub(r"-+", "-", text)


def find_category(supabase, dataset_slug: str):
    """Trouve une catégorie par slug ou nom. La crée si inexistante."""
    name_map = {
        "micro-ondes": "Four / Micro-ondes",
        "micro_ondes": "Four / Micro-ondes",
        "tv-oled": "TV OLED",
        "tv_oled": "TV OLED",
        "laptops-etudiants": "Ordinateur Étudiant",
        "laptops_etudiants": "Ordinateur Étudiant",
        "refrigerateurs": "Réfrigérateur",
        "refrigerateurs-combines": "Réfrigérateur",
        "lave-linge": "Lave-linge",
        "lave_linge": "Lave-linge",
        "aspirateurs-robots": "Robot Aspirateur",
        "robot-aspirateur": "Robot Aspirateur",
    }
    name = name_map.get(dataset_slug, dataset_slug.replace("-", " ").title())
    cat_slug = slugify(name)

    # Chercher existant
    try:
        r = supabase.table("categories").select("id, name_fr, slug, emoji").eq("slug", cat_slug).execute()
        if r.data:
            return r.data[0]
        # Chercher par nom
        r2 = supabase.table("categories").select("id, name_fr, slug, emoji").ilike("name_fr", f"%{name}%").execute()
        if r2.data:
            return r2.data[0]
    except Exception as e:
        print(f"  ⚠️ Cat lookup error: {e}", file=sys.stderr)

    # Créer
    emoji_map = {
        "micro-ondes": "🔲", "tv-oled": "📺",
        "laptops-etudiants": "💻", "refrigerateurs": "❄️",
        "lave-linge": "🧺", "robot-aspirateur": "🤖",
    }
    emoji = next((v for k, v in emoji_map.items() if k in cat_slug), "📦")
    try:
        r = supabase.table("categories").insert({
            "slug": cat_slug, "name_fr": name, "emoji": emoji,
        }).execute()
        if r.data:
            print(f"  ✅ Catégorie créée : {name} ({emoji})", file=sys.stderr)
            return r.data[0]
    except Exception as e:
        print(f"  ❌ Création catégorie échouée: {e}", file=sys.stderr)
    return {"id": "", "name_fr": name, "slug": cat_slug}


def extract_products(data: dict, dataset_slug: str):
    """Extrait et normalise les produits depuis n'importe quel format."""
    items = data.get("modeles") or data.get("produits") or []
    if not items:
        print("  ❌ Aucun produit trouvé (clés 'modeles' ou 'produits')", file=sys.stderr)
        return []

    records = []
    for item in items:
        # Détection du format
        brand = item.get("marque") or item.get("brand") or ""
        model = item.get("modele") or item.get("model") or item.get("reference") or ""
        name = item.get("nom") or item.get("name") or f"{brand} {model}".strip()
        slug = item.get("slug") or slugify(brand + " " + model) or slugify(name)

        estimated_score = item.get("estimated_score") or item.get("score_100") or \
                          item.get("picksy", {}).get("score_100") or None
        price_eur = item.get("price_eur") or item.get("prix_eur") or \
                    item.get("prix_min") or item.get("prix_max") or None
        if isinstance(price_eur, float):
            price_eur = int(round(price_eur))
        elif isinstance(price_eur, str):
            try:
                price_eur = int(float(re.sub(r"[^\d.]", "", price_eur)))
            except ValueError:
                price_eur = None

        specs = item.get("specs") or {}
        picksy = item.get("picksy") or {}
        profil = item.get("profil") or {}
        scores = item.get("scores") or {}

        use_case_scores = {}
        if scores and isinstance(scores, dict):
            use_case_scores.update(scores)
        for bf in picksy.get("best_for", item.get("best_for", [])):
            if isinstance(bf, str) and bf not in use_case_scores:
                use_case_scores[bf] = 8.0

        pros = item.get("pros") or item.get("points_forts") or picksy.get("points_forts") or []
        cons = item.get("cons") or item.get("points_faibles") or picksy.get("points_faibles") or []

        records.append({
            "name": name,
            "brand": brand,
            "model": model,
            "slug": slug,
            "estimated_score": estimated_score,
            "price_eur": price_eur,
            "use_case_scores": use_case_scores,
            "specs": specs,
            "pros": pros if pros else [],
            "cons": cons if cons else [],
            "summary": picksy.get("verdict", item.get("verdict", item.get("summary", ""))),
            "best_for": picksy.get("pour_qui", item.get("best_for", "")),
            "verdict": picksy.get("verdict", item.get("verdict", "")),
            "why_perfect": picksy.get("pour_qui", item.get("why_perfect", "")),
            "is_active": True,
            "status": "published",
        })
    return records


def main():
    if len(sys.argv) < 2:
        print(__doc__, file=sys.stderr)
        sys.exit(1)

    filepath = sys.argv[1]
    upsert = "--upsert" in sys.argv

    if not os.path.exists(filepath):
        print(f"❌ Fichier introuvable : {filepath}", file=sys.stderr)
        sys.exit(1)

    # Détection du slug dataset depuis le nom du fichier
    basename = os.path.splitext(os.path.basename(filepath))[0]
    dataset_slug = slugify(basename.replace("_", "-").replace(" ", "-"))
    # Nettoyer : enlever les suffixes -s1s2, -s3s4, -v1, etc
    dataset_slug = re.sub(r"-s[1234]s?[234]?$", "", dataset_slug)
    dataset_slug = re.sub(r"-v\d+(?:\.\d+)?$", "", dataset_slug)
    dataset_slug = re.sub(r"-202[0-9]+$", "", dataset_slug)

    print(f"📂 {basename}", file=sys.stderr)
    print(f"   → slug dataset: {dataset_slug}", file=sys.stderr)

    with open(filepath) as f:
        data = json.load(f)

    meta = data.get("meta", {})
    categorie = meta.get("categorie", meta.get("category", dataset_slug))
    if isinstance(categorie, dict):
        categorie = categorie.get("slug", categorie.get("name", ""))

    print(f"   → catégorie détectée: {categorie}", file=sys.stderr)

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    cat = find_category(supabase, str(categorie))
    category_id = cat.get("id", "")
    print(f"   → catégorie DB: {cat.get('name_fr', '?')} (id: {category_id})", file=sys.stderr)

    if not category_id:
        print("❌ Impossible de déterminer la catégorie", file=sys.stderr)
        sys.exit(1)

    records = extract_products(data, dataset_slug)
    if not records:
        print("❌ Aucun produit à importer", file=sys.stderr)
        sys.exit(1)

    # Inject category_id
    for rec in records:
        rec["category_id"] = category_id

    print(f"\n📊 {len(records)} produits à importer", file=sys.stderr)
    imported = errors = 0
    for i, rec in enumerate(records):
        slug = rec["slug"]
        name = rec["name"]
        print(f"  [{i+1}/{len(records)}] {name} (slug: {slug})...", end=" ", file=sys.stderr)

        try:
            if upsert:
                r = supabase.table("products").upsert(rec, on_conflict="slug").execute()
            else:
                r = supabase.table("products").insert(rec).execute()
            if r.data:
                imported += 1
                print("✅", file=sys.stderr)
            else:
                errors += 1
                print("❌", file=sys.stderr)
        except Exception as e:
            errors += 1
            print(f"❌ {str(e)[:100]}", file=sys.stderr)
        time.sleep(0.08)

    print(f"\n{'='*50}", file=sys.stderr)
    print(f"✅ {imported} importés, {errors} erreurs", file=sys.stderr)
    print(f"📁 {filepath}", file=sys.stderr)
    print(f"🏷️  {cat.get('name_fr', '?')} ({cat.get('slug', '?')})", file=sys.stderr)
    print(f"{'='*50}\n", file=sys.stderr)

    # Aussi stdout pour parsing
    print(json.dumps({
        "imported": imported, "errors": errors,
        "file": filepath, "category": cat.get("name_fr", ""),
        "category_id": category_id,
    }))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Recherche des ASINs Amazon FR pour les accessoires Troviio sans lien Amazon,
et met à jour Supabase avec les liens affiliés troviio-21.

Utilise Firecrawl pour scraper les résultats de recherche Amazon FR.
Traite par lots de 5 pour éviter de surcharger Firecrawl.
"""
from __future__ import annotations

import asyncio
import os
import re
import sys
import time
import json
import urllib.parse

import httpx
from supabase import create_client

# ── Configuration ──────────────────────────────────────────────
SUPABASE_URL = "https://uukshxztoztkwxuuvqzc.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
FIRECRAWL_API_KEY = "fc-9a84607462b546dcb4a4276681cec366"
AMAZON_TAG = "troviio-21"
BATCH_SIZE = 5
DELAY_BETWEEN_REQUESTS = 1.5  # seconds
TIMEOUT_SECONDS = 45

FIRECRAWL_HEADERS = {
    "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
    "Content-Type": "application/json",
}

# Noms alternatifs de recherche pour certains accessoires (plus précis)
SEARCH_OVERRIDES = {
    "filtre-à-charbon-pour-hotte-falmec-2en1": "Filtre à charbon Falmec hotte 2en1",
    "filtre-anticalcaire-pour-cafetiere-senseo": "Filtre anticalcaire Senseo",
    "chargeur-batterie-li-ion-universel": "Chargeur batterie Li-ion universel",
    "nettoyant-joint-silicone-lave-linge-500ml": "Nettoyant joint silicone lave linge",
    "mousse-à-mémoire-de-forme-pour-coussinets-de-casque": "Mousse mémoire de forme coussinets casque audio",
    "support-mural-inclinable-pour-barre-de-son": "Support mural inclinable barre de son",
    "sac-de-transport-rembourré-pour-enceinte-bluetooth": "Sac transport rembourré enceinte bluetooth",
    "kit-de-joints-détanchéité-pour-robot-cuiseur": "Kit joints étanchéité robot cuiseur",
    "kit-déclairage-led-avant-et-arrière-pour-trottinette": "Kit éclairage LED trottinette électrique",
    "antivol-en-u-renforcé-pour-trottinette-électrique": "Antivol U renforcé trottinette électrique",
    "batterie-lithium-ion-36v-14ah-pour-vélo-électrique": "Batterie lithium ion 36V 14Ah vélo électrique",
    "chargeur-rapide-48v-2a-pour-batterie-vélo-électrique": "Chargeur rapide 48V 2A batterie vélo électrique",
    "kit-de-conversion-vélo-électrique-36v-250w": "Kit conversion vélo électrique 36V 250W",
    "protège-matelas-imperméable-100%-coton": "Protège matelas imperméable coton",
    "surmatelas-en-mousse-à-mémoire-de-forme-5cm": "Surmatelas mousse mémoire de forme 5cm",
    "sommier-à-lattes-ajustable-pour-matelas": "Sommier lattes ajustable matelas",
    "plat-tournant-en-verre-pour-four-micro-ondes": "Plat tournant verre four micro-ondes",
    "kit-de-2-filtres-à-charbon-pour-micro-ondes": "Filtre charbon micro-ondes",
    "support-de-fixation-murale-pour-micro-ondes": "Support fixation murale micro-ondes",
    "station-de-charge-usb-c-multiport-7-en-1-pour-ordinateur-por": "Station charge USB C multiport 7 en 1 ordinateur portable",
    "sac-à-dos-étanche-pour-ordinateur-portable-15.6-pouces": "Sac à dos étanche ordinateur portable 15.6 pouces",
    "batterie-externe-haute-capacité-26800mah-pour-ordinateur-por": "Batterie externe 26800mAh ordinateur portable",
    "chargeur-rapide-usb-c-20w-pour-smartphone": "Chargeur rapide USB C 20W smartphone",
    "film-protecteur-en-verre-trempé-pour-écran": "Film protecteur verre trempé écran smartphone",
    "support-magnétique-pour-voiture": "Support magnétique voiture smartphone",
    "panier-de-rechange-pour-friteuse-à-air": "Panier rechange friteuse air",
    "support-mural-orientable-pour-tv-32-65-pouces": "Support mural TV orientable 32 65 pouces",
    "bloc-multiprise-parafoudre-8-prises-avec-protection-tv": "Bloc multiprise parafoudre 8 prises",
    "moule-silicone-pour-friteuse-à-air-20cm": "Moule silicone friteuse air 20cm",
    "nettoyant-écran-lcd-led-avec-chiffon-microfibre": "Nettoyant écran LCD LED chiffon microfibre",
    "papier-sulfurise-perfore-pour-friteuse-à-air-lot-100": "Papier sulfurisé perforé friteuse air 100",
    "support-mural-pour-casque-audio": "Support mural casque audio",
    "câble-hdmi-2.1-8k-2m-haute-vitesse": "Câble HDMI 2.1 8K 2m",
    "support-mural-universel-pour-barre-de-son": "Support mural universel barre de son",
    "caisson-de-basses-sans-fil-supplementaire": "Caisson basses sans fil supplémentaire",
    "film-verre-trempe-pour-ecran-smartphone-9h": "Film verre trempé écran smartphone 9H",
    "chargeur-rapide-gan-65w-usb-c": "Chargeur rapide GaN 65W USB C",
    "support-voiture-magnetique-pour-smartphone": "Support voiture magnétique smartphone",
    "rouleau-brosse-de-rechange-pour-aspirateur-laveur": "Rouleau brosse rechange aspirateur laveur",
    "solution-nettoyante-concentree-pour-aspirateur-laveur-1l": "Solution nettoyante aspirateur laveur 1L",
    "filtre-hepa-de-rechange-pour-aspirateur-laveur": "Filtre HEPA rechange aspirateur laveur",
    "ecouteurs-de-rechange-mousse-à-memoire-de-forme": "Écouteurs rechange mousse mémoire forme",
    "sac-a-dos-gaming-17-pouces": "Sac à dos gaming 17 pouces",
    "tapis-de-souris-gaming-xl": "Tapis souris gaming XL",
    "support-refroidisseur-laptop-gaming": "Support refroidisseur laptop gaming",
    "casque-gaming-sans-fil-7-1": "Casque gaming sans fil 7.1",
    "câble-audio-jack-3.5mm-tresse-1.2m": "Câble audio jack 3.5mm tresse",
}


def build_search_url(query: str) -> str:
    """Construit une URL de recherche Amazon FR."""
    encoded = urllib.parse.quote_plus(query)
    return f"https://www.amazon.fr/s?k={encoded}"


def extract_asins_from_html(html: str) -> list[str]:
    """Extrait les ASINs du HTML d'une page de résultats Amazon via divers patterns."""
    asins = set()
    
    # Pattern 1: data-asin attribute (most common on search result cards)
    matches = re.findall(r'data-asin="([A-Z0-9]{10})"', html)
    asins.update(matches)
    
    # Pattern 2: /dp/ASIN URLs
    matches = re.findall(r'/dp/([A-Z0-9]{10})(?:[/?\#"]|$)', html)
    asins.update(matches)
    
    # Pattern 3: product/B0XXXXXXXXX in URLs
    matches = re.findall(r'/product/([A-Z0-9]{10})(?:[/?\#"]|$)', html)
    asins.update(matches)
    
    # Pattern 4: ean=ASIN or ASIN in various Amazon formats
    matches = re.findall(r'[?&]asin=([A-Z0-9]{10})(?:[&\s"\']|$)', html)
    asins.update(matches)
    
    # Filter to valid ASINs (B0 prefixed, 10 chars)
    valid = [a for a in asins if a.startswith("B0") and len(a) == 10]
    
    return valid


async def scrape_with_firecrawl(url: str) -> str | None:
    """Scrape une URL via Firecrawl et retourne le contenu HTML."""
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
            payload = {
                "url": url,
                "formats": ["rawHtml"],
                "onlyMainContent": False,
            }
            response = await client.post(
                "https://api.firecrawl.dev/v1/scrape",
                headers=FIRECRAWL_HEADERS,
                json=payload,
            )
            if response.status_code != 200:
                print(f"    ⚠️  Firecrawl returned {response.status_code}: {response.text[:200]}")
                return None
            
            data = response.json()
            if not data.get("success"):
                print(f"    ⚠️  Firecrawl error: {data.get('error', str(data)[:200])}")
                return None
            
            raw_html = data.get("data", {}).get("rawHtml")
            return raw_html
            
    except httpx.TimeoutException:
        print(f"    ⚠️  Firecrawl timeout for {url}")
        return None
    except Exception as e:
        print(f"    ⚠️  Firecrawl error: {e}")
        return None


def find_best_asin(asins: list[str], html: str, search_query: str) -> str | None:
    """
    Trouve le meilleur ASIN parmi ceux trouvés.
    Priorise celui qui apparaît avec le nom du produit dans le contexte.
    """
    if not asins:
        return None
    
    # Si un seul ASIN, on le prend
    if len(asins) == 1:
        return asins[0]
    
    # Chercher l'ASIN qui a le plus de mots-clés de la requête dans son contexte
    query_terms = set(search_query.lower().split())
    
    best_asin = None
    best_score = 0
    
    for asin in asins:
        # Trouver le contexte autour de l'ASIN
        pattern = re.escape(asin)
        matches = list(re.finditer(pattern, html))
        
        score = 0
        for m in matches:
            start = max(0, m.start() - 500)
            end = min(len(html), m.end() + 500)
            context = html[start:end].lower()
            
            # Compter combien de termes de la requête apparaissent dans le contexte
            for term in query_terms:
                if len(term) > 2 and term in context:
                    score += 1
        
        if score > best_score:
            best_score = score
            best_asin = asin
    
    # Si aucun n'a de score, prendre le premier
    if best_asin is None:
        best_asin = asins[0]
    
    return best_asin


async def find_asin_for_accessory(name: str, slug: str) -> str | None:
    """Trouve l'ASIN Amazon FR pour un accessoire donné via Firecrawl."""
    
    # Utiliser le nom de recherche personnalisé ou construire à partir du nom
    search_query = SEARCH_OVERRIDES.get(slug, name)
    
    # Enlever les parenthèses, guillemets, etc.
    search_query = re.sub(r'[\(\)\[\]\{\}"\'«»]', '', search_query).strip()
    
    # Si le nom contient "—", on prend juste la partie avant
    search_query = search_query.split("—")[0].strip()
    
    print(f"    🔍 Recherche: '{search_query}'")
    
    search_url = build_search_url(search_query)
    html = await scrape_with_firecrawl(search_url)
    
    if not html:
        # Essayer une recherche plus simple
        simpler = search_query.split("—")[0].strip() if "—" in search_query else search_query
        simpler = re.sub(r'\b(pour|de|du|des|en|au|aux|le|la|les)\b', '', simpler).strip()
        simpler = re.sub(r'\s+', ' ', simpler).strip()
        if simpler and simpler != search_query:
            print(f"    🔍 Retry simpler: '{simpler}'")
            search_url = build_search_url(simpler)
            html = await scrape_with_firecrawl(search_url)
        
        if not html:
            return None
    
    # Extraire les ASINs
    asins = extract_asins_from_html(html)
    
    if not asins:
        print(f"    ⚠️  Aucun ASIN trouvé pour '{search_query}'")
        return None
    
    # Filtrer pour ne garder que les ASINs valides (B0...)
    valid_asins = [a for a in asins if a.startswith("B0") and len(a) == 10]
    
    if not valid_asins:
        print(f"    ⚠️  ASINs trouvés mais aucun valide (B0...): {asins[:5]}")
        return None
    
    # Prendre le meilleur ASIN
    best = find_best_asin(valid_asins, html, search_query)
    
    print(f"    ✅ ASIN trouvé: {best}")
    
    return best


async def update_supabase(supabase, accessory_id: str, asin: str):
    """Met à jour merchant_url et affiliate_url dans Supabase."""
    url = f"https://www.amazon.fr/dp/{asin}?tag={AMAZON_TAG}"
    try:
        r = (
            supabase.table("accessories")
            .update({
                "merchant_url": url,
                "affiliate_url": url,
            })
            .eq("id", accessory_id)
            .execute()
        )
        if r.data:
            return True
        else:
            print(f"    ⚠️  Supabase update returned no data: {r}")
            return False
    except Exception as e:
        print(f"    ❌ Supabase update error: {e}")
        return False


async def main():
    print("🚀 Démarrage de la recherche d'ASINs Amazon FR...")
    print(f"   Batch size: {BATCH_SIZE}, Delay: {DELAY_BETWEEN_REQUESTS}s\n")
    
    # Initialiser Supabase
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Récupérer tous les accessoires sans lien Amazon
    r = supabase.table("accessories").select("id, slug, name, merchant_url, affiliate_url").execute()
    all_accessories = []
    
    for a in r.data:
        mu = a.get("merchant_url") or ""
        au = a.get("affiliate_url") or ""
        if "amazon" not in mu.lower() and "amazon" not in au.lower():
            all_accessories.append(a)
    
    total = len(all_accessories)
    print(f"📊 Accessoires sans lien Amazon: {total}\n")
    
    if total == 0:
        print("✅ Rien à faire - tous les accessoires ont déjà des liens Amazon.")
        return
    
    stats = {"success": 0, "failed": 0}
    
    # Traiter par lots
    for i in range(0, total, BATCH_SIZE):
        batch = all_accessories[i:i + BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        total_batches = (total + BATCH_SIZE - 1) // BATCH_SIZE
        
        print(f"\n{'='*60}")
        print(f"📦 Lot {batch_num}/{total_batches} (items {i+1}-{min(i+BATCH_SIZE, total)})")
        print(f"{'='*60}")
        
        for acc in batch:
            name = acc["name"]
            slug = acc["slug"]
            acc_id = acc["id"]
            
            print(f"\n  📌 {name}")
            
            # Chercher l'ASIN
            asin = await find_asin_for_accessory(name, slug)
            
            if asin:
                # Mettre à jour Supabase
                success = await update_supabase(supabase, acc_id, asin)
                if success:
                    print(f"  ✅ Mis à jour: https://www.amazon.fr/dp/{asin}?tag={AMAZON_TAG}")
                    stats["success"] += 1
                else:
                    print(f"  ❌ Échec mise à jour Supabase pour ASIN {asin}")
                    stats["failed"] += 1
            else:
                print(f"  ❌ Aucun ASIN trouvé pour '{name}'")
                stats["failed"] += 1
            
            # Délai entre les requêtes
            await asyncio.sleep(DELAY_BETWEEN_REQUESTS)
        
        # Délai plus long entre les lots
        if i + BATCH_SIZE < total:
            print(f"\n  ⏳ Pause de 3 secondes avant le prochain lot...")
            await asyncio.sleep(3)
    
    # Résumé final
    print(f"\n{'='*60}")
    print(f"📊 RÉSULTATS FINAUX")
    print(f"{'='*60}")
    print(f"   ✅ Succès: {stats['success']}")
    print(f"   ❌ Échecs: {stats['failed']}")
    print(f"   📝 Total: {total}")
    print(f"\n{'='*60}")
    
    # Vérifier combien ont maintenant un lien Amazon
    r = supabase.table("accessories").select("id, slug, name, merchant_url").execute()
    with_amazon = sum(1 for a in r.data if a.get("merchant_url") and "amazon" in a["merchant_url"].lower())
    print(f"\n📊 Accessoires avec lien Amazon maintenant: {with_amazon}/{len(r.data)}")


if __name__ == "__main__":
    asyncio.run(main())

#!/usr/bin/env python3
"""Insère de nouveaux guides longtail dans la table seo_pages de Supabase."""

import http.client
import json

SUPABASE_URL = "uukshxztoztkwxuuvqzc.supabase.co"
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

def supabase_post(path, data):
    conn = http.client.HTTPSConnection(SUPABASE_URL)
    headers = {
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    body = json.dumps(data)
    conn.request('POST', f'/rest/v1/{path}', body=body, headers=headers)
    res = conn.getresponse()
    return res.status, res.read().decode()

# Les nouveaux guides à insérer
new_guides = [
    {
        "category_slug": "aspirateur-robot",
        "page_slug": "maison-etage",
        "h1": "Robot aspirateur pour maison à étage : les meilleurs modèles 2026",
        "meta_title": "Robot aspirateur pour maison à étage 2026 - Sélection Troviio",
        "meta_description": "Quel robot aspirateur pour une maison avec escaliers et plusieurs niveaux ? Notre sélection des modèles avec cartographie multi-étages et navigation intelligente.",
        "intro_text": "Une maison à étage, c'est le double de surface à nettoyer... mais aussi le double de défis pour un robot aspirateur. Monter les escaliers ? Il ne peut pas (encore). Mais cartographier chaque niveau, mémoriser les zones interdites, et nettoyer étage par étage sur demande : ça, oui. Découvrez les robots qui gèrent les maisons à plusieurs niveaux sans perdre le nord.",
        "faq_json": [
            {"question": "Un robot aspirateur peut-il monter les escaliers ?", "answer": "Non, aucun robot aspirateur actuel ne monte les escaliers. Il faut déplacer le robot manuellement entre les étages ou en avoir un par niveau."},
            {"question": "Comment un robot gère-t-il plusieurs étages ?", "answer": "Les robots haut de gamme sauvegardent plusieurs cartes (une par étage). Il suffit de le déplacer, il reconnaît automatiquement où il est et charge la bonne carte."},
            {"question": "Faut-il une station par étage ?", "answer": "Idéalement oui, mais vous pouvez aussi avoir une station au rez-de-chaussée et déplacer le robot à l'étage pour un nettoyage ponctuel (il reviendra à la station quand vous le remettrez à sa place)."},
            {"question": "Quel budget pour un robot multi-étages ?", "answer": "Comptez minimum 500€ pour un modèle avec cartographie multi-niveaux fiable. Les meilleurs (Dreame X50, Roborock Qrevo) commencent autour de 700-800€."}
        ],
        "keywords": ["robot aspirateur maison étage", "aspirateur robot escaliers", "robot aspirateur multi-étages", "robot aspirateur plusieurs niveaux", "cartographie multi-niveaux"]
    },
    {
        "category_slug": "aspirateur-robot",
        "page_slug": "parquet-fragile",
        "h1": "Robot aspirateur pour parquet fragile : les modèles qui rayent pas",
        "meta_title": "Robot aspirateur pour parquet fragile 2026 - Guide Troviio",
        "meta_description": "Vous avez un parquet qui se raye au moindre choc ? Découvrez les robots aspirateurs avec roues caoutchouc, brosses douces et capteurs de pression adaptés aux sols fragiles.",
        "intro_text": "Le parquet, c'est comme une relation à distance : beau mais fragile, et une erreur peut tout ruiner. Roues dures, brosses qui grattent, chocs contre les meubles : votre robot peut laisser des marques. Heureusement, certains modèles sont conçus pour les sols délicats. On a vérifié les spécifications et les retours pour vous.",
        "faq_json": [
            {"question": "Les robots aspirateurs rayent-ils le parquet ?", "answer": "Les modèles récents avec roues en caoutchouc et détection des sols durs ne rayent pas. Évitez ceux avec des roues en plastique dur ou des brosses latérales rigides."},
            {"question": "Quelle différence entre brosse silicone et brosse à poils ?", "answer": "Les brosses en silicone sont plus douces pour le parquet et s'emmêlent moins avec les cheveux. Les brosses à poils sont plus efficaces sur moquette mais peuvent rayer."}
        ],
        "keywords": ["robot aspirateur parquet", "aspirateur robot sol fragile", "robot aspirateur parquet massif", "robot aspirateur qui ne raye pas", "brosse silicone parquet"]
    },
    {
        "category_slug": "aspirateur-robot",
        "page_slug": "silencieux-appartement",
        "h1": "Robot aspirateur silencieux pour appartement 2026",
        "meta_title": "Robot aspirateur silencieux pour appartement - Top 2026 | Troviio",
        "meta_description": "Voisins, bébé, télétravail : le bruit d'un aspirateur robot peut être gênant. Notre sélection des modèles les plus silencieux (sous 65 dB) pour nettoyer sans déranger.",
        "intro_text": "Vous habitez en appartement et vous avez des voisins ? Ou un bébé qui dort comme un loir... jusqu'à ce que l'aspirateur s'enclenche à 14h ? Bonne nouvelle : certains robots aspirent si discrètement qu'on les entend moins que votre frigo. Mauvaise nouvelle : le silence a un prix. Voici ceux qui nettoient sans faire de scandale.",
        "faq_json": [
            {"question": "Quel est le niveau sonore idéal pour un appartement ?", "answer": "Visez sous 65 dB en mode normal. Pour référence : 60 dB = conversation normale, 70 dB = aspirateur classique. En dessous de 60 dB, le robot est quasi imperceptible."},
            {"question": "Un robot silencieux aspire-t-il moins bien ?", "answer": "Pas forcément. Des marques comme Roborock et Narwal ont optimisé l'aérodynamique pour aspirer efficacement à bas régime. En Boost ils feront du bruit, mais en Auto c'est très discret."}
        ],
        "keywords": ["robot aspirateur silencieux", "aspirateur robot appartement", "robot aspirateur pas bruyant", "robot aspirateur 60 dB", "robot aspirateur voisins"]
    },
    {
        "category_slug": "tv",
        "page_slug": "65-pouces-recul-3m",
        "h1": "TV OLED 65 pouces pour recul de 3 mètres : le guide 2026",
        "meta_title": "TV 65 pouces recul 3 mètres - Guide d'achat 2026 | Troviio",
        "meta_description": "Vous avez 3 mètres entre votre canapé et votre TV ? La taille idéale c'est 65 pouces. Notre sélection des meilleurs modèles OLED pour une expérience cinéma à cette distance.",
        "intro_text": "3 mètres. C'est la distance entre votre canapé et votre mur. C'est aussi la distance parfaite pour un écran 65 pouces selon la SMPTE (la société qui sait de quoi elle parle). Pas assez ? Vous lirez pas les sous-titres. Trop ? Vous verrez les pixels. 65 pouces à 3 mètres, c'est le sweet spot, comme les nuggets avec la sauce barbecue. On vous a trouvé les meilleurs." ,
        "faq_json": [
            {"question": "65 pouces à 3 mètres c'est trop grand ?", "answer": "C'est la taille recommandée par les experts. À 3 mètres, un 55 pouces vous semblera petit après une semaine. Le 65 pouces offre un angle de vision d'environ 30°, idéal pour une expérience immersive sans fatigue oculaire."},
            {"question": "OLED ou Mini LED à 3 mètres ?", "answer": "OLED, sans hésitation. Les noirs infinis et les contrastes font toute la différence sur une grande diagonale. Le Mini LED est bon, mais l'OLED reste le roi du salon de cinéma."}
        ],
        "keywords": ["TV 65 pouces recul 3 mètres", "TV OLED 65 pouces distance canapé", "quelle taille TV pour 3 mètres", "65 pouces distance salon"]
    },
    {
        "category_slug": "tv",
        "page_slug": "sport-foot-2026",
        "h1": "TV OLED pour le sport et la coupe du monde 2026",
        "meta_title": "Meilleure TV pour le sport 2026 - Foot, F1, Rugby | Troviio",
        "meta_description": "Vous voulez voir le ballon filer sans effet de flou ? Notre guide des meilleures TV pour le sport : OLED 120Hz, taux de rafraîchissement, temps de réponse et compensation de mouvement.",
        "intro_text": "La Coupe du Monde 2026 approche. Et si vous regardez le match sur une TV d'il y a 5 ans, vous ratez probablement la moitié de l'action. Entre le ballon qui devient une comète floue sur les centres et les buts que vous voyez 2 secondes après votre voisin (merci le lag), il est temps d'upgrader. On a sélectionné les TV qui font du sport un vrai spectacle.",
        "faq_json": [
            {"question": "OLED ou QLED pour regarder le foot ?", "answer": "OLED pour les noirs (stade de nuit, pelouse qui ressort) et les contrastes. Mais en pièce lumineuse, un bon QLED (Samsung S90D/S95F) peut être plus adapté."},
            {"question": "120 Hz c'est indispensable pour le sport ?", "answer": "Pour le foot à la télé, le 50/60 Hz suffit. Le 120 Hz devient important pour les sports rapides (F1, tennis, hockey) et surtout pour les jeux vidéo."}
        ],
        "keywords": ["TV pour le sport 2026", "TV foot coupe du monde", "meilleure TV sport", "OLED 120Hz sport", "TV sans flou mouvement"]
    },
    {
        "category_slug": "tv",
        "page_slug": "gaming-120hz-pas-cher-ps5",
        "h1": "TV OLED 120Hz pas chère pour PS5 et Xbox : le guide budget 2026",
        "meta_title": "TV OLED 120Hz pas cher pour PS5/Xbox 2026 | Troviio",
        "meta_description": "Vous voulez profiter du 120Hz sur votre PS5 sans vendre un rein ? Notre sélection des TV OLED 120Hz les moins chères du marché, avec HDMI 2.1 et VRR.",
        "intro_text": "Avoir une PS5 sans TV 120Hz, c'est comme acheter une Ferrari et ne jamais passer la seconde. Mais les TV OLED 120Hz avec HDMI 2.1, c'est souvent le prix d'une voiture d'occasion. Bonne nouvelle : en 2026, l'entrée de gamme OLED a tellement baissé que vous pouvez avoir du 120Hz pour moins de 900€. On a dégotté les perles rares.",
        "faq_json": [
            {"question": "Quel est le prix minimum pour une TV OLED 120Hz ?", "answer": "Comptez environ 800-900€ pour un modèle d'entrée de gamme 2025 en 55 pouces (LG B5, Samsung S85F). En 2026 ça descend encore."},
            {"question": "HDMI 2.1 c'est obligatoire pour la PS5 ?", "answer": "Pour le 120Hz en 4K, oui, c'est obligatoire. Vérifiez que la TV a au moins 2 ports HDMI 2.1 pour relier PS5 et Xbox."}
        ],
        "keywords": ["TV OLED 120Hz pas cher", "TV PS5 120Hz budget", "TV gaming HDMI 2.1 pas cher", "TV 4K 120Hz moins de 1000€"]
    },
]

# Check existing
conn = http.client.HTTPSConnection(SUPABASE_URL)
headers = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json'
}

existing_resp = {}
for g in new_guides:
    key = f"{g['category_slug']}/{g['page_slug']}"
    conn.request('GET', f"/rest/v1/seo_pages?select=id&category_slug=eq.{g['category_slug']}&page_slug=eq.{g['page_slug']}", headers=headers)
    res = conn.getresponse()
    data = json.loads(res.read().decode())
    existing_resp[key] = len(data) > 0

# Insert new ones
for g in new_guides:
    key = f"{g['category_slug']}/{g['page_slug']}"
    if existing_resp[key]:
        print(f"  ⏭️  EXISTE DÉJÀ: {key}")
    else:
        status, body = supabase_post('seo_pages', g)
        if status in (200, 201):
            print(f"  ✅ INSÉRÉ: {key}")
        else:
            print(f"  ❌ ERREUR {status}: {key} → {body[:100]}")

print(f"\nTotal nouveaux: {len([k for k,v in existing_resp.items() if not v])} insérés")
print(f"Total déjà existants: {len([k for k,v in existing_resp.items() if v])}")

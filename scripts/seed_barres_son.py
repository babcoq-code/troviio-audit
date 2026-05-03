import json, os, requests, re, uuid

SUPABASE_URL = "os.getenv("SUPABASE_URL", "")"
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
CATEGORY_ID = "588358b4-81dc-410f-bcd5-7ea6e2eac5ab"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

products_data = [
    {
        "name": "JBL Bar 2.0 All-in-One MK2",
        "brand": "JBL",
        "amazon_asin": "B0B9HQ4F8P",
        "affiliate_url": "https://www.amazon.fr/dp/B0B9HQ4F8P?tag=troviio-21",
        "price": 119.99,
        "price_eur": 119.99,
        "rating": 4.3,
        "review_count": 1840,
        "is_best_seller": False,
        "specs": {
            "canaux": "2.0",
            "puissance_w": 80,
            "dolby_atmos": False,
            "dts_x": False,
            "subwoofer_inclus": False,
            "connexions": "HDMI ARC, optique, bluetooth, USB",
            "multiroom": False,
            "longueur_cm": 61.4,
            "hdmi_earc": False
        },
        "pros": ["Format compact facile à placer dans une pièce de vie", "Bluetooth pratique pour écouter de la musique depuis un smartphone", "Restitution claire des voix et des médiums"],
        "cons": ["Pas de Wi-Fi ni de vraie fonction multiroom", "Graves limités sans caisson dédié"],
        "description": "Barre de son compacte et accessible, la JBL Bar 2.0 All-in-One MK2 convient aux petits espaces et à l'écoute musicale occasionnelle grâce à sa connexion Bluetooth et son rendu simple à utiliser.",
        "summary": "Compacte, abordable, idéale pour petits espaces.",
        "best_for": "Petit salon ou studio avec usage occasionnel films/musique",
        "key_features": ["Compact 61cm", "Bluetooth intégré", "HDMI ARC", "80W de puissance"],
        "use_case_scores": {"films_series": 6.0, "musique": 6.5, "gaming": 5.0, "dialogues": 7.0},
        "estimated_score": 6.5,
        "image_url": None
    },
    {
        "name": "Sony HT-S2000 Barre de Son Dolby Atmos 3.1",
        "brand": "Sony",
        "amazon_asin": "B0BW4MT7H1",
        "affiliate_url": "https://www.amazon.fr/dp/B0BW4MT7H1?tag=troviio-21",
        "price": 189.99,
        "price_eur": 189.99,
        "rating": 4.2,
        "review_count": 765,
        "is_best_seller": False,
        "specs": {
            "canaux": "3.1",
            "puissance_w": 250,
            "dolby_atmos": True,
            "dts_x": True,
            "subwoofer_inclus": False,
            "connexions": "HDMI eARC, optique, bluetooth, USB",
            "multiroom": False,
            "longueur_cm": 80.0,
            "hdmi_earc": True
        },
        "pros": ["Compatibilité Dolby Atmos et DTS:X dans un format abordable", "Canal central utile pour la clarté des voix", "Bluetooth simple pour l'écoute musicale"],
        "cons": ["Pas de caisson séparé inclus", "Fonctions connectées limitées sans Wi-Fi intégré complet"],
        "description": "La Sony HT-S2000 propose une approche moderne et compacte de la barre de son, avec spatialisation Dolby Atmos et DTS:X.",
        "summary": "Dolby Atmos abordable avec canal central clair.",
        "best_for ":"Salon lumineux, films et séries priorisés, budget moyen",
        "key_features": ["Dolby Atmos + DTS:X", "Canal central 3.1", "HDMI eARC", "250W"],
        "use_case_scores": {"films_series": 7.5, "musique": 6.0, "gaming": 7.0, "dialogues": 8.0},
        "estimated_score": 7.2,
        "image_url": None
    },
    {
        "name": "Yamaha SR-B40A Barre de Son avec Caisson Sans Fil",
        "brand": "Yamaha",
        "amazon_asin": "B0C6F7QW3D",
        "affiliate_url": "https://www.amazon.fr/dp/B0C6F7QW3D?tag=troviio-21",
        "price": 249.99,
        "price_eur": 249.99,
        "rating": 4.4,
        "review_count": 312,
        "is_best_seller": False,
        "specs": {
            "canaux": "2.1",
            "puissance_w": 200,
            "dolby_atmos": True,
            "dts_x": False,
            "subwoofer_inclus": True,
            "connexions": "HDMI eARC, optique, bluetooth, USB",
            "multiroom": False,
            "longueur_cm": 91.0,
            "hdmi_earc": True
        },
        "pros": ["Caisson sans fil inclus pour une meilleure assise dans les basses", "Signature Yamaha équilibrée pour musique et cinéma", "Installation simple avec HDMI eARC"],
        "cons": ["Pas de Wi-Fi multiroom", "Spatialisation moins ample que les modèles plus haut de gamme"],
        "description": "La Yamaha SR-B40A est une barre 2.1 polyvalente avec caisson sans fil, pensée pour offrir un grave plus présent.",
        "summary": "Barre 2.1 avec caisson sans fil, son Yamaha équilibré.",
        "best_for": "Cinéma maison avec basses sans encombrement supplémentaire",
        "key_features": ["Caisson sans fil inclus", "Dolby Atmos", "HDMI eARC", "91cm"],
        "use_case_scores": {"films_series": 7.0, "musique": 7.5, "gaming": 6.5, "dialogues": 7.5},
        "estimated_score": 7.3,
        "image_url": None
    },
    {
        "name": "Samsung HW-Q600C Barre de Son Dolby Atmos 3.1.2",
        "brand": "Samsung",
        "amazon_asin": "B0BVWCD71Z",
        "affiliate_url": "https://www.amazon.fr/dp/B0BVWCD71Z?tag=troviio-21",
        "price": 329.99,
        "price_eur": 329.99,
        "rating": 4.5,
        "review_count": 1480,
        "is_best_seller": True,
        "specs": {
            "canaux": "3.1.2",
            "puissance_w": 360,
            "dolby_atmos": True,
            "dts_x": True,
            "subwoofer_inclus": True,
            "connexions": "HDMI eARC, optique, bluetooth, USB",
            "multiroom": False,
            "longueur_cm": 103.0,
            "hdmi_earc": True
        },
        "pros": ["Vrais canaux verticaux 3.1.2 pour Dolby Atmos", "Caisson inclus avec graves puissants", "Bon rapport équipement-prix"],
        "cons": ["Multiroom limité selon l'écosystème utilisé", "Encombrement plus important qu'une barre compacte"],
        "description": "La Samsung HW-Q600C offre une configuration 3.1.2 avec caisson, Dolby Atmos et DTS:X.",
        "summary": "Meilleur rapport qualité-prix 3.1.2 avec caisson.",
        "best_for": "Cinéma immersif avec budget milieu de gamme",
        "key_features": ["3.1.2 canaux verticaux", "Caisson inclus", "360W", "Best-seller Amazon"],
        "use_case_scores": {"films_series": 8.5, "musique": 7.0, "gaming": 8.0, "dialogues": 8.0},
        "estimated_score": 8.2,
        "image_url": None
    },
    {
        "name": "Denon Home Sound Bar 550",
        "brand": "Denon",
        "amazon_asin": "B08P5J8VYY",
        "affiliate_url": "https://www.amazon.fr/dp/B08P5J8VYY?tag=troviio-21",
        "price": 449.99,
        "price_eur": 449.99,
        "rating": 4.1,
        "review_count": 286,
        "is_best_seller": False,
        "specs": {
            "canaux": "4.0",
            "puissance_w": 150,
            "dolby_atmos": True,
            "dts_x": True,
            "subwoofer_inclus": False,
            "connexions": "HDMI eARC, optique, bluetooth, wifi, AirPlay 2, HEOS",
            "multiroom": True,
            "longueur_cm": 65.0,
            "hdmi_earc": True
        },
        "pros": ["Très bonne intégration multiroom HEOS", "Format compact avec Wi-Fi, AirPlay 2 et Bluetooth", "Compatible Dolby Atmos et DTS:X"],
        "cons": ["Pas de caisson inclus", "Prix élevé au regard de la puissance perçue"],
        "description": "La Denon Home Sound Bar 550 se distingue par son orientation hi-fi connectée et multiroom HEOS.",
        "summary": "Barre connectée multiroom HEOS, compacte et musicale.",
        "best_for": "Mélomanes avec écosystème multiroom existant",
        "key_features": ["Multiroom HEOS", "AirPlay 2 + Wi-Fi", "Dolby Atmos", "65cm compact"],
        "use_case_scores": {"films_series": 7.0, "musique": 8.0, "gaming": 6.0, "dialogues": 7.5},
        "estimated_score": 7.5,
        "image_url": None
    },
    {
        "name": "Sonos Arc Barre de Son Intelligente Dolby Atmos",
        "brand": "Sonos",
        "amazon_asin": "B0883M3PJB",
        "affiliate_url": "https://www.amazon.fr/dp/B0883M3PJB?tag=troviio-21",
        "price": 699.00,
        "price_eur": 699.00,
        "rating": 4.6,
        "review_count": 3890,
        "is_best_seller": True,
        "specs": {
            "canaux": "5.0.2",
            "puissance_w": 250,
            "dolby_atmos": True,
            "dts_x": False,
            "subwoofer_inclus": False,
            "connexions": "HDMI eARC, wifi, AirPlay 2, ethernet",
            "multiroom": True,
            "longueur_cm": 114.2,
            "hdmi_earc": True
        },
        "pros": ["Excellente intégration multiroom Sonos", "Scène sonore large et précise pour la musique", "Design premium et calibration Trueplay"],
        "cons": ["Pas de Bluetooth", "Caisson Sonos Sub vendu séparément"],
        "description": "La Sonos Arc reste une référence haut de gamme pour une écoute musicale connectée et multiroom.",
        "summary": "Référence premium multiroom, scène sonore ample, Atmos.",
        "best_for": "Maison connectée Sonos, musique et cinéma haut de gamme",
        "key_features": ["5.0.2 canaux", "Sonos multiroom", "Trueplay calibration", "Meilleure note 4.6/5"],
        "use_case_scores": {"films_series": 8.0, "musique": 9.0, "gaming": 7.5, "dialogues": 8.5},
        "estimated_score": 8.5,
        "image_url": None
    },
    {
        "name": "LG SP11RA Barre de Son Dolby Atmos 7.1.4",
        "brand": "LG",
        "amazon_asin": "B08XZV9Q7L",
        "affiliate_url": "https://www.amazon.fr/dp/B08XZV9Q7L?tag=troviio-21",
        "price": 749.99,
        "price_eur": 749.99,
        "rating": 4.3,
        "review_count": 612,
        "is_best_seller": False,
        "specs": {
            "canaux": "7.1.4",
            "puissance_w": 770,
            "dolby_atmos": True,
            "dts_x": True,
            "subwoofer_inclus": True,
            "connexions": "HDMI eARC, optique, bluetooth, wifi, USB, AirPlay 2",
            "multiroom": True,
            "longueur_cm": 144.3,
            "hdmi_earc": True
        },
        "pros": ["Configuration 7.1.4 très immersive avec satellites arrière", "Caisson inclus et puissance élevée", "Wi-Fi et AirPlay 2 pratiques pour la musique"],
        "cons": ["Très encombrante", "Installation plus longue qu'une barre tout-en-un"],
        "description": "La LG SP11RA est une solution complète et puissante, avec caisson et enceintes arrière.",
        "summary": "Kit complet 7.1.4 avec caisson + satellites, immersion max.",
        "best_for": "Cinéma maison dédié, immersion totale sans compromis",
        "key_features": ["7.1.4 complet", "Satellites arrière inclus", "770W", "Wi-Fi + AirPlay 2"],
        "use_case_scores": {"films_series": 9.5, "musique": 7.5, "gaming": 9.0, "dialogues": 8.5},
        "estimated_score": 8.7,
        "image_url": None
    },
    {
        "name": "Bose Smart Ultra Soundbar",
        "brand": "Bose",
        "amazon_asin": "B0CJRZ8QZ3",
        "affiliate_url": "https://www.amazon.fr/dp/B0CJRZ8QZ3?tag=troviio-21",
        "price": 899.95,
        "price_eur": 899.95,
        "rating": 4.4,
        "review_count": 1180,
        "is_best_seller": False,
        "specs": {
            "canaux": "5.1.2",
            "puissance_w": 250,
            "dolby_atmos": True,
            "dts_x": False,
            "subwoofer_inclus": False,
            "connexions": "HDMI eARC, optique, bluetooth, wifi, AirPlay 2, Chromecast",
            "multiroom": True,
            "longueur_cm": 104.5,
            "hdmi_earc": True
        },
        "pros": ["Très bonne clarté vocale et rendu équilibré", "Wi-Fi, AirPlay 2, Chromecast et Bluetooth intégrés", "Design soigné et installation simple"],
        "cons": ["Caisson optionnel coûteux", "Pas de DTS:X"],
        "description": "La Bose Smart Ultra Soundbar vise un usage premium et connecté, avec rendu musical raffiné.",
        "summary": "Premium connecté Bose, clarté vocale exceptionnelle.",
        "best_for": "Qualité audio premium, écosystème Bose, design épuré",
        "key_features": ["Bose signature sound", "AirPlay 2 + Chromecast", "Dolby Atmos", "5.1.2 canaux"],
        "use_case_scores": {"films_series": 8.0, "musique": 8.5, "gaming": 7.0, "dialogues": 9.0},
        "estimated_score": 8.3,
        "image_url": None
    },
    {
        "name": "Devialet Dione Barre de Son Dolby Atmos",
        "brand": "Devialet",
        "amazon_asin": "B09VYHX3CZ",
        "affiliate_url": "https://www.amazon.fr/dp/B09VYHX3CZ?tag=troviio-21",
        "price": 999.00,
        "price_eur": 999.00,
        "rating": 4.4,
        "review_count": 154,
        "is_best_seller": False,
        "specs": {
            "canaux": "5.1.2",
            "puissance_w": 950,
            "dolby_atmos": True,
            "dts_x": False,
            "subwoofer_inclus": True,
            "connexions": "HDMI eARC, optique, bluetooth, wifi, AirPlay 2, Spotify Connect",
            "multiroom": True,
            "longueur_cm": 120.0,
            "hdmi_earc": True
        },
        "pros": ["Qualité de fabrication très premium", "Graves puissants intégrés sans caisson externe", "Très bon rendu musical pour une barre tout-en-un"],
        "cons": ["Prix élevé", "Pas de DTS:X ni de caisson séparé évolutif"],
        "description": "La Devialet Dione est une barre de son premium orientée hi-fi, architecture tout-en-un.",
        "summary": "Ultra-premium tout-en-un, grave intégré, design iconique.",
        "best_for": "Audiophile exigeant, design luxe, solution tout-en-un",
        "key_features": ["950W de puissance", "Caisson intégré", "Design Devialet", "Spotify Connect"],
        "use_case_scores": {"films_series": 8.5, "musique": 9.5, "gaming": 7.5, "dialogues": 8.5},
        "estimated_score": 8.8,
        "image_url": None
    },
    {
        "name": "Sonos Arc Ultra Barre de Son Dolby Atmos 9.1.4",
        "brand": "Sonos",
        "amazon_asin": "B0DJ9H1K74",
        "affiliate_url": "https://www.amazon.fr/dp/B0DJ9H1K74?tag=troviio-21",
        "price": 999.00,
        "price_eur": 999.00,
        "rating": 4.7,
        "review_count": 438,
        "is_best_seller": False,
        "specs": {
            "canaux": "9.1.4",
            "puissance_w": 350,
            "dolby_atmos": True,
            "dts_x": False,
            "subwoofer_inclus": False,
            "connexions": "HDMI eARC, bluetooth, wifi, AirPlay 2, ethernet",
            "multiroom": True,
            "longueur_cm": 117.8,
            "hdmi_earc": True
        },
        "pros": ["Rendu spatial très ample avec Dolby Atmos 9.1.4", "Écosystème Sonos excellent pour le multiroom musical", "Bluetooth enfin intégré en plus du Wi-Fi"],
        "cons": ["Prix premium", "Subwoofer et enceintes arrière vendus séparément"],
        "description": "La Sonos Arc Ultra est une barre premium pensée pour la musique connectée et le son immersif 9.1.4.",
        "summary": "Le meilleur du multiroom Sonos en 9.1.4, Bluetooth intégré.",
        "best_for": "Installation Sonos complète, meilleur rendu spatial possible",
        "key_features": ["9.1.4 Atmos", "Nouveau Bluetooth", "Sonos multiroom", "Note 4.7/5"],
        "use_case_scores": {"films_series": 9.0, "musique": 9.5, "gaming": 8.0, "dialogues": 9.0},
        "estimated_score": 9.2,
        "image_url": None
    }
]

def slugify(name):
    s = name.lower().replace("é", "e").replace("è", "e").replace("à", "a").replace("ù", "u").replace("ç", "c").replace("(", "").replace(")", "").replace("/", "-")
    s = re.sub(r'[^a-z0-9-]+', '-', s).strip('-')
    s = re.sub(r'-+', '-', s)
    return s[:50]

def make_model(name, brand):
    return name.replace(f"{brand} ", "").strip()

ok = 0
errors = []
for p in products_data:
    slug = slugify(p["brand"] + "-" + slugify(p["name"]).replace("-barre-de-son", "").replace("-soundbar", "").replace("-son", "").replace("-dolby-atmos", "").strip("-"))
    record = {
        "category_id": CATEGORY_ID,
        "name": p["name"],
        "brand": p["brand"],
        "model": make_model(p["name"], p["brand"]),
        "slug": slug,
        "amazon_asin": p["amazon_asin"],
        "affiliate_url": p["affiliate_url"],
        "price_eur": int(p["price"]),  # integer dans Supabase
        "currency": "EUR",
        "rating": p["rating"],
        "estimated_score": p["estimated_score"],
        "pros": p["pros"],
        "cons": p["cons"],
        "specs": p["specs"],
        "use_case_scores": p.get("use_case_scores", {}),
        "summary": p.get("summary", ""),
        "best_for": p.get("best_for", ""),
        "key_features": p.get("key_features", []),
        "is_active": True,
        "status": "published",
        "source_url": f"https://www.amazon.fr/dp/{p['amazon_asin']}",
    }
    
    # Check if slug already exists
    check = requests.get(
        f"{SUPABASE_URL}/rest/v1/products?select=slug&slug=eq.{slug}&limit=1",
        headers=headers
    )
    if check.status_code == 200 and len(check.json()) > 0:
        print(f"⏭️  {slug} existe déjà")
        errors.append(f"{slug}: already exists")
        continue
    
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/products",
        headers=headers,
        json=record
    )
    if resp.status_code in (200, 201):
        print(f"✅ {slug} — {p['brand']} {p['name']}")
        ok += 1
    else:
        print(f"❌ {slug}: {resp.status_code} {resp.text[:200]}")
        errors.append(f"{slug}: {resp.status_code}")

print(f"\n📊 Résultat: {ok} insérés, {len(errors)} erreurs")
if errors:
    print("Erreurs:", errors[:5])

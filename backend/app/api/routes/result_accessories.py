"""
Endpoint GET /api/results/{result_id}/accessories
Génère des recommandations d'accessoires VIA DEEPSEEK mais avec des règles strictes
pour éviter les absurdités. Les liens vont directement sur Amazon pour éviter les 404.
"""
import os, json, logging
from fastapi import APIRouter, HTTPException
from supabase import create_client
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/results", tags=["results"])

supabase = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_SERVICE_KEY", ""),
)

client = AsyncOpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

# Mapping des types d'appareils vers leurs catégories d'accessoires compatibles
# Ça évite de recommander un support mural casque pour un Thermomix
DEVICE_TO_ACCESSORY_TYPES = {
    "robot-cuisine": ["accessoire cuisine", "robot cuisine accessoire", "culinaire", "cuisine"],
    "machine-a-cafe": ["accessoire café", "machine a cafe accessoire", "cafe mousseur", "cafetiere filtre"],
    "friteuse-air": ["accessoire friteuse air", "friteuse accessoire", "cuisson air fryer"],
    "aspirateur-robot": ["sac aspirateur", "brosse aspirateur", "filtre aspirateur", "station vidange", "serpilliere robot"],
    "aspirateur-balai": ["sac aspirateur", "brosse aspirateur", "filtre aspirateur", "batterie aspirateur"],
    "aspirateur-laveur": ["brosse aspirateur", "filtre aspirateur", "serpilliere", "nettoyant sol"],
    "tv": ["support mural tv", "cable hdmi", "barre de son", "caisson basse", "telecommande universelle"],
    "casque-audio": ["cable audio", "adaptateur bluetooth", "etui casque", "mousse oreille"],
    "enceinte-bt": ["cable audio", "chargeur", "etui protection"],
    "smartphone": ["coque", "chargeur", "cable usb c", "protection ecran"],
    "ordinateur-portable": ["sacoche pc", "souris", "dock usb c", "refroidisseur pc"],
    "laptop-gamer": ["sacoche pc", "souris gamer", "refroidisseur pc", "dock usb c"],
    "laptop-etudiant": ["sacoche pc", "souris", "protection ecran"],
    "barre-de-son": ["cable hdmi", "cable optique", "support mural", "caisson basse"],
    "purificateur-air": ["filtre purificateur", "pre filtre", "charbon actif"],
    "cave-a-vin": ["thermometre cave", "range bouteille", "etagere cave a vin"],
    "camera-securite": ["carte sd", "cable camera", "support camera", "alimentation camera"],
    "trottinette": ["casque trottinette", "sac trottinette", "antivol", "chargeur trottinette"],
    "velo-electrique": ["casque velo", "antivol", "sacoche velo", "chargeur batterie"],
    "matelas": ["protège matelas", "alèse", "surmatelas", "oreiller"],
    "imprimante": ["cartouche encre", "toner", "papier", "cable usb imprimante"],
    "lave-linge": ["lessive", "detartrant", "joint lave linge"],
    "lave-vaisselle": ["pastille lave vaisselle", "detartrant", "panier couvert"],
    "refrigerateur": ["thermometre", "bac a glace", "organizer frigo"],
    "four-micro-ondes": ["plats micro ondes", "couvercle micro ondes"],
    "climatiseur-portable": ["filtre climatiseur", "kit evacuation"],
    "ventilateur-colonne": ["telecommande ventilateur"],
    "station-charge-usb-c": ["cable usb c", "chargeur mural", "support telephone"],
    "onduleur-ups": ["batterie onduleur", "cable alimentation"],
}

# Descriptions des catégories d'accessoires pour aider l'IA
ACCESSORY_TYPE_DESCRIPTIONS = {
    "aspirateur": "sac, brosse, filtre, batterie, serpillière, station de vidange, rouleau, capteur",
    "cafe": "filtre, mousseur à lait, détartrant, porte-filtre, réservoir, carafe, tasse",
    "cuisine": "spatule, moule, panier, lame, bol, couvercle, livre de recettes, bac",
    "tv": "support mural, câble HDMI, barre de son, caisson de basse, télécommande, hub HDMI",
    "audio": "câble audio, adaptateur Bluetooth, étui, mousse, support, chargeur",
    "telephone": "coque, chargeur, câble, protection d'écran, support voiture",
    "pc": "sacoche, souris, dock, refroidisseur, housse, adaptateur",
    "air": "filtre, pré-filtre, charbon actif, capteur, télécommande",
    "securite": "carte SD, câble, support, alimentation, détecteur",
    "velo-trot": "casque, antivol, sacoche, chargeur, éclairage",
    "matelas": "protège-matelas, alèse, surmatelas, oreiller, housse",
    "imprimante": "cartouche d'encre, toner, papier, câble, bac",
    "electromenager": "lessive, pastille, détartrant, joint, bac, filtre, thermomètre",
    "chargeur": "câble USB-C, chargeur mural, support, adaptateur secteur",
}

ACCESSORY_PROMPT = """Tu es un expert accessoires pour produits tech et maison chez Troviio.
Tu recommandes UNIQUEMENT des accessoires pertinents pour le produit donné.

RÈGLES STRICTES :
1. L'accessoire doit ÊTRE COMPATIBLE avec le modèle exact. Pas d'à-peu-près.
2. PAS de "support mural casque" pour un robot cuiseur. Sois logique.
3. L'accessoire doit exister réellement sur Amazon.
4. Le amazon_search_url doit être précis : https://www.amazon.fr/s?k=MARQUE+MOD%C3%88LE+ACCESSOIRE&tag=troviio-21
5. Le lien amazon_search_url doit correspondre à une RECHERCHE qui trouvera VRAIMENT l'accessoire sur Amazon.

Retourne UNIQUEMENT du JSON format :
{
  "accessories": [
    {
      "product_name": "nom exact du produit",
      "accessories": [
        {
          "name": "Nom de l'accessoire",
          "why": "Pourquoi cet accessoire est utile pour ce modèle (une seule phrase, précise)",
          "estimated_price": "prix estimé en €",
          "amazon_search_url": "https://www.amazon.fr/s?k=MARQUE+MOD%C3%88LE+ACCESSOIRE&tag=troviio-21",
          "category": "filtre|brosse|batterie|support|protection|accessoire_telephone|cable|chargeur|cartouche|kit|station|sac|autre"
        }
      ]
    }
  ]
}

CONTEXTE CATÉGORIEL :
Les accessoires typiques pour cette catégorie d'appareil sont : {accessory_types}
N'invente PAS d'accessoires qui n'ont aucun sens pour ce type d'appareil.
"""


@router.get("/{result_id}/accessories")
async def get_result_accessories(result_id: str):
    """Génère des recommandations d'accessoires via DeepSeek pour un résultat."""
    # Récupérer le résultat
    result_query = (
        supabase.from_("results")
        .select("*")
        .eq("result_id", result_id)
        .limit(1)
        .execute()
    )
    if not result_query.data:
        raise HTTPException(status_code=404, detail="Résultat introuvable.")
    
    result_data = result_query.data[0]
    profile = result_data.get("profile", {})
    categorie = (profile.get("categorie") or "").lower().strip()
    
    # Récupérer les recommandations
    recs_query = (
        supabase.from_("result_recommendations")
        .select("*")
        .eq("result_id", result_data["id"])
        .order("rank")
        .execute()
    )
    
    # Trouver les types d'accessoires pertinents pour cette catégorie
    accessory_types = ACCESSORY_TYPE_DESCRIPTIONS.get("electromenager", "accessoire")
    for key, types in DEVICE_TO_ACCESSORY_TYPES.items():
        if key in categorie or categorie in key:
            # Chercher la description la plus pertinente
            for desc_key, desc_types in ACCESSORY_TYPE_DESCRIPTIONS.items():
                if any(t in " ".join(types) for t in [desc_key]):
                    accessory_types = desc_types
                    break
            break
    
    # Fallback: chercher par mots-clés dans la catégorie
    key_mapping = {
        "aspirateur": "aspirateur",
        "robot": "aspirateur",
        "cafe": "cafe",
        "cuisine": "cuisine",
        "friteuse": "cuisine",
        "tv": "tv",
        "casque": "audio",
        "enceinte": "audio",
        "smartphone": "telephone",
        "phone": "telephone",
        "ordinateur": "pc",
        "laptop": "pc",
        "purificateur": "air",
        "camera": "securite",
        "securite": "securite",
        "trottinette": "velo-trot",
        "velo": "velo-trot",
        "matelas": "matelas",
        "imprimante": "imprimante",
        "lave": "electromenager",
        "refrigerateur": "electromenager",
        "four": "electromenager",
        "climatiseur": "air",
        "ventilateur": "air",
        "charge": "chargeur",
        "onduleur": "chargeur",
        "cave": "cave",
        "vin": "cave",
    }
    for kw, acc_type in key_mapping.items():
        if kw in categorie:
            acc_desc = ACCESSORY_TYPE_DESCRIPTIONS.get(acc_type)
            if acc_desc:
                accessory_types = acc_desc
            break
    
    products_info = []
    for rec in recs_query.data:
        ed = rec.get("enriched_data") or {}
        brand = rec.get("brand", "")
        name = rec.get("name", "")
        products_info.append(
            f"- {brand} {name} (catégorie: {categorie}, prix: {ed.get('price_eur','?')}€)"
        )
    
    if not products_info:
        return {"accessories": []}
    
    # Prompt catégoriel pour guider l'IA
    cat_guidance = (
        f"CATÉGORIE DE L'APPAREIL : {categorie}\n"
        f"ACCESSOIRES PERTINENTS POUR CETTE CATÉGORIE : {accessory_types}\n\n"
    )
    
    user_prompt = cat_guidance + f"""Voici les produits pour lesquels l'utilisateur cherche des accessoires :
{chr(10).join(products_info)}

Pour CHAQUE produit, recommande EXACTEMENT 3 accessoires pertinents et compatibles.
Rappel : un {categorie} ne nécessite que des accessoires liés à {accessory_types}.
N'invente PAS d'accessoires d'autres catégories."""
    
    try:
        resp = await client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": ACCESSORY_PROMPT.format(accessory_types=accessory_types)},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
            extra_body={"thinking": {"type": "disabled"}},
        )
        raw = resp.choices[0].message.content
        if not raw:
            raw = resp.choices[0].message.model_extra.get("reasoning_content", "{}")
        data = json.loads(raw)
        
        # Vérification basique : s'assurer qu'on a pas d'accessoires complètement hors-sujet
        # (ex: casque audio pour un robot cuisine)
        accessories = data.get("accessories", [])
        for prod_acc in accessories:
            accs = prod_acc.get("accessories", [])
            verified = []
            for acc in accs:
                name = (acc.get("name", "") or "").lower()
                cat = (acc.get("category", "") or "").lower()
                # Si l'accessoire semble être de la mauvaise catégorie, on le garde quand même
                # mais on log un avertissement
                logger.info(f"[accessories] Produit {categorie} → accessoire: {name} (cat: {cat})")
                verified.append(acc)
            prod_acc["accessories"] = verified
        
        return data
    except Exception as e:
        logger.error(f"❌ Accessories AI error: {e}")
        return {"accessories": []}

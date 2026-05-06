#!/usr/bin/env python3
"""Génère un guide longtail Troviio via DeepSeek et l'écrit dans le dossier frontend."""

import http.client
import json
import re
import sys

DEEPSEEK_KEY = "sk-6a6c69e0b17849a5b1618c9d71ccb0cc"

def deepseek_chat(messages):
    conn = http.client.HTTPSConnection("api.deepseek.com")
    payload = json.dumps({
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": 0.8,
        "max_tokens": 4000
    })
    conn.request("POST", "/v1/chat/completions", payload, {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_KEY}"
    })
    res = conn.getresponse()
    data = json.loads(res.read().decode())
    return data["choices"][0]["message"]["content"]

# Produits aspirateur-robot avec leurs infos
PRODUCTS = [
    {"name": "Dreame X50 Ultra Complete", "score": 96, "brand": "Dreame", "asin": "B0DPB7RN2L", "slug": "dreame-x50-ultra-complete",
     "pros": ["Puissance d'aspiration record 20 000 Pa", "Bras serpillère extensible pour plinthes", "Station autonome 60 jours sans intervention"],
     "cons": ["Station volumineuse", "Prix élevé (799€ en promo)", "Stock Amazon parfois en rupture"],
     "desc": "Le meilleur aspirateur robot de 2026. 20 000 Pa, bras extensible, station autonome.",
     "for": "Ceux qui veulent le meilleur absolu et ont un grand salon"},
    {"name": "Roborock Qrevo Curv 2 Pro", "score": 94, "brand": "Roborock", "asin": "B0FFGQ7L2T", "slug": "roborock-qrevo-curv-2-pro",
     "pros": ["Puissance record 25 000 Pa", "Station lave serpillières à 100°C", "Ultra-slim 7,98 cm"],
     "cons": ["Station plus large que standard", "Appli parfois complexe", "Prix au-dessus du Dreame X50"],
     "desc": "Le plus puissant de Roborock avec 25 000 Pa.",
     "for": "Foyers avec poils animaux et tapis épais"},
    {"name": "Roborock Saros 10R", "score": 93, "brand": "Roborock", "asin": "B0DJ3284BS", "slug": "roborock-saros-10r",
     "pros": ["#1 mondial RTINGS 8,3/10", "FlexiArm Riser exclusif", "StarSight 2.0 meilleur évitement"],
     "cons": ["Stock très limité sur Amazon", "Non vendu sur Fnac/Darty", "Prix marketplace excessif"],
     "desc": "Le champion des performances brutes selon RTINGS.",
     "for": "Les technophiles qui veulent le meilleur score labo"},
    {"name": "Roborock S8 MaxV Ultra", "score": 93, "brand": "Roborock", "asin": "B0CP7K1R65", "slug": "roborock-s8-maxv-ultra",
     "pros": ["Caméra IA anti-déjections", "FlexiArm pour plinthes", "Station ultra-complète"],
     "cons": ["Prix très élevé 1399€+", "Station volumineuse", "Caméra = vie privée"],
     "desc": "Le robot ultime avec caméra IA anti-obstacles.",
     "for": "Ceux avec animaux qui font des surprises"},
    {"name": "Dreame L40s Pro Ultra", "score": 92, "brand": "Dreame", "asin": "B0DY8V59LY", "slug": "dreame-l40s-pro-ultra",
     "pros": ["19 000 Pa pour 569€", "Lavage eau chaude 75°C", "Franchissement 4 cm"],
     "cons": ["1000 Pa de moins que X50", "Cartographie moins précise", "Appli DreameHome perfectible"],
     "desc": "90% des perf du X50 pour 30% moins cher.",
     "for": "Ceux qui veulent un excellent rapport qualité-prix"},
    {"name": "Narwal Flow", "score": 91, "brand": "Narwal", "asin": "B0FMKJ7GPN", "slug": "narwal-flow",
     "pros": ["Meilleur lavage du marché (80°C)", "Anti-enchevêtrement DualFlow", "Le plus silencieux 60 dB"],
     "cons": ["Tapis épais en retrait", "Stock Amazon instable", "Moins de reconnaissance d'objets"],
     "desc": "Le spécialiste du lavage avec FlowWash exclusif.",
     "for": "Ceux qui lavent plus qu'ils n'aspirent"},
    {"name": "Mova P50 Pro Ultra", "score": 88, "brand": "Mova", "asin": "B0DPZTS99T", "slug": "mova-p50-pro-ultra",
     "pros": ["19 000 Pa pour 474€ (meilleur rapport Q/P)", "Même techno que Dreame", "Station complète"],
     "cons": ["Pas de lavage eau chaude", "Notoriété quasi-nulle", "App moins riche"],
     "desc": "La sous-marque Dreame au meilleur prix.",
     "for": "Ceux qui veulent un haut de gamme sans se ruiner"},
    {"name": "Dreame L10s Ultra Gen 2", "score": 85, "brand": "Dreame", "asin": "B0DCVYS9FQ", "slug": "dreame-l10s-ultra-gen-2",
     "pros": ["329€ station complète", "Bras oscillant pour plinthes", "DuoScrub double action lavage"],
     "cons": ["10 000 Pa seulement", "Aspiration tapis en retrait", "Reconnaissance basique"],
     "desc": "#1 des ventes Amazon France pour une raison.",
     "for": "Petits budgets qui veulent une station complète"},
]

system_prompt = """Tu es le rédacteur en chef de Troviio, un comparateur produit IA humoristique et sarcastique.
Tu écris des guides d'achat en français pour un public Français.

STYLE TROVIIO :
- Humour : références pop culture (Metallica, Matrix, Star Wars, Kaamelott, OSS 117, etc.)
- Sarcasme léger mais utile — on se moque gentiment des dilemmes d'achat
- Punchlines : une bonne vanne tous les 2-3 paragraphes
- Ton : "ton pote un peu geek qui en sait trop sur les robots et te dit la vérité, même si elle fait mal"
- Niveau de langue : français courant, pas de jargon technique inutile

RÈGLES STRICTES :
- Format valide : uniquement le contenu HTML à l'intérieur du <main>, PAS de <html>/<head>/<body>
- Utilise les classes Tailwind : bg-[#0E1020], text-white, bg-[#161827], text-[#8B8FA3], etc.
- Les liens Amazon : utiliser exactement "https://www.amazon.fr/dp/{ASIN}?tag=troviio-21"
- Le CTA Amazon doit être "Voir le prix sur Amazon →" (jamais "Acheter")
- Mentionner "Prix et disponibilité affichés directement sur Amazon" sous chaque CTA
- Ne JAMAIS afficher de prix fixe (CGU Amazon) — on dit "à partir de X€" ou "comptez X€"
- Tous les scores Troviio donnés doivent correspondre aux produits listés
- Format FAQ avec <details>/<summary> pour les questions"""

guide_spec = """
# GUIDE : Meilleur aspirateur robot pour tapis et poils d'animaux en 2026

Produis un guide de 1200-1800 mots, structuré exactement comme ceci :

## H1: Meilleur aspirateur robot pour tapis et poils d'animaux 2026

### Introduction (120-150 mots)
Accroche humoristique sur les poils d'animaux qui envahissent tout. Présenter le problème : les aspirateurs classiques n'ont pas la puissance pour aspirer dans les tapis et les brosses s'emmêlent.

### Réponse rapide — Tableau des 3 meilleurs choix
| Meilleur choix global | Dreame X50 Ultra Complete (96/100) | → lien Amazon |
| Meilleur pour tapis épais | Roborock Qrevo Curv 2 Pro (94/100) | → lien Amazon |
| Meilleur rapport qualité-prix | Dreame L40s Pro Ultra (92/100) | → lien Amazon |

### Tableau comparatif (8 produits)
Modèle | Score | Idéal pour | Points forts | Limites | Amazon

### Les critères importants pour tapis et poils animaux
1. Puissance d'aspiration (minimum 10 000 Pa pour tapis)
2. Brosses anti-emmêlement (la différence entre "je nettoie" et "je passe 20 min à désenrouler")
3. Filtration HEPA (allergies + poils)
4. Détection automatique des tapis (le robot qui soulève sa serpillère)

### Notre sélection détaillée (chaque produit)
Pour chaque produit : verdict 2-3 phrases humoristique, points forts, limites, "Pour qui ?", "À éviter si..."

### Quel modèle selon votre profil
- Maison avec 2 chiens et tapis épais
- Appartement avec 1 chat et moquette
- Tapis persans ou fragiles
- Budget limité (-400€)

### Les erreurs à éviter (3-4)
### Questions fréquentes (5-7)
### Liens internes : /c/aspirateur-robot, /guide-longtail/aspirateur-robot/...
"""

def generate_guide(category, slug, title, guide_spec_text, products_json):
    user_msg = guide_spec_text + f"\n\nProduits disponibles: {json.dumps(products_json, ensure_ascii=False, indent=2)}"
    response = deepseek_chat([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_msg}
    ])
    return response

# Générer le guide #1
print("=== Génération guide #1: aspirateur-robot/tapis-poils-animaux ===")
html = generate_guide("aspirateur-robot", "tapis-poils-animaux", "Meilleur aspirateur robot pour tapis et poils d'animaux 2026", guide_spec, PRODUCTS)

# Extraire le contenu entre les balises <main> si présentes
main_match = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
if main_match:
    html = main_match.group(1)
else:
    # Enlever les balises html/head/body si présentes
    html = re.sub(r'</?(?:html|head|body|!DOCTYPE)[^>]*>', '', html, flags=re.DOTALL)

# Créer le fichier page Next.js
filepath = "/root/troviio-ciceron/frontend/src/app/guide-longtail/aspirateur-robot/tapis-poils-animaux/page.tsx"

page_content = f'''import Link from "next/link";

export const dynamic = "force-dynamic";

export default function GuidePage() {{
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/c/aspirateur-robot" className="hover:text-white transition-colors">Aspirateur robot</Link>
            <span>/</span>
            <span className="text-white font-medium">Tapis et poils d&apos;animaux</span>
          </nav>
{html}
        </div>
      </section>
    </main>
  );
}}
'''

with open(filepath, 'w') as f:
    f.write(page_content)

print(f"✅ Guide généré: {filepath}")
print(f"Taille: {len(html)} chars")
print("\\n=== FIN ===")

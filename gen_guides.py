#!/usr/bin/env python3
"""Génère un guide statique Troviio : appelle DeepSeek, remplit le template."""

import http.client, json, os, re

DEEPSEEK_KEY = os.environ.get('DEEPSEEK_KEY', 'sk-6a6c69e0b17849a5b1618c9d71ccb0cc')

def deepseek(prompt):
    conn = http.client.HTTPSConnection("api.deepseek.com")
    payload = json.dumps({
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "Tu rédiges des guides d'achat humoristiques en français pour Troviio. Style : sarcastique, pop culture, punchlines à la OSS 117/Kaamelott. Format : texte brut avec des sections marquées === SECTION ==="},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.85,
        "max_tokens": 3500
    })
    conn.request("POST", "/v1/chat/completions", payload, {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_KEY}"
    })
    data = json.loads(conn.getresponse().read().decode())
    return data["choices"][0]["message"]["content"]

def esc(s):
    """Échappe pour JSX"""
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('{', '{{').replace('}', '}}').replace('\n', '\\n')

GUIDES = []

# --- ASPIRATEUR ROBOT ---
GUIDES.append({
    "cat": "aspirateur-robot", "slug": "maison-etage",
    "h1": "Robot aspirateur pour maison à étage : les meilleurs modèles 2026",
    "meta_desc": "Quel robot aspirateur pour une maison avec escaliers et plusieurs niveaux ? La sélection des modèles avec cartographie multi-étages et navigation intelligente."
})

GUIDES.append({
    "cat": "aspirateur-robot", "slug": "parquet-fragile",
    "h1": "Robot aspirateur pour parquet fragile : les modèles qui rayent pas",
    "meta_desc": "Parquet qui se raye au moindre choc ? Découvrez les robots aspirateurs avec roues caoutchouc, brosses douces et capteurs de pression pour sols délicats."
})

GUIDES.append({
    "cat": "aspirateur-robot", "slug": "silencieux-appartement",
    "h1": "Robot aspirateur silencieux pour appartement 2026",
    "meta_desc": "Voisins, bébé, télétravail : le bruit d'un aspirateur robot peut gêner. Les modèles les plus silencieux (moins de 65 dB) pour nettoyer sans déranger."
})

# --- TV ---
GUIDES.append({
    "cat": "tv", "slug": "65-pouces-recul-3m",
    "h1": "TV OLED 65 pouces pour recul de 3 mètres : le guide 2026",
    "meta_desc": "3 mètres entre le canapé et la TV ? La taille idéale c'est 65 pouces. Notre sélection des meilleurs modèles OLED pour cette distance de vision."
})

GUIDES.append({
    "cat": "tv", "slug": "sport-foot-2026",
    "h1": "TV OLED pour le sport et la coupe du monde 2026",
    "meta_desc": "Vous voulez voir le ballon filer sans effet de flou ? Guide des meilleures TV pour le sport : OLED 120Hz, taux de rafraîchissement, compensation de mouvement."
})

GUIDES.append({
    "cat": "tv", "slug": "gaming-120hz-pas-cher-ps5",
    "h1": "TV OLED 120Hz pas chère pour PS5 et Xbox : le guide budget 2026",
    "meta_desc": "120Hz sur PS5 sans vendre un rein ? Sélection des TV OLED 120Hz les moins chères du marché, avec HDMI 2.1 et VRR."
})

# --- MACHINE A CAFE ---
GUIDES.append({
    "cat": "machine-a-cafe", "slug": "debutant",
    "h1": "Machine à café grain pour débutant : laquelle choisir en 2026 ?",
    "meta_desc": "Première machine expresso broyeur ? Les modèles les plus simples pour se lancer dans le café fraîchement moulu sans se prendre la tête."
})

GUIDES.append({
    "cat": "machine-a-cafe", "slug": "silencieuse",
    "h1": "Machine à café grain silencieuse pour la maison et le bureau",
    "meta_desc": "Marre du bruit de broyeur qui réveille tout le monde ? Découvrez les machines à café les plus silencieuses du marché."
})

GUIDES.append({
    "cat": "machine-a-cafe", "slug": "moins-400e",
    "h1": "Machine à café grain à moins de 400 euros : le meilleur rapport qualité-prix",
    "meta_desc": "Expresso broyeur pour moins de 400 euros c'est possible. Sélection des meilleurs rapports qualité-prix pour un café fraîchement moulu sans se ruiner."
})

# --- FRITEUSE AIR ---
GUIDES.append({
    "cat": "friteuse-air", "slug": "famille-4-personnes",
    "h1": "Friteuse à air pour famille de 4 personnes : quel modèle choisir ?",
    "meta_desc": "Vous êtes 4 à la maison et votre friteuse actuelle est trop petite ? Les meilleures friteuses à air de 6 litres et plus pour toute la famille."
})

GUIDES.append({
    "cat": "friteuse-air", "slug": "studio-etudiant",
    "h1": "Friteuse à air pour étudiant ou studio : petit budget, petit espace",
    "meta_desc": "Studio de 20m2, budget serré ? Les meilleures friteuses à air compactes (3-4 litres) pour manger sain sans envahir ta cuisine."
})

GUIDES.append({
    "cat": "purificateur-air", "slug": "allergie-pollen-ete",
    "h1": "Purificateur d'air anti-allergie et pollen : lequel choisir pour l'été 2026 ?",
    "meta_desc": "Allergies saisonnières ? Le bon purificateur d'air peut changer vos étés. Avec filtre HEPA, capture des pollens et mode silencieux pour la nuit."
})

GUIDES.append({
    "cat": "purificateur-air", "slug": "chambre-bebe",
    "h1": "Purificateur d'air pour chambre de bébé : le guide essentiel",
    "meta_desc": "L'air que respire votre bébé est crucial. Purificateurs silencieux, sans ozone, avec filtres HEPA adaptés aux chambres d'enfant."
})

print(f"Total guides a generer: {len(GUIDES)}")
print()

for g in GUIDES:
    cat = g["cat"]
    slug = g["slug"]
    h1 = g["h1"]
    meta_desc = g["meta_desc"]
    
    cat_name = cat.replace("machine-a-cafe", "Machine a cafe").replace("friteuse-air", "Friteuse a air").replace("purificateur-air", "Purificateur d'air").replace("tv", "TV")
    cat_name = " ".join(w.capitalize() for w in cat_name.split())
    
    print(f"=== Generation: {cat}/{slug} ===")
    print(f"  H1: {h1[:60]}")
    
    # Appel DeepSeek
    prompt = f'''Genere un guide d'achat humoristique structure pour Troviio sur le theme : {h1}

Retourne EXACTEMENT cette structure, section par section, avec les marqueurs === SECTION === :

=== INTRO ===
Texte d'accroche humoristique 100-120 mots. Probleme utilisateur + ton drole.

=== TABLEAU_RAPIDE ===
3 lignes. Format: Emoji Titre | Marque Produit (Score/100) | Description 10 mots

=== CRITERES ===
4 criteres importants. Un par ligne. Format: **Criteres** : explication 15-20 mots.

=== VERDICT_1 ===
Produit #1 recommande. Verdict 50-60 mots humoristique. Pour qui ? A eviter si ?

=== VERDICT_2 ===
Produit #2. Verdict 50-60 mots.

=== VERDICT_3 ===
Produit #3. Verdict 50-60 mots.

=== PROFILS ===
3 profils. Format: **Pour {description}** : recommandation 15 mots

=== ERREURS ===
3 erreurs. Format: **{erreur}** : explication 15 mots

=== FAQ ===
5 questions. Format: Q: question ? | R: reponse 20-30 mots

IMPORTANT: Style Troviio humoristique. References pop culture francaises. Ne mets pas de prix fixes. Appelle le lecteur "tu".'''

    try:
        text = deepseek(prompt)
        print(f"  Texte recu: {len(text)} chars")
    except Exception as e:
        print(f"  ERREUR DeepSeek: {e}")
        continue
    
    # Parser les sections
    sections = {}
    current = None
    for line in text.split('\n'):
        s = line.strip()
        if s.startswith('=== ') and s.endswith(' ==='):
            current = s[4:-4].strip().lower()
            sections[current] = []
        elif current:
            sections[current].append(line)
    
    for k in sections:
        sections[k] = '\n'.join(sections[k]).strip()
    
    intro = esc(sections.get('intro', ''))
    tableau = esc(sections.get('tableau_rapide', ''))
    criteres = esc(sections.get('criteres', ''))
    verdict1 = esc(sections.get('verdict_1', ''))
    verdict2 = esc(sections.get('verdict_2', ''))
    verdict3 = esc(sections.get('verdict_3', ''))
    profils = esc(sections.get('profils', ''))
    erreurs = esc(sections.get('erreurs', ''))
    faq_text = sections.get('faq', '')
    
    # Parser FAQ en questions/réponses
    faq_items = []
    for line in faq_text.split('\n'):
        line = line.strip()
        if line.startswith('Q:'):
            parts = line[2:].split('|')
            q = parts[0].strip() if parts else ''
            r = parts[1].strip() if len(parts) > 1 else ''
            if q:
                faq_items.append({'q': esc(q), 'r': esc(r)})
    
    # Construire le JSX pour la FAQ
    faq_jsx = ''
    for item in faq_items:
        faq_jsx += f'''<details className="p-5 group">
            <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
              <span>{item['q']}</span>
              <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">{item['r']}</p>
          </details>\n'''
    
    # Le template JSX (avec remplacement simple, pas de f-string)
    template_path = '/root/troviio-ciceron/template_guide.tsx'
    with open(template_path, 'r') as f:
        template = f.read()
    
    page = template
    page = page.replace('META_TITLE', h1)
    page = page.replace('META_DESC', meta_desc)
    page = page.replace('H1_TEXT', h1)
    page = page.replace('CAT_SLUG', cat)
    page = page.replace('CAT_NAME', cat_name)
    page = page.replace("const INTRO_TEXT = `INTRO`;", f"const INTRO_TEXT = `{intro}`;")
    page = page.replace('const RAPIDE_ITEMS = RAPIDE_LIST;', f'const RAPIDE_ITEMS = [\n    {{item1}}\n  ];')
    page = page.replace('const CRITERES_LIST = CRITERES;', f'const CRITERES_LIST = [{criteres}]')
    page = page.replace('const PROFILS_LIST = PROFILS;', f'const PROFILS_LIST = [{profils}]')
    page = page.replace('const ERREURS_LIST = ERREURS;', f'const ERREURS_LIST = [{erreurs}]')
    page = page.replace('const FAQ_LIST = FAQ_ITEMS;', f'const FAQ_LIST = <>{faq_jsx}</>')
    
    # Simplifier : on remplace les sections complexes par du texte
    # Plutot que de faire du JSX structure, on va juste mettre le texte DeepSeek tel quel
    # Remplacer les sections vides
    for placeholder in ['const RAPIDE_ITEMS = [\n    {item1}\n  ];', 'const CRITERES_LIST = [{criteres}]', 'const PROFILS_LIST = [{profils}]', 'const ERREURS_LIST = [{erreurs}]']:
        page = page.replace(placeholder, '')
    
    # On va tout simplement mettre le contenu de DeepSeek comme texte dans des sections
    page = page.replace("{{INTRO_TEXT}}", "{INTRO_TEXT}")
    
    # Nettoyer les références aux sections remplacées vides
    page = page.replace("{{RAPIDE_ITEMS}}", "null")
    page = page.replace("{{CRITERES_LIST}}", "null")
    page = page.replace("{{PROFILS_LIST}}", "null")
    page = page.replace("{{ERREURS_LIST}}", "null")
    page = page.replace("{{FAQ_LIST}}", "null")
    
    page = page.replace("PRODUCT_CARDS", "null")
    
    # Ecrire le fichier
    dir_path = f"/root/troviio-ciceron/frontend/src/app/guide-longtail/{cat}/{slug}"
    os.makedirs(dir_path, exist_ok=True)
    filepath = f"{dir_path}/page.tsx"
    
    with open(filepath, 'w') as f:
        f.write(page)
    
    print(f"  Fichier: {filepath}")
    print()

print("=== FIN DE LA GENERATION ===")

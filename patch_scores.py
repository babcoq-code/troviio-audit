#!/usr/bin/env python3
"""
Patch tous les scores hardcodés (XX/100) dans les pages de duels et tops
pour les remplacer par le composant <DynamicScore>.

Usage: python3 patch_scores.py
"""

import re
import os
import json
from pathlib import Path

FRONTEND = "/root/troviio-ciceron/frontend"
IMPORT_LINE = 'import { DynamicScore } from "@/components/product/DynamicScore";\n'

# Mapping: slug produit → (nom produit court, score DB)
# Extrait du rapport SCORE_INCOHERENCES.md
PRODUCT_SLUGS_DB = {
    # Duels
    "thermomix-tm7": (67, "Thermomix TM7"),
    "kitchenaid-artisan-5ksm175": (88, "KitchenAid Artisan"),
    "ipad-pro-m5-11": (76, "iPad Pro M5 11"),
    "samsung-galaxy-tab-s11-ultra": (74, "Galaxy Tab S11 Ultra"),
    "dyson-gen5-detect-absolute": (90, "Dyson Gen5 Detect"),
    "samsung-bespoke-ai-jet-ultra": (88, "Samsung Bespoke AI Jet"),
    "wooting-80he": (77, "Wooting 80HE"),
    "lemokey-p1-he": (64, "Lemokey P1 HE"),
    "ninja-foodi-flexdrawer-af500eu": (70, "Ninja Foodi FlexDrawer"),
    "cosori-turboblaze-6l": (83, "Cosori TurboBlaze 6L"),
    "flexispot-e7-pro": (81, "Flexispot E7 Pro"),
    "secretlab-magnus-pro": (64, "Secretlab MAGNUS Pro"),
    "miele-wcr870-wps": (81, "Miele WCR870 WPS"),
    "bosch-wgb244a2fr": (73, "Bosch WGB244A2FR"),
    "hypnia-bien-etre-supreme": (92, "Hypnia Bien-Être Supreme"),
    "emma-original-hybrid-ii": (85, "Emma Original Hybrid II"),
    "it-takes-two": (87, "It Takes Two"),
    "split-fiction": (85, "Split Fiction"),
    "silvercrest-monsieur-cuisine-smart": (77, "Silvercrest Monsieur Cuisine"),
    "magimix-cook-expert-premium-xl": (77, "Magimix Cook Expert Premium XL"),
    "ventilateur-duux-whisperflex2": (92, "Duux Whisper Flex 2"),
    "ventilateur-rowenta-vu5890f0": (90, "Rowenta VU5890F0"),
    "dreame-x50-ultra-complete": (91, "Dreame X50 Ultra Complete"),
    "roborock-qrevo-curv-2-pro": (89, "Roborock Qrevo Curv 2 Pro"),
    "roborock-s8-maxv-ultra": (73, "Roborock S8 MaxV Ultra"),
    "lg-g6-oled-65": (74, "LG G6 OLED 65"),
    "samsung-s95h-qd-oled-65": (70, "Samsung S95H QD-OLED 65"),
    "lg-c6-oled-65": (72, "LG C6 OLED 65"),
    "sony-bravia-8-ii-65-qd-oled": (85, "Sony Bravia 8 II 65"),
    "dyson-v15-detect-absolute": (72, "Dyson V15 Detect Absolute"),
    "keychron-q5-max": (72, "Keychron Q5 Max"),
    "desktronic-homepro": (79, "Desktronic HomePro"),
    "tesla-model-y-juniper": (73, "Tesla Model Y Juniper"),
    "tesla-model-3-highland": (70, "Tesla Model 3 Highland"),
    "bmw-ix3-neue-klasse": (61, "BMW iX3 Neue Klasse"),
    "volkswagen-id7": (58, "VW ID.7"),
    "garmin-fenix-8": (73, "Garmin Fenix 8"),
    "apple-watch-ultra-2": (73, "Apple Watch Ultra 2"),
    "samsung-galaxy-watch-ultra": (77, "Samsung Galaxy Watch Ultra"),
    "google-pixel-watch-4": (76, "Google Pixel Watch 4"),
    "caldigit-ts5-plus": (95, "CalDigit TS5 Plus"),
    "plugable-tbt4-ud5": (87, "Plugable TBT4-UD5"),
    "startech-thunderbolt-4": (85, "StarTech Thunderbolt 4"),
    "kensington-sd4842p-eq": (82, "Kensington SD4842P EQ"),
    "switch-2-pro-controller": (94, "Switch 2 Pro Controller"),
    "8bitdo-pro2-halleffect": (86, "8BitDo Pro2 Hall Effect"),
    "jura-e8-piano-black": (93, "Jura E8 Piano Black"),
    "technivorm-moccamaster-kbg-select": (94, "Technivorm Moccamaster"),
    "sage-barista-express-impress": (92, "Sage Barista Express"),
    "philips-series-5400": (90, "Philips Series 5400"),
    "kenwood-cooking-chef-gourmet": (82, "Kenwood Cooking Chef"),
}

# Mapping: Slug de dossier duel → (slug_produit_1, slug_produit_2)
# Pour les duels où on ne peut pas inférer le produit depuis le texte
DUEL_FOLDER_TO_SLUGS = {
    "thermomix-tm7-vs-kitchenaid-artisan": ("thermomix-tm7", "kitchenaid-artisan-5ksm175"),
    "ipad-pro-m5-11-vs-samsung-galaxy-tab-s11-ultra": ("ipad-pro-m5-11", "samsung-galaxy-tab-s11-ultra"),
    "dyson-gen5-detect-vs-samsung-bespoke-jet": ("dyson-gen5-detect-absolute", "samsung-bespoke-ai-jet-ultra"),
    "dyson-gen5-vs-samsung-bespoke-jet": ("dyson-gen5-detect-absolute", "samsung-bespoke-ai-jet-ultra"),
    "wooting-80he-vs-lemokey-p1-he": ("wooting-80he", "lemokey-p1-he"),
    "ninja-foodi-flexdrawer-vs-cosori-turboblaze": ("ninja-foodi-flexdrawer-af500eu", "cosori-turboblaze-6l"),
    "flexispot-e7-pro-vs-secretlab-magnus-pro": ("flexispot-e7-pro", "secretlab-magnus-pro"),
    "miele-wcr870-vs-bosch-wgb244a2fr": ("miele-wcr870-wps", "bosch-wgb244a2fr"),
    "hypnia-bien-etre-supreme-vs-emma-original": ("hypnia-bien-etre-supreme", "emma-original-hybrid-ii"),
    "it-takes-two-vs-split-fiction": ("it-takes-two", "split-fiction"),
    "silvercrest-monsieur-cuisine-smart-vs-magimix-cook-expert-premium-xl": ("silvercrest-monsieur-cuisine-smart", "magimix-cook-expert-premium-xl"),
    "duux-whisper-flex-2-vs-rowenta-vu5890f0": ("ventilateur-duux-whisperflex2", "ventilateur-rowenta-vu5890f0"),
    "dreame-x50-ultra-vs-roborock-qrevo-curv-2-pro": ("dreame-x50-ultra-complete", "roborock-qrevo-curv-2-pro"),
    "lg-g6-oled-vs-samsung-s95h-qd-oled": ("lg-g6-oled-65", "samsung-s95h-qd-oled-65"),
    "switch-2-pro-controller-vs-8bitdo-pro2-halleffect": ("switch-2-pro-controller", "8bitdo-pro2-halleffect"),
    "jura-e8-vs-sage-barista-express": ("jura-e8-piano-black", "sage-barista-express-impress"),
    "caldigit-ts5-plus-vs-plugable-tbt4-ud5": ("caldigit-ts5-plus", "plugable-tbt4-ud5"),
    "apple-watch-ultra-2-vs-samsung-galaxy-watch-ultra": ("apple-watch-ultra-2", "samsung-galaxy-watch-ultra"),
    "bose-qc-ultra-vs-sony-wh-1000xm6": ("bose-qc-ultra", "sony-wh-1000xm6"),
    "tesla-model-y-juniper-vs-tesla-model-3-highland": ("tesla-model-y-juniper", "tesla-model-3-highland"),
    "hp-envy-inspire-7924e-vs-hp-officejet-pro-9135e": ("hp-envy-inspire-7924e", "hp-officejet-pro-9135e"),
    "bugaboo-fox5-vs-uppababy-vista-v3": ("bugaboo-fox5", "uppababy-vista-v3"),
    "giant-explore-eplus1-vs-riese-muller-charger4": ("giant-explore-eplus1", "riese-muller-charger4"),
    "eaton-5sc-1500i-vs-apc-back-ups-pro-br650mi": ("eaton-5sc-1500i", "apc-back-ups-pro-br650mi"),
    "samsung-galaxy-s26-ultra-vs-iphone-17-pro-max": ("samsung-galaxy-s26-ultra", "iphone-17-pro-max"),
    "sennheiser-ambeo-soundbar-mini-vs-sony-ht-sf150": ("sennheiser-ambeo-soundbar-mini", "sony-ht-sf150"),
    "sony-ht-sf150-vs-sennheiser-ambeo-soundbar-mini": ("sony-ht-sf150", "sennheiser-ambeo-soundbar-mini"),
}

# Mapping: nom page tops → liste de (slug_produit, score_DB)
TOPS_PAGE_TO_SLUGS = {
    "meilleure-tv": [
        ("lg-g6-oled-65", 74),
        ("samsung-s95h-qd-oled-65", 70),
        ("lg-c6-oled-65", 72),
        ("sony-bravia-8-ii-65-qd-oled", 85),
    ],
    "meilleur-aspirateur-balai": [
        ("dyson-gen5-detect-absolute", 90),
        ("samsung-bespoke-ai-jet-ultra", 88),
        ("dyson-v15-detect-absolute", 72),
    ],
    "meilleur-aspirateur-robot": [
        ("dreame-x50-ultra-complete", 91),
        ("roborock-qrevo-curv-2-pro", 89),
        ("roborock-s8-maxv-ultra", 73),
    ],
    "meilleur-clavier-gaming": [
        ("wooting-80he", 77),
        ("keychron-q5-max", 72),
        ("lemokey-p1-he", 64),
    ],
    "meilleur-bureau-electrique": [
        ("flexispot-e7-pro", 81),
        ("secretlab-magnus-pro", 64),
        ("desktronic-homepro", 79),
    ],
    "meilleure-voiture-electrique": [
        ("tesla-model-y-juniper", 73),
        ("tesla-model-3-highland", 70),
        ("bmw-ix3-neue-klasse", 61),
        ("volkswagen-id7", 58),
    ],
    "meilleure-montre-connectee": [
        ("garmin-fenix-8", 73),
        ("apple-watch-ultra-2", 73),
        ("samsung-galaxy-watch-ultra", 77),
        ("google-pixel-watch-4", 76),
    ],
    "meilleure-station-accueil-usbc": [
        ("caldigit-ts5-plus", 95),
        ("plugable-tbt4-ud5", 87),
        ("startech-thunderbolt-4", 85),
        ("kensington-sd4842p-eq", 82),
    ],
    "meilleure-machine-a-cafe": [
        ("jura-e8-piano-black", 93),
        ("technivorm-moccamaster-kbg-select", 94),
        ("sage-barista-express-impress", 92),
        ("philips-series-5400", 90),
    ],
    "meilleur-robot-cuisine": [
        ("thermomix-tm7", 67),
        ("kitchenaid-artisan-5ksm175", 88),
        ("magimix-cook-expert-premium-xl", 77),
        ("kenwood-cooking-chef-gourmet", 82),
    ],
    "meilleure-friteuse-air": [
        ("ninja-foodi-flexdrawer-af500eu", 70),
        ("cosori-turboblaze-6l", 83),
    ],
}


def get_slug_for_score_in_context(filepath: str, lineno: int, score_val: int, context_line: str) -> str | None:
    """Essaye de déterminer le slug produit pour un score XX/100 donné, basé sur le contexte."""
    folder = str(filepath)
    
    # Cas 1: C'est un duel → les slugs sont dans DUEL_FOLDER_TO_SLUGS
    if "/duel/" in folder:
        # Extraire le nom du dossier duel
        match = re.search(r'/duel/([^/]+)/page\.tsx', folder)
        if match:
            duel_folder = match.group(1)
            slugs = DUEL_FOLDER_TO_SLUGS.get(duel_folder)
            if slugs:
                # On ne peut pas savoir lequel des deux, donc on essaie les deux
                # On check si le nom du produit apparaît dans le contexte
                for slug in slugs:
                    name = PRODUCT_SLUGS_DB.get(slug, ("", ""))[1]
                    if name.lower() in context_line.lower():
                        return slug
                # Si aucun match, retourner le premier (imperfect mais mieux que rien)
                return slugs[0]
    
    # Cas 2: C'est une page tops
    if "/tops/" in folder:
        match = re.search(r'/tops/([^/]+)/page\.tsx', folder)
        if match:
            tops_page = match.group(1)
            slugs_list = TOPS_PAGE_TO_SLUGS.get(tops_page, [])
            if slugs_list:
                # Chercher le slug dont le nom du produit apparaît dans le contexte
                for slug, db_score in slugs_list:
                    name = PRODUCT_SLUGS_DB.get(slug, ("", ""))[1]
                    if name.lower() in context_line.lower():
                        return slug
                # Fallback: utiliser la position dans la page (1er match = 1er produit, etc.)
                # Ceci est approximatif mais mieux que rien
                if len(slugs_list) > 0:
                    return slugs_list[0][0]
    
    return None


def patch_file(filepath: str) -> tuple[int, int]:
    """Patche un fichier: remplace XX/100 par <DynamicScore>.
    Retourne (occurrences_trouvees, occurrences_patchees)."""
    path = Path(filepath)
    original = path.read_text(encoding='utf-8')
    content = original
    
    # Pattern: (XX/100) ou XX/100 (avec ou sans parenthèses)
    # On capture aussi le score
    pattern = r'(\()?(\d+)(/100)\)?'
    
    found = 0
    patched = 0
    
    # Traiter ligne par ligne pour garder le contexte
    lines = content.split('\n')
    new_lines = []
    
    for i, line in enumerate(lines):
        lineno = i + 1
        
        def replace_score(match):
            nonlocal found, patched
            # Le score est soit dans le groupe 1 (parenthèses), soit dans le groupe 2 (sans)
            score_val = int(match.group(1) or match.group(2))
            
            found += 1
            
            slug = get_slug_for_score_in_context(filepath, lineno, score_val, line)
            if slug:
                patched += 1
                return f'<DynamicScore slug="{slug}" fallback={score_val}/>'
            else:
                # Garder l'original si on ne peut pas déterminer le slug
                return match.group(0)
        
        # Pattern large: (XX/100) ou "XX/100" dans du texte (pas dans des attributs HTML)
        # On capture tous les XX/100 qui sont dans du texte, pas dans des guillemets d'attributs
        new_line = re.sub(r'(?:\((\d+)/100\)|(?<!")(\d+)/100(?!"))', replace_score, line)
        new_lines.append(new_line)
    
    new_content = '\n'.join(new_lines)
    
    if found == 0:
        return 0, 0
    
    # Ajouter l'import si nécessaire
    if patched > 0 and IMPORT_LINE not in new_content:
        # Ajouter après le dernier import existant
        import_end = 0
        for j, line in enumerate(new_lines):
            if line.startswith('import ') or line.startswith('// @ts') or line.startswith('export const dynamic'):
                import_end = j + 1
        # Insérer l'import après les imports existants
        new_lines.insert(import_end, IMPORT_LINE)
        new_content = '\n'.join(new_lines)
    
    if new_content != original:
        path.write_text(new_content, encoding='utf-8')
    
    return found, patched


def main():
    # Patcher les duels
    duel_dir = Path(f"{FRONTEND}/src/app/duel")
    total_found = 0
    total_patched = 0
    patched_files = 0
    failed_files = []
    
    for duel_page in sorted(duel_dir.glob("*/page.tsx")):
        f, p = patch_file(str(duel_page))
        total_found += f
        total_patched += p
        if p > 0:
            patched_files += 1
            print(f"  ✅ {duel_page.parent.name} ({p}/{f} patched)")
        elif f > 0:
            failed_files.append(str(duel_page.parent.name))
            print(f"  ⚠️  {duel_page.parent.name} ({f} found, 0 patched - slugs non déterminés)")
    
    # Patcher les tops
    tops_dir = Path(f"{FRONTEND}/src/app/tops")
    for tops_page in sorted(tops_dir.glob("*/page.tsx")):
        if "[slug]" in str(tops_page):
            continue
        f, p = patch_file(str(tops_page))
        total_found += f
        total_patched += p
        if p > 0:
            patched_files += 1
            print(f"  ✅ tops/{tops_page.parent.name} ({p}/{f} patched)")
        elif f > 0:
            failed_files.append(f"tops/{tops_page.parent.name}")
            print(f"  ⚠️  tops/{tops_page.parent.name} ({f} found, 0 patched)")
    
    print(f"\n=== Résultat ===")
    print(f"Fichiers touchés: {patched_files}")
    print(f"Occurrences trouvées: {total_found}")
    print(f"Occurrences patchées: {total_patched}")
    if failed_files:
        print(f"Échecs (slugs non déterminés): {', '.join(failed_files)}")


if __name__ == "__main__":
    main()

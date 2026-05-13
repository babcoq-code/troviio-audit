#!/usr/bin/env python3
"""
Patch tous les scores hardcodés (XX/100) dans les pages de duels et tops
pour les remplacer par le composant <DynamicScore>.
Version 2: utilisation d'un compteur d'occurrences pour assigner correctement les slugs.
"""

import re
import os
from pathlib import Path
from collections import defaultdict

FRONTEND = "/root/troviio-ciceron/frontend"
IMPORT_LINE = 'import { DynamicScore } from "@/components/product/DynamicScore";\n'

# Mapping: slug → (score DB, nom court)
PRODUCTS = {
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
    "apple-watch-ultra-2-49mm-mww63zp-a": (73, "Apple Watch Ultra 2"),
    "samsung-galaxy-watch-ultra-l708": (77, "Samsung Galaxy Watch Ultra"),
    "bose-qc-ultra": (86, "Bose QC Ultra"),
    "sony-wh-1000xm6": (87, "Sony WH-1000XM6"),
    "bugaboo-fox-5": (85, "Bugaboo Fox 5"),
    "uppababy-vista-v3": (82, "Uppababy Vista V3"),
    "giant-explore-eplus-1": (83, "Giant Explore E+1"),
    "riese-muller-charger4": (84, "Riese & Muller Charger4"),
    "eaton-5sc-1500i": (80, "Eaton 5SC 1500i"),
    "apc-back-ups-pro-br650mi": (78, "APC Back-UPS Pro BR650MI"),
    "samsung-galaxy-s26-ultra": (82, "Samsung Galaxy S26 Ultra"),
    "iphone-17-pro-max": (85, "iPhone 17 Pro Max"),
    "sennheiser-ambeo-soundbar-mini": (83, "Sennheiser Ambeo Soundbar Mini"),
    "sony-ht-sf150": (78, "Sony HT-SF150"),
    "hp-envy-inspire-7924e": (79, "HP Envy Inspire 7924e"),
    "hp-officejet-pro-9135e": (81, "HP OfficeJet Pro 9135e"),
}

# Mapping: dossier duel → [slug_produit_1, slug_produit_2]
DUEL_SLUGS = {
    "thermomix-tm7-vs-kitchenaid-artisan": ["thermomix-tm7", "kitchenaid-artisan-5ksm175"],
    "ipad-pro-m5-11-vs-samsung-galaxy-tab-s11-ultra": ["ipad-pro-m5-11", "samsung-galaxy-tab-s11-ultra"],
    "dyson-gen5-detect-vs-samsung-bespoke-jet": ["dyson-gen5-detect-absolute", "samsung-bespoke-ai-jet-ultra"],
    "dyson-gen5-vs-samsung-bespoke-jet": ["dyson-gen5-detect-absolute", "samsung-bespoke-ai-jet-ultra"],
    "wooting-80he-vs-lemokey-p1-he": ["wooting-80he", "lemokey-p1-he"],
    "ninja-foodi-flexdrawer-vs-cosori-turboblaze": ["ninja-foodi-flexdrawer-af500eu", "cosori-turboblaze-6l"],
    "flexispot-e7-pro-vs-secretlab-magnus-pro": ["flexispot-e7-pro", "secretlab-magnus-pro"],
    "miele-wcr870-vs-bosch-wgb244a2fr": ["miele-wcr870-wps", "bosch-wgb244a2fr"],
    "hypnia-bien-etre-supreme-vs-emma-original": ["hypnia-bien-etre-supreme", "emma-original-hybrid-ii"],
    "it-takes-two-vs-split-fiction": ["it-takes-two", "split-fiction"],
    "silvercrest-monsieur-cuisine-smart-vs-magimix-cook-expert-premium-xl": ["silvercrest-monsieur-cuisine-smart", "magimix-cook-expert-premium-xl"],
    "duux-whisper-flex-2-vs-rowenta-vu5890f0": ["ventilateur-duux-whisperflex2", "ventilateur-rowenta-vu5890f0"],
    "dreame-x50-ultra-vs-roborock-qrevo-curv-2-pro": ["dreame-x50-ultra-complete", "roborock-qrevo-curv-2-pro"],
    "lg-g6-oled-vs-samsung-s95h-qd-oled": ["lg-g6-oled-65", "samsung-s95h-qd-oled-65"],
    "switch-2-pro-controller-vs-8bitdo-pro2-halleffect": ["switch-2-pro-controller", "8bitdo-pro2-halleffect"],
    "jura-e8-vs-sage-barista-express": ["jura-e8-piano-black", "sage-barista-express-impress"],
    "caldigit-ts5-plus-vs-plugable-tbt4-ud5": ["caldigit-ts5-plus", "plugable-tbt4-ud5"],
    "apple-watch-ultra-2-vs-samsung-galaxy-watch-ultra": ["apple-watch-ultra-2-49mm-mww63zp-a", "samsung-galaxy-watch-ultra-l708"],
    "bose-qc-ultra-vs-sony-wh-1000xm6": ["bose-qc-ultra", "sony-wh-1000xm6"],
    "tesla-model-y-juniper-vs-tesla-model-3-highland": ["tesla-model-y-juniper", "tesla-model-3-highland"],
    "hp-envy-inspire-7924e-vs-hp-officejet-pro-9135e": ["hp-envy-inspire-7924e", "hp-officejet-pro-9135e"],
    "bugaboo-fox5-vs-uppababy-vista-v3": ["bugaboo-fox-5", "uppababy-vista-v3"],
    "giant-explore-eplus1-vs-riese-muller-charger4": ["giant-explore-eplus1", "riese-muller-charger4"],
    "eaton-5sc-1500i-vs-apc-back-ups-pro-br650mi": ["eaton-5sc-1500i", "apc-back-ups-pro-br650mi"],
    "samsung-galaxy-s26-ultra-vs-iphone-17-pro-max": ["samsung-galaxy-s26-ultra", "iphone-17-pro-max"],
    "sennheiser-ambeo-soundbar-mini-vs-sony-ht-sf150": ["sennheiser-ambeo-soundbar-mini", "sony-ht-sf150"],
    "sony-ht-sf150-vs-sennheiser-ambeo-soundbar-mini": ["sony-ht-sf150", "sennheiser-ambeo-soundbar-mini"],
}

# Mapping: page tops → [slug_produit_1, slug_produit_2, slug_produit_3, slug_produit_4]
TOPS_SLUGS = {
    "meilleure-tv": ["lg-g6-oled-65", "samsung-s95h-qd-oled-65", "lg-c6-oled-65", "sony-bravia-8-ii-65-qd-oled"],
    "meilleur-aspirateur-balai": ["dyson-gen5-detect-absolute", "samsung-bespoke-ai-jet-ultra", "dyson-v15-detect-absolute"],
    "meilleur-aspirateur-robot": ["dreame-x50-ultra-complete", "roborock-qrevo-curv-2-pro", "roborock-s8-maxv-ultra"],
    "meilleur-clavier-gaming": ["wooting-80he", "keychron-q5-max", "lemokey-p1-he"],
    "meilleur-bureau-electrique": ["flexispot-e7-pro", "secretlab-magnus-pro", "desktronic-homepro"],
    "meilleure-voiture-electrique": ["tesla-model-y-juniper", "tesla-model-3-highland", "bmw-ix3-neue-klasse", "volkswagen-id7"],
    "meilleure-montre-connectee": ["garmin-fenix-8", "apple-watch-ultra-2-49mm-mww63zp-a", "samsung-galaxy-watch-ultra-l708", "google-pixel-watch-4"],
    "meilleure-station-accueil-usbc": ["caldigit-ts5-plus", "plugable-tbt4-ud5", "startech-thunderbolt-4", "kensington-sd4842p-eq"],
    "meilleure-machine-a-cafe": ["jura-e8-piano-black", "technivorm-moccamaster-kbg-select", "sage-barista-express-impress", "philips-series-5400"],
    "meilleur-robot-cuisine": ["thermomix-tm7", "kitchenaid-artisan-5ksm175", "magimix-cook-expert-premium-xl", "kenwood-cooking-chef-gourmet"],
    "meilleure-friteuse-air": ["ninja-foodi-flexdrawer-af500eu", "cosori-turboblaze-6l"],
}


def get_slug_sequence(filepath: str) -> list[str] | None:
    """Retourne la séquence ordonnée des slugs pour les scores dans ce fichier."""
    if "/duel/" in filepath:
        m = re.search(r'/duel/([^/]+)/page\.tsx', filepath)
        if m:
            return DUEL_SLUGS.get(m.group(1))
    if "/tops/" in filepath:
        m = re.search(r'/tops/([^/]+)/page\.tsx', filepath)
        if m and m.group(1) != "[slug]":
            return TOPS_SLUGS.get(m.group(1))
    return None


def patch_file(filepath: str) -> tuple[int, int]:
    path = Path(filepath)
    original = path.read_text(encoding='utf-8')
    content = original
    
    slug_seq = get_slug_sequence(filepath)
    if not slug_seq:
        return 0, 0
    
    found = 0
    patched = 0
    counter = 0  # Compteur d'occurrences de XX/100 dans le fichier
    
    # Traiter ligne par ligne
    lines = content.split('\n')
    new_lines = []
    
    def replace_score(match):
        nonlocal found, patched, counter
        score_val = int(match.group(1) or match.group(2))
        found += 1
        
        # Assigner le slug en alternant selon l'ordre d'apparition
        # Chaque occurrence alterne entre slug_seq[0], slug_seq[1], slug_seq[2], ...
        idx = counter % len(slug_seq)
        counter += 1
        slug = slug_seq[idx]
        
        if slug and slug in PRODUCTS:
            patched += 1
            return f'<DynamicScore slug="{slug}" fallback={{{score_val}}}/>'
        else:
            return match.group(0)
    
    for i, line in enumerate(lines):
        # Pattern: (XX/100) ou XX/100 dans du texte (pas dans des guillemets d'attributs HTML)
        # Ne PAS patcher les lignes qui sont dans des chaînes JS (metadata description, headline)
        if 'metadata:' in line or 'description:' in line or 'headline:' in line:
            new_lines.append(line)
            continue
        
        new_line = re.sub(r'(?:\((\d+)/100\)|(?<!")(\d+)/100(?!"))', replace_score, line)
        new_lines.append(new_line)
    
    new_content = '\n'.join(new_lines)
    
    if patched == 0:
        return 0, 0
    
    # Ajouter l'import si nécessaire — toujours APRÈS le dernier vrai import
    if IMPORT_LINE not in new_content:
        # Trouver la dernière ligne qui est un import réel (import ... from ...)
        last_real_import = -1
        for j, line in enumerate(new_lines):
            stripped = line.strip()
            if stripped.startswith('import ') and 'from ' in stripped:
                last_real_import = j
            # Arrêter si on tombe sur du code non-import
            elif last_real_import >= 0 and stripped.startswith('export '):
                break
        
        if last_real_import >= 0:
            # Insérer après le dernier import réel
            new_lines.insert(last_real_import + 1, IMPORT_LINE)
            new_content = '\n'.join(new_lines)
    
    if new_content != original:
        path.write_text(new_content, encoding='utf-8')
    
    return found, patched


def main():
    total_found = 0
    total_patched = 0
    patched_files = 0
    not_found_files = []
    
    # Patcher les duels
    for duel_page in sorted(Path(f"{FRONTEND}/src/app/duel").glob("*/page.tsx")):
        f, p = patch_file(str(duel_page))
        total_found += f
        total_patched += p
        if p > 0:
            patched_files += 1
            print(f"  ✅ {duel_page.parent.name} ({p}/{f} patched)")
        elif f > 0:
            not_found_files.append(duel_page.parent.name)
            print(f"  ⚠️  {duel_page.parent.name} ({f} trouvés, 0 patchés - slug_seq manquant)")
    
    # Patcher les tops
    for tops_page in sorted(Path(f"{FRONTEND}/src/app/tops").glob("*/page.tsx")):
        if "[slug]" in str(tops_page):
            continue
        f, p = patch_file(str(tops_page))
        total_found += f
        total_patched += p
        if p > 0:
            patched_files += 1
            name = tops_page.parent.name
            print(f"  ✅ tops/{name} ({p}/{f} patched)")
        elif f > 0:
            name = tops_page.parent.name
            not_found_files.append(f"tops/{name}")
            print(f"  ⚠️  tops/{name} ({f} trouvés, 0 patchés)")
    
    print(f"\n=== Résultat ===")
    print(f"Fichiers patchés: {patched_files}")
    print(f"Occurrences trouvées: {total_found}")
    print(f"Occurrences patchées: {total_patched}")
    if not_found_files:
        print(f"Fichiers avec scores non patchés: {', '.join(not_found_files)}")


if __name__ == "__main__":
    main()

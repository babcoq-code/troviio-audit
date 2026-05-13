#!/usr/bin/env python3
"""Fix les imports DynamicScore mal placés dans les fichiers de duels et tops."""

import re
from pathlib import Path

FRONTEND = "/root/troviio-ciceron/frontend"
IMPORT_LINE = 'import { DynamicScore } from "@/components/product/DynamicScore";\n'

def fix_file(filepath: str) -> bool:
    path = Path(filepath)
    content = path.read_text(encoding='utf-8')
    lines = content.split('\n')
    
    # Trouver la ligne avec l'import DynamicScore
    dyn_idx = None
    for i, line in enumerate(lines):
        if 'import { DynamicScore }' in line:
            dyn_idx = i
            break
    
    if dyn_idx is None:
        return False
    
    # Vérifier si l'import est bien placé (ligne précédente est vide ou import)
    prev_line = lines[dyn_idx - 1].strip() if dyn_idx > 0 else ""
    # Un import est bien placé si précédé d'un import, d'une ligne vide, ou d'un commentaire
    # Il est mal placé si précédé de 'export const', '{', '}', etc.
    if not (prev_line.startswith('import ') or prev_line == '' or prev_line.startswith('//')):
        # C'est mal placé: trouver le dernier vrai import
        last_import_idx = -1
        for i in range(dyn_idx):
            if lines[i].strip().startswith('import ') and 'DynamicScore' not in lines[i]:
                last_import_idx = i
        
        if last_import_idx >= 0:
            # Supprimer et réinsérer
            dyn_line = lines.pop(dyn_idx)
            lines.insert(last_import_idx + 1, dyn_line)
            path.write_text('\n'.join(lines), encoding='utf-8')
            return True
    
    return False

def main():
    fixed = 0
    checked = 0
    
    # Duels
    for f in sorted(Path(f"{FRONTEND}/src/app/duel").glob("*/page.tsx")):
        checked += 1
        if fix_file(str(f)):
            fixed += 1
            print(f"  ✅ {f.parent.name}")
    
    # Tops (sauf [slug])
    for f in sorted(Path(f"{FRONTEND}/src/app/tops").glob("*/page.tsx")):
        if "[slug]" in str(f):
            continue
        checked += 1
        if fix_file(str(f)):
            fixed += 1
            print(f"  ✅ tops/{f.parent.name}")
    
    print(f"\nVérifié: {checked} fichiers, corrigé: {fixed}")

if __name__ == "__main__":
    main()

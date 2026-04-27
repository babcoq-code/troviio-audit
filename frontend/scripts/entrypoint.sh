#!/bin/bash
# Entrypoint wrapper for troviio-frontend
# Applique les patches de marque après le démarrage du serveur

set -e

echo "[troviio-entrypoint] Démarrage du post-deploy..."

# Patcher les bundles
for f in $(find /app/.next -name '*.js' -exec grep -l 'Picksy' {} \; 2>/dev/null); do
  sed -i 's/Picksy/Troviio/g' "$f"
done

for ext in html rsc; do
  for f in $(find /app/.next/server -name "*.$ext" 2>/dev/null); do
    sed -i 's/Picksy/Troviio/g' "$f"
  done
done

echo "[troviio-entrypoint] Patches appliqués, lancement du serveur..."

# Lancer le serveur normal
exec node /app/server.js

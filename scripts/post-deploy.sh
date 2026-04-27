#!/bin/bash
# Post-deploy : repatch les bundles compilés après rebuild Docker
# Car Docker compose up --build recrée les conteneurs depuis l'image

set -e

echo "=== Post-deploy Troviio : patching bundles ==="

# Attendre que le frontend soit prêt
sleep 3

# 1. Patcher les bundles JS (server + client)
echo "→ Patching JS bundles..."
for f in $(docker exec picksy-frontend-1 sh -c "find /app/.next -name '*.js' -exec grep -l 'Picksy' {} \;" 2>/dev/null); do
  docker exec picksy-frontend-1 sh -c "sed -i 's/Picksy/Troviio/g' \"$f\"" 2>/dev/null
done

# 2. Patcher les fichiers RSC et HTML pré-rendus
echo "→ Patching RSC/HTML..."
for ext in html rsc; do
  for f in $(docker exec picksy-frontend-1 sh -c "find /app/.next/server -name '*.$ext'" 2>/dev/null); do
    docker exec picksy-frontend-1 sh -c "sed -i 's/Picksy/Troviio/g' \"$f\"" 2>/dev/null
  done
done

# 3. Patcher les URLs picksy.babcoq.tech → troviio.com
echo "→ Patching API URLs..."
docker exec picksy-frontend-1 sh -c "
  find /app/.next -type f | xargs grep -l 'picksy.babcoq.tech' 2>/dev/null | \
  while read f; do
    sed -i 's|https://picksy.babcoq.tech/api|https://troviio.com/api|g' \"\$f\"
    sed -i 's|https://picksy.babcoq.tech|https://troviio.com|g' \"\$f\"
  done
" 2>/dev/null

# 3b. Patcher URL chat /chat/ → /chat/chat dans les bundles
echo "→ Patching chat URL..."
docker exec picksy-frontend-1 sh -c "
  find /app/.next -name '*.js' | xargs grep -l 'concat.*"/chat/"' 2>/dev/null | while read f; do
    sed -i 's|concat(n,"/chat/")|concat(n,"/chat/chat")|g' "\$f"
    sed -i 's|concat(r,"/chat/")|concat(r,"/chat/chat")|g' "\$f"
    sed -i 's|concat(n,\x27/chat/\x27)|concat(n,\x27/chat/chat\x27)|g' "\$f"
  done
" 2>/dev/null

# 4. Copier les assets
echo "→ Copying brand assets..."
docker cp /opt/picksy/frontend/public/assets picksy-frontend-1:/app/public/ 2>/dev/null
docker cp /opt/picksy/frontend/public/logo-dark.svg picksy-frontend-1:/app/public/logo-dark.svg 2>/dev/null
docker cp /opt/picksy/frontend/public/logo-light.svg picksy-frontend-1:/app/public/logo-light.svg 2>/dev/null
docker cp /opt/picksy/frontend/public/logo-icon.svg picksy-frontend-1:/app/public/logo-icon.svg 2>/dev/null
docker cp /opt/picksy/frontend/public/favicon.svg picksy-frontend-1:/app/public/favicon.svg 2>/dev/null

# 4. Restart
echo "→ Restarting frontend..."
docker restart picksy-frontend-1 > /dev/null
sleep 4

# 5. Vérification
echo "→ Verification:"
result=$(curl -s -H "Cache-Control: no-cache" http://localhost:3000/ 2>&1 | grep -o "Troviio\|Picksy" | sort | uniq -c)
picksy_count=$(echo "$result" | grep "Picksy" | awk '{print $1}')
troviio_count=$(echo "$result" | grep "Troviio" | awk '{print $1}')
echo "  Troviio: $troviio_count occurrences"
echo "  Picksy: ${picksy_count:-0} occurrences"

if [ -z "$picksy_count" ] || [ "$picksy_count" -eq 0 ]; then
  echo "✅ Post-deploy réussi : zéro occurrence Picksy"
else
  echo "⚠️  $picksy_count occurrences Picksy restantes"
fi

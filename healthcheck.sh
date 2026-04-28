#!/bin/bash
# Healthcheck — vérifie tous les services critiques et les redémarre si nécessaire
# Exécuté toutes les 2 minutes par cron

set -e

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

# Containers critiques
CONTAINERS="picksy-backend-1 picksy-frontend-1 picksy-redis-1"

for container in $CONTAINERS; do
  if ! docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
    log "⚠️  $container n'est pas lancé. Redémarrage..."
    cd /opt/picksy && docker compose up -d ${container%%-*} 2>&1 | tail -1
  elif [ "$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null)" = "unhealthy" ]; then
    log "⚠️  $container est unhealthy. Redémarrage..."
    docker restart "$container"
  fi
done

# Vérifier que cloudflared est actif
if ! systemctl is-active --quiet cloudflared; then
  log "⚠️  cloudflared est down. Redémarrage..."
  systemctl restart cloudflared
fi

# Vérifier que le backend répond
if ! curl -sf http://localhost:8000/api/health > /dev/null 2>&1; then
  log "⚠️  backend ne répond pas. Redémarrage..."
  docker restart picksy-backend-1
fi

# Vérifier que le frontend répond
if ! curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
  log "⚠️  frontend ne répond pas. Redémarrage..."
  docker restart picksy-frontend-1
fi

log "✅ Tous les services sont OK"

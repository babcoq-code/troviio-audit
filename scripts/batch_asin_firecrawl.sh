#!/bin/bash
# Script batch pour trouver les ASINs des 36 produits sans ASIN
# Utilise Firefox via playwright + Firecrawl pour les prix
set -e

FIRECRAWL_KEY=$(cat /root/troviio-ciceron/.env | grep FIRECRAWL_API_KEY | cut -d= -f2 | tr -d ' \n\r')
TAG="troviio-21"

# Récupérer les produits sans ASIN
echo "📡 Récupération des produits sans ASIN..."
PRODUCTS=$(docker exec troviio-ciceron-backend-1 python3 -c "
import json
from supabase import create_client
s = create_client('os.getenv("SUPABASE_URL", "")', '"SUPABASE_SERVICE_KEY"')
resp = s.table('products').select('id,name,slug,amazon_asin').is_('amazon_asin', 'null').eq('is_active', True).limit(50).execute()
print(json.dumps(resp.data))
" 2>&1)

echo "$PRODUCTS" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(f'📊 {len(data)} produits à traiter')
except:
    print(f'❌ Erreur: {sys.stdin.read()[:200]}')
" 2>/dev/null || echo "❌ Erreur de récupération"

# Sauvegarder la liste
echo "$PRODUCTS" > /tmp/troviio_products_no_asin.json
echo "✅ Liste sauvegardée dans /tmp/troviio_products_no_asin.json"
"""📊 Troviio Metrics Tracker — exécuté quotidiennement par cron

Collecte et stocke les KPIs du jour :
- Abonnés newsletter
- Produits actifs / catégories
- Résultats chat générés
- (Futur) Ventes Amazon via affiliate
- (Futur) Trafic GA4

Stockage : fichier JSON dans /data/metrics/ et/ou table Supabase metrics_log
"""

import json, os, sys
from datetime import datetime, timezone
from supabase import create_client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

supa = create_client(SUPABASE_URL, SUPABASE_KEY)

LOG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "data", "metrics", "daily.jsonl")
# Fallback: host-mounted path
if not os.path.exists(os.path.dirname(LOG_PATH)):
    LOG_PATH = "/data/metrics/daily.jsonl"
os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)

def collect():
    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    
    # 1. Newsletter subscribers
    n = supa.table("newsletter_subscribers").select("id", count="exact").execute()
    subscribers = n.count if n.count is not None else len(n.data)
    
    # 2. Produits actifs
    p = supa.table("products").select("id", count="exact").eq("is_active", True).execute()
    products = p.count if p.count is not None else len(p.data)
    
    # 3. Catégories
    c = supa.table("categories").select("id", count="exact").execute()
    categories = c.count if c.count is not None else len(c.data)
    
    # 4. Résultats chat
    try:
        r = supa.table("results").select("id", count="exact").execute()
        results = r.count if r.count is not None else len(r.data)

        # Résultats aujourd'hui
        r_today = supa.table("results") \
            .select("id", count="exact") \
            .gte("created_at", today) \
            .execute()
        results_today = r_today.count if r_today.count is not None else len(r_today.data)
    except Exception:
        results = -1
        results_today = -1
    
    return {
        "date": today,
        "timestamp": now.isoformat(),
        "newsletter_subscribers": subscribers,
        "active_products": products,
        "categories": categories,
        "chat_results_total": results,
        "chat_results_today": results_today,
    }


def store(metrics: dict, to_supabase: bool = False):
    """Stocke les métriques dans un fichier JSONL."""
    # Fichier local
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    with open(LOG_PATH, "a") as f:
        f.write(json.dumps(metrics) + "\n")


if __name__ == "__main__":
    metrics = collect()
    store(metrics)
    print(json.dumps(metrics, indent=2))

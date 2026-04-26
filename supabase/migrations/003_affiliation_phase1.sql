-- =========================================================
-- Migration 003 : Phase 1 affiliation Picksy
-- =========================================================

-- Table price_history (ABSENTE — bloquant pour le tracking)
CREATE TABLE IF NOT EXISTS public.price_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    currency        VARCHAR(3) NOT NULL DEFAULT 'EUR',
    merchant_name   VARCHAR(100),
    source          TEXT DEFAULT 'scraper',
    observed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_product_time
    ON public.price_history(product_id, observed_at DESC);

CREATE INDEX IF NOT EXISTS idx_price_history_time
    ON public.price_history(observed_at DESC);

-- Table search_events — tracking anonyme
CREATE TABLE IF NOT EXISTS public.search_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      TEXT,
    query           TEXT NOT NULL,
    category        TEXT,
    budget_min      NUMERIC(10, 2),
    budget_max      NUMERIC(10, 2),
    result_count    INTEGER,
    ip_hash         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_events_created
    ON public.search_events(created_at DESC);

-- Table affiliate_clicks — tracking des clics affiliés
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID REFERENCES public.products(id) ON DELETE SET NULL,
    outbound_url    TEXT NOT NULL,
    merchant        TEXT,
    session_id      TEXT,
    ip_hash         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product
    ON public.affiliate_clicks(product_id);

-- Ajouter colonne slug aux produits (nécessaire pour /produit/[slug])
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- Générer les slugs pour les produits existants
UPDATE public.products
SET slug = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
    )
)
WHERE slug IS NULL;

-- RLS — Sécurité
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour price_history
DROP POLICY IF EXISTS "Public read price_history" ON public.price_history;
CREATE POLICY "Public read price_history"
ON public.price_history FOR SELECT TO anon, authenticated USING (true);

-- Vue résumé prix pour les pages produit
CREATE OR REPLACE VIEW public.v_product_price_summary AS
SELECT
    product_id,
    MIN(price)                      AS min_price,
    MAX(price)                      AS max_price,
    ROUND(AVG(price)::NUMERIC, 2)   AS avg_price,
    COUNT(*)                        AS observations,
    MAX(observed_at)                AS last_seen_at
FROM public.price_history
WHERE observed_at > NOW() - INTERVAL '90 days'
GROUP BY product_id;

GRANT SELECT ON public.v_product_price_summary TO anon, authenticated;

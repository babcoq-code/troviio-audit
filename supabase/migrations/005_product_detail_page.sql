-- ===============================================================
-- Migration 005 : Product Detail Page (slugs, ratings, pros/cons)
-- ===============================================================

-- 1. Ajout des colonnes manquantes à products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS test_summary TEXT,
  ADD COLUMN IF NOT EXISTS verdict TEXT,
  ADD COLUMN IF NOT EXISTS ratings JSONB,
  ADD COLUMN IF NOT EXISTS why_perfect TEXT,
  ADD COLUMN IF NOT EXISTS source_title TEXT,
  ADD COLUMN IF NOT EXISTS source_date TIMESTAMPTZ;

-- 2. Slug : générer pour les produits existants et rendre NOT NULL
CREATE EXTENSION IF NOT EXISTS unaccent;

UPDATE public.products
SET slug = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(
            unaccent(COALESCE(brand, '') || '-' || COALESCE(name, '')),
            '[^a-zA-Z0-9\s-]', '', 'g'
        ),
        '\s+', '-', 'g'
    )
)
WHERE slug IS NULL OR slug = '';

ALTER TABLE public.products ALTER COLUMN slug SET NOT NULL;

-- Supprimer l'index unique existant et recréer la contrainte
DROP INDEX IF EXISTS idx_products_slug;
ALTER TABLE public.products ADD CONSTRAINT products_slug_unique UNIQUE (slug);

-- Index sur slug
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- 3. Index optimisé pour price_history
CREATE INDEX IF NOT EXISTS idx_price_history_product_platform_time
    ON public.price_history(product_id, merchant_name, observed_at DESC);

-- 4. Fonction RPC : get_latest_prices_by_platform
CREATE OR REPLACE FUNCTION public.get_latest_prices_by_platform(
    p_product_id UUID
)
RETURNS TABLE (
    platform TEXT,
    retailer TEXT,
    price NUMERIC(10,2),
    currency VARCHAR(3),
    url TEXT,
    affiliate_url TEXT,
    is_available BOOLEAN,
    updated_at TIMESTAMPTZ,
    scraped_at TIMESTAMPTZ,
    recorded_at TIMESTAMPTZ,
    observed_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
AS $$
    SELECT
        pr.retailer::TEXT AS platform,
        pr.retailer::TEXT AS retailer,
        pr.price::NUMERIC(10,2),
        COALESCE(pr.currency, 'EUR')::VARCHAR(3),
        pr.url::TEXT,
        pr.affiliate_url::TEXT,
        pr.is_available::BOOLEAN,
        pr.updated_at::TIMESTAMPTZ,
        NULL::TIMESTAMPTZ AS scraped_at,
        NULL::TIMESTAMPTZ AS recorded_at,
        NULL::TIMESTAMPTZ AS observed_at
    FROM public.prices pr
    WHERE pr.product_id = p_product_id

    UNION ALL

    SELECT
        COALESCE(ph.merchant_name, 'unknown')::TEXT AS platform,
        COALESCE(ph.merchant_name, 'unknown')::TEXT AS retailer,
        ph.price::NUMERIC(10,2),
        COALESCE(ph.currency, 'EUR')::VARCHAR(3),
        NULL::TEXT AS url,
        NULL::TEXT AS affiliate_url,
        TRUE::BOOLEAN AS is_available,
        NULL::TIMESTAMPTZ AS updated_at,
        NULL::TIMESTAMPTZ AS scraped_at,
        NULL::TIMESTAMPTZ AS recorded_at,
        ph.observed_at::TIMESTAMPTZ
    FROM public.price_history ph
    WHERE ph.product_id = p_product_id
      AND ph.observed_at > NOW() - INTERVAL '30 days'
    ORDER BY observed_at DESC NULLS LAST, updated_at DESC NULLS LAST;
$$;

-- 5. Mise à jour de la vue v_products_published
CREATE OR REPLACE VIEW public.v_products_published AS
SELECT
  p.id,
  p.name,
  p.brand,
  p.model,
  p.slug,
  p.image_url,
  p.estimated_score,
  p.price_eur,
  p.use_case_scores,
  p.specs,
  p.affiliate_url,
  p.amazon_asin,
  p.source_url,
  p.source_title,
  p.source_date,
  p.test_summary,
  p.verdict,
  p.ratings,
  p.why_perfect,
  p.pros,
  p.cons,
  p.summary AS description,
  p.best_for AS rank_label,
  c.slug AS category_slug,
  c.name_fr AS category_name,
  c.emoji AS category_emoji
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.status = 'published' AND p.is_active = true;

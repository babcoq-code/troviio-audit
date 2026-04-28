-- ============================================================================
-- TROVIIO — Migration safe (ALTER TABLE, pas de DROP)
-- À exécuter dans Supabase SQL Editor
-- Préserve les 330 produits existants avec leurs données
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigger updated_at (recréé si pas existant)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

-- ── 1. TABLE categories (nouvelle) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        NOT NULL UNIQUE,
  name        TEXT        NOT NULL,
  emoji       TEXT,
  description TEXT,
  subtitle    TEXT,
  priority    INTEGER     DEFAULT 0,
  is_active   BOOLEAN     DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. ALTER TABLE products — Ajouter colonnes manquantes ─────────────────
DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tagline TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_min_eur INTEGER;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_max_eur INTEGER;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_range TEXT CHECK (price_range IN ('budget','mid','premium'));
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS troviio_score INTEGER CHECK (troviio_score IS NULL OR troviio_score BETWEEN 0 AND 100);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS amazon_tag TEXT DEFAULT 'troviio-21';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS best_for TEXT[] DEFAULT '{}'::TEXT[];
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS avoid_if TEXT[] DEFAULT '{}'::TEXT[];
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'::TEXT[];
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rank_in_category INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS merchant_links JSONB DEFAULT '{}'::JSONB;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- ── 3. Trigger updated_at sur products ─────────────────────────────────────
DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 4. TABLE chat_sessions ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id                     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token          TEXT         NOT NULL UNIQUE,
  category_slug          TEXT,
  messages               JSONB        DEFAULT '[]'::JSONB,
  recommended_product_id UUID,
  user_criteria          JSONB        DEFAULT '{}'::JSONB,
  created_at             TIMESTAMPTZ  DEFAULT NOW(),
  updated_at             TIMESTAMPTZ  DEFAULT NOW()
);

-- ── 5. TABLE affiliate_clicks ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID,
  merchant      TEXT,
  session_id    TEXT,
  category_slug TEXT,
  surface       TEXT         CHECK (surface IS NULL OR surface IN ('chat','seo','newsletter')),
  sub_id        TEXT,
  clicked_at    TIMESTAMPTZ  DEFAULT NOW(),
  ip_hash       TEXT
);

-- ── 6. Indexes ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_categories_slug          ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_active        ON public.categories (is_active, priority DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_id     ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug            ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_featured_active ON public.products (is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_products_category_rank   ON public.products (category_id, is_active, rank_in_category);
CREATE INDEX IF NOT EXISTS idx_products_score_active    ON public.products (is_active, troviio_score DESC);
CREATE INDEX IF NOT EXISTS idx_products_tags_gin        ON public.products USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_products_best_for_gin    ON public.products USING GIN (best_for);
CREATE INDEX IF NOT EXISTS idx_products_specs_gin       ON public.products USING GIN (specs);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_token      ON public.chat_sessions (session_token);
CREATE INDEX IF NOT EXISTS idx_clicks_product_date      ON public.affiliate_clicks (product_id, clicked_at DESC);

-- ── 7. RLS ──────────────────────────────────────────────────────────────────
ALTER TABLE public.categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories"
  ON public.categories FOR SELECT TO anon, authenticated USING (is_active = TRUE);

DROP POLICY IF EXISTS "Session insert own" ON public.chat_sessions;
CREATE POLICY "Session insert own" ON public.chat_sessions FOR INSERT TO anon, authenticated
  WITH CHECK (session_token = NULLIF(current_setting('request.jwt.claims',TRUE)::JSONB->>'session_token',''));

DROP POLICY IF EXISTS "Session read own" ON public.chat_sessions;
CREATE POLICY "Session read own" ON public.chat_sessions FOR SELECT TO anon, authenticated
  USING (session_token = NULLIF(current_setting('request.jwt.claims',TRUE)::JSONB->>'session_token',''));

DROP POLICY IF EXISTS "Session update own" ON public.chat_sessions;
CREATE POLICY "Session update own" ON public.chat_sessions FOR UPDATE TO anon, authenticated
  USING (session_token = NULLIF(current_setting('request.jwt.claims',TRUE)::JSONB->>'session_token',''));

DROP POLICY IF EXISTS "Public insert clicks" ON public.affiliate_clicks;
CREATE POLICY "Public insert clicks"
  ON public.affiliate_clicks FOR INSERT TO anon, authenticated WITH CHECK (TRUE);

-- ── 8. Seed categories ────────────────────────────────────────────────────
INSERT INTO public.categories (id, slug, name, emoji, priority) VALUES
  ('f3bb790a-ac9e-4ec0-9afc-136f526d6779', 'smartphone',          'Smartphone',          '📱', 100),
  ('5a953c94-cd69-43bb-93d9-50ce438a8507', 'machine-a-cafe',      'Machine à café',      '☕', 90),
  ('05b88dd1-8163-4818-8a7b-e9456eee17bd', 'aspirateur-balai',    'Aspirateur balai',    '🧹', 85),
  ('ea42cb00-88dc-4f28-b6cb-1ef1f8815928', 'friteuse-air',        'Friteuse à air',      '🍟', 70),
  ('68995990-778d-4a9e-8455-88a66420ff2d', 'casque-audio',        'Casque audio',        '🎧', 65),
  ('ab8ba16e-4cdd-478a-9392-c102553c144c', 'aspirateur-robot',    'Aspirateur robot',    '🤖', 95),
  ('a7bfd20b-d1c3-413c-b152-e8a864ee6807', 'barre-de-son',        'Barre de son',        '🔊', 55),
  ('84d9b80d-c93d-494f-8734-61ed071ea8d4', 'refrigerateur',       'Réfrigérateur',       '❄️', 50),
  ('27cf5adf-9874-45df-a99f-64078bdef215', 'lave-linge',          'Lave-linge',          '👕', 80),
  ('add466ab-e5e8-4733-8c6a-889c0760330b', 'lave-vaisselle',      'Lave-vaisselle',      '🍽️', 75),
  ('b12c74f2-2938-48eb-9696-9f0cea78e277', 'four-micro-ondes',    'Four / Micro-ondes',  '🔥', 60),
  ('5d820d3f-1913-439a-9642-77cf4d2ec30c', 'poussette',           'Poussette',           '👶', 45),
  ('aa82a9ca-4693-4590-9663-70ec47ace114', 'ordinateur-portable', 'Ordinateur portable', '💻', 40),
  ('6c9e7f55-f3c2-4d37-99e3-ee7b9800f53b', 'tv',                 'TV',                  '📺', 35),
  ('588358b4-81dc-410f-bcd5-7ea6e2eac5ab', 'enceinte-bt',        'Enceinte Bluetooth',  '🔈', 25)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, 
  emoji = EXCLUDED.emoji, priority = EXCLUDED.priority;

-- ── 9. Grants ────────────────────────────────────────────────────────────
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT ON public.affiliate_clicks TO anon, authenticated;

-- ⚠️ products: RLS déjà activée ? on laisse les policies existantes
-- Pour les nouvelles colonnes, les SELECT existantes marchent déjà

-- ── 10. Helper function ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_products_by_category(p_slug TEXT)
RETURNS TABLE (
  id UUID, category_id UUID, category_slug TEXT, name TEXT, brand TEXT,
  slug TEXT, tagline TEXT, description TEXT, image_url TEXT,
  price_eur INTEGER, price_min_eur INTEGER, price_max_eur INTEGER, price_range TEXT,
  rating DECIMAL(3,2), review_count INTEGER, troviio_score INTEGER,
  amazon_asin TEXT, amazon_tag TEXT, merchant_links JSONB,
  best_for TEXT[], avoid_if TEXT[], pros TEXT[], cons TEXT[],
  specs JSONB, tags TEXT[], is_featured BOOLEAN,
  rank_in_category INTEGER, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
)
LANGUAGE SQL STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT p.id, p.category_id, c.slug, p.name, p.brand, p.slug,
    p.tagline, p.description, p.image_url,
    p.price_eur, p.price_min_eur, p.price_max_eur, p.price_range,
    p.rating, p.review_count, p.troviio_score,
    p.amazon_asin, p.amazon_tag, p.merchant_links,
    p.best_for, p.avoid_if, p.pros, p.cons,
    p.specs, p.tags, p.is_featured, p.rank_in_category, p.created_at, p.updated_at
  FROM public.products p
  JOIN public.categories c ON c.id = p.category_id
  WHERE c.slug = p_slug AND c.is_active = TRUE AND p.is_active = TRUE
  ORDER BY p.rank_in_category ASC, p.is_featured DESC, p.troviio_score DESC NULLS LAST;
$$;

GRANT EXECUTE ON FUNCTION public.get_products_by_category(TEXT) TO anon, authenticated;

-- ── Done ──────────────────────────────────────────────────────────────────

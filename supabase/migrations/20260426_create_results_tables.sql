-- Migration 004 : Tables résultats recommandations Picksy
-- Crée les tables results et result_recommendations pour la page /resultats/[id]

CREATE TABLE IF NOT EXISTS public.results (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id     TEXT        UNIQUE NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  profile       JSONB       NOT NULL,
  metadata      JSONB       NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.result_recommendations (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id     UUID        REFERENCES public.results(id) ON DELETE CASCADE,
  product_id    UUID,
  rank          INT         NOT NULL DEFAULT 1,
  name          TEXT        NOT NULL,
  brand         TEXT        NOT NULL,
  rank_label    TEXT        NOT NULL,
  why_perfect   TEXT,
  pros          TEXT[]      NOT NULL DEFAULT '{}',
  cons          TEXT[]      NOT NULL DEFAULT '{}',
  score         FLOAT       NOT NULL,
  price_range   TEXT        NOT NULL,
  enriched_data JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_results_result_id ON public.results(result_id);
CREATE INDEX IF NOT EXISTS idx_result_recs_result_id ON public.result_recommendations(result_id);
CREATE INDEX IF NOT EXISTS idx_result_recs_rank ON public.result_recommendations(result_id, rank);

-- RLS
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read results" ON public.results;
CREATE POLICY "Public read results" ON public.results FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read result_recommendations" ON public.result_recommendations;
CREATE POLICY "Public read result_recommendations" ON public.result_recommendations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service insert results" ON public.results;
CREATE POLICY "Service insert results" ON public.results FOR INSERT WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service insert result_recommendations" ON public.result_recommendations;
CREATE POLICY "Service insert result_recommendations" ON public.result_recommendations FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Nettoyage automatique des résultats > 90 jours
CREATE OR REPLACE FUNCTION public.cleanup_old_results()
RETURNS void AS $$
BEGIN
  DELETE FROM public.results WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

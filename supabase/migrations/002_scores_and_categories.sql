-- ============================================
-- PICKSY — Migration 002
-- Ajout colonnes scores, use_case_scores, status, source fields
-- ============================================

-- Ajouter les colonnes manquantes à products
ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending_review';
ALTER TABLE products ADD COLUMN IF NOT EXISTS estimated_score DECIMAL(4,1);
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_eur INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS source_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS source_date TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN IF NOT EXISTS use_case_scores JSONB DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS affiliate_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS amazon_asin TEXT;

-- Index utiles
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Table de scraping jobs pour tracker les crawls
CREATE TABLE IF NOT EXISTS scrape_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending, running, done, failed
  products_found INTEGER DEFAULT 0,
  error TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vue pratique pour le chat : produits publiés avec leur catégorie
CREATE OR REPLACE VIEW v_products_published AS
SELECT 
  p.id,
  p.name,
  p.brand,
  p.model,
  p.image_url,
  p.estimated_score,
  p.price_eur,
  p.use_case_scores,
  p.specs,
  p.affiliate_url,
  p.amazon_asin,
  p.source_url,
  c.slug AS category_slug,
  c.name_fr AS category_name,
  c.emoji AS category_emoji
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.status = 'published' AND p.is_active = true;

-- Activer RLS sur scrape_jobs (lecture publique)
ALTER TABLE scrape_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "service_all_scrape_jobs" ON scrape_jobs FOR ALL USING (true);

-- Ajouter catégories manquantes selon le plan Cicéron
INSERT INTO categories (slug, name_fr, name_en, name_de, name_es, emoji, sort_order) VALUES
  ('aspirateur-robot-laveur', 'Robot Aspirateur Laveur', 'Robot Vacuum Mop', 'Saug-Wischroboter', 'Robot Aspirador Fregador', '🤖', 1),
  ('purificateur-air', 'Purificateur d''Air', 'Air Purifier', 'Luftreiniger', 'Purificador de Aire', '💨', 16),
  ('barre-son', 'Barre de Son', 'Soundbar', 'Soundbar', 'Barra de Sonido', '🔊', 17),
  ('lave-vaisselle', 'Lave-vaisselle', 'Dishwasher', 'Geschirrspüler', 'Lavavajillas', '🍽️', 18),
  ('four', 'Four / Micro-ondes', 'Oven', 'Ofen', 'Horno', '🔥', 19),
  ('seche-linge', 'Sèche-linge', 'Dryer', 'Wäschetrockner', 'Secadora', '🌀', 20),
  ('domotique-hub', 'Domotique / Hub', 'Smart Home Hub', 'Smart Home', 'Domótica', '🏠', 21),
  ('ampoule-connectee', 'Ampoule Connectée', 'Smart Bulb', 'Smarte Glühbirne', 'Bombilla Inteligente', '💡', 22),
  ('camera-securite', 'Caméra de Sécurité', 'Security Camera', 'Sicherheitskamera', 'Cámara de Seguridad', '📹', 23),
  ('serrure-connectee', 'Serrure Connectée', 'Smart Lock', 'Smartes Schloss', 'Cerradura Inteligente', '🔐', 24),
  ('thermostat-connecte', 'Thermostat Connecté', 'Smart Thermostat', 'Smartes Thermostat', 'Termostato Inteligente', '🌡️', 25),
  ('robot-cuisine', 'Robot de Cuisine', 'Food Processor', 'Küchenmaschine', 'Robot de Cocina', '👨‍🍳', 26),
  ('friteuse-air', 'Friteuse à Air', 'Air Fryer', 'Heißluftfritteuse', 'Freidora de Aire', '🍟', 27),
  ('trottinette', 'Trottinette Électrique', 'Electric Scooter', 'E-Scooter', 'Patinete Eléctrico', '🛴', 28),
  ('velo-electrique', 'Vélo Électrique', 'E-Bike', 'E-Bike', 'Bicicleta Eléctrica', '🚲', 29),
  ('imprimante', 'Imprimante', 'Printer', 'Drucker', 'Impresora', '🖨️', 30)
ON CONFLICT (slug) DO NOTHING;

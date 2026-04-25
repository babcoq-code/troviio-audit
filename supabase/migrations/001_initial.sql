-- ============================================
-- PICKSY — Schema initial Supabase
-- Colle ce SQL dans Supabase > SQL Editor > Run
-- ============================================

-- Extension vectorielle pour RAG
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_de TEXT NOT NULL,
  name_es TEXT NOT NULL,
  icon TEXT,
  emoji TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (slug, name_fr, name_en, name_de, name_es, emoji, sort_order) VALUES
  ('robot-aspirateur', 'Robot Aspirateur', 'Robot Vacuum', 'Saugroboter', 'Robot Aspirador', '🤖', 1),
  ('aspirateur-balai', 'Aspirateur Balai', 'Stick Vacuum', 'Stabstaubsauger', 'Aspiradora de Palo', '🧹', 2),
  ('tv-oled', 'TV OLED', 'OLED TV', 'OLED-Fernseher', 'TV OLED', '📺', 3),
  ('smartphone', 'Smartphone', 'Smartphone', 'Smartphone', 'Smartphone', '📱', 4),
  ('ordinateur-etudiant', 'Ordinateur Étudiant', 'Student Laptop', 'Studentenlaptop', 'Portátil Estudiante', '💻', 5),
  ('ordinateur-gaming', 'PC Gaming', 'Gaming PC', 'Gaming-PC', 'PC Gaming', '🎮', 6),
  ('robot-cuisine', 'Robot de Cuisine', 'Food Processor', 'Küchenmaschine', 'Robot de Cocina', '👨‍🍳', 7),
  ('refrigerateur', 'Réfrigérateur', 'Refrigerator', 'Kühlschrank', 'Frigorífico', '❄️', 8),
  ('lave-linge', 'Lave-linge', 'Washing Machine', 'Waschmaschine', 'Lavadora', '🫧', 9),
  ('machine-cafe', 'Machine à Café', 'Coffee Machine', 'Kaffeemaschine', 'Cafetera', '☕', 10),
  ('casque-audio', 'Casque Audio', 'Headphones', 'Kopfhörer', 'Auriculares', '🎧', 11),
  ('appareil-photo', 'Appareil Photo', 'Camera', 'Kamera', 'Cámara', '📷', 12),
  ('plaque-cuisson', 'Plaque de Cuisson', 'Cooktop', 'Kochfeld', 'Placa de Cocción', '🔥', 13),
  ('tondeuse', 'Tondeuse Cheveux/Barbe', 'Hair Clipper', 'Haarschneider', 'Cortadora de Pelo', '✂️', 14),
  ('moniteur-pc', 'Moniteur PC', 'PC Monitor', 'PC-Monitor', 'Monitor PC', '🖥️', 15);

-- ============================================
-- PRODUITS
-- ============================================
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT,
  ean TEXT,
  image_url TEXT,
  release_year INTEGER,
  specs JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);

-- ============================================
-- TESTS & REVIEWS AGRÉGÉS
-- ============================================
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_language TEXT DEFAULT 'en',
  score DECIMAL(3,1),
  score_max DECIMAL(3,1) DEFAULT 10,
  pros TEXT[],
  cons TEXT[],
  summary_fr TEXT,
  summary_en TEXT,
  verdict TEXT,
  published_at DATE,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, source_url)
);

-- ============================================
-- EMBEDDINGS POUR RAG
-- ============================================
CREATE TABLE embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE OR REPLACE FUNCTION search_products(
  query_embedding vector(1536),
  category_slug TEXT DEFAULT NULL,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  brand TEXT,
  similarity FLOAT
)
LANGUAGE SQL AS $$
  SELECT 
    p.id, p.name, p.brand,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM embeddings e
  JOIN products p ON p.id = e.product_id
  JOIN categories c ON c.id = p.category_id
  WHERE (category_slug IS NULL OR c.slug = category_slug)
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ============================================
-- PRIX PAR RETAILER
-- ============================================
CREATE TABLE prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  retailer TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  url TEXT NOT NULL,
  affiliate_url TEXT,
  is_available BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, retailer)
);

-- ============================================
-- HISTORIQUE PRIX
-- ============================================
CREATE TABLE price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  retailer TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROFILS UTILISATEURS
-- ============================================
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  language TEXT DEFAULT 'fr',
  preferences JSONB DEFAULT '{}',
  history JSONB DEFAULT '[]',
  badge_count INTEGER DEFAULT 0,
  anti_regret_score DECIMAL(4,1) DEFAULT 0,
  push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SESSIONS DE CHAT
-- ============================================
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  messages JSONB DEFAULT '[]',
  needs_profile JSONB DEFAULT '{}',
  recommendation_ids UUID[],
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ALERTES PRIX
-- ============================================
CREATE TABLE price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  target_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- WISHLIST
-- ============================================
CREATE TABLE wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- TOP 5 PAR CATÉGORIE
-- ============================================
CREATE TABLE top5 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL CHECK (rank BETWEEN 1 AND 5),
  reason_fr TEXT,
  reason_en TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, rank)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE top5 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_profile" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "users_own_sessions" ON chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_alerts" ON price_alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "public_read_products" ON products FOR SELECT USING (true);
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "public_read_prices" ON prices FOR SELECT USING (true);
CREATE POLICY "public_read_top5" ON top5 FOR SELECT USING (true);

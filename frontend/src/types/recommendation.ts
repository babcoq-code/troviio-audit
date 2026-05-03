export type RecommendationItem = {
  rank: number;
  rank_label: string;
  name: string;
  brand: string;
  score: number;
  troviio_score?: number;
  troviio_explanation?: string;
  price_range: string;
  price_eur: number | null;
  image_url: string | null;
  affiliate_url: string | null;
  amazon_asin: string | null;
  why_perfect: string;
  why_caution: string;
  pros: string[];
  cons: string[];
  use_case_scores: Record<string, number>;
  specs: Record<string, unknown>;
};

export type RecommendationResultProfile = {
  categorie: string;
  budget_max: number;
  criteres: string[];
  resume: string;
  // Champs accessoires (optionnels)
  type?: string;
  product_name?: string;
  product_brand?: string;
  product_category?: string;
  usage_summary?: string;
};

export type RecommendationResult = {
  result_id: string;
  created_at: string;
  profile: RecommendationResultProfile;
  recommendations: RecommendationItem[];
  metadata: Record<string, unknown>;
};

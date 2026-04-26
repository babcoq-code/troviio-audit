export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  currency: string;
  rating: number;
  score: number;
  image_url: string;
  affiliate_url: string;
  key_features: string[];
  pros: string[];
  cons: string[];
  summary: string;
  best_for: string;
  created_at: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
  is_scope: boolean;
  products?: Product[];
}

export interface NewsletterRequest {
  email: string;
  name?: string;
  categories?: string[];
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

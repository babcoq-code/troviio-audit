"""
PICKSY — Pipeline de Scraping & Agrégation de Tests
Fichier : scraper/spiders/review_scraper.py

Ce pipeline scrape les sites de tests référents et extrait
automatiquement les pros/cons/scores via LLM.
"""

import scrapy
import json
import os
from openai import OpenAI
from datetime import datetime

deepseek_client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"
)

# ============================================
# SOURCES CONFIGURÉES PAR CATÉGORIE
# ============================================
SOURCES_CONFIG = {
    "robot-aspirateur": [
        {
            "name": "rtings.com",
            "url_pattern": "https://www.rtings.com/robot-vacuum/reviews",
            "language": "en",
            "reliability": 9.5
        },
        {
            "name": "lesnumeriques.com",
            "url_pattern": "https://www.lesnumeriques.com/aspirateur-robot/",
            "language": "fr",
            "reliability": 8.5
        },
        {
            "name": "tomsguide.fr",
            "url_pattern": "https://www.tomsguide.fr/aspirateur-robot/",
            "language": "fr",
            "reliability": 8.0
        }
    ],
    "tv-oled": [
        {
            "name": "rtings.com",
            "url_pattern": "https://www.rtings.com/tv/reviews/best/oled",
            "language": "en",
            "reliability": 9.8
        },
        {
            "name": "lesnumeriques.com",
            "url_pattern": "https://www.lesnumeriques.com/televiseur/",
            "language": "fr",
            "reliability": 8.5
        }
    ],
    "smartphone": [
        {
            "name": "gsmarena.com",
            "url_pattern": "https://www.gsmarena.com/reviews.php3",
            "language": "en",
            "reliability": 8.0
        },
        {
            "name": "dxomark.com",
            "url_pattern": "https://www.dxomark.com/category/smartphone-tests/",
            "language": "en",
            "reliability": 9.0
        }
    ]
}


class ReviewSpider(scrapy.Spider):
    name = "review_spider"
    
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'DOWNLOAD_DELAY': 2,  # 2 secondes entre requêtes (respectueux)
        'RANDOMIZE_DOWNLOAD_DELAY': True,
        'CONCURRENT_REQUESTS': 2,
        'ROBOTSTXT_OBEY': True,  # Respect robots.txt
    }
    
    def __init__(self, category="robot-aspirateur", *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.category = category
        self.sources = SOURCES_CONFIG.get(category, [])
    
    def start_requests(self):
        for source in self.sources:
            yield scrapy.Request(
                url=source["url_pattern"],
                callback=self.parse_listing,
                meta={"source": source}
            )
    
    def parse_listing(self, response):
        """Parse la page listing d'une source"""
        source = response.meta["source"]
        
        # Extraction des liens vers les reviews individuelles
        # (adapté par source dans les méthodes dédiées)
        review_links = self.extract_review_links(response, source["name"])
        
        for link in review_links[:20]:  # Max 20 reviews par source
            yield response.follow(
                link,
                callback=self.parse_review,
                meta={"source": source}
            )
    
    def extract_review_links(self, response, source_name):
        """Extraire les liens de reviews selon la source"""
        if source_name == "rtings.com":
            return response.css("a.test_tool--link::attr(href)").getall()
        elif source_name == "lesnumeriques.com":
            return response.css("article a.card-link::attr(href)").getall()
        elif source_name == "tomsguide.fr":
            return response.css("article h2 a::attr(href)").getall()
        return []
    
    def parse_review(self, response):
        """Parse une review individuelle et extrait les données via LLM"""
        source = response.meta["source"]
        
        # Extraire le texte brut de la page (nettoyé)
        paragraphs = response.css("article p::text, .review-body p::text").getall()
        full_text = " ".join(paragraphs[:50])  # Max 50 paragraphes
        
        if len(full_text) < 200:
            return  # Page vide ou erreur
        
        # Extraire via LLM
        extracted = self.extract_with_llm(
            text=full_text,
            url=response.url,
            source_name=source["name"],
            language=source["language"]
        )
        
        if extracted:
            yield {
                "source_name": source["name"],
                "source_url": response.url,
                "source_language": source["language"],
                "category": self.category,
                **extracted,
                "scraped_at": datetime.now().isoformat()
            }
    
    def extract_with_llm(self, text: str, url: str, source_name: str, language: str) -> dict:
        """
        Utilise DeepSeek pour extraire structurellement les infos d'une review.
        Coût : ~$0.001 par review (très cheap avec DeepSeek V4)
        """
        prompt = f"""Analyse cette review de produit et extrais les informations suivantes en JSON.
Source : {source_name} ({language})
URL : {url}

Texte de la review :
{text[:3000]}

Retourne UNIQUEMENT ce JSON (rien d'autre) :
{{
  "product_name": "Nom exact du produit testé",
  "brand": "Marque",
  "score": 8.5,  // note sur 10 (convertis si nécessaire)
  "pros": ["point fort 1", "point fort 2", "point fort 3"],
  "cons": ["point faible 1", "point faible 2"],
  "summary_en": "Résumé en 2-3 phrases en anglais",
  "summary_fr": "Résumé en 2-3 phrases en français",
  "verdict": "Verdict final en 1 phrase"
}}

Si une information est manquante, mets null.
"""
        
        try:
            response = deepseek_client.chat.completions.create(
                model="deepseek-chat",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=500
            )
            
            content = response.choices[0].message.content
            # Nettoyer et parser le JSON
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            return json.loads(content[json_start:json_end])
            
        except Exception as e:
            self.logger.error(f"LLM extraction error: {e}")
            return None


# ============================================
# PIPELINE DE TRAITEMENT (Scrapy Pipeline)
# ============================================
class SupabasePipeline:
    """Sauvegarde les reviews extraites dans Supabase"""
    
    def __init__(self):
        from supabase import create_client
        self.supabase = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_SERVICE_KEY")
        )
    
    def process_item(self, item, spider):
        """Insère ou met à jour une review en BDD"""
        
        # 1. Trouver le produit (ou le créer)
        product = self.get_or_create_product(item)
        if not product:
            return item
        
        # 2. Insérer la review
        self.supabase.table("reviews").upsert({
            "product_id": product["id"],
            "source_name": item["source_name"],
            "source_url": item["source_url"],
            "source_language": item.get("source_language", "en"),
            "score": item.get("score"),
            "pros": item.get("pros", []),
            "cons": item.get("cons", []),
            "summary_fr": item.get("summary_fr"),
            "summary_en": item.get("summary_en"),
            "verdict": item.get("verdict"),
            "scraped_at": item["scraped_at"]
        }, on_conflict="product_id,source_url").execute()
        
        # 3. Générer et stocker l'embedding
        self.generate_embedding(product["id"], item)
        
        return item
    
    def get_or_create_product(self, item):
        """Récupère ou crée un produit en BDD"""
        result = self.supabase.table("products").select("*").eq(
            "name", item.get("product_name", "")
        ).execute()
        
        if result.data:
            return result.data[0]
        
        # Créer le produit
        category_result = self.supabase.table("categories").select("id").eq(
            "slug", item.get("category", "")
        ).execute()
        
        if not category_result.data:
            return None
        
        new_product = self.supabase.table("products").insert({
            "name": item.get("product_name", "Unknown"),
            "brand": item.get("brand", "Unknown"),
            "category_id": category_result.data[0]["id"]
        }).execute()
        
        return new_product.data[0] if new_product.data else None
    
    def generate_embedding(self, product_id: str, item: dict):
        """Génère un embedding vectoriel pour la recherche sémantique"""
        
        # Texte à embedder (combinaison des infos clés)
        text_to_embed = f"""
Produit: {item.get('product_name', '')}
Marque: {item.get('brand', '')}
Points forts: {', '.join(item.get('pros', []))}
Points faibles: {', '.join(item.get('cons', []))}
Résumé: {item.get('summary_en', '')}
Verdict: {item.get('verdict', '')}
        """.strip()
        
        # Utiliser l'API d'embedding de DeepSeek ou OpenAI
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")
        
        try:
            response = client.embeddings.create(
                model="text-embedding-3-small",
                input=text_to_embed
            )
            embedding = response.data[0].embedding
            
            self.supabase.table("embeddings").upsert({
                "product_id": product_id,
                "content": text_to_embed,
                "embedding": embedding,
                "metadata": {"source": item.get("source_name")}
            }).execute()
            
        except Exception as e:
            print(f"Embedding error: {e}")

// ============================================================================
// TROVIIO — Script de seeding Supabase · Tier 1 (5 catégories · 40 produits)
// ============================================================================
//
// Usage :
//   npx tsx scripts/seed-tier1.ts           → dry-run (aucune écriture)
//   npx tsx scripts/seed-tier1.ts --seed    → injection réelle en base
//   npx tsx scripts/seed-tier1.ts --clean   → supprime puis réinsère
//
// Prérequis :
//   npm install @supabase/supabase-js dotenv tsx
//   Fichier .env.local avec NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
//
// ⚠️  18 ASINs non vérifiés → script loggue les warnings mais insère quand même.
//     Valider les ASINs sur amazon.fr avant mise en production.
//
// ⛔  NO framer-motion (règle projet Troviio)
// ============================================================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ─── Config ─────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const AMAZON_TAG = "troviio-21";

const DRY_RUN = !process.argv.includes("--seed");
const CLEAN = process.argv.includes("--clean");

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌  Variables d'env manquantes : NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface RawProduct {
  category_id: string;
  name: string;
  brand: string;
  asin: string;
  affiliate_url: string;
  price: number;
  rating: number;
  review_count: number;
  is_best_seller: boolean;
  asin_verified: boolean;
  specs: Record<string, unknown>;
  pros: string[];
  cons: string[];
  description: string;
  note_integration?: string;
}

interface SeedProduct {
  category_id: string;
  slug: string;
  name: string;
  brand: string;
  model: string | null;
  description: string;
  tagline: string | null;
  image_url: null;
  price_eur: number;
  price_min_eur: number | null;
  price_max_eur: number | null;
  price_range: "budget" | "mid" | "premium";
  rating: number;
  review_count: number;
  troviio_score: number;
  amazon_asin: string;
  amazon_tag: string;
  merchant_links: Record<string, string>;
  best_for: string[];
  avoid_if: string[];
  pros: string[];
  cons: string[];
  specs: Record<string, unknown>;
  tags: string[];
  is_featured: boolean;
  is_active: boolean;
  rank_in_category: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSlug(name: string, brand: string): string {
  return `${brand}-${name}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .substring(0, 100);
}

function priceRange(priceEur: number): "budget" | "mid" | "premium" {
  if (priceEur < 200) return "budget";
  if (priceEur < 600) return "mid";
  return "premium";
}

function troviioScore(rating: number, reviewCount: number, isBestSeller: boolean): number {
  const ratingScore = (rating / 5) * 70;
  const popularityScore = Math.min(Math.log10(reviewCount + 1) * 8, 20);
  const bsBonus = isBestSeller ? 10 : 0;
  return Math.round(ratingScore + popularityScore + bsBonus);
}

function extractTags(product: RawProduct, categorySlug: string): string[] {
  const tags: string[] = [categorySlug, product.brand.toLowerCase()];
  const specs = product.specs as Record<string, unknown>;

  if (specs.connectivite === "5G") tags.push("5g");
  if (specs.os?.toString().includes("iOS")) tags.push("apple", "ios");
  if (specs.os?.toString().includes("Android")) tags.push("android");
  if (specs.s_pen) tags.push("s-pen", "stylet");
  if (specs.anc) tags.push("anc", "reduction-bruit-active");
  if (Array.isArray(specs.codec) && (specs.codec as string[]).includes("LDAC")) tags.push("hi-res-audio", "ldac");
  if (specs.audio_spatial) tags.push("spatial-audio");
  if (specs.broyeur) tags.push("grain", "broyeur-integre");
  if (specs.type?.toString().includes("capsule")) tags.push("capsule");
  if (specs.zones === 2) tags.push("double-zone");
  if (specs.station) tags.push("station-vidage");
  if (specs.auto_nettoyage) tags.push("auto-nettoyant");
  if (product.is_best_seller) tags.push("best-seller");

  return [...new Set(tags)];
}

function inferBestFor(pros: string[], categorySlug: string): string[] {
  const out: string[] = [];
  const text = pros.join(" ").toLowerCase();

  if (text.includes("autonomie") || text.includes("batterie")) out.push("longue_autonomie");
  if (text.includes("photo") || text.includes("camera") || text.includes("200 mp")) out.push("photo");
  if (text.includes("compact") || text.includes("6.1") || text.includes("6.2") || text.includes("6.3")) out.push("format_compact");
  if (text.includes("ia") || text.includes("ai")) out.push("ia_embarquee");
  if (text.includes("7 ans")) out.push("longue_duree_support");
  if (text.includes("s pen") || text.includes("stylet")) out.push("productivite_stylet");
  if (text.includes("silencieux")) out.push("cuisine_ouverte");
  if (text.includes("mousseur") || text.includes("latte") || text.includes("cappuccino")) out.push("boissons_lactees");
  if (text.includes("entretien") || text.includes("aquaclean")) out.push("faible_entretien");
  if (text.includes("qualite") && text.includes("prix")) out.push("rapport_qualite_prix");
  if (text.includes("barista") || text.includes("25 niveaux")) out.push("usage_barista");
  if (text.includes("ultra-leger") || text.includes("1.05")) out.push("usage_frequence_elevee");
  if (text.includes("laser")) out.push("detection_poussiere_avancee");
  if (text.includes("station") || text.includes("vidage auto")) out.push("zero_maintenance");
  if (text.includes("aspire et lave")) out.push("parquet_carrelage");
  if (text.includes("2 zones") || text.includes("synchronisees")) out.push("cuisson_simultanee");
  if (text.includes("famille") || text.includes("6-8")) out.push("grande_famille");
  if (text.includes("anc") || text.includes("reduction")) out.push("open_space_transport");
  if (text.includes("30h") || text.includes("60h")) out.push("voyages_avion");
  if (text.includes("spatial audio") || text.includes("dolby atmos")) out.push("musique_cinema");
  if (text.includes("hi-res") || text.includes("ldac") || text.includes("audiophile")) out.push("audiophiles");

  return [...new Set(out)];
}

function inferAvoidIf(cons: string[]): string[] {
  const out: string[] = [];
  const text = cons.join(" ").toLowerCase();

  if (text.includes("cher") || text.includes("prix eleve")) out.push("budget_serre");
  if (text.includes("lourd") || text.includes("encombrant")) out.push("mobilite_prioritaire");
  if (text.includes("sans chargeur")) out.push("besoin_chargeur_inclus");
  if (text.includes("60 hz")) out.push("gaming_haute_frequence");
  if (text.includes("capsule") || text.includes("proprietaire")) out.push("conscience_ecologique");
  if (text.includes("courbe apprentissage")) out.push("debutant");
  if (text.includes("entretien circuit lait")) out.push("paresse_entretien");
  if (text.includes("petit bac")) out.push("grande_surface");
  if (text.includes("pas ldac")) out.push("audiophile_exigeant");
  if (text.includes("format xxl") || text.includes("tres encombrant")) out.push("petit_appartement");

  return [...new Set(out)];
}

const CATEGORY_SLUG_MAP: Record<string, string> = {
  "f3bb790a-ac9e-4ec0-9afc-136f526d6779": "smartphone",
  "5a953c94-cd69-43bb-93d9-50ce438a8507": "machine-a-cafe",
  "05b88dd1-8163-4818-8a7b-e9456eee17bd": "aspirateur-balai",
  "ea42cb00-88dc-4f28-b6cb-1ef1f8815928": "friteuse-air",
  "68995990-778d-4a9e-8455-88a66420ff2d": "casque-audio",
};

// ─── Données brutes ──────────────────────────────────────────────────────────

const RAW_PRODUCTS: RawProduct[] = [
  // SMARTPHONE (8)
  { category_id: "f3bb790a-ac9e-4ec0-9afc-136f526d6779", name: "Samsung Galaxy S25 Ultra 256 Go", brand: "Samsung", asin: "B0DTHRQCKX", affiliate_url: "https://www.amazon.fr/dp/B0DTHRQCKX?tag=troviio-21", price: 1299.00, rating: 4.2, review_count: 618, is_best_seller: true, asin_verified: true, specs: { os: "Android 15", ram: "12 Go", stockage: "256 Go", ecran: "6.9p Dynamic AMOLED 2X 120Hz", processeur: "Snapdragon 8 Elite", camera_principale: "200 MP", batterie: "5000 mAh", connectivite: "5G", s_pen: true, poids: "218 g" }, pros: ["S Pen integre", "Camera 200 MP", "Galaxy AI", "Design titanium", "Ray Tracing"], cons: ["Prix eleve", "Sans chargeur", "Encombrant"], description: "Galaxy S25 Ultra avec S Pen, Snapdragon 8 Elite et camera 200 MP ProVisual Engine." },
  { category_id: "f3bb790a-ac9e-4ec0-9afc-136f526d6779", name: "Apple iPhone 16 128 Go", brand: "Apple", asin: "B0DGHY5KG8", affiliate_url: "https://www.amazon.fr/dp/B0DGHY5KG8?tag=troviio-21", price: 969.00, rating: 4.6, review_count: 2357, is_best_seller: true, asin_verified: true, specs: { os: "iOS 18", ram: "8 Go", stockage: "128 Go", ecran: "6.1p Super Retina XDR 60Hz", processeur: "Apple A18", camera_principale: "48 MP", batterie: "22h video", connectivite: "5G", usb: "USB-C" }, pros: ["Puce A18", "Camera Control", "Autonomie 22h", "MagSafe"], cons: ["60 Hz seulement", "Pas de zoom > 2x"], description: "iPhone 16 avec puce A18, Camera Control et autonomie 22h." },
  { category_id: "f3bb790a-ac9e-4ec0-9afc-136f526d6779", name: "Apple iPhone 16 Pro 128 Go", brand: "Apple", asin: "B0DGHZQXTJ", affiliate_url: "https://www.amazon.fr/dp/B0DGHZQXTJ?tag=troviio-21", price: 1229.00, rating: 4.5, review_count: 2310, is_best_seller: true, asin_verified: true, specs: { os: "iOS 18", ram: "8 Go", stockage: "128 Go", ecran: "6.3p ProMotion 120Hz", processeur: "Apple A18 Pro", camera_principale: "48 MP", camera_telephoto: "12 MP 5x", video: "4K Dolby Vision 120fps", batterie: "27h video", connectivite: "5G", materiau: "Titane" }, pros: ["ProMotion 120Hz", "Video 4K 120fps", "Zoom 5x", "Design titane"], cons: ["Prix premium", "Sans chargeur"], description: "iPhone 16 Pro titane : ProMotion 120Hz, zoom 5x et video 4K Dolby Vision." },
  { category_id: "f3bb790a-ac9e-4ec0-9afc-136f526d6779", name: "Apple iPhone 16 Pro Max 512 Go", brand: "Apple", asin: "B0DGJ8KPGN", affiliate_url: "https://www.amazon.fr/dp/B0DGJ8KPGN?tag=troviio-21", price: 1529.00, rating: 4.4, review_count: 19, is_best_seller: false, asin_verified: true, specs: { os: "iOS 18", ram: "8 Go", stockage: "512 Go", ecran: "6.9p ProMotion 120Hz", processeur: "Apple A18 Pro", camera_principale: "48 MP", video: "4K Dolby Vision 120fps", batterie: "33h video", connectivite: "5G" }, pros: ["Autonomie 33h", "Grand ecran 6.9p", "512 Go"], cons: ["Format XXL", "Tres cher"], description: "iPhone 16 Pro Max : autonomie record 33h, 512 Go, grand ecran." },
  { category_id: "f3bb790a-ac9e-4ec0-9afc-136f526d6779", name: "OnePlus 13 5G 16 Go 512 Go", brand: "OnePlus", asin: "B0DKG1MLXL", affiliate_url: "https://www.amazon.fr/dp/B0DKG1MLXL?tag=troviio-21", price: 899.00, rating: 4.3, review_count: 606, is_best_seller: false, asin_verified: true, specs: { os: "OxygenOS 15", ram: "16 Go", stockage: "512 Go", ecran: "6.82p QHD+ 120Hz", processeur: "Snapdragon 8 Elite", camera_principale: "50 MP Hasselblad", batterie: "6000 mAh", charge_rapide: "100W SuperVOOC", connectivite: "5G" }, pros: ["Batterie 6000 mAh", "Charge 100W 36 min", "Hasselblad triple 50MP", "16 Go RAM"], cons: ["OxygenOS moins connu"], description: "OnePlus 13 : Snapdragon 8 Elite, 16 Go RAM, Hasselblad et charge 100W." },
  { category_id: "f3bb790a-ac9e-4ec0-9afc-136f526d6779", name: "Google Pixel 10 Pro XL 256 Go", brand: "Google", asin: "B0FHLNLB7W", affiliate_url: "https://www.amazon.fr/dp/B0FHLNLB7W?tag=troviio-21", price: 1099.00, rating: 4.4, review_count: 150, is_best_seller: false, asin_verified: true, specs: { os: "Android 16", ram: "16 Go", stockage: "256 Go", ecran: "6.8p LTPO OLED 120Hz", processeur: "Google Tensor G5", camera_principale: "50 MP", batterie: "5000 mAh", connectivite: "5G", mises_a_jour: "7 ans" }, pros: ["IA photo avancee", "7 ans mises a jour", "Tensor G5"], cons: ["Prix eleve"], description: "Pixel 10 Pro XL : Tensor G5 et 7 ans de mises a jour garanties." },
  { category_id: "f3bb790a-ac9e-4ec0-9afc-136f526d6779", name: "Google Pixel 9 Pro 256 Go", brand: "Google", asin: "B0D7V1MDK8", affiliate_url: "https://www.amazon.fr/dp/B0D7V1MDK8?tag=troviio-21", price: 899.00, rating: 4.3, review_count: 420, is_best_seller: false, asin_verified: true, specs: { os: "Android 15", ram: "16 Go", stockage: "256 Go", ecran: "6.3p LTPO OLED 120Hz", processeur: "Google Tensor G4", camera_principale: "50 MP", camera_telephoto: "48 MP 5x", batterie: "4700 mAh", connectivite: "5G", mises_a_jour: "7 ans" }, pros: ["Compact 6.3p", "Zoom 5x", "IA Google", "7 ans updates"], cons: ["Batterie plus petite"], description: "Pixel 9 Pro compact 6.3p : zoom 5x et IA Tensor G4." },
  { category_id: "f3bb790a-ac9e-4ec0-9afc-136f526d6779", name: "Samsung Galaxy S25 256 Go", brand: "Samsung", asin: "B0DTHRM7HT", affiliate_url: "https://www.amazon.fr/dp/B0DTHRM7HT?tag=troviio-21", price: 949.00, rating: 4.3, review_count: 380, is_best_seller: false, asin_verified: false, specs: { os: "Android 15", ram: "12 Go", stockage: "256 Go", ecran: "6.2p Dynamic AMOLED 2X 120Hz", processeur: "Snapdragon 8 Elite", camera_principale: "50 MP", batterie: "4000 mAh", connectivite: "5G" }, pros: ["Snapdragon 8 Elite", "Galaxy AI", "Format compact", "7 ans updates"], cons: ["Batterie modeste"], description: "Galaxy S25 : Snapdragon 8 Elite et Galaxy AI en format compact 6.2p.", note_integration: "ASIN A VERIFIER" },

  // MACHINE A CAFE (8)
  { category_id: "5a953c94-cd69-43bb-93d9-50ce438a8507", name: "DeLonghi Magnifica S ECAM11.112.B", brand: "DeLonghi", asin: "B0BWSFGQ49", affiliate_url: "https://www.amazon.fr/dp/B0BWSFGQ49?tag=troviio-21", price: 349.99, rating: 4.4, review_count: 3200, is_best_seller: true, asin_verified: true, specs: { type: "Machine grain automatique", pression: "15 bars", reservoir: "1.8 L", broyeur: "Acier inox", puissance: "1450 W" }, pros: ["Meilleur rapport qualite-prix", "Broyeur integre", "Simple"], cons: ["Pas de mousseur auto"], description: "DeLonghi Magnifica S : reference cafe grain entree de gamme." },
  { category_id: "5a953c94-cd69-43bb-93d9-50ce438a8507", name: "Krups Sensation Milk EA912E10", brand: "Krups", asin: "B0DG6VY1GY", affiliate_url: "https://www.amazon.fr/dp/B0DG6VY1GY?tag=troviio-21", price: 449.00, rating: 4.2, review_count: 850, is_best_seller: false, asin_verified: true, specs: { type: "Machine grain avec mousseur", pression: "15 bars", reservoir: "1.7 L", broyeur: "Ceramique" }, pros: ["Mousseur auto integre", "Broyeur ceramique", "Lattes 1 touche"], cons: ["Entretien circuit lait"], description: "Krups Sensation Milk : broyeur ceramique et mousseur auto pour lattes." },
  { category_id: "5a953c94-cd69-43bb-93d9-50ce438a8507", name: "Nespresso Vertuo Next ENV120", brand: "Nespresso", asin: "B08DRKVSBJ", affiliate_url: "https://www.amazon.fr/dp/B08DRKVSBJ?tag=troviio-21", price: 169.99, rating: 4.4, review_count: 8500, is_best_seller: true, asin_verified: true, specs: { type: "Machine capsules Vertuo", technologie: "Centrifugation", tailles: "5 formats 40ml a 414ml", chauffe: "20 sec", reservoir: "1.1 L", connectivite: "WiFi Bluetooth" }, pros: ["5 formats cafe", "20 sec de chauffe", "Prix accessible", "App Nespresso"], cons: ["Capsules proprietaires"], description: "Nespresso Vertuo Next : 5 tailles, 20 sec, connectee WiFi." },
  { category_id: "5a953c94-cd69-43bb-93d9-50ce438a8507", name: "Jura E8 EC Expresso Automatique", brand: "Jura", asin: "B0CPM7Y933", affiliate_url: "https://www.amazon.fr/dp/B0CPM7Y933?tag=troviio-21", price: 1299.00, rating: 4.6, review_count: 450, is_best_seller: false, asin_verified: true, specs: { type: "Machine super-automatique premium", pression: "15 bars", reservoir: "1.9 L", broyeur: "Aroma G3 5 niveaux", programmes: 17, ecran: "TFT couleur 2.8p" }, pros: ["17 specialites", "Qualite Jura suisse", "Ecran TFT", "App J.O.E."], cons: ["Prix premium"], description: "Jura E8 : 17 specialites, broyeur Aroma G3, ecran TFT couleur." },
  { category_id: "5a953c94-cd69-43bb-93d9-50ce438a8507", name: "DeLonghi Dinamica Plus ECAM370.95.T", brand: "DeLonghi", asin: "B07RV6MHQP", affiliate_url: "https://www.amazon.fr/dp/B07RV6MHQP?tag=troviio-21", price: 799.00, rating: 4.5, review_count: 2100, is_best_seller: false, asin_verified: false, specs: { type: "Machine grain carafe lait", pression: "19 bars", broyeur: "13 niveaux", mousseur: "LatteCrema auto", ecran: "TFT tactile" }, pros: ["LatteCrema auto", "Ecran tactile", "App Coffee Link"], cons: ["ASIN a verifier"], description: "DeLonghi Dinamica Plus : LatteCrema auto et ecran TFT tactile.", note_integration: "ASIN A VERIFIER" },
  { category_id: "5a953c94-cd69-43bb-93d9-50ce438a8507", name: "Philips Serie 3200 EP3241/54", brand: "Philips", asin: "B08QHQV6WZ", affiliate_url: "https://www.amazon.fr/dp/B08QHQV6WZ?tag=troviio-21", price: 449.00, rating: 4.3, review_count: 4500, is_best_seller: false, asin_verified: false, specs: { type: "Machine grain auto", pression: "15 bars", broyeur: "Ceramique silencieux", filtre: "AquaClean" }, pros: ["Broyeur ceramique silencieux", "AquaClean", "Simple"], cons: ["Mousseur manuel"], description: "Philips 3200 : broyeur ceramique silencieux et filtre AquaClean.", note_integration: "ASIN A VERIFIER" },
  { category_id: "5a953c94-cd69-43bb-93d9-50ce438a8507", name: "Sage The Barista Express SES875", brand: "Sage", asin: "B07Y61C8QB", affiliate_url: "https://www.amazon.fr/dp/B07Y61C8QB?tag=troviio-21", price: 699.00, rating: 4.6, review_count: 3800, is_best_seller: false, asin_verified: false, specs: { type: "Expresso semi-auto broyeur integre", pression: "15 bars", broyeur: "Conique 25 niveaux", vapeur: "Buse manuelle pro", materiau: "Inox brosse" }, pros: ["Qualite barista", "25 niveaux mouture", "Vapeur pro"], cons: ["Courbe apprentissage"], description: "Sage Barista Express : broyeur conique 25 niveaux espresso niveau barista.", note_integration: "ASIN A VERIFIER" },
  { category_id: "5a953c94-cd69-43bb-93d9-50ce438a8507", name: "Nespresso Lattissima One F111", brand: "Nespresso", asin: "B0C7FTZRGD", affiliate_url: "https://www.amazon.fr/dp/B0C7FTZRGD?tag=troviio-21", price: 249.00, rating: 4.3, review_count: 1200, is_best_seller: false, asin_verified: false, specs: { type: "Nespresso Original mousseur integre", pression: "19 bars", reservoir_lait: "Amovible 1L", chauffe: "25 sec" }, pros: ["Mousseur 1 touche", "Compact", "Capsules Original"], cons: ["Capsules proprietaires"], description: "Nespresso Lattissima One : cappuccinos et lattes en 1 touche.", note_integration: "ASIN A VERIFIER" },

  // ASPIRATEUR BALAI (8)
  { category_id: "05b88dd1-8163-4818-8a7b-e9456eee17bd", name: "LG CordZero A9K-PRO3B", brand: "LG", asin: "B0DGQWM583", affiliate_url: "https://www.amazon.fr/dp/B0DGQWM583?tag=troviio-21", price: 699.00, rating: 4.5, review_count: 890, is_best_seller: false, asin_verified: true, specs: { puissance: "200 AW", autonomie: "60 min", poids: "1.05 kg", batterie: "Double amovible", filtration: "HEPA 13", bac: "0.5 L", station: "All-in-One Tower" }, pros: ["Ultra-leger 1.05 kg", "Double batterie 60 min", "Station All-in-One", "HEPA 13"], cons: ["Prix eleve", "Station volumineuse"], description: "LG CordZero A9K : le plus leger 1.05 kg, double batterie et station All-in-One." },
  { category_id: "05b88dd1-8163-4818-8a7b-e9456eee17bd", name: "Dyson V15 Detect Absolute", brand: "Dyson", asin: "B0BS1Q7RG5", affiliate_url: "https://www.amazon.fr/dp/B0BS1Q7RG5?tag=troviio-21", price: 699.00, rating: 4.6, review_count: 2100, is_best_seller: true, asin_verified: true, specs: { technologie: "Laser detection poussiere", puissance: "240 AW", autonomie: "60 min", poids: "3.1 kg", filtration: "HEPA complet", bac: "0.77 L", ecran: "LCD temps reel" }, pros: ["Laser poussiere invisible", "LCD compteur particules", "240 AW"], cons: ["Lourd 3.1 kg"], description: "Dyson V15 Detect : laser, LCD particules et 240 AW. La reference." },
  { category_id: "05b88dd1-8163-4818-8a7b-e9456eee17bd", name: "Dyson V12 Detect Slim+", brand: "Dyson", asin: "B0C1PX36JB", affiliate_url: "https://www.amazon.fr/dp/B0C1PX36JB?tag=troviio-21", price: 597.89, rating: 4.3, review_count: 692, is_best_seller: true, asin_verified: true, specs: { technologie: "Laser slim", autonomie: "60 min", poids: "2.2 kg", bac: "0.2 L", plus_leger: "24% vs V15" }, pros: ["24% plus leger V15", "Laser", "LCD"], cons: ["Petit bac 0.2L"], description: "Dyson V12 Slim+ : 24% plus leger V15, laser et LCD." },
  { category_id: "05b88dd1-8163-4818-8a7b-e9456eee17bd", name: "Samsung Bespoke Jet Complete VS20A95843B", brand: "Samsung", asin: "B0CD3PF49D", affiliate_url: "https://www.amazon.fr/dp/B0CD3PF49D?tag=troviio-21", price: 699.00, rating: 4.4, review_count: 560, is_best_seller: false, asin_verified: true, specs: { puissance: "210 W", autonomie: "60 min", poids: "1.4 kg", filtration: "5 couches HEPA", station: "Clean Station vidage auto", bac: "0.5 L" }, pros: ["Vidage automatique", "Leger 1.4 kg", "HEPA 5 couches"], cons: ["Station volumineuse"], description: "Samsung Bespoke Jet : Clean Station auto, 1.4 kg et HEPA 5 couches." },
  { category_id: "05b88dd1-8163-4818-8a7b-e9456eee17bd", name: "Dyson V8 Absolute", brand: "Dyson", asin: "B0CN5JW3HQ", affiliate_url: "https://www.amazon.fr/dp/B0CN5JW3HQ?tag=troviio-21", price: 339.00, rating: 4.5, review_count: 373, is_best_seller: false, asin_verified: true, specs: { puissance: "115 AW", autonomie: "40 min", poids: "2.6 kg", bac: "0.54 L", brosse: "Motorbar anti-emmelement" }, pros: ["Prix entree Dyson", "Motorbar", "Convertible main"], cons: ["40 min autonomie"], description: "Dyson V8 Absolute : entree gamme Dyson avec motorbar et HEPA." },
  { category_id: "05b88dd1-8163-4818-8a7b-e9456eee17bd", name: "Tineco FLOOR ONE S7 Stretch Ultra", brand: "Tineco", asin: "B0DPPLWYGX", affiliate_url: "https://www.amazon.fr/dp/B0DPPLWYGX?tag=troviio-21", price: 449.00, rating: 4.4, review_count: 320, is_best_seller: false, asin_verified: true, specs: { fonctions: "Aspiration + Lavage + Sechage", autonomie: "35 min", poids: "4.8 kg", inclinaison: "180 degres flat", auto_nettoyage: true }, pros: ["Aspire ET lave", "Auto-nettoyage", "180 degres sous meubles"], cons: ["Lourd 4.8 kg"], description: "Tineco S7 : aspire et lave simultanement, auto-nettoyage, 180 degres." },
  { category_id: "05b88dd1-8163-4818-8a7b-e9456eee17bd", name: "Rowenta X-Force Flex 14.60 RH99C0", brand: "Rowenta", asin: "B09JCJCMX7", affiliate_url: "https://www.amazon.fr/dp/B09JCJCMX7?tag=troviio-21", price: 349.00, rating: 4.3, review_count: 1800, is_best_seller: false, asin_verified: false, specs: { autonomie: "75 min", poids: "2.6 kg", filtration: "HEPA 13", bac: "0.9 L", tube: "Flexible 180 degres" }, pros: ["75 min autonomie record", "Tube flexible 180 degres", "Grand bac 0.9L"], cons: ["Moins puissant que Dyson"], description: "Rowenta X-Force Flex : 75 min record, tube 180 degres et HEPA 13.", note_integration: "ASIN A VERIFIER" },
  { category_id: "05b88dd1-8163-4818-8a7b-e9456eee17bd", name: "Hoover HF522STP 011", brand: "Hoover", asin: "B07Z3KV9NK", affiliate_url: "https://www.amazon.fr/dp/B07Z3KV9NK?tag=troviio-21", price: 199.00, rating: 4.1, review_count: 2100, is_best_seller: false, asin_verified: false, specs: { autonomie: "40 min", poids: "2.8 kg", filtration: "HEPA", bac: "0.9 L" }, pros: ["Prix budget", "Grand bac 0.9L", "Autonomie correcte"], cons: ["Moins puissant que Dyson"], description: "Hoover HF522 : choix budget fiable avec grand bac et HEPA.", note_integration: "ASIN A VERIFIER" },

  // FRITEUSE A AIR (8)
  { category_id: "ea42cb00-88dc-4f28-b6cb-1ef1f8815928", name: "Ninja Foodi Dual Zone AF300EU 7.6 L", brand: "Ninja", asin: "B08GC1QZ5W", affiliate_url: "https://www.amazon.fr/dp/B08GC1QZ5W?tag=troviio-21", price: 199.99, rating: 4.7, review_count: 10801, is_best_seller: true, asin_verified: true, specs: { capacite: "7.6 L", zones: 2, fonctions: 6, puissance: "2470 W", reduction_graisse: "75%" }, pros: ["2 zones synchronisees", "10800+ avis 4.7 etoiles", "75% moins graisse", "6 fonctions"], cons: ["Lourd", "Encombrant"], description: "Ninja AF300EU : friteuse la mieux notee Amazon avec 2 zones independantes." },
  { category_id: "ea42cb00-88dc-4f28-b6cb-1ef1f8815928", name: "Ninja Foodi MAX Dual Zone AF400EU 9.5 L", brand: "Ninja", asin: "B09NKQPTP1", affiliate_url: "https://www.amazon.fr/dp/B09NKQPTP1?tag=troviio-21", price: 249.99, rating: 4.6, review_count: 5200, is_best_seller: false, asin_verified: false, specs: { capacite: "9.5 L", zones: 2, portions: "6-8 personnes" }, pros: ["XL 9.5L", "Grandes familles 6-8 pers"], cons: ["Tres encombrant"], description: "Ninja AF400EU XL : 9.5L en 2 zones pour grandes familles.", note_integration: "ASIN A VERIFIER" },
  { category_id: "ea42cb00-88dc-4f28-b6cb-1ef1f8815928", name: "Cosori Pro LE C158-AF 4.7 L", brand: "Cosori", asin: "B09N7WDBQM", affiliate_url: "https://www.amazon.fr/dp/B09N7WDBQM?tag=troviio-21", price: 89.99, rating: 4.5, review_count: 12000, is_best_seller: true, asin_verified: false, specs: { capacite: "4.7 L", fonctions: 9, connectivite: "WiFi App VeSync" }, pros: ["Prix accessible", "WiFi VeSync", "9 fonctions"], cons: ["Plus petit"], description: "Cosori Pro LE : 4.7L accessible avec WiFi VeSync et 9 fonctions.", note_integration: "ASIN A VERIFIER" },
  { category_id: "ea42cb00-88dc-4f28-b6cb-1ef1f8815928", name: "Philips Airfryer NA220/00 6.2 L", brand: "Philips", asin: "B0CTN2BJBL", affiliate_url: "https://www.amazon.fr/dp/B0CTN2BJBL?tag=troviio-21", price: 179.99, rating: 4.4, review_count: 3200, is_best_seller: false, asin_verified: false, specs: { capacite: "6.2 L", technologie: "Rapid Air", app: "NutriU 200 recettes" }, pros: ["Rapid Air brevete", "NutriU 200 recettes", "6.2L"], cons: ["Prix moyen"], description: "Philips Airfryer Rapid Air 6.2L avec app NutriU 200 recettes.", note_integration: "ASIN A VERIFIER" },
  { category_id: "ea42cb00-88dc-4f28-b6cb-1ef1f8815928", name: "Tefal Easy Fry Grill Steam EY801815 6.5 L", brand: "Tefal", asin: "B0BM5RFNXH", affiliate_url: "https://www.amazon.fr/dp/B0BM5RFNXH?tag=troviio-21", price: 149.99, rating: 4.3, review_count: 2800, is_best_seller: false, asin_verified: false, specs: { capacite: "6.5 L", fonctions: "Friteuse air Gril Vapeur", programmes: 8 }, pros: ["3 modes en 1", "6.5L 4-6 pers", "Marque francaise"], cons: ["Interface complexe"], description: "Tefal Easy Fry : friteuse air, gril et vapeur en 1 appareil.", note_integration: "ASIN A VERIFIER" },
  { category_id: "ea42cb00-88dc-4f28-b6cb-1ef1f8815928", name: "Moulinex Easy Fry Pro EZ935B10 6 L", brand: "Moulinex", asin: "B0BKM8PFDL", affiliate_url: "https://www.amazon.fr/dp/B0BKM8PFDL?tag=troviio-21", price: 129.99, rating: 4.4, review_count: 1900, is_best_seller: false, asin_verified: false, specs: { capacite: "6 L", fonctions: 8 }, pros: ["Rapport qualite-prix", "6L", "Marque francaise"], cons: ["Moins premium"], description: "Moulinex Easy Fry Pro 6L : 8 modes et ecran LED.", note_integration: "ASIN A VERIFIER" },
  { category_id: "ea42cb00-88dc-4f28-b6cb-1ef1f8815928", name: "Cosori Dual Blaze Chef Edition 6.4 L", brand: "Cosori", asin: "B0BT3JW7PN", affiliate_url: "https://www.amazon.fr/dp/B0BT3JW7PN?tag=troviio-21", price: 159.99, rating: 4.5, review_count: 2400, is_best_seller: false, asin_verified: false, specs: { capacite: "6.4 L", technologie: "Double resistance haut bas", fonctions: 12, connectivite: "WiFi VeSync" }, pros: ["Dual Blaze haut+bas", "12 fonctions", "WiFi"], cons: ["Prix moyen"], description: "Cosori Dual Blaze : double resistance pour dorage uniforme pro.", note_integration: "ASIN A VERIFIER" },
  { category_id: "ea42cb00-88dc-4f28-b6cb-1ef1f8815928", name: "Philips 9000 Series HD9270 Airfryer XL 6.2 L", brand: "Philips", asin: "B09T4X5D7Y", affiliate_url: "https://www.amazon.fr/dp/B09T4X5D7Y?tag=troviio-21", price: 199.99, rating: 4.4, review_count: 1600, is_best_seller: false, asin_verified: false, specs: { capacite: "6.2 L", technologie: "Twin TurboStar 2e gen", connectivite: "WiFi NutriU" }, pros: ["TurboStar 2e gen", "WiFi NutriU", "Premium 9000"], cons: ["Plus cher"], description: "Philips 9000 Airfryer XL : TurboStar 2e gen et WiFi NutriU.", note_integration: "ASIN A VERIFIER" },

  // CASQUE AUDIO (8)
  { category_id: "68995990-778d-4a9e-8455-88a66420ff2d", name: "Sony WH-1000XM5", brand: "Sony", asin: "B0BXM22X99", affiliate_url: "https://www.amazon.fr/dp/B0BXM22X99?tag=troviio-21", price: 299.00, rating: 4.6, review_count: 9800, is_best_seller: true, asin_verified: true, specs: { anc: "8 microphones", bluetooth: "5.2", autonomie: "30 h", charge_rapide: "3 min = 3h", codec: ["LDAC", "AAC", "SBC"], poids: "250 g" }, pros: ["Meilleure ANC du marche", "30h autonomie", "LDAC Hi-Res", "3 min = 3h"], cons: ["Prix premium"], description: "Sony WH-1000XM5 : reference ANC mondiale, 30h et LDAC Hi-Res." },
  { category_id: "68995990-778d-4a9e-8455-88a66420ff2d", name: "Bose QuietComfort Ultra", brand: "Bose", asin: "B0CCZ1L489", affiliate_url: "https://www.amazon.fr/dp/B0CCZ1L489?tag=troviio-21", price: 379.95, rating: 4.3, review_count: 9557, is_best_seller: false, asin_verified: true, specs: { anc: "3 modes", bluetooth: "5.3", autonomie: "24 h", audio_spatial: "Bose Immersive Audio" }, pros: ["Spatial Audio 3D", "3 modes ANC", "Son Bose signature"], cons: ["24h vs 30h Sony", "Tres cher"], description: "Bose QC Ultra : Immersive Audio 3D et 3 modes ANC." },
  { category_id: "68995990-778d-4a9e-8455-88a66420ff2d", name: "Sennheiser Momentum 4 Wireless", brand: "Sennheiser", asin: "B0B6GHW1SX", affiliate_url: "https://www.amazon.fr/dp/B0B6GHW1SX?tag=troviio-21", price: 249.00, rating: 4.3, review_count: 5980, is_best_seller: false, asin_verified: true, specs: { anc: "Adaptative", bluetooth: "5.2", autonomie: "60 h", codec: ["aptX", "AAC", "SBC"], drivers: "42 mm", poids: "293 g" }, pros: ["60h autonomie record", "Son audiophile", "aptX"], cons: ["ANC moins puissante que Sony"], description: "Sennheiser Momentum 4 : 60h et drivers 42mm audiophiles." },
  { category_id: "68995990-778d-4a9e-8455-88a66420ff2d", name: "Jabra Elite 10 True Wireless", brand: "Jabra", asin: "B0CB6H3WKT", affiliate_url: "https://www.amazon.fr/dp/B0CB6H3WKT?tag=troviio-21", price: 229.00, rating: 4.3, review_count: 1565, is_best_seller: false, asin_verified: true, specs: { type: "Earbuds intra-auriculaires", anc: "Avancee", bluetooth: "5.3", autonomie_total: "27 h", audio_spatial: "Dolby Atmos", microphones: 6 }, pros: ["Dolby Atmos", "6 micros pro", "27h total"], cons: ["Type earbuds pas casque"], description: "Jabra Elite 10 earbuds : Dolby Atmos et 6 micros pro." },
  { category_id: "68995990-778d-4a9e-8455-88a66420ff2d", name: "Apple AirPods Max USB-C", brand: "Apple", asin: "B0CHX2FSTF", affiliate_url: "https://www.amazon.fr/dp/B0CHX2FSTF?tag=troviio-21", price: 559.00, rating: 4.4, review_count: 3200, is_best_seller: false, asin_verified: false, specs: { anc: "Apple H2", bluetooth: "5.3", autonomie: "20 h", audio_spatial: "Dolby Atmos", materiau: "Aluminium mesh tricot", poids: "385 g" }, pros: ["Design premium aluminium", "Spatial Audio Apple", "Ecosysteme Apple"], cons: ["Tres cher", "Lourd"], description: "AirPods Max USB-C : aluminium, mesh et Spatial Audio Dolby Atmos.", note_integration: "ASIN A VERIFIER" },
  { category_id: "68995990-778d-4a9e-8455-88a66420ff2d", name: "Sony WH-1000XM4", brand: "Sony", asin: "B0BYMH6BR5", affiliate_url: "https://www.amazon.fr/dp/B0BYMH6BR5?tag=troviio-21", price: 229.00, rating: 4.6, review_count: 28000, is_best_seller: true, asin_verified: false, specs: { anc: "DSEE Extreme", bluetooth: "5.0", autonomie: "30 h", charge_rapide: "10 min = 5h", codec: ["LDAC", "AAC", "SBC"], poids: "254 g" }, pros: ["Best rapport qualite-prix Sony", "30h", "LDAC", "Pause auto"], cons: ["ANC sous XM5"], description: "Sony XM4 : toutes les fonctions XM5 a prix reduit.", note_integration: "ASIN A VERIFIER" },
  { category_id: "68995990-778d-4a9e-8455-88a66420ff2d", name: "Bose QuietComfort 45", brand: "Bose", asin: "B09JH9XVCD", affiliate_url: "https://www.amazon.fr/dp/B09JH9XVCD?tag=troviio-21", price: 279.00, rating: 4.5, review_count: 12000, is_best_seller: false, asin_verified: false, specs: { anc: "Bose TriPort", bluetooth: "5.1", autonomie: "24 h", poids: "238 g" }, pros: ["Ultra-leger 238g", "Confort Bose", "Mode transparence"], cons: ["Pas LDAC"], description: "Bose QC45 : 238g, roi du confort Bose avec 24h autonomie.", note_integration: "ASIN A VERIFIER" },
  { category_id: "68995990-778d-4a9e-8455-88a66420ff2d", name: "JBL Tour One M2", brand: "JBL", asin: "B0CCSLM4JL", affiliate_url: "https://www.amazon.fr/dp/B0CCSLM4JL?tag=troviio-21", price: 249.00, rating: 4.3, review_count: 1850, is_best_seller: false, asin_verified: false, specs: { anc: "Adaptative 4 modes", bluetooth: "5.3", autonomie: "30 h", codec: ["LC3", "AAC", "SBC"], poids: "280 g" }, pros: ["ANC adaptative 4 modes", "30h autonomie", "LC3 Bluetooth LE Audio"], cons: ["Moins connu que Sony/Bose"], description: "JBL Tour One M2 : ANC 4 modes et 30h avec LC3.", note_integration: "ASIN A VERIFIER" },
];

// ─── Transformation raw → seed ───────────────────────────────────────────────

function transformProduct(raw: RawProduct, rankInCategory: number): SeedProduct {
  const categorySlug = CATEGORY_SLUG_MAP[raw.category_id] ?? "unknown";
  const slug = generateSlug(raw.name, raw.brand);
  const priceEurCents = Math.round(raw.price * 100);

  return {
    category_id: raw.category_id,
    slug,
    name: raw.name,
    brand: raw.brand,
    model: null,
    description: raw.description,
    tagline: raw.pros[0] ?? null,
    image_url: null,
    price_eur: priceEurCents,
    price_min_eur: null,
    price_max_eur: null,
    price_range: priceRange(raw.price),
    rating: raw.rating,
    review_count: raw.review_count,
    troviio_score: troviioScore(raw.rating, raw.review_count, raw.is_best_seller),
    amazon_asin: raw.asin,
    amazon_tag: AMAZON_TAG,
    merchant_links: { amazon: raw.affiliate_url },
    best_for: inferBestFor(raw.pros, categorySlug),
    avoid_if: inferAvoidIf(raw.cons),
    pros: raw.pros,
    cons: raw.cons,
    specs: raw.specs,
    tags: extractTags(raw, categorySlug),
    is_featured: raw.is_best_seller,
    is_active: true,
    rank_in_category: rankInCategory,
  };
}

// ─── Seeding ─────────────────────────────────────────────────────────────────

async function seed(supabase: SupabaseClient): Promise<void> {
  const rankCounters: Record<string, number> = {};
  const products: SeedProduct[] = RAW_PRODUCTS.map((raw) => {
    const catId = raw.category_id;
    rankCounters[catId] = (rankCounters[catId] ?? 0) + 1;
    return transformProduct(raw, rankCounters[catId]);
  });

  const unverified = RAW_PRODUCTS.filter((p) => !p.asin_verified);
  if (unverified.length > 0) {
    console.warn(`\n⚠️  ${unverified.length} ASINs non vérifiés :`);
    unverified.forEach((p) => console.warn(`   - ${p.name} · ASIN ${p.asin}`));
    console.warn("   → Vérifier sur https://www.amazon.fr/dp/{ASIN}\n");
  }

  if (DRY_RUN) {
    console.log("\n🔍  DRY-RUN — Aperçu (pas d'écriture) :\n");
    for (const [catId, slug] of Object.entries(CATEGORY_SLUG_MAP)) {
      const catProducts = products.filter((p) => p.category_id === catId);
      console.log(`  📦  ${slug.toUpperCase()} (${catProducts.length} produits)`);
      catProducts.forEach((p) =>
        console.log(`       • [${p.price_range.padEnd(7)}] [${String(p.troviio_score).padStart(3)}/100] ${p.name}`)
      );
    }
    console.log("\n✅  Dry-run terminé. Ajouter --seed pour écrire en base.\n");
    return;
  }

  if (CLEAN) {
    console.log("🗑️   Suppression des produits existants...");
    const slugs = products.map((p) => p.slug);
    await supabase.from("products").delete().in("slug", slugs);
    console.log(`   ✅ Nettoyage terminé.\n`);
  }

  let totalInserted = 0;
  let totalErrors = 0;

  for (const [catId, catSlug] of Object.entries(CATEGORY_SLUG_MAP)) {
    const batch = products.filter((p) => p.category_id === catId);
    console.log(`\n  📦  ${catSlug.toUpperCase()} — ${batch.length} produits...`);

    const { data, error } = await supabase
      .from("products")
      .upsert(batch, { onConflict: "slug", ignoreDuplicates: false })
      .select("id, slug");

    if (error) {
      console.error(`     ❌ Erreur : ${error.message}`);
      totalErrors += batch.length;
    } else {
      console.log(`     ✅ ${data?.length ?? batch.length} produits insérés/mis à jour`);
      batch.forEach((p) =>
        console.log(`        - [${p.price_range.padEnd(7)}] [${String(p.troviio_score).padStart(3)}/100] ${p.name}`)
      );
      totalInserted += data?.length ?? 0;
    }
  }

  console.log("\n" + "━".repeat(60));
  console.log("📊  RÉSUMÉ");
  console.log(`   ✅ Insérés/mis à jour : ${totalInserted}`);
  console.log(`   ❌ Erreurs : ${totalErrors}`);
  console.log(`   ⚠️  ASINs à vérifier : ${unverified.length}`);
  console.log("━".repeat(60) + "\n");
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("━".repeat(60));
  console.log("🚀  TROVIIO · Seeding Tier 1 — 5 catégories · 40 produits");
  console.log(`    Mode : ${DRY_RUN ? "DRY-RUN" : CLEAN ? "SEED + CLEAN" : "SEED"}`);
  console.log("━".repeat(60) + "\n");

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });

  try {
    await seed(supabase);
  } catch (err) {
    console.error("❌  Erreur fatale :", err);
    process.exit(1);
  }
}

main();

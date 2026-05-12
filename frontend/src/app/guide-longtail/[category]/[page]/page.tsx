import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/constants";
import StickyCtaMobile from "@/components/StickyCtaMobile";

export const dynamic = "force-dynamic";

type RouteParams = { category: string; page: string };
type PageProps = { params: Promise<RouteParams> };

type FaqItem = { question: string; answer: string };
type SeoPage = {
  id: string;
  category_slug: string;
  page_slug: string;
  h1: string;
  meta_title: string;
  meta_description: string;
  intro_text: string;
  faq_json: FaqItem[];
  keywords: string[];
  updated_at: string;
};
type Category = { id: string; slug: string; name: string };
type Product = {
  id: string;
  name: string;
  brand: string;
  slug: string;
  category_id: string;
  amazon_asin: string | null;
  score: number | null;
  description: string | null;
  pros: string[] | null;
  cons: string[] | null;
  tags: string[] | null;
  rank_in_category: number | null;
  ranking_score: number | null;
  image_url?: string;
  price_eur?: number | null;
  affiliate_url?: string | null;
};

function parseFaq(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is FaqItem =>
        typeof item === "object" && item !== null &&
        typeof (item as FaqItem).question === "string" &&
        typeof (item as FaqItem).answer === "string"
    ).slice(0, 8);
}

async function getSeoPage(cat: string, pg: string): Promise<SeoPage | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("seo_pages").select("*")
    .eq("category_slug", cat).eq("page_slug", pg).single();
  if (error || !data) return null;
  return { ...data, faq_json: parseFaq(data.faq_json), keywords: data.keywords ?? [] } as SeoPage;
}

async function getCategory(slug: string): Promise<Category | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories").select("id, slug, name").eq("slug", slug).single();
  if (error || !data) return null;
  return data as Category;
}

async function getTopProducts(category: Category, seoPage: SeoPage): Promise<Product[]> {
  const supabase = createSupabaseServerClient();
  // Note: rank_in_category is the real column name, ranking_position doesn't exist
  // We remove the .not("amazon_asin","is",null) filter to also show products without ASIN
  const { data, error } = await supabase
    .from("products")
    .select("id,name,brand,slug,category_id,amazon_asin,score,description,pros,cons,tags,rank_in_category,image_url,price_eur,affiliate_url")
    .eq("category_id", category.id)
    .order("score", { ascending: false, nullsFirst: false })
    .limit(30);

  if (error || !data) return [];

  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  const kws = seoPage.keywords.map(norm);

  return (data as Product[])
    .map((p) => {
      // Build a richer text for keyword matching: include category name, tags, description
      const text = norm([
        p.name,
        p.brand,
        p.description ?? "",
        category.name,
        ...(p.tags ?? []),
      ].join(" "));
      const relevance =
        kws.reduce((acc, kw) => acc + (text.includes(kw) ? 2 : 0), 0) +
        ((p.rank_in_category ? Math.max(0, 10 - p.rank_in_category) : 0)) +
        ((p.score ?? 0) / 10);
      return { p, relevance };
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3).map((x) => x.p);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, page } = await params;
  const seoPage = await getSeoPage(category, page);
  if (!seoPage) return { robots: { index: false, follow: false } };
  const canonicalUrl = `${SITE_URL}/guide-longtail/${seoPage.category_slug}/${seoPage.page_slug}`;
  return {
    title: seoPage.meta_title,
    description: seoPage.meta_description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title: seoPage.meta_title, description: seoPage.meta_description, url: canonicalUrl, siteName: "Troviio", type: "article", locale: "fr_FR" },
    robots: { index: true, follow: true },
  };
}

export default async function SeoLongTailPage({ params }: PageProps) {
  const { category: categorySlug, page: pageSlug } = await params;
  const [seoPage, category] = await Promise.all([getSeoPage(categorySlug, pageSlug), getCategory(categorySlug)]);
  if (!seoPage || !category) notFound();

  const products = await getTopProducts(category, seoPage);
  const faqItems = parseFaq(seoPage.faq_json);

  const faqJsonLd = faqItems.length > 0 ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question", name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  } : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/c/${category.slug}` },
      { "@type": "ListItem", position: 3, name: seoPage.h1, item: `${SITE_URL}/guide-longtail/${category.slug}/${seoPage.page_slug}` },
    ],
  };

  const chatIntent = [seoPage.h1, ...seoPage.keywords].join(" ").toLowerCase();

  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      {faqJsonLd && (
        <script type="application/ld+json" suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <script type="application/ld+json" suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs
            crumbs={[
              { label: "Accueil", href: "/" },
              { label: category.name, href: `/c/${category.slug}` },
              { label: seoPage.h1 },
            ]}
          />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">{seoPage.h1}</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">{seoPage.intro_text}</p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:py-14">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Top 3 produits recommandés</h2>

          {products.length > 0 ? (
            <div className="grid gap-5">
              {products.map((product, index) => (
                <article key={product.id} className="rounded-3xl border border-white/5 bg-[#161827] p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-gradient-to-r from-[#FF6B5F] to-[#E5554A] px-3 py-1 text-xs font-bold text-white">#{index + 1}</span>
                        {product.score !== null && (
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#8B8FA3]">Score {Math.round(product.score)}/100</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold">{product.brand} {product.name}</h3>
                      {product.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#8B8FA3]">{product.description}</p>}
                      {product.tags && product.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {product.tags.slice(0, 5).map((tag) => (
                            <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#8B8FA3]">{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        {product.pros && product.pros.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-[#3ED6A3]">Points forts</h4>
                            <ul className="mt-2 space-y-1 text-sm text-[#8B8FA3]">
                              {product.pros.slice(0, 3).map((pro) => (
                                <li key={pro} className="flex gap-2"><span className="text-[#3ED6A3]">+</span><span>{pro}</span></li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {product.cons && product.cons.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-[#FF6B5F]">À noter</h4>
                            <ul className="mt-2 space-y-1 text-sm text-[#8B8FA3]">
                              {product.cons.slice(0, 3).map((con) => (
                                <li key={con} className="flex gap-2"><span>•</span><span>{con}</span></li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 sm:w-52">
                      <a href={product.amazon_asin ? `https://www.amazon.fr/dp/${product.amazon_asin}?tag=troviio-21` : `/produit/${product.slug}`}
                        target="_blank" rel="nofollow sponsored noopener noreferrer"
                        className="block w-full text-center bg-gradient-to-r from-[#FF6B5F] to-[#E5554A] text-white py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 shadow-lg shadow-[#FF6B5F]/20">
                        Voir le prix sur Amazon →
                      </a>
                      <p className="mt-3 text-xs leading-5 text-[#6B6B7A]">Prix et disponibilité affichés directement sur Amazon.</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#161827]/50 p-8">
              <p className="text-sm text-[#8B8FA3]">Aucun produit compatible référencé pour cette sélection.</p>
              <Link href={`/c/${category.slug}`} className="mt-4 inline-block text-sm font-semibold text-[#3ED6A3] hover:underline">← Voir tous les produits {category.name}</Link>
            </div>
          )}

          {faqItems.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight font-display">Questions fréquentes</h2>
              <div className="mt-5 divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
                {faqItems.map((item) => (
                  <details key={item.question} className="p-5 group">
                    <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
                      <span>{item.question}</span>
                      <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Chat */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <section className="rounded-3xl border border-white/5 bg-[#1A1D2E] p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Assistant d'achat</p>
            <h2 className="mt-2 text-xl font-bold tracking-tight font-display">Affiner cette sélection</h2>
            <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Votre intention est pré-remplie — Troviio adapte ses recommandations à votre contexte exact.</p>
            <form action="/chat" method="GET" className="mt-5 space-y-4">
              <input type="hidden" name="category" value={category.slug} />
              <input type="hidden" name="intent" value={chatIntent} />
              <input type="hidden" name="source" value="seo_long_tail" />
              <label className="block">
                <span className="text-sm font-medium text-[#8B8FA3]">Votre besoin</span>
                <textarea name="message" rows={4}
                  defaultValue={`Je cherche ${seoPage.h1.toLowerCase()}. Aide-moi à choisir.`}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0E1020] px-4 py-3 text-sm text-white outline-none focus:border-[#3ED6A3] focus:ring-2 focus:ring-[#3ED6A3]/20 resize-none" />
              </label>
              <button type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B5F] to-[#E5554A] px-5 py-3 text-sm font-bold text-white hover:brightness-110 transition-all shadow-lg shadow-[#FF6B5F]/20">
                Demander à Troviio →
              </button>
            </form>
          </section>
          {seoPage.keywords.length > 0 && (
            <section className="mt-5 rounded-3xl border border-white/5 bg-[#161827] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8B8FA3]">Critères associés</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {seoPage.keywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-[#8B8FA3]">{kw}</span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs leading-6 text-[#6B6B7A]">
            * Les prix indiqués sont susceptibles de varier. Troviio participe au Programme d'Associés d'Amazon EU, un programme d'affiliation qui nous permet de percevoir une commission sur les achats effectués via nos liens, sans surcoût pour vous.
          </p>
        </div>
      </section>

      {/* Sticky CTA mobile — only if products */}
      {products.length > 0 && (
        <StickyCtaMobile
          productName={`${products[0].brand} ${products[0].name}`}
          price={products[0].price_eur ?? 0}
          affiliateUrl={products[0].affiliate_url || ""}
        />
      )}
    </main>
  );
}

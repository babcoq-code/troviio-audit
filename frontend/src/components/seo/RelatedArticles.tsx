import Link from "next/link";

export interface RelatedArticle {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  title?: string;
}

export function RelatedArticles({
  articles,
  title = "Vous pourriez aussi avoir besoin de…",
}: RelatedArticlesProps) {
  if (!articles?.length) return null;

  return (
    <section className="my-12 border-t border-white/5 pt-10">
      <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={article.slug}
            className="group block overflow-hidden rounded-2xl border border-white/5 bg-[#161827] transition hover:border-[#3ED6A3]/30 hover:shadow-lg hover:shadow-[#3ED6A3]/5"
          >
            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3ED6A3]">
                {article.category}
              </span>
              <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-white group-hover:text-[#3ED6A3] transition-colors">
                {article.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-[#8B8FA3]">
                {article.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Troviio",
  description:
    "Le blog Troviio arrive bientôt — astuces, guides d'achat et actualités produits pour vous aider à choisir malin.",
  alternates: { canonical: "https://troviio.com/blog" },
  openGraph: {
    title: "Blog — Troviio",
    description:
      "Le blog Troviio arrive bientôt — astuces, guides d'achat et actualités produits.",
    url: "https://troviio.com/blog",
    siteName: "Troviio",
    locale: "fr_FR",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <article className="text-center">
          <span className="text-6xl mb-8 block">📝</span>
          <h1 className="font-sora text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
            Blog en construction
          </h1>
          <p
            className="mt-6 text-lg leading-8"
            style={{ color: "var(--text-muted)" }}
          >
            Notre blog arrive bientôt ! Nous préparons des articles, guides
            d&apos;achat et astuces pour vous aider à choisir les meilleurs
            produits.
          </p>
          <p
            className="mt-4 text-base leading-7"
            style={{ color: "var(--text-muted)" }}
          >
            En attendant, explorez notre catalogue complet de produits.
          </p>
          <div className="mt-10">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF6B5F] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#e55a4d] transition"
            >
              Voir le catalogue
              <span>→</span>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

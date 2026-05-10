import type { Metadata } from "next";
import ChatHero from "@/components/ChatHero";

export const metadata: Metadata = {
  title: "Recherche de produits — Troviio",
  description: "Recherchez parmi des centaines de produits comparés par l'IA Troviio.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.troviio.com/c/search" },
  openGraph: {
    title: "Recherche de produits — Troviio",
    description: "Recherchez parmi des centaines de produits comparés par l'IA Troviio.",
    url: "https://www.troviio.com/c/search",
    siteName: "Troviio",
    locale: "fr_FR",
    type: "website",
  },
};

export default function SearchPage() {
  return (
    <section
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 troviio-hero-radial" />

      <div className="mx-auto w-full max-w-4xl flex flex-col items-center">
        <div className="max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ color: "var(--text)" }}>
            🔍 Recherche de produits
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-7"
             style={{ color: "var(--text-muted)" }}>
            Parle à l'IA de Troviio pour trouver le produit parfait pour toi.
          </p>
        </div>

        <ChatHero />
      </div>
    </section>
  );
}

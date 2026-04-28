import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides d'achat 2026 — Troviio",
  description: "Les guides d'achat Troviio : conseils experts et recommandations personnalisées pour choisir les meilleurs produits.",
  alternates: { canonical: "https://www.troviio.com/guide" },
};

const GUIDES = [
  { slug: "meilleur-robot-aspirateur", title: "Comment choisir son robot aspirateur en 2026", cat: "aspirateurs-robots", emoji: "🤖", desc: "Parquet, moquette, animaux, appartement ou maison : le guide complet.", date: "2026-04-28" },
  { slug: "meilleure-machine-cafe", title: "Quelle machine à café choisir en 2026 ?", cat: "machines-a-cafe", emoji: "☕", desc: "Grains, capsules, filtre : on démêle tout pour toi.", date: "2026-04-28" },
  { slug: "meilleur-smartphone", title: "Meilleur smartphone 2026 : iOS vs Android", cat: "smartphones", emoji: "📱", desc: "Photo, batterie, budget, reconditionné : guide exhaustif.", date: "2026-04-28" },
  { slug: "meilleur-matelas", title: "Choisir son matelas en 2026 : le guide ultime", cat: "matelas", emoji: "🛏️", desc: "Fermeté, morphologie, couple, chaleur : on t'aide vraiment.", date: "2026-04-28" },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#0A0A0B" }}>
      <div className="max-w-4xl mx-auto">

        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#FF6B2B" }}>
            Guides d'achat
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: "#FAFAFA" }}>
            Choisir, c'est compliqué.{" "}
            <span style={{ color: "#FF6B2B" }}>On s'en occupe.</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#8B8B9A" }}>
            Nos guides sont pensés pour ta vraie vie, pas pour un test labo.
          </p>
        </div>

        <div className="space-y-4">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guide/${g.slug}`}
              className="flex items-start gap-5 rounded-2xl border p-6 transition group"
              style={{ borderColor: "#1E1E24", backgroundColor: "#111113" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,43,0.38)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1E24")}
            >
              <span className="text-3xl shrink-0">{g.emoji}</span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1 group-hover:underline" style={{ color: "#FAFAFA" }}>
                  {g.title}
                </h2>
                <p className="text-sm mb-2" style={{ color: "#8B8B9A" }}>{g.desc}</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs" style={{ color: "rgba(250,250,250,0.3)" }}>
                    Mis à jour le {new Date(g.date).toLocaleDateString("fr-FR")}
                  </span>
                  <Link
                    href={`/c/${g.cat}`}
                    className="text-xs font-medium"
                    style={{ color: "#FF6B2B" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Voir les produits →
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center rounded-3xl border p-8"
             style={{ borderColor: "rgba(255,107,43,0.2)", backgroundColor: "rgba(255,107,43,0.06)" }}>
          <p className="text-lg font-semibold mb-2" style={{ color: "#FAFAFA" }}>
            Tu ne trouves pas ton guide ?
          </p>
          <p className="text-sm mb-5" style={{ color: "#8B8B9A" }}>
            Pose ta question directement à l'IA — elle te répond en temps réel.
          </p>
          <Link
            href="/#chat-hero"
            className="inline-block px-6 py-3 rounded-full font-semibold text-white transition"
            style={{ backgroundColor: "#FF6B2B" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e55a20")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF6B2B")}
          >
            Demander à Troviio ✨
          </Link>
        </div>
      </div>
    </main>
  );
}

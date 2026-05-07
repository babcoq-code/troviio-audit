import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides d'achat 2026 — Troviio",
  description: "Les guides d'achat Troviio : conseils experts et recommandations personnalisées pour choisir les meilleurs produits.",
  alternates: { canonical: "https://troviio.com/guide" },
  openGraph: {
    title: "Guides d'achat 2026 — Troviio",
    description: "Les guides d'achat Troviio : conseils experts et recommandations personnalisées pour choisir les meilleurs produits.",
    url: "https://troviio.com/guide",
    siteName: "Troviio",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guides d'achat 2026 — Troviio",
    description: "Les guides d'achat Troviio : conseils experts et recommandations personnalisées pour choisir les meilleurs produits.",
  },
};

const GUIDES = [
  { slug: "meilleur-aspirateur-robot", title: "Comment choisir son robot aspirateur en 2026", cat: "aspirateurs-robots", emoji: "🤖", desc: "Parquet, moquette, animaux, appartement ou maison : le guide complet.", date: "2026-04-28" },
  { slug: "meilleur-machine-cafe", title: "Quelle machine à café choisir en 2026 ?", cat: "machines-a-cafe", emoji: "☕", desc: "Grains, capsules, filtre : on démêle tout pour toi.", date: "2026-04-28" },
  { slug: "meilleur-smartphone", title: "Meilleur smartphone 2026 : iOS vs Android", cat: "smartphones", emoji: "📱", desc: "Photo, batterie, budget, reconditionné : guide exhaustif.", date: "2026-04-28" },
  { slug: "meilleur-matelas", title: "Choisir son matelas en 2026 : le guide ultime", cat: "matelas", emoji: "🛏️", desc: "Fermeté, morphologie, couple, chaleur : on t'aide vraiment.", date: "2026-04-28" },
  { slug: "meilleur-lave-linge", title: "Meilleur lave-linge 2026 : le guide complet", cat: "lave-linge", emoji: "🌀", desc: "Capacité, essorage, bruit, consommation : le guide complet pour ta famille.", date: "2026-04-29" },
  { slug: "meilleur-aspirateur-balai", title: "Meilleur aspirateur balai 2026 : sans fil, léger, puissant", cat: "aspirateurs-balai", emoji: "🧹", desc: "Autonomie, puissance, poids : trouve l'aspirateur balai adapté à ton logement.", date: "2026-04-29" },
  { slug: "meilleur-robot-cuisine", title: "Meilleur robot de cuisine 2026 : cuiseur ou pâtissier ?", cat: "robots-cuisine", emoji: "🍳", desc: "Thermomix, KitchenAid, Monsieur Cuisine : lequel est fait pour ta cuisine ?", date: "2026-04-29" },
  { slug: "meilleur-casque-audio", title: "Meilleur casque audio 2026 : sans fil, Hi-Fi, nomade", cat: "casques-audio", emoji: "🎧", desc: "Sony, Bose, Sennheiser : le guide complet pour choisir ton casque idéal.", date: "2026-04-29" },
  { slug: "meilleur-ordinateur-portable", title: "Meilleur ordinateur portable 2026 : le guide complet", cat: "ordinateurs-portables", emoji: "💻", desc: "PC ou Mac, étudiant ou pro : trouve le laptop parfait pour ton usage.", date: "2026-04-29" },
  { slug: "meilleur-four-micro-ondes", title: "Meilleur four micro-ondes 2026 : combiné, vapeur, encastrable", cat: "micro-ondes", emoji: "🔥", desc: "Combiné, vapeur, encastrable : trouve le micro-ondes idéal pour ta cuisine.", date: "2026-05-02" },
  { slug: "meilleure-enceinte-bluetooth", title: "Meilleure enceinte Bluetooth 2026 : nomade, party ou premium", cat: "enceintes-bt", emoji: "🔈", desc: "Nomade, party, premium : laquelle est faite pour ton oreille ?", date: "2026-05-02" },
  { slug: "meilleure-poussette", title: "Meilleure poussette 2026 : compacte, tout-terrain, évolutive", cat: "poussettes", emoji: "👶", desc: "Compacte, jogging, duo : la poussette parfaite pour bébé et ton style de vie.", date: "2026-05-02" },
  { slug: "meilleure-cave-a-vin", title: "Meilleure cave à vin 2026 : vieillissement, service, polyvalence", cat: "caves-a-vin", emoji: "🍷", desc: "Vieillissement, service, polyvalence : choisis la cave idéale pour ta collection.", date: "2026-05-02" },
  { slug: "meilleur-purificateur-air", title: "Meilleur purificateur d'air 2026 : allergies, pollution, maison", cat: "purificateurs-air", emoji: "🌬️", desc: "Allergies, pollution, animaux : respire un air plus sain chez toi.", date: "2026-05-02" },
  { slug: "meilleure-barre-de-son", title: "Meilleure barre de son 2026 : Dolby Atmos, home cinéma, budget", cat: "barres-de-son", emoji: "🔊", desc: "Dolby Atmos, home cinéma, budget : transforme le son de ta TV.", date: "2026-05-02" },
  { slug: "meilleure-friteuse-air", title: "Meilleure friteuse à air 2026 : croustillante sans huile", cat: "friteuses-air", emoji: "🍟", desc: "Sans huile, croustillante, familiale : la friteuse à air qui change tout.", date: "2026-05-02" },
  { slug: "meilleur-refrigerateur", title: "Meilleur réfrigérateur 2026 : combiné, américain, encastrable", cat: "refrigerateurs", emoji: "❄️", desc: "Combiné, américain, connecté : garde tes aliments frais plus longtemps.", date: "2026-05-02" },
  { slug: "meilleure-trottinette-electrique", title: "Meilleure trottinette électrique 2026 : urbaine ou longue distance", cat: "trottinettes", emoji: "🛴", desc: "Urbaine, autonomie, budget : la trottinette électrique de tes trajets.", date: "2026-05-02" },
  { slug: "meilleure-imprimante", title: "Meilleure imprimante 2026 : jet d'encre, laser ou multifonction ?", cat: "imprimantes", emoji: "🖨️", desc: "Jet d'encre, laser, multifonction : trouve l'imprimante adaptée à ton bureau.", date: "2026-05-01" },
  { slug: "meilleure-camera-securite", title: "Meilleure caméra sécurité 2026 : intérieur et extérieur", cat: "cameras-securite", emoji: "📷", desc: "Intérieur, extérieur, sans fil : choisis la caméra qui protège ton chez-toi.", date: "2026-05-01" },
  { slug: "meilleur-thermostat-connecte", title: "Meilleur thermostat connecté 2026 : économies et confort", cat: "thermostats-connectes", emoji: "🌡️", desc: "Économies d'énergie, programmation, compatible chaudière : le guide complet.", date: "2026-05-01" },
  { slug: "meilleur-lave-vaisselle", title: "Meilleur lave-vaisselle 2026 : tout savoir pour bien choisir", cat: "lave-vaisselle", emoji: "🍽️", desc: "Capacité, séchage, bruit, consommation : le guide du lave-vaisselle idéal.", date: "2026-05-02" },
  { slug: "meilleur-velo-electrique", title: "Meilleur vélo électrique 2026 : urbain, VTT ou pliant ?", cat: "velos-electriques", emoji: "🚲", desc: "Autonomie, moteur, budget : le guide complet pour choisir ton VAE.", date: "2026-05-02" },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto">

        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--coral)" }}>
            Guides d'achat
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--text)" }}>
            Choisir, c'est compliqué.{" "}
            <span style={{ color: "var(--coral)" }}>On s'en occupe.</span>
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
              className="flex items-start gap-5 rounded-2xl border border-[var(--border)] p-6 transition group hover:border-[rgba(255,107,95,0.38)]"
              style={{ backgroundColor: "var(--bg-surface)" }}
            >
              <span className="text-3xl shrink-0">{g.emoji}</span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1 group-hover:underline" style={{ color: "var(--text)" }}>
                  {g.title}
                </h2>
                <p className="text-sm mb-2" style={{ color: "#8B8B9A" }}>{g.desc}</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs" style={{ color: "rgba(250,250,250,0.3)" }}>
                    Mis à jour le {new Date(g.date).toLocaleDateString("fr-FR")}
                  </span>
                  <Link
                    href={`/c/${g.cat}`}
                    className="text-xs font-medium pointer-events-none"
                    style={{ color: "var(--coral)" }}
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
          <p className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>
            Tu ne trouves pas ton guide ?
          </p>
          <p className="text-sm mb-5" style={{ color: "#8B8B9A" }}>
            Pose ta question directement à l'IA — elle te répond en temps réel.
          </p>
          <Link
            href="/#chat-hero"
            className="inline-block px-6 py-3 rounded-full font-semibold text-white transition-all shadow-md hover:bg-[var(--coral-dark)]"
            style={{ backgroundColor: "var(--coral)" }}
          >
            Demander à Troviio ✨
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { DynamicScore } from "@/components/product/DynamicScore";

export const metadata: Metadata = {
  title: "De Buyer Mineral B Pro vs Lodge Fonte : le duel des poêles 2026",
  description: "Qui est la meilleure poêle ? L'acier carbone français De Buyer Mineral B Pro affronte la fonte américaine Lodge dans un duel sans merci pour vos cuissons.",
  alternates: { canonical: "https://troviio.com/duel/de-buyer-mineral-b-pro-vs-lodge-fonte" },
};

export default function DuelPage() {
  return (
    <>
      <JsonLd
        data={{
          "@type": "Article",
          headline: "De Buyer Mineral B Pro vs Lodge Fonte : le duel des poêles 2026",
          description: "Qui est la meilleure poêle ? L'acier carbone français De Buyer Mineral B Pro affronte la fonte américaine Lodge dans un duel pour vos cuissons.",
          url: "https://troviio.com/duel/de-buyer-mineral-b-pro-vs-lodge-fonte",
          author: { "@type": "Organization", name: "Troviio" },
          datePublished: "2026-05-14",
        }}
      />
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs
          crumbs={[
            { label: "Accueil", href: "/" },
            { label: "Duels", href: "/duels" },
            { label: "Poêle", href: "/c/poele" },
            { label: "Duel : De Buyer Mineral B Pro vs Lodge Fonte" },
          ]}
        />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ Duel Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">De Buyer Mineral B Pro vs Lodge Fonte</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Qui est la meilleure poêle ? L'acier carbone français de Buyer affront la fonte américaine Lodge dans un duel où la santé, la performance et le budget s'affrontent. Inoxydable ou indestructible ?</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Imaginez un duel au sommet de la cuisine saine. D'un côté, De Buyer, le Mandalorien de la poêle : forgé dans les Vosges depuis 1830, zéro compromis, zéro chimie, et un look qui crie "je cuisine mieux que toi". De l'autre, Lodge, le Rocky Balboa de la fonte : américain, un peu brut, pas le plus beau mais increvable. Deux philosophies, un seul vainqueur : vous, qui allez enfin savoir quelle poêle mérite votre feu.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ Comparatif rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Score Troviio** : De Buyer Mineral B Pro (94/100) →  Lodge Fonte (85/100) → De Buyer gagne
- **Prix** : Lodge Fonte (46€) →  De Buyer Mineral B Pro (60€) → Lodge gagne
- **Matériau** : De Buyer (acier carbone) vs Lodge (fonte brute) → Égalité, tous deux zéro PFAS
- **Poids** : De Buyer Mineral B Pro (2,4 kg) →  Lodge Fonte (2,5 kg) → De Buyer gagne
- **Durabilité** : De Buyer (garantie à vie) vs Lodge (garantie 20 ans) → De Buyer gagne
- **Santé** : De Buyer (20/20) vs Lodge (20/20) → Égalité parfaite, zéro chimie
- **Antiadhérence naturelle** : De Buyer (patine qui s'améliore) → Lodge (pré-assaisonnée) → Égalité
- **Facilité d'entretien** : De Buyer (acier carbone, pas de lave-vaisselle) → Lodge (fonte, pas de lave-vaisselle) → Égalité, les deux demandent de l'amour
- **Fabrication** : De Buyer (🇫🇷 Vosges, France) vs Lodge (🇺🇸 Tennessee, USA) → Selon vos convictions
- **Compatibilité cuissons acides** : Lodge (fonte brute, déconseillé) →  De Buyer (acier carbone, déconseillé aussi) → Égalité, les deux n'aiment pas la tomate</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Product 1: De Buyer */}
          <div className="rounded-2xl border border-white/10 bg-[#161827] p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🥇</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3ED6A3]">N°1 Troviio</p>
                <h3 className="text-xl font-bold">De Buyer Mineral B Pro</h3>
                <p className="text-sm text-[#8B8FA3]">De Buyer</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <DynamicScore slug="de-buyer-mineral-b-pro" fallback={94} format="fraction" />
              <span className="text-lg font-bold text-[#3ED6A3]">94/100</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-[#8B8FA3]">~60€</span>
              <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full">Acier carbone</span>
              <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full">France</span>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#3ED6A3] mb-2">✅ Points forts</p>
              <ul className="space-y-1 text-sm text-[#8B8FA3]">
                <li className="flex items-start gap-2"><span className="text-green-400 shrink-0 mt-0.5">•</span>Zéro toxique</li>
                <li className="flex items-start gap-2"><span className="text-green-400 shrink-0 mt-0.5">•</span>Fabriqué en France</li>
                <li className="flex items-start gap-2"><span className="text-green-400 shrink-0 mt-0.5">•</span>Performance pro</li>
                <li className="flex items-start gap-2"><span className="text-green-400 shrink-0 mt-0.5">•</span>Durabilité totale</li>
              </ul>
            </div>
            <div className="mt-auto">
              <Link href="/produit/de-buyer-mineral-b-pro" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4257FF] hover:underline">
                Voir la fiche →
              </Link>
            </div>
          </div>

          {/* Product 2: Lodge */}
          <div className="rounded-2xl border border-white/10 bg-[#161827] p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🥈</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#FFB067]">N°5 Troviio</p>
                <h3 className="text-xl font-bold">Lodge Fonte</h3>
                <p className="text-sm text-[#8B8FA3]">Lodge</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <DynamicScore slug="lodge-fonte" fallback={85} format="fraction" />
              <span className="text-lg font-bold text-[#FFB067]">85/100</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-[#8B8FA3]">~46€</span>
              <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full">Fonte brute</span>
              <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full">USA</span>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#FFB067] mb-2">✅ Points forts</p>
              <ul className="space-y-1 text-sm text-[#8B8FA3]">
                <li className="flex items-start gap-2"><span className="text-green-400 shrink-0 mt-0.5">•</span>Zéro chimie</li>
                <li className="flex items-start gap-2"><span className="text-green-400 shrink-0 mt-0.5">•</span>Prix imbattable</li>
                <li className="flex items-start gap-2"><span className="text-green-400 shrink-0 mt-0.5">•</span>Durabilité infinie</li>
                <li className="flex items-start gap-2"><span className="text-green-400 shrink-0 mt-0.5">•</span>Pré-assaisonnée</li>
              </ul>
            </div>
            <div className="mt-auto">
              <Link href="/produit/lodge-fonte" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4257FF] hover:underline">
                Voir la fiche →
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">🏆 Verdict du duel</h2>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">**Si tu veux la meilleure poêle possible, point — prends la De Buyer Mineral B Pro (94/100).** Elle est plus légère, plus réactive, fabriquée en France, et développe une antiadhérence naturelle imbattable avec le temps. Le choix des chefs.

**Si tu veux le meilleur rapport qualité-prix et une poêle pour la vie — prends la Lodge Fonte (85/100).** À 46€, c'est littéralement imbattable. Elle chauffe plus lentement mais garde la chaleur comme personne. Parfaite pour les viandes saisies et les plats mijotés.

**Notre conseil** : Achète les deux. La De Buyer pour le quotidien (omelettes, steaks, légumes), la Lodge pour les cuissons longues (ragoûts, braisés, pains de viande). Ensemble, elles couvrent 100% de tes besoins culinaires pour moins de 110€. Et zéro PFAS, zéro compromis.</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">🍳 D'autres poêles à découvrir</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/produit/de-buyer-mineral-b-element" className="rounded-xl border border-white/5 bg-[#161827] p-4 hover:border-white/20 transition-colors">
              <p className="text-sm font-semibold">De Buyer Mineral B Element</p>
              <p className="text-xs text-[#8B8FA3]">91/100 — ~50€</p>
            </Link>
            <Link href="/produit/le-creuset-skillet-signature-fonte-26cm" className="rounded-xl border border-white/5 bg-[#161827] p-4 hover:border-white/20 transition-colors">
              <p className="text-sm font-semibold">Le Creuset Skillet</p>
              <p className="text-xs text-[#8B8FA3]">88/100 — ~230€</p>
            </Link>
            <Link href="/produit/tefal-unlimited-on" className="rounded-xl border border-white/5 bg-[#161827] p-4 hover:border-white/20 transition-colors">
              <p className="text-sm font-semibold">Tefal Unlimited On</p>
              <p className="text-xs text-[#8B8FA3]">79/100 — ~43€</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hypnia Bien-Etre Supreme vs Emma Original : le duel des matelas 2026 | Troviio",
    description: "Qui est le meilleur en matelas ? Le Hypnia Bien-Etre Supreme affronte le Emma Original Hybrid II dans un duel sans merci.",
  alternates: { canonical: "https://www.troviio.com/duel/hypnia-bien-etre-supreme-vs-emma-original" },
};

export default function DuelPage() {
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs
          crumbs={[
            { label: "Accueil", href: "/" },
            { label: "Duels", href: "/duels" },
            { label: "matelas", href: "/categorie/matelas" },
            { label: "Duel : Hypnia Bien-Etre Supreme vs Emma Original" },
          ]}
        />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ Duel Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Hypnia Bien-Etre Supreme vs Emma Original</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Qui est le meilleur en matelas ? Le Hypnia Bien-Etre Supreme affronte le Emma Original Hybrid II dans un duel sans merci.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Ah, le grand débat du sommeil ! Entre **Hypnia Bien-Être Supreme** (90/100) et **Emma Original Hybrid II** (89/100), c'est un peu comme choisir entre Neo et Morpheus dans *The Matrix* - les deux te promettent de te réveiller dans le monde réel, mais l'un te fait atterrir dans une salle de bain froide et l'autre dans une cabine de réalité virtuelle. Ou comme dans *Inception*, où tu dois décider si tu veux un totem qui tombe ou un qui reste debout - sauf qu'ici, c'est ton dos qui paie les frais. Prépare-toi à plonger dans le duel du matelas le plus épique depuis que le monde a découvert que les ressorts ne sont pas faits pour les trampolines !</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ Comparatif rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Confort** : Hypnia Bien-Être Supreme (90/100) →  Emma Original Hybrid II (88/100) → Hypnia gagne
- **Support** : Emma Original Hybrid II (90/100) →  Hypnia Bien-Être Supreme (85/100) → Emma gagne
- **Durabilité** : Emma Original Hybrid II (89/100) →  Hypnia Bien-Être Supreme (87/100) → Emma gagne
- **Respirabilité** : Emma Original Hybrid II (92/100) →  Hypnia Bien-Être Supreme (85/100) → Emma gagne
- **Rapport qualité-prix** : Hypnia Bien-Être Supreme (88/100) →  Emma Original Hybrid II (86/100) → Hypnia gagne</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥇 Produit #1</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/hypnia-bien-etre-supreme-slome">Hypnia Bien-Etre Supreme</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Hypnia Bien-Être Supreme** - le matelas qui te fait sentir comme si tu étais dans *Inception*, avec des couches de mousse qui te font tomber en rêve plus vite que Cobb ne peut voler un secret. À 90/100, c'est le champion du confort moelleux - imagine un nuage qui te chuchote " reste là, la réalité peut attendre " pendant que tu flottes dans un état de semi-conscience. Sa mousse à mémoire de forme est si douce que même les agents du *Matrix* auraient du mal à te réveiller. Mais attention : si tu es du genre à te retourner comme un ninja, ce matelas pourrait te donner l'impression de lutter contre le poids de la réalité. Idéal pour les dormeurs qui veulent un soutien plus câlin qu'une étreinte de Yoda.</p>
          
            <div className="mt-4">
              <Link href="/produit/hypnia-bien-etre-supreme-slome" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">🥈 Produit #2</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/emma-original-hybrid-ii">Emma Original Hybrid II</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Emma Original Hybrid II** - le matelas qui te fait dire " je connais le Kung-Fu " en te réveillant, comme Neo après son téléchargement. À 89/100, c'est le maître du support et de la respirabilité - ses ressorts ensachés te soutiennent comme si tu avais des agents aux fesses, mais en mieux. Sa couche de latex te garde au frais, même si tu es en pleine simulation de combat. Imagine un lit qui te dit " tu es l'élu " chaque matin, avec une fermeté qui te fait te sentir prêt à combattre des Smiths. Parfait pour les dormeurs qui transpirent comme dans *The Matrix* quand Neo esquive des balles, ou pour ceux qui veulent un matelas qui ne les engloutit pas comme un trou noir.</p>
          
            <div className="mt-4">
              <Link href="/produit/emma-original-hybrid-ii" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">🏆 Verdict Troviio</p>
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Le gagnant est : **Emma Original Hybrid II** avec 89/100, par un cheveu ! Alors que Hypnia Bien-Être Supreme brille par son confort digne d'un rêve dans *Inception*, Emma l'emporte grâce à un support plus équilibré, une durabilité supérieure et une respirabilité qui te fait dire adieu aux nuits de transpiration façon *Matrix*. Si tu veux flotter dans un nuage, va pour Hypnia ; mais si tu veux un matelas qui te réveille frais et prêt à déchiffrer le code, Emma est ton choix.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">🎯 Pour qui le Hypnia Bien-Etre Supreme ?</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Les dormeurs câlins** : Ceux qui veulent s'enfoncer dans leur matelas comme Cobb dans ses rêves, sans se soucier du réveil brutal.
- **Les insomniaques** : Parfait pour ceux qui cherchent un effet cocon, même si ça ressemble à une simulation de réalité alternative.
- **Les budgets serrés** : Pour ceux qui veulent un bon rapport qualité-prix, sans avoir à vendre leur totem.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">🎯 Pour qui le Emma Original Hybrid II ?</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Les dormeurs chauds** : Idéal pour les gens qui transpirent comme Neo dans le monde réel, besoin de respirabilité maximale.
- **Les bougeurs** : Pour ceux qui se retournent comme des agents dans *The Matrix*, besoin de support sans être englouti.
- **Les durables** : Ceux qui veulent un matelas qui tient le coup face aux années, comme un programme bien codé.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir les TOP 3 →</Link>
            <Link href="/categorie/matelas" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue matelas</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

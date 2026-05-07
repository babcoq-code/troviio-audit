import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dyson Gen5 Detect vs Samsung Bespoke Jet : le duel des aspirateur-balai 2026 | Troviio",
    description: "Qui est le meilleur en aspirateur-balai ? Le Dyson Gen5 Detect Absolute affronte le Samsung Bespoke AI Jet Ultra VS90F4 dans un duel sans merci.",
  alternates: { canonical: "https://troviio.com/duel/dyson-gen5-detect-vs-samsung-bespoke-jet" },
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
            { label: "aspirateur-balai", href: "/categorie/aspirateur-balai" },
            { label: "Duel : Dyson Gen5 Detect vs Samsung Bespoke Jet" },
          ]}
        />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ Duel Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Dyson Gen5 Detect vs Samsung Bespoke Jet</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Qui est le meilleur en aspirateur-balai ? Le Dyson Gen5 Detect Absolute affronte le Samsung Bespoke AI Jet Ultra VS90F4 dans un duel sans merci.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Imaginez un duel de sorciers de l'aspiration - d'un côté, Dyson, l'Hermione Granger du nettoyage, toujours avec le bon sort et la bonne référence (et un peu trop fière de ses cheveux en brosse). De l'autre, Samsung, le Ron Weasley, un peu maladroit mais doté d'un coeur (et d'un réservoir) d'or. Préparez-vous à un affrontement où la poussière n'a qu'à bien se tenir, et où le vainqueur sera celui qui vous fera oublier le ménage... ou au moins le rendra moins relou.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ Comparatif rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Puissance d'aspiration** : Dyson Gen5 Detect Absolute (280 AW) →  Samsung Bespoke AI Jet Ultra (210 AW) → Dyson gagne
- **Autonomie** : Samsung Bespoke AI Jet Ultra (60 min) →  Dyson Gen5 Detect Absolute (40 min) → Samsung gagne
- **Poids** : Dyson Gen5 Detect Absolute (2,6 kg) →  Samsung Bespoke AI Jet Ultra (2,9 kg) → Dyson gagne
- **Technologie d'affichage** : Dyson Gen5 Detect Absolute (laser vert + écran LCD) →  Samsung Bespoke AI Jet Ultra (écran LED capteur) → Dyson gagne
- **Prix** : Samsung Bespoke AI Jet Ultra (699€) →  Dyson Gen5 Detect Absolute (899€) → Samsung gagne</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥇 Produit #1</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/dyson-gen5-detect-absolute">Dyson Gen5 Detect Absolute</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Dyson Gen5 Detect Absolute** - l'aspirateur qui se prend pour un centaure de Poudlard, avec un laser vert qui traque la poussière comme un Détraqueur affamé. C'est l'outil d'Hermione : précis, puissant, et avec une interface LCD qui affiche même la taille des particules (oui, il juge votre capacité à nettoyer). Son moteur tourne à 135 000 tours/minute - plus vite que le Nimbus 2000 de Harry. Seul hic : son autonomie de 40 minutes vous laisse parfois en plan comme un sort de Réduction mal maîtrisé. Mais bon, avec 96/100, il est clairement le préfet de la bande.</p>
          
            <div className="mt-4">
              <Link href="/produit/dyson-gen5-detect-absolute" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">🥈 Produit #2</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/samsung-bespoke-ai-jet-ultra-vs90f40eek">Samsung Bespoke AI Jet Ultra VS90F4</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Samsung Bespoke AI Jet Ultra VS90F4** - le Ron Weasley des aspirateurs : un peu plus lourd, un peu moins clinquant, mais avec une autonomie digne d'un marathon (60 minutes) et un réservoir qui pourrait stocker les chaussettes de Dobby. Son intelligence artificielle ajuste la puissance comme un sort de Confusion bien placé, et son système de vidage automatique est aussi pratique que la cape d'invisibilité de Harry. Il a même un socle de recharge qui fait office de vidage - un peu comme la cabane de Hagrid, mais en plus propre. À 699€, il est clairement le bon plan du trio, même si ses 93/100 le placent un cran en dessous d'Hermione.</p>
          
            <div className="mt-4">
              <Link href="/produit/samsung-bespoke-ai-jet-ultra-vs90f40eek" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">🏆 Verdict Troviio</p>
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">**Le gagnant est : Dyson Gen5 Detect Absolute** - mais de justesse, comme un match de Quidditch gagné au Vif d'Or. Sa puissance et son laser font la différence pour les maniaques du ménage. Mais si vous préférez le confort et le budget, le Samsung est le Ron qui mérite une médaille pour son endurance.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">🎯 Pour qui le Dyson Gen5 Detect Absolute ?</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- Les passionnés de technologie qui veulent un aspirateur avec un écran plus malin que leur smartphone
- Les propriétaires de moquette ou de tapis qui ont besoin d'une puissance de brosse digne d'un sortilège
- Les gens qui ont un petit appartement (moins de 40 minutes de ménage) et qui veulent briller en société</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">🎯 Pour qui le Samsung Bespoke AI Jet Ultra VS90F4 ?</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- Les familles nombreuses qui ont besoin d'un aspirateur qui tient la route comme un match de Quidditch de 3 heures
- Les budgets serrés qui veulent le meilleur rapport qualité/prix sans sacrifier l'intelligence
- Les gens qui ont une grande maison et qui ne veulent pas recharger entre deux étages (comme des escaliers de Poudlard)</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir les TOP 3 →</Link>
            <Link href="/categorie/aspirateur-balai" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue aspirateur-balai</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

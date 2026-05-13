import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LG G5 OLED 65\u2019\u2019 \u2014 OLED65G56LS (2025) vs LG G6 OLED 65\u2019\u2019 \u2014 OLED65G6 (2026) \u2014 Duel Troviio",
  description: "Qui est le meilleur ? LG G5 OLED 65\u2019\u2019 \u2014 OLED65G56LS (2025) affronte LG G6 OLED 65\u2019\u2019 \u2014 OLED65G6 (2026) dans un duel sans merci.",
};

export default function DuelLgG5VsLgG6() {
  return (
<main className="min-h-screen bg-[#0E1020] text-white">
  <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs crumbs={[
        { label: "Accueil", href: "/" },
        { label: "Duels", href: "/duels" },
        { label: "Duel : LG G5 vs LG G6 OLED" },
      ]} />
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ Duel Troviio</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">LG G5 OLED 65" vs LG G6 OLED 65" — La guerre des générations</h1>
        <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Deux télés LG qui se battent comme <strong>Neo</strong> et <strong>Smith</strong> dans Matrix, mais version pixels et Dolby Atmos. 2025 contre 2026, qui gagne le duel ?</p>
      </div>
    </div>
  </section>

  <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
    {/* Intro pop culture */}
    <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
      <p className="text-base leading-7 text-[#8B8FA3]">
        Imaginez un combat entre <strong>Iron Man</strong> (Mark LXXXV) et <strong>War Machine</strong> (Mark IV) — les deux sont des armes de destruction massive, mais l'un a eu une mise à jour de plus. C'est exactement ça. Le LG G5 de 2025 débarque avec son processeur α11 AI Gen1, 2000 nits de luminosité et un design Gallery qui ferait pâlir <strong>Tony Stark</strong> lui-même. Mais voilà que le LG G6 de 2026 arrive avec son α11 AI Gen2, son woofer intégré et ses 77W de son qui feraient trembler <strong>Jarvis</strong>. Les deux sont des <strong>Terminators</strong> du home cinéma, mais lequel mérite votre salon ?
      </p>
    </div>

    {/* ⚡ Comparatif rapide */}
    <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ Comparatif rapide</h2>
    <div className="bg-[#161827] rounded-2xl border border-white/5 p-6 mb-12">
      <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">
        - <strong>Son (W)</strong> : LG G5 (60W) → LG G6 (77W avec woofer) → <strong>G6 gagne</strong> comme <strong>Darth Vader</strong> qui gagne un concours de respiration bruyante
        - <strong>Processeur</strong> : G5 (α11 Gen1) → G6 (α11 Gen2) → <strong>G6 gagne</strong> — c'est <strong>Spider-Man</strong> qui obtient le costume noir
        - <strong>Luminosité peak</strong> : G5 (~2200 nits) → G6 (non spécifié mais dalle améliorée) → <strong>Match nul</strong> — <strong>John Wick</strong> contre <strong>John Wick</strong> avec un crayon
        - <strong>USB</strong> : G5 (2×) → G6 (3× USB 3.0) → <strong>G6 gagne</strong> — comme <strong>Batman</strong> qui ajoute un gadget de plus à sa ceinture
        - <strong>OS</strong> : G5 (webOS 24) → G6 (webOS 25) → <strong>G6 gagne</strong> — <strong>Windows 10</strong> vs <strong>Windows 11</strong>, l'upgrade est là
      </p>
    </div>

    {/* Les deux poids lourds */}
    <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
    <div className="grid gap-6 md:grid-cols-2 mb-12">
      {/* Produit #1 */}
      <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥇 Produit #1</p>
        <h3 className="text-xl font-bold mb-4"><Link href="/produit/lg-g5-oled-65-oled65g56ls-2025">LG G5 OLED 65" — OLED65G56LS (2025)</Link></h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          Le G5, c'est un peu <strong>Luke Skywalker</strong> dans <em>Le Retour du Jedi</em> — puissant, élégant, mais pas encore passé du côté obscur de la puissance brute. Avec ses 2000-2200 nits, son design Gallery qui se colle au mur comme <strong>Venom</strong> à son hôte, et son processeur α11 Gen1 qui fait de l'upscaling comme <strong>Doctor Strange</strong> manipule le temps, c'est un monstre. Mais 60W de son, c'est un peu <strong>R2-D2</strong> qui chante — mignon, mais pas assez pour faire trembler les murs.
        </p>
        <div className="mt-4">
          <Link href="/produit/lg-g5-oled-65-oled65g56ls-2025" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
        </div>
      </div>
      {/* Produit #2 */}
      <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">🥇 Produit #2</p>
        <h3 className="text-xl font-bold mb-4"><Link href="/produit/lg-g6-oled-65-oled65g6-2026">LG G6 OLED 65" — OLED65G6 (2026)</Link></h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          Le G6, c'est <strong>Thanos</strong> avec le Gant de l'Infini — une mise à jour qui change tout. 77W de son avec woofer intégré, c'est comme si <strong>Black Panther</strong> avait ajouté un subwoofer à sa Vibranium suit. Le processeur α11 Gen2 fait de l'upscaling 4K comme <strong>Quicksilver</strong> court — ultra rapide et précis. Et avec webOS 25, l'interface est plus fluide que <strong>Neo</strong> esquivant des balles. Le seul défaut ? Il pèse 500g de plus, mais c'est le poids de la <strong>supériorité</strong>.
        </p>
        <div className="mt-4">
          <Link href="/produit/lg-g6-oled-65-oled65g6-2026" className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B5F] px-4 py-2 text-sm font-medium text-white hover:bg-[#E0554F] transition-colors">Voir la fiche →</Link>
        </div>
      </div>
    </div>

    {/* Verdict */}
    <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
      <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">🏆 Verdict Troviio</p>
      <p className="text-base leading-7 text-[#8B8FA3]">
        <strong>Le gagnant est : LG G6 OLED 65" (2026)</strong> — mais de justesse. C'est comme <strong>Rocky</strong> qui bat <strong>Apollo Creed</strong> au premier film : le G5 est un champion en titre, mais le G6 a l'énergie de la nouvelle génération. Le processeur Gen2, le son plus puissant avec woofer, et webOS 25 font la différence. Mais si vous trouvez le G5 avec une bonne remise (et l'offre LG de 200€ remboursés), il reste un <strong>Dark Vador</strong> dans sa catégorie — un classique indémodable.
      </p>
    </div>

    {/* Pour qui */}
    <div className="grid gap-6 md:grid-cols-2 mb-12">
      <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
        <h3 className="text-lg font-bold mb-4">🎯 Pour qui le LG G5 OLED (2025) ?</h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          - <strong>Les chasseurs de bonnes affaires</strong> : avec l'offre LG de 200€ remboursés, c'est comme <strong>Indiana Jones</strong> qui trouve le Graal en solde
          - <strong>Les minimalistes</strong> : design Gallery qui se colle au mur comme <strong>Spider-Man</strong> — discret mais puissant
          - <strong>Les gamers 144Hz</strong> : VRR, ALLM, et 4K@144Hz natif, c'est <strong>Mario Kart</strong> en mode turbo permanent
          - <strong>Les nostalgiques</strong> : webOS 24 reste excellent, comme <strong>Windows 7</strong> — fiable et connu
        </p>
      </div>
      <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
        <h3 className="text-lg font-bold mb-4">🎯 Pour qui le LG G6 OLED (2026) ?</h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          - <strong>Les audiophiles</strong> : 77W avec woofer, c'est <strong>AC/DC</strong> en concert chez vous — le voisin va détester
          - <strong>Les early adopters</strong> : processeur Gen2 et webOS 25, vous êtes <strong>Tony Stark</strong> avec un an d'avance sur tout le monde
          - <strong>Les gros consommateurs de contenus</strong> : 3× USB 3.0 pour brancher <strong>Matrix</strong> de disques durs — plus de films qu'un marathon <strong>Marvel</strong>
          - <strong>Les perfectionnistes</strong> : upscaling IA amélioré, c'est <strong>Photoshop</strong> qui retouche chaque pixel comme <strong>Michel-Ange</strong> la Chapelle Sixtine
        </p>
      </div>
    </div>
  </section>
</main>
  );
}
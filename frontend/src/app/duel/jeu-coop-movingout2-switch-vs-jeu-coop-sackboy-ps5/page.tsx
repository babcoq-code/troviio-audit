import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMG Studio + DevM Games Moving Out 2 (SMG Studio / DevM Games) vs Sumo Digital Sackboy: A Big Adventure (Sumo Digital / Sony) — Duel Troviio",
  description: "Qui est le meilleur ? SMG Studio + DevM Games Moving Out 2 (SMG Studio / DevM Games) affronte Sumo Digital Sackboy: A Big Adventure (Sumo Digital / Sony) dans un duel sans merci.",
};

export default function DuelMovingOutVsSackboy() {
  return (
<main className="min-h-screen bg-[#0E1020] text-white">
  <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs crumbs={[
        { label: "Accueil", href: "/" },
        { label: "Duels", href: "/duels" },
        { label: "Duel : Moving Out 2 vs Sackboy" },
      ]} />
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ Duel Troviio</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Moving Out 2 vs Sackboy : Le choc des déménageurs cosmiques et des héros en laine</h1>
        <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Deux jeux co-op locaux, un seul trône. D'un côté, des déménageurs qui fracassent des fenêtres façon <em>Fast & Furious</em>. De l'autre, un bonhomme en tissu qui fait du moonwalk sur du Bruno Mars. Qui remporte le duel des canapés ?</p>
      </div>
    </div>
  </section>

  <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
    {/* Intro pop culture */}
    <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
      <p className="text-base leading-7 text-[#8B8FA3]">
        Imaginez un monde où <strong>John Wick</strong> serait déménageur et <strong>Mario</strong> un personnage en patchwork. C'est un peu le pitch de ce duel. <strong>Moving Out 2</strong>, c'est le chaos organisé : vous balancez des canapés par les fenêtres comme si vous étiez dans <em>Home Alone</em> version adulte. <strong>Sackboy: A Big Adventure</strong>, c'est l'élégance d'un <strong>James Bond</strong> en costume, mais avec un corps en laine et des niveaux musicaux qui feraient pâlir <strong>Lady Gaga</strong>. Deux visions du co-op local, une seule question : qui mérite votre dimanche pluvieux ?
      </p>
    </div>

    {/* ⚡ Comparatif rapide */}
    <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ Comparatif rapide</h2>
    <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
      <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">
        - <strong>Ambiance générale</strong> : Moving Out 2 → Chaos de déménageurs bourrés vs Sackboy → Ballet féerique en laine → <strong>Égalité</strong> (le rire contre l'émerveillement)
        - <strong>Gameplay co-op</strong> : Moving Out 2 → Jusqu'à 4 joueurs, physique absurde, portails dimensionnels vs Sackboy → Jusqu'à 4 joueurs, mais caméra centrée sur P1 → <strong>Moving Out 2</strong>
        - <strong>Bande originale</strong> : Moving Out 2 → Bruitages de meubles qui se cassent vs Sackboy → Bruno Mars, Britney Spears, reprises orchestrales → <strong>Sackboy</strong> (évidemment)
        - <strong>Durée de vie</strong> : Moving Out 2 → 8-12h (campagne) vs Sackboy → 15-20h → <strong>Sackboy</strong>
        - <strong>Accessibilité</strong> : Moving Out 2 → PEGI 3, mais peut frustrer les plus jeunes vs Sackboy → PEGI 3, parfait pour les enfants → <strong>Sackboy</strong>
      </p>
    </div>

    {/* Les deux poids lourds */}
    <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
    <div className="grid gap-6 md:grid-cols-2 mb-12">
      {/* Produit #1 */}
      <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥇 Produit #1</p>
        <h3 className="text-xl font-bold mb-4"><Link href="/produit/jeu-coop-movingout2-switch">Moving Out 2</Link></h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          Si <strong>Les Gendarmes à Saint-Tropez</strong> rencontraient <strong>Portal</strong>, ça donnerait <strong>Moving Out 2</strong>. Vous incarnez des déménageurs tellement maladroits qu'ils feraient passer <strong>Mr Bean</strong> pour un expert en logistique. Portails dimensionnels, physique digne d'un <em>Looney Tunes</em>, et des niveaux où vous balancez un frigo par la fenêtre comme si c'était un ballon de plage. Le co-op local est une véritable épreuve du feu pour votre amitié : vous allez rire, crier, et peut-être pleurer. Mais au moins, vous allez <strong>déménager</strong>.
        </p>
        <div className="mt-4">
          <Link href="/produit/jeu-coop-movingout2-switch" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
        </div>
      </div>
      {/* Produit #2 */}
      <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">🥇 Produit #2</p>
        <h3 className="text-xl font-bold mb-4"><Link href="/produit/jeu-coop-sackboy-ps5">Sackboy: A Big Adventure</Link></h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          <strong>Sackboy</strong>, c'est comme si <strong>Mario</strong> et <strong>Unravel</strong> avaient eu un bébé en laine, élevé par <strong>Disney</strong>. Ce jeu de plateforme 3D est un <strong>voyage visuel</strong> : des niveaux qui ressemblent à des décorations de Noël version <em>Avatar</em>, une bande-son avec des reprises de <strong>Bruno Mars</strong> et <strong>Britney Spears</strong> qui vous feront danser dans votre canapé. Le co-op local est fluide, même si la caméra centrée sur le premier joueur peut gâcher la fête. Mais franchement, qui peut résister à un personnage en laine qui fait le moonwalk ? Personne.
        </p>
        <div className="mt-4">
          <Link href="/produit/jeu-coop-sackboy-ps5" className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B5F] px-4 py-2 text-sm font-medium text-white hover:bg-[#E0554A] transition-colors">Voir la fiche →</Link>
        </div>
      </div>
    </div>

    {/* Verdict */}
    <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
      <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">🏆 Verdict Troviio</p>
      <p className="text-base leading-7 text-[#8B8FA3]">
        <strong>Le gagnant est... SACRÉ MATCH NUL !</strong> Oui, comme <strong>Neo et l'Agent Smith</strong> dans le métro, ces deux jeux sont en parfaite opposition. <strong>Moving Out 2</strong> est le roi du chaos coopératif : si vous voulez rire aux larmes en balançant un piano par la fenêtre, foncez. <strong>Sackboy</strong> est le maître de l'élégance : si vous voulez un jeu magnifique, musical et accessible à tous, c'est lui. Le vrai gagnant, c'est vous : vous avez deux excellents jeux co-op. Mais si on doit vraiment trancher, on dira que <strong>Moving Out 2</strong> est meilleur pour du <strong>pur fun décomplexé</strong>, tandis que <strong>Sackboy</strong> est idéal pour <strong>une expérience soignée</strong>. Bref, prenez les deux, votre canapé vous remerciera.
      </p>
    </div>

    {/* Pour qui */}
    <div className="grid gap-6 md:grid-cols-2 mb-12">
      <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
        <h3 className="text-lg font-bold mb-4">🎯 Pour qui Moving Out 2 ?</h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          - <strong>Les fans de chaos</strong> : Si vous aimez <em>Fall Guys</em> et les jeux où tout part en vrille, vous allez adorer.
          - <strong>Les groupes de 4</strong> : Parfait pour des soirées entre potes où personne ne se prend au sérieux.
          - <strong>Les amateurs de cross-play</strong> : Jouez entre Switch, PS5 et PC comme si vous étiez dans <strong>Ready Player One</strong>.
          - <strong>Ceux qui veulent rigoler</strong> : Pas de stress, juste des meubles qui volent et des rires.
        </p>
      </div>
      <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
        <h3 className="text-lg font-bold mb-4">🎯 Pour qui Sackboy ?</h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          - <strong>Les amateurs de plateformes</strong> : Si vous kiffez <em>Crash Bandicoot</em> et <em>Spyro</em>, Sackboy est votre nouveau meilleur pote.
          - <strong>Les fans de musique</strong> : Des niveaux entiers chorégraphiés sur <strong>Bruno Mars</strong> et <strong>Britney Spears</strong>, c'est Noël avant l'heure.
          - <strong>Les familles</strong> : PEGI 3, pas de violence, des couleurs partout. Parfait pour les enfants.
          - <strong>Ceux qui jouent sur PS5</strong> : Exclusivité PlayStation, mais quelle exclusivité ! La console devient une œuvre d'art.
        </p>
      </div>
    </div>
  </section>
</main>
  );
}
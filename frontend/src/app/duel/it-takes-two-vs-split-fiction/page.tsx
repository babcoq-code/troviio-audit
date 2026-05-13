import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { DynamicScore } from "@/components/product/DynamicScore";


export const metadata: Metadata = {
  title: "It Takes Two vs Split Fiction : le duel des jeux co-op ultimes",
  description: "It Takes Two (98/100) ou Split Fiction (97/100) ? Le choc des titans Hazelight. Quel est le meilleur jeu co-op local ? On tranche.",
  alternates: { canonical: "https://troviio.com/duel/it-takes-two-vs-split-fiction" },
};

export default function DuelPage() {
  return (
    <>
      <JsonLd
        data={{
          "@type": "Article",
          headline: "It Takes Two vs Split Fiction : le duel des jeux co-op ultimes",
          description: "It Takes Two (98/100) ou Split Fiction (97/100) ? Le choc des titans Hazelight. Quel est le meilleur jeu co-op local ? On tranche.",
          url: "https://troviio.com/duel/it-takes-two-vs-split-fiction",
          author: { "@type": "Organization", name: "Troviio" },
          datePublished: "2026-01-01",
        }}
      />
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs
          crumbs={[
            { label: "Accueil", href: "/" },
            { label: "Duels", href: "/duels" },
            { label: "jeu-coop-local", href: "/categorie/jeu-coop-local" },
            { label: "Duel : It Takes Two vs Split Fiction" },
          ]}
        />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ Duel Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">It Takes Two vs Split Fiction : le duel des jeux co-op ultimes</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">It Takes Two <DynamicScore slug="it-takes-two" fallback={98}/> ou Split Fiction <DynamicScore slug="split-fiction" fallback={97}/> ? Le choc des titans Hazelight. Quel est le meilleur jeu co-op local ? On tranche.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Bienvenue dans l&#x27;arène des frères ennemis de Hazelight. D&#x27;un côté, **<Link href="/produit/jeu-coop-ittakestwo-ps5" className="text-white hover:text-[#4257FF] transition-colors">It Takes Two</Link>** <DynamicScore slug="it-takes-two" fallback={98}/>, le jeu qui a sauvé des milliers de couples en thérapie en les forçant à coopérer. De l&#x27;autre, **<Link href="/produit/jeu-coop-splitfiction-ps5" className="text-white hover:text-[#FF6B5F] transition-colors">Split Fiction</Link>** <DynamicScore slug="split-fiction" fallback={97}/>, le bébé de Josef Fares qui te balance entre science-fiction et fantasy comme si un portail de *Stranger Things* s&#x27;ouvrait dans ta console. Le réalisateur Josef Fares, ce gars qui a dit \"Fuck the Oscars\" et qui a enchaîné deux GOTY back-to-back, revient avec un nouveau délire. Spoiler : ça va clasher, et ça va être magnifique.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ Comparatif rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Note Troviio** : <Link href="/produit/jeu-coop-ittakestwo-ps5" className="text-white hover:text-[#4257FF] transition-colors">It Takes Two</Link> <DynamicScore slug="it-takes-two" fallback={98}/> VS <Link href="/produit/jeu-coop-splitfiction-ps5" className="text-white hover:text-[#FF6B5F] transition-colors">Split Fiction</Link> <DynamicScore slug="split-fiction" fallback={97}/> → It Takes Two gagne d&#x27;un souffle, comme un tie-break à Wimbledon\n- **Gameplay coopératif** : <Link href="/produit/jeu-coop-ittakestwo-ps5" className="text-white hover:text-[#4257FF] transition-colors">It Takes Two</Link> (chaque niveau a une mécanique unique, tu changes de pouvoir comme de slip) VS <Link href="/produit/jeu-coop-splitfiction-ps5" className="text-white hover:text-[#FF6B5F] transition-colors">Split Fiction</Link> (alternance sci-fi/fantasy avec des sauts dimensionnels dignes de *Doctor Strange*) → Split Fiction gagne pour l&#x27;originalité\n- **Histoire** : <Link href="/produit/jeu-coop-ittakestwo-ps5" className="text-white hover:text-[#4257FF] transition-colors">It Takes Two</Link> (un couple sur le point de divorcer transformé en poupées, meilleure thérapie de couple depuis Jerry Springer) VS <Link href="/produit/jeu-coop-splitfiction-ps5" className="text-white hover:text-[#FF6B5F] transition-colors">Split Fiction</Link> (deux autrices coincées dans leurs propres mondes, c&#x27;est *Inception* meets *The Matrix*) → Split Fiction gagne pour la profondeur narrative\n- **Variété des niveaux** : <Link href="/produit/jeu-coop-ittakestwo-ps5" className="text-white hover:text-[#4257FF] transition-colors">It Takes Two</Link> (un niveau attrape-abeille, un niveau magicien, un niveau jeu vidéo dans le jeu vidéo. Oui, c&#x27;est aussi wtf que ça en a l&#x27;air) VS <Link href="/produit/jeu-coop-splitfiction-ps5" className="text-white hover:text-[#FF6B5F] transition-colors">Split Fiction</Link> (passer d&#x27;un dragon de fantasy à un vaisseau spatial, la classe internationale) → It Takes Two gagne pour l&#x27;absurdité créative\n- **Fun factor** : Les deux sont tellement bons que tu vas perdre ton meilleur ami à cause d&#x27;un saut raté. Mais au moins, vous rigolerez.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥇 Produit #1</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/jeu-coop-ittakestwo-ps5">It Takes Two - <DynamicScore slug="it-takes-two" fallback={98}/></Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**<Link href="/produit/jeu-coop-ittakestwo-ps5" className="text-white hover:text-[#4257FF] transition-colors">It Takes Two</Link>** <DynamicScore slug="split-fiction" fallback={98}/>, c&#x27;est le jeu qui te force à te réconcilier avec ta femme/enfant/coloc/chat avant de passer au niveau suivant. Incarne Cody et May, un couple au bord du divorce transformés en poupées par une larme magique. Oui, c&#x27;est aussi wtf que *Eternal Sunshine of the Spotless Mind* mais avec plus d&#x27;explosions. Chaque niveau introduit une mécanique totalement nouvelle : tu passes du pilotage d&#x27;un caleçon volant à un combat de boss dans un arbre magique. Et tout ça en coop forcée. Tu veux traverser un niveau ? Tu DOIS coopérer. C&#x27;est le test ultime de ton couple. Si tu survives à *It Takes Two* avec ton partenaire, vous pouvez survivre à n&#x27;importe quoi. Même à un déménagement chez IKEA.</p>
          
            <div className="mt-4">
              <Link href="/produit/jeu-coop-ittakestwo-ps5" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">🥈 Produit #2</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/jeu-coop-splitfiction-ps5">Split Fiction - <DynamicScore slug="it-takes-two" fallback={97}/></Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**<Link href="/produit/jeu-coop-splitfiction-ps5" className="text-white hover:text-[#FF6B5F] transition-colors">Split Fiction</Link>** <DynamicScore slug="split-fiction" fallback={97}/>, c&#x27;est le nouveau bébé de Josef Fares. Le pitch ? Deux autrices, Zoe (sci-fi) et Mio (fantasy), se retrouvent coincées dans leurs propres mondes via une machine qui lit leurs pensées. C&#x27;est *Ready Player One* meets *The NeverEnding Story*, avec un budget hollywoodien. Tu passes d&#x27;un niveau où tu chevauches un dragon à un niveau où tu pilotes un vaisseau spatial en une nanoseconde. Les graphismes ? Tellement beaux que tu pleures. Le gameplay ? Chaque niveau est un nouveau terrain de jeu. Un coup tu es dans un donjon médiéval, le coup d&#x27;après tu es dans une station spatiale. Et les blagues ? Josef Fares a mis sa dose d&#x27;humour décalé. Attention, tu risques de mourir de rire ET de game over dans la même seconde.</p>
          
            <div className="mt-4">
              <Link href="/produit/jeu-coop-splitfiction-ps5" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">🏆 Verdict Troviio</p>
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Le gagnant est... **<Link href="/produit/jeu-coop-ittakestwo-ps5" className="text-white hover:text-[#4257FF] transition-colors">It Takes Two</Link>** <DynamicScore slug="it-takes-two" fallback={98}/>, mais de justesse, comme un match de Mario Kart où la tortoise rouge t&#x27;a grillé sur la ligne d&#x27;arrivée. Pourquoi ? Parce que c&#x27;est LE jeu qui a redéfini le genre co-op en 2021 et qui reste une expérience de couple inoubliable. **<Link href="/produit/jeu-coop-splitfiction-ps5" className="text-white hover:text-[#FF6B5F] transition-colors">Split Fiction</Link>** <DynamicScore slug="split-fiction" fallback={97}/> est un chef-d&#x27;œuvre technique et narratif, mais *It Takes Two* a cette âme, cette folie douce qui te fait dire \"wow, j&#x27;ai joué à ça avec mon/ma partenaire et on est toujours en vie\". Si tu veux du spectacle pur, prends *Split Fiction*. Si tu veux une expérience humaine, prends *It Takes Two*. Mais sincèrement, prends les deux. Josef Fares n&#x27;a pas dit \"Fuck the Oscars\" pour rien : ces jeux sont des Oscars à eux tout seuls.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">🎯 Pour qui le It Takes Two ?</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Les couples en quête d&#x27;aventure** : Tu veux tester la solidité de ton couple sans passer par un psy ? Joue à *It Takes Two* avec ton/ta partenaire. Si vous survivez au niveau de la scie circulaire, vous êtes faits l&#x27;un pour l&#x27;autre.\n- **Les gamers débutants** : Le jeu est tellement bien fait que même ta mère qui ne sait pas allumer une console peut y jouer. Sérieusement, c&#x27;est le jeu co-op le plus accessible jamais créé.\n- **Les fans d&#x27;humour absurde** : Si tu aimes *Rick et Morty* et les situations complètement wtf, ce jeu est pour toi.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">🎯 Pour qui le Split Fiction ?</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Les amateurs de science-fiction et fantasy** : Tu kiffes *Dune* ET *Le Seigneur des Anneaux* ? Ce jeu est ton Graal. Tu passes de l&#x27;un à l&#x27;autre sans prévenir, comme un portail interdimensionnel dans ta télé.\n- **Les fans de narration ambitieuse** : Si tu veux une histoire plus profonde que ton dernier crush sur Tinder, *Split Fiction* te prend par la main et te fait voyager.\n- **Les as de la coopération** : Le jeu exige une coordination de ouf. Si tu veux savoir si ton pote est un bon équipier, fais-lui traverser un niveau de *Split Fiction*. Spoiler : vous allez vous engueuler, mais vous allez kiffer.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir les TOP 3 →</Link>
            <Link href="/categorie/jeu-coop-local" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue jeu-coop-local</Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

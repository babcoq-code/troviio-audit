import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sony HT-SF150 vs Sennheiser AMBEO Soundbar Mini",
  description: "Qui est le meilleur ? Sony HT-SF150 affronte Sennheiser AMBEO Soundbar Mini dans un duel sans merci.",
};

export default function DuelAmbeoSoundbarVsHtSf150() {
  return (
<main className="min-h-screen bg-[#0E1020] text-white">
  <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs crumbs={[
        { label: "Accueil", href: "/" },
        { label: "Duels", href: "/duels" },
        { label: "Duel : Sony HT-SF150 vs Sennheiser AMBEO Soundbar Mini" },
      ]} />
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ Duel Troviio</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Sony HT-SF150 vs Sennheiser AMBEO Soundbar Mini</h1>
        <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Le duel des soundbars qui va transformer ton salon en salle de cinéma IMAX (ou en champ de bataille de Dune, au choix).</p>
      </div>
    </div>
  </section>

  <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
    {/* Intro pop culture */}
    <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
      <p className="text-base leading-7 text-[#8B8FA3]">
        Imagine un combat de catch entre <strong>Gandalf</strong> version petit budget (Sony) et <strong>Doctor Strange</strong> qui maîtrise les dimensions parallèles (Sennheiser). D'un côté, la Sony HT-SF150, c'est le <strong>Frodon</strong> des soundbars : modeste, sans artifices, mais qui assure le nécessaire pour survivre à la Comté. De l'autre, la Sennheiser AMBEO Soundbar Mini, c'est le <strong>Tony Stark</strong> en mode Mark LXXXV : blindée de technologies Atmos, DTS:X, et des woofers intégrés qui feraient pâlir <strong>Thanos</strong> lui-même. Le duel promet d'être plus épique que la bataille de <strong>Winterfell</strong> version Netflix.
      </p>
    </div>

    {/* ⚡ Comparatif rapide */}
    <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ Comparatif rapide</h2>
    <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
      <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">
        - <strong>Puissance</strong> : Sony 120W → Sennheiser 250W → Sennheiser gagne (c'est <em>Thor</em> contre <em>Loki</em>)
        - <strong>Dolby Atmos</strong> : Sony Non → Sennheiser Oui → Sennheiser gagne (le son qui sort de ta TV comme un <em>Portail de Doctor Strange</em>)
        - <strong>Caisson de basse</strong> : Sony Aucun → Sennheiser 4 woofers intégrés → Sennheiser gagne (les basses qui font trembler <em>Jurassic Park</em>)
        - <strong>Poids</strong> : Sony 2,4 kg → Sennheiser 3,1 kg → Sony gagne (plus léger qu'un <em>Nazgûl</em> en période de régime)
        - <strong>Connectique</strong> : Sony HDMI ARC → Sennheiser HDMI eARC → Sennheiser gagne (le câble qui parle comme <em>Groot</em> dans sa version premium)
      </p>
    </div>

    {/* Les deux poids lourds */}
    <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
    <div className="grid gap-6 md:grid-cols-2 mb-12">
      {/* Produit #1 */}
      <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥇 Produit #1</p>
        <h3 className="text-xl font-bold mb-4"><Link href="/produit/sony-ht-sf150">Sony HT-SF150</Link></h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          La Sony HT-SF150, c'est le <strong>Luke Skywalker</strong> des soundbars : simple, efficace, mais sans sabre laser ni capuche stylée. Avec ses 120W et sa config 2.0, elle fait le job pour regarder <em>Stranger Things</em> sans que les Démogorgons t'explosent les tympans. Son caisson de basse absent ? C'est comme <strong>Le Seigneur des Anneaux</strong> sans les Hobbits : tu passes à côté de l'essentiel. Mais pour 150€, elle fait le café et te sert les popcorns.
        </p>
        <div className="mt-4">
          <Link href="/produit/sony-ht-sf150" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
        </div>
      </div>
      
      {/* Produit #2 */}
      <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">🥇 Produit #2</p>
        <h3 className="text-xl font-bold mb-4"><Link href="/produit/sennheiser-ambeo-soundbar-mini">Sennheiser AMBEO Soundbar Mini</Link></h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          La Sennheiser AMBEO, c'est le <strong>John Wick</strong> des soundbars : 250W de puissance, Atmos, DTS:X, et 4 woofers intégrés qui font trembler les murs comme si <strong>Godzilla</strong> dansait le tango dans ton salon. Son seul défaut ? Pas de caisson externe, mais les woofers intégrés font le boulot aussi bien que <strong>Hulk</strong> en mode colère. À 800€, c'est le prix d'un billet pour <em>Avatar 3</em>, mais avec du son qui déchire.
        </p>
        <div className="mt-4">
          <Link href="/produit/sennheiser-ambeo-soundbar-mini" className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B5F] px-4 py-2 text-sm font-medium text-white hover:bg-[#E0554A] transition-colors">Voir la fiche →</Link>
        </div>
      </div>
    </div>

    {/* Verdict */}
    <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
      <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">🏆 Verdict Troviio</p>
      <p className="text-base leading-7 text-[#8B8FA3]">
        Si tu veux une soundbar qui fait le job sans te ruiner, la Sony HT-SF150 est ton <strong>Samwise Gamgee</strong> : fidèle, pas cher, et prête à t'accompagner dans les moments difficiles (comme regarder <em>Le Bureau des Légendes</em> en boucle). Mais si tu veux un son qui te transporte directement dans <strong>Le Monde de Narnia</strong> version Atmos, la Sennheiser AMBEO est le <strong>DeLorean</strong> de <em>Retour vers le Futur</em> : elle te propulse à 88mph dans l'immersion sonore. Le verdict ? La Sennheiser gagne haut la main, mais la Sony sauve ton portefeuille.
      </p>
    </div>

    {/* Pour qui */}
    <div className="grid gap-6 md:grid-cols-2 mb-12">
      <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
        <h3 className="text-lg font-bold mb-4">🎯 Pour qui Sony HT-SF150 ?</h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          - Pour ceux qui veulent une soundbar sans prise de tête, comme <strong>Forrest Gump</strong> : "La vie, c'est comme une boîte de chocolats, tu sais jamais sur quel son tu vas tomber"<br />
          - Pour les fans de <em>Netflix & Chill</em> qui ne veulent pas réveiller les voisins (ou les Démogorgons)<br />
          - Pour les budgets serrés qui préfèrent dépenser 50€ de plus en pizzas plutôt qu'en caisson de basse<br />
          - Pour ceux qui pensent que le son 2.0 c'est déjà bien, comme <strong>Gandalf</strong> avec son bâton : pas besoin d'épée quand on a la magie
        </p>
      </div>
      <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
        <h3 className="text-lg font-bold mb-4">🎯 Pour qui Sennheiser AMBEO Soundbar Mini ?</h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          - Pour ceux qui veulent un son de cinéma sans sortir de chez eux, comme <strong>Tony Stark</strong> dans son labo : "Parfois, il faut courir avant de savoir marcher"<br />
          - Pour les gamers qui veulent entendre les pas de <strong>Ghost</strong> dans <em>Call of Duty</em> avec une précision chirurgicale<br />
          - Pour les audiophiles qui préfèrent investir 800€ dans le son plutôt que dans une console next-gen (ou dans des places pour <em>Les Misérables</em> en comédie musicale)<br />
          - Pour ceux qui pensent que le Atmos, c'est le <strong>One Ring</strong> du son : "Un son pour les gouverner tous, et dans les ténèbres les lier"
        </p>
      </div>
    </div>
  </section>
</main>
  );
}
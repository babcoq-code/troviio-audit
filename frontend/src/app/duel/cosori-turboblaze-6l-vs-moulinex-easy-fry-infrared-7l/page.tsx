import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosori TurboBlaze 6L vs Moulinex Easy Fry Infrared 7L — Duel Troviio",
  description: "Qui est le meilleur ? Cosori TurboBlaze 6L affronte Moulinex Easy Fry Infrared 7L dans un duel sans merci.",
};

export default function DuelTurboblaze6lVsEasyFry() {
  return (
<main className="min-h-screen bg-[#0E1020] text-white">
  <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs crumbs={[
        { label: "Accueil", href: "/" },
        { label: "Duels", href: "/duels" },
        { label: "Duel : Cosori TurboBlaze 6L vs Moulinex Easy Fry Infrared 7L" },
      ]} />
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ Duel Troviio</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Cosori TurboBlaze 6L vs Moulinex Easy Fry Infrared 7L</h1>
        <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Deux friteuses à air s'affrontent dans un combat de chefs : la TurboBlaze 6L, ninja silencieux du tiroir, contre l'Easy Fry Infrared 7L, rôdeuse infrarouge. Qui mérite une place dans ta cuisine ?</p>
      </div>
    </div>
  </section>

  <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
    {/* Intro pop culture */}
    <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
      <p className="text-base leading-7 text-[#8B8FA3]">
        Imagine un combat entre Neo et Morpheus dans <em>Matrix</em>, mais version électroménager : la Cosori TurboBlaze 6L esquive les décibels comme des balles avec ses 55 dB, tandis que la Moulinex Easy Fry Infrared 7L dézingue les calories avec ses rayons infrarouges dignes d'un sabre laser de <em>Star Wars</em>. Deux poids lourds, deux philosophies, un seul objectif : transformer tes frites en or croustillant. Prépare le pop-corn (ou plutôt les frites), ça va chauffer dans le tiroir.
      </p>
    </div>

    {/* ⚡ Comparatif rapide */}
    <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ Comparatif rapide</h2>
    <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
      <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">
        - <strong>Capacité</strong> : Cosori (6,0 L) → Moulinex (7,0 L) → <strong>Moulinex</strong> gagne d'un litre, comme Hulk prenant un supplément de protéines.
        - <strong>Bruit</strong> : Cosori (55 dB) → Moulinex (~58 dB) → <strong>Cosori</strong>, plus discret qu'un chat en mission ninja.
        - <strong>Puissance</strong> : Cosori (1700 W moteur DC) → Moulinex (2000 W) → <strong>Moulinex</strong> envoie du lourd, façon Iron Man activant son répulseur.
        - <strong>Programmes</strong> : Cosori (9 modes) → Moulinex (8 préréglages) → <strong>Cosori</strong>, un mode de plus que les anneaux de pouvoir dans <em>Le Seigneur des Anneaux</em>.
        - <strong>Poids</strong> : Cosori (6,0 kg) → Moulinex (6,8 kg) → <strong>Cosori</strong>, plus léger qu'un Hobbit après un régime de Lembas.
      </p>
    </div>

    {/* Les deux poids lourds */}
    <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
    <div className="grid gap-6 md:grid-cols-2 mb-12">
      {/* Produit #1 */}
      <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥇 Produit #1</p>
        <h3 className="text-xl font-bold mb-4"><Link href="/produit/cosori-turboblaze-6l">Cosori TurboBlaze 6L</Link></h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          La Cosori TurboBlaze 6L, c'est un peu le <strong>Batman</strong> des friteuses : silencieuse, efficace, et avec une ceinture à gadgets (9 modes !). Son moteur DC chuchote à 55 dB, comme si <strong>Gollum</strong> susurrait "mon précieux" dans ta cuisine. Avec ses 6,0 L, elle nourrit une famille de 4 sans transpirer. Le seul bruit que tu entendras, c'est le croustillant de tes frites.
        </p>
        <div className="mt-4">
          <Link href="/produit/cosori-turboblaze-6l" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
        </div>
      </div>

      {/* Produit #2 */}
      <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">🥇 Produit #2</p>
        <h3 className="text-xl font-bold mb-4"><Link href="/produit/moulinex-easy-fry-infrared-7l">Moulinex Easy Fry Infrared 7L</Link></h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          La Moulinex Easy Fry Infrared 7L, c'est le <strong>Terminator</strong> version cuisine : infrarouge, puissante, et avec un appétit de 7 litres. Ses 2000 W envoient des ondes comme <strong>Dark Vador</strong> utilise la Force pour carboniser un poulet. À ~58 dB, elle est un peu plus bruyante, mais qui s'en plaint quand on peut cuire un poulet entier sans préchauffage ? C'est la friteuse des dîners de famille façon <em>Fast and Furious</em>.
        </p>
        <div className="mt-4">
          <Link href="/produit/moulinex-easy-fry-infrared-7l" className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B5F] px-4 py-2 text-sm font-medium text-white hover:bg-[#E0554A] transition-colors">Voir la fiche →</Link>
        </div>
      </div>
    </div>

    {/* Verdict */}
    <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
      <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">🏆 Verdict Troviio</p>
      <p className="text-base leading-7 text-[#8B8FA3]">
        C'est un match nul comme la fin d'un épisode de <em>Game of Thrones</em> où personne ne meurt (rare, on sait). Les deux friteuses ont un score de 83/100, comme deux <strong>Pokémon</strong> de même niveau. Mais si tu veux du silence et des modes en pagaille, prends la <strong>Cosori TurboBlaze 6L</strong>. Si tu préfères la puissance brute et la capacité XXL, fonce sur la <strong>Moulinex Easy Fry Infrared 7L</strong>. Le vrai gagnant, c'est toi, avec des frites parfaites.
      </p>
    </div>

    {/* Pour qui */}
    <div className="grid gap-6 md:grid-cols-2 mb-12">
      <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
        <h3 className="text-lg font-bold mb-4">🎯 Pour qui Cosori TurboBlaze 6L ?</h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          - Pour les fans de <strong>Sam Fisher</strong> de <em>Splinter Cell</em> : une friteuse aussi discrète qu'un espion en mission.
          - Pour les <strong>chefs wannabe</strong> qui veulent 9 modes sans lire le manuel (comme <em>Walter White</em> avec son labo).
          - Pour les familles de 4 qui veulent des frites sans réveiller bébé (merci les 55 dB).
          - Pour les <strong>minimalistes</strong> qui préfèrent un design compact, façon <em>Apple Store</em> version cuisine.
        </p>
      </div>
      <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
        <h3 className="text-lg font-bold mb-4">🎯 Pour qui Moulinex Easy Fry Infrared 7L ?</h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">
          - Pour les <strong>Hulk</strong> de la cuisine : 7 litres pour tout carboniser (ou cuire, selon l'humeur).
          - Pour les <strong>geeks de l'infrarouge</strong> qui veulent une technologie digne d'un vaisseau spatial dans <em>Star Trek</em>.
          - Pour les <strong>grandes familles</strong> ou les dîners façon <em>Hunger Games</em> où il faut nourrir tout le district.
          - Pour les <strong>power users</strong> qui veulent 2000 W de puissance, comme <em>Thor</em> avec son marteau (mais version électrique).
        </p>
      </div>
    </div>
  </section>
</main>
  );
}
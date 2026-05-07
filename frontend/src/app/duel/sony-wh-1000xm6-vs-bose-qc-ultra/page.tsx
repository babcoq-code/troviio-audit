import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sony WH-1000XM6 vs Bose QuietComfort Ultra | Troviio",
  description: "Sony ou Bose ? Le combat des titans du casque audio sans fil reprend en 2026.",
  alternates: { canonical: "https://troviio.com/duel/sony-wh-1000xm6-vs-bose-qc-ultra" },
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
            { label: "Duel : Sony WH-1000XM6 vs Bose QC Ultra : le duel des casques audio 2026" },
          ]}
        />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ Duel Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Sony WH-1000XM6 vs Bose QuietComfort Ultra</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Sony ou Bose ? Le combat des titans du casque audio sans fil reprend en 2026.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">C'est le clash des dieux du silence depuis que les écouteurs existent : d'un côté Sony, le Jedi du son qui te fait voyager dans l'espace, de l'autre Bose, le Sith du confort qui te vend le vide absolu. Deux casques entrent, un seul sort, et en 2026, on va enfin savoir qui mérite de trôner sur ton crâne. Attache ta ceinture, audiophile, ça va décoiffer.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ Comparatif rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Qualité sonore** : Sony (basses profondes comme un trou noir) → Bose (neutre comme un lundi matin)
- **Réduction de bruit** : Bose (annule les gosses qui crient dans le bus) → Sony (annule aussi, mais un poil moins)
- **Confort** : Bose (oreilles en plumes) → Sony (ça serre un peu, comme un câlin de Dark Vador)
- **Autonomie** : Sony (30h, assez pour revoir tout Le Seigneur des Anneaux en une nuit) → Bose (24h, t'auras fini avant)
- **Prix** : Sony (moins cher, comme une pizza à 4 fromages) → Bose (cher, comme une pizza truffée)</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥇 Produit #1</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/sony-wh-1000xm6">Sony WH-1000XM6</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Sony WH-1000XM6** (ouais, le XM5 était déjà un monstre). Ce casque, c'est le Mordor du son : des basses tellement profondes que tu sens trembler ton foie. La réduction de bruit ? Très bonne, mais pas parfaite - un peu comme la discipline de Tony Stark en réunion. L'autonomie de 30h, c'est le marathon des audiophiles : tu peux écouter toute la discographie de Daft Punk sans recharger. Mais le confort ? Là, c'est le petit défaut : les oreilles en mousse te serrent un peu, un peu comme le col roulé de Steve Jobs. Et l'appli Sony ? Faut un doctorat pour la comprendre, c'est le labyrinthe de la honte.</p>
          
            <div className="mt-4">
              <Link href="/produit/sony-wh-1000xm6" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">🥈 Produit #2</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/bose-quietcomfort-ultra">Bose QuietComfort Ultra Headphones</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Bose QuietComfort Ultra**. Ah, le luxe absolu. Bose, c'est le Gandalf du silence : jamais un bruit ne passe. La réduction de bruit ? Tellement efficace que tu entends battre ton cœur. Le confort ? On dirait un coussin en nuage, tes oreilles pleurent de joie. Mais le son ? C'est un peu trop neutre, comme un discours de Pam Beesly : propre, mais où est la flamme ? C'est le casque des gens qui veulent juste la paix, pas faire la fête dans leurs tympans. Et le prix ? 450 balles, comme si Bose pensait que tu es un riche wookie. L'autonomie de 24h ? Ça tient, mais t'iras pas en expédition.</p>
          
            <div className="mt-4">
              <Link href="/produit/bose-quietcomfort-ultra" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">🏆 Verdict Troviio</p>
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Le Sony gagne, mais de justesse, comme Luke Skywalker qui esquive un coup de sabre. Pourquoi ? Parce qu'en 2026, le rapport qualité-prix et la personnalisation du son (via une appli qui mérite une médaille) font la différence. Le Bose, c'est le bouclier d'Hulk : increvable, confortable, mais un peu trop sage. Si tu veux du son qui vit, prends le Sony. Si tu veux juste chasser les bruits parasites comme un ninja, prends le Bose. Mais dans ce duel, c'est le Jedi qui l'emporte.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">🎯 Sony WH-1000XM6 est fait pour toi si...</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Le mélomane sportif** : celui qui écoute du hardcore en courant et veut des basses qui frappent comme un uppercut de Rocky.
- **Le geek en télétravail** : qui doit zapper les appels Teams et écouter sa playlist sans se ruiner.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">🎯 Bose QuietComfort Ultra Headphones est fait pour toi si...</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Le voyageur stressé** : celui qui veut un silence de bibliothèque dans l'avion, même avec un bébé hurlant à côté.
- **Le pros du confort** : qui met son casque 8h par jour et refuse de finir avec des oreilles en compote.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir les TOP 3 &rarr;</Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

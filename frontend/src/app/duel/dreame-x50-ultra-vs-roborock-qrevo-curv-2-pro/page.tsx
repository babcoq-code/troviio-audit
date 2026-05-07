import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dreame X50 Ultra vs Roborock Qrevo Curv 2 Pro : le duel des aspirateurs robots 2026 | Troviio",
  description: "Qui est le boss des aspirateurs robots en 2026 ? Le Dreame X50 Ultra affronte le Roborock Qrevo Curv 2 Pro dans un duel sans merci.",
  alternates: { canonical: "https://troviio.com/duel/dreame-x50-ultra-vs-roborock-qrevo-curv-2-pro" },
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
            { label: "Duel : Dreame X50 Ultra vs Roborock Qrevo Curv 2 Pro" },
          ]}
        />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">âï¸ Duel Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Dreame X50 Ultra vs Roborock Qrevo Curv 2 Pro</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Qui est le boss des aspirateurs robots en 2026 ? Le Dreame X50 Ultra affronte le Roborock Qrevo Curv 2 Pro dans un duel sans merci.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">C'est le duel des aspiro-biceps : d'un côté le Dreame X50, le Terminator du ménage qui te fait les tapis comme John Connor fait les circuits imprimés ; de l'autre le Roborock Qrevo Curv 2, le MacGyver des sols qui transforme une miette de pain en défi technologique. Deux machines qui aspirent plus fort que ton ex en mode "je déménage". Mais laquelle mérite de trôner dans ton salon sans te vendre du rêve Ã  crédit ? Allez, on tranche comme du jambon, mais sans le gras.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">â¡ Comparatif rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Puissance d'aspiration** : Dreame X50 (6000 Pa) →  Roborock (5500 Pa) â Dreame gagne
- **Détection des obstacles** : Dreame X50 (lidar + caméra IA) →  Roborock (lidar seul) â Dreame gagne
- **Nettoyage des bords** : Roborock (brosse latérale extensible) →  Dreame (standard) â Roborock gagne
- **Autonomie** : Roborock (180 min) →  Dreame (150 min) â Roborock gagne
- **Rapport qualité-prix** : Roborock (moins cher) →  Dreame (plus premium) â Roborock gagne</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">ð¥ Produit #1</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/dreame-x50-ultra-complete">Dreame X50 Ultra Complete</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Dreame X50** : C'est le Dark Vador des aspirateurs : il aspire tellement fort qu'il pourrait dégommer une miette de pain Ã  10 mètres, même si elle se cache derrière un pot de fleurs. Le lidar couplé Ã  la caméra IA, c'est comme avoir Jar Jar Binks en chef d'orchestre : ça détecte tout, même les câbles que tu as laissés traîner. Mais le prix, c'est le côté obscur de la force : il te coÃ"te un rein, et en plus il faut le nourrir de consommables hors de prix.</p>
          
            <div className="mt-4">
              <Link href="/produit/dreame-x50-ultra-complete" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">ð¥ Produit #2</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/roborock-qrevo-curv-2-pro">Roborock Qrevo Curv 2 Pro</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Roborock Qrevo Curv 2** : Lui, c'est le Ron Weasley de l'aspiration : pas le plus fort, mais toujours lÃ  quand il faut, et avec une brosse latérale extensible qui frôle les plinthes comme un cambrioleur maladroit. Son autonomie de 180 minutes, c'est le marathonien des salons : il peut nettoyer pendant que tu mates trois épisodes de The Office sans broncher. Ã ce prix-lÃ , tu lui pardonnes presque tout.</p>
          
            <div className="mt-4">
              <Link href="/produit/roborock-qrevo-curv-2-pro" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">ð Verdict Troviio</p>
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Le Dreame X50, c'est Neo dans Matrix : il voit les miettes avant qu'elles existent. Le Roborock Qrevo Curv 2, c'est Morpheus : il te propose la pilule rouge du rapport qualité-prix. Si tu veux le Graal du nettoyage, va pour le Dreame. Sinon, le Roborock est le Gandalf des sols : "Tu ne passeras pas !" sauf pour les miettes coincées. **Gagnant : Roborock Qrevo Curv 2** pour les mortels qui veulent un salon propre sans hypothéquer leur foie.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">ð¯ Pour qui le Dreame X50 ?</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Le geek perfectionniste** : Tu veux un aspirateur qui détecte les miettes comme un scanner de vaisseau spatial dans Star Trek.
- **Le propriétaire de tapis blancs** : Tes sols sont plus fragiles qu'un ego de Kardashian.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">ð¯ Pour qui le Roborock Qrevo Curv 2 ?</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Le parent fatigué** : Tu veux un robot qui tienne le coup sans devoir sortir le chéquier.
- **Le locataire maladroit** : Tes câbles traînent partout et t'as besoin d'un aspirateur qui pardonne les erreurs.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir les TOP 3 â</Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

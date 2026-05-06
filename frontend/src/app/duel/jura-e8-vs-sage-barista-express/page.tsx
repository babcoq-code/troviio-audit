import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jura E8 vs Sage Barista Express | Troviio",
  description: "Machine automatique ou manuelle ? Jura E8 ou Sage Barista Express ? Quel type de buveur de cafe es-tu ?",
  alternates: { canonical: "https://www.troviio.com/duel/jura-e8-vs-sage-barista-express" },
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
            { label: "Duel : Jura E8 vs Sage Barista Express : la machine Ã  cafÃ© qui va changer vos matins" },
          ]}
        />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">âï¸ Duel Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Jura E8 vs Sage Barista Express</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Machine automatique ou manuelle ? Jura E8 ou Sage Barista Express ? Quel type de buveur de cafe es-tu ?</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">On va pas se mentir, t'es lÃ  parce que t'en as marre de boire du jus de chaussette rÃ©chauffÃ© le matin. D'un cÃ´tÃ©, Jura, la Suisse qui te vend du cafÃ© comme une Rolex : prÃ©cis, cher, et un brin snob. De l'autre, Sage, le barista de salon qui te fait croire que t'es dans un coffee shop branchÃ© de Brooklyn. Deux machines, une seule question : qui va te sortir de ton lit avec un sourire narquois ? Accroche-toi, on tranche Ã§a comme du jambon.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">â¡ Comparatif rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **QualitÃ© cafÃ©** : Jura (propre, constant, sans sueur) vs Sage (expresso de ouf, mais faut transpirer un peu). Gagnant : Jura si t'es flemmard, Sage si t'es un puriste.
- **SimplicitÃ© d'utilisation** : Jura (bouton et tu pleures de joie) vs Sage (tu passes 10 minutes Ã  calibrer comme un pilote de F1). Gagnant : Jura.
- **Prix** : Jura (budget de ministre suisse) vs Sage (prix de hipster raisonnable). Gagnant : Sage.
- **Design** : Jura (minimaliste comme un iPhone dans un musÃ©e) vs Sage (style industriel qui crie "je fais du latte art"). Gagnant : Jura (classe), mais Sage (charisme).
- **Entretien** : Jura (tu nettoies pas, elle te le rappelle comme ta mÃ¨re) vs Sage (tu dÃ©montes tout, tu pleures). Gagnant : Jura.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">ð¥ Produit #1</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/jura-e8-piano-black">Jura E8 Piano Black</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Jura** - C'est le Dark Vador de la machine Ã  cafÃ© : puissant, prÃ©cis, et tu sais qu'il va te coÃ&quot;ter un bras. Le cafÃ© sort parfait, chaud, crÃ©meux, et t'as l'impression d'Ãªtre un seigneur dans ta cuisine. Mais attention, si t'oses lui filer un grain pourri, elle te fait la gueule : "Erreur, veuillez insÃ©rer un cafÃ© digne de mon rang." Le cÃ´tÃ© relou ? C'est une diva : l'entretien coÃ&quot;te un rein, et si t'oublies de la dÃ©tartrer, elle te sort le fameux "J&apos;ai besoin d&apos;attention" comme un ex toxique dans *The Office*. Mais bon, une fois que t'as goÃ&quot;tÃ© son cafÃ©, t'acceptes de vivre sous un pont.</p>
          
            <div className="mt-4">
              <Link href="/produit/jura-e8-piano-black" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">ð¥ Produit #2</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/sage-barista-express-impress-bes876">Sage Barista Express Impress BES876</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Sage** - C'est le R2D2 des machines : un peu cabossÃ©, mais il sauve la galaxie. Avec son porte-filtre et sa buse vapeur, tu te prends pour Tony Stark : "Regarde maman, je fais un cygne dans la mousse !" Le cafÃ© ? Une bombe si t'es prÃªt Ã  moudre, tasser, et jurer comme un charretier. Le dÃ©faut ? C'est un peu le Kaamelott de la cuisine : t'as besoin d'un Graal (un moulin, une balance, une patience de moine) pour en tirer le meilleur. Et si t'es pressÃ© le matin, elle te regarde en mode "t'as pas le niveau". Mais pour le prix, tu deviens le roi du latte art.</p>
          
            <div className="mt-4">
              <Link href="/produit/sage-barista-express-impress-bes876" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">ð Verdict Troviio</p>
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">**Sage gagne.** Oui, j'ai dit Ã§a. Jura, c'est Neo dans *Matrix* : il voit tout, il anticipe tout, mais il te coÃ&quot;te un abonnement Ã  la Matrix elle-mÃªme. Sage, c'est Morpheus : il te file la pilule rouge du barista, et tu dÃ©couvres que t'es capable de faire un cafÃ© qui claque sans vendre un rein. Si t'as le temps et l'Ã¢me d'un artisan, Sage te fait kiffer pour moins cher. Si t'es le PDG pressÃ© qui veut juste du bon cafÃ© sans suer, Jura reste le boss. Mais pour le commun des mortels, Sage est la potion magique.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">ð¯ Jura E8 Piano Black est fait pour toi si...</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Le cadre sup' en costard** : t'as une rÃ©union Ã  8h, tu veux un cafÃ© parfait sans toucher Ã  rien. Jura, c'est ton assistant personnel.
- **Le collectionneur de gadgets** : t'aimes les trucs chers et suisses. Jura trÃ´ne dans ta cuisine comme un trophÃ©e.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">ð¯ Sage Barista Express Impress BES876 est fait pour toi si...</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Le hipster barista en herbe** : t'as un compte Instagram pour tes latte art, et tu kiffes transpirer pour un bon cafÃ©. Sage, c'est ton pote de galÃ¨re.
- **Le fauchÃ© exigeant** : t'as pas 2000 balles, mais tu veux un cafÃ© de ouf. Sage te sauve la mise sans ruiner ton loyer.</p>
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

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">

      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs
            crumbs={[
              { label: "Accueil", href: "/" },
              { label: "Machine A Cafe", href: "/c/machine-a-cafe" },
              { label: "Machine a cafe grain silencieuse pour la maison et le bureau" },
            ]}
          />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Machine a cafe grain silencieuse pour la maison et le bureau</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Marre du bruit de broyeur qui reveille tout le monde ? Machines a cafe les plus silencieuses.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Tu en as marre de te lever le matin, d’attendre que ta machine à dosettes crache un liquide tiède au goût de chaussette, et de devoir subir le bruit d’un marteau-piqueur pour un simple café ? Bienvenue dans le monde magique des machines à grain silencieuses ! Ici, on moud, on infuse, et on sirote sans réveiller le voisin (ou ton collègue en télétravail). Le problème ? Choisir la perle rare parmi un océan de promesses marketing. Pas de panique, on a testé pour toi, avec l’humour d’un type qui a trop bu d’espresso. Prépare-toi à un guide d’achat aussi mordant qu’un grain de robusta mal torréfié. Let’s go, caféïne addict !</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">☕ La Rolls du silence | De’Longhi Magnifica S (89/100) | Meilleur rapport qualité-prix et bruit minime.
🔇 Ninja des grains | Jura E8 (95/100) | Silencieuse comme un ninja, chère comme un loyer.
🤫 L’ovni compact | Siemens EQ.6 (85/100) | Petit mais costaud, idéal pour ton bureau.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Bruit en décibels</strong> : Un critère crucial pour ne pas ressembler à un chantier. On vise sous 50 dB.
<strong>Qualité de mouture</strong> : Des grains bien broyés pour un espresso qui claque. Pas de poudre de perlimpinpin.
<strong>Capacité du réservoir</strong> : Assez d’eau pour survivre à une réunion sans devoir faire le plein toutes les 30 minutes.
<strong>Nettoyage automatique</strong> : Parce que laver manuellement, c’est pour les pigeons. L’auto-nettoyage, c’est la vie.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>De’Longhi Magnifica S</strong> – Le meilleur pour les mortels. Si tu veux un café digne d’un barista sans vendre un rein, prends ça. C’est silencieux (pour une machine à grain), robuste, et ça fait le café sans faire de cinéma. À éviter si tu es un bourge qui exige le silence absolu d’un tombeau. Pour le commun des mortels, c’est le Graal.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Jura E8</strong> – La machine des vrais snobs. Ultra silencieuse, design sexy, et café de qualité supérieure. Mais attention, ton compte en banque va pleurer. Parfait pour les cadres qui veulent impressionner leur patron. À éviter si tu es encore en stage non rémunéré ou si tu préfères manger des pâtes que boire du bon café. Un bijou, mais avec un prix de bijou.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Siemens EQ.6</strong> – Le couteau suisse des expressos. Compact, silencieux, et avec un écran tactile qui te fait croire que tu pilotes un vaisseau spatial. Idéal pour les bureaux où l’espace est limité. Par contre, le réservoir d’eau est un peu petit : prévois une pause café toutes les 5 tasses. À éviter si tu es un goinfre de caféine. Un bon plan pour les petits espaces.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour le barista du dimanche matin</strong> : Prends la De’Longhi Magnifica S. Rapport qualité-prix imbattable.
<strong>Pour le télétravailleur insomniaque</strong> : La Jura E8, pour un café silencieux même à 5h du matin.
<strong>Pour le bureau en open space</strong> : La Siemens EQ.6, compacte et discrète pour éviter les regards noirs.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Choisir le prix comme seul critère</strong> : Une machine à 200€ fait souvent un bruit d’enfer et un café infect.
<strong>Oublier l’entretien</strong> : Si tu ne nettoies pas, tu bois du café au goût de rouille. Dégueu.
<strong>Ignorer le bruit de la mouture</strong> : Certaines sont silencieuses, d’autres réveillent les morts. Vérifie les décibels !</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce qu’une machine à grain silencieuse existe vraiment ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais attention : le silence total coûte un bras. Prépare ton portefeuille.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je utiliser du café moulu dans une machine à grain ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, c’est comme mettre du diesel dans une Ferrari. Prends des grains entiers.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Combien de temps dure une machine à grain en moyenne ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: 5 à 10 ans si tu l’entretiens bien. Sinon, elle te lâchera après un an de maltraitance.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Le bruit de la mouture est-il gênant en open space ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Si tu prends une silencieuse, non. Sinon, prépare-toi à des regards assassins.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il un broyeur intégré ou séparé ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Intégré, toujours. Un broyeur séparé, c’est comme un téléphone à cadran : vintage, mais pas pratique.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/machine-a-cafe" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits →</Link>
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Top 3 Troviio</Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
          </div>
        </div>

      </section>

      {/* Disclaimer */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiques sont susceptibles de varier. Troviio participe au Programme d'Associes d'Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}

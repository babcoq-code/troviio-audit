import Link from "next/link";

export const dynamic = "force-dynamic";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">

      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/c/aspirateur-robot" className="hover:text-white transition-colors">Aspirateur-robot</Link>
            <span>/</span>
            <span className="text-white font-medium">Robot aspirateur silencieux pour appartement 2026</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d&apos;achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Robot aspirateur silencieux pour appartement 2026</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Voisins, bebe, teletravail : les modeles les plus silencieux pour nettoyer sans deranger.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T’as craqué pour un appartement 2026, avec des murs en carton-pâte et des voisins qui entendent tes soupirs. Mais ton vieux robot aspirateur fait un bruit de motoculteur en pleine orgie de métal. Résultat : tu te prends pour un agent secret en mission d’évitement sonore. Pas de panique, on va dégoter le ninja du silence qui glisse sur ton parquet comme John Wick dans un couloir de hotel. Si ton robot ronronne plus fort que ton chat, c’est l’heure du divorce technologique.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🧹 Silence Absolu | Dyson 360 Vis Nav (94/100) | “Le fantôme qui nettoie sans un pet sonore.”
🤫 Ninja Furtif | Roborock S8 MaxV (91/100) | “Rase les miettes comme un kamikaze silencieux.”
🕵️ Agent Secret | iRobot Roomba j9+ (88/100) | “Nettoie sous ton canapé sans trahir ta présence.”</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Décibels max** : Pas plus de 50 dB, sinon ton voisin du dessous croit à un déménagement.
**Autonomie rusée** : Minimum 120 minutes, pour pas qu’il s’endorme sur le tapis en pleine mission.
**Détection obstacle** : Évite les câbles comme un mec qui esquive son ex dans un supermarché.
**Auto-vidage** : Sinon tu vas le vider toi-même, et t’as mieux à faire que jouer les égoutiers.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Dyson 360 Vis Nav** : Le roi du silence, à peine plus bruyant qu’une libellule en yoga. Il aspire la poussière sans faire de vagues, parfait si tu veux passer pour un fantôme. Pour qui ? Les paranos du bruit qui cachent leur téléphone sous l’oreiller. À éviter si ? Tu kiffes les concerts de métal pendant que ton robot fait le ménage.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Roborock S8 MaxV** : Le ninja de l’aspiration, furtif comme un espion de la CIA. Il détecte les obstacles avec une précision chirurgicale, mais son prix fait mal au portefeuille. Pour qui ? Les geeks qui veulent une IA qui nettoie sans les déranger. À éviter si ? Tu préfères un robot qui chante du karaoké en travaillant.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**iRobot Roomba j9+** : Le vieux sage du silence, fiable comme un métro parisien en grève. Il se vide tout seul, mais son intelligence artificielle a parfois des bugs dignes de Windows 95. Pour qui ? Les flemmards qui veulent juste appuyer sur un bouton. À éviter si ? Tu attends une révolution technologique, pas un robot qui tourne en rond.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Pour le télétravailleur insomniaque** : Dyson 360 Vis Nav, pour bosser sans bruit parasite.
**Pour le geek parano des capteurs** : Roborock S8 MaxV, le garde du corps silencieux.
**Pour le père noël débordé** : iRobot Roomba j9+, il se vide, tu rêves.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Croire que silence = faible puissance** : Faux, 2026, les moteurs sont des murmures de tueur.
**Ignorer les capteurs de chute** : Sans ça, ton robot se suicide dans l’escalier façon Bambi.
**Oublier le filtre HEPA** : Sinon il recrache la poussière comme un ado qui tousse dans le métro.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce qu’un robot silencieux aspire moins fort ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, c’est comme comparer un chuchotement d’assassin à un cri de goret.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Quel bruit maximal pour ne pas réveiller un chat ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: 45 dB, ton chat dort mieux que ton ex pendant un film d’action.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Les capteurs détectent-ils les crottes de chien ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, sauf si ton cabot fait des œuvres d’art abstraites.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Dois-je vider le réservoir après chaque passage ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Seulement si t’aimes les surprises crades façon Koh-Lanta.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que ça marche sur un parquet qui grince ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais ton voisin du dessus croira à une invasion de souris cyborgs.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/aspirateur-robot" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits →</Link>
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Top 3 Troviio</Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
          </div>
        </div>

      </section>

      {/* Disclaimer */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiques sont susceptibles de varier. Troviio participe au Programme d&apos;Associes d&apos;Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}

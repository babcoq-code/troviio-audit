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
            <Link href="/c/montre-connectee" className="hover:text-white transition-colors">Montre connectée</Link>
            <span>/</span>
            <span className="text-white font-medium">Quelle montre connectée pour le sport en 2026 ?</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Quelle montre connectée pour le sport en 2026 ?</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Tu veux une montre qui te suit à la salle sans flancher ? On compare les meilleures montres connectées pour le sport : cardio précis, GPS fiable, autonomie solide.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T'as décidé de te mettre au sport sérieusement cette année. Sauf que ton téléphone dans la poche, ça te fait une bosse disgracieuse façon pause-gâteau au McDo. Et le cardio intégré de ta vieille montre chinoise, il annonce 180 pulsations quand tu montes un escalier — un peu flippant comme précision, non ? Pas de panique, on a testé pour toi les montres qui captent ton pouls mieux qu'un stéthoscope de cardiologue et qui te guident sur les sentiers sans te perdre dans le bois comme une chouette en goguette. Si ta montre actuelle te sert juste à regarder l'heure entre deux séries de pompes, c'est le moment de passer au niveau supérieur.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🏅 Légende de l'endurance | Garmin Fenix 8 (85/100) | “La montre qui te survit, même à un ultra-trail en Sibérie.”
💪 Athlète premium | Apple Watch Ultra 2 (81/100) | “Le couteau suisse des sportifs connectés, prêt à tout.”
🏃 Runner malin | Garmin Venu 4 (72/100) | “Le coach discret qui te suit sans te prendre la tête.”</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Cardio précis</strong> : Un capteur optique qui lit dans ton sang comme un voyant extralucide, pas un gadget de foire.
<strong>GPS fiable</strong> : Multibande ou rien, sinon tu vas te perdre dans le champ de maïs à côté du stade.
<strong>Autonomie solide</strong> : Minimum 7 jours, pour pas que ta montre meure avant la fin de la séance fractionnée.
<strong>Résistance à l'eau</strong> : 5 ATM au moins, parce que la sueur ça compte, mais la flaque après une averse aussi.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Garmin Fenix 8</strong> — La championne du monde de l'endurance. Avec 40 jours d'autonomie en mode solaire, elle te suit au bout du monde sans te demander de passer à la pompe. Son cardio est aussi fiable qu'un métronome suisse, son GPS multibande te repère même dans le métro. Côté prix, ça pique un peu (~1099€ sur Amazon via <a href="https://www.amazon.fr/dp/B0DFLYMF79?tag=troviio-21" target="_blank" rel="noopener noreferrer" className="underline text-[#3ED6A3]">ce lien</a>), mais t'achètes une montre pour 10 ans, pas pour un été. Pour qui ? Les triathlètes, les marathoniens, les fous du trail qui veulent des stats plus précises que leur médecin du sport. À éviter si ? Tu fais du sport en regardant Netflix sur le canapé.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Apple Watch Ultra 2</strong> — Le couteau suisse de la salle de sport. Écran solaire (3000 nits, de quoi lire tes stats en plein désert), sirène de détresse pour les urgences (ou pour faire fuir le gros bras qui monopolise la machine à squat), et un suivi sportif ultra complet. Elle est parfaite pour l'écosystème Apple, mais son autonomie de 36h est son talon d'Achille : si tu fais un ultra-trail de 2 jours, prévois un chargeur portable ou une bonne paire de jambes. À ~899€ sur Amazon <a href="https://www.amazon.fr/dp/B0DGJDZL6D?tag=troviio-21" target="_blank" rel="noopener noreferrer" className="underline text-[#3ED6A3]">par ici</a>. Pour qui ? Les sportifs Apple addicts qui veulent du style ET de la performance. À éviter si ? Tu es sur Android (elle te regardera de travers).</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Garmin Venu 4</strong> — Le petit frère malin de la Fenix. Moins chère (~549€ sur Fnac), elle fait le job pour 90% des sportifs : cardio précis, GPS fiable, écran AMOLED magnifique. Elle te coache directement au poignet avec des programmes d'entraînement adaptés à ton niveau — idéal si tu confonds encore une série de burpees avec une danse de la pluie. Pour qui ? Les runners du dimanche, les cyclistes du week-end et les amateurs de fitness qui veulent du sérieux sans vendre un rein. À éviter si ? Tu es un athlète qui cumule les ultra-trails et les expéditions en haute montagne.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour l'ultra-traileur qui dort dans les arbres</strong> : Garmin Fenix 8 — elle tient la distance comme un chamois en pleine forme.
<strong>Pour le sportif branché qui a déjà un iPhone</strong> : Apple Watch Ultra 2 — le style, la performance, et l'obsession du suivi.
<strong>Pour le runner casual qui veut coach discret</strong> : Garmin Venu 4 — le meilleur rapport qualité/perf sans se ruiner.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Croire que tous les GPS se valent</strong> : Sans multibande, tu vas te perdre dans le rond-point devant chez toi.
<strong>Oublier de vérifier l'autonomie</strong> : Une montre qui meurt à la moitié du run, c'est aussi utile qu'un cardio sur une cuillère.
<strong>Négliger le confort</strong> : Une montre qui gratte le poignet, tu la jettes après une semaine, même si elle a le GPS de la NASA.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Une montre sport peut-elle détecter une fibrillation cardiaque ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, les modèles haut de gamme (Fenix 8, Ultra 2) ont un ECG intégré. Mais si ton cœur fait du rock'n'roll, consulte un médecin, pas ta montre.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Le GPS fonctionne-t-il sans téléphone ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, les Garmin et l'Ultra 2 embarquent un GPS autonome. Tu peux laisser ton téléphone au vestiaire — et tant mieux pour ta poche.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Combien de temps dure une batterie en mode GPS ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: La Fenix 8 tient 40h en GPS, l'Ultra 2 environ 12h, la Venu 4 jusqu'à 20h. Choisis selon la durée de tes runs.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je nager avec une montre connectée sport ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui si elle est certifiée 5 ATM ou plus. La Fenix 8 va jusqu'à 40m, l'Ultra 2 aussi. Parfait pour les longueurs.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il un abonnement pour les fonctions sport avancées ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Chez Garmin, tout est inclus. Chez Apple, certaines fonctions avancées coûtent un abonnement Fitness+. Garmin gagne encore.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/montre-connectee" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits →</Link>
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

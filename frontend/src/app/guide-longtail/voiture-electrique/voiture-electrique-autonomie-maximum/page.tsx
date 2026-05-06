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
            <Link href="/c/voiture-electrique" className="hover:text-white transition-colors">Voiture electrique</Link>
            <span>/</span>
            <span className="text-white font-medium">Quelle voiture electrique a la meilleure autonomie en 2026 ?</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Quelle voiture electrique a la meilleure autonomie en 2026 ?</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Fini l'anxiete de la panne. Decouvre le top 3 des voitures electriques avec la meilleure autonomie en 2026.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T'as la peur de la panne qui te colle au volant comme le chewing-gum sous ta chaussure ? L'anxiete de l'autonomie, ce fantome qui te force a scruter la jauge toutes les 5 minutes. Avec les voitures electriques 2026, cette epoque est finie. Les nouvelles batteries te permettent de traverser la France sans stresser : 805 km pour la BMW iX3 Neue Klasse, 702 km pour la Tesla Model 3 Highland, 614 km pour la Hyundai IONIQ 6. Fini de chercher une borne comme un zombie en plein desert. On a teste les 3 championnes de l'autonomie pour toi. Branche-toi, ca pulse.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🔋 Record Absolu | BMW iX3 Neue Klasse (805 km, 78/100) | "La reine des longues distances, celle qui bouffe du macadam sans sourciller."
⚡ Roi du Rapport Q/P | Tesla Model 3 Highland (702 km, 80/100) | "Berline increvable au prix d'une thermique de base."
🔌 Surprise Coreenne | Hyundai IONIQ 6 (614 km, 76/100) | "L'ovni aero qui te fait oublier la prise."</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Autonomie WLTP</strong> : Le seul chiffre qui compte vraiment. Sous les 450 km, tu vas stresser. Vise minimum 600 km pour rouler l'esprit tranquille.
<strong>Vitesse de charge</strong> : 800V ou rien. Une batterie qui met 40 min a passer de 10 a 80%, c'est comme attendre le cafe au bureau un lundi matin. Inacceptable.
<strong>Consommation</strong> : Les kWh/100 km, c'est le nouveau litre au 100. Moins tu consommes, plus tu vas loin sans que ca coute un rein.
<strong>Reseau de recharge</strong> : Tesla Superchargeur, c'est le McDo des bornes : partout, rapide, fiable. Hyundai et BMW commencent a rattraper leur retard.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>BMW iX3 Neue Klasse</strong> (805 km, 78/100, ~71 950€) : La bombe allemande qui pulverise tous les records. 805 km WLTP, architecture 800V avec charge a 400 kW, et un interieur qui te fait croire que t'es dans l'Enterprise. Le SUV parfait pour ceux qui roulent 30 000 km par an et qui veulent le faire avec style. Seul hic : le prix qui fait pleurer le banquier. Pour qui ? Les gros rouleurs qui veulent le top du top. A eviter si ? Ton budget plafonne a 40 000€.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Tesla Model 3 Highland</strong> (702 km, 80/100, ~36 990€) : La berline qui a tue le game. 702 km WLTP, suspension revue, double vitrage, et un reseau Superchargeur qui te sauve la mise partout en Europe. Le meilleur rapport autonomie/prix du marche, point barre. Elle est fabriquee a Shanghai donc pas eligible au bonus, mais a ce prix-la, qui s'en soucie ? Pour qui ? Les aventuriers du bitume qui veulent aller loin sans se ruiner. A eviter si ? Tu veux absolument le confort d'un SUV.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Hyundai IONIQ 6</strong> (614 km, 76/100, ~52 200€) : L'extra-terrestre de la bande. Son look de vaisseau spatial cache un coefficient de trainee record (0,21 Cd) et une consommation ultra-basse. 614 km WLTP et une charge 800V rapide. C'est l'arme secrete des gens qui comprennent l'aerodynamique. Pour qui ? Les technophiles qui veulent une voiture differente. A eviter si ? Tu ne supportes pas les regards dans la rue.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour le commercial qui bouffe de l'autoroute</strong> : BMW iX3 Neue Klasse. 805 km, tu fais Paris-Marseille-Paris sans recharger. Le roi des longs courriers.
<strong>Pour le jeune actif qui veut le meilleur rapport qualite-prix</strong> : Tesla Model 3 Highland. 702 km pour le prix d'une Megane thermique. C'est un no-brainer.
<strong>Pour l'esthète qui aime l'originalite</strong> : Hyundai IONIQ 6. Tu croises personne dans la rue, et tu fais 614 km avec une consommation de moineau.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Croire que l'autonomie WLTP est l'autonomie reelle</strong> : Sur autoroute a 130 km/h, enleve 30%. La BMW fait 805 km WLTP mais 560 km reels a 130 km/h. Fais tes calculs.
<strong>Ignorer la vitesse de charge</strong> : Une grosse batterie qui charge lentement, c'est comme un reservoir de 100L avec un goulot de bouteille d'eau. La charge 800V change la donne.
<strong>Negliger le reseau de recharge</strong> : La meilleure autonomie du monde ne sert a rien si t'es dans une zone blanche de la recharge. Tesla garde un avantage colossal sur ce point.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que 805 km d'autonomie suffisent pour un Paris-Nice ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, la BMW iX3 Neue Klasse peut le faire sans recharger. C'est 905 km environ, donc tu arrives avec 5% de batterie et le sourire. Prevois juste une recharge en arrivant.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>La Tesla Model 3 Highland perd-elle beaucoup d'autonomie en hiver ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Compte 15-20% de perte par grand froid. Ses 702 km WLTP deviennent environ 560 km. La pompe a chaleur Tesla limite la casse mieux que la concurrence.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>La Hyundai IONIQ 6 charge-t-elle vraiment vite ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, architecture 800V, elle passe de 10 a 80% en 18 minutes sur une borne 350 kW. Le temps d'un cafe, et tu repars.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Quel est le cout au kilomètre de ces voitures ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Compte environ 2-3€/100 km a la maison (0,20€/kWh) et 7-10€/100 km sur borne rapide (0,60€/kWh). C'est 3 a 5 fois moins cher que le diesel.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Vaut-il mieux une grosse batterie ou une recharge rapide ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Les deux, mon capitaine. 800V + grosse batterie = le combo win. Sans les deux, tu passes ta vie aux bornes.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/voiture-electrique" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir toutes les voitures electriques →</Link>
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

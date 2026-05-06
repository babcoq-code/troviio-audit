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
            <Link href="/c/friteuse-air" className="hover:text-white transition-colors">Friteuse Air</Link>
            <span>/</span>
            <span className="text-white font-medium">Friteuse a air sans huile grande capacite : pour les vraies familles</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Friteuse a air sans huile grande capacite : pour les vraies familles</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Friteuse a air 8L+ pour nourrir toute la tribu sans se prendre la tete avec l'huile.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T’as une famille nombreuse, et t’en as marre de préparer des frites pour 6 personnes en 4 fournées ? T’es soit un parent en burn-out, soit quelqu’un qui a décidé que l’huile bouillante sur les doigts, c’était un truc de l’ancien monde. La friteuse à air « grande capacité » promet de cuire un poulet entier sans le cramer – mais attention, entre le modèle qui a la taille d’un grille-pain et celui qui ressemble à un petit micro-ondes, le choix est parfois aussi absurde que de prendre un SUV pour acheter une baguette.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Réponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Si tu veux l’essentiel sans te prendre la tête : prends un modèle de 8 à 10 litres pour une vraie famille de 4-6 personnes. Les meilleurs rapport qualité/prix sont chez Ninja et Philips, mais Cosori fait de l’œil au portefeuille. Recommandations : Ninja Foodi MAX Dual Zone (10L, environ 180€, deux paniers pour cuire frites et poulet en même temps), Philips Premium XXL (8L, 220€, fiable comme un couteau suisse), Cosori Pro II (8L, 120€, le petit budget qui tue).</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les critères importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- <strong>Capacité réelle</strong> : 8 litres, ce n’est pas 8 frites. Les fabricants gonflent les chiffres comme un influenceur son nombre d’abonnés. Vérifie les dimensions intérieures : si tu ne peux pas y glisser un poulet entier ou 1,5 kg de frites, c’est un grille-pain déguisé.
- <strong>Puissance et cuisson homogène</strong> : 1700W minimum, sinon tes nuggets seront moisis d’un côté et carbonisés de l’autre. Les modèles avec ventilation 360° ou double hélice sont les héros méconnus de la frite parfaite.
- <strong>Nettoyage</strong> : Les paniers anti-adhésifs qui passent au lave-vaisselle sont des licornes. Sinon, tu finis par gratter du gras comme un archéologue. Cherche des résistances accessibles – les coins morts, c’est le mal.
- <strong>Fonctions et bruit</strong> : Les préréglages « poulet » ou « frites » sont souvent inutiles, mais un mode « réchauffe » est plus utile que ta belle-mère. Le bruit ? Un bon modèle fait moins de 55 dB. Au-dessus, c’est un aspirateur en pleine crise.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre sélection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Ninja Foodi MAX Dual Zone AF400EU</strong> (10L, 180€) : Le roi de la famille nombreuse. Deux paniers indépendants – tu peux cuire des frites et des ailes de poulet en même temps sans qu’elles se battent pour la place. C’est comme avoir deux fours dans un seul, mais sans le look années 80. Le seul défaut : il prend autant de place qu’un micro-ondes, donc prépare-toi à ranger ta bouilloire. Idéal pour les repas de 6 personnes où tout le monde veut manger chaud en même temps.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Cosori Pro II CP158-AF</strong> (8L, 120€) : Le rapport qualité/prix qui te fait sourire en caisse. 8 litres, 1700W, une cuisson uniforme grâce à sa technologie « QuickHeat » – tu oublies les zones crues. Il a 12 préréglages, mais franchement, tu n’utiliseras que « frites » et « poulet ». Le petit plus : une fonction de mémoire pour tes recettes perso, comme si la machine te connaissait mieux que ton ex. Pour 120€, c’est le deal du siècle.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Philips Premium XXL HD9860/90</strong> (8L, 220€) : L’option premium pour ceux qui veulent du matos qui dure plus longtemps que leur dernier régime. Technologie « Fat Removal » qui réduit la graisse des aliments – parfait si tu fais semblant de manger sain. Il chauffe en 30 secondes et cuit 1,5 kg de frites en 20 minutes. Le prix pique, mais tu l’achètes une fois et tu le lègues à tes petits-enfants.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modèle selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- <strong>La famille de 6 avec des ados affamés</strong> : Ninja Foodi MAX Dual Zone. Les paniers jumeaux évitent les bagarres pour la dernière aile de poulet.
- <strong>Le couple qui veut cuisiner sans se ruiner</strong> : Cosori Pro II. Assez pour deux, avec une marge pour les restes du lendemain.
- <strong>Le flexeur qui veut impressionner ses invités</strong> : Philips Premium XXL. Le design et la fiabilité justifient le prix – et tu peux frimer avec la fonction « roast » pour le dimanche.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs à éviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">1. <strong>Acheter un modèle de 5 litres pour 5 personnes</strong> : Tu vas faire 2 fournées, comme avec un four classique. La friteuse à air « grande capacité » commence à 8 litres. 5 litres, c’est pour les célibataires ou les hamsters.
2. <strong>Croire que tous les paniers anti-adhésifs passent au lave-vaisselle</strong> : Beaucoup se dégradent au bout de 3 cycles. Lis les avis comme si c’était le texte d’une loi – la durabilité, ça se vérifie.
3. <strong>Ignorer le bruit</strong> : Un modèle à 60 dB, c’est un sèche-cheveux en pleine nuit. Teste-le en magasin ou regarde les specs. Sinon, tu vas détester la cuisine.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions fréquentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Peut-on vraiment cuire un poulet entier dans une friteuse à air ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Oui, si la capacité est de 8 litres ou plus. Mais prépare-toi à un poulet un peu plus sec qu’au four – c’est le prix de la rapidité. Un peu de beurre sur la peau et ça passe.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Les frites sont-elles aussi bonnes qu’à la friteuse à huile ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Non, mais tu peux t’approcher à 90% si tu les badigeonnes d’huile avant. Sinon, c’est un snack dépressif.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que ça consomme beaucoup d’électricité ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Entre 1500 et 1800W, donc un peu moins qu’un four. Mais si tu fais 3 fournées par jour, ton compteur va pleurer.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Les paniers passent-ils au lave-vaisselle ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Seulement si le fabricant le dit – et même là, parfois ça se décolle. Mieux vaut laver à la main avec une éponge douce.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il préchauffer l’appareil ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Oui, 3 à 5 minutes. C’est comme le café : si tu sautes cette étape, les résultats sont décevants. Et non, ton micro-ondes ne fait pas la même chose.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/friteuse-air" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits &rarr;</Link>
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Top 3 Troviio</Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
          </div>
        </div>

      </section>

      {/* Disclaimer */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiqués sont susceptibles de varier. Troviio participe au Programme d'Associés d'Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}

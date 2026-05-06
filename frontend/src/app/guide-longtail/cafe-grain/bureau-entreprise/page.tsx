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
            <Link href="/c/cafe-grain" className="hover:text-white transition-colors">Cafe Grain</Link>
            <span>/</span>
            <span className="text-white font-medium">Machine cafe grain pour bureau et entreprise : le guide pro 2026</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Machine cafe grain pour bureau et entreprise : le guide pro 2026</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Une machine a cafe qui tient 40 cafés par jour sans faire grincer les dents des comptables.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T’as décidé d’équiper ton bureau d’une machine à café grain pour éviter que tes collègues finissent la journée en mode zombie après le troisième café soluble ? Bonne idée. Mais attention : une machine pro mal choisie, c’est comme recruter un stagiaire pour gérer la compta – ça coûte cher et ça finit en larmes. On va t’aider à dégoter la bête qui fera de tes employés des machines à productivité (et à râleries, mais ça, c’est bonus). Accroche-toi, on va parler pression, mouture et budget sans te faire un PowerPoint.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Réponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Si t’as la patience d’un poisson rouge, voici le top 3 : une machine robuste pour 10-15 têtes, un modèle compact pour les petites équipes, et un mastodonte pour les grosses structures. Les prix oscillent entre 1 000 et 4 000 €. Mon conseil : prends une machine avec service après-vente intégré, parce que tes collègues vont la martyriser.
- <strong>Jura Giga 10</strong> – 2 500 € (la Rolls des grains)
- <strong>De’Longhi Dinamica ECAM 350.70.B</strong> – 1 200 € (le bon plan pour 5-8 personnes)
- <strong>Saeco Xelsis</strong> – 3 200 € (pour les bureaux qui veulent du café à l’infini)</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les critères importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>La capacité du réservoir</strong> : tu crois que tes collègues vont boire un café par jour ? Tu vis dans un monde parallèle. Compte au moins 2 litres et un réservoir à grains de 500 g pour éviter les recharges toutes les 30 minutes. Sinon, tu vas passer ta journée à écouter "Ah, elle est vide, la machine ?" – spoiler : oui, et tu vas péter un câble.

<strong>La vitesse et le silence</strong> : une machine qui met 2 minutes à faire un expresso en plein open space, c’est le bruit de fond parfait pour les disputes. Cherche un modèle avec un broyeur silencieux (moins de 60 dB, c’est l’idéal) et un temps de chauffe sous les 30 secondes. Sinon, tes collègues vont finir par boire du filtre à la machine à eau chaude, et là, c’est le chaos.

<strong>Le système de vapeur</strong> : si t’as des amateurs de cappuccino au bureau (et t’en as forcément un qui se prend pour un barista), vérifie que la buse vapeur est facile à nettoyer. Un mousseur intégré, c’est bien, mais un mousseur automatique qui se nettoie tout seul, c’est le Graal. Sinon, tu vas retrouver des traces de lait caillé dans les recoins – c’est pas appétissant et ça attire les fourmis.

<strong>L’entretien</strong> : un bureau, c’est un nid à saletés. Des machines avec cycle de détartrage automatique et des pièces amovibles qui passent au lave-vaisselle, c’est la différence entre "je m’en occupe" et "j’ai abandonné l’idée de la nettoyer". Et les filtres à eau, c’est pas optionnel : sans, tu vas avoir un café qui a le goût de ton robinet.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre sélection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Jura Giga 10</strong> – la machine qui te fait oublier que t’es dans un bureau. À 2 500 €, c’est le choix du patron qui veut montrer qui est le boss (et qui a un budget). Avec son double broyeur (pour passer du grain au moulu sans juron), son écran tactile digne d’un vaisseau spatial, et sa capacité à servir deux tasses à la fois, c’est la solution pour les équipes de 10-15 personnes. En plus, elle se nettoie toute seule – tu peux la laisser faire et retourner à tes réunions inutiles. Seul inconvénient : si t’as des stagiaires, ils vont passer leur temps à mater les lumières.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>De’Longhi Dinamica ECAM 350.70.B</strong> – le choix du pragmatique. À 1 200 €, c’est le rapport qualité/prix qui fait kiffer les comptables. 5-8 personnes, un réservoir de 2 L, une buse vapeur qui fait des micro-mousses dignes d’un barista débutant, et une interface simple : pas besoin d’un doctorat pour l’allumer. Parfait pour les start-ups ou les petites boîtes où le budget est serré mais où on refuse de boire du Nescafé. Le seul bémol : si t’as un collègue qui commande 5 cafés allongés par jour, prépare-toi à la recharger souvent.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Saeco Xelsis</strong> – pour les bureaux qui veulent du café de compète sans payer un SMIC. À 3 200 €, c’est l’option premium pour les grosses équipes (15-20 personnes). Un réservoir de 2,5 L, un broyeur céramique qui ne fait pas de bruit de tracteur, et une mémoire des profils (oui, tu peux sauvegarder tes réglages de café comme un compte Spotify). L’entretien est automatique, mais attention : si t’as un collègue qui aime les doubles ristretto avec mousse de soja, il va falloir qu’il lise le manuel. Un conseil : investis dans un contrat de maintenance, parce que tes collègues vont la traiter comme un robot de combat.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modèle selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Profil 1 : Le patron cool</strong> – T’es le chef d’une petite PME de 8 personnes, t’aimes le café mais t’as pas le temps de jouer au barista. Va sur la <strong>De’Longhi Dinamica ECAM 350.70.B</strong>. Simple, fiable, pas trop chère. Et si un collègue râle, dis-lui qu’il peut aller au Starbucks.

<strong>Profil 2 : La boîte en croissance</strong> – 15 employés, des réunions à la chaîne, et t’as un gars qui commande un café longue durée toutes les 10 minutes. Prends la <strong>Jura Giga 10</strong>. Robuste, rapide, et elle encaisse les pics de consommation sans tousser.

<strong>Profil 3 : Le grand groupe</strong> – 20-30 têtes, budget confortable, et t’as un service RH qui veut un café digne de "The Office". La <strong>Saeco Xelsis</strong> est ton amie. Multi-options, entretien automatique, et si t’as un collègue qui se prend pour un sommelier du café, il va être content.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs à éviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Erreur 1 : Choisir une machine "personnelle" pour le bureau</strong> – Non, ta Senseo du garage ne tiendra pas le choc. Les machines domestiques sont faites pour 2 tasses par jour, pas pour les 15 shots de caféine de la compta. Résultat : elle rend l’âme en 3 mois et tu te retrouves à boire du filtre instantané. Ça coûte plus cher à long terme.

<strong>Erreur 2 : Négliger l’entretien</strong> – "Ah, on nettoiera plus tard." Spoiler : tu vas jamais le faire. Les machines à grain pros, sans entretien, c’est le goût de café rance et des pannes à 500 €. Prends un modèle avec cycle automatique ou forme un stagiaire à la maintenance (et menace-le de lui supprimer son café).

<strong>Erreur 3 : Acheter sans tester avec les collègues</strong> – T’as pris une machine qui fait que des ristrettos ? Bon courage pour convaincre le responsable marketing, amateur de long coffee. Les machines avec plusieurs profils de boisson (latte, cappuccino, allongé) sont un must. Sinon, prépare-toi à des réunions houleuses autour de la machine.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions fréquentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Combien de tasses par jour une machine pro peut-elle encaisser ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Entre 50 et 100 tasses, selon le modèle. Mais si tes collègues en boivent 200, c’est qu’ils ont un problème (ou une deadline). Prends une machine avec un réservoir large pour éviter les pauses recharge.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que je dois payer un abonnement pour les grains ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, sauf si tu prends un modèle connecté qui te facture le café à distance – mais ça, c’est du vol. T’achètes en vrac et tu fais le plein.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>C’est vrai que les machines à grain font moins de bruit que les dosettes ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, sauf si t’as une machine à broyeur bruyant. Regarde les décibels (moins de 60 dB, c’est safe). Sinon, tes collègues vont penser que t’as un tracteur dans l’open space.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je utiliser du café moulu si je suis à court de grains ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais certaines machines ont un compartiment dédié. Vérifie avant d’acheter, sinon tu vas devoir moudre avec un marteau – pas pratique.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Quel budget prévoir pour l’entretien ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Compte 100-200 € par an pour les pastilles de détartrage, filtres et graisses. Mais si t’as un contrat de maintenance, c’est 300-500 € – mais ça évite les crises cardiaques quand elle tombe en panne.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/cafe-grain" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits &rarr;</Link>
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

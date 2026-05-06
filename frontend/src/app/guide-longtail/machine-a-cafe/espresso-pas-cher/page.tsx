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
            <Link href="/c/machine-a-cafe" className="hover:text-white transition-colors">Machine A Cafe</Link>
            <span>/</span>
            <span className="text-white font-medium">Machine a espresso pas chere : le guide pour boire bon sans se ruiner</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d&apos;achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Machine a espresso pas chere : le guide pour boire bon sans se ruiner</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Tu veux un vrai espresso sans vendre un organe ? Les meilleures machines a espresso abordables.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T’as craqué pour une machine à espresso à 50 balles sur Amazon, et maintenant ton café a le goût de l’eau de vaisselle que ta mère oublie de vider depuis 2003 ? Relax, on est là. Tu veux boire un vrai espresso sans vendre un rein ni impressionner ton hipster de voisin ? Spoiler : c’est possible. Mais attention, le marché des machines pas chères, c’est un peu comme Tinder : y’a des perles rares, mais surtout des arnaques qui te promettent la lune et te filent un café dégueulasse avec un bruit de tracteur. Prêt à sortir du cercle des victimes ? On déchire le voile, mais avec le sourire.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">R&eacute;ponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Si t’as pas le temps : oublie les machines à capsules premier prix (tu bois du plastique fondu), vise une manuelle ou une semi-automatique. Voici 3 choix solides : la **Delonghi Dedica EC680** (150€, compacte et classe), la **Sage Bambino Plus** (180€, latte art friendly même pour les manchots), ou la **Krups Nespresso Inissia** (80€, pour les pressés qui acceptent le compromis du goût). Précision : ces prix fluctuent comme ton humeur un lundi matin, vérifie avant d’acheter.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les crit&egrave;res importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le premier critère, c’est le **type de machine**. Les manuelles (comme la Flair Neo, 120€) te demandent de te lever, de moudre, de tasser – bref, un peu de sueur. Mais le goût ? Divin, comme un orgasme gustatif. Les semi-automatiques (Delonghi Dedica, Sage Bambino) sont le juste milieu : tu presses un bouton, la machine fait le reste, mais tu gardes le contrôle. Les automatiques à capsules (Nespresso) : pratiques comme un fast-food, mais t’auras jamais l’âme d’un barista.

Ensuite, la **pression**. 15 bars, c’est le minimum pour un espresso correct – les machines à 9 bars, c’est un peu comme un moteur de Twingo : ça fait le taf mais t’iras pas au GP. Au-delà de 15 bars (20 bars... 30 bars ?) c’est du marketing : ton café ne sera pas mieux, juste ta machine fera plus de bruit. Le groupe chauffe aussi : si t’as un thermobloc en inox (comme sur la Sage Bambino), c’est top ; le plastique, c’est pour les jouets.

Dernier point : l’**entretien**. Une machine pas chère peut vite devenir un calvaire si tu dois la détartrer avec une pince à épiler et un vœu. Vise les modèles avec un chauffe-eau amovible ou un système anti-calcaire. Sinon, ton café aura un arrière-goût de « j’ai oublié de nettoyer depuis 2021 ».</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre s&eacute;lection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Sage Bambino Plus** (180€) – c’est le petit poney qui rugit comme un lion. Ultra compacte, chauffe en 3 secondes (oui, plus rapide que ton micro-ondes), et elle a un mousseur à lait automatique qui ne transforme pas ton lait en écume de marais. Le goût ? Propre, intense, avec une crema digne d’un barista de Naples. Le seul défaut : elle te donnera envie d’acheter un tamper en acier inoxydable à 50 balles – un glissement de terrain financier inévitable.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Delonghi Dedica EC680** (150€) – le choix du sage. Design over-9000 (fine comme un MacBook), pression 15 bars, et un système de filtrage qui fait des merveilles avec des grains bas de gamme. Elle est un peu bruyante (comme un chat qui miaule à 6h du mat), mais pour le prix, elle te fait des espresso corrects même si t’as les doigts en caoutchouc. Bonus : tu peux la mettre dans une small kitchen ou la ranger dans un tiroir (si t’es un psychopathe).</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Krups Nespresso Inissia** (80€) – pour les pressés qui veulent un café acceptable sans se prendre la tête. C’est la machine à capsules la moins pire du marché. Le café ? Pas mauvais, mais pas transcendant – c’est un peu comme écouter du Justin Bieber : ça passe mais t’assumes pas. Prix d’entrée de gamme, et les capsules sont abordables (0,35€ pièce). Idéale pour le bureau ou si t’es en colocation avec des gens qui ne savent pas rincer une tasse.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel mod&egrave;le selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Le novice qui veut juste un café le matin** : prends la Krups Nespresso Inissia. Tu vas pas t’embêter, ça fait le café, fini. Mais si tu veux un jour faire le malin devant tes potes, achète un mousseur à lait séparé.
- **Le geek du goût qui a un budget serré** : la Delonghi Dedica EC680. Tu peux expérimenter avec des grains, apprendre le tassage, et te la péter en mode « j’ai une vraie machine ». Par contre, prévois un moulin – le café moulu du supermarché, c’est comme les larmes de ton ex : amer et triste.
- **Le barista en herbe qui rêve d’un latte Art** : la Sage Bambino Plus. T’auras la classe, le lait velouté, et tes amis te supplieront de leur faire des cappuccinos. Mais attention : tu deviendras le mec relou qui parle de « pressure profiling » à chaque dîner.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs &agrave; &eacute;viter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">1. **Acheter une machine à 50€ sur un site chinois** : le café aura le goût de la colle Uhu, et la machine explosera au bout de 3 utilisations. Investis 20 balles de plus, ta dignité et ton palais te remercieront.
2. **Utiliser du café moulu du supermarché** : tu peux avoir la meilleure machine du monde, si tu mets de la poudre de merde, ça reste de la poudre de merde. Un bon moulin à 30€ + des grains, c’est le duo gagnant.
3. **Oublier le détartrage** : après 3 mois, ta machine va cracher un liquide brun qui ressemble à du café mais qui est en fait une fusion de calcaire et de regrets. Suis les instructions ou pleure.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions fr&eacute;quentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Quelle est la différence entre 9 bars et 15 bars ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Un peu comme entre une voiture à 2 chevaux et une à 4 : faisable, mais t’iras moins vite et t’auras moins de puissance. 15 bars, c’est le minimum pour un espresso correct.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je utiliser du café en grains dans une machine à capsules ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Techniquement oui, mais il faut un adaptateur, et c’est comme essayer de mettre un pneu de Formule 1 sur une Twingo : ça marche pas, et t’auras l’air bête.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que le mousseur à lait intégré est utile ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Si tu veux du lait chaud pour un café au lait, oui. Si tu veux faire un latte art, prends un mousseur séparé – ceux intégrés sont souvent des bâtons à neige qui transforment ton lait en écume de bain.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Combien de temps dure une machine à espresso pas chère ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Si t’achètes une Krups Inissia, 2-3 ans si tu la détartres. Si t’achètes une machine à 40€, 6 mois – et elle finira dans un placard avec une étiquette « à réparer un jour ».</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que je peux faire un espresso sans moudre le café ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Oui, avec du café moulu pré-emballé. Mais c’est comme manger des pâtes instantanées : ça fait le boulot mais t’auras jamais le goût d’un vrai plat. Pour un espresso, moudre juste avant, c’est le secret.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/machine-a-cafe" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits &rarr;</Link>
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Top 3 Troviio</Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
          </div>
        </div>

      </section>

      {/* Disclaimer */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiqu&eacute;s sont susceptibles de varier. Troviio participe au Programme d&apos;Associ&eacute;s d&apos;Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}

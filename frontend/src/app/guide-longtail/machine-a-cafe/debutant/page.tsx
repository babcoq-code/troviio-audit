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
            <span className="text-white font-medium">Machine a cafe grain pour debutant : laquelle choisir en 2026 ?</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Machine a cafe grain pour debutant : laquelle choisir en 2026 ?</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Premiere machine expresso broyeur ? Les plus simples pour se lancer sans stress.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T’es un adulte, tu bosses, tu paies des impôts, et pourtant tu bois encore du café soluble qui a le goût d’une chaussette humide ? En 2026, il est temps de passer à la machine à grains, même si tu penses que ta seule compétence en cuisine c’est de réchauffer un plat surgelé. Pas de panique : on va te guider sans te faire pleurer comme un fan de Star Ac’ devant une élimination. Prépare-toi à devenir le barista de ton salon, sans le chignon et le jugement.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">☕ Meilleur rapport qualité | Delonghi Magnifica (88/100) | Fiable, simple, pour les vrais adultes paresseux.
🤖 Ultra-connecté | Jura E8 (95/100) | La Rolls pour les geeks amateurs de café.
🎯 Petit budget | Krupp YY8161 (82/100) | Pas cher, mais fait le café sans drama.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Facilité d’utilisation</strong> : Si tu as besoin d’un diplôme en robotique, passe ton chemin. Choisis un modèle avec écran intuitif.
<strong>Broyeur intégré</strong> : Un moulin céramique, pas en plastique, sinon ton café sentira le jouet cassé.
<strong>Nettoyage</strong> : Si la machine te demande de démonter 15 pièces, tu finiras par la laisser moisir. Préfère les cycles automatiques.
<strong>Réservoir d’eau</strong> : Assez grand pour ne pas remplir tous les matins comme un hamster hydraté.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Delonghi Magnifica :</strong> La copine parfaite pour ton premier amour caféiné. Pas de fioritures, pas de bugs, juste un expresso qui te réveille comme un coup de pied aux fesses. Pour qui ? Le flemmard ambitieux qui veut un bon café sans lire le manuel. À éviter si tu rêves de faire mousser du lait comme un hipster barbu.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Jura E8 :</strong> Le Tesla des machines à café : beau, connecté, et tellement cher que tu pleures dans ton mug. Pour qui ? Le geek qui veut contrôler sa dose via une app et impressionner ses potes. À éviter si tu as un budget de stagiaire, ou si tu préfères un café qui ne nécessite pas une mise à jour firmware.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Krupp YY8161 :</strong> Le compromis de la dernière chance pour ceux qui veulent un grain sans se ruiner. Il fait son boulot, mais gare au bruit : ça ressemble à un marteau-piqueur en mode doux. Pour qui ? L’étudiant fauché ou le colocataire qui veut survivre à ses partiels. À éviter si tu vis dans un studio avec des murs en carton.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour le flemmard assumé</strong> : Prends une Delonghi Magnifica, elle fait tout toute seule comme un robot domestique.
<strong>Pour l’influenceur en herbe</strong> : Jura E8 pour des lattes Instagrammables et un compte en banque vide.
<strong>Pour le survivant du budget</strong> : Krupp YY8161, le café de l’espoir sans la faillite.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Acheter une machine trop chère</strong> : Tu finiras par boire du Nespresso par culpabilité, comme un hypocrite.
<strong>Ignorer l’entretien</strong> : Si tu nettoies pas, ton café aura le goût d’un fond de casserole oublié.
<strong>Choisir sans test</strong> : Un broyeur bruyant, c’est comme un voisin qui perce à 7h du mat’ : insupportable.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il un broyeur céramique ou en métal ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Céramique, plus silencieux et durable. Le métal, c’est pour les amateurs de bruit de grincement.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je utiliser du café moulu classique ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais alors pourquoi t’as acheté une machine à grains, Einstein ?</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Les machines connectées valent-elles le coup ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Si tu aimes les mises à jour qui plantent ton café, fonce.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Combien de tasses par jour avant de devoir nettoyer ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Environ 10, sinon la machine fait la gueule comme un ado privé de Wi-Fi.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que ça fait des économies ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Au bout de 500 cafés, oui. Avant, c’est juste un prétexte pour te sentir supérieur.</p>
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

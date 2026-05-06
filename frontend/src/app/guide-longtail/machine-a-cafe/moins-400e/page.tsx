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
            <span className="text-white font-medium">Machine a cafe grain a moins de 400 euros : meilleur rapport qualite-prix</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d&apos;achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Machine a cafe grain a moins de 400 euros : meilleur rapport qualite-prix</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Expresso broyeur pour moins de 400 euros, c'est possible. Selection des meilleurs.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Alors comme ça, tu veux te réveiller avec l’odeur divine d’un café fraîchement moulu sans vendre un rein ? La machine à grain à moins de 400€, c’est le Saint Graal du barista du dimanche, mais attention à ne pas finir avec un percolateur qui fait plus de bruit qu’un Monday de téléréalité. Entre les promesses marketing et la réalité d’un marc de café aussi sec qu’une blague de ton oncle, on t’évite le drame. Prêt à devenir le roi du mousseux sans te ruiner ? Accroche ta tasse, on déchiffre le code des meilleures affaires.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">☕ Philharmonique | Delonghi Magnifica S (88/100) | Bon café, compact, mais un peu lente.
🤖 Barista de bureau | Krups EA8108 (85/100) | Simple, rapide, bruit de tracteur au réveil.
💸 Budget serré | Melitta Solo (82/100) | Fiable, pas de fioritures, café correct.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Broyeur** : Meule conique ou plate ? La meule conique, c'est le Louis de Funès du café : précis et durable.
**Pression** : 15 bars minimum, sinon ton expresso aura la force d'un chaton endormi.
**Facilité d'entretien** : Si tu dois démonter un Rubik's Cube pour nettoyer, fuis. La simplicité, c'est la vie.
**Bruit** : Un niveau sonore acceptable, sinon tes voisins croiront que tu passes l'aspirateur à 6h du matin.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Delonghi Magnifica S** : Le tonton gâteau des machines à grain. Fiable, compacte, elle te sort un expresso correct sans te prendre la tête. Parfaite pour le mec qui veut un café sympa sans devenir un expert en torréfaction. À éviter si tu es du genre à pleurer sur un mauvais dosage de lait ou si tu rêves de faire des dessins dans la mousse. Elle est là pour le café, pas pour l'art.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Krups EA8108** : La machine de bureau qui se prend pour une Ferrari. Simple d'utilisation, elle crache un café correct avec une rapidité suspecte. Son défaut ? Un bruit digne d'un moteur de 2CV qui démarre sous la pluie. À prendre si tu es matinal et sourd ; à fuir si tu vis en coloc et que la paix est une priorité. Elle fait le job, mais en mode rock'n'roll.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Melitta Solo** : Le café low-cost qui assume. Pas de bling-bling, pas de gadgets inutiles, juste un bon café sans prise de tête. Elle est parfaite pour le solitaire qui boit son noir sans chichis. À éviter si tu es un hipster de la torréfaction ou si tu veux impressionner ta belle-mère avec des boissons lactées. C’est la machine du mec pragmatique qui sait qu’un café, c’est avant tout du café.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Pour le lève-tôt pressé** : Delonghi Magnifica S, fiable et rapide pour ton matin de loser.
**Pour le bricoleur du dimanche** : Krups EA8108, simple mais bruyante, pour tester sans stress.
**Pour l'étudiant endetté** : Melitta Solo, le café correct sans vendre ton âme au crédit.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Ignorer le bruit** : Tu crois que le silence est d’or ? Krups en mode réveil, c’est le heavy metal.
**Miser sur les "programmes"** : 15 options, tu n'en utiliseras que deux : expresso et allongé.
**Négliger l'entretien** : Une machine crade, c'est un café au goût de vieux chaussette, même en grain.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je faire un cappuccino avec une machine à grain à 400€ ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, si tu aimes la mousse de lait tiède, mais pour un vrai, prends une buse vapeur séparée.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>La Delonghi Magnifica S est-elle facile à nettoyer ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, elle se démonte en deux mouvements, même pour un manche de casserole comme toi.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Le bruit de la Krups est-il rédhibitoire ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Seulement si tu vis avec des chats ou un babyphone. Sinon, c’est un réveil gratuit.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>La Melitta Solo fait-elle du café filtre ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, que de l’expresso. Pour un filtre, prends une machine à dosettes et pleure en silence.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il un broyeur séparé pour les grains ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, toutes ces machines intègrent un broyeur. Tu es en 2024, pas en 1984.</p>
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
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiques sont susceptibles de varier. Troviio participe au Programme d&apos;Associes d&apos;Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}

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
            <Link href="/c/friteuse-air" className="hover:text-white transition-colors">Friteuse A Air</Link>
            <span>/</span>
            <span className="text-white font-medium">Friteuse a air pour etudiant ou studio : petit budget, petit espace</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Friteuse a air pour etudiant ou studio : petit budget, petit espace</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Studio 20m2, budget serre ? Friteuses a air compactes 3-4L pour manger sain.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Ah, la vie d’étudiant ou de jeune actif en studio : entre les nouilles instantanées qui collent au palais et l’odeur de friture qui imprègne ton unique t-shirt propre, tu te dis qu’il est temps de passer à la friteuse à air. Mais attention, petit budget et mini-cuisine obligent. Ne t’inquiète pas, on va dénicher l’appareil qui te fera des frites croustillantes sans te ruiner ni transformer ton studio en sauna. Prépare-toi à dire adieu aux micro-ondes tristes et bonjour à la croûte dorée façon MC Do, version chic. Let’s go, jeune padawan de la friture sans huile !</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🍟 Petit Budget | Cosori Pro LE (85/100) | Silencieux, compact, frites en 12 min.
🏠 Petit Espace | Ninja Air Fryer Max (88/100) | Empilable, facile à ranger.
💥 Rapport Qualité | Philips Essential (90/100) | Chauffe mieux que ton ex.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Capacité idéale</strong> : 2-3 litres max, pour une portion de frites sans envahir ton plan de travail.
<strong>Nettoyage facile</strong> : Panier antiadhésif ou vaisselle compatible lave-vaisselle, sinon adieu tes soirées.
<strong>Consommation électrique</strong> : Moins de 1500W pour éviter de faire sauter le disjoncteur de ton studio.
<strong>Silence de fonctionnement</strong> : Un bourdonnement discret, pas un bruit de tracteur qui réveille les voisins.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Cosori Pro LE</strong> – Le roi du petit budget. Pour toi, l’étudiant qui préfère dépenser son argent en bières qu’en électroménager. Il fait des frites croustillantes, chauffe vite, et tient dans un placard Ikea. À éviter si tu as une coloc de 4 personnes ou si tu veux cuire un poulet entier – là, c’est plutôt un four ou une pizzeria de quartier.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Ninja Air Fryer Max</strong> – La ninja du studio. Pour toi, le minimaliste qui veut ranger son appareil après usage sans pleurer. Design empilable, panier qui se glisse partout, et cuisson uniforme. À éviter si tu es allergique aux marques hype ou si tu comptes faire des frites pour toute la coloc – c’est le gadget solo, pas le banquet.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Philips Essential</strong> – Le vieux sage de la friture. Pour toi, l’étudiant qui veut du sérieux sans prise de tête. Chauffe comme une maman italienne, facile à nettoyer, et discret. À éviter si ton budget est ultra serré (prix un poil plus élevé) ou si tu cherches des options bluetooth – ici, on fait des frites, pas du code.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour l'étudiant fauché</strong> : Cosori Pro LE – frites correctes sans te ruiner, idéal pour survivre en mode Nouilles+.
<strong>Pour le colocataire discret</strong> : Ninja Air Fryer Max – se range comme un ninja, parfait pour studio exigu.
<strong>Pour le foodie en herbe</strong> : Philips Essential – cuisson homogène, pour impressionner tes crush sans cramer ton chez-toi.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Acheter trop grand</strong> : Une friteuse de 5 litres dans un studio, c’est comme un frigo dans une Smart.
<strong>Ignorer le nettoyage</strong> : Un panier non antiadhésif, c’est la corvée du dimanche qui te pourrit la vie.
<strong>Choisir trop bruyant</strong> : Un modèle qui ronronne fort, adieu les révisions et les séances Netflix.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que ça sent la friture ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, un peu, mais moins qu’un plongeon dans l’huile bouillante.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je cuire des nuggets surgelés ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, en 10 minutes top chrono, comme au fast-food mais sans la culpabilité.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que ça consomme beaucoup d’électricité ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Moins qu’un four, mais évite de le laisser allumé pour chauffer ton studio.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Comment nettoyer sans se prendre la tête ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Panier antiadhésif + un coup d’éponge magique, et c’est fait.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que ça tient dans un placard Ikea ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, si tu prends un modèle compact comme le Cosori ou le Ninja.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/friteuse-air" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits →</Link>
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

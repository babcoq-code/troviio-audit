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
            <span className="text-white font-medium">Friteuse a air pour famille de 4 personnes : quel modele choisir ?</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d&apos;achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Friteuse a air pour famille de 4 personnes : quel modele choisir ?</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Vous etes 4 a la maison ? Les meilleures friteuses a air de 6L et plus.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Tu viens de découvrir que ta friteuse à air est devenue un aspirateur à calorie vivant, capable de transformer quatre portions de frites congelées en une seule galette carbonisée. Le dilemme : ta famille de quatre (dont un ado qui mange comme un trou noir) réclame du croustillant sans le bain d’huile. Les modèles pullulent, des usines à gaz aux gadgets inutiles. Entre le Airfryer qui fait le café et celui qui te rappelle ta dernière rupture, comment choisir sans finir en larmes devant une vidéo de recettes ratées ? Accroche-toi, on va démêler ce bordel technologique avec sarcasme et références douteuses (oui, même Dora l’exploratrice aurait du mal là-dedans).</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🍟 Panier familial | Ninja Foodi 10-en-1 (88/100) | Le couteau suisse du airfryer, mais sans la lame.
🐔 Poulet geant | Philips XXL Combi (85/100) | Pour les familles qui mangent comme des ogres grecs.
🎨 Design gamin | Cosori Dual Blaze (82/100) | Fait des frites et des memes, mais en silence.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Capacite** : Minimum 5,5 litres pour nourrir 4 affames sans faire cuire en plusieurs fournees.
**Puissance** : 1700W+ pour que tes nuggets soient croustillants avant que ton ado finisse son steak.
**Nettoyage** : Elements amovibles au lave-vaisselle, sinon tu vas pleurer comme dans "Le Chagrin et la Pitie".
**Programmes** : Au moins 8 presets, parce que tu sais pas cuire un oeuf sans tuto YouTube.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Ninja Foodi 10-en-1** : Le choix du chef (ou du parent qui veut impressionner ses beaux-parents). Il fait tout : frites, pizza, gateau, et meme un roti qui sauve ton dimanche soir. Mais evite si tes enfants sont des picky eaters style "je veux que des pâtes à la bolo", car ses 10 fonctions te rendront tyran. Pour les familles qui veulent un airfryer capable de dompter l’ennui culinaire.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Philips XXL Combi** : Le mastodonte qui te rappelle que ta cuisine est trop petite. Il croustille les frites comme un chef et peut cuire un poulet entier, mais son format te force à jouer au Tetris avec tes placards. À éviter si tu vis dans un studio parisien ou si ton plan de travail est déjà encombré par une machine à pain inutile. Pour ceux qui ont de la place et l’amour du gras.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Cosori Dual Blaze** : Le hipster des airfryers, design sobre et fonctions cools (maintien au chaud, prechauffage). Parfait pour les familles qui aiment la précision, mais son panier est un peu petit pour 4 grosses portions de wings. Évite si tes ados ont faim juste après le dîner, car tu devras relancer une fournée en pleine partie de FIFA. Pour les contrôle-freaks de la cuisson.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Pour la famille nombreuse qui commande souvent Deliveroo** : Prends le Ninja Foodi, il te fera oublier que tu sais pas cuisiner.
**Pour les parents eco-responsables qui trient leurs dechets** : Choisis le Philips XXL, il consomme moins d'énergie qu’un chargeur d’iPhone.
**Pour les ados qui veulent impressionner sur TikTok** : Le Cosori Dual Blaze, avec son rendu digne d’un food vlog.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Acheter le moins cher** : Un modele a 40€ te fera des frites molles, comme ton ex.
**Oublier la taille du panier** : Un petit airfryer pour 4 personnes, c’est comme un lit pour une famille de hobbits.
**Ignorer le bruit** : Certains modèles hurlent comme un moteur de Twingo ; verifie les decibels.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>La friteuse à air peut-elle vraiment remplacer un four ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais prépare-toi à des pizzas déformées et des gâteaux tout secs.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Combien de temps pour cuire des frites surgelées ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: 15 minutes à 200°C, soit le temps que ton ado finisse son chapitre de manga.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Les amovibles passent-ils au lave-vaisselle ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais verifie les instructions, sinon tu nettoies à la main en pleurant.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que ça sent la bouffe partout ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Moins qu’une friteuse classique, mais ton salon sentira encore le poulet rôti.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je cuire des aliments congelés ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, c’est le saint Graal des parents feignants.</p>
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
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiques sont susceptibles de varier. Troviio participe au Programme d&apos;Associes d&apos;Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}

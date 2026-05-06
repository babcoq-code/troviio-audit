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
            <Link href="/c/tv" className="hover:text-white transition-colors">Tv</Link>
            <span>/</span>
            <span className="text-white font-medium">TV OLED pour le sport et la coupe du monde 2026</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">TV OLED pour le sport et la coupe du monde 2026</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Voir le ballon filer sans flou ? Guide des meilleures TV sport : OLED 120Hz.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Tu veux regarder la Coupe du Monde 2026 sans avoir l’impression de vivre un match de foot en 144p sur un poste à mémoire de tubes ? Les TV OLED sont parfaites pour ne pas rater le moindre dribble, même si tu passes ton temps à insulter l’arbitre. Mais attention : entre les pixels qui claquent et les noirs profonds qui cachent mal ta honte de louper le penalty, faut pas se planter. On va t’aider à dégotter l’écran qui transformera tes soirées en stade VIP, sans te ruiner en snacks et en larmes.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🏆 Meilleur rapport qualité-prix | LG C4 OLED (92/100) | Noir profond, 120Hz, parfait pour le foot.
⚡ Roi du gaming et du sport | Samsung S95D OLED (95/100) | Luminosité de ouf, anti-reflet, zéro latence.
💸 Budget serré mais stylé | Sony Bravia XR A80L (88/100) | Processeur balèze, son immersif, bon compromis.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Taux de rafraîchissement</strong> : 120Hz minimum pour éviter les effets de flou sur les ballons qui fusent.
<strong>Anti-reflet</strong> : Indispensable si tu veux pas voir ta tête de dépit reflétée à chaque but encaissé.
<strong>Taille d’écran</strong> : 65 pouces minimum, sinon le hors-jeu sera aussi invisible que ton espoir de gagner un pari.
<strong>Processeur</strong> : Un bon upscaler pour que les rediffusions en 720p aient l’air de la 4K UHD.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le LG C4 OLED : le choix du sage. Il offre un noir si profond que tu croiras être dans le vestiaire après une défaite. Pour les fans qui veulent du 120Hz sans vendre leur rein. À éviter si tu tiens à ce que ta télé ne devienne pas le centre des disputes conjugales : sa brillance pourrait t’aveugler, mais pas autant que tes commentaires sur le jeu.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le Samsung S95D OLED : le roi des soirées sport. Son processeur Neo Quantum te fera oublier que ta connexion Wi-Fi rame. Idéal pour les gamers qui veulent aussi mater le match. À fuir si tu as une pièce trop lumineuse : ses reflets te rappelleront le pire de tes selfies après la troisième bière. Mais pour le stade à la maison, c’est la Rolls.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le Sony Bravia XR A80L : le malin qui fait des miracles. Son upscaler transforme les vieux matchs de Coupe du Monde en chef-d’œuvre. Parfait pour les puristes qui veulent du son et de l’image sans se prendre la tête. À éviter si tu es un geek de l’input lag : ses 120Hz sont cool, mais pas pour jouer en compétition. Pour le sport, c’est un bon plan.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour le fan qui mate en plein jour</strong> : Prends le Samsung S95D, ses anti-reflets sont aussi solides que tes excuses après un match nul.
<strong>Pour le streamer qui veut tout</strong> : Le LG C4, avec son HDMI 2.1, pour le foot et le gaming, sans concession.
<strong>Pour le réfractaire au changement</strong> : Le Sony Bravia, si tu veux une image proche de la perfection sans devoir apprendre le chinois technique.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Oublier le 120Hz</strong> : Tu verras le ballon se déplacer comme un escargot en PLS.
<strong>Ignorer l’anti-reflet</strong> : Ta télé deviendra miroir de tes émotions, surtout sur les buts encaissés.
<strong>Choisir trop petit</strong> : Les hors-jeu et les dribbles seront aussi clairs que le règlement du VAR.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Dois-je absolument un 120Hz pour le sport ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, sinon les actions rapides ressemblent à un film de Tarkovsky. C’est pas le moment de philosopher.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>La taille idéale pour une pièce de 20m² ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: 65 pouces minimum. Moins, tu regardes le match sur un timbre-poste, même en 4K.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>OLED ou QLED pour la lumière ambiante ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: OLED si tu mates le soir, QLED si tu es un hamster aveuglé par le soleil.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Le processeur est-il important pour le sport ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, pour l’upscaling des rediffusions. Sans ça, tu vois le bruit des pixels avant le but.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je utiliser une barre de son ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais attention aux retards. Rien de pire qu’un « But » qui arrive 0,5 seconde après l’image.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/tv" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits →</Link>
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

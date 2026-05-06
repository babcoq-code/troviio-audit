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
            <span className="text-white font-medium">TV OLED 120Hz pas chere pour PS5 et Xbox : guide budget 2026</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d&apos;achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">TV OLED 120Hz pas chere pour PS5 et Xbox : guide budget 2026</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">120Hz sur PS5 sans vendre un rein ? TV OLED 120Hz les moins cheres.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T’as une PS5 ou une Xbox, mais ta télé actuelle a plus de pixels qu’un Tamagotchi mort ? Pas de panique, on va te dégotter un écran OLED 120Hz sans vendre un rein sur le dark web. Le budget 2026, c’est le nouveau Far West : entre promesses marketing et lag assassins, faut pas tomber dans le piège. On a testé, on a rigolé (et pleuré), et voici le guide pour briller en 4K sans finir chez les pauvres. Prépare-toi à mater des jeux comme si t’étais dans Ready Player One… mais version IKEA. Let’s go, gamer !</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🖥️ Le Roi Budget | LG OLED B4 (87/100) | 120Hz natif, VRR, parfait pour les jeux.
🤖 Le Geek | Sony A95L (92/100) | HDR de ouf, mais prix qui pique.
🎮 Le Survivant | Hisense U8N (83/100) | Mini-LED pas cher, 144Hz, bon plan.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**OLED vs Mini-LED** : L’OLED offre noirs parfaits, mais risque de burn-in si tu joues 24h/24 à FIFA.
**120Hz Natif vs Upscalé** : Vérifie que le 120Hz est natif, pas un mirage marketing façon « café sans caféine ».
**HDMI 2.1** : Obligatoire pour VRR et ALLM, sinon ta PS5 pleure comme un ado privé de TikTok.
**Taille et Budget** : 55 pouces max pour 500-800€ ; ne cherche pas du 65 pouces à 300 balles, c’est une arnaque.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**LG OLED B4** : Le ninja discret des télés pas chères. 120Hz natif, VRR, et un prix qui fait sourire ton banquier. Parfait pour le joueur qui veut du piqué sans hypothéquer son chat. À éviter si tu es un puriste Sony qui jure que par le Dolby Vision et le design « premium » (spoiler : tu paieras deux fois plus). Pour les autres, c’est le Graal de 2026.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Sony A95L** : La Rolls des OLED, mais avec un prix qui sent le financement sur 10 ans. HDR époustouflant, idéal pour les cinéphiles qui veulent voir chaque pixel de The Last of Us. Mais à 1200€, ton portefeuille va saigner. À éviter si tu es fauché ou si tu préfères manger que jouer. Pour les riches hipsters du gaming, ça passe.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Hisense U8N** : Le caméléon qui défie les lois du marché. Mini-LED, 144Hz, et un prix qui défie toute logique. Les noirs sont presque parfaits, mais le HDR est un peu mou. Idéal pour le joueur qui veut de la performance sans se ruiner et qui supporte un menu télé buggé façon Windows 95. À éviter si tu es allergique aux compromis.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Pour le joueur compétitif** : LG OLED B4, 120Hz natif et VRR pour dominer en Call of.
**Pour le fan de solo avec budget serré** : Hisense U8N, bon rapport qualité/prix pour des graphismes solides.
**Pour le riche geek perfectionniste** : Sony A95L, la Rolls qui fait briller tes jeux et vider ton compte.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Acheter sans HDMI 2.1** : Ta PS5 en 4K 60Hz, c’est comme jouer à Tetris sur une Game Boy.
**Ignorer le burn-in** : Un écran allumé 10h/jour sur FIFA, adieu les pixels.
**Choisir 120Hz upscalé** : Le marketing ment, vérifie les specs techniques avant d’acheter.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que l’OLED brûle vraiment avec la PS5 ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, si tu joues 12h/jour à un jeu avec HUD fixe, préfère un Mini-LED.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>55 pouces, c’est assez pour une chambre ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais à 2 mètres, tu verras chaque pixel comme dans un film d’horreur.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Le 120Hz est utile pour les jeux solo ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, sauf si tu veux voir les cheveux de Lara Croft en 120 fps.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Hisense, c’est fiable ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Le rapport qualité/prix est bon, mais le service client est comme un boss de jeu : frustrant.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Vaut-il mieux attendre 2027 ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, les prix baissent, mais ta patience est comme une partie de Dark Souls : inutile.</p>
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
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiques sont susceptibles de varier. Troviio participe au Programme d&apos;Associes d&apos;Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}

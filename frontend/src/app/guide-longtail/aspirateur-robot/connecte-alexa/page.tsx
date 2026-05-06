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
            <Link href="/c/aspirateur-robot" className="hover:text-white transition-colors">Aspirateur Robot</Link>
            <span>/</span>
            <span className="text-white font-medium">Robot aspirateur connecte Alexa : le guide du geek propre</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d&apos;achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Robot aspirateur connecte Alexa : le guide du geek propre</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Commander son aspirateur a la voix en regardant Netflix ? Guide des robots compatibles Alexa et Google Home.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T’as craqué pour un aspirateur qui parle à Alexa ? T’es soit un geek assumé, soit quelqu’un qui veut impressionner son chat avec des ordres vocaux. Mais avant de transformer ton salon en plateau de "Terminator : le ménage", sache que tous les robots ne se valent pas. Certains sont plus lents qu’un téléchargement sous 56k, d’autres confondent ton tapis persan avec un champ de mines. Accroche-toi, on va trier le bon grain de l’ivraie (et des miettes de chips).</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">R&eacute;ponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Si t’as pas le temps de lire, voici le strict nécessaire : prends un robot avec lidar pour la cartographie, un bac à poussière auto-vidable si t’es feignant (on te jugera pas), et vérifie qu’il supporte bien Alexa (pas juste "compatible sur le papier").  
Ça te parle pas ? File directement vers :  
- **iRobot Roomba j7+** (le plus intelligent, environ 700€)  
- **Roborock S7 MaxV** (le meilleur rapport qualité/prix, environ 600€)  
- **Xiaomi Mi Robot Vacuum Mop P** (petit budget, environ 250€)</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les crit&egrave;res importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">D’abord, la **navigation** : un robot lidar, c’est comme un GPS, ça trace une carte et évite les obstacles. Les modèles sans, c’est le jeu de la taupe aveugle : ils cognent partout. Ensuite, le **bac auto-vidable** : si t’as la flemme de vider le réservoir toutes les deux heures, c’est un must. Sinon, prépare-toi à devenir ami avec la poubelle. Enfin, la **compatibilité Alexa** : certains robots disent "compatible" mais en fait, tu peux juste dire "stop" ou "go". Vérifie les reviews pour savoir s’il comprend les ordres complexes (genre "nettoie la zone sous le canapé, mais évite le câble HDMI").</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre s&eacute;lection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le **iRobot Roomba j7+** est le boss final des robots aspirateurs. Il évite les câbles et les crottes de chien comme Neo esquive les balles dans Matrix. Son système "PrecisionVision" reconnaît même les objets que t’as laissé traîner (oui, tes chaussettes sales). Et si tu lui dis "Alexa, lance le Roomba", il répondra probablement pas, mais il fera le ménage. Le seul défaut : il coûte le prix d’un loyer dans une petite ville. Mais bon, la propreté a un prix (et la honte aussi, quand tes potes voient les miettes).</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le **Roborock S7 MaxV** est le couteau suisse des robots : il aspire, lave, et se faufile partout. Son capteur infrarouge détecte les obstacles, mais son vrai talent, c’est de gérer les tapis (il soulève la serpillère automatiquement, comme un majordome digne de Downton Abbey). Compatible Alexa, il peut même vider son bac dans une station auto-vidante (en option). Bref, c’est le choix du ratio "prix vs tranquillité" : t’as pas à vendre un rein, mais t’auras un résultat digne d’un hôtel 5 étoiles.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Pour les petits budgets ou les étudiants qui vivent dans 15m², le **Xiaomi Mi Robot Vacuum Mop P** fait le job. Pas de fioritures : il aspire et lave, mais sans lidar ni station auto-vidable. Sa navigation est basique, donc prépare-toi à des collisions épiques (il va se cogner contre les meubles comme Michael Scott dans The Office). Mais pour 250€, c’est un bon pote : il lance la session via Alexa sans broncher, et il est assez fiable pour éviter de finir en pièces détachées.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel mod&egrave;le selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Le geek technophile** : Il veut un robot qui fait tout, même le café. Recommandation : **Roborock S7 MaxV** (avec station auto-vidante).  
- **Le feignant assumé** : Il veut juste dire "Alexa, nettoie" et ne plus y penser. Recommandation : **iRobot Roomba j7+** (évite les obstacles, auto-vidable).  
- **L’étudiant en coloc** : Il a un budget serré et un appart rempli de câbles. Recommandation : **Xiaomi Mi Robot Vacuum Mop P** (ou alors un balai, mais bon).</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs &agrave; &eacute;viter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">1. **Acheter un robot sans lidar** : C’est comme acheter une voiture sans volant. Il va se planter partout, et tu passeras ton temps à le décoincer.  
2. **Croire que "compatible Alexa" signifie "intelligent"** : Certains modèles juste s’allument et s’éteignent. Vérifie qu’il gère les routines complexes (genre "nettoie la cuisine quand je quitte la maison").  
3. **Ignorer le bac auto-vidable** : Si t’as la flemme de vider le vide-poche, tu vas finir par le jeter par la fenêtre. Fais-toi un pote qui vide tout seul, comme un vrai adulte.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions fr&eacute;quentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Mon robot peut-il monter sur mon tapis sans se transformer en tracteur ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Réponse : Oui, s’il a des capteurs de terrain (comme le Roborock S7 MaxV). Sinon, prépare-toi à des scènes dignes d’un film de catastrophe.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que je peux lui demander de nettoyer juste une zone ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Réponse : Oui, les modèles avec cartographie (lidar) le font. Les autres, c’est comme demander à un poisson de faire du vélo.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Alexa peut-elle lui ordonner de s’arrêter ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Réponse : Généralement oui, mais vérifie que la commande vocale n’est pas juste "pause" (sinon, il va continuer à ramasser tes chaussettes).</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Combien de temps dure la batterie ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Réponse : Entre 1h30 et 2h30 selon le modèle. Assez pour nettoyer un T2, mais pas pour faire un marathon.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je le laisser seul à la maison ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Réponse : Oui, mais seulement s’il a un détecteur d’obstacles. Sinon, tu risques de retrouver le câble de ta box enroulé autour de lui, façon mummy.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/aspirateur-robot" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits &rarr;</Link>
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

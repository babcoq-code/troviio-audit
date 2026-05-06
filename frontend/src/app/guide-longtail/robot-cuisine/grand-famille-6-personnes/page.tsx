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
            <Link href="/c/robot-cuisine" className="hover:text-white transition-colors">Robot Cuisine</Link>
            <span>/</span>
            <span className="text-white font-medium">Robot cuiseur pour grande famille (6 personnes et plus) : capacite max</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d&apos;achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Robot cuiseur pour grande famille (6 personnes et plus) : capacite max</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Thermomix trop petit pour ta tribu ? Les robots cuiseurs 5L+ qui nourrissent tout le monde.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T’as une tribu de 6 affamés, et tu penses encore qu’un robot cuiseur « familial » de 3 litres va sauver tes dîners ? Franchement, autant faire la cuisine dans une tasse de café. Le marché te vend des appareils mignons, mais toi, t’as besoin d’un tank capable de transformer un bœuf entier en daube sans sourciller. Alors oublie les gadgets Instagram, on va parler de vrais engins, ceux qui te font gagner 2 heures et te laissent le temps de survivre à ta progéniture. Prêt à devenir le roi du batch cooking ?</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">R&eacute;ponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Si tu veux le meilleur pour ta meute sans te prendre la tête : vise un robot cuiseur d’au moins 5 litres, avec une puissance moteur digne d’un mixeur industriel et des recettes qui font rêver une armée. Voici 3 choix solides : le **Moulinex Cookeo Connect XL** (6L, ~250€), le **Kenwood Cooking Chef XL** (6L, ~800€), et le **Thermomix TM6** (2,2L… oui, c’est petit, mais on va en parler). Attention : si t’as plus de 4 bouches, le TM6 est trop juste – ne t’emballe pas.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les crit&egrave;res importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">D’abord, la **capacité**, c’est le nerf de la guerre. Un bol de 3 litres, c’est bien pour un couple de pigeons, mais pour 6 humains affamés, tu galères. Vise au moins 5 litres, voire 6 litres si tu veux cuire un poulet entier sans le découper en brochettes. Ensuite, la **puissance** : un moteur de 1500W minimum, sinon ton robot va pleurer quand tu lui balances des carottes congelées. Enfin, la **polyvalence** – mijoter, cuire à la vapeur, mixer, pétrir… Si ton appareil ne fait que cuire, tu vas t’ennuyer. Et les recettes préprogrammées ? Oui, c’est pratique, mais vérifie qu’elles sont adaptées aux grandes quantités, pas des portions pour une personne seule.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre s&eacute;lection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Le Moulinex Cookeo Connect XL (6L, 250€)** – le héros discret des grandes familles. Imagine un Batman qui fait la cuisine : pas de fioritures, mais il gère tout. Tu balances tes ingrédients, tu choisis un programme, et 30 minutes plus tard, t’as un plat pour 6 personnes, sans surveillance. Certes, il ne pétrit pas le pain comme un chef, mais pour les soirs de semaine, c’est le meilleur allié de ton frigo. Et le prix ? Pas de quoi hypothéquer ta maison. Le seul défaut : il te manquera un peu de style dans ta cuisine, mais tes gamins s’en fichent, ils veulent juste manger.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Le Kenwood Cooking Chef XL (6L, 800€)** – le rapport qualité/prix pour les cuistots exigeants. C’est un peu le James Bond des robots : cher, mais tu en as pour ton argent. Moteur brise-noix, bol en inox qui résiste aux chocs, fonction mijotage longue durée… Tu peux y faire un curry pour 8, pétrir une pâte à pizza pour une armée, et même mixer une soupe. En plus, il a un vrai fouet, pas un gadget qui fait des miettes. Oui, ça pique un peu le porte-monnaie, mais vu le nombre de pizzas livrées que tu vas éviter, ça s’amortit en un an. Prends-le si tu aimes cuisiner sans t’arrêter.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Le Thermomix TM6 (2,2L, 1400€)** – l’option premium… ou le cauchemar des grandes familles. Avant de crier au génie, sache que ce bol est conçu pour 2-3 personnes max. Pour 6, tu vas faire des batchs en rafale, et ton robot va ressembler à une machine à café surchargée. Oui, il est ultra polyvalent et connecté, mais à ce prix, tu aurais presque un Cookeo ET un Kenwood. Si t’as un budget illimité et que tu veux impressionner tes beaux-parents, vas-y. Sinon, prends plutôt un robot qui cuisine pour TOUT LE MONDE EN MÊME TEMPS. Recommandé seulement si ta famille mange comme des moineaux.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel mod&egrave;le selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Le parent débordé** : t’as 3 activités extra-scolaires, un chien qui aboie et un conjoint qui ne sait pas faire cuire des pâtes. Prends le **Cookeo Connect XL** – c’est le pilote automatique de tes dîners. Tu cliques, tu oublies, tu manges.
- **Le cuistot passionné** : tu passes tes week-ends à tester des recettes et à faire des levains maison. Le **Kenwood Cooking Chef XL** est ton nouveau meilleur ami. Il mixe, pétrit, mijote, et te laisse le temps de râler sur Instagram.
- **Le millionnaire en herbe** : t’as plus d’argent que de patience, et tu veux le top du top. Le **Thermomix TM6** est pour toi, mais prévois un second robot pour les grandes occasions. Sinon, tu vas finir par manger en décalé.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs &agrave; &eacute;viter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Erreur n°1 : acheter un robot de 3 litres pour 6 personnes**. Sérieux, t’as déjà essayé de faire un pot-au-feu dans une théière ? Résultat : des portions ridicules et des gamins qui réclament des pâtes 30 minutes après. Toujours viser 5-6 litres, minimum.
- **Erreur n°2 : croire que le prix fait tout**. Un Thermomix à 1400€ ne remplacera pas un Cookeo pour les grandes quantités. Parfois, le meilleur robot pour ta famille, c’est celui qui cuisine vite et pas celui qui fait 15 fonctions inutiles. Ne te fais pas avoir par le marketing.
- **Erreur n°3 : ignorer les programmes pour grandes portions**. Certains robots ont des recettes limitées à 4 personnes. Vérifie toujours que le mode d’emploi ou l’appli propose des options pour 6-8 personnes. Sinon, tu vas devoir adapter chaque recette comme un chef étoilé, et on sait tous que ça finit en larmes.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions fr&eacute;quentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que je peux cuire un poulet entier dans un robot cuiseur ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Réponse : Oui, si ton bol fait au moins 5 litres et que le poulet n’est pas un dinde de Noël. Le Cookeo XL peut le faire, mais mieux vaut le couper en deux pour éviter un combat de catch avec le couvercle.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Le Kenwood Cooking Chef XL est-il bruyant ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Réponse : Oui, un peu comme un marteau-piqueur amoureux d’un mixeur. Mais avec 6 gosses qui crient, tu ne l’entendras même pas. Et puis, ça fait bande-son épique pour ta cuisine.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je faire des yaourts avec un robot cuiseur ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Réponse : Certains modèles (comme le Kenwood) ont des accessoires, mais c’est un peu comme demander à un camion de faire du ski. Le Cookeo, lui, préfère rester dans son rôle de chef cuistot.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que le Thermomix TM6 est mal pour une grande famille ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Réponse : Pas mal, mais juste « pas pratique ». Tu vas faire 3 batchs pour un plat unique, et à la fin, tu auras l’impression d’avoir couru un marathon. Si t’as 6 personnes, passe ton chemin ou prends un deuxième robot.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il un robot connecté pour une grande famille ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Réponse : Pas obligatoire, mais c’est pratique pour les recettes en ligne. Le Cookeo Connect a une appli pas mal, le Kenwood un peu moins. Si tu veux éviter le Wifi, prends un modèle basique, tu feras le tri toi-même.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/robot-cuisine" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits &rarr;</Link>
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

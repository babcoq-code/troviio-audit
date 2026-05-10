import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">

      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs
            crumbs={[
              { label: "Accueil", href: "/" },
              { label: "Robot Cuisine", href: "/c/robot-cuisine" },
              { label: "Robot cuiseur multifonction : le couteau suisse de la cuisine 2026" },
            ]}
          />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Robot cuiseur multifonction : le couteau suisse de la cuisine 2026</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Cuire, mixer, peser, mijoter, fermenter... Le robot qui fait tout sauf tes impots.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T’as regardé trop de reels Instagram où un type en tablier bio coupe une carotte en 0,2 secondes avec un robot qui coûte le prix d’un loyer à Monaco ? Résultat : tu veux toi aussi « gagner du temps » sans finir en larmes devant un hachis Parmentier carbonisé. Le robot cuiseur multifonction 2026, c’est le nouveau Graal des cuistots modernes : il mélange, cuit, pèse, et te fait croire que t’es un chef étoilé alors que t’as juste réussi à ne pas brûler l’eau. Mais attention, entre le Thermomix version luxe et le moulin à légumes connecté à Alexa, y’a de la place pour se faire plumer. On pose les cartes sur la table.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Réponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Si t’as la flemme de lire 15 pages, voici le Top 3 pour 2026 : pour le roi de la polyvalence et de la fiabilité, prends le <strong>Thermomix TM7</strong> (environ 1 500 €). Pour le meilleur rapport qualité/prix sans vendre un rein, le <strong>Moulinex Cookeo Connect</strong> (environ 300 €). Si t’es un geek qui veut du WiFi et une application qui te parle, le <strong>KitchenAid Artisan Multicooker</strong> (environ 600 €). Le reste, c’est du marketing.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les critères importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>La puissance, la clé du succès</strong> : Un robot cuiseur sous les 800 watts, c’est comme un aspirateur sans sac : ça fait de la poussière. Pour hacher, cuire à la vapeur et surtout faire des soupes lisses comme la conscience d’un commercial, vise 1 000 watts minimum. En dessous, tu te retrouves avec des morceaux de carotte qui flottent dans ton potage comme des naufragés.

<strong>Le bol : taille et matière</strong> : T’as une famille de 4 ? Prends un bol de 3 litres minimum. Si tu vis seul avec ton chat, 2 litres suffisent, mais prépare-toi à refaire deux fois la même sauce. Le matériau ? Inox, pas de plastique qui colle. L’inox, ça se lave, ça brille, ça te fait croire que t’es dans un labo de Breaking Bad.

<strong>Les accessoires et la connectivité</strong> : Un robot cuiseur sans lame réversible, c’est comme un smartphone sans batterie. Regarde si le modèle a un couteau hachoir, un batteur, et surtout un panier vapeur. La connectivité ? Un écran tactile et une appli qui propose des recettes qui marchent (pas des « salade de pissenlit au tofu »). Le WiFi, c’est cool pour les mises à jour, mais ne tombe pas dans le piège du gadget qui coûte 200 € de plus pour une fonction « parler à ton robot » que tu n’utiliseras jamais.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre sélection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Thermomix TM7</strong> – Le roi incontesté, mais il coûte un SMIC. Si t’es prêt à vendre un rein ou à renoncer aux vacances à Bali, ce robot te fait tout : soupes, pains, risottos, desserts, et même te récite les ingrédients d’une voix douce. Le TM7 a un écran tactile digne d’un iPhone, un bol en inox de 2,2 litres, et une puissance de 1 500 watts. Il est cher, oui, mais quand tu vois tes amis galérer avec leur Cookeo de base, tu te sens comme Tony Stark dans sa cuisine.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Moulinex Cookeo Connect</strong> – Le rapport qualité/prix ultime pour les mortels. À 300 €, il fait tout ce que tu lui demandes : cuisson sous pression, mijotage, vapeur, et même des recettes guidées via l’appli. L’écran est simple, le bol fait 3 litres (parfait pour une famille), et la puissance de 1 200 watts te sort des plats dignes d’un restaurant routier. Le seul défaut : le plastique a une odeur de « neuf » pendant 3 mois. Mais pour ce prix, tu peux supporter un peu de parfum de Chine.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>KitchenAid Artisan Multicooker</strong> – Le choix des hipsters qui veulent du style ET des performances. À 600 €, t’as un robot qui ressemble à un accessoire de mode, mais qui cuisine comme un chef : 1 500 watts, un bol en inox de 3,5 litres, et des accessoires pour faire du pain, des confitures, et même des yaourts. La connectivité est correcte (appli KitchenAid avec des recettes sympas). Le hic ? Il prend de la place comme un meuble IKEA mal assemblé. Mais si ton comptoir ressemble à un showroom, c’est le choix parfait.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modèle selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Profil 1 : La maman débordée qui veut nourrir 4 enfants et un mari qui cuisine comme une brique.</strong>  
Prends le <strong>Moulinex Cookeo Connect</strong>. Il est fiable, simple, et tu peux lancer une recette en 2 clics pendant que tu cries sur les gosses. Le prix est raisonnable (300 €), et les résultats sont honorables.

<strong>Profil 2 : Le foodie qui poste ses plats sur Instagram et veut impressionner.</strong>  
Le <strong>Thermomix TM7</strong> est pour toi, mais prépare-toi à un prêt bancaire. C’est l’outil ultime pour les purées de céleri-rave et les risottos dignes d’un étoilé. Tu vas briller en société, mais ton compte en banque pleure.

<strong>Profil 3 : Le geek célibataire qui veut faire des pâtes sans sortir de son canapé.</strong>  
Le <strong>KitchenAid Artisan Multicooker</strong>. Il est beau, connecté, et tu peux le contrôler depuis ton téléphone (ouais, même pour une soupe). Parfait pour les mecs qui veulent impressionner leur date sans savoir éplucher un oignon.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs à éviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Erreur 1 : Acheter le moins cher sans regarder la puissance.</strong>  
Un robot à 100 € avec 600 watts, c’est comme essayer de couper un steak avec une cuillère. Tu vas passer 20 minutes à hacher des oignons et finir avec une bouillie. Fuis.

<strong>Erreur 2 : Ignorer la taille du bol.</strong>  
T’as acheté un bol de 1,5 litre pour une famille de 5 ? Félicitations, tu vas cuisiner en 3 fois. Le temps gagné, adieu. Vérifie la contenance avant de cliquer.

<strong>Erreur 3 : Croire que la connectivité remplace le talent.</strong>  
Une appli avec 500 recettes ne te transforme pas en chef. Si tu sais pas faire cuire une patate, même le meilleur robot te sortira une soupe dégueulasse. Apprends les bases, ou accepte que ton robot ne soit qu’un assistant, pas un magicien.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions fréquentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Le Thermomix TM7 vaut-il vraiment 1 500 € ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Oui, si t’es prêt à vendre un rein. C’est le meilleur, mais tu peux t’en sortir avec un Cookeo à 300 € pour 80% des tâches. La différence, c’est le confort et le flex.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je faire du pain dans un robot cuiseur ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Oui, si le modèle a une fonction pétrin (comme le KitchenAid ou le Thermomix). Mais ne t’attends pas à une baguette parisienne ; tu vas avoir une boule dense, mais ça passe avec du beurre.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Les robots connectés sont-ils vraiment utiles ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Pour les mises à jour et les recettes, oui. Mais si tu passes ton temps à bidouiller l’appli au lieu de cuisiner, t’es juste un geek avec un tablier.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il laver le bol à la main ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">L’inox se lave au lave-vaisselle, mais les lames et les joints, oui, à la main. C’est chiant, mais c’est la vie. Astuce : rince tout de suite après usage, sinon les résidus font des grumeaux de rance.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je cuire des aliments surgelés directement ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">Oui, la plupart des robots gèrent le surgelé. Mais attention : si tu mets des steaks congelés dans un Cookeo, tu vas avoir une soupe de viande. Décongèle un peu avant, ou accepte le résultat.</p>
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
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiqués sont susceptibles de varier. Troviio participe au Programme d'Associés d'Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}

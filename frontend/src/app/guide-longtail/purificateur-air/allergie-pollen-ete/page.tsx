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
              { label: "Purificateur D'air", href: "/c/purificateur-air" },
              { label: "Purificateur d'air anti-allergie et pollen : lequel choisir pour l'ete 2026 ?" },
            ]}
          />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Purificateur d'air anti-allergie et pollen : lequel choisir pour l'ete 2026 ?</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Allergies saisonnieres ? Le bon purificateur peut changer vos etes.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Ah, l’été 2026 : le soleil, les barbecues, et toi qui éternues comme un moteur diesel en pleine panne. Les pollens attaquent tes sinus avec la violence d’une finale de Koh-Lanta, et ton nez coule plus que le robinet de la cuisine après une raclette. Avant de ressembler à un zombie allergique dans *The Walking Dead*, il est temps de choisir un purificateur d’air. Mais attention, pas n’importe lequel : il faut un modèle qui aspire les graminées comme un aspirateur à gosses, sans te ruiner en électricité. Prêt à respirer sans jouer les Darth Vader asthmatiques ? Let’s go.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🌬️ Meilleur général | Dyson Purifier Hot+Cool (88/100) | Nettoie, chauffe, et te fait de l’ombre.
🌸 Anti-pollen pro | Philips Series 3000 (85/100) | Capture les pollens comme un ninja.
💸 Petit budget | Xiaomi Mi Air Purifier 4 (82/100) | Pas cher, mais pas un mouchoir.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Filtration HEPA</strong> : Filtre les pollens mieux que ta mère ne filtre tes amis.
<strong>Débit d’air</strong> : Plus c’est rapide, moins tu éternues comme un personnage de sitcom.
<strong>Niveau sonore</strong> : Sinon, tu crois qu’un moustique fait du beatbox dans ta chambre.
<strong>Capteurs intelligents</strong> : Détectent l’air pourri avant que ton nez ne se rebelle.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le Dyson Purifier Hot+Cool est le roi de l’été : il rafraîchit, purifie, et te fait un brushing si tu t’assois devant. Pour ceux qui veulent un purificateur qui fait aussi chauffage l’hiver (parce que oui, les allergies en janvier, ça existe). À éviter si tu vis dans un studio et que tu n’as pas besoin d’un engin qui ressemble à un vaisseau spatial pour chasser un grain de pollen.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le Philips Series 3000 est le ninja discret de la purif’ : il capture les pollens avec une précision chirurgicale, sans faire de bruit. Idéal pour les insomniaques qui veulent dormir sans avoir l’impression de camper dans un champ de blé. À éviter si tu cherches un gadget connecté qui te parle en morse : il est simple, mais efficace, comme un bon steak-frites.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le Xiaomi Mi Air Purifier 4 est le petit budget qui fait le job sans faire de scandale. Il aspire les pollens comme un aspirateur à moquette, mais sans le côté WTF. Parfait pour les étudiants ou ceux qui vivent dans un 20 m² avec un chat qui perd ses poils. À éviter si tu veux un objet design qui ferait pâlir un influenceur déco : il ressemble à une tour de PC, mais il fait le taf.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour allergique chronique qui éternue en regardant une fleur</strong> : Prends le Dyson, il te sauvera la vie sans te ruiner en Kleenex.
<strong>Pour le citadin stressé qui veut dormir en paix</strong> : Le Philips, silencieux comme un complice de braquage.
<strong>Pour le étudiant fauché avec un studio sous les toits</strong> : Le Xiaomi, efficace sans pleurer sur ton compte en banque.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Négliger le filtre</strong> : Un filtre sale, c’est comme un balai qui pue : inutile et dégueu.
<strong>Acheter trop petit</strong> : Un purificateur pour hamster dans un salon, c’est l’échec assuré.
<strong>Oublier le bruit</strong> : Un modèle bruyant, et tu te crois dans un concert de métal à 3h du mat.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Le purificateur élimine-t-il les poils de chat ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais il ne remplace pas une brosse : ton matou reste poilu, désolé.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il le laisser allumé 24h/24 ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, comme ton frigo, sinon les pollens reviennent en mode revenge.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Ça consomme beaucoup d’électricité ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Moins qu’un clim, mais plus qu’une veilleuse à licorne.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je le mettre dans ma chambre ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais évite de le coller à ton oreiller : tu vas ressembler à un DJ.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que ça sent le propre ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, ça sent juste… rien. C’est le but, en fait.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/purificateur-air" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits →</Link>
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

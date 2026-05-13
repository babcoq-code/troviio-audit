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
              { label: "Aspirateur-robot", href: "/c/aspirateur-robot" },
              { label: "Robot aspirateur pour maison a etage : les meilleurs modeles 2026" },
            ]}
          />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Robot aspirateur pour maison a etage : les meilleurs modeles 2026</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Quel robot aspirateur pour une maison avec escaliers et plusieurs niveaux ?</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Tu as un étage, un chat qui se prend pour un ninja et une poussière qui se reproduit plus vite que les lapins de ta tante ? Bienvenue au club des gens qui montent les escaliers en râlant. Un robot aspirateur en 2026, c’est le seul employé de maison qui ne te demande pas d’augmentation. Mais attention : tous ne sont pas dignes de gravir les marches du trône (littéralement). Certains sont plus paumés qu’un streameur en panne de réseau. Alors, pour que ton salon ne ressemble pas à un champ de bataille post-apocalyptique, voici les meilleurs modèles pour étages. Prêt à déléguer ta corvée préférée ?</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🤖 Le Ninja des Étages | Roomba i9+ (92/100) | Cartographie laser, évite les câbles comme un pro.
🦸 Le Super-Héros Silencieux | Samsung Jet Bot Pro (89/100) | Aspire fort, se faufile sous le canapé.
🧹 Le Rebelle Sans Fil | Dreame L20 Ultra (88/100) | Monte les escaliers ? Non, mais il vide son sac tout seul.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Cartographie multi-étages</strong> : Crucial pour qu’il ne se prenne pas pour un explorateur du Titanic à chaque étage.
<strong>Autonomie en mode étage</strong> : Sinon il s’endort en bas et tu le retrouves en mode plantage.
<strong>Détection d’obstacles</strong> : Indispensable pour ne pas transformer ton câble HDMI en confetti.
<strong>Niveau sonore</strong> : Un aspirateur qui hurle comme un fan de foot réveille les voisins ET le bébé.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le Roomba i9+ est le boss final des robots aspirateurs. Il monte les escaliers comme un alpiniste pro, cartographie chaque recoin et vide sa poubelle tout seul. Pour qui ? Les gens qui veulent un majordome en plastique. À éviter si ? Tu aimes regarder ton robot galérer contre une marche de 2 cm – spoiler : il gagne.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le Samsung Jet Bot Pro, c’est le pote silencieux qui fait le taf sans drama. Son capteur LiDAR est plus précis qu’un GPS de chasseur de trésor. Pour qui ? Les insomniaques qui veulent aspirer à 3h du mat’ sans réveiller le chat. À éviter si ? Tu as un tapis à poils longs : il va le bouder comme un ado devant ses légumes.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le Dreame L20 Ultra, c’est le rebelle qui promet l’autonomie totale : il se lave, se sèche et vide son bac. Mais attention, il ne monte pas les escaliers. Pour qui ? Les fans de la vie sans contrainte (et sans étage en colimaçon). À éviter si ? Tu as plus d’un étage : il va te faire un doigt d’honneur robotique.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour le fainéant assumé</strong> : Roomba i9+ – il fait tout, même te préparer un café (non, mais presque).
<strong>Pour l’esthète insomniaque</strong> : Samsung Jet Bot Pro – discret comme un ninja en mission secrète.
<strong>Pour le geek sans escalier</strong> : Dreame L20 Ultra – le roi de l’entretien automatique, mais pas de l’alpinisme.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Ignorer la cartographie multi-étages</strong> : Ton robot se perdra plus qu’un touriste sans Google Maps.
<strong>Oublier la hauteur des marches</strong> : S’il mesure 10 cm, il ne montera pas ; c’est mathématique, Einstein.
<strong>Croire que le wifi suffit</strong> : Sans connexion stable, il devient un presse-papier high-tech.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que le robot monte vraiment les escaliers ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, la plupart ne montent pas, mais ils cartographient chaque étage si tu les y amènes.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Combien de temps dure la batterie pour un étage ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Environ 90-120 minutes, soit le temps de regarder un film de Nolan sans pause.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Peut-il aspirer sous le lit ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, s’il mesure moins de 10 cm de haut, il se faufile comme un espion.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il vider le bac tous les jours ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Les modèles avec base automatique le font pour toi, sinon prépare-toi à un rendez-vous quotidien.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que ça effraie le chat ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Au début, oui. Après, ton chat le chevauchera comme un destrier.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/aspirateur-robot" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits →</Link>
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

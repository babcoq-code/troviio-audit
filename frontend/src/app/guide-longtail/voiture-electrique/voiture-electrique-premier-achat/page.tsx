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
              { label: "Voiture electrique", href: "/c/voiture-electrique" },
              { label: "Premiere voiture electrique : par laquelle commencer ?" },
            ]}
          />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Premiere voiture electrique : par laquelle commencer ?</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Tu passes a l'electrique mais tu ne sais pas par ou commencer ? Voici les 3 meilleures voitures pour faire le grand saut en 2026.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T'as decide de passer a l'electrique. Bravo. Mais la, tu te retrouves devant un rayon de 37 modeles, des sigles mysterieux (WLTP, CCS, 800V), et des prix qui fluctuent comme le cours du Bitcoin. Le cerveau en surchauffe, les doigts qui tremblent devant le configurateur. Pas de panique. On a selectionne les 3 meilleures voitures electriques pour bien debuter en 2026 : la Renault 5 E-Tech pour le made in France accessible, la Citroen e-C3 pour entrer dans l'electrique au prix d'un smic, et la Tesla Model Y Juniper pour ceux qui veulent le best-seller planetaire. On t'explique tout, sans prise de tete.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🇫🇷 French Touch | Renault 5 E-Tech (73/100, ~25 810€ net) | "Electrique made in France, bonus max, la voiture du peuple moderne."
💰 Pas Cher et Radical | Citroen e-C3 (67/100, ~13 890€ net) | "La voiture electrique la moins chere du marche, point barre."
🚀 Best-Seller Planetaire | Tesla Model Y Juniper (85/100, ~39 990€) | "Le SUV electrique le plus vendu au monde, restyle pour etre encore meilleur."</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Budget total</strong> : Le prix d'achat, c'est le debut. Ajoute le bonus ecologique (jusqu'a 4 000€ en 2026), les frais d'entretien (30% moins chers qu'une thermique), et le cout de recharge. Le coût total sur 5 ans change tout.
<strong>Autonomie suffisante</strong> : T'as pas besoin de 800 km pour faire tes trajets quotidiens. 300 km WLTP suffisent pour 95% des Francais si tu charges a la maison.
<strong>Eligibilite au bonus</strong> : Certaines voitures (comme la Tesla Model 3 Highland fabriquee en Chine) ne sont plus eligibles. Verifie avant de craquer.
<strong>Recharge a domicile</strong> : As-tu une prise dans ton garage ou ton parking ? Sans recharge a domicile, l'electrique devient vite une corvee.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Renault 5 E-Tech</strong> (73/100, ~25 810€ net apres bonus) : Le retour de la reine. Fabriquee en France (Douai), design retro qui fait tourner les tetes, bonus ecologique maximal (4 000€). 400 km WLTP, assez pour la semaine. Recharge 11 kW AC, compatible 100 kW DC. L'interieur est soigne, l'ecran central repond au doigt et a l'oeil. Le choix patriotique et intelligent. Pour qui ? Les Francais qui veulent une voiture produite localement sans se ruiner. A eviter si ? Tu as besoin d'un grand coffre.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Citroen e-C3</strong> (67/100, ~13 890€ net apres bonus) : La moins chere du marche, et de loin. 13 890€ net apres bonus, c'est le prix d'une Clio d'occasion. 320 km WLTP, assez pour la ville et les petits trajets. Suspension avec butees hydrauliques progressives pour un confort digne d'une grosse berline. La finition est basique, les plastiques sont durs, mais a ce prix-la, tu achètes une voiture neuve qui roule sans essence. Pour qui ? Les budgets serres, les etudiants, les deuxiemes voitures. A eviter si ? Tu passes ta vie sur autoroute.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Tesla Model Y Juniper</strong> (85/100, ~39 990€, bonus eligible) : Le best-seller absolu. Restyle Juniper 2026 avec interieur enfin premium, silence de roue ameliore, bandeau lumineux avant. 600 km WLTP, reseau Superchargeur imbattable, capacite de demenagement. Produit a Berlin, eligible au bonus. C'est le choix du pragmatisme absolu. Pour qui ? Ceux qui veulent le meilleur SUV electrique sans compromis. A eviter si ? Ton budget est sous les 35 000€.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour le patriote ecolo au budget maitrise</strong> : Renault 5 E-Tech. Fabriquee en France, bonus max, 400 km d'autonomie. Le choix du coeur ET de la raison.
<strong>Pour l'etudiant ou le citadin qui veut le prix plancher</strong> : Citroen e-C3. 13 890€ net, c'est le prix d'une thermique d'occasion. Pour la ville, c'est parfait.
<strong>Pour la famille qui veut le meilleur tout-terrain du quotidien</strong> : Tesla Model Y Juniper. 600 km, coffre immense, Superchargeur. Tu fais tout avec, sans stress.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Acheter une voiture non eligible au bonus sans le savoir</strong> : 4 000€ d'economie, c'est pas une paille. Verifie que le modele est produit en Europe ou eligible avant de signer.
<strong>Negliger la recharge a domicile</strong> : Sans wallbox ou prise renforcee a la maison, l'electrique devient aussi pratique qu'un telephone sans chargeur. La moitie de l'interet disparait.
<strong>Prendre trop d'autonomie pour ton usage</strong> : 600 km pour faire 30 km/jour, c'est comme acheter un camion pour transporter un sac de courses. Tu paies le poids et la batterie inutilement.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que je peux recharger une electrique sur une prise classique ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais ca prend environ 24h pour une recharge complete. Pour la nuit, une wallbox 7,4 kW est quasi indispensable si tu veux pas passer ta vie a attendre.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Quel est le cout d'entretien d'une voiture electrique ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Environ 30% moins cher qu'une thermique. Pas d'huile, pas de courroie de distribution, pas d'embrayage, moins de freins (recuperation d'energie). Le gros poste, c'est les pneus.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>La batterie perd-elle en capacite avec le temps ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, environ 2% de perte par an. Apres 8 ans, il te reste ~85% de la capacite originale. Les garanties constructeur couvrent generalement 70% apres 8 ans ou 160 000 km.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il une prise renforcee ou une wallbox ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: La wallbox est conseillee. Compte 800-1 500€ pose, avec un credit d'impot de 300€. Elle recharge 3 fois plus vite qu'une prise classique et securise l'installation.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que les voitures electriques prennent feu plus souvent ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, les stats montrent que les electriques prennent feu 20 fois moins souvent que les thermiques. Mais quand ca arrive, c'est plus dur a eteindre. Rassure-toi, tu as plus de chances de gagner au loto.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/voiture-electrique" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir toutes les voitures electriques →</Link>
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

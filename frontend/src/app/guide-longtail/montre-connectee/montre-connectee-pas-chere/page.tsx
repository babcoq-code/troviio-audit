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
              { label: "Montre connectée", href: "/c/montre-connectee" },
              { label: "Montre connectée pas chère : le meilleur rapport qualité/prix" },
            ]}
          />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Montre connectée pas chère : le meilleur rapport qualité/prix</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Pas besoin de claquer 1000€ pour une bonne montre connectée. Voici le top 3 des meilleurs rapports qualité/prix.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">T'as envie d'une montre connectée qui fait le job, sans avoir à vendre un rein sur le marché noir. Le problème ? Dès qu'on parle de smartwatch, les prix s'envolent façon fusée SpaceX — 900 balles pour une Apple Watch, 1100 pour une Garmin Fenix, faut vraiment être sponsorisé par son banquier. Mais rassure-toi, il existe des perles rares qui ne coûtent pas un mois de loyer et qui te donnent l'essentiel : notifications, cardio suivi, autonomie décente, et le look de quelqu'un qui a les moyens (sans les avoir). Si ton budget frôle les 300€ plutôt que les 1000€, on a déniché les montres qui ne te feront pas regretter ton choix — ni pleurer devant ton relevé bancaire.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🔥 Roi du rapport qualité/prix | Amazfit Balance 2 (66/100) | “La smartwatch qui en veut pour 300 balles, et elle assume.”
💎 Le polyvalent Android | Samsung Galaxy Watch 8 (67/100) | “Le meilleur compromis entre style, perfs et prix.”
🧠 Le rookie Google | Google Pixel Watch 4 (63/100) | “La promesse d'un écosystème, à prix doux.”</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Autonomie</strong> : Minimum 3 jours, sinon ta montre passe plus de temps sur le chargeur qu'à ton poignet.
<strong>Écran</strong> : AMOLED ou rien, le LCD c'est moche comme un tattoo de Mickey sur le front.
<strong>Cardio & suivi santé</strong> : Capteur optique fiable, pas un gadget qui annonce 200 pulsations quand tu bois un café.
<strong>Compatibilité</strong> : iOS et Android, ou au moins ton OS — vérifie avant d'acheter.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Amazfit Balance 2</strong> — La reine de l'entrée de gamme qui se prend pour une reine. Avec son superbe écran AMOLED, son autonomie de 14 jours (oui, quatorze, pas quatorze heures), et son suivi santé complet (cardio, SpO2, sommeil, stress), elle fait de l'ombre à des montres qui coûtent le double. Seul bémol : l'écosystème Zepp est un peu limité niveau apps tierces, mais pour le sport et les notifications, c'est du solide. À ~299€ sur Amazon via <a href="https://www.amazon.fr/dp/B0F8HNKK6Z?tag=troviio-21" target="_blank" rel="noopener noreferrer sponsored" className="underline text-[#3ED6A3]">ce lien</a>. Pour qui ? Les budget-conscients qui refusent de sacrifier le style. À éviter si ? Tu veux installer Telegram et jouer à Candy Crush sur ta montre.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Samsung Galaxy Watch 8</strong> — Le choix du juste milieu. Design élégant, écran Super AMOLED lumineux, Wear OS bien intégré avec Google Assistant et Play Store, et des capteurs santé qui rivalisent avec les grands. Son autonomie de 3-4 jours est correcte sans être extraordinaire, mais la recharge rapide sauve la mise. Le petit plus : la personnalisation hautement poussée des cadrans et la compatibilité quasi universelle avec Android. À ~369€ sur Amazon <a href="https://www.amazon.fr/dp/B0FC31K3NF?tag=troviio-21" target="_blank" rel="noopener noreferrer sponsored" className="underline text-[#3ED6A3]">par ici</a>. Pour qui ? Les utilisateurs Android qui veulent la Rolls sans le tarif Rolls. À éviter si ? Tu es sous iOS — elle te snobe royalement.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Google Pixel Watch 4</strong> — La petite dernière de Google qui veut grignoter des parts de marché. Design élégant et épuré, intégration parfaite avec l'écosystème Google (Fitbit, Maps, Assistant), écran OLED de qualité. Son point faible ? L'autonomie d'à peine 24h, ce qui signifie une recharge quotidienne — un retour en arrière gênant quand Amazfit fait 14 jours. À ~379€ sur Amazon <a href="https://www.amazon.fr/dp/B0FJFWMVSG?tag=troviio-21" target="_blank" rel="noopener noreferrer sponsored" className="underline text-[#3ED6A3]">par là</a>. Pour qui ? Les fans de Google et les anciens utilisateurs Fitbit qui veulent la continuité. À éviter si ? Tu veux une montre qui tient le week-end sans fil à la patte.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour le roi de l'autonomie au budget serré</strong> : Amazfit Balance 2 — 14 jours sans recharge, tu oublies le chargeur en voyage.
<strong>Pour le geek Android qui veut du sérieux</strong> : Samsung Galaxy Watch 8 — Wear OS, Google, Samsung Health, le combo gagnant.
<strong>Pour le disciple de la secte Google</strong> : Google Pixel Watch 4 — Fitbit intégré, Assistant à la voix, et une promesse de mise à jour longue durée.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Acheter une montre trop bas de gamme</strong> : À 50€, t'as un bracelet qui affiche l'heure, pas une smartwatch.
<strong>Ignorer la compatibilité OS</strong> : Une montre Samsung avec un iPhone, c'est comme un Mac avec Windows 95.
<strong>Oublier le confort du bracelet</strong> : Le silicone gratte en été, le cuir s'abîme sous la douche, choisis bien.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Une montre à 300€ peut-elle vraiment suivre le cardio correctement ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, les capteurs ont bien évolué. L'Amazfit Balance 2 et la Galaxy Watch 8 sont aussi précises que des montres à 600€ pour le cardio au repos et en effort modéré.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Quelle est la meilleure montre pas chère pour iPhone ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: L'Amazfit Balance 2 fonctionne très bien avec iOS. La Pixel Watch 4 aussi. La Galaxy Watch 8, par contre, oublie — elle ne parle qu'à Android.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Les montres pas chères ont-elles le GPS intégré ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Les trois de notre sélection ont un GPS intégré. Pas besoin de trimballer ton téléphone pour tracer ton run du dimanche.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>La Pixel Watch 4 vaut-elle le coup face à la Galaxy Watch 8 ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: La Galaxy Watch 8 a une meilleure autonomie (3-4 jours vs 24h), un écran plus lumineux, et plus d'apps. La Pixel Watch 4 mise sur l'intégration Fitbit. À toi de voir.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>L'Amazfit Balance 2 est-elle compatible avec Strava ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, via l'app Zepp qui synchronise avec Strava, Google Fit et Apple Health. Tu perds pas tes stats en changeant de montre.</p>
</details>

          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/montre-connectee" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits →</Link>
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

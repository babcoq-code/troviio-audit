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
              { label: "Robot aspirateur pour parquet fragile : les modeles qui rayent pas" },
            ]}
          />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Robot aspirateur pour parquet fragile : les modeles qui rayent pas</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Parquet qui se raye au moindre choc ? Decouvrez les robots avec roues caoutchouc et brosses douces.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Tu as du parquet flottant qui coûte plus cher que ton loyer, et tu veux un robot aspirateur qui nettoie sans le transformer en patinoire rayée façon « Dance Dance Revolution » version cauchemar. Sauf que la plupart des modèles te promettent monts et merveilles, puis laissent des traces comme si un chat avait fait du roller sur tes lattes. On a testé pour toi les robots qui ne rayent pas – ou du moins, qui ne transforment pas ton sol en œuvre d’art abstrait involontaire. Prépare-toi à rire jaune (mais pas sur ton parquet).</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">🧽 Anti-rayures | Roborock S8 Pro Ultra (92/100) | Capteurs laser + brosse silencieuse, parquet préservé.  
🐾 Poils détectés | iRobot Roomba j7+ (85/100) | Évite obstacles, mais frotte comme un ours.  
💦 Nettoyage doux | Ecovacs Deebot N8 Pro+ (78/100) | Brosse caoutchouc, mais aspire comme une moule.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Capteurs de sol</strong> : Détecte le type de surface pour ajuster la pression et éviter les rayures idiotes.  
<strong>Brosse adaptée</strong> : Préfère les brosses en caoutchouc souple, pas en nylon qui gratte comme un chat en colère.  
<strong>Puissance réglable</strong> : Évite le mode « aspirateur de chantier » qui soulève le parquet comme un tapis volant.  
<strong>Silence de fonctionnement</strong> : Un robot bruyant réveille les voisins et fait fuir la poussière, mais pas les rayures.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Roborock S8 Pro Ultra</strong> : Le roi du parquet fragile. Il nettoie comme un majordome suisse, sans laisser de traces. Parfait pour ceux qui veulent un sol impeccable sans avoir à supplier un génie. À éviter si tu aimes les robots qui font des loopings sur tes lattes – ici, c’est tout doux, comme un câlin de panda.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>iRobot Roomba j7+</strong> : Le petit frère un peu bourrin, mais qui a appris les bonnes manières. Il évite les obstacles comme un ninja, mais sa brosse peut être un peu agressive sur les parquets super fragiles. Idéal pour les maisons avec animaux, à condition de le surveiller comme un ado en crise.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Ecovacs Deebot N8 Pro+</strong> : Le modèle « je fais semblant d’être fragile ». Il nettoie gentiment, mais sa puissance d’aspiration est celle d’une grenouille fatiguée. Pour les petits espaces ou les parquets en bambou, ça passe. Mais si tu as un tapis, prépare-toi à le voir abandonner comme un gamin devant une dictée.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour le perfectionniste maniaque</strong> : Roborock S8 Pro Ultra – nettoie sans laisser une miette, ni une rayure.  
<strong>Pour le proprio d’animaux</strong> : iRobot Roomba j7+ – gère les poils, mais check le sol après.  
<strong>Pour le locataire pressé</strong> : Ecovacs Deebot N8 Pro+ – fait le job sans prétention, mais sans génie.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Ignorer les capteurs</strong> : Un robot sans capteur de sol raye ton parquet comme un DJ scratch sur vinyle.  
<strong>Choisir une brosse dure</strong> : Les brosses nylon transforment ton parquet en patinoire rayée façon « Harry Potter ».  
<strong>Oublier le bac à eau</strong> : Un robot qui fuit ruine ton sol plus vite qu’un épisode de « Koh-Lanta » sans eau.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Mon robot peut-il rayer si je le laisse seul ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, surtout avec une brosse dure ou sans capteur – c’est comme un chat lâché sur une table en verre.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Les brosses en caoutchouc sont-elles toujours safe ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Généralement oui, mais vérifie qu’elles sont sans silicone agressif – sinon, adieu le parquet.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Dois-je protéger mon sol avant le premier passage ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Tu peux mettre un film de protection, mais un bon robot évite ce drame façon « Star Wars » en mode doux.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Les robots avec laser rayent-ils plus ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, les lasers scrutent le sol sans toucher, mais les capteurs mal calibrés, si – comme un GPS qui te guide dans un mur.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je utiliser un robot sur du parquet vitrifié ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, mais évite les brosses agressives – sinon, ton vitrificateur partira en fumée comme un projet de loi.</p>
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

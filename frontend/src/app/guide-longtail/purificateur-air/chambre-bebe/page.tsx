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
              { label: "Purificateur d'air pour chambre de bebe : le guide essentiel" },
            ]}
          />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Purificateur d'air pour chambre de bebe : le guide essentiel</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">L'air que respire votre bebe est crucial. Purificateurs silencieux sans ozone.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Félicitations, t’as reproduit un humain. Maintenant, ton petit bout respire l’air d’une chambre qui sent le lait caillé et les couches oubliées. Tu crois qu’un pot-pourri bio va sauver ses poumons de nouveau-né ? Non. L’air de ta chambre est un cocktail de poussière, de pollens et de particules de ton désespoir parental. Le purificateur d’air pour bébé n’est pas un gadget de hippie angoissé : c’est le seul truc qui empêchera ton enfant de développer une allergie aux chats avant même d’en avoir un. Alors, arrête de faire genre “l’air pur c’est pour les riches” et lis ce guide avant que ton gamin ne devienne le premier asthmatique de la crèche.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">💨 Le Champion | Levoit Core 300 (94/100) | Silencieux, filtre HEPA, tue les microbes.
👶 Le Minimaliste | Philips Série 800 (88/100) | Design mignon, ultra-simple, pas de gadgets.
🤖 Le Geek | Dyson Pure Cool Link (92/100) | Ventilo + purif’, appli, look vaisseau spatial.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Filtration HEPA</strong> : Le seul truc qui compte. Filtre les virus, les pollens, et tes larmes de fatigue.
<strong>Niveau sonore</strong> : Un purificateur bruyant réveille bébé, et là, c’est toi qui pleures.
<strong>Taille de la pièce</strong> : Choisis un modèle adapté à la chambre, pas un aspirateur industriel.
<strong>Sécurité</strong> : Pas de bords tranchants, pas de câbles pendants, et verrouillage enfant obligatoire.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Levoit Core 300</strong> : Le roi du silence. Il ronronne comme un chat en peluche, mais tue les allergènes. Pour les parents qui veulent un truc efficace sans se prendre la tête. À éviter si tu es un hipster qui juge le design “trop fade” – mais ton bébé s’en fout de ton esthétique Instagram.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Philips Série 800</strong> : Le minimaliste chic. Il ressemble à une mini-tour de contrôle, mais ne fait que purifier. Idéal pour les parents qui veulent un objet discret, pas un vaisseau spatial. À éviter si tu veux une appli pour suivre la qualité de l’air en temps réel – ici, c’est juste un bouton on/off. Comme tes nuits.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Dyson Pure Cool Link</strong> : Le gadget ultime. Il ventile, purifie, et se connecte à ton téléphone pour te dire que l’air est “mauvais” – comme si t’avais besoin d’une machine pour ça. Pour les geeks qui veulent un objet qui claque. À éviter si ton budget est serré – ça coûte le prix d’un mois de couches.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour parent stressé</strong> : Levoit Core 300 – fiable, silencieux, et ne te fera pas de crise d’angoisse.
<strong>Pour esthète Instagram</strong> : Philips Série 800 – minimaliste, discret, passe partout dans ta déco scandinave.
<strong>Pour tech-addict</strong> : Dyson Pure Cool Link – appli, stats, et look futuriste pour briller en soirée.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Ignorer le filtre HEPA</strong> : Sans lui, ton purificateur est juste un ventilateur cher qui déplace la poussière.
<strong>Mettre un modèle trop petit</strong> : Il va tourner en boucle sans jamais purifier la pièce, comme ta vie.
<strong>Oublier le bruit</strong> : Le mode nuit est un mythe – certains modèles réveillent les morts, et les bébés.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il un purificateur pour chaque chambre ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, un seul dans la chambre de bébé suffit, à moins que tu veuilles des poumons en or dans toute la maison.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Le filtre HEPA tue-t-il les virus ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Il les capture, oui. Mais pour les tuer, il faudrait un lance-flammes. Pas recommandé.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Puis-je le laisser allumé toute la nuit ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, surtout si le mode nuit est silencieux. Sinon, prépare-toi à des cauchemars sonores.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Comment nettoyer le filtre ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Aspire-le ou change-le tous les 6 mois. Sinon, il devient un nid à bactéries. Ironique, non ?</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que ça marche contre les odeurs de couches ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Ça aide, mais rien ne remplace une poubelle fermée et un parent qui prend son rôle au sérieux.</p>
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
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiqués sont susceptibles de varier. Troviio participe au Programme d'Associés d'Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}

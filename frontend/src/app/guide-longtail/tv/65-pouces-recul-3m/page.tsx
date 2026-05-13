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
              { label: "Tv", href: "/c/tv" },
              { label: "TV OLED 65 pouces pour recul de 3 metres : le guide 2026" },
            ]}
          />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">TV OLED 65 pouces pour recul de 3 metres : le guide 2026</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">3 metres entre le canape et la TV ? La taille ideale c'est 65 pouces.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Tu as craqué pour un canapé moelleux, tu as mesuré les 3 mètres réglementaires entre tes yeux et le mur, et maintenant tu veux une TV OLED 65 pouces pour mater *The Mandalorian* en 4K. Sauf que tu paniques face à des offres plus absconses qu’un épisode de *Koh-Lanta* version électronique. Entre le gamma, le pic lumineux et le taux de rafraîchissement, tu te sens comme un personnage de *Kaamelott* devant une porte qui s’ouvre pas. Calme-toi, je vais te sortir de cette galère avec un guide qui pique plus fort qu’un épisode de *Canal+* en clair.</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">📺 Meilleur global | LG G4 (94/100) | Image parfaite, mais faut vendre un rein.
🎮 Gamer pro | Samsung S95D (91/100) | Anti-reflets tueurs, idéal pour *Call of Duty*.
💰 Rapport qualité/prix | Sony A80L (87/100) | Bon compromis sans mortgage ta baraque.</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pic lumineux</strong> : Pour mater *Game of Thrones* dans le noir sans perdre les détails dans les ombres.
<strong>Anti-reflets</strong> : Évite de voir ta tronche déprimée quand tu manges devant *Top Chef*.
<strong>Taux de rafraîchissement</strong> : 120 Hz minimum pour que les débiles de *Fortnite* aient pas l’air de danser le jerk.
<strong>Processeur</strong> : Un bon chip qui upscale tes vieux DVD de *Taxi* en 4K sans les rendre flous comme un filtre TikTok.</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>LG G4 (94/100)</strong> : Le roi du OLED, avec des noirs si profonds que tu crois avoir éteint la TV. Parfait pour le geek qui veut mater *Interstellar* en boucle. À éviter si tu es radin comme un personnage de *Les Bronzés*, car le prix fait saigner plus fort qu’une scène de *Scarface*.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Samsung S95D (91/100)</strong> : Le ninja des reflets, idéal pour ton salon bordélique où la lumière du jour te nargue. Parfait pour le gamer qui veut voir ses ennemis dans *Apex Legends* avant qu’ils le déchirent. À éviter si tu es allergique au menu Tizen, plus ergonomique qu’un manuel de *Mode d’emploi* de ta grand-mère.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Sony A80L (87/100)</strong> : Le sage de la bande, avec un processeur qui rend les films de *Asterix & Obélix* presque regardables. Idéal pour le cinéphile fauché qui veut du bon sans vendre sa collection de figurines *Star Wars*. À éviter si tu veux jouer à *Elden Ring* en 120 Hz, car c’est plus lent qu’un épisode de *Plus belle la vie*.</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Pour le cinéphile exigeant</strong> : LG G4 – noirs parfaits, mais prépare ton porte-monnaie à pleurer.
<strong>Pour le gamer compétitif</strong> : Samsung S95D – anti-reflets et 120 Hz, sans devenir aveugle.
<strong>Pour le père de famille raisonnable</strong> : Sony A80L – bon équilibre, sans que les gosses piquent un fric.</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Oublier le pic lumineux</strong> : Un OLED trop sombre en plein jour, c’est comme un film d’horreur sans peur.
<strong>Négliger l’anti-reflets</strong> : Voir ta tête en double, c’est le cauchemar d’un épisode de *Black Mirror*.
<strong>Ignorer le processeur</strong> : Un upscale pourri transforme *Le Cinquième Élément* en *Vidéo Gag*.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            <details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Est-ce que 65 pouces à 3 mètres, c’est trop ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, c’est parfait pour un angle de vue de 40°, sauf si tu as des yeux de taupe.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>OLED ou QLED pour ce recul ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: OLED, car les noirs sont plus profonds que ton crush pour *Emily in Paris*.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Faut-il un support VESA spécifique ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Oui, vérifie les dimensions pour éviter que ta TV finisse au sol comme un épisode de *Loft Story*.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Le 120 Hz est-il obligatoire pour les films ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Non, mais pour les jeux, c’est aussi vital qu’un café le matin.</p>
</details>
<details className="p-5 group">
  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
    <span>Combien de ports HDMI 2.1 ?</span>
    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
  </summary>
  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">R: Au moins deux pour brancher ta PS5 et ta Switch, sans faire de *Tetris* avec les câbles.</p>
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
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiqués sont susceptibles de varier. Troviio participe au Programme d'Associés d'Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}

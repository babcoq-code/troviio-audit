import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

const sections = [
  {
    title: "Pourquoi une OLED pour le foot ?",
    content: `Parce que regarder un match sur un écran LCD, c'est comme écouter du Mozart sur un micro-ondes : ça marche, mais tu perds l'essentiel. Les TV OLED offrent un contraste infini, des noirs profonds et des couleurs qui claquent. Pour la Coupe du Monde 2026, avec des matchs en journée (décalage horaire USA oblige), il te faut un écran qui gère la luminosité comme Zack Snyder gère les ralentis : parfaitement.

Le ballon qui file sur la pelouse, le maillot des Bleus qui rougeoie sous le soleil californien, les larmes d'un gardien argentin... Tout ça, seule une OLED sait le retranscrire sans te donner l'impression de regarder une VHS trouvée chez Emmaüs.`,
  },
  {
    title: "Les 3 meilleures TV OLED pour le Mondial 2026",
    content: `Budget illimité : LG G5 (77 pouces, ~3 500€) — le vaisseau amiral, noir absolu, design qui rentre sous le sapin. Il fait 144 Hz, donc si tu mates le match puis que tu switches sur Call of Duty, pas de lag.

Meilleur rapport qualité/prix : Samsung S95F (65 pouces, ~2 200€) — la QD-OLED la plus lumineuse du marché. Les matchs en plein soleil de midi, elle les digère comme Mbappé les défenses adverses. Anti-reflet de folie.

Petit budget : Hisense U8N (75 pouces, ~1 200€) — mini-LED, 144 Hz, luminosité qui défonce. Le système est un peu lent (comme un joueur de L2), mais pour le prix, c'est un braquage en bonne et due forme.`,
  },
  {
    title: "5 critères pour ne pas te planter",
    content: `Taille : 55 pouces minimum. En dessous, autant regarder le match sur ton téléphone. 65 pouces si tu veux ressentir le drame.

Taux de rafraîchissement : 120 Hz. Pas négociable. Le ballon ne doit pas devenir une comète façon Tron.

Luminosité : vise 800 nits minimum. Les matchs en journée avec une OLED pas assez lumineuse, c'est gris sur gris.

Connectique : HDMI 2.1 pour le 4K à 120 Hz. Vérifie que ta TV a au moins 2 ports HDMI 2.1.

Budget : 1 000 à 3 500€ selon tes moyens. L'OLED abordable existe, mais ne descends pas sous les 900€ si tu veux pas pleurer.`,
  },
  {
    title: "Pourquoi 1 Français sur 4 va changer de TV pour le Mondial ?",
    content: `La Coupe du Monde 2026, c'est la première fois que le tournoi se joue à 48 équipes, avec des matchs en journée (USA oblige). Résultat : 1 Français sur 4 envisage de changer de TV spécifiquement pour le tournoi. Les chiffres sont parlants :

- 68% des acheteurs de TV en mai-juin 2026 citent le Mondial comme raison principale
- Le budget moyen explose : les Français sont prêts à mettre 1 370€ pour une TV dédiée au foot
- Les ventes de TV OLED ont bondi de 42% en mai 2026 par rapport à mai 2025

C'est pas juste un achat. C'est un investissement émotionnel. Et ça se respecte.`,
  },
  {
    title: "HDMI 2.1 : le nerf de la guerre",
    content: `Le HDMI 2.1, c'est le seul vrai standard pour le 4K à 120 Hz. Sans lui, ta PS5 Pro ou ta Xbox alimentent une TV qui bride les performances.

Vérifie sur ta future TV : 2 ports HDMI 2.1 minimum (un pour la console, un pour le soundbar). Les TV entrée de gamme mettent souvent 1 seul port, voire zéro en HDMI 2.1 (juste du 2.0).

Astuce : si tu branches tout en eARC, un port HDMI 2.1 peut suffire. Mais franchement, pour 200€ de plus, prends-en deux.`,
  },
  {
    title: "Taille d'écran : le nerf du réalisme",
    content: `On va pas se mentir : 55 pouces, c'est le strict minimum pour la Coupe du Monde. En dessous, les joueurs ressemblent à des fourmis sur le terrain.

La formule magique : distance de recul (en mètres) × 15 = taille idéale en pouces. Si ton canapé est à 3 mètres, vise 65 pouces minimum. Si t'es à 2 mètres, 55 pouces. Si t'es à 4 mètres (salon traversant), vise 75-77 pouces.

Petit tips : les OLED LG en 77 pouces descendent sous les 2 500€, ce qui rend le grand format accessible sans vendre un rein.`,
  },
  {
    title: "Anti-reflet : le détail qui change tout",
    content: `Les matchs de la Coupe du Monde 2026 auront lieu en journée (décalage USA). Si ton salon est orienté sud-ouest, l'anti-reflet devient ton meilleur ami.

Les QD-OLED Samsung (S95F, S90F) sont les meilleures sur ce point : leur traitement anti-reflet est tellement bon que tu peux regarder un match en plein soleil sans fermer les rideaux.

Les OLED classiques (LG C4, C5) progressent aussi mais restent en dessous. Si ta pièce est sombre, aucun problème. Si c'est une serre, prends Samsung.`,
  },
  {
    title: "La FAQ des indécis",
    content: `Q : Est-ce que 60 Hz suffit pour le foot ?
R : Oui, le foot est en 50 ou 60 fps. Mais si tu veux aussi jouer à la console après le match, prends 120 Hz.

Q : Quel budget prévoir pour une bonne OLED foot ?
R : Compte 1 200€ pour un 55 pouces correct, 1 800€ pour un 65 pouces solide, 2 500€+ pour le haut de gamme.

Q : OLED en salon lumineux, est-ce que ça marche ?
R : Les OLED modernes (Samsung S95F, LG G5) montent à 1 300 nits et ont un anti-reflet premium. Oui, ça marche même en plein jour.

Q : LG C5 ou Samsung S95F ?
R : Le Samsung est plus lumineux et meilleur en anti-reflet. Le LG a un meilleur processing vidéo pour le sport. À budget égal, prends le Samsung si ton salon est lumineux, le LG si tu mates surtout dans le noir.

Q : Quelle taille pour un salon de 25m² ?
R : 65 pouces. C'est le sweet spot. Assez grand pour ressentir le drame, pas trop pour que ce soit moche dans la pièce.

Q : Est-ce que le Hisense U8N est vraiment bien ?
R : Pour le prix, oui. C'est une mini-LED, pas une OLED, mais la luminosité est au rendez-vous. Le système d'exploitation est un peu lent (Vidaa OS), mais l'image est excellente pour le prix.`,
  },
];

const faqItems = [
  { q: "Est-ce que 60 Hz suffit pour le foot ?", r: "Oui, le foot est en 50 ou 60 fps. Mais si tu veux aussi jouer à la console après le match, prends 120 Hz." },
  { q: "Quel budget prévoir pour une bonne OLED foot ?", r: "Compte 1 200€ pour un 55 pouces correct, 1 800€ pour un 65 pouces solide, 2 500€+ pour le haut de gamme." },
  { q: "OLED en salon lumineux, est-ce que ça marche ?", r: "Les OLED modernes (Samsung S95F, LG G5) montent à 1 300 nits. Oui, ça marche même en plein jour." },
];

export default function GuidePage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.r
          }
        }))
      }} />
      <main className="min-h-screen bg-[#0E1020] text-white">

      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs
            crumbs={[
              { label: "Accueil", href: "/" },
              { label: "TV", href: "/c/tv" },
              { label: "TV OLED pour la Coupe du Monde 2026" },
            ]}
          />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d'achat Troviio</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-display text-balance">
              Quelle TV OLED pour la Coupe du Monde 2026 ?
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#8B8FA3]">
              Le Mondial 2026, c'est dans 20 jours. Et si ta TV actuelle date de l'époque où Mbappé n'était pas encore né, c'est le moment de passer à l'OLED. 1 Français sur 4 envisage de changer sa TV pour l'occasion. Voici les bonnes questions à se poser (et les réponses).
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 space-y-20">
        {sections.map((s, i) => (
          <div key={i} className={i === 0 ? "" : ""}>
            {i === 1 && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FF6B5F]/30 bg-[#FF6B5F]/10 px-4 py-1.5 text-xs font-semibold text-[#FF6B5F]">
                🏆 Verdict Troviio
              </div>
            )}
            <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl font-display ${i > 0 ? "mb-6" : "hidden"}`}>
              {s.title}
            </h2>
            <p className="text-base leading-7 text-[#8B8FA3]">
              {s.content}
            </p>
          </div>
        ))}

        {/* Conclusion */}
        <div className="rounded-2xl border border-[#FF6B5F]/20 bg-gradient-to-br from-[#FF6B5F]/[0.05] to-transparent p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-4">
            Mate la Coupe du Monde sur la bonne TV
          </h2>
          <p className="text-base leading-7 text-[#8B8FA3] mb-6 max-w-2xl mx-auto">
            Assez des comparatifs bidons. Dis a Troviio ton budget, la taille de ton salon, si tu joues ou pas. En 90 secondes, on te sort le Top 3 des TV OLED pile pour ta situation. Pas un Top 10 générique.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FF6B5F] hover:bg-[#FF8478] text-white font-bold transition-all hover:shadow-lg hover:shadow-[#FF6B5F]/30 text-lg"
          >
            Trouve ma TV pour le Mondial →
          </Link>
        </div>

      </section>
    </main>
    </>
  );
}

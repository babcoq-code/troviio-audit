import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LG G6 OLED vs Samsung S95H QD-OLED | Troviio",
  description: "La TV OLED 2026 la plus chere et la plus impressionnante. LG G6 ou Samsung S95H ? Verdict.",
  alternates: { canonical: "https://troviio.com/duel/lg-g6-oled-vs-samsung-s95h-qd-oled" },
};

export default function DuelPage() {
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs
          crumbs={[
            { label: "Accueil", href: "/" },
            { label: "Duels", href: "/duels" },
            { label: "Duel : LG G6 OLED vs Samsung S95H QD-OLED : quelle TV 2026 est la meilleure ?" },
          ]}
        />
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">âï¸ Duel Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">LG G6 OLED vs Samsung S95H QD-OLED</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">La TV OLED 2026 la plus chere et la plus impressionnante. LG G6 ou Samsung S95H ? Verdict.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">C'est le clash des Titans, le duel des mastodontes qui font pleurer ton compte en banque plus vite que Thanos en pleine crise de collectionnite. D'un côté, LG avec son OLED G6 qui promet des noirs plus profonds que la dépression d'un personnage de Kaamelott. De l'autre, Samsung avec son MicroLED M9 qui te file l'impression d'avoir un écran de cinéma IMAX dans ton salon, mais Ã  un prix qui ferait pleurer Tony Stark. Accroche-toi, on va voir qui mérite de cramer ton budget 2026.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">â¡ Comparatif rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- **Qualité d'image** : LG OLED G6 (noirs parfaits, contraste divin) VS Samsung MicroLED M9 (luminosité atomique, couleurs qui claquent) â Ãgalité : match nul comme un combat de sumo.
- **Taille max** : LG (83 pouces) VS Samsung (146 pouces) â Samsung gagne, tu peux recréer un stade chez toi.
- **Prix** : LG (5 000â¬ pour le 65") VS Samsung (20 000â¬ pour le 89") â LG gagne, ton portefeuille te suppliera pas de vendre un rein.
- **Durabilité** : LG (risque de burn-in si tu regardes CNN 24h/24) VS Samsung (MicroLED increvable, pas de pixel qui crame) â Samsung, c'est le Terminator des TV.
- **Design** : LG (ultra-fin, style James Bond) VS Samsung (modulaire, tu peux le coller au mur comme un tableau de Tron) â Ãgalité, les deux sont plus sexy que Ryan Gosling en costard.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">ð¥ Produit #1</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/lg-g6-oled-65-oled65g6-2026">LG G6 OLED 65"</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**LG OLED G6** - Le Jedi de la finesse. Ce monstre te plonge dans un noir tellement profond que même Dark Vador en pleine crise existentielle dirait "waow". Son processeur Alpha 10 boosté Ã  l'IA te rend les films plus vrais que nature, mais attention : si tu laisses une barre de CNN allumée 48h, tu risques de te retrouver avec le fantôme de Wolf Blitzer gravé Ã  vie sur l'écran. Bref, c'est l'écran parfait pour mater Le Seigneur des Anneaux en mode masochiste financier.</p>
          
            <div className="mt-4">
              <Link href="/produit/lg-g6-oled-65-oled65g6-2026" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">ð¥ Produit #2</p>
            <h3 className="text-xl font-bold mb-4"><Link href="/produit/samsung-s95h-65-qd-oled-tq65s95hf-2026">Samsung S95H 65" QD-OLED</Link></h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Samsung MicroLED M9** - Le Sith du bling-bling. Avec ses 146 pouces de folie, tu peux mater un match de foot en taille réelle et te croire dans le stade. La technologie MicroLED, c'est comme le vibranium de Wakanda : ça brÃ"le pas, ça vieillit pas, ça claque comme une réplique de OSS 117. Mais Ã  20 000 balles le morceau, t'as intérêt Ã  être milliardaire ou Ã  vivre dans un appartement plus grand que la salle de bal du Titanic. Le seul défaut ? Ton banquier va te demander si t'as piraté Fort Knox.</p>
          
            <div className="mt-4">
              <Link href="/produit/samsung-s95h-65-qd-oled-tq65s95hf-2026" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">ð Verdict Troviio</p>
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Samsung gagne haut la main, parce que le MicroLED M9, c'est comme avoir le Tesseract dans ton salon : ça brille, ça dure, et ça te fait oublier que t'as hypothéqué ta maison. LG, c'est Neo dans Matrix : il plie le contraste, mais il se casse la gueule au moindre pixel statique. Samsung, c'est Thanos avec la gant de l'infini : il écrase tout, mais pour un prix qui te fera pleurer aussi fort que la fin de Toy Story 3. Le verdict ? Samsung, mon pote, même si ton banquier te maudit.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">ð¯ LG G6 OLED 65" est fait pour toi si...</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- Le cinéphile obsédé qui veut des noirs plus profonds que sa solitude un dimanche soir.
- Le gamer qui veut mater Cyberpunk 2077 version 4K Ã  240 Hz, et qui a déjÃ  un SSD externe pour stocker ses larmes après l'achat.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">ð¯ Samsung S95H 65" QD-OLED est fait pour toi si...</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">- Le riche qui a un salon de 200 m² et qui veut mater les Guignols en taille réelle, façon "je suis le roi du monde".
- Le geek qui veut une TV qui survive Ã  l'apocalypse et Ã  ses enfants (parce que MicroLED, ça encaisse les chocs mieux que Captain America).</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir les TOP 3 &rarr;</Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

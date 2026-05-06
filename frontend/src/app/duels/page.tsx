import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tous les duels Troviio — Comparatifs produits 2026 | Troviio",
  description: "Retrouve tous nos duels de produits : smartphone vs smartphone, robot cuisine vs robot cuisine, matelas vs matelas. On tranche, toi tu choisis.",
  alternates: { canonical: "https://www.troviio.com/duels" },
};

const DUELS = [
  {
    slug: "dreame-x50-ultra-vs-roborock-qrevo-curv-2-pro",
    title: "Dreame X50 Ultra vs Roborock Qrevo Curv 2 Pro",
    hook: "Qui nettoie le mieux ? Le duel des aspirateurs robots qui te fera ranger ton balai.",
    cat: "aspirateur-robot",
    catLabel: "Aspirateur robot",
  },
  {
    slug: "sony-wh-1000xm6-vs-bose-qc-ultra",
    title: "Sony WH-1000XM6 vs Bose QC Ultra",
    hook: "Le duel des réducteurs de bruit. Spoiler : tes voisins vont t'entendre ronfler.",
    cat: "casque-audio",
    catLabel: "Casque audio",
  },
  {
    slug: "lg-g6-oled-vs-samsung-s95h-qd-oled",
    title: "LG G6 OLED vs Samsung S95H QD-OLED",
    hook: "La guerre des OLED. Samsung vs LG, comme Samsung vs LG mais en mieux.",
    cat: "tv",
    catLabel: "TV",
  },
  {
    slug: "jura-e8-vs-sage-barista-express",
    title: "Jura E8 vs Sage Barista Express",
    hook: "Automatique ou artisanal ? Le duel des machines à café qui va décider de ton matin.",
    cat: "machine-a-cafe",
    catLabel: "Machine à café",
  },
  {
    slug: "ninja-foodi-flexdrawer-vs-cosori-turboblaze",
    title: "Ninja Foodi FlexDrawer vs Cosori TurboBlaze",
    hook: "Deux friteuses entrent, une seule sort. Croustillant garanti.",
    cat: "friteuse-air",
    catLabel: "Friteuse à air",
  },
  {
    slug: "dyson-gen5-vs-samsung-bespoke-jet",
    title: "Dyson Gen5 Detect vs Samsung Bespoke Jet",
    hook: "Le duel des aspirateurs balais. Harry Potter aurait choisi Dyson, Ron la Samsung.",
    cat: "aspirateur-balai",
    catLabel: "Aspirateur balai",
  },
  {
    slug: "ipad-pro-m5-11-vs-samsung-galaxy-tab-s11-ultra",
    title: "iPad Pro M5 11 vs Samsung Galaxy Tab S11 Ultra",
    hook: "Apple ou Samsung ? Le duel des tablettes qui va décider si tu dessines ou tu streames.",
    cat: "tablette",
    catLabel: "Tablette",
  },
  {
    slug: "switch-2-pro-controller-vs-8bitdo-pro2-halleffect",
    title: "Switch 2 Pro Controller vs 8BitDo Pro 2",
    hook: "Officiel Nintendo ou alternative anti-drift ? Mario vs Pikachu, les deux sont cultes.",
    cat: "manette-switch",
    catLabel: "Manette Switch",
  },
  {
    slug: "samsung-galaxy-s26-ultra-vs-iphone-17-pro-max",
    title: "Samsung Galaxy S26 Ultra vs iPhone 17 Pro Max",
    hook: "Pilule bleue (Android) ou pilule rouge (iOS) ? Neo aurait pris les deux.",
    cat: "smartphone",
    catLabel: "Smartphone",
  },
  {
    slug: "dyson-gen5-detect-vs-samsung-bespoke-jet",
    title: "Dyson Gen5 Detect vs Samsung Bespoke Jet",
    hook: "Deux aspirateurs balais, un seul vainqueur. Hermione vs Ron, attention ça va dépoter.",
    cat: "aspirateur-balai",
    catLabel: "Aspirateur balai",
  },
  {
    slug: "miele-wcr870-vs-bosch-wgb244a2fr",
    title: "Miele WCR870 vs Bosch WGB244A2FR",
    hook: "L'élite allemande du lavage. Miele ou Bosch ? Comme choisir entre Mercedes et BMW.",
    cat: "lave-linge",
    catLabel: "Lave-linge",
  },
  {
    slug: "thermomix-tm7-vs-kitchenaid-artisan",
    title: "Thermomix TM7 vs KitchenAid Artisan",
    hook: "Le chef numérique contre le classique intemporel. Ratatouille vs cuisine de grand-mère.",
    cat: "robot-cuisine",
    catLabel: "Robot cuisine",
  },
  {
    slug: "hypnia-bien-etre-supreme-vs-emma-original",
    title: "Hypnia Bien-Être Supreme vs Emma Original",
    hook: "Le duel des matelas qui va enfin te faire dormir sur tes deux oreilles. Et ton dos aussi.",
    cat: "matelas",
    catLabel: "Matelas",
  },
  {
    slug: "giant-explore-eplus1-vs-riese-muller-charger4",
    title: "Giant Explore E+ 1 vs Riese & Muller Charger4",
    hook: "Vélo électrique : l'aventure ou le confort ? La Communauté de l'Anneau à deux roues.",
    cat: "velo-electrique",
    catLabel: "Vélo électrique",
  },
  {
    slug: "bugaboo-fox5-vs-uppababy-vista-v3",
    title: "Bugaboo Fox 5 vs Uppababy Vista V3",
    hook: "Le duel des poussettes. Fast & Furious version parents : la famille avant tout.",
    cat: "poussette",
    catLabel: "Poussette",
  },
];

export default function DuelsPage() {
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      {/* Hero */}
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white font-medium">Duels</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ LES DUELS TROVIIO</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Tous nos duels produits</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">
              Deux produits, un vainqueur. On les confronte sur les specs, le prix et l'usage pour te dire lequel mérite ta thune. Avec des références pop culture, parce que la vie est trop courte pour des comparatifs chiants.
            </p>
          </div>
        </div>
      </section>

      {/* Duels list */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6">
          {DUELS.map((duel, i) => (
            <Link
              key={duel.slug}
              href={`/duel/${duel.slug}`}
              className="group block rounded-2xl border border-white/5 bg-[#161827] p-6 transition-all hover:-translate-y-0.5 hover:border-[#FF6B5F]/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg">⚔️</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">
                      #{i + 1}
                    </span>
                    {duel.cat && (
                      <span className="ml-auto sm:ml-0 rounded-full bg-white/5 px-3 py-1 text-[10px] font-medium text-[#8B8FA3]">
                        {duel.catLabel}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FF6B5F] transition-colors">
                    {duel.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#8B8FA3]">
                    {duel.hook}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6B5F] group-hover:translate-x-1 transition-transform">
                    Voir le duel →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #FF6B5F, #FFB020)",
              boxShadow: "0 8px 32px rgba(255,107,95,0.35)"
            }}
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}

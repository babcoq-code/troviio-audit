import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { DynamicScore } from "@/components/product/DynamicScore";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meilleure montre connectée 2026 : le top 3 definitif",
  description: "Le classement des 3 meilleures montres connectées de 2026 testées et approuvées par Troviio.",
  alternates: { canonical: "https://troviio.com/tops/meilleure-montre-connectee" },
};

export default function TopsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@type": "ItemList",
          url: "https://troviio.com/tops/meilleure-montre-connectee",
          name: "Meilleure montre connectée 2026",
          description: "Le classement des 3 meilleures montres connectées de 2026.",
          numberOfItems: 3,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Garmin Fenix 8" },
            { "@type": "ListItem", position: 2, name: "Apple Watch Ultra 2" },
            { "@type": "ListItem", position: 3, name: "Samsung Galaxy Watch Ultra" },
          ],
        }}
      />
      <JsonLd
        data={{
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://troviio.com" },
            { "@type": "ListItem", position: 2, name: "Top 3", item: "https://troviio.com/tops" },
            { "@type": "ListItem", position: 3, name: "Meilleure montre connectée" },
          ],
        }}
      />
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white font-medium">Top 3 : Meilleure montre connectée 2026 : le top 3 definitif</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">🏆 Top 3 Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Meilleure montre connectée 2026 : le top 3 definitif</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Le classement des 3 meilleures montres connectées de 2026 testées et approuvées par Troviio.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Vous cherchez la meilleure montre connectée pour vous accompagner au quotidien ? Entre la Garmin Fenix 8 qui défie le temps, l'Apple Watch Ultra 2 pour les aventuriers urbains, et la Samsung Galaxy Watch Ultra qui cartonne chez les accros Android, on a passé au crible les trois modèles qui dominent le marché en 2026. Accrochez votre bracelet, ça va tacler sec.</p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#3ED6A3]">🥇 Numéro 1</p>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Garmin Fenix 8</strong> - <DynamicScore slug="garmin-fenix-8" fallback={85}/> - ~1099€  \n
La Garmin Fenix 8, c'est la montre pour les gens sérieux. Avec 40 jours d'autonomie en mode solaire, c'est la seule montre qui survivra à votre chargeur. Lampe LED, profondimètre, ECG, cartographie topo — cette montre en sait plus sur votre santé que votre médecin. À 1099€, elle coûte aussi cher qu'un iPhone mais tient 6 semaines sans recharge.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://www.amazon.fr/dp/B0DFLYMF79?tag=troviio-21" target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center gap-1.5 rounded-lg bg-[#3ED6A3]/20 px-4 py-2 text-xs font-medium text-[#3ED6A3] hover:bg-[#3ED6A3]/30 transition-colors">🇫🇷 Voir sur Amazon</a>
              <Link href="/produit/garmin-fenix-8" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">📄 Lire le test complet</Link>
            </div>
            <div className="mt-4">
              <a
                href="/api/go/garmin-fenix-8?src=tops&pos=1"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #FF6B5F, #E5554A)",
                  boxShadow: "0 4px 16px rgba(255,107,95,0.3)",
                }}
              >
                Voir le prix sur Amazon →
              </a>
            </div>

          </div>
          <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥈 Numéro 2</p>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Apple Watch Ultra 2</strong> - <DynamicScore slug="apple-watch-ultra-2-49mm-mww63zp-a" fallback={81}/> - ~899€  \n
L'Apple Watch Ultra 2 en titane avec sa sirène d'urgence et son GPS ultra-précis. L'écran à 2000 nits lit le soleil en face. La détection d'apnée du sommeil bluffante. Parfaite pour les aventuriers urbains qui veulent le plus badass des objets connectés.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://www.amazon.fr/dp/B0DGJDZL6D?tag=troviio-21" target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center gap-1.5 rounded-lg bg-[#4257FF]/20 px-4 py-2 text-xs font-medium text-[#4257FF] hover:bg-[#4257FF]/30 transition-colors">🇫🇷 Voir sur Amazon</a>
              <Link href="/produit/apple-watch-ultra-2" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">📄 Lire le test complet</Link>
            </div>
            <div className="mt-4">
              <a
                href="/api/go/apple-watch-ultra-2?src=tops&pos=2"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #FF6B5F, #E5554A)",
                  boxShadow: "0 4px 16px rgba(255,107,95,0.3)",
                }}
              >
                Voir le prix sur Amazon →
              </a>
            </div>

          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#8B8FA3]">🥉 Numéro 3</p>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Samsung Galaxy Watch Ultra</strong> - <DynamicScore slug="samsung-galaxy-watch-ultra-l708" fallback={71}/> - ~699€  \n
L'anti Apple Watch Ultra pour Android. Exynos W1000 3nm ultra-rapide, boîtier titane MIL-STD-810H, 3000 nits. L'autonomie dépasse 2 jours. Pour les accros Android qui veulent briller en randonnée sans passer chez Apple.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://www.amazon.fr/dp/B0F2GK1FGM?tag=troviio-21" target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">🇫🇷 Voir sur Amazon</a>
              <Link href="/produit/samsung-galaxy-watch-ultra" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">📄 Lire le test complet</Link>
            </div>
            <div className="mt-4">
              <a
                href="/api/go/samsung-galaxy-watch-ultra?src=tops&pos=3"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #FF6B5F, #E5554A)",
                  boxShadow: "0 4px 16px rgba(255,107,95,0.3)",
                }}
              >
                Voir le prix sur Amazon →
              </a>
            </div>

          </div>
        </div>

        
        <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#2E1A1A] p-6 mb-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">💀 Le grand perdant</p>
          <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">Le <strong>Google Pixel Watch 3</strong> (<DynamicScore slug="google-pixel-watch-4" fallback={65}/> - ~399€). Ah, la promesse de Google : un produit élégant, bien intégré, et… paf, l'autonomie dure à peine une journée. C'est la montre qu'on oublie de recharger et qu'on retrouve morte le lendemain matin, comme un téléphone oublié au fond du sac. Fitbit dedans, frustration dehors. À 399€, on aurait aimé un peu plus de sérieux de la part du géant de Mountain View.</p>
        </div>
        

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B5F] mb-2">🔥 Le mot de Troviio</p>
          <p className="text-base leading-7 text-[#C9CCDA] whitespace-pre-line">Si vous voulez une montre qui tient le choc en toutes circonstances, prenez la <strong>Garmin Fenix 8</strong> à 1099€. C'est le choix des sportifs exigeants et des aventuriers qui en ont marre de recharger leur montre tous les soirs. L'<strong>Apple Watch Ultra 2</strong> à 899€ est parfaite pour les accros à l'écosystème Apple qui veulent le nec plus ultra sans se ruiner complètement. Quant à la <strong>Samsung Galaxy Watch Ultra</strong> à 699€, c'est la meilleure option pour les utilisateurs Android qui veulent du haut de gamme sans passer chez Apple. Bref, ne faites pas l'impasse sur l'autonomie : une montre connectée qui meurt avant vous, c'est juste un bracelet électronique.</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Autres comparatifs</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
            <Link href="/" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Accueil Troviio</Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

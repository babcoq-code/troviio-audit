import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meilleure voiture électrique 2026 : le top 3 definitif | Troviio",
  description: "Le classement des 3 meilleures voitures électriques de 2026 testées et approuvées par Troviio.",
  alternates: { canonical: "https://www.troviio.com/tops/meilleure-voiture-electrique" },
};

export default function TopsPage() {
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white font-medium">Top 3 : Meilleure voiture électrique 2026 : le top 3 definitif</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">🏆 Top 3 Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Meilleure voiture électrique 2026 : le top 3 definitif</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Le classement des 3 meilleures voitures électriques de 2026 testées et approuvées par Troviio.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Le marché de la voiture électrique explose en 2026, et choisir le bon modèle est devenu un vrai casse-tête. Entre le Tesla Model Y Juniper qui règne sur les SUV, la Model 3 Highland qui bat des records d'autonomie, et la BMW iX3 Neue Klasse qui redéfinit le premium, on a départagé les trois meilleures électriques du moment. Branchez-vous, ça va envoyer du courant.</p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#3ED6A3]">🥇 Numéro 1</p>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Tesla Model Y Juniper</strong> - 85/100 - ~39 990€  \n
Le SUV électrique le plus vendu d'Europe. Restylé Juniper 2025 avec intérieur enfin abouti, bandeau lumineux avant et silence amélioré. Le réseau Superchargeur imbattable. Produit à Berlin, éligible bonus. Le seul vrai défaut : pas d'Apple CarPlay.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://www.tesla.com/fr_fr/model-y" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#3ED6A3]/20 px-4 py-2 text-xs font-medium text-[#3ED6A3] hover:bg-[#3ED6A3]/30 transition-colors">🚗 Configurer sur Tesla</a>
              <Link href="/produit/tesla-model-y-juniper" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">📄 Lire le test complet</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥈 Numéro 2</p>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>Tesla Model 3 Highland</strong> - 80/100 - ~36 990€  \n
La berline électrique record avec 702 km WLTP. Double vitrage, suspension améliorée, performances de folie (3,3s en Perf.). Fabriquée à Shanghai donc pas de bonus. L'absence d'Apple CarPlay reste le scandale.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://www.tesla.com/fr_fr/model3" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#4257FF]/20 px-4 py-2 text-xs font-medium text-[#4257FF] hover:bg-[#4257FF]/30 transition-colors">🚗 Configurer sur Tesla</a>
              <Link href="/produit/tesla-model-3-highland" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">📄 Lire le test complet</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#8B8FA3]">🥉 Numéro 3</p>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line"><strong>BMW iX3 Neue Klasse</strong> - 78/100 - ~71 950€  \n
Le meilleur SUV électrique premium de 2026. 805 km WLTP, 400 kW de charge, architecture révolutionnaire Neue Klasse. Un intérieur si futuriste que vous vous croirez dans un film de SF. Acheté par ceux qui peuvent, envié par tous les autres.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="https://www.bmw.fr/fr/configurateur.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">🚗 Configurer sur BMW</a>
              <Link href="/produit/bmw-ix3-neue-klasse" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">📄 Lire le test complet</Link>
            </div>
          </div>
        </div>

        
        <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#2E1A1A] p-6 mb-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">💀 Le grand perdant</p>
          <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">La <strong>Volkswagen ID.7</strong> (65/100 - ~56 990€). La grande berline électrique de Volkswagen devait être la rivale de la Tesla Model 3, mais elle arrive avec un logiciel qui rame, une autonomie décevante pour son gabarit, et un prix qui fait tousser. C'est le suppositoire de la gamme électrique : nécessaire, mais personne n'est content de l'avoir. Dommage, parce que côté confort, elle a du potentiel. Mais à ce prix-là, on n'achète pas du potentiel, on achète du résultat.</p>
        </div>
        

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B5F] mb-2">🔥 Le mot de Troviio</p>
          <p className="text-base leading-7 text-[#C9CCDA] whitespace-pre-line">Si vous voulez le meilleur rapport qualité-prix du marché électrique, foncez sur la <strong>Tesla Model Y Juniper</strong> à 39 990€. C'est le SUV le plus vendu d'Europe pour une raison : il fait tout bien, presque parfaitement, et le réseau Superchargeur est imbattable. La <strong>Tesla Model 3 Highland</strong> à 36 990€ est idéale si vous visez la meilleure autonomie pour le prix, à condition de ne pas être éligible au bonus. Quant à la <strong>BMW iX3 Neue Klasse</strong> à 71 950€, c'est le choix du cœur (et du portefeuille bien garni) pour ceux qui veulent le nec plus ultra du premium électrique. Peu importe votre choix, l'électrique n'a jamais été aussi bon — et Apple CarPlay n'a jamais été aussi absent.</p>
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
  );
}

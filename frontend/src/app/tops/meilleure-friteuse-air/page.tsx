import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meilleure friteuse a air 2026 : le top 3 pour manger sain sans se prendre la tete",
  description: "Friteuse a air : notre selection des 3 meilleures pour une cuisine saine et croustillante.",
  alternates: { canonical: "https://troviio.com/tops/meilleure-friteuse-air" },
};

export default function TopsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@type": "ItemList",
          url: "https://troviio.com/tops/meilleure-friteuse-air",
          name: "Meilleure friteuse à air 2026",
          description: "Le classement des 3 meilleures friteuses à air de 2026.",
          numberOfItems: 3,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ninja Foodi FlexDrawer AF500EU" },
            { "@type": "ListItem", position: 2, name: "Ninja Air Fryer Max AF160EU" },
            { "@type": "ListItem", position: 3, name: "Cosori TurboBlaze 6L" },
          ],
        }}
      />
      <JsonLd
        data={{
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://troviio.com" },
            { "@type": "ListItem", position: 2, name: "Top 3", item: "https://troviio.com/tops" },
            { "@type": "ListItem", position: 3, name: "Meilleure friteuse à air" },
          ],
        }}
      />
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white font-medium">Top 3 : Meilleure friteuse a air 2026 : le top 3 pour manger sain sans se prendre la tete</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">🏆 Top 3 Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">Meilleure friteuse a air 2026 : le top 3 pour manger sain sans se prendre la tete</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">Friteuse a air : notre selection des 3 meilleures pour une cuisine saine et croustillante.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">Ah, la friteuse à air. L’appareil qui promet de transformer votre cuisine en temple de la nutrition, mais qui finit souvent par être un meuble à courgettes carbonisées. Vous pensiez que votre vie allait changer ? Que vous alliez engloutir des nuggets « sans huile » en regardant la télé, le tout avec la silhouette d’un dieu grec ? Eh bien, détrompez-vous : la friteuse à air ne fait pas maigrir, elle fait juste moins dégouliner sur votre canapé. Alors, pour vous aider à ne pas finir avec un tas de plastique poussiéreux (comme le vélo d’appartement de 2020), voici le top 3 des champions de l’air chaud.</p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#3ED6A3]">🥇 Numéro 1</p>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Ninja Foodi FlexDrawer AF500EU**  
94/100 - 249€ - La championne  

**Pourquoi lui ?** Parce que c’est le clavier gaming des friteuses. Deux tiroirs, des options de cuisson simultanée (poulet frit à gauche, légumes à droite, paix dans le monde au milieu), et une connectivité qui vous permet de la programmer depuis les toilettes. Elle est chère, oui, mais elle fait tout : friture, déshydratation, réchauffage, et même cuisson lente si vous voulez transformer vos nuggets en pot-au-feu. Le seul vrai défaut ? Vous risquez de vous prendre pour un chef étoilé alors que vous venez de réchauffer des restes de pizza.</p>
          
            <div className="mt-4">
              <a
                href="/api/go/ninja-foodi-flexdrawer-af500eu?src=tops&pos=1"
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
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Ninja Air Fryer Max AF160EU**  
91/100 - 173€ - La classique  

**Pourquoi lui ?** C’est la Taylor Swift des friteuses : fiable, populaire, et elle sort un modèle à succès tous les deux ans. Elle est simple : un tiroir, des boutons, et une puissance qui fait croustiller vos frites surgelées comme si elles sortaient de la friterie du coin. Le petit hic ? Elle est un peu jalouse du FlexDrawer : pas de double zone, pas de ballet de cuisson synchronisée. Mais pour 173€, elle fait le job sans vous vendre un abonnement à son appli.</p>
          
            <div className="mt-4">
              <a
                href="/api/go/ninja-air-fryer-max-af160eu?src=tops&pos=2"
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
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Cosori TurboBlaze 6L**  
89/100 - 166€ - Le meilleur rapport qualité-prix  

**Pourquoi lui ?** Parce qu’il a compris que la vie est trop courte pour payer 250 balles une friteuse. 6 litres, une puissance de 1700W, et une interface tactile qui claque (oui, ça fait pro, même si vous cuisinez en jogging). Il est parfait pour les familles, les colocations, ou les solos qui veulent faire des portions à congeler pour les jours de flemme. Le seul reproche ? Il fait un bruit de mini-avion au décollage. Mais bon, qui n’aime pas un peu de bruit en cuisinant des frites ?</p>
          
            <div className="mt-4">
              <a
                href="/api/go/cosori-turboblaze-6l?src=tops&pos=3"
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
          <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">**Philips Essential Airfryer XL**  
87/100 - 99€ - L’entrée de gamme fiable  

On l’attendait, celui-là. Le champion des prix cassés, le sauveur des étudiants qui mangent des pâtes à l’eau. Mais en vrai ? Il cuit comme une grand-mère fatiguée : les frites sont molles, les nuggets sont tièdes, et le panier est si petit que vous passez plus de temps à faire des fournées qu’à manger. À 99€, c’est tentant, mais c’est un peu comme acheter une voiture à 500€ : ça roule, mais vous priez à chaque virage. Bref, il mérite sa place en bas du classement, et vous méritez mieux que des frites déprimantes.</p>
        </div>
        

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B5F] mb-2">🔥 Le mot de Troviio</p>
          <p className="text-base leading-7 text-[#C9CCDA] whitespace-pre-line">Le choix ultime ? La **Ninja Foodi FlexDrawer AF500EU**, parce que c’est le Thanos des friteuses : inévitable, puissant, et capable de cuire deux choses en même temps sans cligner des yeux. Vous paierez le prix d’un petit dîner au resto, mais vous gagnerez un temps précieux à regarder des vidéos de chats en attendant que vos ailes de poulet soient dorées. Alors, rangez votre culpabilité et votre huile de friture, et acceptez votre destin : vous êtes désormais un humain du futur, et le futur sent bon le croustillant.</p>
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

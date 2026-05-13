import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Le Troviio Score — L'histoire d'amour entre toi et ton prochain achat",
  description:
    "Oublie les notes sur 10 à la con. Le Troviio Score, c'est l'alchimie computationnelle qui mesure si un produit est fait pour toi. Et c'est plus fiable qu'un test de compatibilité Tinder.",
  alternates: { canonical: "https://troviio.com/score" },
  openGraph: {
    title: "Le Troviio Score — l'algorithme cupidon du shopping",
    description:
      "Comment une IA peut savoir si tu vas kiffer ton robot aspirateur avant même que tu l'achètes ? La réponse est romantique et mathématique à la fois.",
    url: "https://troviio.com/score",
    type: "website",
  },
};

export default function ScorePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <Breadcrumbs
        crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Score" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

        {/* ── HERO ── */}
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B5F]/20 bg-[#FF6B5F]/10 px-3 py-1.5 text-sm font-semibold text-[#FF6B5F]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF6B5F]" />
            Le Troviio Score
          </span>
          <h1 className="mt-6 font-sora text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Le <span className="text-[#FF6B5F]">match parfait</span>
            <br />
            n'existe pas.
            <br />
            <span className="text-2xl sm:text-3xl text-[#3ED6A3]">Sauf que si, en fait.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8" style={{ color: "var(--text-muted)" }}>
            Chaque site te met une note sur 10. 8,5/10. Excellent choix. 
            Mais <strong className="text-[#FF6B5F]">excellent pour qui</strong> ? Pour un golden retriever 
            ou pour un humain qui vit dans 28m² avec des factures à payer ?
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7" style={{ color: "var(--text-muted)" }}>
            Nous, on a décidé de cramer tout ça et de repartir de zéro. 
            Bienvenue dans le <strong>Troviio Score</strong> : une note qui change selon <em>toi</em>.
          </p>
        </section>

        {/* ── LA GENÈSE ── */}
        <section className="mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🤔</span>
            <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
              Pourquoi on a inventé tout ça ?
            </h2>
          </div>
          <div className="space-y-4 text-base leading-8">
            <p>
              Imagine : t'es là, à scroller les avis Amazon à 23h, à te demander 
              si le robot aspirateur à 350€ est vraiment « excellent » ou juste 
              « excellent pour quelqu'un qui a un loft de 200m² et pas de chat ».
            </p>
            <p>
              Une note sur 10, c'est un peu comme un test de QI qui te dirait juste 
              « t'es intelligent » sans préciser si t'es Einstein ou 
              juste capable de pas manger la fourchette en fer.
            </p>
            <p className="font-semibold" style={{ color: "var(--coral)" }}>
              Ça nous a tellement gonflés qu'on a décidé de créer notre propre système.
            </p>
            <p>
              Pas une note. Une vraie mesure d'affinité entre TOI (ton mode de vie, 
              ton budget, tes traumas d'achat passés) et un produit. 
              Avec des maths, de l'amour, et zéro bullshit marketing.
            </p>
          </div>
        </section>

        {/* ── ALOUIETTE ── */}
        <div className="mt-20 mb-8 text-center">
          <p className="text-5xl">👇</p>
          <p className="mt-4 font-sora text-lg font-semibold italic" style={{ color: "var(--text-muted)" }}>
            « OK mais concrètement, ça se calcule comment ? »
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            — Toi, probablement en lisant ça
          </p>
        </div>

        {/* ── LES TROIS PILIERS ── */}
        <section className="mt-10">
          <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl text-center">
            Les 3 piliers du Troviio Score
          </h2>
          <p className="mt-3 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            (oui, on appelle ça des piliers, ça fait plus sérieux)
          </p>

          <div className="mt-10 space-y-8">
            {/* Pilier 1 */}
            <div className="relative overflow-hidden rounded-[2rem] border p-6 sm:p-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="absolute top-0 left-0 h-full w-1.5 bg-[#FF6B5F] rounded-r-md" />
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FF6B5F]/10 text-3xl">
                  🎯
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-sora text-xl font-bold">Adéquation profil</h3>
                    <span className="rounded-full bg-[#FF6B5F]/15 px-2.5 py-0.5 font-sora text-xs font-bold text-[#FF6B5F]">60%</span>
                  </div>
                  <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                    <strong>La grosse part du gâteau.</strong> On compare ce que tu es (étudiant, parent solo, 
                golden retriever humain, collectionneur de capsules Nespresso) à ce que le produit 
                sait faire.
                  </p>
                  <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                    Un aspirateur Dyson génial mais trop lourd pour tes escaliers parisien ? 
                    <strong className="text-[#FF6B5F]"> Score qui prend cher.</strong> 
                    Un robot moche mais hyper silencieux qui passe sous ton canapé ? 
                    <strong className="text-[#3ED6A3]"> Match parfait.</strong>
                  </p>
                  <p className="mt-2 text-xs italic" style={{ color: "var(--text-muted)" }}>
                    En gros, on regarde si toi et le produit, vous êtes faits l'un pour l'autre. 
                    Comme un test de compatibilité, mais pour du matériel.
                  </p>
                </div>
              </div>
            </div>

            {/* Pilier 2 */}
            <div className="relative overflow-hidden rounded-[2rem] border p-6 sm:p-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="absolute top-0 left-0 h-full w-1.5 bg-[#4257FF] rounded-r-md" />
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#4257FF]/10 text-3xl">
                  🏆
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-sora text-xl font-bold">Qualité intrinsèque</h3>
                    <span className="rounded-full bg-[#4257FF]/15 px-2.5 py-0.5 font-sora text-xs font-bold text-[#4257FF]">25%</span>
                  </div>
                  <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                    <strong>Le produit est-il bon dans l'absolu ?</strong> On regarde les specs, 
                    les notes, les avis, la fiabilité. Si le produit est un pétard mouillé, 
                    même s'il correspond à 100% à ton profil, on ne va pas te le vendre 
                    comme le messie.
                  </p>
                  <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                    C'est la partie la moins romantique du score, mais la plus utile. 
                    <strong className="text-[#4257FF]"> Un peu comme un ami honnête</strong> qui te dit 
                    « écoute, je sais que tu kiffes son look, mais il a des problèmes 
                    d'humidité ». Merci l'ami.
                  </p>
                </div>
              </div>
            </div>

            {/* Pilier 3 */}
            <div className="relative overflow-hidden rounded-[2rem] border p-6 sm:p-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="absolute top-0 left-0 h-full w-1.5 bg-[#3ED6A3] rounded-r-md" />
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#3ED6A3]/10 text-3xl">
                  💰
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-sora text-xl font-bold">Valeur perçue</h3>
                    <span className="rounded-full bg-[#3ED6A3]/15 px-2.5 py-0.5 font-sora text-xs font-bold text-[#3ED6A3]">15%</span>
                  </div>
                  <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                    <strong>Le rapport qualité-prix, mais en moins chiant.</strong> On compare 
                    ce que tu paies à ce que tu reçois. Un smartphone à 1200€ qui fait 
                    la même chose qu'un à 400€ ? <strong className="text-[#FF6B5F]"> On le dit.</strong>
                  </p>
                  <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                    La valeur perçue, c'est subjectif. Un étudiant et un cadre sup 
                    n'ont pas la même définition de « abordable ». Du coup on ajuste 
                    <strong> selon ton budget</strong> que t'as partagé pendant le chat.
                    Malin, non ?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMMENT ÇA SE PASSE DANS LES COULISSES ── */}
        <section className="mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">⚙️</span>
            <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
              Dans les coulisses de l'algorithme cupidon
            </h2>
          </div>

          <div className="rounded-[2rem] border p-6 sm:p-8 space-y-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B5F] text-sm font-bold text-white">1</span>
              <div>
                <h3 className="font-sora font-bold">Tu causes, on prend des notes</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                  Pendant le chat, t'es pas juste « un utilisateur qui cherche un aspirateur ».
                  T'es <strong>Sarah</strong>, 32 ans, 68m², deux chats, allergie à la poussière, 
                  budget 300€ max, et t'as horreur du bruit le soir. On collecte tout ça façon psy 
                  bienveillant.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4257FF] text-sm font-bold text-white">2</span>
              <div>
                <h3 className="font-sora font-bold">On fouille notre base de 500+ produits</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                  Chaque produit a été épluché, testé, noté. On a ses specs, ses notes, ses forces, 
                  <strong> ses petits défauts qu'on assume</strong> (oui, même ceux que le fabricant 
                  cache dans les FAQs page 47). On sort les candidats qui pourraient te plaire.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3ED6A3] text-sm font-bold text-white">3</span>
              <div>
                <h3 className="font-sora font-bold">L'IA cuisine les scores</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                  Une intelligence artificielle (oui, une vraie, pas un type dans une cave) analyse 
                  chaque candidat sous l'angle des 3 piliers. Elle pondère, compare, élimine les 
                  incohérences. Au final elle pond <strong>un score d'affinité personnalisé</strong> 
                  avec une explication que même ta grand-mère comprendrait.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFB347] text-sm font-bold text-white">4</span>
              <div>
                <h3 className="font-sora font-bold">Tu juges sur pièces</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                  Le verdict tombe. 3 produits, chacun avec son Troviio Score, son explication 
                  personnalisée, ses pros/cons. Pas de mystère, pas de boîte noire. 
                  Tu vois exactement pourquoi tel produit a 85 et pas 72. 
                  <strong className="text-[#3ED6A3]"> Totalement transparent.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── LÉGENDE DES SCORES AVEC HUMOUR ── */}
        <section className="mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📊</span>
            <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
              Comment lire ton Troviio Score
            </h2>
          </div>
          <p className="mt-2 text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            (spoiler : plus c'est haut, moins t'auras de regrets après l'achat)
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#FF6B5F]/20 bg-[#FF6B5F]/5 p-5 text-center">
              <p className="text-4xl">🔥</p>
              <p className="mt-2 font-sora text-lg font-bold text-[#FF6B5F]">90 — 100</p>
              <p className="mt-1 text-sm font-bold">Coup de foudre</p>
              <p className="mt-1 text-xs leading-6" style={{ color: "var(--text-muted)" }}>
                Tu peux y aller les yeux fermés, la bouche ouverte, et même en faisant 
                du jonglage. Ce produit a été <strong>spécialement conçu pour toi</strong> par l'univers. 
                Aucune chance de déception.
              </p>
            </div>
            <div className="rounded-2xl border border-[#4257FF]/20 bg-[#4257FF]/5 p-5 text-center">
              <p className="text-4xl">💙</p>
              <p className="mt-2 font-sora text-lg font-bold text-[#4257FF]">75 — 89</p>
              <p className="mt-1 text-sm font-bold">Âme sœur</p>
              <p className="mt-1 text-xs leading-6" style={{ color: "var(--text-muted)" }}>
                Excellent choix. Tu risques de l'adorer. C'est pas LE coup de foudre 
                absolu, mais c'est <strong>un des meilleurs plans du marché</strong>. 
                Tu vas pas te lever la nuit pour vérifier qu'il va bien, mais presque.
              </p>
            </div>
            <div className="rounded-2xl border border-[#3ED6A3]/20 bg-[#3ED6A3]/5 p-5 text-center">
              <p className="text-4xl">💚</p>
              <p className="mt-2 font-sora text-lg font-bold text-[#3ED6A3]">60 — 74</p>
              <p className="mt-1 text-sm font-bold">Belle rencontre</p>
              <p className="mt-1 text-xs leading-6" style={{ color: "var(--text-muted)" }}>
                Solide et fiable. Un bon compromis. C'est comme rencontrer quelqu'un 
                de sympa sur une appli : <strong>ça peut marcher</strong>, mais t'auras 
                peut-être des compromis à faire. Regarde bien les points de vigilance.
              </p>
            </div>
            <div className="rounded-2xl border border-[#FFB347]/20 bg-[#FFB347]/5 p-5 text-center">
              <p className="text-4xl">🧡</p>
              <p className="mt-2 font-sora text-lg font-bold text-[#FFB347]">{'<'} 60</p>
              <p className="mt-1 text-sm font-bold">Ça peut le faire</p>
              <p className="mt-1 text-xs leading-6" style={{ color: "var(--text-muted)" }}>
                Ou pas. Ce produit a des <strong>compromis importants</strong> par rapport 
                à ton profil. Il peut dépanner, mais t'auras probablement mieux. Lis 
                les points de vigilance <em>avant</em> de cliquer sur « Voir le prix ».
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ CYNICO-ROMANTIQUE ── */}
        <section className="mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🙋</span>
            <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
              Les questions que tu te poses (et nos réponses)
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group rounded-2xl border p-5 transition-all open:shadow-md" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <summary className="flex cursor-pointer items-center justify-between font-sora font-bold">
                <span>Vous pouvez pas juste me dire 8,5/10 comme tout le monde ?</span>
                <span className="text-xl transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-4 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                On pourrait. Mais <strong>8,5/10, ça veut rien dire</strong>. 8,5/10 pour qui ? 
                Pour quoi ? Pour une machine à café que t'as pas les moyens d'entretenir ? 
                Pour un aspirateur trop lourd pour ton poignet d'informaticien ? Non merci. 
                On préfère te dire « 82/100, c'est un bon match mais le réservoir est petit, 
                vérifie si t'as la place ». C'est plus long, mais plus utile.
              </p>
            </details>

            <details className="group rounded-2xl border p-5 transition-all open:shadow-md" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <summary className="flex cursor-pointer items-center justify-between font-sora font-bold">
                <span>Et si je mens pendant le chat ?</span>
                <span className="text-xl transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-4 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                Techniquement, tu peux. Mais <strong>le seul perdant, c'est toi</strong>. 
                Si tu dis que ton budget c'est 1000€ et qu'en vrai t'as 300€, 
                on va te recommander un truc qui va te ruiner. Si tu dis que t'as 
                200m² alors que t'as un studio, on va te proposer un purificateur 
                d'air taille usine. <strong>Sois honnête, l'IA est ton amie.</strong> 
                (Enfin, elle juge pas. Elle.)
              </p>
            </details>

            <details className="group rounded-2xl border p-5 transition-all open:shadow-md" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <summary className="flex cursor-pointer items-center justify-between font-sora font-bold">
                <span>Vous êtes sponsorisés par les marques, non ?</span>
                <span className="text-xl transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-4 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                Non. <strong>Personne ne nous paie pour recommander un produit.</strong> 
                (Enfin si, Amazon nous file une commission si tu passes par nos liens. 
                Mais ça n'influence <em>aucunement</em> le score.) On gagnerait 
                plus à te recommander un produit à 800€ qu'un à 250€, et pourtant 
                tu verras souvent des petits budgets avec des scores plus hauts. 
                <strong>Parce qu'on préfère dormir tranquille que gagner 3 balles de plus.</strong>
              </p>
            </details>

            <details className="group rounded-2xl border p-5 transition-all open:shadow-md" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <summary className="flex cursor-pointer items-center justify-between font-sora font-bold">
                <span>Le score peut changer si je refais le test ?</span>
                <span className="text-xl transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-4 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                Carrément. Si aujourd'hui t'es plutôt « j'ai besoin d'un 
                aspirateur silencieux pour mon appart » et que dans 6 mois t'es 
                « j'ai une maison avec un labrador qui mue façon calendrier de 
                l'avent » — <strong>les scores changent avec toi.</strong> 
                Parce qu'un bon produit aujourd'hui peut être un mauvais produit 
                demain. Comme les relations. (Ok on arrête les métaphores amoureuses.)
              </p>
            </details>
          </div>
        </section>

        {/* ── CE QUI RENDE LE TROVIIO SCORE UNIQUE ── */}
        <section className="mt-24">
          <div
            className="relative overflow-hidden rounded-[2.5rem] border p-8 sm:p-12"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#FF6B5F] via-[#4257FF] to-[#3ED6A3]" />

            <div className="text-center">
              <span className="text-5xl">💎</span>
              <h2 className="mt-4 font-sora text-2xl font-bold tracking-tight sm:text-3xl">
                Ce qui rend le Troviio Score unique
              </h2>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                <p className="text-2xl mb-2">🫵</p>
                <h3 className="font-sora font-bold">Il est PERSONNALISÉ</h3>
                <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                  Pas une note générique. Chaque score est calculé pour TOI, avec TES critères, 
                  TON budget, TON mode de vie. Le même produit peut avoir 92 pour toi et 54 
                  pour ton voisin. Et c'est normal.
                </p>
              </div>
              <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                <p className="text-2xl mb-2">🔍</p>
                <h3 className="font-sora font-bold">Il est TRANSPARENT</h3>
                <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                  Chaque score vient avec son explication. Tu sais POURQUOI tel produit a 85 
                  et pas 72. On te cache rien. Pas d'algorithme mystérieux qui sort une note 
                  sortie de nulle part façon boîte noire.
                </p>
              </div>
              <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                <p className="text-2xl mb-2">🔄</p>
                <h3 className="font-sora font-bold">Il est DYNAMIQUE</h3>
                <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                  Tes besoins changent ? Le score change avec toi. Refais le test dans 6 mois, 
                  les résultats seront différents. On suit ton évolution.
                </p>
              </div>
              <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                <p className="text-2xl mb-2">🤖</p>
                <h3 className="font-sora font-bold">Il est HONNÊTE</h3>
                <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                  On gagne de l'argent si tu achètes via nos liens. Mais le score 
                  ne le sait même pas. <strong>L'IA qui calcule les scores ne voit 
                  pas les marges.</strong> Elle voit juste ton profil et les specs 
                  produits. Résultat : des recommandations intègres.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── VERDICT FINAL ── */}
        <section className="mt-24 text-center">
          <div className="rounded-[2rem] border p-8 sm:p-12" style={{ borderColor: "#FF6B5F/20", backgroundColor: "rgba(255,107,95,0.04)" }}>
            <span className="text-6xl">💘</span>
            <h2 className="mt-4 font-sora text-2xl font-bold tracking-tight sm:text-3xl">
              Le Troviio Score, en résumé
            </h2>
            <div className="mx-auto mt-6 max-w-xl space-y-4 text-base leading-8 text-left">
              <p>✅ <strong>Pas de note générique</strong> — chaque score est unique, comme toi. (Cringe mais vrai.)</p>
              <p>✅ <strong>3 piliers</strong> — adéquation profil, qualité intrinsèque, valeur perçue. La trinité du bon achat.</p>
              <p>✅ <strong>Transparent</strong> — tu sais pourquoi 85 et pas 72. On cache rien.</p>
              <p>✅ <strong>Désintéressé</strong> — les commissions Amazon ne touchent pas le score. Point.</p>
              <p>✅ <strong>/100</strong> — parce que l'amour, ça se mesure pas en dixièmes. (Oui on assume la punchline.)</p>
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B5F] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#e55a4d] transition"
            >
              Tester mon Troviio Score
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="mt-20 text-center">
          <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
            Tu veux savoir quel score tu fais ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8" style={{ color: "var(--text-muted)" }}>
            Pas de promesses vides. Pas de notes bateau. 
            Un vrai match calculé pour toi, par tes réponses.
            <br />3 questions et tu sauras.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B5F] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#e55a4d] transition"
          >
            Démarrer le chat Troviio
            <span>→</span>
          </Link>
          <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
            (Promis, on va pas te vendre de la poudre de perlimpinpin.)
          </p>
        </section>

        {/* ── FOOTER ── */}
        <footer className="mt-20 pb-6 text-center text-xs leading-7" style={{ color: "var(--text-muted)" }}>
          <p>
            Troviio participe au Programme Partenaires d'Amazon EU, mais ça n'influence 
            pas nos scores. On ne se vend pas. (Enfin, pas à ce point-là.)
          </p>
        </footer>
      </div>
    </main>
  );
}

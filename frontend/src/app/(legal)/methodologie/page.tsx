import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Méthodologie Troviio — comment on compare vraiment les produits (avec zéro bullshit)",
  description:
    "Transparence des algorithmes, critères de notation, classement — on te dit tout sur comment fonctionne Troviio. Promis, c'est pas chiant comme un document administratif.",
  alternates: { canonical: "https://troviio.com/methodologie" },
  openGraph: {
    title: "Méthodologie Troviio — l'envers du décor de votre comparateur préféré",
    description:
      "Comment on choisit les produits, comment l'IA calcule les scores, et pourquoi on peut dormir tranquille côté impartialité.",
    url: "https://troviio.com/methodologie",
    type: "website",
  },
};

export default function MethodologiePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

        {/* ── HERO ── */}
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B5F]/20 bg-[#FF6B5F]/10 px-3 py-1.5 text-sm font-semibold text-[#FF6B5F]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF6B5F]" />
            Transparence totale
          </span>
          <h1 className="mt-6 font-sora text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Comment on compare
            <br />
            <span className="text-[#FF6B5F]">vraiment</span> les produits
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8" style={{ color: "var(--text-muted)" }}>
            Conformément au Décret n° 2024-753, on est obligés de te dire comment on 
            fonctionne. Mais promis, <strong>on va pas te faire un cours de droit</strong>.
            Juste la vérité, avec un peu d'humour et zéro langue de bois.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm italic" style={{ color: "var(--text-muted)" }}>
            (Si tu veux la version juridique, elle est plus basse. Mais lis d'abord ça.)
          </p>
        </section>

        {/* ── COMMENT ÇA MARCHE VRAIMENT ── */}
        <section className="mt-24">
          <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
            En vrai, comment ça marche ?
          </h2>

          <div className="mt-8 flex flex-col gap-6">
            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF6B5F] text-sm font-bold text-white">1</span>
                <h3 className="font-sora text-lg font-bold">Tu parles, on prend des notes façon psy bienveillant</h3>
              </div>
              <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                Tu arrives, tu dis « je cherche une machine à café pour mes bureaux, 
                budget 500€ max, faut que ce soit rapide et pas trop prise de tête ». 
                Notre IA analyse ton langage, extrait les critères implicites (t'as dit 
                « bureaux » → besoin de capacité, t'as dit « pas prise de tête » → 
                entretien facile). <strong>Pendant ce temps, elle te pose des questions</strong> 
                pour affiner : Filtre à grains ou capsules ? Combien de tasses par jour ? 
                T'as une préférence de marque ou t'es open bar ?
              </p>
            </div>

            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4257FF] text-sm font-bold text-white">2</span>
                <h3 className="font-sora text-lg font-bold">On fouille notre base de 500+ produits</h3>
              </div>
              <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                Chaque produit a été épluché, noté, comparé. On a ses specs techniques, 
                ses notes moyennes, ses forces, <strong>ses défauts qu'on assume</strong>.
                On sort les candidats qui matchent tes critères. Si t'as dit « budget 
                500€ », on va pas te sortir une machine à 1200€. Ça parait évident ? 
                Tu serais surpris du nombre de sites qui le font.
              </p>
            </div>

            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3ED6A3] text-sm font-bold text-white">3</span>
                <h3 className="font-sora text-lg font-bold">L'IA calcule le match parfait</h3>
              </div>
              <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                C'est là que la magie opère. Notre IA analyse chaque produit candidat 
                selon <strong>3 piliers</strong> : adéquation à ton profil (60%), qualité 
                intrinsèque (25%), valeur perçue selon ton budget (15%). Elle pondère, 
                elle compare, elle élimine les incohérences. 
                Résultat : <strong>3 produits, avec un score d'affinité personnalisé</strong> 
                et une explication en français. Pas de boîte noire, pas de « l'algorithme 
                a décidé ». Tu sais pourquoi.
              </p>
            </div>

            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFB347] text-sm font-bold text-white">4</span>
                <h3 className="font-sora text-lg font-bold">Tu juges sur pièces</h3>
              </div>
              <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                Le verdict tombe : 3 produits avec leur Troviio Score, leurs points forts, 
                leurs petits défauts. Tu peux cliquer, comparer, ou relancer une recherche. 
                <strong>Zéro pression, zéro vente forcée.</strong> Si t'achètes via nos 
                liens Amazon, on touche une commission. Si tu passes par Leclerc, non. 
                Mais dans les deux cas, <strong>le score reste le même</strong>. Promis.
              </p>
            </div>
          </div>
        </section>

        {/* ── CRITÈRES — AVEC LEUR VRAIE PONDÉRATION ── */}
        <section className="mt-24">
          <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
            Les critères qu'on regarde (et leur vraie importance)
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
            (Parce que dire « on regarde tout » c'est un peu du flan)
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-sora font-bold">💶 Prix et budget</h3>
                <span className="rounded-full bg-[#FF6B5F]/15 px-3 py-1 text-xs font-bold text-[#FF6B5F]">Pondération variable</span>
              </div>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                Le prix tout seul ne veut rien dire. Un produit à 200€ peut être cher 
                pour ce que c'est, un produit à 800€ peut être une affaire. On regarde 
                le <strong>ratio qualité-prix selon TON budget</strong>. Si t'as 300€ 
                max, on va pas te mettre un produit à 290€ avec un score pourri juste 
                parce qu'il est dans ton budget.
              </p>
            </div>

            <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-sora font-bold">⚡ Performances et specs</h3>
                <span className="rounded-full bg-[#4257FF]/15 px-3 py-1 text-xs font-bold text-[#4257FF]">Pondération variable</span>
              </div>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                Puissance, autonomie, capacité, vitesse — les specs brutes. Mais on les 
                pondère selon ton usage. Si t'es un couple en appartement, la capacité 
                du réservoir est moins importante que le niveau sonore. Inversement si 
                t'es une famille de 6. <strong>L'IA ajuste en continu.</strong>
              </p>
            </div>

            <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-sora font-bold">⭐ Notes et avis utilisateurs</h3>
                <span className="rounded-full bg-[#3ED6A3]/15 px-3 py-1 text-xs font-bold text-[#3ED6A3]">Pondération variable</span>
              </div>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                On agrège les avis de plusieurs sources (Amazon, Boulanger, 
                forums). Mais on <strong>ne se fie pas à la note brute</strong>. Un produit 
                avec 4,5/10 mais 2000 avis est plus fiable qu'un avec 5/10 mais 12 avis 
                (peut-être les potes du fabricant). On regarde aussi les tendances : 
                si les avis récents sont moins bons que les vieux, ça sent le 
                problème de fiabilité.
              </p>
            </div>

            <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-sora font-bold">🔧 Fiabilité et durabilité</h3>
                <span className="rounded-full bg-[#FFB347]/15 px-3 py-1 text-xs font-bold text-[#FFB347]">Moins prioritaire</span>
              </div>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                On collecte les retours sur la fiabilité à long terme, le SAV, les 
                pannes fréquentes. Certaines marques ont une réputation — bonne ou 
                mauvaise — qui se vérifie dans les données. <strong>On ne met pas 
                un produit en avant juste parce qu'il est neuf et brillant.</strong>
              </p>
            </div>

            <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-sora font-bold">🌱 Éco-responsabilité</h3>
                <span className="rounded-full bg-[#3ED6A3]/15 px-3 py-1 text-xs font-bold text-[#3ED6A3]">Quand t'y es sensible</span>
              </div>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                Consommation énergétique, indice de réparabilité, matériaux recyclés. 
                Si tu nous dis pendant le chat que l'écologie t'importe, on pondère 
                ce critère plus fort. Sinon, on le garde en info mais il pèse moins. 
                <strong>On adapte le score à TES valeurs, pas aux nôtres.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* ── TRANSPARENCE FINANCIÈRE ── */}
        <section className="mt-24">
          <div className="rounded-[2rem] border p-6 sm:p-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💸</span>
              <h2 className="font-sora text-2xl font-bold tracking-tight">Comment on gagne notre vie (et pourquoi c'est pas un problème)</h2>
            </div>
            <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>
              On participe au <strong>Programme Partenaires d'Amazon EU</strong>. 
              Concrètement : si tu cliques sur nos liens et que tu achètes quelque chose 
              sur Amazon, on touche une commission (généralement entre 1% et 8% du prix).
            </p>
            <p className="mt-3 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
              <strong>Est-ce que ça influence les scores ?</strong> Non. Et on peut le 
              prouver : l'IA qui calcule tes recommandations <strong>ne voit même pas 
              les marges</strong>. Elle ne connaît que ton profil et les specs produits. 
              Si on trichait, on recommanderait systématiquement les produits les plus 
              chers (commission plus haute). Mais tu verras souvent des petits budgets 
              avec des scores élevés — <strong>parce qu'un bon match à 150€ mérite un 
              meilleur score qu'un mauvais match à 800€.</strong>
            </p>
            <p className="mt-3 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
              <strong>Et les marques ?</strong> Personne ne nous paie pour apparaître. 
              Zéro placement, zéro sponsoring, zéro produit mis en avant contre rémunération. 
              Si une marque veut figurer, elle doit passer par les mêmes critères que 
              tout le monde. <strong>Point barre.</strong>
            </p>
          </div>
        </section>

        {/* ── LIMITES — ON LES ASSUME ── */}
        <section className="mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🫤</span>
            <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
              Ce qu'on ne fait PAS (et on l'assume)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <h3 className="font-sora font-bold">❌ On n'a pas TOUS les produits</h3>
              <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                Notre catalogue fait 500+ produits, c'est déjà pas mal. Mais on n'a pas 
                tout le catalogue Amazon. Si tu cherches un produit très spécifique, 
                il se peut qu'il ne soit pas référencé. <strong>On grandit chaque mois.</strong>
              </p>
            </div>
            <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <h3 className="font-sora font-bold">❌ On ne teste pas physiquement les produits</h3>
              <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                On synthétise les tests et avis de sources sérieuses, mais on n'a pas 
                un labo avec 50 aspirateurs sous le coude. On fait confiance aux données 
                publiques, aux avis vérifiés, et aux tests indépendants. Si t'as une 
                expérience qui contredit nos données, <strong>on veut savoir</strong>.
              </p>
            </div>
            <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <h3 className="font-sora font-bold">❌ On n'est pas parfaits</h3>
              <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                Des bugs, il y en aura. Des scores qui semblent bizarres, des 
                recommandations à côté de la plaque. On corrige, on améliore, 
                on itère. <strong>C'est un work in progress, comme toi.</strong> 
                (Ok c'est ringard mais c'est vrai.)
              </p>
            </div>
          </div>
        </section>

        {/* ── MISE À JOUR ET CONTACT ── */}
        <section className="mt-24">
          <div
            className="rounded-[2rem] border p-6 sm:p-8 text-center"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <span className="text-3xl">📅</span>
            <h2 className="mt-3 font-sora text-xl font-bold tracking-tight">Mise à jour : janvier 2026</h2>
            <p className="mt-3 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
              Nos données sont mises à jour régulièrement. Les prix et disponibilités 
              sont actualisés quotidiennement. Les fiches produits sont révisées à 
              chaque nouveau modèle.
            </p>
            <p className="mt-3 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
              Une question ? Un doute ? Une data à signaler ?
              <br />
              <a href="mailto:bonjour@troviio.com" className="font-semibold text-[#FF6B5F] hover:underline">bonjour@troviio.com</a>
            </p>
          </div>
        </section>

        {/* ── SECTION RÉGLEMENTAIRE (pour les juristes) ── */}
        <section className="mt-16">
          <details className="group rounded-2xl border p-5 transition-all" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <summary className="flex cursor-pointer items-center justify-between font-sora font-bold text-sm">
              <span>⚖️ Version juridique — pour les avocats et les puristes</span>
              <span className="text-lg transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="mt-4 space-y-3 text-xs leading-7" style={{ color: "var(--text-muted)" }}>
              <p>
                <strong>Conformité réglementaire :</strong> Cette page est établie conformément 
                au <strong>Décret n° 2024-753</strong> du 1er juillet 2024 pris pour 
                l'application des articles L. 111-17 et L. 111-17-1 du Code de la consommation, 
                relatifs à la transparence des outils de comparaison en ligne.
              </p>
              <p>
                <strong>Présentation du service :</strong> Troviio est un comparateur en ligne 
                utilisant l'intelligence artificielle pour recommander des produits maison et tech. 
                Notre service fonctionne via un entretien conversationnel où l'utilisateur exprime 
                ses besoins et contraintes. L'IA analyse ces informations pour proposer les 
                produits les plus adaptés, selon les critères listés ci-dessus.
              </p>
              <p>
                <strong>Classement et impartialité :</strong> Le classement est entièrement 
                déterminé par l'adéquation entre les critères exprimés par l'utilisateur et 
                les caractéristiques des produits. Aucun partenaire commercial n'influence le 
                classement. Les relations d'affiliation sont clairement indiquées sur notre 
                page dédiée.
              </p>
              <p>
                <strong>Sources des données :</strong> Fiches techniques officielles des 
                fabricants, avis vérifiés et agrégés de sources multiples (Amazon, 
                Boulanger, forums), prix actualisés en temps réel via les flux des marchands 
                partenaires.
              </p>
              <p>
                <strong>Contact :</strong> Pour toute question sur notre méthodologie ou pour 
                signaler une inexactitude : <a href="mailto:bonjour@troviio.com" className="text-[#FF6B5F] underline">bonjour@troviio.com</a>.
              </p>
            </div>
          </details>
        </section>

        {/* ── CTA ── */}
        <section className="mt-20 text-center">
          <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
            Prêt à tester tout ça ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8" style={{ color: "var(--text-muted)" }}>
            Assez parlé de notre méthode. Viens l'essayer.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B5F] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#e55a4d] transition"
          >
            Démarrer le chat Troviio
            <span>→</span>
          </Link>
        </section>

        {/* ── FOOTER ── */}
        <footer className="mt-20 pb-6 text-center text-xs leading-7" style={{ color: "var(--text-muted)" }}>
          <p>
            Troviio participe au Programme Partenaires d'Amazon EU. Les liens d'affiliation 
            n'influencent en aucun cas nos scores ou recommandations. On dort mieux comme ça.
          </p>
        </footer>
      </div>
    </main>
  );
}

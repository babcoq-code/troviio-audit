import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comment Troviio calcule ses scores — La méthode derrière la magie | Troviio",
  description:
    "Le Troviio Score n'est pas une note comme les autres. Découvre comment on mesure l'affinité entre toi et un produit — avec du cœur, du code, et zéro bullshit marketing.",
  alternates: { canonical: "https://troviio.com/methode" },
  openGraph: {
    title: "La méthode Troviio — comment on calcule le vrai match produit-client",
    description:
      "Oublie les notes génériques. Le Troviio Score mesure l'affinité réelle entre ton mode de vie et un produit. Voici comment.",
    url: "https://troviio.com/methode",
    type: "website",
  },
};

export default function MethodePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* ── HERO ── */}
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B5F]/20 bg-[#FF6B5F]/10 px-3 py-1.5 text-sm font-semibold text-[#FF6B5F]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF6B5F]" />
            La méthode
          </span>
          <h1 className="mt-6 font-sora text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Comment on calcule vraiment
            <br />
            <span className="text-[#FF6B5F]">un match parfait</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8" style={{ color: "var(--text-muted)" }}>
            Chaque site te donne une note sur 10. On trouve ça un peu léger. 
            Nous, on a créé le <strong>Troviio Score</strong> : une mesure d'affinité réelle entre 
            <em> toi</em> et un produit. Pas de la poudre aux yeux, de l'amour computationnel.
          </p>
        </section>

        {/* ── LE PROBLÈME ── */}
        <section className="mt-20">
          <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
            Pourquoi les notes classiques, c'est un peu du flan
          </h2>
          <div className="mt-6 space-y-4 text-base leading-8" style={{ color: "var(--text)" }}>
            <p>
              « 8.5/10 — Excellent choix. » Super. Mais excellent pour qui ? Pour un étudiant 
              qui veut un aspirateur à 150 balles dans 20m², ou pour un parent de famille 
              nombreuse avec un chien qui mue et 120m² de carrelage ?
            </p>
            <p>
              <strong>Une note universelle n'existe pas.</strong> Parce que le bon produit 
              dépend de qui tu es, de comment tu vis, de ce qui t'énerve le matin.
            </p>
            <p>
              Alors on a créé la nôtre. Avec un seul principe : <strong>elle change 
              selon toi</strong>.
            </p>
          </div>
        </section>

        {/* ── LE TROVIIO SCORE ── */}
        <section className="mt-20">
          <div
            className="relative overflow-hidden rounded-[2.5rem] border p-8 shadow-lg sm:p-12"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF6B5F] via-[#4257FF] to-[#3ED6A3]" />

            <div className="flex flex-col items-center text-center">
              <span className="text-6xl">💘</span>
              <h2 className="mt-4 font-sora text-3xl font-bold tracking-tight sm:text-4xl">
                Le Troviio Score
              </h2>
              <p className="mt-2 font-sora text-lg font-semibold text-[#FF6B5F]">
                /100 — pas /10. Parce que l'amour ne se mesure pas en dixièmes.
              </p>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {/* Carte 1 */}
              <div className="rounded-2xl border p-6 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6B5F]/10 text-2xl">
                  🎯
                </div>
                <h3 className="mt-4 font-sora text-lg font-bold">Adéquation profil</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                  <strong className="text-[#FF6B5F]">60% du score.</strong> Est-ce que ce produit colle à ton 
                  mode de vie, ton budget, tes contraintes ? Un robot aspirateur génial 
                  mais trop grand pour ton studio, c'est un mauvais match, point.
                </p>
              </div>

              {/* Carte 2 */}
              <div className="rounded-2xl border p-6 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#4257FF]/10 text-2xl">
                  🏆
                </div>
                <h3 className="mt-4 font-sora text-lg font-bold">Qualité intrinsèque</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                  <strong className="text-[#4257FF]">25% du score.</strong> Notes, specs techniques, 
                  fiabilité, avis utilisateurs. On ne recommande pas un produit juste parce qu'il 
                  te plaît — il doit aussi être bon.
                </p>
              </div>

              {/* Carte 3 */}
              <div className="rounded-2xl border p-6 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#3ED6A3]/10 text-2xl">
                  💰
                </div>
                <h3 className="mt-4 font-sora text-lg font-bold">Valeur perçue</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                  <strong className="text-[#3ED6A3]">15% du score.</strong> Le rapport entre ce que 
                  tu paies et ce que tu reçois. Un produit à 2000 balles qui fait la même chose 
                  qu'un à 600€, ça sent le vol — notre score le reflète.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMMENT ÇA MARCHE ── */}
        <section className="mt-20">
          <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
            Concrètement, ça se passe comment ?
          </h2>
          <div className="mt-8 space-y-10">
            {/* Étape 1 */}
            <div className="flex gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF6B5F] text-sm font-bold text-white">
                1
              </div>
              <div>
                <h3 className="font-sora text-lg font-bold">Tu parles, on écoute</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                  Pendant le chat, on collecte bien plus que « je cherche un aspirateur ». 
                  Ton logement, tes habitudes, ton budget réel, tes traumas d'achat 
                  passés, tes priorités. Tout ça construit <strong>ton profil unique</strong>.
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="flex gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4257FF] text-sm font-bold text-white">
                2
              </div>
              <div>
                <h3 className="font-sora text-lg font-bold">On fouille notre base</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                  On compare tes critères à notre catalogue de 500+ produits testés et 
                  vérifiés. Chaque produit a ses specs, ses notes, ses forces et ses 
                  faiblesses. On garde les meilleurs candidats.
                </p>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="flex gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3ED6A3] text-sm font-bold text-white">
                3
              </div>
              <div>
                <h3 className="font-sora text-lg font-bold">L'IA calcule l'amour</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                  Une intelligence artificielle analyse chaque candidat selon les 3 
                  piliers du Troviio Score. Elle pondère, compare, élimine. 
                  Résultat : <strong>3 produits, chacun avec son score d'affinité</strong> 
                  et une explication en français. Pas de boîte noire.
                </p>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="flex gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFB347] text-sm font-bold text-white">
                4
              </div>
              <div>
                <h3 className="font-sora text-lg font-bold">Tu juges sur pièces</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                  Chaque recommandation arrive avec son Troviio Score, son explication 
                  personnalisée, ses points forts, ses petits défauts qu'on assume, ses 
                  specs clés. À toi de valider — ou de relancer une recherche.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── LEGENDE DES SCORES ── */}
        <section className="mt-20">
          <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
            Comment lire un Troviio Score
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#FF6B5F]/20 bg-[#FF6B5F]/5 p-5">
              <p className="text-center text-3xl">🔥</p>
              <p className="mt-2 text-center font-sora text-lg font-bold text-[#FF6B5F]">90-100</p>
              <p className="mt-1 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                Coup de foudre. Tu peux y aller les yeux fermés. Ce produit a été 
                conçu pour toi et ta situation.
              </p>
            </div>
            <div className="rounded-2xl border border-[#4257FF]/20 bg-[#4257FF]/5 p-5">
              <p className="text-center text-3xl">💙</p>
              <p className="mt-2 text-center font-sora text-lg font-bold text-[#4257FF]">75-89</p>
              <p className="mt-1 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                Âme sœur. Excellent choix, tu risques de l'adorer au quotidien. 
                Un des meilleurs rapports affinité/prix.
              </p>
            </div>
            <div className="rounded-2xl border border-[#3ED6A3]/20 bg-[#3ED6A3]/5 p-5">
              <p className="text-center text-3xl">💚</p>
              <p className="mt-2 text-center font-sora text-lg font-bold text-[#3ED6A3]">60-74</p>
              <p className="mt-1 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                Belle rencontre. Solide et fiable, mais peut-être pas LE coup de 
                cœur ultime. Bon plan.
              </p>
            </div>
            <div className="rounded-2xl border border-[#FFB347]/20 bg-[#FFB347]/5 p-5">
              <p className="text-center text-3xl">🧡</p>
              <p className="mt-2 text-center font-sora text-lg font-bold text-[#FFB347]">{'<'}60</p>
              <p className="mt-1 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                Ça peut le faire — ou pas. Regarde bien les points de vigilance. 
                Ce produit a des compromis à accepter.
              </p>
            </div>
          </div>
        </section>

        {/* ── TRANSPARENCE ── */}
        <section className="mt-20">
          <div
            className="rounded-[2rem] border p-6 sm:p-8"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
              Et le conflit d'intérêts dans tout ça ?
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8" style={{ color: "var(--text)" }}>
              <p>
                Bonne question. Oui, on gagne de l'argent via les liens Amazon si tu 
                achètes. Et non, ça n'influence pas le Troviio Score.
              </p>
              <p>
                <strong>Pourquoi on pourrait tricher ?</strong> Parce qu'un produit 
                plus cher nous rapporterait plus. <strong>Pourquoi on ne le fait pas ?</strong> 
                Parce qu'on tient à ce truc plus qu'à une commission. Si on te 
                recommande un truc nul, tu ne reviens pas. Et sans toi, on n'est rien.
              </p>
              <p>
                Notre algorithme ne voit même pas les marges. Il ne connaît que ton profil 
                et les données produits. Le reste, c'est entre toi et le bouton 
                « Voir le prix ».
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mt-20 text-center">
          <h2 className="font-sora text-2xl font-bold tracking-tight sm:text-3xl">
            Prêt à trouver ton match ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8" style={{ color: "var(--text-muted)" }}>
            Pas de note générique. Pas de bullshit. Un vrai score d'affinité 
            calculé pour toi, par toi, grâce à tes réponses.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B5F] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#e55a4d] transition"
          >
            Commencer le chat Troviio
            <span>→</span>
          </Link>
        </section>

        {/* ── FOOTER ── */}
        <footer className="mt-20 pb-6 text-center text-xs leading-7" style={{ color: "var(--text-muted)" }}>
          <p>
            Troviio participe au Programme Partenaires d'Amazon EU. Les liens 
            d'affiliation n'influencent en aucun cas nos scores ou recommandations.
          </p>
        </footer>
      </div>
    </main>
  );
}

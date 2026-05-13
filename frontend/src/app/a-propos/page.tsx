import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const pageUrl = "https://troviio.com/a-propos";

export const metadata = {
  title: `À propos — ${siteConfig.name}`,
  description: `Découvrez ${siteConfig.name} : notre mission, notre équipe et pourquoi nous avons créé le premier comparateur IA vraiment impartial.`,
  robots: { index: true, follow: true },
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `À propos — ${siteConfig.name}`,
    description: `Découvrez ${siteConfig.name} : notre mission, notre équipe et pourquoi nous avons créé le premier comparateur IA vraiment impartial.`,
    url: pageUrl,
    siteName: siteConfig.name,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `À propos — ${siteConfig.name}`,
    description: `Découvrez ${siteConfig.name} : notre mission, notre équipe et pourquoi nous avons créé le premier comparateur IA vraiment impartial.`,
  },
};

export default function AProposPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <Breadcrumbs
        crumbs={[
          { label: "Accueil", href: "/" },
          { label: "À propos" },
        ]}
      />
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <article>
          <header className="pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
            <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Notre histoire
            </p>
            <h1 className="mt-3 font-sora text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
              À propos de {siteConfig.name}
            </h1>
            <p className="mt-4 text-base leading-7" style={{ color: "var(--text-muted)" }}>
              Pas le meilleur. Le tien. — Nous avons créé {siteConfig.name} pour en finir avec les comparateurs biaisés.
            </p>
          </header>
          <div className="mt-8 space-y-8 text-base leading-8 [&_h2]:mt-10 [&_h2]:font-sora [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:first:mt-0 [&_ul]:space-y-3 [&_li]:ml-6 [&_li]:list-disc [&_a]:text-[#FF6B5F] [&_a]:hover:underline">
            <section>
              <h2>Notre mission</h2>
              <p>
                Choisir un produit aujourd'hui, c'est se noyer dans des centaines d'avis, 
                de comparatifs et de fiches techniques. Les comparateurs classiques affichent 
                des listes standardisées, souvent influencées par des partenariats commerciaux.
              </p>
              <p className="mt-4">
                {siteConfig.name} change la donne. Notre assistant IA ne se contente pas de 
                lister des produits : il <strong>dialogue avec vous</strong> pour comprendre 
                votre quotidien, vos contraintes et votre budget. Ensuite, il vous recommande 
                le produit qui vous correspond vraiment — pas celui qui rapporte le plus.
              </p>
            </section>

            <section>
              <h2>Notre approche</h2>
              <ul>
                <li><strong>Conversationnel :</strong> pas de formulaires à remplir, on discute.</li>
                <li><strong>Personnalisé :</strong> chaque recommandation est unique.</li>
                <li><strong>Indépendant :</strong> zéro influence des partenaires sur le classement.</li>
                <li><strong>Transparent :</strong> notre <a href="/methodologie">méthodologie</a> est publique et documentée.</li>
              </ul>
            </section>

            <section>
              <h2>Notre équipe</h2>
              <p>
                {siteConfig.name} est porté par <strong>{siteConfig.publisher.name}</strong>, 
                entrepreneur passionné par l'IA et la consommation responsable. Entouré d'une 
                équipe d'experts en data science, UX et e-commerce, nous travaillons chaque 
                jour pour rendre l'achat plus simple, plus juste et plus humain.
              </p>
            </section>

            <section>
              <h2>Nos engagements</h2>
              <ul>
                <li>Ne jamais recommander un produit pour des raisons commerciales.</li>
                <li>Respecter scrupuleusement vos données (voir notre <a href="/politique-confidentialite">politique de confidentialité</a>).</li>
                <li>Être totalement transparent sur notre modèle économique (voir <a href="/affiliation">Affiliation</a>).</li>
                <li>Améliorer continuellement notre IA grâce à vos retours.</li>
              </ul>
            </section>

            <section>
              <h2>Contact</h2>
              <p>
                Une question, une suggestion, une collaboration ? Écrivez-nous à{' '}
                <a href={`mailto:${siteConfig.publisherEmail}`}>{siteConfig.publisherEmail}</a>.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}

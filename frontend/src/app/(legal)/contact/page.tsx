import { siteConfig } from "@/lib/site";
import { LegalPage } from "@/components/legal/LegalPage";

const pageUrl = `https://troviio.com/contact`;

export const metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: `Contactez ${siteConfig.name} — une question, une suggestion, un problème ? Notre équipe vous répond dans les plus brefs délais.`,
  robots: { index: true, follow: true },
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `Contact — ${siteConfig.name}`,
    description: `Contactez ${siteConfig.name} — une question, une suggestion, un problème ? Notre équipe vous répond.`,
    url: pageUrl,
    siteName: siteConfig.name,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact — ${siteConfig.name}`,
    description: `Contactez ${siteConfig.name} — une question, une suggestion, un problème ? Notre équipe vous répond.`,
  },
};

export default function ContactPage() {
  const { name, publisherEmail } = siteConfig;
  return (
    <LegalPage
      title="Contact"
      updatedAt="2026-01-15"
      description={`Une question, une suggestion ou un problème ? L'équipe ${name} est là pour vous aider.`}
    >
      <h2>Comment nous contacter ?</h2>
      <p>
        Vous pouvez nous écrire à l'adresse email suivante :
      </p>
      <p>
        <a
          href={`mailto:${publisherEmail}`}
          className="text-[#FF6B5F] font-semibold hover:underline text-lg"
        >
          {publisherEmail}
        </a>
      </p>
      <p className="mt-4">
        Nous nous engageons à vous répondre sous 48 heures ouvrées maximum.
      </p>

      <h2>Pourquoi nous contacter ?</h2>
      <ul>
        <li>
          <strong>🤖 Problème avec une recommandation</strong> — Un produit
          recommandé ne correspond pas à votre recherche ? Signalez-le nous.
        </li>
        <li>
          <strong>🐛 Bug technique</strong> — Un dysfonctionnement sur le site,
          une page qui ne s'affiche pas correctement ?
        </li>
        <li>
          <strong>💡 Suggestion d'amélioration</strong> — Une idée pour rendre
          {name} encore plus utile ?
        </li>
        <li>
          <strong>📋 Partenariat</strong> — Vous êtes une marque ou un marchand
          et souhaitez référencer vos produits ?
        </li>
        <li>
          <strong>🔒 Données personnelles</strong> — Pour exercer vos droits
          RGPD (accès, rectification, suppression).
        </li>
      </ul>

      <h2>Où nous trouver ?</h2>
      <p>
        {siteConfig.publisher.name}
        <br />
        {siteConfig.publisher.address}
        <br />
        {siteConfig.publisher.postalCode} {siteConfig.publisher.city},{' '}
        {siteConfig.publisher.country}
      </p>

      <h2>Réseaux sociaux</h2>
      <p>
        Pour suivre l'actualité de {name} et nos dernières recommandations,
        retrouvez-nous sur les réseaux sociaux (liens à venir).
      </p>
    </LegalPage>
  );
}

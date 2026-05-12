import { siteConfig } from "@/lib/site";
import { LegalPage } from "@/components/legal/LegalPage";

const pageUrl = `https://troviio.com/cgv`;

export const metadata = {
  title: `Conditions Générales de Vente — ${siteConfig.name}`,
  description: `Conditions Générales de Vente de ${siteConfig.name} — fonctionnement du service de recommandation IA, liens d'affiliation et transparence.`,
  robots: { index: true, follow: true },
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `Conditions Générales de Vente — ${siteConfig.name}`,
    description: `Conditions Générales de Vente de ${siteConfig.name} — fonctionnement du service de recommandation IA, liens d'affiliation et transparence.`,
    url: pageUrl,
    siteName: siteConfig.name,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Conditions Générales de Vente — ${siteConfig.name}`,
    description: `Conditions Générales de Vente de ${siteConfig.name} — fonctionnement du service de recommandation IA, liens d'affiliation et transparence.`,
  },
};

export default function CgvPage() {
  const { name, url, publisherEmail, publisher } = siteConfig;
  return (
    <LegalPage
      title="Conditions Générales de Vente"
      updatedAt="2026-01-15"
      description={`Les présentes Conditions Générales de Vente régissent l'utilisation du service de recommandation ${name}.`}
    >
      <h2>1. Objet du service</h2>
      <p>
        <strong>{name}</strong> est un service de recommandation de produits
        utilisant l'intelligence artificielle. Notre rôle est de vous
        recommander le produit le plus adapté à vos besoins grâce à un assistant
        conversationnel. <strong>{name} n'est pas un vendeur direct</strong> et
        n'effectue aucune vente de produits en son nom propre. Les transactions
        d'achat sont réalisées exclusivement auprès des marchands partenaires
        vers lesquels nous vous redirigeons.
      </p>

      <h2>2. Conditions d'utilisation du service</h2>
      <p>
        L'accès au service est gratuit. En utilisant {name}, vous déclarez
        avoir pris connaissance des présentes CGV et les accepter sans réserve.
        Le service est réservé aux personnes majeures capables de contracter.
      </p>
      <ul>
        <li>
          Les informations que vous fournissez lors de l'entretien
          conversationnel (besoins, budget, critères) sont utilisées uniquement
          pour affiner les recommandations.
        </li>
        <li>
          Vous vous engagez à ne pas utiliser le service à des fins frauduleuses
          ou contraires à la loi.
        </li>
        <li>
          {name} se réserve le droit de modifier ou d'interrompre le service à
          tout moment, sans préavis.
        </li>
      </ul>

      <h2>3. Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur {url} (textes, graphismes, logos,
        icônes, algorithmes, base de données) est la propriété exclusive de{' '}
        {publisher.name} ou de ses partenaires. Toute reproduction,
        représentation, modification ou exploitation, totale ou partielle, sans
        autorisation préalable écrite est interdite, conformément aux articles
        L. 335-2 et suivants du Code de la propriété intellectuelle.
      </p>

      <h2>4. Responsabilité</h2>
      <p>
        {name} s'efforce d'assurer l'exactitude et la pertinence des
        recommandations fournies par son IA. Cependant, nous ne pouvons garantir
        l'exhaustivité, l'exactitude ou l'actualité des informations diffusées.
        Les recommandations sont fournies à titre indicatif et ne constituent
        pas un conseil contractuel.
      </p>
      <ul>
        <li>
          {name} ne saurait être tenu responsable des dommages directs ou
          indirects résultant de l'utilisation du service ou des décisions
          d'achat prises sur la base de ses recommandations.
        </li>
        <li>
          Les prix et disponibilités des produits sont fournis par les marchands
          partenaires. {name} ne peut garantir leur exactitude en temps réel.
        </li>
        <li>
          En cas de litige avec un marchand partenaire (livraison, SAV,
          garantie), le traitement relève de la responsabilité exclusive du
          marchand concerné.
        </li>
      </ul>

      <h2>5. Liens d'affiliation — Transparence</h2>
      <p>
        {name} participe au Programme Partenaires d'Amazon EU ainsi qu'à
        d'autres réseaux d'affiliation. Lorsque vous cliquez sur un lien
        présent sur le site et effectuez un achat chez l'un de nos partenaires,
        nous percevons une commission. Cette commission est versée par le
        marchand et <strong>n'augmente en aucun cas le prix que vous payez</strong>.
      </p>
      <ul>
        <li>
          Les liens d'affiliation sont clairement identifiables et n'influencent
          en aucun cas nos recommandations ou classements.
        </li>
        <li>
          Notre IA de recommandation n'a pas accès aux données de rémunération
          des affiliations. Les scores sont calculés uniquement sur la base de
          l'adéquation entre vos besoins et les caractéristiques des produits.
        </li>
      </ul>

      <h2>6. Droit de rétractation</h2>
      <p>
        Conformément à l'article L. 221-28 du Code de la consommation, le droit
        de rétractation <strong>ne s'applique pas</strong> au service fourni par{' '}
        {name}, étant donné que :
      </p>
      <ul>
        <li>
          {name} ne vend pas de produits directement et n'effectue aucune
          transaction commerciale directe avec l'utilisateur.
        </li>
        <li>
          Le service fourni (recommandation IA) est exécuté immédiatement après
          la demande de l'utilisateur et est pleinement consommé au moment de la
          fourniture des résultats.
        </li>
      </ul>
      <p>
        Pour tout achat effectué auprès d'un marchand partenaire, les
        conditions de rétractation applicables sont celles du marchand
        concerné, conformément à la législation en vigueur.
      </p>

      <h2>7. Données personnelles</h2>
      <p>
        Le traitement de vos données personnelles est régi par notre{' '}
        <a href="/politique-confidentialite">Politique de confidentialité</a>.
        Vous disposez d'un droit d'accès, de rectification et de suppression de
        vos données.
      </p>

      <h2>8. Droit applicable et litiges</h2>
      <p>
        Les présentes CGV sont régies par le droit français. En cas de litige,
        les parties s'efforceront de trouver une solution amiable. À défaut, les
        tribunaux compétents seront ceux du ressort du siège social de{' '}
        {publisher.name}.
      </p>

      <h2>9. Contact</h2>
      <p>
        Pour toute question relative aux présentes Conditions Générales de
        Vente, vous pouvez nous contacter à l'adresse suivante :{' '}
        <a href={`mailto:${publisherEmail}`}>{publisherEmail}</a>.
      </p>
    </LegalPage>
  );
}

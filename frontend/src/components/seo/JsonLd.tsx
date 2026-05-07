interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  const jsonLd = { "@context": "https://schema.org", ...data };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url?: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function buildFAQJsonLd(questions: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": "https://troviio.com/#organization",
    name: "Troviio",
    url: "https://troviio.com",
    logo: {
      "@type": "ImageObject",
      "@id": "https://troviio.com/#logo",
      url: "https://troviio.com/logo.png",
      width: 512,
      height: 512,
      caption: "Troviio",
    },
    description:
      "Comparateur de produits propulsé par l'IA — recommandations personnalisées pour les consommateurs français.",
    foundingDate: "2025",
    areaServed: { "@type": "Country", name: "France" },
    inLanguage: "fr-FR",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "contact@troviio.com",
        availableLanguage: ["French"],
      },
    ],
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": "https://troviio.com/#website",
    name: "Troviio",
    url: "https://troviio.com",
    publisher: { "@id": "https://troviio.com/#organization" },
    inLanguage: "fr-FR",
    description: "Pas le meilleur. Le tien. Recommandations produits personnalisées par IA.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://troviio.com/recherche?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

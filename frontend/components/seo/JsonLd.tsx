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

export function buildWebSiteJsonLd() {
  return {
    "@type": "WebSite",
    name: "Troviio",
    url: "https://www.troviio.com",
    description: "Pas le meilleur. Le tien. Recommandations produits personnalisées par IA.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.troviio.com/recherche?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

"use client";

import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (!crumbs || crumbs.length === 0) return null;

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `https://www.troviio.com${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      <nav
        className="mb-6 text-xs sm:text-sm truncate"
        style={{ color: "var(--text-muted)" }}
        aria-label="Fil d'Ariane"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li
                key={`${crumb.label}-${i}`}
                className="flex items-center gap-1.5 min-w-0"
              >
                {i > 0 && <span className="shrink-0">/</span>}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:underline truncate"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate max-w-[180px] sm:max-w-none">
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

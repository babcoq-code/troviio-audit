import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  updatedAt: string;
  description?: string;
  children: ReactNode;
};

export function LegalPage({ title, updatedAt, description, children }: LegalPageProps) {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  }).format(new Date(updatedAt));
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <article>
          <header className="pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
            <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Informations légales
            </p>
            <h1 className="mt-3 font-sora text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl" style={{ color: "var(--text)" }}>
              {title}
            </h1>
            {description && (
              <p className="mt-4 text-base leading-7" style={{ color: "var(--text-muted)" }}>
                {description}
              </p>
            )}
            <p className="mt-5 text-sm" style={{ color: "var(--text-muted)" }}>
              Dernière mise à jour : <time dateTime={updatedAt}>{formattedDate}</time>
            </p>
          </header>
          <div className="legal-content mt-8 space-y-8 text-base leading-8" style={{ color: "var(--text)" }}>
            {children}
          </div>
        </article>
      </div>
    </main>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";
import { LegalNavigation } from "@/components/legal/LegalNavigation";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav aria-label="Fil d'Ariane" className="mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="transition hover:text-[#FF6B5F]" style={{ color: "var(--text-muted)" }}>Accueil</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium" style={{ color: "var(--text)" }}>Infos</li>
          </ol>
        </nav>
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-8"><LegalNavigation /></aside>
          <section
            className="rounded-3xl border px-5 py-8 shadow-sm sm:px-8 lg:px-12"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}

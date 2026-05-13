"use client";

import Link from "next/link";
import LogoTroviio from "@/components/LogoTroviio";
import NewsletterSignup from "@/components/NewsletterSignup";

const POPULAR_CATEGORIES = [
  { label: "Robot aspirateur", href: "/c/aspirateur-robot" },
  { label: "Machine à café", href: "/c/machine-a-cafe" },
  { label: "Smartphone", href: "/c/smartphone" },
  { label: "Casque audio", href: "/c/casque-audio" },
  { label: "TV OLED", href: "/c/tv" },
  { label: "Matelas", href: "/c/matelas" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="pt-16 pb-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* 4-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* COL 1 — Troviio */}
          <div className="space-y-4">
            <Link href="/">
              <LogoTroviio size={30} />
            </Link>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Pas le meilleur. Le tien. Toujours.<br />
              L&apos;IA qui trouve le produit parfait pour toi,
              même si tu ne sais pas exactement ce que tu veux.
            </p>
            <p className="text-xs flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "var(--mint)" }} />
              Indépendant · Sans inscription · 24/7
            </p>
            <div className="pt-2 space-y-2 text-sm">
              {[
                { label: "🧪 Méthodologie", href: "/methodologie" },
                { label: "📦 Catalogue", href: "/catalogue" },
                { label: "⚔️ Duels", href: "/duels" },
                { label: "📧 Contact", href: "mailto:contact@troviio.com" },
              ].map((l) => (
                <div key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--coral)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                  >
                    {l.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* COL 2 — Catégories populaires */}
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ color: "var(--text)" }}>
              Catégories populaires
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
              {POPULAR_CATEGORIES.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--coral)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3 — Légal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ color: "var(--text)" }}>
              Légal
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
              {[
                { label: "Mentions légales", href: "/mentions-legales" },
                { label: "Confidentialité", href: "/politique-confidentialite" },
                { label: "Cookies", href: "/cookies" },
                { label: "CGV", href: "/cgv" },
                { label: "Contact", href: "/contact" },
                { label: "Blog", href: "/blog" },
                { label: "Affiliation", href: "/affiliation" },
                { label: "À propos", href: "/a-propos" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--coral)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4 — Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ color: "var(--text)" }}>
              Newsletter
            </h4>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
              Le Top 3 du mois, dans ta boîte mail. Un email par mois, zéro spam.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-12 pt-10" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { emoji: "💰", title: "100% Gratuit", desc: "Accès à tout le site. Zéro abonnement, zéro paywall." },
              { emoji: "🔐", title: "Sans inscription", desc: "Pas besoin de compte. Tu arrives, tu compares, tu repars." },
              { emoji: "🔗", title: "Liens transparents", desc: "Liens affiliés (commissions si achat). Toujours indiqué." },
              { emoji: "🤖", title: "IA Indépendante", desc: "Aucune marque ne paie pour être recommandée." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div
                  className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  <span className="text-lg">{item.emoji}</span>
                </div>
                <h4 className="text-sm font-semibold" style={{ color: "var(--text)" }}>{item.title}</h4>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          <p>© {year} Troviio. Tous droits réservés.</p>
          <p className="mt-2 md:mt-0">Fait avec ❤️ en France</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import LogoTroviio from "@/components/LogoTroviio";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/">
            <LogoTroviio size={30} />
          </Link>
          <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
            Pas le meilleur. Le tien. Toujours.<br />
            L'IA qui trouve le produit parfait pour toi,
            même si tu ne sais pas exactement ce que tu veux.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            ✅ Indépendant · ✅ Sans inscription · ✅ 24/7
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold mb-4" style={{ color: "var(--text)" }}>Navigation</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {[
              ["/a-propos", "À propos"],
              ["/methodologie", "Méthodologie"],
              ["/affiliation", "Affiliation"],
              ["/guide", "Guides d'achat"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:underline transition-colors"
                      style={{ color: "var(--text-muted)" }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Légal */}
        <div>
          <h4 className="font-semibold mb-4" style={{ color: "var(--text)" }}>Légal</h4>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {[
              ["/mentions-legales", "Mentions légales"],
              ["/politique-confidentialite", "Confidentialité"],
              ["/cookies", "Cookies"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:underline">{label}</Link>
              </li>
            ))}
            <li className="pt-2">
              <a href="mailto:contact@troviio.com" style={{ color: "var(--coral)" }} className="font-medium">
                contact@troviio.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bloc confiance : gratuit, sans inscription, liens transparents, IA indé */}
      <div className="max-w-7xl mx-auto mt-12 pt-10"
           style={{ borderTop: "1px solid var(--border)" }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full"
                 style={{ backgroundColor: "var(--accent-bg)" }}>
              <span className="text-lg">💰</span>
            </div>
            <h4 className="text-sm font-semibold" style={{ color: "var(--text)" }}>100% Gratuit</h4>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Accès à tout le site. Zéro abonnement, zéro paywall.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full"
                 style={{ backgroundColor: "var(--accent-bg)" }}>
              <span className="text-lg">🔐</span>
            </div>
            <h4 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Sans inscription</h4>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Pas besoin de compte. Tu arrives, tu compares, tu repars.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full"
                 style={{ backgroundColor: "var(--accent-bg)" }}>
              <span className="text-lg">🔗</span>
            </div>
            <h4 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Liens transparents</h4>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Liens affiliés (commissions si achat). Toujours indiqué, jamais caché.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full"
                 style={{ backgroundColor: "var(--accent-bg)" }}>
              <span className="text-lg">🤖</span>
            </div>
            <h4 className="text-sm font-semibold" style={{ color: "var(--text)" }}>IA Indépendante</h4>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Aucune marque ne paie pour être recommandée. Classement sans conflit.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs border-t"
           style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <p>© {year} Troviio. Tous droits réservés.</p>
        <p className="mt-2 md:mt-0">Fait avec ❤️ en France</p>
      </div>
    </footer>
  );
}

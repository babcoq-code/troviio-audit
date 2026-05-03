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

      <div className="mt-10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs border-t"
           style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <p>© {year} Troviio. Tous droits réservés.</p>
        <p className="mt-2 md:mt-0">Fait avec ❤️ en France</p>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: "#0A0A0B" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/">
            <span className="font-bold text-2xl" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
              <span style={{ color: "#FF6B2B" }}>T</span>
              <span style={{ color: "#FAFAFA" }}>roviio</span>
            </span>
          </Link>
          <p className="text-sm max-w-xs" style={{ color: "rgba(250,250,250,0.55)" }}>
            L'IA qui comprend ta vie pour trouver LE produit qui te correspond. Zéro biais, zéro commission cachée.
          </p>
          <p className="text-xs" style={{ color: "rgba(250,250,250,0.3)" }}>
            ✅ Indépendant · ✅ Sans inscription · ✅ 24/7
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold mb-4" style={{ color: "#FAFAFA" }}>Navigation</h4>
          <ul className="space-y-2 text-sm" style={{ color: "rgba(250,250,250,0.65)" }}>
            {[
              ["/a-propos", "À propos"],
              ["/methodologie", "Méthodologie"],
              ["/affiliation", "Affiliation"],
              ["/guide", "Guides d'achat"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:underline transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B2B")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(250,250,250,0.65)")}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Légal */}
        <div>
          <h4 className="font-semibold mb-4" style={{ color: "#FAFAFA" }}>Légal</h4>
          <ul className="space-y-2 text-sm" style={{ color: "rgba(250,250,250,0.65)" }}>
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
              <a href="mailto:contact@troviio.com" style={{ color: "#FF6B2B" }} className="font-medium">
                contact@troviio.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs"
           style={{ color: "rgba(250,250,250,0.3)" }}>
        <p>© {year} Troviio. Tous droits réservés.</p>
        <p className="mt-2 md:mt-0">Fait avec ❤️ en France</p>
      </div>
    </footer>
  );
}

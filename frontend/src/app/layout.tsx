import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import { UmamiAnalytics } from "@/components/UmamiAnalytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd, buildWebSiteJsonLd } from "@/components/seo/JsonLd";

// Force dynamic to avoid _not-found static generation bug with React 19
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Troviio | Pas le meilleur. Le tien.",
  description:
    "Troviio ne compare pas les produits. Il comprend ta vie, tes contraintes et ton budget pour te recommander LE produit qui te correspond. Zéro biais, zéro commission.",
  icons: { icon: "/logo-icon.svg" },
  metadataBase: new URL("https://www.troviio.com"),
  alternates: { canonical: "https://www.troviio.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <JsonLd data={buildWebSiteJsonLd()} />
      </head>
      <body className="min-h-screen flex flex-col">
        <UmamiAnalytics />
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}

import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import { UmamiAnalytics } from "@/components/UmamiAnalytics";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd, buildWebSiteJsonLd } from "@/components/seo/JsonLd";

// Force dynamic to avoid _not-found static generation bug with React 19
export const dynamic = "force-dynamic";

const defaultOgImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  type: "image/png",
};

export const metadata = {
  title: "Troviio | Pas le meilleur. Le tien.",
  description:
    "Troviio ne compare pas les produits. Il comprend ta vie, tes contraintes et ton budget pour te recommander LE produit qui te correspond. Zéro biais, zéro commission.",
  icons: { icon: "/logo-icon.svg" },
  metadataBase: new URL("https://www.troviio.com"),
  alternates: { canonical: "https://www.troviio.com" },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  openGraph: {
    siteName: "Troviio",
    locale: "fr_FR",
    type: "website",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@700;800;900&display=swap" rel="stylesheet" />
        <JsonLd data={buildWebSiteJsonLd()} />
      </head>
      <body className="min-h-screen flex flex-col">
        <GoogleAnalytics />
        <UmamiAnalytics />
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}

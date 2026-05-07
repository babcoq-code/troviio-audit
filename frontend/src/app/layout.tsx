import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import { UmamiAnalytics } from "@/components/UmamiAnalytics";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import ClarityScript from "@/components/analytics/ClarityScript";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import TrustBar from "@/components/TrustBar";
import { JsonLd, buildWebSiteJsonLd, buildOrganizationJsonLd } from "@/components/seo/JsonLd";

// Force dynamic to avoid _not-found static generation bug with React 19
export const dynamic = "force-dynamic";

const defaultOgImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  type: "image/png",
};

export async function generateMetadata() {
  return {
    metadataBase: new URL("https://troviio.com"),
    title: {
      default: "Troviio | Pas le meilleur. Le tien.",
      template: "%s — Troviio",
    },
    alternates: {
      canonical: "/",
    },
    description:
      "Troviio ne compare pas les produits. Il comprend ta vie, tes contraintes et ton budget pour te recommander LE produit qui te correspond. Zéro biais, zéro commission.",
    icons: { icon: "/logo-icon.svg" },
    openGraph: {
      title: "Troviio | Pas le meilleur. Le tien.",
      description:
        "Décris ta vie, tes contraintes, ton budget. L'IA qui trouve le produit parfait pour toi.",
      siteName: "Troviio",
      locale: "fr_FR",
      url: "https://troviio.com",
      type: "website",
      images: [{
        url: "https://troviio.com/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Troviio | Pas le meilleur. Le tien.",
      description:
        "Décris ta vie, tes contraintes, ton budget. L'IA qui trouve le produit parfait pour toi.",
      images: [{
        url: "https://troviio.com/og-image.png",
        width: 1200,
        height: 630,
      }],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@700;800;900&display=swap" rel="stylesheet" />
        <meta property="og:image" content="https://troviio.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://troviio.com/og-image.png" />
        <JsonLd data={buildOrganizationJsonLd()} />
        <JsonLd data={buildWebSiteJsonLd()} />
      </head>
      <body className="min-h-screen flex flex-col">
        <GoogleAnalytics />
        <UmamiAnalytics />
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <CookieBanner />
        <ClarityScript trackingId={process.env.NEXT_PUBLIC_CLARITY_ID ?? ""} />
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}

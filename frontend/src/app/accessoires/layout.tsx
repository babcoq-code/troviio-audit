import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Accessoires Troviio — IA trouve l'accessoire qu'il te faut",
  description:
    "Tu as un appareil et tu cherches l'accessoire parfait ? Notre IA te recommande les meilleurs accessoires compatibles. Gratuit, sans pub.",
  openGraph: {
    title: "Chat Accessoires Troviio — IA trouve l'accessoire qu'il te faut",
    description:
      "Tu as un appareil et tu cherches l'accessoire parfait ? Notre IA te recommande les meilleurs accessoires compatibles.",
    siteName: "Troviio",
    locale: "fr_FR",
    url: "https://troviio.com/accessoires/chat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat Accessoires Troviio — IA trouve l'accessoire qu'il te faut",
    description:
      "Notre IA te recommande les meilleurs accessoires compatibles avec ton appareil.",
  },
  alternates: {
    canonical: "https://troviio.com/accessoires/chat",
  },
};

export default function AccessoiresLayout({ children }: { children: React.ReactNode }) {
  return children;
}

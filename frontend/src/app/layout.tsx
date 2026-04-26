import "./globals.css";

export const metadata = {
  title: "Picksy | Pas le meilleur. Le tien.",
  description:
    "Picksy ne compare pas les produits. Il comprend ta vie, tes contraintes et ton budget pour te recommander LE produit qui te correspond. Zéro biais, zéro commission.",
  icons: { icon: "/logo-icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}

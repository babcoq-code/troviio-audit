import "./globals.css";

export const metadata = {
  title: "Picksy — L'IA anti-regret pour tes achats maison",
  description: "Dis-nous ce que tu cherches, notre IA analyse des milliers d'avis pour te recommander le meilleur rapport qualité-prix.",
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
      <body>
        {children}
      </body>
    </html>
  );
}

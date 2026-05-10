import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  srcDir: "src",
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  webpack: (config: any) => config,
  serverExternalPackages: [],
  outputFileTracingExcludes: {
    "/*": [".next/static/**/*"],
  },
  async redirects() {
    return [
      {
        source: '/categories',
        destination: '/',
        permanent: false,
      },
      // Redirection: /categorie/X → /c/X
      {
        source: '/categorie/:slug(.*)',
        destination: '/c/:slug',
        permanent: true,
      },
      // Redirection: /c/tv-oled → /c/tv
      {
        source: '/c/tv-oled',
        destination: '/c/tv',
        permanent: true,
      },
      // Redirection: /tops/meilleur-smartphone → /c/smartphone (top page smartphone doesn't exist)
      {
        source: '/tops/meilleur-smartphone',
        destination: '/c/smartphone',
        permanent: true,
      },
      // Redirection: duel thermomix non généré en standalone
      {
        source: '/duel/thermomix-tm7-vs-kitchenaid-artisan',
        destination: '/duels',
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

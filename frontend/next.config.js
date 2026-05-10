/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: '/categories',
        destination: '/',
        permanent: false,
      },
      {
        source: '/categorie/:slug*',
        destination: '/c/:slug*',
        permanent: true,
      },
      {
        source: '/categories/:slug*',
        destination: '/c/:slug*',
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
      // Redirection: duel samsung vs iphone non généré en standalone
      {
        source: '/duel/samsung-galaxy-s26-ultra-vs-iphone-17-pro-max',
        destination: '/duels',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

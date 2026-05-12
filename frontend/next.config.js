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
      // Redirection: /categorie/X → /c/X
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
      // Redirection: /tops/X → /tops/meilleur-X (canonical form for top pages)
      {
        source: '/tops/aspirateur-robot',
        destination: '/tops/meilleur-aspirateur-robot',
        permanent: true,
      },
      {
        source: '/tops/aspirateur-balai',
        destination: '/tops/meilleur-aspirateur-balai',
        permanent: true,
      },
      {
        source: '/tops/robot-cuisine',
        destination: '/tops/meilleur-robot-cuisine',
        permanent: true,
      },
      {
        source: '/tops/casque-audio',
        destination: '/tops/meilleur-casque-audio',
        permanent: true,
      },
      {
        source: '/tops/bureau-electrique',
        destination: '/tops/meilleur-bureau-electrique',
        permanent: true,
      },
      {
        source: '/tops/clavier-gaming',
        destination: '/tops/meilleur-clavier-gaming',
        permanent: true,
      },
      {
        source: '/tops/friteuse-air',
        destination: '/tops/meilleure-friteuse-air',
        permanent: true,
      },
      {
        source: '/tops/machine-a-cafe',
        destination: '/tops/meilleure-machine-a-cafe',
        permanent: true,
      },
      {
        source: '/tops/montre-connectee',
        destination: '/tops/meilleure-montre-connectee',
        permanent: true,
      },
      {
        source: '/tops/station-accueil-usbc',
        destination: '/tops/meilleure-station-accueil-usbc',
        permanent: true,
      },
      {
        source: '/tops/tv',
        destination: '/tops/meilleure-tv',
        permanent: true,
      },
      {
        source: '/tops/voiture-electrique',
        destination: '/tops/meilleure-voiture-electrique',
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
      // Redirection: /about → /a-propos
      {
        source: '/about',
        destination: '/a-propos',
        permanent: true,
      },
      // Redirection: /weekly1 → /
      {
        source: '/weekly1',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

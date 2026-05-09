/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['images.icecat.biz', 'm.media-amazon.com'],
  },
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
    ]
  },
}

module.exports = nextConfig

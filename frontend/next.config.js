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
    ]
  },
}

module.exports = nextConfig

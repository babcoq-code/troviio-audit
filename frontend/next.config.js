/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['images.icecat.biz', 'm.media-amazon.com'],
  },
}

module.exports = nextConfig

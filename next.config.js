/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'placehold.co'],
  },
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/KZ-UniVerse' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/KZ-UniVerse' : '',
}

module.exports = nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'placehold.co'],
    unoptimized: true, // Для static export
  },
  output: 'export', // Для GitHub Pages
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/KZ-UniVerse' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/KZ-UniVerse' : '',
  // Оптимизация
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig


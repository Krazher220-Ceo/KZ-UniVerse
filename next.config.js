/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'placehold.co'],
    unoptimized: true, // Для static export
  },
  // Убираем static export для работы API routes
  // output: 'export', // Закомментировано для работы API
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


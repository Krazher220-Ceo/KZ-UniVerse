/** @type {import('next').NextConfig} */
// Определяем платформу: Vercel или GitHub Pages
const isVercel = !!process.env.VERCEL;
const isGitHubPages = process.env.GITHUB_PAGES === 'true' || (!isVercel && process.env.NODE_ENV === 'production');

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'placehold.co'],
    // На Vercel используем оптимизацию, на GitHub Pages - нет
    unoptimized: isGitHubPages,
  },
  // Static export только для GitHub Pages
  ...(isGitHubPages && !isVercel ? { output: 'export' } : {}),
  trailingSlash: true,
  // basePath только для GitHub Pages
  ...(isGitHubPages && !isVercel ? {
    basePath: '/KZ-UniVerse',
    assetPrefix: '/KZ-UniVerse',
  } : {}),
  // Оптимизация
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig


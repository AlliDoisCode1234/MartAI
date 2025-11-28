/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Only ignore during builds in CI if needed, otherwise fix linting errors
    ignoreDuringBuilds: process.env.CI === 'true' ? false : false,
  },
  typescript: {
    // Fail build on TypeScript errors in production
    ignoreBuildErrors: false,
  },
  // Security: Disable X-Powered-By header
  poweredByHeader: false,
  // Headers are handled by middleware.ts for more control
  
  // Optimize images
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Security: Disable X-Powered-By header
  poweredByHeader: false,
  // Headers are handled by middleware.ts for more control
};

module.exports = nextConfig;


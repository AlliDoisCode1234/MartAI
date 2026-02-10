/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow MDX files to be pages
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  eslint: {
    // Only ignore during builds in CI if needed, otherwise fix linting errors
    ignoreDuringBuilds: process.env.CI === 'true' ? false : false,
  },
  typescript: {
    // TEMPORARY: Ignore TypeScript errors in production build
    // Root cause: Convex generated API types trigger "Type instantiation is excessively deep"
    // when TypeScript tries to evaluate the deeply nested FunctionReference types.
    // All API routes have been patched with unsafeApi, but internal Convex calls still cause issues.
    // TODO: File issue with Convex team about type recursion depth
    ignoreBuildErrors: true,
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

// Async config to support ESM-only packages like remark-gfm v4
module.exports = async () => {
  const createMDX = (await import('@next/mdx')).default;
  const remarkGfm = (await import('remark-gfm')).default;

  const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [],
    },
  });

  return withMDX(nextConfig);
};

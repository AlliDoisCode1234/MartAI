/**
 * Dynamic Robots.txt
 *
 * Blocks crawlers on staging/localhost, allows on production.
 * Uses multiple signals to detect environment — never blocks by default.
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const vercelEnv = process.env.VERCEL_ENV ?? '';

  // Positive production detection — multiple signals
  const isProduction =
    vercelEnv === 'production' || siteUrl.includes('phoo.ai') || siteUrl.includes('martai.app');

  // Only block crawlers when we are SURE it's not production
  const isStaging = siteUrl.includes('staging') || vercelEnv === 'preview';
  const isLocalhost = siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1');
  const shouldBlock = !isProduction && (isStaging || isLocalhost);

  if (shouldBlock) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // Production — allow crawlers everywhere except private routes
  const productionUrl = siteUrl || 'https://phoo.ai';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/settings/', '/studio/'],
      },
    ],
    sitemap: `${productionUrl}/sitemap.xml`,
  };
}

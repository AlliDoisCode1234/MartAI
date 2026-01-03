/**
 * Dynamic Robots.txt
 *
 * Blocks crawlers on staging, allows on production.
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const isStaging = siteUrl.includes('staging');
  const isLocalhost = siteUrl.includes('localhost');

  // Block all crawlers on staging and localhost
  if (isStaging || isLocalhost) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // Allow crawlers on production
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/settings/', '/studio/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

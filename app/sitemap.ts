/**
 * Dynamic Sitemap Generator
 *
 * Generates sitemap.xml for all public routes.
 * robots.ts already references this at /sitemap.xml
 */

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // IMPORTANT: Use www.phoo.ai (canonical) — non-www 307-redirects to www at DNS level.
  // If sitemap uses non-www, GSC flags every page as "Page with redirect".
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.phoo.ai';

  // Core public pages with high SEO priority
  const publicRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/product', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/how-it-works', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/resources', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },

    // Feature pages
    { path: '/features/content-studio', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/features/keyword-intelligence', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/features/analytics', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/features/publishing', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/features/geo-optimization', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/features/content-calendar', priority: 0.7, changeFrequency: 'monthly' as const },

    // Solution pages
    { path: '/solutions/small-business', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/solutions/marketing-teams', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/solutions/agencies', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/solutions/ecommerce', priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

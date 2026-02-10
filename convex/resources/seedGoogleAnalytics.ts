/**
 * Seed GA4/GSC Integration Resource
 *
 * One-off internal mutation to add the Google Analytics & Search Console
 * integration guide to the resources table.
 *
 * Run: npx convex run resources/seedGoogleAnalytics:seedGoogleAnalyticsResource
 */

import { internalMutation } from '../_generated/server';

export const seedGoogleAnalyticsResource = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query('resources')
      .filter((q) => q.eq(q.field('slug'), 'how-to-connect-google-analytics'))
      .first();

    if (existing) {
      console.log('[seedGoogleAnalytics] Article already exists, skipping');
      return { seeded: false };
    }

    const now = Date.now();

    await ctx.db.insert('resources', {
      slug: 'how-to-connect-google-analytics',
      title: 'How to Connect Google Analytics & Search Console to Phoo',
      description:
        'Connect GA4 and Google Search Console to Phoo in 2 minutes. One-click OAuth setup, property selection, troubleshooting, and data privacy explained.',
      excerpt: 'Step-by-step guide to connecting GA4 and GSC to your Phoo project.',
      category: 'integrations',
      tags: ['integrations', 'google analytics', 'search console', 'ga4', 'gsc'],
      readTimeMinutes: 6,
      wordCount: 1800,
      authorName: 'Phoo Team',
      authorTitle: 'SEO & Content Experts',
      status: 'published',
      featured: true,
      views: 0,
      phooRating: 100,
      phooRatedAt: now,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    console.log('[seedGoogleAnalytics] Seeded GA4/GSC integration article');
    return { seeded: true };
  },
});

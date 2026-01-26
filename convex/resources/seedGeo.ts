/**
 * Seed GEO Article
 *
 * Internal mutation to add GEO (Generative Engine Optimization) article.
 * Featured educational content for user confidence building.
 */

import { internalMutation } from '../_generated/server';

export const seedGeoArticle = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Check if GEO article already exists
    const existing = await ctx.db
      .query('resources')
      .withIndex('by_slug', (q) => q.eq('slug', 'what-is-geo-generative-engine-optimization'))
      .first();

    if (existing) {
      console.log('[seedGeoArticle] GEO article already exists, skipping');
      return { seeded: false };
    }

    const geoArticle = {
      slug: 'what-is-geo-generative-engine-optimization',
      title: 'What is GEO? Generative Engine Optimization Explained',
      description:
        'AI-powered search is changing the game. Learn how Generative Engine Optimization (GEO) differs from traditional SEO and how to optimize your content for AI search engines like ChatGPT, Perplexity, and Google SGE.',
      excerpt: "The future of search is generative. Here's how to prepare.",
      category: 'insight' as const,
      tags: ['geo', 'ai search', 'generative engines', 'chatgpt', 'perplexity'],
      readTimeMinutes: 12,
      wordCount: 3600,
      authorName: 'Phoo Team',
      authorTitle: 'SEO & Content Experts',
      status: 'published' as const,
      featured: true, // Featured article
      views: 0, // Start at 0 - no fake data
      phooRating: 100,
      phooRatedAt: now,
      publishedAt: now, // Published today
      createdAt: now,
      updatedAt: now,
    };

    await ctx.db.insert('resources', geoArticle);
    console.log('[seedGeoArticle] Added GEO article');
    return { seeded: true };
  },
});

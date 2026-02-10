/**
 * Seed Additional Resources
 *
 * Internal mutation to add 6 more resources (total 10 for E-E-A-T).
 * All resources have 100% Phoo Rating.
 */

import { internalMutation } from '../_generated/server';

export const seedAdditionalResources = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Check what resources we already have
    const existing = await ctx.db.query('resources').collect();
    const existingSlugs = new Set(existing.map((r) => r.slug));

    const newResources = [
      {
        slug: 'technical-seo-checklist',
        title: 'The Ultimate Technical SEO Checklist for 2025',
        description:
          'A comprehensive technical SEO checklist covering site speed, mobile-first indexing, Core Web Vitals, structured data, and crawlability.',
        excerpt: 'Master technical SEO with this complete checklist.',
        category: 'guide' as const,
        tags: ['technical seo', 'site speed', 'core web vitals'],
        readTimeMinutes: 18,
        wordCount: 5400,
        authorName: 'Phoo Team',
        authorTitle: 'SEO & Content Experts',
        status: 'published' as const,
        featured: false,
        views: 0,
        phooRating: 100,
        phooRatedAt: now,
        publishedAt: now - 10 * 24 * 60 * 60 * 1000,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: 'eeat-guidelines-explained',
        title: 'E-E-A-T Guidelines Explained: Experience, Expertise, Authority, Trust',
        description:
          "Google's E-E-A-T is critical for ranking. Learn how to demonstrate experience, expertise, authoritativeness, and trustworthiness in your content.",
        excerpt: 'How to build E-E-A-T signals into every piece of content.',
        category: 'insight' as const,
        tags: ['e-e-a-t', 'google guidelines', 'authority'],
        readTimeMinutes: 14,
        wordCount: 4200,
        authorName: 'Phoo Team',
        authorTitle: 'SEO & Content Experts',
        status: 'published' as const,
        featured: true,
        views: 0,
        phooRating: 100,
        phooRatedAt: now,
        publishedAt: now - 5 * 24 * 60 * 60 * 1000,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: 'content-calendar-template',
        title: 'How to Create a Content Calendar That Actually Works',
        description:
          'Stop letting content slip through the cracks. This tutorial shows you how to build and maintain a content calendar that drives consistent publishing.',
        excerpt: 'Build a content calendar your team will actually use.',
        category: 'tutorial' as const,
        tags: ['content calendar', 'planning', 'publishing'],
        readTimeMinutes: 9,
        wordCount: 2700,
        authorName: 'Phoo Team',
        authorTitle: 'SEO & Content Experts',
        status: 'published' as const,
        featured: false,
        views: 0,
        phooRating: 100,
        phooRatedAt: now,
        publishedAt: now - 12 * 24 * 60 * 60 * 1000,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: 'internal-linking-strategy',
        title: 'Internal Linking Strategy: The Missing SEO Lever',
        description:
          'Internal links pass authority and help users navigate. Learn how to build a strategic internal linking structure that boosts both SEO and UX.',
        excerpt: 'The often-overlooked SEO strategy that compounds over time.',
        category: 'guide' as const,
        tags: ['internal linking', 'site structure', 'seo'],
        readTimeMinutes: 11,
        wordCount: 3300,
        authorName: 'Phoo Team',
        authorTitle: 'SEO & Content Experts',
        status: 'published' as const,
        featured: false,
        views: 0,
        phooRating: 100,
        phooRatedAt: now,
        publishedAt: now - 8 * 24 * 60 * 60 * 1000,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: 'content-optimization-workflow',
        title: 'Content Optimization Workflow: From Draft to Publish',
        description:
          'A step-by-step workflow for optimizing content before publishing. Covers on-page SEO, readability, CTAs, and final quality checks.',
        excerpt: 'Optimize every piece of content with this proven workflow.',
        category: 'tutorial' as const,
        tags: ['optimization', 'workflow', 'on-page seo'],
        readTimeMinutes: 7,
        wordCount: 2100,
        authorName: 'Phoo Team',
        authorTitle: 'SEO & Content Experts',
        status: 'published' as const,
        featured: false,
        views: 0,
        phooRating: 100,
        phooRatedAt: now,
        publishedAt: now - 2 * 24 * 60 * 60 * 1000,
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: 'measuring-content-roi',
        title: 'Measuring Content ROI: Metrics That Actually Matter',
        description:
          'Stop tracking vanity metrics. Learn how to measure the real return on your content investment with attribution, assisted conversions, and revenue impact.',
        excerpt: 'The metrics that prove content marketing works.',
        category: 'insight' as const,
        tags: ['roi', 'analytics', 'measurement'],
        readTimeMinutes: 13,
        wordCount: 3900,
        authorName: 'Phoo Team',
        authorTitle: 'SEO & Content Experts',
        status: 'published' as const,
        featured: true,
        views: 0,
        phooRating: 100,
        phooRatedAt: now,
        publishedAt: now - 4 * 24 * 60 * 60 * 1000,
        createdAt: now,
        updatedAt: now,
      },
    ];

    let seeded = 0;
    for (const resource of newResources) {
      if (!existingSlugs.has(resource.slug)) {
        await ctx.db.insert('resources', resource);
        console.log(`[seedAdditionalResources] Added: ${resource.slug}`);
        seeded++;
      } else {
        console.log(`[seedAdditionalResources] Skipped (exists): ${resource.slug}`);
      }
    }

    console.log(`[seedAdditionalResources] Seeded ${seeded} new resources`);
    return { seeded };
  },
});

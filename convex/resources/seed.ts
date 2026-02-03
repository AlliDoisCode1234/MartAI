/**
 * Seed Resources
 *
 * Internal mutation to seed initial educational content.
 * Run once to populate the resources table with starter content.
 */

import { internalMutation } from '../_generated/server';

export const seedInitialResources = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if we already have resources
    const existing = await ctx.db.query('resources').first();
    if (existing) {
      console.log('[seedResources] Resources already exist, skipping seed');
      return { seeded: 0 };
    }

    const now = Date.now();
    const resources = [
      {
        slug: 'seo-content-strategy-guide',
        title: 'The Complete SEO Content Strategy Guide for 2025',
        description:
          'Learn how to build a content strategy that drives organic traffic. From keyword research to content calendars, this guide covers everything you need.',
        excerpt: 'A comprehensive guide to building an SEO-first content strategy.',
        category: 'guide' as const,
        tags: ['seo', 'content strategy', 'organic traffic'],
        readTimeMinutes: 15,
        wordCount: 4500,
        authorName: 'Phoo Team',
        authorTitle: 'SEO & Content Experts',
        status: 'published' as const,
        featured: true,
        views: 0,
        phooRating: 100,
        phooRatedAt: now,
        publishedAt: now - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: 'how-to-write-content-briefs',
        title: 'How to Write Content Briefs That Get Results',
        description:
          'Content briefs are the foundation of great content. Learn the exact structure and elements that make briefs effective for writers and SEO.',
        excerpt: 'Master the art of content briefs with this step-by-step tutorial.',
        category: 'tutorial' as const,
        tags: ['content briefs', 'content creation', 'writing'],
        readTimeMinutes: 8,
        wordCount: 2400,
        authorName: 'Phoo Team',
        authorTitle: 'SEO & Content Experts',
        status: 'published' as const,
        featured: true,
        views: 0,
        phooRating: 100,
        phooRatedAt: now,
        publishedAt: now - 3 * 24 * 60 * 60 * 1000, // 3 days ago
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: 'keyword-research-fundamentals',
        title: 'Keyword Research Fundamentals: From Zero to Hero',
        description:
          'Keyword research is the backbone of SEO. This guide teaches you how to find, evaluate, and prioritize keywords for your content strategy.',
        excerpt: 'Everything you need to know about keyword research.',
        category: 'guide' as const,
        tags: ['keywords', 'seo', 'research'],
        readTimeMinutes: 12,
        wordCount: 3600,
        authorName: 'Phoo Team',
        authorTitle: 'SEO & Content Experts',
        status: 'published' as const,
        featured: false,
        views: 0,
        phooRating: 100,
        phooRatedAt: now,
        publishedAt: now - 14 * 24 * 60 * 60 * 1000, // 14 days ago
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: 'ai-content-generation-best-practices',
        title: 'AI Content Generation: Best Practices for Quality Output',
        description:
          'AI can accelerate your content creation, but quality matters. Learn how to use AI effectively while maintaining your brand voice and E-E-A-T.',
        excerpt: 'How to use AI for content without sacrificing quality.',
        category: 'insight' as const,
        tags: ['ai', 'content generation', 'quality'],
        readTimeMinutes: 10,
        wordCount: 3000,
        authorName: 'Phoo Team',
        authorTitle: 'SEO & Content Experts',
        status: 'published' as const,
        featured: true,
        views: 0,
        phooRating: 100,
        phooRatedAt: now,
        publishedAt: now - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const resource of resources) {
      await ctx.db.insert('resources', resource);
    }

    console.log(`[seedResources] Seeded ${resources.length} resources`);
    return { seeded: resources.length };
  },
});

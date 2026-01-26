/**
 * Resources Queries & Mutations
 *
 * Public endpoints for fetching educational content.
 * Used by /resources route for SEO content.
 */

import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

/**
 * Get all published resources for listing page
 */
export const listPublished = query({
  args: {
    category: v.optional(
      v.union(
        v.literal('guide'),
        v.literal('tutorial'),
        v.literal('case-study'),
        v.literal('insight'),
        v.literal('news')
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query('resources')
      .withIndex('by_status', (q) => q.eq('status', 'published'));

    const resources = await query.collect();

    // Filter by category if provided
    let filtered = resources;
    if (args.category) {
      filtered = resources.filter((r) => r.category === args.category);
    }

    // Sort by publishedAt descending
    filtered.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));

    // Apply limit
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

/**
 * Get featured resources for homepage
 */
export const listFeatured = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const resources = await ctx.db
      .query('resources')
      .withIndex('by_featured', (q) => q.eq('featured', true))
      .collect();

    // Filter only published
    const published = resources.filter((r) => r.status === 'published');

    // Sort by publishedAt descending
    published.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));

    // Apply limit
    if (args.limit) {
      return published.slice(0, args.limit);
    }

    return published;
  },
});

/**
 * Get single resource by slug
 */
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const resource = await ctx.db
      .query('resources')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();

    if (!resource || resource.status !== 'published') {
      return null;
    }

    return resource;
  },
});

/**
 * Increment view count (public mutation)
 */
export const incrementViews = mutation({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const resource = await ctx.db
      .query('resources')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();

    if (!resource) {
      return null;
    }

    await ctx.db.patch(resource._id, {
      views: (resource.views || 0) + 1,
    });

    return { views: (resource.views || 0) + 1 };
  },
});

/**
 * Create a new resource (admin only)
 */
export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    excerpt: v.optional(v.string()),
    category: v.union(
      v.literal('guide'),
      v.literal('tutorial'),
      v.literal('case-study'),
      v.literal('insight'),
      v.literal('news')
    ),
    tags: v.optional(v.array(v.string())),
    readTimeMinutes: v.number(),
    wordCount: v.optional(v.number()),
    authorName: v.string(),
    authorTitle: v.optional(v.string()),
    authorImage: v.optional(v.string()),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    featured: v.optional(v.boolean()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for existing slug
    const existing = await ctx.db
      .query('resources')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();

    if (existing) {
      throw new Error(`Resource with slug "${args.slug}" already exists`);
    }

    const now = Date.now();

    const id = await ctx.db.insert('resources', {
      ...args,
      featured: args.featured ?? false,
      views: 0,
      publishedAt: args.status === 'published' ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

/**
 * Update Phoo Rating for a resource (internal)
 */
export const updatePhooRating = mutation({
  args: {
    slug: v.string(),
    phooRating: v.number(),
  },
  handler: async (ctx, args) => {
    const resource = await ctx.db
      .query('resources')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();

    if (!resource) {
      throw new Error(`Resource not found: ${args.slug}`);
    }

    await ctx.db.patch(resource._id, {
      phooRating: args.phooRating,
      phooRatedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

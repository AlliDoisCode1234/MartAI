/**
 * ContentPieces CRUD Operations
 *
 * Mutations and queries for the Content Studio.
 */

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { auth } from './auth';

// ============================================================================
// Queries
// ============================================================================

export const listByProject = query({
  args: {
    projectId: v.id('projects'),
    status: v.optional(
      v.union(
        v.literal('generating'),
        v.literal('draft'),
        v.literal('approved'),
        v.literal('published'),
        v.literal('scheduled')
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    let query = ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId));

    const pieces = await query.collect();

    // Filter by status if provided
    let filtered = pieces;
    if (args.status) {
      filtered = pieces.filter((p) => p.status === args.status);
    }

    // Sort by updatedAt desc
    filtered.sort((a, b) => b.updatedAt - a.updatedAt);

    // Apply limit
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

export const getById = query({
  args: {
    contentPieceId: v.id('contentPieces'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    return await ctx.db.get(args.contentPieceId);
  },
});

/**
 * List content pieces by scheduled date for calendar view
 */
export const listByScheduledDate = query({
  args: {
    projectId: v.id('projects'),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    // Get all pieces for project with scheduled dates
    const pieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project_scheduled', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Filter by date range if provided
    let filtered = pieces.filter((p) => p.scheduledDate != null);

    if (args.startDate) {
      filtered = filtered.filter((p) => (p.scheduledDate ?? 0) >= args.startDate!);
    }
    if (args.endDate) {
      filtered = filtered.filter((p) => (p.scheduledDate ?? 0) <= args.endDate!);
    }

    // Sort by scheduled date
    filtered.sort((a, b) => (a.scheduledDate ?? 0) - (b.scheduledDate ?? 0));

    return filtered;
  },
});

// ============================================================================
// Mutations
// ============================================================================

export const create = mutation({
  args: {
    projectId: v.id('projects'),
    contentType: v.union(
      v.literal('blog'),
      v.literal('pillar'),
      v.literal('howto'),
      v.literal('comparison'),
      v.literal('listicle')
    ),
    title: v.string(),
    keywords: v.array(v.string()),
    clusterId: v.optional(v.id('keywordClusters')),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    // Verify project ownership
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) {
      throw new Error('Project not found');
    }

    const now = Date.now();

    const id = await ctx.db.insert('contentPieces', {
      projectId: args.projectId,
      clusterId: args.clusterId,
      contentType: args.contentType,
      title: args.title,
      h2Outline: [],
      keywords: args.keywords,
      status: 'generating',
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

export const update = mutation({
  args: {
    contentPieceId: v.id('contentPieces'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    h2Outline: v.optional(v.array(v.string())),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal('generating'),
        v.literal('draft'),
        v.literal('approved'),
        v.literal('published'),
        v.literal('scheduled')
      )
    ),
    seoScore: v.optional(v.number()),
    wordCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const piece = await ctx.db.get(args.contentPieceId);
    if (!piece) throw new Error('Content not found');

    // Verify project ownership
    const project = await ctx.db.get(piece.projectId);
    if (!project || project.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const { contentPieceId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(contentPieceId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });

    return contentPieceId;
  },
});

export const remove = mutation({
  args: {
    contentPieceId: v.id('contentPieces'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const piece = await ctx.db.get(args.contentPieceId);
    if (!piece) throw new Error('Content not found');

    // Verify project ownership
    const project = await ctx.db.get(piece.projectId);
    if (!project || project.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.contentPieceId);
    return { success: true };
  },
});

// ============================================================================
// Stats
// ============================================================================

export const getStats = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const pieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    const total = pieces.length;
    const drafts = pieces.filter((p) => p.status === 'draft').length;
    const approved = pieces.filter((p) => p.status === 'approved').length;
    const published = pieces.filter((p) => p.status === 'published').length;
    const scheduled = pieces.filter((p) => p.status === 'scheduled').length;

    // Calculate average score
    const scoredPieces = pieces.filter((p) => p.seoScore !== undefined);
    const avgScore =
      scoredPieces.length > 0
        ? Math.round(
            scoredPieces.reduce((sum, p) => sum + (p.seoScore ?? 0), 0) / scoredPieces.length
          )
        : null;

    return {
      total,
      drafts,
      approved,
      published,
      scheduled,
      avgScore,
    };
  },
});

// ============================================================================
// Calendar Integration
// ============================================================================

/**
 * Schedule content for future publishing
 */
export const schedule = mutation({
  args: {
    contentPieceId: v.id('contentPieces'),
    publishDate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const piece = await ctx.db.get(args.contentPieceId);
    if (!piece) throw new Error('Content not found');

    // Verify project ownership
    const project = await ctx.db.get(piece.projectId);
    if (!project || project.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Validate publish date is in the future
    if (args.publishDate <= Date.now()) {
      throw new Error('Publish date must be in the future');
    }

    await ctx.db.patch(args.contentPieceId, {
      status: 'scheduled',
      publishDate: args.publishDate,
      updatedAt: Date.now(),
    });

    return { success: true, publishDate: args.publishDate };
  },
});

/**
 * List scheduled content (for calendar view)
 */
export const listScheduled = query({
  args: {
    projectId: v.id('projects'),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const pieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Filter for scheduled status
    let scheduled = pieces.filter((p) => p.status === 'scheduled' && p.publishDate);

    // Filter by date range if provided
    if (args.startDate) {
      scheduled = scheduled.filter((p) => (p.publishDate ?? 0) >= (args.startDate ?? 0));
    }
    if (args.endDate) {
      scheduled = scheduled.filter((p) => (p.publishDate ?? 0) <= (args.endDate ?? 0));
    }

    // Sort by publish date ascending
    scheduled.sort((a, b) => (a.publishDate ?? 0) - (b.publishDate ?? 0));

    return scheduled;
  },
});

/**
 * Unschedule content (revert to draft)
 */
export const unschedule = mutation({
  args: {
    contentPieceId: v.id('contentPieces'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const piece = await ctx.db.get(args.contentPieceId);
    if (!piece) throw new Error('Content not found');

    // Verify project ownership
    const project = await ctx.db.get(piece.projectId);
    if (!project || project.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(args.contentPieceId, {
      status: 'draft',
      publishDate: undefined,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

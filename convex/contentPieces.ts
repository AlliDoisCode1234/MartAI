/**
 * ContentPieces CRUD Operations
 *
 * Mutations and queries for the Content Studio.
 */

import { mutation, query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
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

/**
 * Paginated version for infinite scroll in Content Library
 */
export const listByProjectPaginated = query({
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
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: '' };
    }

    // Use index for efficient pagination
    const result = await ctx.db
      .query('contentPieces')
      .withIndex('by_project_created', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .paginate(args.paginationOpts);

    // Filter by status in-memory if specified
    if (args.status) {
      return {
        ...result,
        page: result.page.filter((p) => p.status === args.status),
      };
    }

    return result;
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
 * Only returns pieces with actual content (wordCount > 0)
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

    // Show published/scheduled with content, OR generating (for progress UI)
    const validStatuses = ['published', 'scheduled', 'generating'];
    let filtered = pieces.filter((p) => {
      // Must have scheduled date and valid status
      if (p.scheduledDate == null || !validStatuses.includes(p.status)) return false;
      // Generating pieces shown even without wordCount (for skeleton UI)
      if (p.status === 'generating') return true;
      // Published/scheduled pieces need actual content
      return (p.wordCount ?? 0) > 0;
    });

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
      // Core Pages
      v.literal('homepage'),
      v.literal('about'),
      v.literal('service'),
      v.literal('landing'),
      // Blog Content
      v.literal('blog'),
      v.literal('blogVersus'),
      v.literal('blogVideo'),
      v.literal('contentRefresh'),
      // Conversion
      v.literal('leadMagnet'),
      v.literal('paidProduct'),
      // Local/Geo
      v.literal('areasWeServe'),
      // Specialty
      v.literal('employment'),
      v.literal('mentorship'),
      v.literal('donate'),
      v.literal('events'),
      v.literal('partner'),
      v.literal('program')
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
    geoScore: v.optional(v.number()), // GEO (Generative Engine Optimization) score
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

    // BI Event Tracking
    if (updates.status === 'published' && piece.status !== 'published') {
      await ctx.db.insert('biEvents', {
        projectId: piece.projectId,
        userId: userId,
        event: 'content:published',
        properties: {
          contentPieceId,
          contentType: piece.contentType,
          wordCount: updates.wordCount ?? piece.wordCount,
          geoScore: updates.geoScore ?? piece.geoScore,
        },
        timestamp: Date.now(),
      });
    }

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

/**
 * Duplicate a content piece
 */
export const duplicate = mutation({
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

    const now = Date.now();

    // Create duplicate with "(Copy)" suffix
    const newId = await ctx.db.insert('contentPieces', {
      projectId: piece.projectId,
      clusterId: piece.clusterId,
      contentType: piece.contentType,
      title: `${piece.title} (Copy)`,
      content: piece.content,
      h2Outline: piece.h2Outline || [],
      metaTitle: piece.metaTitle,
      metaDescription: piece.metaDescription,
      keywords: piece.keywords || [],
      status: 'draft', // Always start as draft
      seoScore: piece.seoScore,
      wordCount: piece.wordCount,
      createdAt: now,
      updatedAt: now,
    });

    return newId;
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

    // Calculate stats by content type
    const byType: Record<string, number> = {};
    const byTypeStatus: Record<string, { total: number; published: number; scheduled: number }> =
      {};

    pieces.forEach((p) => {
      // Legacy simple count
      byType[p.contentType] = (byType[p.contentType] || 0) + 1;

      // Detailed status count
      if (!byTypeStatus[p.contentType]) {
        byTypeStatus[p.contentType] = { total: 0, published: 0, scheduled: 0 };
      }

      byTypeStatus[p.contentType].total++;

      if (p.status === 'published') {
        byTypeStatus[p.contentType].published++;
      } else if (p.status === 'scheduled') {
        byTypeStatus[p.contentType].scheduled++;
      }
    });

    return {
      total,
      drafts,
      approved,
      published,
      scheduled,
      avgScore,
      byType, // Keep for backward compatibility if needed
      byTypeStatus, // New detailed stats
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
      scheduledDate: args.publishDate, // Keep arg name if needed but map to schema field
      updatedAt: Date.now(),
    });

    // BI Event: Schedule
    await ctx.db.insert('biEvents', {
      projectId: piece.projectId,
      userId,
      event: 'content:scheduled',
      properties: {
        contentPieceId: args.contentPieceId,
        contentType: piece.contentType,
        scheduledDate: args.publishDate,
      },
      timestamp: Date.now(),
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
    let scheduled = pieces.filter((p) => p.status === 'scheduled' && p.scheduledDate);

    // Filter by date range if provided
    if (args.startDate) {
      scheduled = scheduled.filter((p) => (p.scheduledDate ?? 0) >= (args.startDate ?? 0));
    }
    if (args.endDate) {
      scheduled = scheduled.filter((p) => (p.scheduledDate ?? 0) <= (args.endDate ?? 0));
    }

    // Sort by scheduled date ascending
    scheduled.sort((a, b) => (a.scheduledDate ?? 0) - (b.scheduledDate ?? 0));

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
      scheduledDate: undefined,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

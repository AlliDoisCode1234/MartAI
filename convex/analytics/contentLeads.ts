/**
 * Component Hierarchy:
 * convex/analytics/contentLeads.ts (CRUD for contentLeads table)
 *
 * Provides mutations and queries for the contentLeads table, which stores
 * per-page lead attribution data from GA4 generate_lead events.
 */

import { internalMutation, internalQuery } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Upsert a content lead record — idempotent by project + pagePath + syncDate.
 */
export const upsertContentLead = internalMutation({
  args: {
    projectId: v.id('projects'),
    contentPieceId: v.optional(v.id('contentPieces')),
    pagePath: v.string(),
    publishedUrl: v.optional(v.string()),
    leadCount: v.number(),
    syncDate: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('contentLeads')
      .withIndex('by_project_page', (q) =>
        q.eq('projectId', args.projectId).eq('pagePath', args.pagePath)
      )
      .first();

    if (existing && existing.syncDate === args.syncDate) {
      // Update existing record for same sync day
      await ctx.db.patch(existing._id, {
        contentPieceId: args.contentPieceId,
        publishedUrl: args.publishedUrl,
        leadCount: args.leadCount,
        updatedAt: Date.now(),
      });
    } else {
      // Create new record
      await ctx.db.insert('contentLeads', {
        projectId: args.projectId,
        contentPieceId: args.contentPieceId,
        pagePath: args.pagePath,
        publishedUrl: args.publishedUrl,
        leadCount: args.leadCount,
        syncDate: args.syncDate,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

/**
 * Get all content leads for a project (latest sync day).
 */
export const getContentLeadsForProject = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contentLeads')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

/**
 * Get lead time-series for a specific content piece.
 */
export const getLeadsForContentPiece = internalQuery({
  args: { contentPieceId: v.id('contentPieces') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contentLeads')
      .withIndex('by_content_piece', (q) => q.eq('contentPieceId', args.contentPieceId))
      .collect();
  },
});

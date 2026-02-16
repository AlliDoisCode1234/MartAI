/**
 * Keyword Enrichment
 *
 * Module Hierarchy:
 * Convex → Analytics → keywordEnrichment (this file)
 *
 * Bridges GSC keyword data into the keyword library.
 * Called during sync to upsert keywords with GSC performance metrics.
 */

import { internalMutation, internalQuery } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Upsert a GSC keyword into the keywords library.
 * - If keyword exists (by projectId + keyword): patch GSC fields only
 * - If new: insert with source: 'gsc', status: 'suggested'
 *
 * Preserves manually curated fields (priority, phase, intent) on existing keywords.
 */
export const upsertGSCKeyword = internalMutation({
  args: {
    projectId: v.id('projects'),
    keyword: v.string(),
    position: v.number(),
    clicks: v.number(),
    impressions: v.number(),
    ctr: v.number(),
  },
  handler: async (ctx, args) => {
    // Lookup existing keyword by project + keyword text
    const existing = await ctx.db
      .query('keywords')
      .withIndex('by_project_keyword', (q) =>
        q.eq('projectId', args.projectId).eq('keyword', args.keyword)
      )
      .first();

    const now = Date.now();

    if (existing) {
      // Patch GSC fields only — don't overwrite curated data
      await ctx.db.patch(existing._id, {
        gscPosition: args.position,
        gscClicks: args.clicks,
        gscImpressions: args.impressions,
        gscCtr: args.ctr,
        gscLastUpdated: now,
      });
    } else {
      // Insert new keyword from GSC discovery
      await ctx.db.insert('keywords', {
        projectId: args.projectId,
        keyword: args.keyword,
        status: 'suggested',
        source: 'gsc',
        gscPosition: args.position,
        gscClicks: args.clicks,
        gscImpressions: args.impressions,
        gscCtr: args.ctr,
        gscLastUpdated: now,
        createdAt: now,
      });
    }
  },
});

/**
 * Count keywords for a project (internal, no RLS).
 * Used by MR calculator which runs without user auth context.
 */
export const countKeywords = internalQuery({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    return keywords.length;
  },
});

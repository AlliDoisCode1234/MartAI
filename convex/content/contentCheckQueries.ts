import { v } from 'convex/values';
import { query, internalMutation } from '../_generated/server';

/**
 * Content Check Queries & Mutations
 *
 * Separate from actions because queries/mutations can't be in 'use node' files.
 */

/**
 * Get the latest check result for a draft
 */
export const getCheckResult = query({
  args: {
    draftId: v.id('drafts'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contentChecks')
      .withIndex('by_draft', (q) => q.eq('draftId', args.draftId))
      .first();
  },
});

/**
 * Get check history for a project
 */
export const getProjectChecks = query({
  args: {
    projectId: v.id('projects'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    return await ctx.db
      .query('contentChecks')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .take(limit);
  },
});

/**
 * Store check result in database
 */
export const storeCheckResult = internalMutation({
  args: {
    draftId: v.id('drafts'),
    briefId: v.optional(v.id('briefs')),
    projectId: v.id('projects'),
    plagiarismScore: v.number(),
    aiScore: v.number(),
    readabilityScore: v.optional(v.number()),
    status: v.union(v.literal('pass'), v.literal('warning'), v.literal('fail')),
    details: v.optional(v.any()),
    provider: v.string(),
    rawResponse: v.optional(v.any()),
    checkedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if there's an existing check for this draft
    const existing = await ctx.db
      .query('contentChecks')
      .withIndex('by_draft', (q) => q.eq('draftId', args.draftId))
      .first();

    if (existing) {
      // Update existing check
      await ctx.db.patch(existing._id, {
        plagiarismScore: args.plagiarismScore,
        aiScore: args.aiScore,
        readabilityScore: args.readabilityScore,
        status: args.status,
        details: args.details,
        provider: args.provider,
        rawResponse: args.rawResponse,
        checkedAt: args.checkedAt,
      });
      return existing._id;
    } else {
      // Create new check
      return await ctx.db.insert('contentChecks', {
        draftId: args.draftId,
        briefId: args.briefId,
        projectId: args.projectId,
        plagiarismScore: args.plagiarismScore,
        aiScore: args.aiScore,
        readabilityScore: args.readabilityScore,
        status: args.status,
        details: args.details,
        provider: args.provider,
        rawResponse: args.rawResponse,
        checkedAt: args.checkedAt,
        createdAt: Date.now(),
      });
    }
  },
});

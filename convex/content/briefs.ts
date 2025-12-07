import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

// Create brief
export const createBrief = mutation({
  args: {
    planId: v.optional(v.id('quarterlyPlans')),
    projectId: v.id('projects'),
    clusterId: v.optional(v.id('keywordClusters')),
    title: v.string(),
    scheduledDate: v.number(),
    status: v.optional(v.string()), // planned, in_progress, approved, published
    titleOptions: v.optional(v.array(v.string())),
    h2Outline: v.optional(v.array(v.string())),
    faqs: v.optional(
      v.array(
        v.object({
          question: v.string(),
          answer: v.string(),
        })
      )
    ),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    internalLinks: v.optional(v.array(v.string())),
    schemaSuggestion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { planId, projectId, clusterId, title, scheduledDate, status, ...details } = args;
    return await ctx.db.insert('briefs', {
      planId,
      projectId,
      clusterId,
      title,
      scheduledDate,
      status: status || 'planned',
      ...details,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get brief by ID
export const getBriefById = query({
  args: { briefId: v.id('briefs') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.briefId);
  },
});

// Get briefs by plan
export const getBriefsByPlan = query({
  args: { planId: v.id('quarterlyPlans') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('briefs')
      .withIndex('by_plan', (q) => q.eq('planId', args.planId))
      .collect();
  },
});

// Update brief
export const updateBrief = mutation({
  args: {
    briefId: v.id('briefs'),
    title: v.optional(v.string()),
    titleOptions: v.optional(v.array(v.string())),
    h2Outline: v.optional(v.array(v.string())),
    faqs: v.optional(
      v.array(
        v.object({
          question: v.string(),
          answer: v.string(),
        })
      )
    ),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    internalLinks: v.optional(v.array(v.string())),
    schemaSuggestion: v.optional(v.string()),
    scheduledDate: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { briefId, ...updates } = args;
    const cleanUpdates: Record<string, any> = { updatedAt: Date.now() };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    return await ctx.db.patch(briefId, cleanUpdates);
  },
});

// Delete brief
export const deleteBrief = mutation({
  args: { briefId: v.id('briefs') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.briefId);
  },
});

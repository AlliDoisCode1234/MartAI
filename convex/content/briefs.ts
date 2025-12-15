import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { requireProjectAccess } from '../lib/rbac';

// Create brief (requires project editor access)
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
    // Security: Require project access
    await requireProjectAccess(ctx, args.projectId, 'editor');

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

// Get brief by ID (requires project viewer access)
export const getBriefById = query({
  args: { briefId: v.id('briefs') },
  handler: async (ctx, args) => {
    const brief = await ctx.db.get(args.briefId);
    if (!brief) return null;

    // Security: Require project access
    await requireProjectAccess(ctx, brief.projectId, 'viewer');

    return brief;
  },
});

// Get briefs by plan (requires project viewer access via plan)
export const getBriefsByPlan = query({
  args: { planId: v.id('quarterlyPlans') },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) return [];

    // Security: Require project access
    await requireProjectAccess(ctx, plan.projectId, 'viewer');

    return await ctx.db
      .query('briefs')
      .withIndex('by_plan', (q) => q.eq('planId', args.planId))
      .collect();
  },
});

// Get briefs by project (requires project viewer access)
export const getBriefsByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // Security: Require project access
    await requireProjectAccess(ctx, args.projectId, 'viewer');

    return await ctx.db
      .query('briefs')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

// Update brief (requires project editor access)
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
    const brief = await ctx.db.get(args.briefId);
    if (!brief) throw new Error('Brief not found');

    // Security: Require project access
    await requireProjectAccess(ctx, brief.projectId, 'editor');

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

// Delete brief (requires project editor access)
export const deleteBrief = mutation({
  args: { briefId: v.id('briefs') },
  handler: async (ctx, args) => {
    const brief = await ctx.db.get(args.briefId);
    if (!brief) throw new Error('Brief not found');

    // Security: Require project access
    await requireProjectAccess(ctx, brief.projectId, 'editor');

    await ctx.db.delete(args.briefId);
  },
});

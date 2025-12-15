// Competitor management
import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { requireProjectAccess } from '../lib/rbac';

// Add competitor (requires project editor access)
export const addCompetitor = mutation({
  args: {
    projectId: v.id('projects'),
    domain: v.string(),
    priority: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Security: Require project access
    await requireProjectAccess(ctx, args.projectId, 'editor');

    // Check if competitor already exists
    const existing = await ctx.db
      .query('competitors')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .filter((q) => q.eq(q.field('domain'), args.domain))
      .first();

    if (existing) {
      // Update existing
      return await ctx.db.patch(existing._id, {
        priority: args.priority,
        notes: args.notes,
        updatedAt: Date.now(),
      });
    }

    return await ctx.db.insert('competitors', {
      projectId: args.projectId,
      domain: args.domain,
      priority: args.priority || 3,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get competitors by project (requires project viewer access)
export const getCompetitorsByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // Security: Require project access
    await requireProjectAccess(ctx, args.projectId, 'viewer');

    return await ctx.db
      .query('competitors')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .collect();
  },
});

// Update competitor priority (requires project editor access)
export const updateCompetitorPriority = mutation({
  args: {
    competitorId: v.id('competitors'),
    priority: v.number(),
  },
  handler: async (ctx, args) => {
    const competitor = await ctx.db.get(args.competitorId);
    if (!competitor) throw new Error('Competitor not found');

    // Security: Require project access
    await requireProjectAccess(ctx, competitor.projectId, 'editor');

    await ctx.db.patch(args.competitorId, {
      priority: args.priority,
      updatedAt: Date.now(),
    });
  },
});

// Remove competitor (requires project editor access)
export const removeCompetitor = mutation({
  args: { competitorId: v.id('competitors') },
  handler: async (ctx, args) => {
    const competitor = await ctx.db.get(args.competitorId);
    if (!competitor) throw new Error('Competitor not found');

    // Security: Require project access
    await requireProjectAccess(ctx, competitor.projectId, 'editor');

    await ctx.db.delete(args.competitorId);
  },
});

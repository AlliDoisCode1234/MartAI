import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { requireProjectAccess } from '../lib/rbac';

/**
 * SEO Audits — SEC-002-B: All exports RBAC-gated.
 */

// Create SEO audit
export const createAudit = mutation({
  args: {
    projectId: v.id('projects'),
    website: v.string(),
    overallScore: v.number(),
    technicalSeo: v.object({
      score: v.number(),
      issues: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
    onPageSeo: v.object({
      score: v.number(),
      issues: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
    contentQuality: v.object({
      score: v.number(),
      issues: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
    backlinks: v.object({
      score: v.number(),
      issues: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
    priorityActions: v.array(v.string()),
    pageSpeed: v.optional(v.number()),
    mobileFriendly: v.optional(v.boolean()),
    sslEnabled: v.optional(v.boolean()),
    indexedPages: v.optional(v.number()),
    crawlErrors: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // SEC-002-B: RBAC — verify caller has editor access
    await requireProjectAccess(ctx, args.projectId, 'editor');

    return await ctx.db.insert('seoAudits', {
      projectId: args.projectId,
      website: args.website,
      overallScore: args.overallScore,
      technicalSeo: args.technicalSeo,
      onPageSeo: args.onPageSeo,
      contentQuality: args.contentQuality,
      backlinks: args.backlinks,
      priorityActions: args.priorityActions,
      pageSpeed: args.pageSpeed,
      mobileFriendly: args.mobileFriendly,
      sslEnabled: args.sslEnabled,
      indexedPages: args.indexedPages,
      crawlErrors: args.crawlErrors,
      createdAt: Date.now(),
    });
  },
});

// Get latest audit for project
export const getLatestAuditByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // SEC-002-B: RBAC — verify caller has viewer access
    try {
      await requireProjectAccess(ctx, args.projectId, 'viewer');
    } catch {
      return null;
    }

    const audits = await ctx.db
      .query('seoAudits')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .take(1);
    return audits[0] || null;
  },
});

// Get all audits for project
export const getAuditsByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // SEC-002-B: RBAC — verify caller has viewer access
    try {
      await requireProjectAccess(ctx, args.projectId, 'viewer');
    } catch {
      return [];
    }

    return await ctx.db
      .query('seoAudits')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .collect();
  },
});

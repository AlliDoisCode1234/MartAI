import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

// Create SEO audit
// Create SEO audit
export const createAudit = mutation({
  args: {
    clientId: v.optional(v.id('clients')),
    projectId: v.optional(v.id('projects')),
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
    if (!args.clientId && !args.projectId) {
      throw new Error('Either clientId or projectId must be provided.');
    }

    return await ctx.db.insert('seoAudits', {
      clientId: args.clientId,
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

// Get latest audit for client or project
// keeping getLatestAudit for client backward compatibility
export const getLatestAudit = query({
  args: { clientId: v.id('clients') },
  handler: async (ctx, args) => {
    const audits = await ctx.db
      .query('seoAudits')
      .withIndex('by_client', (q) => q.eq('clientId', args.clientId))
      .order('desc')
      .take(1);
    return audits[0] || null;
  },
});

// New Query: getLatestAuditByProject
export const getLatestAuditByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const audits = await ctx.db
      .query('seoAudits')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .take(1);
    return audits[0] || null;
  },
});

// Get all audits for client
export const getAuditsByClient = query({
  args: { clientId: v.id('clients') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('seoAudits')
      .withIndex('by_client', (q) => q.eq('clientId', args.clientId))
      .order('desc')
      .collect();
  },
});

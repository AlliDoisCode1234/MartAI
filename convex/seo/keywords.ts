import { mutation, query } from '../_generated/server';
import { internal } from '../_generated/api';
import { v } from 'convex/values';
import { requireProjectAccess } from '../lib/rbac';

// Create keywords (requires project editor access)
export const createKeywords = mutation({
  args: {
    projectId: v.id('projects'),
    keywords: v.array(
      v.object({
        keyword: v.string(),
        searchVolume: v.optional(v.number()),
        difficulty: v.optional(v.number()),
        cpc: v.optional(v.number()),
        intent: v.optional(v.string()),
        priority: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Security: Require project access
    const project = await requireProjectAccess(ctx, args.projectId, 'editor');

    const keywordIds = [];
    for (const kw of args.keywords) {
      const id = await ctx.db.insert('keywords', {
        projectId: args.projectId,
        keyword: kw.keyword,
        searchVolume: kw.searchVolume,
        difficulty: kw.difficulty,
        cpc: kw.cpc,
        intent: kw.intent,
        priority: kw.priority || 'medium',
        status: 'suggested',
        createdAt: Date.now(),
      });
      keywordIds.push(id);
    }

    // Track engagement milestone (ADMIN-003)
    if (keywordIds.length > 0 && project.userId) {
      await ctx.scheduler.runAfter(0, internal.lib.engagementMilestones.trackEngagement, {
        userId: project.userId,
        milestone: 'keyword',
        incrementTotal: true,
      });
    }

    return keywordIds;
  },
});

// Get keywords by project (requires project viewer access)
export const getKeywordsByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // Security: Require project access
    await requireProjectAccess(ctx, args.projectId, 'viewer');

    return await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .collect();
  },
});

// Update keyword status (requires project editor access)
export const updateKeywordStatus = mutation({
  args: {
    keywordId: v.id('keywords'),
    status: v.string(),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const keyword = await ctx.db.get(args.keywordId);
    if (!keyword) return null;

    // Security: Require project access
    await requireProjectAccess(ctx, keyword.projectId, 'editor');

    return await ctx.db.patch(args.keywordId, {
      status: args.status,
      priority: args.priority || keyword.priority,
    });
  },
});

// Get keywords by status (requires project viewer access)
export const getKeywordsByStatus = query({
  args: {
    projectId: v.id('projects'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Security: Require project access
    await requireProjectAccess(ctx, args.projectId, 'viewer');

    const allKeywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    return allKeywords.filter((k) => k.status === args.status);
  },
});

// Paginated keywords (requires project viewer access)
export const getKeywords = query({
  args: {
    projectId: v.id('projects'),
    paginationOpts: v.any(), // pagination options (cursor, numItems)
  },
  handler: async (ctx, args) => {
    // Security: Require project access
    await requireProjectAccess(ctx, args.projectId, 'viewer');

    return await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .paginate(args.paginationOpts);
  },
});

// Get single keyword (requires project viewer access)
export const getKeyword = query({
  args: { keywordId: v.id('keywords') },
  handler: async (ctx, args) => {
    const keyword = await ctx.db.get(args.keywordId);
    if (!keyword) return null;

    // Security: Require project access
    await requireProjectAccess(ctx, keyword.projectId, 'viewer');

    return keyword;
  },
});

// Delete single keyword (requires project editor access)
export const deleteKeyword = mutation({
  args: { keywordId: v.id('keywords') },
  handler: async (ctx, args) => {
    const keyword = await ctx.db.get(args.keywordId);
    if (!keyword) return null;

    // Security: Require project access
    await requireProjectAccess(ctx, keyword.projectId, 'editor');

    await ctx.db.delete(args.keywordId);
    return args.keywordId;
  },
});

// Bulk delete keywords (requires project editor access, max 50)
export const deleteKeywords = mutation({
  args: { keywordIds: v.array(v.id('keywords')) },
  handler: async (ctx, args) => {
    if (args.keywordIds.length === 0) return { deleted: 0 };
    if (args.keywordIds.length > 50) {
      throw new Error('Cannot delete more than 50 keywords at once');
    }

    // Verify access on first keyword's project
    const first = await ctx.db.get(args.keywordIds[0]);
    if (!first) return { deleted: 0 };
    await requireProjectAccess(ctx, first.projectId, 'editor');

    let deleted = 0;
    for (const id of args.keywordIds) {
      const kw = await ctx.db.get(id);
      if (kw) {
        await ctx.db.delete(id);
        deleted++;
      }
    }

    return { deleted };
  },
});

// Assign keyword to cluster (requires project editor access)
export const assignKeywordToCluster = mutation({
  args: {
    keywordId: v.id('keywords'),
    clusterId: v.id('keywordClusters'),
  },
  handler: async (ctx, args) => {
    const keyword = await ctx.db.get(args.keywordId);
    if (!keyword) throw new Error('Keyword not found');

    await requireProjectAccess(ctx, keyword.projectId, 'editor');

    const cluster = await ctx.db.get(args.clusterId);
    if (!cluster) throw new Error('Cluster not found');

    // Update keyword's clusterId
    await ctx.db.patch(args.keywordId, { clusterId: args.clusterId });

    // Add keyword text to cluster's keywords array (deduped)
    const updatedKeywords = [...new Set([...cluster.keywords, keyword.keyword])];
    await ctx.db.patch(args.clusterId, {
      keywords: updatedKeywords,
      updatedAt: Date.now(),
    });

    return { keywordId: args.keywordId, clusterId: args.clusterId };
  },
});

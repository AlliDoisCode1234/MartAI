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

// Get enriched keyword with cluster context and sibling data (requires project viewer access)
export const getKeywordEnriched = query({
  args: { keywordId: v.id('keywords') },
  handler: async (ctx, args) => {
    const keyword = await ctx.db.get(args.keywordId);
    if (!keyword) return null;

    await requireProjectAccess(ctx, keyword.projectId, 'viewer');

    // Fetch cluster data if keyword belongs to one
    let cluster = null;
    let clusterKeywords: Array<{
      _id: string;
      keyword: string;
      searchVolume?: number;
      difficulty?: number;
      cpc?: number;
      intent?: string;
      gscPosition?: number;
    }> = [];

    if (keyword.clusterId) {
      cluster = await ctx.db.get(keyword.clusterId);

      // Fetch all keywords in the same cluster
      const allProjectKeywords = await ctx.db
        .query('keywords')
        .withIndex('by_project', (q) => q.eq('projectId', keyword.projectId))
        .collect();

      clusterKeywords = allProjectKeywords
        .filter((k) => k.clusterId && k.clusterId === keyword.clusterId && k._id !== keyword._id)
        .map((k) => ({
          _id: k._id,
          keyword: k.keyword,
          searchVolume: k.searchVolume,
          difficulty: k.difficulty,
          cpc: k.cpc,
          intent: k.intent,
          gscPosition: k.gscPosition,
        }));
    }

    // Calculate aggregate stats from sibling keywords
    const allRelated = [
      keyword,
      ...clusterKeywords.map((k) => ({
        searchVolume: k.searchVolume,
        difficulty: k.difficulty,
        cpc: k.cpc,
      })),
    ];

    const volumes = allRelated
      .map((k) => k.searchVolume)
      .filter((v): v is number => v !== undefined && v !== null);
    const difficulties = allRelated
      .map((k) => k.difficulty)
      .filter((d): d is number => d !== undefined && d !== null);
    const cpcs = allRelated
      .map((k) => k.cpc)
      .filter((c): c is number => c !== undefined && c !== null);

    return {
      ...keyword,
      cluster: cluster
        ? {
            _id: cluster._id,
            clusterName: cluster.clusterName,
            keywords: cluster.keywords,
            intent: cluster.intent,
            difficulty: cluster.difficulty,
            volumeRange: cluster.volumeRange,
            impactScore: cluster.impactScore,
            topSerpUrls: cluster.topSerpUrls,
            status: cluster.status,
          }
        : null,
      siblingKeywords: clusterKeywords,
      aggregateStats: {
        totalVolume: volumes.reduce((a, b) => a + b, 0),
        avgDifficulty:
          difficulties.length > 0
            ? Math.round(difficulties.reduce((a, b) => a + b, 0) / difficulties.length)
            : null,
        avgCpc:
          cpcs.length > 0
            ? Number((cpcs.reduce((a, b) => a + b, 0) / cpcs.length).toFixed(2))
            : null,
        minVolume: volumes.length > 0 ? Math.min(...volumes) : null,
        maxVolume: volumes.length > 0 ? Math.max(...volumes) : null,
        keywordCount: allRelated.length,
      },
      // Fetch stored SERP analysis for this keyword
      serpAnalysis: await (async () => {
        const analysis = await ctx.db
          .query('serpAnalyses')
          .withIndex('by_project_keyword', (q) =>
            q.eq('projectId', keyword.projectId).eq('keyword', keyword.keyword)
          )
          .first();
        if (!analysis) return null;
        return {
          _id: analysis._id,
          results: analysis.results,
          analyzedAt: analysis.analyzedAt,
          source: analysis.source,
          searchVolume: analysis.searchVolume,
          difficulty: analysis.difficulty,
        };
      })(),
    };
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

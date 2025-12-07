import { action, mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';
// Imports moved to keywordActions.ts

const keywordInputArg = v.object({
  keyword: v.string(),
  volume: v.optional(v.number()),
  difficulty: v.optional(v.number()),
  intent: v.optional(v.string()),
});

// Create keyword cluster
export const createCluster = mutation({
  args: {
    projectId: v.id('projects'),
    clusterName: v.string(),
    keywords: v.array(v.string()),
    intent: v.string(), // informational, commercial, transactional, navigational
    difficulty: v.number(), // 0-100
    volumeRange: v.object({
      min: v.number(),
      max: v.number(),
    }),
    impactScore: v.number(),
    topSerpUrls: v.array(v.string()),
    status: v.string(), // active, hidden, favorite
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('keywordClusters', {
      projectId: args.projectId,
      clusterName: args.clusterName,
      keywords: args.keywords,
      intent: args.intent,
      difficulty: args.difficulty,
      volumeRange: args.volumeRange,
      impactScore: args.impactScore,
      topSerpUrls: args.topSerpUrls,
      status: args.status || 'active',
      createdAt: args.createdAt || Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get clusters by project
export const getClustersByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('keywordClusters')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

// Get active clusters (not hidden)
export const getActiveClusters = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const allClusters = await ctx.db
      .query('keywordClusters')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    return allClusters.filter((c) => c.status !== 'hidden');
  },
});

// Update cluster
export const updateCluster = mutation({
  args: {
    clusterId: v.id('keywordClusters'),
    clusterName: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    intent: v.optional(v.string()),
    difficulty: v.optional(v.number()),
    volumeRange: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
      })
    ),
    impactScore: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clusterId, ...updates } = args;
    const cleanUpdates: Record<string, any> = { updatedAt: Date.now() };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    return await ctx.db.patch(clusterId, cleanUpdates);
  },
});

// Update cluster status (hide, favorite, etc.)
export const updateClusterStatus = mutation({
  args: {
    clusterId: v.id('keywordClusters'),
    status: v.string(), // active, hidden, favorite
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.clusterId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Re-rank clusters (update impact scores)
export const rerankClusters = mutation({
  args: {
    projectId: v.id('projects'),
    volumeWeight: v.optional(v.number()),
    intentWeight: v.optional(v.number()),
    difficultyWeight: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const clusters = await ctx.db
      .query('keywordClusters')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    const volumeWeight = args.volumeWeight ?? 0.4;
    const intentWeight = args.intentWeight ?? 0.3;
    const difficultyWeight = args.difficultyWeight ?? 0.3;

    // Intent scores: transactional=1.0, commercial=0.8, informational=0.6, navigational=0.4
    const intentScores: Record<string, number> = {
      transactional: 1.0,
      commercial: 0.8,
      informational: 0.6,
      navigational: 0.4,
    };

    for (const cluster of clusters) {
      const avgVolume = (cluster.volumeRange.min + cluster.volumeRange.max) / 2;
      const normalizedVolume = Math.min(avgVolume / 10000, 1); // Normalize to 0-1
      const intentScore = intentScores[cluster.intent] || 0.5;
      const normalizedDifficulty = 1 - cluster.difficulty / 100; // Lower difficulty = higher score

      const impactScore =
        volumeWeight * normalizedVolume +
        intentWeight * intentScore +
        difficultyWeight * normalizedDifficulty;

      await ctx.db.patch(cluster._id, {
        impactScore: Math.round(impactScore * 100) / 100,
        updatedAt: Date.now(),
      });
    }

    return { success: true, updated: clusters.length };
  },
});

// Delete cluster
export const deleteCluster = mutation({
  args: { clusterId: v.id('keywordClusters') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.clusterId);
  },
});

// Merge clusters
export const mergeClusters = mutation({
  args: {
    clusterIds: v.array(v.id('keywordClusters')),
  },
  handler: async (ctx, args) => {
    if (args.clusterIds.length < 2) {
      throw new Error('Need at least 2 clusters to merge');
    }

    const clusters = [];
    for (const id of args.clusterIds) {
      const cluster = await ctx.db.get(id);
      if (cluster) clusters.push(cluster);
    }

    if (clusters.length === 0) {
      throw new Error('No valid clusters found to merge');
    }

    // Base new cluster on the first one (usually the "primary" in a merge)
    const primary = clusters[0];

    // Merge keywords (unique)
    const allKeywords = new Set<string>();
    clusters.forEach((c) => c.keywords.forEach((k) => allKeywords.add(k)));

    // Merge SERP URLs (unique)
    const allSerps = new Set<string>();
    clusters.forEach((c) => c.topSerpUrls?.forEach((u) => allSerps.add(u)));

    // Aggregate volume
    const minVol = clusters.reduce((sum, c) => sum + c.volumeRange.min, 0);
    const maxVol = clusters.reduce((sum, c) => sum + c.volumeRange.max, 0);

    // Average difficulty
    const avgDiff = clusters.reduce((sum, c) => sum + c.difficulty, 0) / clusters.length;

    const newClusterId = await ctx.db.insert('keywordClusters', {
      projectId: primary.projectId,
      clusterName: `${primary.clusterName} (Merged)`,
      keywords: Array.from(allKeywords),
      intent: primary.intent, // Keep intent of primary
      difficulty: avgDiff,
      volumeRange: { min: minVol, max: maxVol },
      impactScore: primary.impactScore, // Initial score, can be reranked later
      topSerpUrls: Array.from(allSerps).slice(0, 10), // Keep top 10 unique
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Delete old clusters
    for (const c of clusters) {
      await ctx.db.delete(c._id);
    }

    return newClusterId;
  },
});

// generateClusters action moved to keywordActions.ts

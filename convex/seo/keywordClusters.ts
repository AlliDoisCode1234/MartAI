import { action, mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import {
  generateKeywordClusters,
  importKeywordsFromGSC,
  type KeywordInput,
} from "../../lib/keywordClustering";
import { getGSCData } from "../../lib/googleAuth";

const keywordInputArg = v.object({
  keyword: v.string(),
  volume: v.optional(v.number()),
  difficulty: v.optional(v.number()),
  intent: v.optional(v.string()),
});

// Create keyword cluster
export const createCluster = mutation({
  args: {
    projectId: v.id("projects"),
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
    return await ctx.db.insert("keywordClusters", {
      projectId: args.projectId,
      clusterName: args.clusterName,
      keywords: args.keywords,
      intent: args.intent,
      difficulty: args.difficulty,
      volumeRange: args.volumeRange,
      impactScore: args.impactScore,
      topSerpUrls: args.topSerpUrls,
      status: args.status || "active",
      createdAt: args.createdAt || Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get clusters by project
export const getClustersByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("keywordClusters")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

// Get active clusters (not hidden)
export const getActiveClusters = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const allClusters = await ctx.db
      .query("keywordClusters")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    
    return allClusters.filter(c => c.status !== "hidden");
  },
});

// Update cluster
export const updateCluster = mutation({
  args: {
    clusterId: v.id("keywordClusters"),
    clusterName: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    intent: v.optional(v.string()),
    difficulty: v.optional(v.number()),
    volumeRange: v.optional(v.object({
      min: v.number(),
      max: v.number(),
    })),
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
    clusterId: v.id("keywordClusters"),
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
    projectId: v.id("projects"),
    volumeWeight: v.optional(v.number()),
    intentWeight: v.optional(v.number()),
    difficultyWeight: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const clusters = await ctx.db
      .query("keywordClusters")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
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
      const normalizedDifficulty = 1 - (cluster.difficulty / 100); // Lower difficulty = higher score
      
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
  args: { clusterId: v.id("keywordClusters") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.clusterId);
  },
});

export const generateClusters = action({
  args: {
    projectId: v.id("projects"),
    keywords: v.optional(v.array(keywordInputArg)),
    importFromGSC: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
      projectId: args.projectId,
    });

    let keywordInputs: KeywordInput[] = (args.keywords ?? []).map((keyword) => ({
      keyword: keyword.keyword,
      volume: keyword.volume,
      difficulty: keyword.difficulty,
      intent: keyword.intent,
    }));

    if (args.importFromGSC ?? false) {
      try {
        const connection = await ctx.runQuery(api.integrations.gscConnections.getGSCConnection, {
          projectId: args.projectId,
        });
        if (connection?.accessToken && connection?.siteUrl) {
          const gscData = await getGSCData(
            connection.accessToken,
            connection.siteUrl,
            "30daysAgo",
            "today",
            150,
          );
          const imported = importKeywordsFromGSC(gscData);
          if (imported.length > 0) {
            keywordInputs = keywordInputs.concat(imported);
            await ctx.runMutation(api.integrations.gscConnections.updateLastSync, {
              connectionId: connection._id,
            });
          }
        }
      } catch (error) {
        console.warn("GSC import failed:", error);
      }
    }

    if (keywordInputs.length === 0) {
      keywordInputs = buildFallbackKeywords(project);
    }

    if (keywordInputs.length === 0) {
      throw new Error("Unable to find keywords to cluster. Add keywords or connect GSC.");
    }

    const clusters = await generateKeywordClusters(
      keywordInputs,
      project?.websiteUrl,
      project?.industry,
    );

    let createdCount = 0;
    for (const cluster of clusters) {
      try {
        await ctx.runMutation(api.seo.keywordClusters.createCluster, {
          projectId: args.projectId,
          clusterName: cluster.clusterName,
          keywords: cluster.keywords,
          intent: cluster.intent,
          difficulty: cluster.difficulty,
          volumeRange: cluster.volumeRange,
          impactScore: cluster.impactScore,
          topSerpUrls: cluster.topSerpUrls,
          status: "active",
          createdAt: Date.now(),
        });
        createdCount += 1;
      } catch (error) {
        console.error("Failed to store cluster:", error);
      }
    }

    return {
      success: true,
      count: createdCount,
    };
  },
});

function buildFallbackKeywords(project?: { industry?: string; name?: string }): KeywordInput[] {
  const base = (project?.industry || project?.name || "growth marketing").toLowerCase();
  const topics = [
    `${base} strategy`,
    `${base} software`,
    `${base} tools`,
    `${base} best practices`,
    `${base} pricing`,
    `${base} case studies`,
    `${base} automation`,
    `${base} templates`,
  ];

  return topics.map((keyword, index) => ({
    keyword,
    volume: 500 - index * 30,
    difficulty: 35 + index * 3,
    intent: index < 3 ? "commercial" : index < 5 ? "transactional" : "informational",
  }));
}


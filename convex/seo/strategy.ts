import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get all strategy data for a project in one query
 * Returns clusters, plan, and briefs together for the strategy page
 */
export const getStrategyByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    // Get clusters
    const clusters = await ctx.db
      .query("keywordClusters")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Get plan with briefs
    const plan = await ctx.db
      .query("quarterlyPlans")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    let briefs: any[] = [];
    if (plan) {
      briefs = await ctx.db
        .query("briefs")
        .withIndex("by_plan", (q) => q.eq("planId", plan._id))
        .collect();
    }

    // Sort clusters by impact score
    const sortedClusters = clusters.sort(
      (a, b) => (b.impactScore || 0) - (a.impactScore || 0)
    );

    // Sort briefs by scheduled date
    const sortedBriefs = briefs.sort((a, b) => a.scheduledDate - b.scheduledDate);

    return {
      projectId: args.projectId,
      clusters: sortedClusters,
      plan: plan
        ? {
            ...plan,
            briefs: sortedBriefs,
          }
        : null,
      stats: {
        clusterCount: sortedClusters.length,
        activeClusterCount: sortedClusters.filter((c) => c.status === "active").length,
        planExists: !!plan,
        briefCount: sortedBriefs.length,
      },
    };
  },
});


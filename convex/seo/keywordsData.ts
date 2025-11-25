import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get all keywords data for a project
 * Note: Keywords are currently tied to clients, but we can get them via project
 */
export const getKeywordsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    // Get project to find client/user
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return { projectId: args.projectId, keywords: [], stats: null };
    }

    // Get client for this user
    const client = await ctx.db
      .query("clients")
      .withIndex("by_user", (q) => q.eq("userId", project.userId))
      .first();

    if (!client) {
      return { projectId: args.projectId, keywords: [], stats: null };
    }

    // Get keywords
    const keywords = await ctx.db
      .query("keywords")
      .withIndex("by_client", (q) => q.eq("clientId", client._id))
      .collect();

    return {
      projectId: args.projectId,
      keywords: keywords.sort((a, b) => {
        // Sort by priority, then volume
        const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
        const priorityDiff = (priorityOrder[b.priority || "medium"] || 0) - (priorityOrder[a.priority || "medium"] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        return (b.searchVolume || 0) - (a.searchVolume || 0);
      }),
      stats: {
        total: keywords.length,
        highPriority: keywords.filter((k) => k.priority === "high").length,
        mediumPriority: keywords.filter((k) => k.priority === "medium").length,
        lowPriority: keywords.filter((k) => k.priority === "low").length,
        byStatus: {
          suggested: keywords.filter((k) => k.status === "suggested").length,
          approved: keywords.filter((k) => k.status === "approved").length,
          rejected: keywords.filter((k) => k.status === "rejected").length,
        },
      },
    };
  },
});


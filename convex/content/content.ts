import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get all content data for a project (briefs + drafts)
 * Returns all briefs with their associated drafts for the content page
 */
export const getContentByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    // Get all briefs for the project
    const briefs = await ctx.db
      .query("briefs")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Get drafts for all briefs
    const draftsByBriefId = new Map();
    for (const brief of briefs) {
      const draft = await ctx.db
        .query("drafts")
        .withIndex("by_brief", (q) => q.eq("briefId", brief._id))
        .first();
      if (draft) {
        draftsByBriefId.set(brief._id, draft);
      }
    }

    // Attach drafts to briefs
    const briefsWithDrafts = briefs.map((brief) => ({
      ...brief,
      draft: draftsByBriefId.get(brief._id) || null,
    }));

    // Sort by scheduled date
    briefsWithDrafts.sort((a, b) => a.scheduledDate - b.scheduledDate);

    return {
      projectId: args.projectId,
      briefs: briefsWithDrafts,
      stats: {
        totalBriefs: briefs.length,
        briefsWithDetails: briefs.filter((b) => b.titleOptions && b.titleOptions.length > 0).length,
        briefsWithDrafts: draftsByBriefId.size,
        publishedBriefs: briefs.filter((b) => b.status === "published").length,
      },
    };
  },
});


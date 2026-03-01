import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const dump = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("analyticsData")
      .withIndex("by_project_date", (q) => q.eq("projectId", args.projectId))
      .collect();
  }
});

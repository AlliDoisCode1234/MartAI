import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get all publishing data for a project (scheduled posts with draft/brief info)
 */
export const getPublishingByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    // Get all scheduled posts
    const posts = await ctx.db
      .query("scheduledPosts")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Enrich with draft and brief info
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const draft = await ctx.db.get(post.draftId);
        const brief = await ctx.db.get(post.briefId);

        return {
          ...post,
          draft: draft
            ? {
                content: draft.content?.substring(0, 200) + "...", // Preview
                wordCount: draft.wordCount,
                qualityScore: draft.qualityScore,
                toneScore: draft.toneScore,
                status: draft.status,
              }
            : null,
          brief: brief
            ? {
                title: brief.title,
                metaTitle: brief.metaTitle,
                metaDescription: brief.metaDescription,
              }
            : null,
        };
      })
    );

    // Sort by publish date
    enrichedPosts.sort((a, b) => a.publishDate - b.publishDate);

    return {
      projectId: args.projectId,
      posts: enrichedPosts,
      stats: {
        totalPosts: posts.length,
        scheduled: posts.filter((p) => p.status === "scheduled").length,
        published: posts.filter((p) => p.status === "published").length,
        failed: posts.filter((p) => p.status === "failed").length,
      },
    };
  },
});


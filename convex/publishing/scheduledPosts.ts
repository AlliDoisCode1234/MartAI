import {
  mutation,
  query,
  internalMutation,
  internalQuery,
} from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";

/**
 * CREATE SCHEDULED POST
 */
export const createScheduledPost = mutation({
  args: {
    draftId: v.id("drafts"),
    projectId: v.id("projects"),
    briefId: v.id("briefs"),
    publishDate: v.number(),
    timezone: v.string(),
    platform: v.string(),
    tags: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("scheduledPosts", {
      ...args,
      tags: args.tags ?? [],
      categories: args.categories ?? [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // schedule publish job
    const delayMs = args.publishDate - Date.now();
    const publishFn = internal.publishing.scheduledPosts.publishPost;

    await ctx.scheduler.runAfter(
      delayMs > 0 ? delayMs : 0,
      publishFn,
      { postId }
    );

    return postId;
  },
});

/**
 * INTERNAL PUBLISH POST
 */
export const publishPost = internalMutation({
  args: { postId: v.id("scheduledPosts") },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    if (!post) return;
    if (post.status !== "scheduled") return;
    
    // Mark publishing
    await ctx.db.patch(postId, { status: "publishing", updatedAt: Date.now() });
    
    try {
      // Get draft
      const draft = await ctx.db.get(post.draftId);
      if (!draft) throw new Error("Draft not found");
    
      // Get brief
      const brief = await ctx.db.get(post.briefId);
    
      // 1️⃣ Get project
      const project = await ctx.db.get(post.projectId);
      if (!project) throw new Error("Project not found");
    
      // 2️⃣ Find client ID from project → user → client
      const client = await ctx.db
        .query("clients")
        .withIndex("by_user", (q) => q.eq("userId", project.userId))
        .first();
      if (!client) throw new Error("Client not found");
    
      // 3️⃣ Query OAuth token using the correct client ID
      const connection = await ctx.db
        .query("oauthTokens")
        .withIndex("by_client_platform", (q) =>
          q.eq("clientId", client._id).eq("platform", post.platform)
        )
        .first();
      if (!connection) throw new Error("OAuth connection not found");
    
      // External publishing handled elsewhere
      await ctx.db.patch(postId, { updatedAt: Date.now() });
    
    } catch (err) {
      await ctx.db.patch(postId, {
        status: "failed",
        errorMessage: err instanceof Error ? err.message : "Unknown error",
        updatedAt: Date.now(),
      });
    }
    },
}); 

/**
 * QUERY: Get scheduled posts for a project
 */
export const getScheduledPosts = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) =>
    ctx.db
      .query("scheduledPosts")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect(),
});

/**
 * QUERY: Get posts filtered by status
 */
export const getScheduledPostsByStatus = query({
  args: { projectId: v.id("projects"), status: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("scheduledPosts")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return posts.filter((p) => p.status === args.status);
  },
});

/**
 * UPDATE SCHEDULED POST
 */
export const updateScheduledPost = mutation({
  args: {
    postId: v.id("scheduledPosts"),
    publishDate: v.optional(v.number()),
    timezone: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
    status: v.optional(v.string()),
    publishedUrl: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { postId, ...updates } = args;

    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");

    // reschedule if needed
    if (updates.publishDate && updates.publishDate !== post.publishDate) {
      const delayMs = updates.publishDate - Date.now();
      await ctx.scheduler.runAfter(
        delayMs > 0 ? delayMs : 0,
        internal.publishing.scheduledPosts.publishPost,
        { postId }
      );
    }

    return ctx.db.patch(postId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

/**
 * CANCEL
 */
export const cancelScheduledPost = mutation({
  args: { postId: v.id("scheduledPosts") },
  handler: async (ctx, { postId }) =>
    ctx.db.patch(postId, {
      status: "cancelled",
      updatedAt: Date.now(),
    }),
});

/**
 * DELETE
 */
export const deleteScheduledPost = mutation({
  args: { postId: v.id("scheduledPosts") },
  handler: async (ctx, { postId }) => ctx.db.delete(postId),
});

/**
 * QUERY: Get single post by ID
 */
export const getScheduledPostById = query({
  args: { postId: v.id("scheduledPosts") },
  handler: async (ctx, { postId }) => {
    return await ctx.db.get(postId);
  },
});

/**
 * INTERNAL QUERY (used by cron)
 */
export const getDuePosts = internalQuery({
  args: { beforeTime: v.number() },
  handler: async (ctx, { beforeTime }) => {
    const posts = await ctx.db.query("scheduledPosts").collect();

    return posts.filter(
      (p) => p.status === "scheduled" && p.publishDate <= beforeTime
    );
  },
});

/**
 * MUTATION: Retry failed publish
 */
export const retryFailedPublish = mutation({
  args: { postId: v.id("scheduledPosts") },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");
    
    if (post.status !== "failed") {
      throw new Error("Post is not in failed status");
    }

    // Reset to scheduled and reschedule
    await ctx.db.patch(postId, {
      status: "scheduled",
      errorMessage: undefined,
      updatedAt: Date.now(),
    });

    // Reschedule for immediate execution (or use original publishDate if in future)
    const delayMs = Math.max(0, post.publishDate - Date.now());
    await ctx.scheduler.runAfter(
      delayMs,
      internal.publishing.scheduledPosts.publishPost,
      { postId }
    );

    return postId;
  },
});

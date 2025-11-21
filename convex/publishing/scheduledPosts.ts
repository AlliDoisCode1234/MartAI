import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { internal } from "./_generated/api";

// Create scheduled post
export const createScheduledPost = mutation({
  args: {
    draftId: v.id("drafts"),
    projectId: v.id("projects"),
    briefId: v.id("briefs"),
    publishDate: v.number(), // timestamp
    timezone: v.string(), // e.g., "America/New_York"
    platform: v.string(), // wordpress, shopify
    tags: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
    status: v.string(), // scheduled, publishing, published, failed
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("scheduledPosts", {
      draftId: args.draftId,
      projectId: args.projectId,
      briefId: args.briefId,
      publishDate: args.publishDate,
      timezone: args.timezone,
      platform: args.platform,
      tags: args.tags || [],
      categories: args.categories || [],
      slug: args.slug,
      status: args.status || "scheduled",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Schedule the publish job using Convex's internal scheduling
    // Calculate delay in milliseconds
    const delayMs = args.publishDate - Date.now();
    
    // Schedule the publish job using Convex's scheduler
    const delayMs = args.publishDate - Date.now();
    
    if (delayMs > 0 && delayMs < 365 * 24 * 60 * 60 * 1000) { // Max 1 year
      // Schedule the publish mutation to run at the specified time
      await ctx.scheduler.runAfter(delayMs, internal.scheduledPosts.publishPost, {
        postId,
      });
    } else if (delayMs <= 0) {
      // Publish immediately if time has passed
      await ctx.scheduler.runAfter(0, internal.scheduledPosts.publishPost, {
        postId,
      });
    }

    return postId;
  },
});

// Internal mutation to publish the post (called by scheduler)
export const publishPost = internalMutation({
  args: {
    postId: v.id("scheduledPosts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    
    if (!post) {
      console.error('Scheduled post not found:', args.postId);
      return;
    }

    if (post.status !== 'scheduled') {
      console.log('Post already processed:', post.status);
      return;
    }

    // Update status to publishing
    await ctx.db.patch(args.postId, {
      status: 'publishing',
      updatedAt: Date.now(),
    });

    try {
      // Get draft content
      const draft = await ctx.db.get(post.draftId);
      if (!draft) {
        throw new Error('Draft not found');
      }

      // Get brief for metadata
      const brief = await ctx.db.get(post.briefId);
      
      // Get OAuth connection
      const connection = await ctx.db
        .query("oauthTokens")
        .withIndex("by_client_platform", (q) => 
          q.eq("clientId", post.projectId).eq("platform", post.platform)
        )
        .first();

      if (!connection) {
        throw new Error(`${post.platform} connection not found`);
      }

      // Note: Convex internal mutations can't make external HTTP calls
      // The actual publishing will be handled by the /api/publish/now endpoint
      // which can be called via webhook or scheduled job
      // For now, we'll mark it as needing external processing
      const publishResult = {
        success: true,
        url: connection?.siteUrl ? `${connection.siteUrl}/${post.slug || 'post'}` : 'pending',
      };

      // Note: Actual publishing happens via external HTTP call
      // This mutation just updates status when triggered
      // The /api/publish/trigger endpoint handles the actual CMS API calls
      await ctx.db.patch(args.postId, {
        status: 'publishing',
        updatedAt: Date.now(),
      });

      // Draft and brief will be updated by external HTTP action
      // after successful CMS publish

    } catch (error) {
      console.error('Publish error:', error);
      await ctx.db.patch(args.postId, {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: Date.now(),
      });
    }
  },
});

// Get scheduled posts by project
export const getScheduledPosts = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scheduledPosts")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

// Get scheduled posts by status
export const getScheduledPostsByStatus = query({
  args: { 
    projectId: v.id("projects"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const allPosts = await ctx.db
      .query("scheduledPosts")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    
    return allPosts.filter(p => p.status === args.status);
  },
});

// Update scheduled post
export const updateScheduledPost = mutation({
  args: {
    postId: v.id("scheduledPosts"),
    publishDate: v.optional(v.number()),
    timezone: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { postId, ...updates } = args;
    const cleanUpdates: any = { updatedAt: Date.now() };
    
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        cleanUpdates[key] = updates[key];
      }
    });

    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // If publish date changed, reschedule
    if (updates.publishDate && updates.publishDate !== post.publishDate) {
      const delayMs = updates.publishDate - Date.now();
      if (delayMs > 0 && delayMs < 365 * 24 * 60 * 60 * 1000) {
        await ctx.scheduler.runAfter(delayMs, internal.scheduledPosts.publishPost, {
          postId,
        });
      }
    }
    
    return await ctx.db.patch(postId, cleanUpdates);
  },
});

// Cancel scheduled post
export const cancelScheduledPost = mutation({
  args: { postId: v.id("scheduledPosts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, {
      status: 'cancelled',
      updatedAt: Date.now(),
    });
  },
});

// Delete scheduled post
export const deleteScheduledPost = mutation({
  args: { postId: v.id("scheduledPosts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.postId);
  },
});

// Internal query to get due posts (for cron/webhook)
export const getDuePosts = internalQuery({
  args: {
    beforeTime: v.number(),
  },
  handler: async (ctx, args) => {
    // Get all scheduled posts due before the specified time
    const allPosts = await ctx.db
      .query("scheduledPosts")
      .collect();
    
    return allPosts.filter(p => 
      p.status === 'scheduled' && p.publishDate <= args.beforeTime
    );
  },
});


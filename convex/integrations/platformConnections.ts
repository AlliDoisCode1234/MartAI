import { v } from 'convex/values';
import { mutation, query, internalMutation } from '../_generated/server';

/**
 * Platform Connections - Queries & Mutations
 *
 * Handles WordPress, Shopify, and other CMS connection storage.
 * Actions are in platformConnectionActions.ts
 */

// Platform type
export const platformValidator = v.union(
  v.literal('wordpress'),
  v.literal('shopify'),
  v.literal('wix'),
  v.literal('webflow'),
  v.literal('ghost')
);

/**
 * Get connection for a project and platform
 */
export const getConnection = query({
  args: {
    projectId: v.id('projects'),
    platform: platformValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('platformConnections')
      .withIndex('by_project_platform', (q) =>
        q.eq('projectId', args.projectId).eq('platform', args.platform)
      )
      .first();
  },
});

/**
 * List all connections for a project
 */
export const listConnections = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('platformConnections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

/**
 * Save or update a platform connection
 */
export const saveConnection = mutation({
  args: {
    projectId: v.id('projects'),
    platform: platformValidator,
    siteUrl: v.string(),
    siteName: v.optional(v.string()),
    credentials: v.object({
      username: v.optional(v.string()),
      applicationPassword: v.optional(v.string()),
      apiKey: v.optional(v.string()),
      accessToken: v.optional(v.string()),
      refreshToken: v.optional(v.string()),
    }),
    defaultPostType: v.optional(v.union(v.literal('post'), v.literal('page'))),
    defaultStatus: v.optional(
      v.union(v.literal('draft'), v.literal('publish'), v.literal('private'))
    ),
  },
  handler: async (ctx, args) => {
    // Check if connection already exists
    const existing = await ctx.db
      .query('platformConnections')
      .withIndex('by_project_platform', (q) =>
        q.eq('projectId', args.projectId).eq('platform', args.platform)
      )
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        siteUrl: args.siteUrl,
        siteName: args.siteName,
        credentials: args.credentials,
        defaultPostType: args.defaultPostType,
        defaultStatus: args.defaultStatus,
        isValid: false, // Reset validation
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new
      return await ctx.db.insert('platformConnections', {
        projectId: args.projectId,
        platform: args.platform,
        siteUrl: args.siteUrl,
        siteName: args.siteName,
        credentials: args.credentials,
        isValid: false,
        defaultPostType: args.defaultPostType,
        defaultStatus: args.defaultStatus,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

/**
 * Delete a platform connection
 */
export const deleteConnection = mutation({
  args: {
    connectionId: v.id('platformConnections'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.connectionId);
    return { success: true };
  },
});

/**
 * Update validation status (internal use)
 */
export const updateValidationStatus = internalMutation({
  args: {
    connectionId: v.id('platformConnections'),
    isValid: v.boolean(),
    siteName: v.optional(v.string()),
    validationError: v.optional(v.string()),
    capabilities: v.optional(
      v.object({
        canPublishPosts: v.optional(v.boolean()),
        canPublishPages: v.optional(v.boolean()),
        canUploadMedia: v.optional(v.boolean()),
        canManageCategories: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.connectionId, {
      isValid: args.isValid,
      siteName: args.siteName,
      validationError: args.validationError,
      capabilities: args.capabilities,
      lastValidatedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

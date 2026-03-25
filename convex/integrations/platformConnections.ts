import { v } from 'convex/values';
import { mutation, query, internalMutation } from '../_generated/server';
import { internal } from '../_generated/api';
import {
  encryptPlatformCredentials,
  decryptPlatformCredentials,
  type PlatformCredentials,
  type EncryptedCredentials,
} from '../lib/encryptedCredentials';

/**
 * Platform Connections - Queries & Mutations
 *
 * Handles WordPress, Shopify, and other CMS connection storage.
 * Actions are in platformConnectionActions.ts
 *
 * Security: All credentials are encrypted at rest using AES-256-GCM.
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
 * Get connection for a project and platform (with decrypted credentials)
 */
export const getConnection = query({
  args: {
    projectId: v.id('projects'),
    platform: platformValidator,
  },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query('platformConnections')
      .withIndex('by_project_platform', (q) =>
        q.eq('projectId', args.projectId).eq('platform', args.platform)
      )
      .first();

    if (!connection) return null;

    // Decrypt credentials for use
    const decryptedCredentials = await decryptPlatformCredentials(
      connection.credentials as EncryptedCredentials | PlatformCredentials
    );

    return {
      ...connection,
      credentials: decryptedCredentials,
    };
  },
});

/**
 * List all connections for a project (with decrypted credentials)
 */
export const listConnections = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const connections = await ctx.db
      .query('platformConnections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Decrypt credentials for each connection
    return Promise.all(
      connections.map(async (conn) => ({
        ...conn,
        credentials: await decryptPlatformCredentials(
          conn.credentials as EncryptedCredentials | PlatformCredentials
        ),
      }))
    );
  },
});

/**
 * Save or update a platform connection (encrypts credentials)
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

    // Encrypt credentials before storage
    const encryptedCredentials = await encryptPlatformCredentials(args.credentials);

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        siteUrl: args.siteUrl,
        siteName: args.siteName,
        credentials: encryptedCredentials,
        defaultPostType: args.defaultPostType,
        defaultStatus: args.defaultStatus,
        isValid: false, // Reset validation
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new
      const connectionId = await ctx.db.insert('platformConnections', {
        projectId: args.projectId,
        platform: args.platform,
        siteUrl: args.siteUrl,
        siteName: args.siteName,
        credentials: encryptedCredentials,
        isValid: false,
        defaultPostType: args.defaultPostType,
        defaultStatus: args.defaultStatus,
        createdAt: now,
        updatedAt: now,
      });

      // Track integration milestone for new connections (DATA-2)
      if (args.platform === 'wordpress') {
        try {
          const project = await ctx.db.get(args.projectId);
          if (project?.userId) {
            await ctx.scheduler.runAfter(0, internal.lib.engagementMilestones.trackEngagement, {
              userId: project.userId,
              milestone: 'wordpress',
              incrementTotal: false,
            });
          }
        } catch { /* fire-and-forget */ }
      }

      return connectionId;
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

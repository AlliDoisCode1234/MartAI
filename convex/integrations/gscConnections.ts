import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { encryptCredential, decryptCredential } from '../lib/encryption';

// Create or update GSC connection
export const upsertGSCConnection = mutation({
  args: {
    projectId: v.id('projects'),
    siteUrl: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if connection exists
    const existing = await ctx.db
      .query('gscConnections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    // Encrypt tokens before storage
    const encryptedAccessToken = await encryptCredential(args.accessToken);
    const encryptedRefreshToken = args.refreshToken
      ? await encryptCredential(args.refreshToken)
      : undefined;

    const connectionData = {
      projectId: args.projectId,
      siteUrl: args.siteUrl,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      lastSync: Date.now(),
      updatedAt: Date.now(),
    };

    if (existing) {
      return await ctx.db.patch(existing._id, connectionData);
    }

    return await ctx.db.insert('gscConnections', {
      ...connectionData,
      createdAt: Date.now(),
    });
  },
});

// Get GSC connection by project (with decrypted tokens)
export const getGSCConnection = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query('gscConnections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    if (!connection) return null;

    // Decrypt tokens for use
    return {
      ...connection,
      accessToken: await decryptCredential(connection.accessToken),
      refreshToken: connection.refreshToken
        ? await decryptCredential(connection.refreshToken)
        : undefined,
    };
  },
});

// Update last sync time
export const updateLastSync = mutation({
  args: {
    connectionId: v.id('gscConnections'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.connectionId, {
      lastSync: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Delete GSC connection
export const deleteGSCConnection = mutation({
  args: {
    connectionId: v.id('gscConnections'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.connectionId);
  },
});

export const updateTokens = mutation({
  args: {
    connectionId: v.id('gscConnections'),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Encrypt tokens before storage
    const encryptedAccessToken = await encryptCredential(args.accessToken);

    const updates: Record<string, unknown> = {
      accessToken: encryptedAccessToken,
      updatedAt: Date.now(),
    };
    if (args.refreshToken) {
      updates.refreshToken = await encryptCredential(args.refreshToken);
    }
    await ctx.db.patch(args.connectionId, updates);
  },
});

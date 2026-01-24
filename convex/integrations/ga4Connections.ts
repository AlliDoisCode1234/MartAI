import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { encryptCredential, decryptCredential } from '../lib/encryption';

// Create or update GA4 connection
export const upsertGA4Connection = mutation({
  args: {
    projectId: v.id('projects'),
    propertyId: v.string(),
    propertyName: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if connection exists
    const existing = await ctx.db
      .query('ga4Connections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    // Encrypt tokens before storage
    const encryptedAccessToken = await encryptCredential(args.accessToken);
    const encryptedRefreshToken = args.refreshToken
      ? await encryptCredential(args.refreshToken)
      : undefined;

    const connectionData = {
      projectId: args.projectId,
      propertyId: args.propertyId,
      propertyName: args.propertyName,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      lastSync: Date.now(),
      updatedAt: Date.now(),
    };

    if (existing) {
      return await ctx.db.patch(existing._id, connectionData);
    }

    return await ctx.db.insert('ga4Connections', {
      ...connectionData,
      createdAt: Date.now(),
    });
  },
});

// Get GA4 connection by project (with decrypted tokens)
export const getGA4Connection = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query('ga4Connections')
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
    connectionId: v.id('ga4Connections'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.connectionId, {
      lastSync: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Delete GA4 connection
export const deleteGA4Connection = mutation({
  args: {
    connectionId: v.id('ga4Connections'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.connectionId);
  },
});

export const updateTokens = mutation({
  args: {
    connectionId: v.id('ga4Connections'),
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

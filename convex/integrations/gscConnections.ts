import { mutation, query, internalQuery, internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { requireProjectAccess } from '../lib/rbac';
import { encryptCredential, decryptCredential } from '../lib/encryption';

// Create or update GSC connection
export const upsertGSCConnection = mutation({
  args: {
    projectId: v.id('projects'),
    siteUrl: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    availableSites: v.optional(
      v.array(
        v.object({
          siteUrl: v.string(),
          permissionLevel: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    // Security: require editor access to create/update connections
    await requireProjectAccess(ctx, args.projectId, 'editor');
    console.log('[GoogleOAuth][Mutation] upsertGSCConnection called with:', {
      projectId: args.projectId,
      siteUrl: args.siteUrl,
      hasAccessToken: !!args.accessToken,
      hasRefreshToken: !!args.refreshToken,
    });

    // Check if connection exists
    const existing = await ctx.db
      .query('gscConnections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    console.log(
      '[GoogleOAuth][Mutation] Existing GSC connection:',
      existing ? existing._id : 'NONE'
    );

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
      availableSites: args.availableSites,
      lastSync: Date.now(),
      updatedAt: Date.now(),
    };

    if (existing) {
      const result = await ctx.db.patch(existing._id, connectionData);
      console.log('[GoogleOAuth][Mutation] GSC connection PATCHED:', existing._id);
      return result;
    }

    const result = await ctx.db.insert('gscConnections', {
      ...connectionData,
      createdAt: Date.now(),
    });
    console.log('[GoogleOAuth][Mutation] GSC connection INSERTED:', result);
    return result;
  },
});

// Get GSC connection by project (without tokens, for client)
export const getGSCConnection = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query('gscConnections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    if (!connection) return null;

    // Limited projection — NO tokens
    return {
      _id: connection._id,
      projectId: connection.projectId,
      siteUrl: connection.siteUrl,
      availableSites: connection.availableSites,
      lastSync: connection.lastSync,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    };
  },
});

// Get GSC connection by project (with decrypted tokens, for server)
export const getGSCConnectionInternal = internalQuery({
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

// Update last sync time (internal only — called from sync.ts/keywordActions.ts/analyticsWorkflows.ts)
export const updateLastSync = internalMutation({
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
    projectId: v.id('projects'),
    connectionId: v.id('gscConnections'),
  },
  handler: async (ctx, args) => {
    // Security: require editor access to delete connections
    await requireProjectAccess(ctx, args.projectId, 'editor');
    await ctx.db.delete(args.connectionId);
  },
});

export const updateTokens = internalMutation({
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

// Switch the active GSC site (property picker)
export const switchGSCSite = mutation({
  args: {
    projectId: v.id('projects'),
    siteUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // Security: Require project editor access
    await requireProjectAccess(ctx, args.projectId, 'editor');

    const connection = await ctx.db
      .query('gscConnections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    if (!connection) {
      throw new Error('No GSC connection found for this project');
    }

    // Verify the requested site is in the available list (mandatory — never skip)
    if (!connection.availableSites || connection.availableSites.length === 0) {
      throw new Error(
        'No available sites list for this connection. Please reconnect Google Search Console.'
      );
    }

    const isValid = connection.availableSites.some((site) => site.siteUrl === args.siteUrl);
    if (!isValid) {
      throw new Error('Selected site is not available in your Google account');
    }

    await ctx.db.patch(connection._id, {
      siteUrl: args.siteUrl,
      updatedAt: Date.now(),
    });

    console.log('[GSC] Site switched for project', args.projectId);
    return { success: true, siteUrl: args.siteUrl };
  },
});

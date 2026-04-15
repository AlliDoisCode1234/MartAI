import { mutation, query, internalQuery, internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import { encryptCredential, decryptCredential } from '../lib/encryption';
import { requireProjectAccess } from '../lib/rbac';
import { internal } from '../_generated/api';
import { PENDING_SELECTION } from '../lib/constants';

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
    // Security: require editor access to create/update connections
    await requireProjectAccess(ctx, args.projectId, 'editor');
    console.log('[GoogleOAuth][Mutation] upsertGA4Connection called:', {
      hasAccessToken: !!args.accessToken,
      hasRefreshToken: !!args.refreshToken,
    });

    // Check if connection exists
    const existing = await ctx.db
      .query('ga4Connections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    console.log(
      '[GoogleOAuth][Mutation] Existing GA4 connection:',
      existing ? existing._id : 'NONE'
    );

    // Encrypt tokens before storage
    const encryptedAccessToken = await encryptCredential(args.accessToken);
    const encryptedRefreshToken = args.refreshToken
      ? await encryptCredential(args.refreshToken)
      : undefined;

    const connectionData = {
      projectId: args.projectId,
      propertyId: args.propertyId,
      propertyName: args.propertyName,
      isEncrypted: true,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      lastSync: Date.now(),
      updatedAt: Date.now(),
    };

    if (existing) {
      const result = await ctx.db.patch(existing._id, connectionData);
      console.log('[GoogleOAuth][Mutation] GA4 connection PATCHED:', existing._id);
      
      // Trigger background sync for immediate analytics value proposition
      if (process.env.VITEST !== 'true') {
        await ctx.scheduler.runAfter(0, internal.analytics.sync.syncProjectData, {
          projectId: args.projectId,
        });
      }
      return result;
    }

    const result = await ctx.db.insert('ga4Connections', {
      ...connectionData,
      createdAt: Date.now(),
    });
    console.log('[GoogleOAuth][Mutation] GA4 connection INSERTED:', result);
    
    // Trigger background sync for immediate analytics value proposition
    if (process.env.VITEST !== 'true') {
      await ctx.scheduler.runAfter(0, internal.analytics.sync.syncProjectData, {
        projectId: args.projectId,
      });
    }
    return result;
  },
});

export const upsertGA4ConnectionInternal = internalMutation({
  args: {
    projectId: v.id('projects'),
    propertyId: v.string(),
    propertyName: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    availableProperties: v.optional(
      v.array(
        v.object({
          propertyId: v.string(),
          propertyName: v.string(),
          accountName: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    console.log('[GoogleOAuth][InternalMutation] upsertGA4ConnectionInternal called');

    const existing = await ctx.db
      .query('ga4Connections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    const encryptedAccessToken = await encryptCredential(args.accessToken);
    const encryptedRefreshToken = args.refreshToken
      ? await encryptCredential(args.refreshToken)
      : undefined;

    const connectionData = {
      projectId: args.projectId,
      propertyId: args.propertyId,
      propertyName: args.propertyName,
      isEncrypted: true,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      availableProperties: args.availableProperties,
      lastSync: Date.now(),
      updatedAt: Date.now(),
    };

    // Only trigger background sync if a real property was selected (not PENDING_SELECTION)
    const shouldSync = args.propertyId !== PENDING_SELECTION && process.env.VITEST !== 'true';

    if (existing) {
      if (!args.refreshToken) {
        delete connectionData.refreshToken;
      }
      const result = await ctx.db.patch(existing._id, connectionData);
      
      if (shouldSync) {
        await ctx.scheduler.runAfter(0, internal.analytics.sync.syncProjectData, {
          projectId: args.projectId,
        });
      }
      return result;
    }

    const result = await ctx.db.insert('ga4Connections', {
      ...connectionData,
      createdAt: Date.now(),
    });
    
    if (shouldSync) {
      await ctx.scheduler.runAfter(0, internal.analytics.sync.syncProjectData, {
        projectId: args.projectId,
      });
    }
    return result;
  },
});

// Get GA4 connection by project (without tokens, for client)
export const getGA4Connection = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query('ga4Connections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    if (!connection) return null;

    return {
      _id: connection._id,
      projectId: connection.projectId,
      propertyId: connection.propertyId,
      propertyName: connection.propertyName,
      availableProperties: connection.availableProperties,
      lastSync: connection.lastSync,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    };
  },
});

// Get GA4 connection by project (with decrypted tokens, for server)
export const getGA4ConnectionInternal = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query('ga4Connections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    if (!connection) return null;

    // Decrypt tokens for use (handle both OAuth and service account connections)
    let finalAccessToken = connection.accessToken;
    let finalRefreshToken = connection.refreshToken;

    try {
      if (connection.isEncrypted === true && connection.accessToken) {
        finalAccessToken = await decryptCredential(connection.accessToken);
      }
      if (connection.isEncrypted === true && connection.refreshToken) {
        finalRefreshToken = await decryptCredential(connection.refreshToken);
      }
    } catch (error) {
      console.warn('[GA4] Failed to decrypt connection token. Marking as invalid.', error);
      finalAccessToken = undefined;
      finalRefreshToken = undefined;
    }

    return {
      ...connection,
      accessToken: finalAccessToken,
      refreshToken: finalRefreshToken,
    };
  },
});

// Update last sync time (internal only — called from sync.ts/analyticsWorkflows.ts)
export const updateLastSync = internalMutation({
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
    projectId: v.id('projects'),
    connectionId: v.id('ga4Connections'),
  },
  handler: async (ctx, args) => {
    // Security: require editor access to delete connections
    await requireProjectAccess(ctx, args.projectId, 'editor');
    await ctx.db.delete(args.connectionId);
  },
});

// Select a GA4 property from the available properties list (property picker)
export const selectGA4Property = mutation({
  args: {
    projectId: v.id('projects'),
    propertyId: v.string(),
  },
  handler: async (ctx, args) => {
    // Security: Require project editor access
    await requireProjectAccess(ctx, args.projectId, 'editor');

    const connection = await ctx.db
      .query('ga4Connections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    if (!connection) {
      throw new Error('No GA4 connection found for this project');
    }

    // Verify the requested property is in the available list
    if (!connection.availableProperties || connection.availableProperties.length === 0) {
      throw new Error(
        'No available properties list for this connection. Please reconnect Google Analytics.'
      );
    }

    const selected = connection.availableProperties.find(
      (p) => p.propertyId === args.propertyId
    );
    if (!selected) {
      throw new Error('Selected property is not available in your Google account');
    }

    await ctx.db.patch(connection._id, {
      propertyId: selected.propertyId,
      propertyName: selected.propertyName,
      updatedAt: Date.now(),
    });

    // Trigger analytics sync now that we have a real property
    if (process.env.VITEST !== 'true') {
      await ctx.scheduler.runAfter(0, internal.analytics.sync.syncProjectData, {
        projectId: args.projectId,
      });
    }

    console.log('[GA4] Property selected for project', args.projectId, ':', selected.propertyId);
    return { success: true, propertyId: selected.propertyId, propertyName: selected.propertyName };
  },
});

export const updateTokens = internalMutation({
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

// Save a service account connection (for enterprise users)
export const saveServiceAccountConnection = mutation({
  args: {
    projectId: v.id('projects'),
    propertyId: v.string(),
    propertyName: v.string(),
    serviceAccountEmail: v.string(),
    serviceAccountKey: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if connection exists
    const existing = await ctx.db
      .query('ga4Connections')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    // Encrypt the service account key before storage
    const encryptedKey = await encryptCredential(args.serviceAccountKey);

    const connectionData = {
      projectId: args.projectId,
      propertyId: args.propertyId,
      propertyName: args.propertyName,
      connectionType: 'service_account' as const,
      serviceAccountEmail: args.serviceAccountEmail,
      encryptedServiceAccountKey: encryptedKey,
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

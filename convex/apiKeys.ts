import { v } from 'convex/values';
import { mutation, query, internalQuery } from './_generated/server';
import { Id } from './_generated/dataModel';

/**
 * API Keys Module
 * ├── convex/
 * │   └── apiKeys.ts (this file)
 *
 * Manages API keys for public API access (Enterprise feature)
 */

// Generate a random API key with mart_ prefix
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'mart_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Simple hash function (in production, use crypto.subtle.digest)
function hashKey(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(16).padStart(16, '0');
}

type Permission = 'read' | 'write' | 'admin';

// Create a new API key
export const createApiKey = mutation({
  args: {
    projectId: v.id('projects'),
    name: v.string(),
    description: v.optional(v.string()),
    permissions: v.array(v.union(v.literal('read'), v.literal('write'), v.literal('admin'))),
    expiresInDays: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ keyId: Id<'apiKeys'>; apiKey: string }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    // Get user from identity
    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', identity.email))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    // Verify user has access to this project
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== user._id) {
      throw new Error('Access denied to project');
    }

    // Check subscription tier (Enterprise only)
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    if (!subscription || subscription.planTier !== 'enterprise') {
      throw new Error('API keys require Enterprise plan');
    }

    // Generate the API key
    const apiKey = generateApiKey();
    const keyHash = hashKey(apiKey);
    const keyPrefix = apiKey.substring(0, 12); // mart_xxxx

    const now = Date.now();
    const expiresAt = args.expiresInDays
      ? now + args.expiresInDays * 24 * 60 * 60 * 1000
      : undefined;

    const keyId = await ctx.db.insert('apiKeys', {
      userId: user._id,
      projectId: args.projectId,
      keyHash,
      keyPrefix,
      name: args.name,
      description: args.description,
      permissions: args.permissions as Permission[],
      isActive: true,
      usageCount: 0,
      expiresAt,
      createdAt: now,
    });

    // Return the full key only once (user must save it)
    return { keyId, apiKey };
  },
});

// List API keys for a project (doesn't return full keys)
export const listApiKeys = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', identity.email))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    return await ctx.db
      .query('apiKeys')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .filter((q) => q.eq(q.field('userId'), user._id))
      .collect();
  },
});

// Revoke an API key
export const revokeApiKey = mutation({
  args: {
    keyId: v.id('apiKeys'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', identity.email))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    const apiKey = await ctx.db.get(args.keyId);
    if (!apiKey || apiKey.userId !== user._id) {
      throw new Error('API key not found');
    }

    await ctx.db.patch(args.keyId, {
      isActive: false,
      revokedAt: Date.now(),
    });

    return { success: true };
  },
});

// Public: Validate API key (called from Next.js API routes via HTTP client)
// Note: No auth required - the API key itself is the authentication
export const validateApiKey = query({
  args: {
    keyHash: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = await ctx.db
      .query('apiKeys')
      .withIndex('by_key_hash', (q) => q.eq('keyHash', args.keyHash))
      .first();

    if (!apiKey) {
      return null;
    }

    // Check if active
    if (!apiKey.isActive) {
      return null;
    }

    // Check expiration
    if (apiKey.expiresAt && apiKey.expiresAt < Date.now()) {
      return null;
    }

    return {
      keyId: apiKey._id,
      userId: apiKey.userId,
      projectId: apiKey.projectId,
      permissions: apiKey.permissions,
    };
  },
});

// Internal: Record API key usage
export const recordApiKeyUsage = mutation({
  args: {
    keyId: v.id('apiKeys'),
  },
  handler: async (ctx, args) => {
    const apiKey = await ctx.db.get(args.keyId);
    if (!apiKey) return;

    await ctx.db.patch(args.keyId, {
      lastUsedAt: Date.now(),
      usageCount: apiKey.usageCount + 1,
    });
  },
});

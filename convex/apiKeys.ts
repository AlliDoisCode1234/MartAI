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

// Generate a random API key with mart_ prefix (32 random chars)
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'mart_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

/**
 * Hash an API key for secure storage
 * Uses multiple passes of djb2-like hashing to produce a 64-char hex string
 */
function hashKey(key: string): string {
  // Helper: simple 32-bit hash
  const hash32 = (str: string, seed: number): number => {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  };

  // Generate 8 hash values for 64 chars total
  const h1 = hash32(key, 5381).toString(16).padStart(8, '0');
  const h2 = hash32(key, 33).toString(16).padStart(8, '0');
  const h3 = hash32(key.split('').reverse().join(''), 5381).toString(16).padStart(8, '0');
  const h4 = hash32(key.split('').reverse().join(''), 33).toString(16).padStart(8, '0');
  const h5 = hash32(key + key, 7919)
    .toString(16)
    .padStart(8, '0');
  const h6 = hash32(key, 65599).toString(16).padStart(8, '0');
  const h7 = hash32(key.slice(0, Math.floor(key.length / 2)), 5381)
    .toString(16)
    .padStart(8, '0');
  const h8 = hash32(key.slice(Math.floor(key.length / 2)), 5381)
    .toString(16)
    .padStart(8, '0');

  return h1 + h2 + h3 + h4 + h5 + h6 + h7 + h8;
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

/**
 * Check and consume API rate limit
 * Returns rate limit status and headers to include in response
 *
 * Note: This uses a simple in-memory approximation for now.
 * For production, integrate with @convex-dev/rate-limiter properly.
 */
export const checkApiRateLimit = mutation({
  args: {
    keyId: v.id('apiKeys'),
    endpoint: v.string(), // e.g., 'keywords_read', 'keywords_write'
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    allowed: boolean;
    limit: number;
    remaining: number;
    resetAt: number;
    retryAfter?: number;
  }> => {
    const apiKey = await ctx.db.get(args.keyId);
    if (!apiKey) {
      return { allowed: false, limit: 0, remaining: 0, resetAt: 0, retryAfter: 60 };
    }

    // Rate limits per minute by endpoint
    const limits: Record<string, number> = {
      keywords_read: 100,
      keywords_write: 50,
      clusters_read: 100,
      briefs_read: 100,
      analytics_read: 60,
    };

    const limit = limits[args.endpoint] || 100;
    const windowMs = 60 * 1000; // 1 minute window
    const now = Date.now();

    // Get or create rate limit tracking
    // We'll track this in the API key's lastUsedAt and usageCount
    // For a proper implementation, we'd use a separate rate limit table
    // For now, we'll do a simple check based on usageCount per minute

    // Calculate window start
    const windowStart = now - windowMs;

    // Check if we're in a new window (last used was before window start)
    const isNewWindow = !apiKey.lastUsedAt || apiKey.lastUsedAt < windowStart;

    // Get current count in this window
    // For simplicity, we'll reset usageCount if in new window
    let currentCount = isNewWindow ? 0 : apiKey.usageCount;

    // Calculate remaining
    const remaining = Math.max(0, limit - currentCount - 1);
    const allowed = currentCount < limit;

    // Calculate reset time (end of current window)
    const resetAt = Math.floor((now + windowMs) / 1000); // Unix timestamp in seconds

    // Update tracking
    if (allowed) {
      await ctx.db.patch(args.keyId, {
        lastUsedAt: now,
        usageCount: isNewWindow ? 1 : currentCount + 1,
      });
    }

    return {
      allowed,
      limit,
      remaining: allowed ? remaining : 0,
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((resetAt * 1000 - now) / 1000),
    };
  },
});

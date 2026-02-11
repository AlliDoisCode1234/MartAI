import { query, mutation, internalQuery } from './_generated/server';
import { v } from 'convex/values';
import { auth } from './auth';
import { checkAdminRole } from './lib/rbac';

/**
 * Filter user object to safe fields only.
 * Rule: Never return more data than the UI requires.
 */
function filterUserFields(user: any) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt ?? user._creationTime,
    onboardingStatus: user.onboardingStatus,
  };
}

/**
 * Get the currently logged-in user's data.
 *
 * Naming Convention:
 * - `me` = logged-in user (this query)
 * - `identity` = auth session (auth.getUserId)
 * - `user` = other users (getById for admins)
 */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) return null;

    // Return safe fields only - never expose passwordHash
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      membershipTier: user.membershipTier,
      createdAt: user.createdAt ?? user._creationTime,
      onboardingStatus: user.onboardingStatus,
      onboardingSteps: user.onboardingSteps,
      // Boolean flag for password (never return actual hash)
      hasPassword: !!user.passwordHash,
    };
  },
});

// Alias for backward compatibility - some components use api.users.current
export const current = me;

/**
 * Internal: Get user by ID for server-side operations (rate limiting, etc.)
 * Security: Internal-only, not exposed to clients.
 * Returns only fields needed for authorization decisions.
 */
export const getUser = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    return {
      _id: user._id,
      role: user.role,
      membershipTier: user.membershipTier,
      accountStatus: user.accountStatus,
    };
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error('Not authenticated');
    }

    // Get user to check if beta user
    const user = await ctx.db.get(userId);
    const now = Date.now();

    // For beta users, set betaExpiresAt to 6 months from now
    const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
    const updatePayload: {
      onboardingStatus: 'completed';
      betaExpiresAt?: number;
    } = {
      onboardingStatus: 'completed',
    };

    if (user?.isBetaUser && !user.betaExpiresAt) {
      updatePayload.betaExpiresAt = now + SIX_MONTHS_MS;
    }

    await ctx.db.patch(userId, updatePayload);
  },
});

export const resetOnboarding = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const viewerId = await auth.getUserId(ctx);
    if (viewerId === null) {
      throw new Error('Not authenticated');
    }
    const viewer = await ctx.db.get(viewerId);
    if (!viewer || (viewer.role !== 'admin' && viewer.role !== 'super_admin')) {
      throw new Error('Unauthorized: Admin access required');
    }
    await ctx.db.patch(args.userId, { onboardingStatus: 'in_progress' });
  },
});

/**
 * Get user by ID
 * Security: Users can only get their own data, admins can get any user.
 */
export const getById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const callerId = await auth.getUserId(ctx);
    if (!callerId) {
      throw new Error('Unauthorized: Not logged in');
    }

    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // Allow if requesting own data
    if (callerId === args.userId) {
      return filterUserFields(user);
    }

    // Allow if caller is admin
    const isAdmin = await checkAdminRole(ctx, 'admin');
    if (isAdmin) {
      return filterUserFields(user);
    }

    // Otherwise, deny access
    throw new Error('Forbidden: Cannot access other users data');
  },
});

/**
 * List all users (admin only, for bulk operations)
 * Security: Requires admin role, returns filtered fields only.
 */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const user = await ctx.db.get(userId);
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return [];
    }

    const users = await ctx.db.query('users').collect();
    return users.map(filterUserFields);
  },
});

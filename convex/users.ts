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
    organizationId: user.organizationId,
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

    const internalAdmin = await ctx.db
      .query('internalAdmins')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    // Return safe fields only - never expose passwordHash
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: internalAdmin?.role || 'user',
      membershipTier: user.membershipTier,
      createdAt: user.createdAt ?? user._creationTime,
      onboardingStatus: user.onboardingStatus,
      onboardingSteps: user.onboardingSteps,
      coachPreferences: user.coachPreferences,
      organizationId: user.organizationId,
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
    
    const internalAdmin = await ctx.db
      .query('internalAdmins')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    return {
      _id: user._id,
      role: internalAdmin?.role || 'user',
      membershipTier: user.membershipTier,
      accountStatus: user.accountStatus,
    };
  },
});

/**
 * Internal: Get full user document by ID for server-side integrations.
 * Security: Internal-only, not exposed to clients.
 * Returns ALL user fields (used by HubSpot sync, lifecycle events).
 * 
 * Differs from `getUser` which returns minimal auth fields,
 * and `getById` which requires caller authentication.
 */
export const getByIdInternal = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
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
    if (!viewer) {
      throw new Error('User not found');
    }
    const isAdmin = await checkAdminRole(ctx, 'admin');
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }
    // GLASSWING-016: Prevent downgrade BOLA on super admins
    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error('Target user not found');
    }

    const targetInternal = await ctx.db
      .query('internalAdmins')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    if (targetInternal?.role === 'super_admin' || targetUser.role === 'super_admin') {
      const isViewerSuperAdmin = await checkAdminRole(ctx, 'super_admin');
      if (!isViewerSuperAdmin) {
        throw new Error('GLASSWING BOLA: unauthorized to reset onboarding state for a super admin');
      }
    }

    await ctx.db.patch(args.userId, { 
      onboardingStatus: 'not_started',
      onboardingSteps: undefined,
    });
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
    const isAdmin = await checkAdminRole(ctx, 'admin');
    if (!isAdmin) {
      return [];
    }

    const users = await ctx.db.query('users').collect();
    return users.map(filterUserFields);
  },
});

/**
 * Update the user's AI Coach steering preferences.
 */
export const updateCoachPreferences = mutation({
  args: {
    tone: v.optional(v.string()),
    audienceExpertise: v.optional(v.string()),
    customConstraints: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    // We do a merge with existing preferences if we only want to update one field,
    // but the schema object requires all or nothing unless we fetch first or define them all.
    // Since args has optional fields, let's fetch first to merge.
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const existingPrefs = user.coachPreferences || {};

    await ctx.db.patch(userId, {
      coachPreferences: {
        tone: args.tone !== undefined ? args.tone : existingPrefs.tone,
        audienceExpertise: args.audienceExpertise !== undefined ? args.audienceExpertise : existingPrefs.audienceExpertise,
        customConstraints: args.customConstraints !== undefined ? args.customConstraints : existingPrefs.customConstraints,
      },
    });

    return { success: true };
  },
});

/**
 * Switch the user's active organization context.
 * Security: Verifies the user has an active membership in the target organization.
 */
export const switchOrganization = mutation({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    // Verify membership
    const membership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!membership || (membership.status && membership.status !== 'active')) {
      throw new Error('You are not an active member of this organization');
    }

    // Switch active context
    await ctx.db.patch(userId, {
      organizationId: args.organizationId,
    });

    return { success: true };
  },
});

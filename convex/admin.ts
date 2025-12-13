import { query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdmin } from './lib/rbac';

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

// Get all users with their subscription details (Admin only)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    // Security: Require admin role
    await requireAdmin(ctx);

    const users = await ctx.db.query('users').order('desc').collect();

    // Enrich with subscription info, filter to safe fields
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const subscription = await ctx.db
          .query('subscriptions')
          .withIndex('by_user', (q) => q.eq('userId', user._id))
          .first();

        return {
          ...filterUserFields(user),
          subscription: subscription
            ? {
                planTier: subscription.planTier,
                status: subscription.status,
              }
            : null,
        };
      })
    );

    return usersWithDetails;
  },
});

// Get a single user with details (Admin only)
export const getUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    // Security: Require admin role
    await requireAdmin(ctx);

    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    return {
      ...filterUserFields(user),
      subscription: subscription
        ? {
            planTier: subscription.planTier,
            status: subscription.status,
          }
        : null,
    };
  },
});

// Get all keywords across the system (Admin only)
export const getAllKeywords = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    // Security: Require admin role
    await requireAdmin(ctx);

    const limit = args.limit ?? 100;
    const keywords = await ctx.db.query('keywords').order('desc').take(limit);

    // Enrich with client name
    const keywordsWithClient = await Promise.all(
      keywords.map(async (kw) => {
        const project = kw.projectId ? await ctx.db.get(kw.projectId) : null;
        return {
          ...kw,
          clientName: project?.name || 'Unknown Project',
        };
      })
    );

    return keywordsWithClient;
  },
});

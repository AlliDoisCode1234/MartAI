import { query } from './_generated/server';
import { v } from 'convex/values';

// Get all users with their subscription details
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').order('desc').collect();

    // Enrich with subscription info
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const subscription = await ctx.db
          .query('subscriptions')
          .withIndex('by_user', (q) => q.eq('userId', user._id))
          .first();

        return {
          ...user,
          // Use createdAt if available, otherwise use _creationTime
          createdAt: user.createdAt ?? user._creationTime,
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

// Get a single user with details
export const getUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    return {
      ...user,
      createdAt: user.createdAt ?? user._creationTime,
      subscription: subscription
        ? {
            planTier: subscription.planTier,
            status: subscription.status,
          }
        : null,
    };
  },
});

// Get all keywords across the system
export const getAllKeywords = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
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

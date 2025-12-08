import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { auth } from './auth';

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error('Not authenticated');
    }
    await ctx.db.patch(userId, { onboardingStatus: 'completed' });
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
 */
export const getById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

/**
 * List all users (admin only, for bulk operations)
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

    return await ctx.db.query('users').collect();
  },
});

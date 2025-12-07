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

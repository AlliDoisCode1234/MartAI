import { internalQuery, internalMutation } from '../_generated/server';
import { v } from 'convex/values';

export const getCache = internalQuery({
  args: { inputHash: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('dataForSeoCache')
      .withIndex('by_hash', (q) => q.eq('inputHash', args.inputHash))
      .first();
  },
});

export const setCache = internalMutation({
  args: {
    inputHash: v.string(),
    endpoint: v.string(),
    response: v.any(),
  },
  handler: async (ctx, args) => {
    const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
    const now = Date.now();
    await ctx.db.insert('dataForSeoCache', {
      inputHash: args.inputHash,
      endpoint: args.endpoint,
      response: args.response,
      createdAt: now,
      expiresAt: now + TTL_MS,
    });
  },
});

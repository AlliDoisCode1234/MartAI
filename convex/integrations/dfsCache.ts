import { internalQuery, internalMutation } from '../_generated/server';
import { v } from 'convex/values';

export const getCache = internalQuery({
  args: { inputHash: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const rows = await ctx.db
      .query('dataForSeoCache')
      .withIndex('by_hash', (q) => q.eq('inputHash', args.inputHash))
      .filter((q) => q.gt(q.field('expiresAt'), now))
      .collect();

    if (rows.length === 0) return null;

    // Return the most recently created unexpired row
    rows.sort((a, b) => b.createdAt - a.createdAt);
    return rows[0];
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

    // Prevent uncontrollable table growth by clearing out all existing hashes for this input
    const existing = await ctx.db
      .query('dataForSeoCache')
      .withIndex('by_hash', (q) => q.eq('inputHash', args.inputHash))
      .collect();

    for (const row of existing) {
      await ctx.db.delete(row._id);
    }

    await ctx.db.insert('dataForSeoCache', {
      inputHash: args.inputHash,
      endpoint: args.endpoint,
      response: args.response,
      createdAt: now,
      expiresAt: now + TTL_MS,
    });
  },
});

import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';
import { api } from './_generated/api';

export const getStored = internalQuery({
  args: {
    inputHash: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('aiGenerations')
      .withIndex('by_hash', (q) => q.eq('inputHash', args.inputHash))
      .first();
  },
});

export const store = internalMutation({
  args: {
    inputHash: v.string(),
    operation: v.string(),
    provider: v.optional(v.string()),
    model: v.optional(v.string()),
    inputArgs: v.any(),
    output: v.any(),
    tokensIn: v.optional(v.number()),
    tokensOut: v.optional(v.number()),
    cost: v.optional(v.number()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Check for collision/duplicate just in case, though hash should be unique enough for our purpose
    // If it exists, we could update it or just ignore. Ideally, we just create a new entry if we want an audit log of *attempts*,
    // but the user want storage for *retrieval*.
    // If we want it to be a cache, we should just return if it exists?
    // But hashing might have collisions (unlikely with SHA256 of full inputs).
    // Let's just blindly insert for now as an audit log. The 'getStored' will pick the first one.

    // Actually, if we want an audit log, we insert every time.
    // If we simply want a cache, we could check existence.
    // Given the requirement "store all data we get... and see if we have data before we use",
    // we should treat it as a cache.
    // However, if we re-run an action despite cache (e.g. forced), we might want to log it.
    // Let's insert. The usage pattern will be: check -> if miss -> fetch -> store.

    await ctx.db.insert('aiGenerations', {
      ...args,
      createdAt: Date.now(),
    });

    try {
      await ctx.runMutation(api.analytics.aggregations.totalGenerations.insert, {
        value: 1, // Count 1 generation
      });

      if (args.metadata && args.metadata.projectId && args.cost) {
        await ctx.runMutation(api.analytics.aggregations.costPerProject.insert, {
          value: args.cost,
          key: args.metadata.projectId,
        });
      }
    } catch (e) {
      console.error('Failed to update aggregations', e);
    }
  },
});

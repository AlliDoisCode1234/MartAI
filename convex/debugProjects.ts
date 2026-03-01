import { internalQuery } from './_generated/server';

export const list = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query('projects').collect();
  },
});

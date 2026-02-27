import { internalQuery } from './_generated/server';

export const listGA4 = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query('ga4Connections').collect();
  },
});

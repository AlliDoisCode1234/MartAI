import { internalMutation } from './_generated/server';
import { v } from 'convex/values';

export const fixKeywordsSchema = internalMutation({
  args: {},
  handler: async (ctx) => {
    const keywords = await ctx.db.query('keywords').collect();
    let updatedCount = 0;

    for (const keyword of keywords) {
      // Check if it has the old field 'clientId' (it won't be on the type but it might be in the doc)
      // We can inspect the object directly by casting to any
      const k = keyword as any;
      if (k.clientId && !k.projectId) {
        // Delete invalid legacy record
        await ctx.db.delete(keyword._id);
        updatedCount++;
      }
    }
    return { updatedCount };
  },
});

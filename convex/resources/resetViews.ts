/**
 * Reset All Resource Views
 *
 * Internal mutation to reset all resource views to 0.
 * Used to clear seeded fake view data.
 */

import { internalMutation } from '../_generated/server';

export const resetAllViews = internalMutation({
  args: {},
  handler: async (ctx) => {
    const resources = await ctx.db.query('resources').collect();

    if (resources.length === 0) {
      console.log('[resetAllViews] No resources found');
      return { reset: 0 };
    }

    const now = Date.now();
    let reset = 0;

    for (const resource of resources) {
      if (resource.views > 0) {
        await ctx.db.patch(resource._id, {
          views: 0,
          updatedAt: now,
        });
        console.log(`[resetAllViews] Reset ${resource.slug} from ${resource.views} to 0`);
        reset++;
      }
    }

    console.log(`[resetAllViews] Reset ${reset} resources to 0 views`);
    return { reset };
  },
});

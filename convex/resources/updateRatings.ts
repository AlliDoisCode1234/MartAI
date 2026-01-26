/**
 * Update All Phoo Ratings to 100%
 *
 * Internal mutation to set all resources to 100% Phoo Rating.
 * Used for dogfooding - our showcase content should be perfect.
 */

import { internalMutation } from '../_generated/server';

export const setAll100PercentRating = internalMutation({
  args: {},
  handler: async (ctx) => {
    const resources = await ctx.db.query('resources').collect();

    if (resources.length === 0) {
      console.log('[setAll100PercentRating] No resources found');
      return { updated: 0 };
    }

    const now = Date.now();
    let updated = 0;

    for (const resource of resources) {
      if (resource.phooRating !== 100) {
        await ctx.db.patch(resource._id, {
          phooRating: 100,
          phooRatedAt: now,
          updatedAt: now,
        });
        console.log(`[setAll100PercentRating] Updated ${resource.slug} to 100%`);
        updated++;
      }
    }

    console.log(`[setAll100PercentRating] Updated ${updated} resources to 100%`);
    return { updated };
  },
});

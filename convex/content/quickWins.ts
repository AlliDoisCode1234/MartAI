import { query } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Quick Wins Query
 *
 * Returns low-hanging fruit keywords:
 * - Difficulty < 30 (easy to rank)
 * - SearchVolume > 100 (worth targeting)
 * - Sorted by opportunity score (volume / difficulty)
 */
export const getQuickWins = query({
  args: {
    projectId: v.id('projects'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Filter for quick wins: low difficulty, decent volume
    const quickWins = keywords
      .filter((k) => {
        const difficulty = k.difficulty ?? 100;
        const volume = k.searchVolume ?? 0;
        return difficulty <= 30 && volume >= 100;
      })
      .map((k) => {
        const difficulty = k.difficulty ?? 1;
        const volume = k.searchVolume ?? 0;
        // Opportunity score: higher is better
        const opportunityScore = volume / Math.max(difficulty, 1);
        return {
          ...k,
          opportunityScore,
        };
      })
      .sort((a, b) => b.opportunityScore - a.opportunityScore);

    return quickWins.slice(0, args.limit ?? 5);
  },
});

/**
 * Get Quick Win count for dashboard stats
 */
export const getQuickWinCount = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    return keywords.filter((k) => {
      const difficulty = k.difficulty ?? 100;
      const volume = k.searchVolume ?? 0;
      return difficulty <= 30 && volume >= 100;
    }).length;
  },
});

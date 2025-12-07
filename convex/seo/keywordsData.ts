import { query } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Get all keywords data for a project
 * Note: Keywords are currently tied to clients, but we can get them via project
 */
export const getKeywordsByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // Get keywords directly by project
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    return {
      projectId: args.projectId,
      keywords: keywords.sort((a, b) => {
        // Sort by priority, then volume
        const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
        const priorityDiff =
          (priorityOrder[b.priority || 'medium'] || 0) -
          (priorityOrder[a.priority || 'medium'] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        return (b.searchVolume || 0) - (a.searchVolume || 0);
      }),
      stats: {
        total: keywords.length,
        highPriority: keywords.filter((k) => k.priority === 'high').length,
        mediumPriority: keywords.filter((k) => k.priority === 'medium').length,
        lowPriority: keywords.filter((k) => k.priority === 'low').length,
        byStatus: {
          suggested: keywords.filter((k) => k.status === 'suggested').length,
          approved: keywords.filter((k) => k.status === 'approved').length,
          rejected: keywords.filter((k) => k.status === 'rejected').length,
        },
      },
    };
  },
});

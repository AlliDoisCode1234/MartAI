import { query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Strategy Queries
 *
 * Provides strategy-related data for the Insights page.
 * TODO: Implement full strategy logic with real data aggregation.
 */

/**
 * Get full strategy data for a project.
 * Returns keyword counts, content stats, and strategy metadata.
 */
export const getFullStrategy = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // Get project
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return null;
    }

    // Count keywords for this project
    const keywords = await ctx.db
      .query('keywords')
      .filter((q) => q.eq(q.field('projectId'), args.projectId))
      .collect();

    // Count content pieces
    const briefs = await ctx.db
      .query('contentPieces')
      .filter((q) => q.eq(q.field('projectId'), args.projectId))
      .collect();

    // Count topic clusters
    const clusters = await ctx.db
      .query('keywordClusters')
      .filter((q) => q.eq(q.field('projectId'), args.projectId))
      .collect();

    return {
      projectId: args.projectId,
      projectName: project.name,
      stats: {
        keywordCount: keywords.length,
        briefCount: briefs.length,
        clusterCount: clusters.length,
        publishedCount: briefs.filter((b) => b.status === 'published').length,
        draftCount: briefs.filter((b) => b.status === 'draft').length,
      },
      lastUpdated: Date.now(),
    };
  },
});

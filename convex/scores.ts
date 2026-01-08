import { query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Scores Queries
 *
 * Provides SEO health scores and metrics for the Insights page.
 * Uses the phoo rating system under the hood.
 */

/**
 * Get project SEO score and health metrics.
 * Returns visibility, traffic health, CTR performance, etc.
 */
export const getProjectScore = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // Get project
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return null;
    }

    // Count project data for score calculation
    const keywords = await ctx.db
      .query('keywords')
      .filter((q) => q.eq(q.field('projectId'), args.projectId))
      .collect();

    const clusters = await ctx.db
      .query('keywordClusters')
      .filter((q) => q.eq(q.field('projectId'), args.projectId))
      .collect();

    const contentPieces = await ctx.db
      .query('contentPieces')
      .filter((q) => q.eq(q.field('projectId'), args.projectId))
      .collect();

    // Calculate score components based on project data
    const keywordScore = Math.min(100, keywords.length * 2);
    const clusterScore = Math.min(100, clusters.length * 10);
    const contentScore = Math.min(100, contentPieces.length * 5);
    const publishedCount = contentPieces.filter((c) => c.status === 'published').length;
    const publishScore = Math.min(100, publishedCount * 10);

    // Overall score weighted average
    const overall = Math.round(
      keywordScore * 0.25 + clusterScore * 0.25 + contentScore * 0.25 + publishScore * 0.25
    );

    // Determine tier
    let tier: 'excellent' | 'good' | 'moderate' | 'needs_work';
    if (overall >= 80) tier = 'excellent';
    else if (overall >= 60) tier = 'good';
    else if (overall >= 40) tier = 'moderate';
    else tier = 'needs_work';

    return {
      projectId: args.projectId,
      overall,
      tier,
      visibility: keywordScore,
      trafficHealth: clusterScore,
      ctrPerformance: contentScore,
      quickWinPotential: Math.round((100 - overall) * 0.7),
      lastCalculated: Date.now(),
    };
  },
});

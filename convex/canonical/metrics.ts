/**
 * Canonical Metrics Query
 *
 * Component Hierarchy:
 * convex/canonical/metrics.ts (this file)
 * └── Used by: useProject, Dashboard, Keywords Library, Strategy Page
 *
 * SINGLE SOURCE OF TRUTH for all project metrics.
 * Eliminates data inconsistency by providing one canonical query
 * that all components use for counts and stats.
 *
 * @see implementation_plan.md - Section 2.1.1
 */

import { query } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Metrics breakdown by status for detailed analysis
 */
interface StatusBreakdown {
  total: number;
  byStatus: Record<string, number>;
}

/**
 * Full canonical metrics for a project
 */
export interface CanonicalMetrics {
  // Core counts
  keywordCount: number;
  clusterCount: number;
  contentCount: number;
  calendarItemCount: number;

  // Status breakdowns
  keywords: StatusBreakdown;
  clusters: StatusBreakdown;
  content: StatusBreakdown;

  // Content lifecycle
  publishedContentCount: number;
  scheduledContentCount: number;
  draftContentCount: number;

  // Meta
  lastUpdated: number;
}

/**
 * Get canonical metrics for a project
 *
 * Use this query EVERYWHERE metrics are needed for data consistency.
 * Replaces: strategyData in useProject, local counts in KeywordsLibrary
 */
export const getCanonicalMetrics = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }): Promise<CanonicalMetrics> => {
    // Fetch keywords
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();

    // Fetch clusters
    const clusters = await ctx.db
      .query('keywordClusters')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();

    // Fetch content pieces
    const contentPieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();

    // Fetch calendar items
    const calendarItems = await ctx.db
      .query('contentCalendars')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();

    // Group keywords by status
    const keywordsByStatus: Record<string, number> = {};
    for (const kw of keywords) {
      const status = kw.status || 'unknown';
      keywordsByStatus[status] = (keywordsByStatus[status] || 0) + 1;
    }

    // Group clusters by status
    const clustersByStatus: Record<string, number> = {};
    for (const cluster of clusters) {
      const status = cluster.status || 'unknown';
      clustersByStatus[status] = (clustersByStatus[status] || 0) + 1;
    }

    // Group content by status
    const contentByStatus: Record<string, number> = {};
    let publishedCount = 0;
    let scheduledCount = 0;
    let draftCount = 0;

    for (const piece of contentPieces) {
      const status = piece.status || 'unknown';
      contentByStatus[status] = (contentByStatus[status] || 0) + 1;

      // Track lifecycle counts
      if (status === 'published') publishedCount++;
      else if (status === 'scheduled') scheduledCount++;
      else if (status === 'draft') draftCount++;
    }

    return {
      keywordCount: keywords.length,
      clusterCount: clusters.length,
      contentCount: contentPieces.length,
      calendarItemCount: calendarItems.length,

      keywords: {
        total: keywords.length,
        byStatus: keywordsByStatus,
      },
      clusters: {
        total: clusters.length,
        byStatus: clustersByStatus,
      },
      content: {
        total: contentPieces.length,
        byStatus: contentByStatus,
      },

      publishedContentCount: publishedCount,
      scheduledContentCount: scheduledCount,
      draftContentCount: draftCount,

      lastUpdated: Date.now(),
    };
  },
});

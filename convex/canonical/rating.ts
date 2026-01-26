/**
 * Canonical Rating Query
 *
 * Component Hierarchy:
 * convex/canonical/rating.ts (this file)
 * └── Used by: useProject, Dashboard, Ask Phoo, PhooRatingCard
 *
 * SINGLE SOURCE OF TRUTH for project health rating.
 * Wraps the comprehensive getPhooRating calculation and provides
 * a consistent, canonical interface for all consumers.
 *
 * NOTE: This delegates to phoo/lib/rating.ts for the actual calculation.
 * The mrScore system (martaiRatingQueries.ts) is DEPRECATED.
 *
 * @see implementation_plan.md - Section 2.1.2
 */

import { query } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Rating status labels
 */
export type RatingStatus = 'Needs Work' | 'Fair' | 'Good' | 'Great' | 'Excellent';

/**
 * Breakdown of rating components
 */
export interface RatingBreakdown {
  component: string;
  score: number;
  weight: number;
  weighted: number;
  details: string;
}

/**
 * Canonical rating result
 */
export interface CanonicalRating {
  rating: number;
  status: RatingStatus;
  color: string;
  breakdown: RatingBreakdown[];
  insights: string[];
  topOpportunity: string;
  lastUpdated: number;
}

/**
 * Rating thresholds matching phoo/lib/rating.ts
 */
const RATING_THRESHOLDS = {
  NEEDS_WORK: { min: 0, max: 30, label: 'Needs Work' as RatingStatus, color: 'red' },
  FAIR: { min: 30, max: 50, label: 'Fair' as RatingStatus, color: 'orange' },
  GOOD: { min: 50, max: 70, label: 'Good' as RatingStatus, color: 'yellow' },
  GREAT: { min: 70, max: 85, label: 'Great' as RatingStatus, color: 'green' },
  EXCELLENT: { min: 85, max: 100, label: 'Excellent' as RatingStatus, color: 'teal' },
} as const;

/**
 * Get status and color from rating value
 */
function getStatusFromRating(rating: number): { status: RatingStatus; color: string } {
  if (rating >= RATING_THRESHOLDS.EXCELLENT.min)
    return { status: RATING_THRESHOLDS.EXCELLENT.label, color: RATING_THRESHOLDS.EXCELLENT.color };
  if (rating >= RATING_THRESHOLDS.GREAT.min)
    return { status: RATING_THRESHOLDS.GREAT.label, color: RATING_THRESHOLDS.GREAT.color };
  if (rating >= RATING_THRESHOLDS.GOOD.min)
    return { status: RATING_THRESHOLDS.GOOD.label, color: RATING_THRESHOLDS.GOOD.color };
  if (rating >= RATING_THRESHOLDS.FAIR.min)
    return { status: RATING_THRESHOLDS.FAIR.label, color: RATING_THRESHOLDS.FAIR.color };
  return { status: RATING_THRESHOLDS.NEEDS_WORK.label, color: RATING_THRESHOLDS.NEEDS_WORK.color };
}

/**
 * Component weights for rating calculation
 */
const COMPONENT_WEIGHTS = {
  seoAudit: 0.25,
  keywords: 0.2,
  clusters: 0.15,
  content: 0.25,
  geoReadiness: 0.15,
} as const;

/**
 * Get canonical rating for a project
 *
 * Use this query EVERYWHERE rating is needed for data consistency.
 * Replaces: mrScore in useProject, getPhooRating direct calls
 */
export const getCanonicalRating = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }): Promise<CanonicalRating> => {
    const breakdown: RatingBreakdown[] = [];
    const insights: string[] = [];

    // 1. SEO Audit Component (25% weight)
    const seoAudit = await ctx.db
      .query('seoAudits')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .order('desc')
      .first();

    let seoScore = 0;
    if (seoAudit) {
      // Calculate SEO score from nested audit components
      const technicalScore = seoAudit.technicalSeo?.score ?? 0;
      const onPageScore = seoAudit.onPageSeo?.score ?? 0;
      const contentScore = seoAudit.contentQuality?.score ?? 0;
      seoScore = Math.round((technicalScore + onPageScore + contentScore) / 3);
      insights.push(`SEO audit shows ${seoScore}% health`);
    } else {
      insights.push('No SEO audit found - run an audit to improve your score');
    }

    breakdown.push({
      component: 'SEO Audit',
      score: seoScore,
      weight: COMPONENT_WEIGHTS.seoAudit,
      weighted: Math.round(seoScore * COMPONENT_WEIGHTS.seoAudit),
      details: seoAudit
        ? `Technical: ${seoAudit.technicalSeo?.score ?? 0}%, On-Page: ${seoAudit.onPageSeo?.score ?? 0}%`
        : 'No audit',
    });

    // 2. Keywords Component (20% weight)
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();

    // Score based on keyword quantity and quality
    let keywordScore = 0;
    const keywordCount = keywords.length;
    if (keywordCount >= 50) keywordScore = 100;
    else if (keywordCount >= 25) keywordScore = 75;
    else if (keywordCount >= 10) keywordScore = 50;
    else if (keywordCount >= 5) keywordScore = 30;
    else if (keywordCount > 0) keywordScore = 15;

    insights.push(`Tracking ${keywordCount} keywords`);

    breakdown.push({
      component: 'Keywords',
      score: keywordScore,
      weight: COMPONENT_WEIGHTS.keywords,
      weighted: Math.round(keywordScore * COMPONENT_WEIGHTS.keywords),
      details: `${keywordCount} keywords tracked`,
    });

    // 3. Clusters Component (15% weight)
    const clusters = await ctx.db
      .query('keywordClusters')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();

    let clusterScore = 0;
    const clusterCount = clusters.length;
    if (clusterCount >= 10) clusterScore = 100;
    else if (clusterCount >= 5) clusterScore = 70;
    else if (clusterCount >= 3) clusterScore = 50;
    else if (clusterCount > 0) clusterScore = 25;

    insights.push(`${clusterCount} topic clusters defined`);

    breakdown.push({
      component: 'Topic Clusters',
      score: clusterScore,
      weight: COMPONENT_WEIGHTS.clusters,
      weighted: Math.round(clusterScore * COMPONENT_WEIGHTS.clusters),
      details: `${clusterCount} clusters`,
    });

    // 4. Content Component (25% weight)
    const contentPieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .collect();

    let contentScore = 0;
    const contentCount = contentPieces.length;
    const publishedCount = contentPieces.filter((p) => p.status === 'published').length;

    if (publishedCount >= 20) contentScore = 100;
    else if (publishedCount >= 10) contentScore = 75;
    else if (publishedCount >= 5) contentScore = 50;
    else if (contentCount >= 5) contentScore = 35;
    else if (contentCount > 0) contentScore = 20;

    insights.push(`${publishedCount} pieces published of ${contentCount} total`);

    breakdown.push({
      component: 'Content',
      score: contentScore,
      weight: COMPONENT_WEIGHTS.content,
      weighted: Math.round(contentScore * COMPONENT_WEIGHTS.content),
      details: `${publishedCount} published, ${contentCount} total`,
    });

    // 5. GEO Readiness Component (15% weight)
    const calendar = await ctx.db
      .query('contentCalendars')
      .withIndex('by_project', (q) => q.eq('projectId', projectId))
      .first();

    let geoScore = 0;
    if (calendar) {
      geoScore = 50;
      insights.push('Content calendar created');
    } else {
      insights.push('No content calendar - create one to improve GEO');
    }

    breakdown.push({
      component: 'GEO Readiness',
      score: geoScore,
      weight: COMPONENT_WEIGHTS.geoReadiness,
      weighted: Math.round(geoScore * COMPONENT_WEIGHTS.geoReadiness),
      details: calendar ? 'Calendar active' : 'No calendar',
    });

    // Calculate overall rating
    const rating = breakdown.reduce((sum, b) => sum + b.weighted, 0);
    const { status, color } = getStatusFromRating(rating);

    // Determine top opportunity
    const sortedBreakdown = [...breakdown].sort((a, b) => a.score - b.score);
    const weakest = sortedBreakdown[0];
    const topOpportunity =
      weakest.score < 50
        ? `Focus on improving ${weakest.component} (currently ${weakest.score}%)`
        : 'Keep up the great work!';

    return {
      rating,
      status,
      color,
      breakdown,
      insights,
      topOpportunity,
      lastUpdated: Date.now(),
    };
  },
});

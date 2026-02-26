/**
 * Canonical Rating Query — SINGLE SOURCE OF TRUTH
 *
 * Component Hierarchy:
 * convex/canonical/rating.ts (this file)
 * └── Used by: useProject, Dashboard, Ask Phoo, PhooRatingCard
 *
 * Reads cached Phoo Rating from `projectScores` table.
 * Scores are computed every 6h by the sync cron via calculatePhooRating.
 *
 * REPLACES: On-demand computation (was too expensive, hit many tables per load)
 * REPLACES: mrScore system (deprecated)
 * REPLACES: phoo/lib/rating.ts direct calls (deprecated)
 */

import { query } from '../_generated/server';
import { v } from 'convex/values';
import { requireProjectAccess } from '../lib/rbac';

export type RatingStatus = 'Needs Work' | 'Fair' | 'Good' | 'Great' | 'Excellent';

export interface RatingBreakdown {
  component: string;
  score: number;
  weight: number;
  weighted: number;
  details: string;
}

export interface CanonicalRating {
  rating: number;
  status: RatingStatus;
  color: string;
  breakdown: RatingBreakdown[];
  insights: string[];
  topOpportunity: string;
  lastUpdated: number;
}

function getStatusFromRating(rating: number): { status: RatingStatus; color: string } {
  if (rating >= 85) return { status: 'Excellent', color: 'teal' };
  if (rating >= 70) return { status: 'Great', color: 'green' };
  if (rating >= 50) return { status: 'Good', color: 'yellow' };
  if (rating >= 30) return { status: 'Fair', color: 'orange' };
  return { status: 'Needs Work', color: 'red' };
}

/**
 * Component weight configuration (mirrors martaiRating.ts)
 */
const WEIGHTS = {
  visibility: 0.25,
  trafficHealth: 0.15,
  ctrPerformance: 0.1,
  engagementQuality: 0.05,
  seoAudit: 0.15,
  keywordStrategy: 0.1,
  contentExecution: 0.1,
  geoReadiness: 0.1,
} as const;

const COMPONENT_LABELS: Record<string, string> = {
  visibility: 'Search Visibility',
  trafficHealth: 'Traffic Health',
  ctrPerformance: 'CTR Performance',
  engagementQuality: 'Engagement Quality',
  seoAudit: 'SEO Audit',
  keywordStrategy: 'Keyword Strategy',
  contentExecution: 'Content Execution',
  geoReadiness: 'GEO Readiness',
};

const COMPONENT_OPPORTUNITIES: Record<string, string> = {
  visibility: 'Improve your search rankings by targeting long-tail keywords.',
  trafficHealth: 'Boost organic traffic by publishing more optimized content.',
  ctrPerformance: 'Improve click-through rate with better meta titles and descriptions.',
  engagementQuality: 'Reduce bounce rate by improving page speed and content relevance.',
  seoAudit: 'Run an SEO audit to identify and fix technical issues.',
  keywordStrategy: 'Expand keyword research with search volume and difficulty data.',
  contentExecution: 'Create and publish more content pieces from your briefs.',
  geoReadiness: 'Add sitemap.xml, structured data, and robots.txt to your site.',
};

/**
 * Get canonical Phoo Rating for a project.
 *
 * Use this query EVERYWHERE rating is needed for data consistency.
 */
export const getCanonicalRating = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }): Promise<CanonicalRating> => {
    // Soft RBAC guard: return default rating on failure instead of crashing UI suspension
    try {
      await requireProjectAccess(ctx, projectId, 'viewer');
    } catch {
      return createDefaultRating();
    }

    // Read the latest cached score from projectScores
    const latestScore = await ctx.db
      .query('projectScores')
      .withIndex('by_project_date', (q) => q.eq('projectId', projectId))
      .order('desc')
      .first();

    // No score yet — return default
    if (!latestScore) {
      return createDefaultRating();
    }

    // Build breakdown from cached component scores
    const components = {
      visibility: latestScore.visibility ?? 0,
      trafficHealth: latestScore.trafficHealth ?? 0,
      ctrPerformance: latestScore.ctrPerformance ?? 0,
      engagementQuality: latestScore.engagementQuality ?? 0,
      seoAudit: latestScore.seoAudit ?? 0,
      keywordStrategy: latestScore.keywordStrategy ?? 0,
      contentExecution: latestScore.contentExecution ?? 0,
      geoReadiness: latestScore.geoReadiness ?? 0,
    };

    const breakdown: RatingBreakdown[] = Object.entries(components).map(([key, score]) => ({
      component: COMPONENT_LABELS[key] || key,
      score,
      weight: WEIGHTS[key as keyof typeof WEIGHTS] ?? 0,
      weighted: Math.round(score * (WEIGHTS[key as keyof typeof WEIGHTS] ?? 0)),
      details: `${score}/100`,
    }));

    const { status, color } = getStatusFromRating(latestScore.overall);

    // Build insights from low-scoring components
    const insights: string[] = [];
    const sortedByImpact = Object.entries(components)
      .map(([key, score]) => ({
        key,
        score,
        weight: WEIGHTS[key as keyof typeof WEIGHTS] ?? 0,
        impact: (WEIGHTS[key as keyof typeof WEIGHTS] ?? 0) * (100 - score),
      }))
      .sort((a, b) => b.impact - a.impact);

    for (const comp of sortedByImpact.slice(0, 3)) {
      if (comp.score < 50) {
        insights.push(`${COMPONENT_LABELS[comp.key]} is at ${comp.score}% — room to improve`);
      }
    }

    if (insights.length === 0) {
      insights.push('Your SEO strategy is looking strong across all dimensions.');
    }

    // Top opportunity from weakest high-weight component
    const topComp = sortedByImpact[0];
    const topOpportunity =
      topComp && topComp.score < 70
        ? COMPONENT_OPPORTUNITIES[topComp.key] || 'Keep up the great work!'
        : 'Keep up the great work!';

    return {
      rating: latestScore.overall,
      status,
      color,
      breakdown,
      insights,
      topOpportunity,
      lastUpdated: latestScore.date,
    };
  },
});

function createDefaultRating(): CanonicalRating {
  const components = [
    'visibility',
    'trafficHealth',
    'ctrPerformance',
    'engagementQuality',
    'seoAudit',
    'keywordStrategy',
    'contentExecution',
    'geoReadiness',
  ];

  return {
    rating: 0,
    status: 'Needs Work',
    color: 'red',
    breakdown: components.map((key) => ({
      component: COMPONENT_LABELS[key] || key,
      score: 0,
      weight: WEIGHTS[key as keyof typeof WEIGHTS] ?? 0,
      weighted: 0,
      details: 'No data yet',
    })),
    insights: ['Connect GA4 and Google Search Console to start tracking your SEO health.'],
    topOpportunity: 'Start by running an SEO audit on your website.',
    lastUpdated: 0,
  };
}

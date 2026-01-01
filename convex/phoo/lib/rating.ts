/**
 * Phoo Rating System
 *
 * Component Hierarchy:
 * convex/phoo/lib/rating.ts (this file)
 *
 * Calculates the Phoo Rating (0-100) based on ACTUAL ANALYTICS DATA:
 * - SEO Audit scores (technical, on-page, content, backlinks)
 * - Keyword metrics (search volume, difficulty)
 * - Cluster quality (impact scores)
 * - Content calendar completion
 *
 * This is NOT a gamification metric - it's a real SEO health score.
 */

import { query } from '../../_generated/server';
import { v } from 'convex/values';

/**
 * Rating component weights
 */
export const RATING_WEIGHTS = {
  SEO_AUDIT: 0.35, // 35% - Technical SEO health
  KEYWORDS: 0.25, // 25% - Keyword strategy quality
  CLUSTERS: 0.25, // 25% - Content organization
  CONTENT: 0.15, // 15% - Content execution
} as const;

/**
 * Rating status thresholds
 */
export const RATING_STATUS = {
  POOR: { min: 0, max: 30, label: 'Needs Work', color: 'red' },
  FAIR: { min: 30, max: 50, label: 'Fair', color: 'orange' },
  GOOD: { min: 50, max: 70, label: 'Good', color: 'yellow' },
  GREAT: { min: 70, max: 85, label: 'Great', color: 'green' },
  EXCELLENT: { min: 85, max: 100, label: 'Excellent', color: 'teal' },
} as const;

export type RatingStatus = 'Needs Work' | 'Fair' | 'Good' | 'Great' | 'Excellent';

export interface PhooRatingBreakdown {
  component: string;
  score: number;
  weight: number;
  weighted: number;
  details: string;
}

export interface PhooRatingResult {
  rating: number;
  status: RatingStatus;
  color: string;
  breakdown: PhooRatingBreakdown[];
  insights: string[];
  topOpportunity: string;
}

/**
 * Get Phoo Rating for a project based on actual analytics
 */
export const getPhooRating = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args): Promise<PhooRatingResult> => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return createDefaultRating('Project not found');
    }

    const breakdown: PhooRatingBreakdown[] = [];
    const insights: string[] = [];

    // 1. SEO Audit Score (35%)
    const seoAudit = await ctx.db
      .query('seoAudits')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .first();

    let seoScore = 0;
    if (seoAudit) {
      seoScore = seoAudit.overallScore;
      breakdown.push({
        component: 'SEO Health',
        score: seoScore,
        weight: RATING_WEIGHTS.SEO_AUDIT,
        weighted: seoScore * RATING_WEIGHTS.SEO_AUDIT,
        details: `Technical: ${seoAudit.technicalSeo.score}, On-Page: ${seoAudit.onPageSeo.score}, Content: ${seoAudit.contentQuality.score}`,
      });

      // Add insights from low-scoring areas
      if (seoAudit.technicalSeo.score < 50) {
        insights.push(`Technical SEO needs attention (${seoAudit.technicalSeo.score}/100)`);
      }
      if (seoAudit.contentQuality.score < 50) {
        insights.push(`Content quality could improve (${seoAudit.contentQuality.score}/100)`);
      }
    } else {
      breakdown.push({
        component: 'SEO Health',
        score: 0,
        weight: RATING_WEIGHTS.SEO_AUDIT,
        weighted: 0,
        details: 'No SEO audit available',
      });
      insights.push('Run an SEO audit to get insights on your site health');
    }

    // 2. Keyword Strategy Score (25%)
    const keywords = await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    let keywordScore = 0;
    if (keywords.length > 0) {
      // Calculate based on keyword quality, not just count
      const withVolume = keywords.filter((k) => k.searchVolume && k.searchVolume > 0).length;
      const withDifficulty = keywords.filter((k) => k.difficulty !== undefined).length;
      const highPriority = keywords.filter((k) => k.priority === 'high').length;
      const approved = keywords.filter(
        (k) => k.status === 'approved' || k.status === 'implemented'
      ).length;

      // Score components:
      // - Coverage: Having keywords at all (30 points max)
      // - Data quality: Having volume/difficulty data (30 points max)
      // - Curation: Having prioritized and approved keywords (40 points max)
      const coverageScore = Math.min(keywords.length / 20, 1) * 30;
      const dataQualityScore = ((withVolume + withDifficulty) / (keywords.length * 2)) * 30;
      const curationScore = ((highPriority + approved) / (keywords.length * 2)) * 40;

      keywordScore = Math.round(coverageScore + dataQualityScore + curationScore);

      breakdown.push({
        component: 'Keyword Strategy',
        score: keywordScore,
        weight: RATING_WEIGHTS.KEYWORDS,
        weighted: keywordScore * RATING_WEIGHTS.KEYWORDS,
        details: `${keywords.length} keywords, ${withVolume} with volume data, ${highPriority} high priority`,
      });

      if (withVolume < keywords.length * 0.5) {
        insights.push(`${keywords.length - withVolume} keywords missing search volume data`);
      }
    } else {
      breakdown.push({
        component: 'Keyword Strategy',
        score: 0,
        weight: RATING_WEIGHTS.KEYWORDS,
        weighted: 0,
        details: 'No keywords discovered yet',
      });
      insights.push('Generate keywords to start building your SEO strategy');
    }

    // 3. Cluster Quality Score (25%)
    const clusters = await ctx.db
      .query('keywordClusters')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    let clusterScore = 0;
    if (clusters.length > 0) {
      // Calculate based on cluster quality
      const avgImpact = clusters.reduce((sum, c) => sum + c.impactScore, 0) / clusters.length;
      const activeClusters = clusters.filter(
        (c) => c.status === 'active' || c.status === 'favorite'
      ).length;
      const avgDifficulty = clusters.reduce((sum, c) => sum + c.difficulty, 0) / clusters.length;

      // Score based on:
      // - Number of clusters (30 points, diminishing returns after 5)
      // - Average impact score (40 points)
      // - Curated clusters (30 points)
      const countScore = Math.min(clusters.length / 5, 1) * 30;
      const impactScoreVal = avgImpact * 40; // impactScore is 0-1
      const curationScoreVal = (activeClusters / clusters.length) * 30;

      clusterScore = Math.round(countScore + impactScoreVal + curationScoreVal);

      breakdown.push({
        component: 'Content Clusters',
        score: clusterScore,
        weight: RATING_WEIGHTS.CLUSTERS,
        weighted: clusterScore * RATING_WEIGHTS.CLUSTERS,
        details: `${clusters.length} clusters, avg impact ${(avgImpact * 100).toFixed(0)}%, avg difficulty ${avgDifficulty.toFixed(0)}`,
      });

      if (avgDifficulty > 70) {
        insights.push(
          'Your clusters target high-difficulty keywords. Consider adding easier wins.'
        );
      }
    } else {
      breakdown.push({
        component: 'Content Clusters',
        score: 0,
        weight: RATING_WEIGHTS.CLUSTERS,
        weighted: 0,
        details: 'No topic clusters created',
      });
      insights.push('Create topic clusters to organize your content strategy');
    }

    // 4. Content Execution Score (15%)
    const calendar = await ctx.db
      .query('contentCalendars')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .first();

    const contentPieces = await ctx.db
      .query('contentPieces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    let contentScore = 0;
    if (calendar || contentPieces.length > 0) {
      const calendarPoints = calendar ? 40 : 0;
      const contentPoints = Math.min(contentPieces.length / 5, 1) * 60; // Up to 5 pieces for full points
      contentScore = Math.round(calendarPoints + contentPoints);

      breakdown.push({
        component: 'Content Execution',
        score: contentScore,
        weight: RATING_WEIGHTS.CONTENT,
        weighted: contentScore * RATING_WEIGHTS.CONTENT,
        details: `${contentPieces.length} content pieces${calendar ? ', active calendar' : ''}`,
      });
    } else {
      breakdown.push({
        component: 'Content Execution',
        score: 0,
        weight: RATING_WEIGHTS.CONTENT,
        weighted: 0,
        details: 'No content calendar or content pieces',
      });
      insights.push('Create a content calendar to drive consistent publishing');
    }

    // Calculate overall rating
    const rating = Math.round(breakdown.reduce((sum, b) => sum + b.weighted, 0));

    // Determine status
    const { status, color } = getStatusFromRating(rating);

    // Determine top opportunity
    const topOpportunity = determineTopOpportunity(breakdown, insights);

    return {
      rating,
      status,
      color,
      breakdown,
      insights: insights.slice(0, 3), // Top 3 insights
      topOpportunity,
    };
  },
});

/**
 * Get status and color from rating
 */
function getStatusFromRating(rating: number): { status: RatingStatus; color: string } {
  if (rating >= 85) return { status: 'Excellent', color: 'teal' };
  if (rating >= 70) return { status: 'Great', color: 'green' };
  if (rating >= 50) return { status: 'Good', color: 'yellow' };
  if (rating >= 30) return { status: 'Fair', color: 'orange' };
  return { status: 'Needs Work', color: 'red' };
}

/**
 * Determine the top opportunity for improvement
 */
function determineTopOpportunity(breakdown: PhooRatingBreakdown[], insights: string[]): string {
  // Find lowest-scoring high-weight component
  const sorted = [...breakdown].sort((a, b) => {
    // Prioritize by potential impact (weight * room for improvement)
    const aImpact = a.weight * (100 - a.score);
    const bImpact = b.weight * (100 - b.score);
    return bImpact - aImpact;
  });

  const topComponent = sorted[0];
  if (!topComponent) {
    return 'Your SEO strategy is looking great! Keep creating quality content.';
  }

  switch (topComponent.component) {
    case 'SEO Health':
      return 'Run an SEO audit to identify technical issues and content gaps.';
    case 'Keyword Strategy':
      return 'Expand your keyword research with more search volume data.';
    case 'Content Clusters':
      return 'Create topic clusters to organize your content strategy.';
    case 'Content Execution':
      return 'Generate content briefs and build your publishing calendar.';
    default:
      return insights[0] || 'Continue building out your SEO foundation.';
  }
}

/**
 * Create a default rating for missing data
 */
function createDefaultRating(reason: string): PhooRatingResult {
  return {
    rating: 0,
    status: 'Needs Work',
    color: 'red',
    breakdown: [
      { component: 'SEO Health', score: 0, weight: 0.35, weighted: 0, details: 'No data' },
      { component: 'Keyword Strategy', score: 0, weight: 0.25, weighted: 0, details: 'No data' },
      { component: 'Content Clusters', score: 0, weight: 0.25, weighted: 0, details: 'No data' },
      { component: 'Content Execution', score: 0, weight: 0.15, weighted: 0, details: 'No data' },
    ],
    insights: [reason],
    topOpportunity: 'Start by running an SEO audit on your website.',
  };
}

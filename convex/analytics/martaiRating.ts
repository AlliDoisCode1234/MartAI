'use node';
/**
 * MartAI Rating (MR) Calculator - Action
 *
 * A research-backed composite SEO health score (0-100) inspired by:
 * - Moz Domain Authority
 * - Ahrefs Domain Rating
 * - SEMrush Authority Score
 *
 * Formula weights based on industry research.
 *
 * STRICT SCORING: No data = 0, max scores capped at 95
 */

import { internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';

// Component weights (must sum to 100)
const WEIGHTS = {
  visibility: 30, // Average position - core ranking signal
  trafficHealth: 25, // Session trends - SEMrush includes organic traffic
  ctrPerformance: 15, // Click-through rate - UX signal
  engagementQuality: 10, // Bounce rate - Core Web Vitals tie-breaker
  quickWinPotential: 10, // MartAI unique - actionable opportunities
  contentVelocity: 10, // Content freshness signal
};

// Tier thresholds (strict - hard to get top tier)
const TIERS = [
  { min: 97, tier: 'top_performer', label: '🏆 Top Performer' },
  { min: 95, tier: 'super', label: '⭐ Super' },
  { min: 90, tier: 'excellent', label: '🌟 Excellent' },
  { min: 80, tier: 'really_good', label: '✅ Really Good' },
  { min: 60, tier: 'good', label: '🔵 Good' },
  { min: 40, tier: 'fair', label: '🟡 Fair' },
  { min: 0, tier: 'needs_work', label: '🔴 Needs Work' },
];

function getTier(score: number): { tier: string; label: string } {
  for (const t of TIERS) {
    if (score >= t.min) {
      return { tier: t.tier, label: t.label };
    }
  }
  return { tier: 'needs_work', label: '🔴 Needs Work' };
}

// STRICT scoring functions - no data = 0, not 50

function scoreVisibility(avgPosition: number | null): number {
  if (avgPosition === null || avgPosition === 0) return 0;
  if (avgPosition < 3) return 95;
  if (avgPosition < 5) return 85;
  if (avgPosition < 10) return 70;
  if (avgPosition < 15) return 55;
  if (avgPosition < 20) return 40;
  if (avgPosition < 30) return 25;
  if (avgPosition < 50) return 15;
  return 5;
}

function scoreTrafficHealth(changePercent: number | null): number {
  if (changePercent === null) return 0;
  if (changePercent >= 30) return 95;
  if (changePercent >= 20) return 85;
  if (changePercent >= 10) return 75;
  if (changePercent >= 5) return 65;
  if (changePercent >= 0) return 55;
  if (changePercent >= -5) return 40;
  if (changePercent >= -10) return 25;
  if (changePercent >= -20) return 15;
  return 5;
}

function scoreCTR(ctr: number | null): number {
  if (ctr === null) return 0;
  if (ctr >= 15) return 95;
  if (ctr >= 10) return 85;
  if (ctr >= 7) return 75;
  if (ctr >= 5) return 65;
  if (ctr >= 3) return 50;
  if (ctr >= 2) return 35;
  if (ctr >= 1) return 25;
  return 10;
}

function scoreEngagement(bounceRate: number | null): number {
  if (bounceRate === null) return 0;
  if (bounceRate < 25) return 95;
  if (bounceRate < 35) return 80;
  if (bounceRate < 45) return 65;
  if (bounceRate < 55) return 50;
  if (bounceRate < 65) return 35;
  if (bounceRate < 75) return 20;
  return 10;
}

function scoreQuickWins(count: number): number {
  // Realistic: having quick wins is good, but absence isn't punishing
  if (count >= 25) return 90;
  if (count >= 15) return 80;
  if (count >= 10) return 70;
  if (count >= 5) return 60;
  if (count >= 3) return 50;
  if (count >= 1) return 40;
  return 30;
}

function scoreVelocity(actual: number, target: number): number {
  if (target === 0) return 0;
  const ratio = actual / target;
  if (ratio >= 1.2) return 90;
  if (ratio >= 1.0) return 80;
  if (ratio >= 0.8) return 65;
  if (ratio >= 0.6) return 50;
  if (ratio >= 0.4) return 35;
  if (ratio >= 0.2) return 20;
  return 10;
}

/**
 * Calculate MartAI Rating for a project
 */
export const calculateMartAIRating = internalAction({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    // 1. Get GSC data for visibility and CTR
    let avgPosition: number | null = null;
    let ctr: number | null = null;
    let gscImpressions = 0;
    let gscClicks = 0;

    try {
      const gscData = await ctx.runQuery(api.analytics.analytics.getAnalyticsData, {
        projectId: args.projectId,
        startDate: thirtyDaysAgo,
        endDate: now,
        source: 'gsc',
      });

      if (gscData && gscData.length > 0) {
        const latestGSC = gscData[gscData.length - 1];
        avgPosition = latestGSC.avgPosition || null;
        ctr = latestGSC.ctr || null;
        gscImpressions = latestGSC.impressions || 0;
        gscClicks = latestGSC.clicks || 0;
      }
    } catch (e) {
      console.error('[MR] Failed to get GSC data:', e);
    }

    // 2. Get GA4 data for traffic health and engagement
    let sessionsChange: number | null = null;
    let bounceRate: number | null = null;
    // KPI snapshot fields for IL
    let kpiSessions = 0;
    let kpiPageViews = 0;
    let kpiAvgSessionDuration = 0;
    let kpiNewUsers = 0;
    let kpiEngagedSessions = 0;
    let kpiEventCount = 0;
    let kpiConversions = 0;

    try {
      const ga4Data = await ctx.runQuery(api.analytics.analytics.getAnalyticsData, {
        projectId: args.projectId,
        startDate: thirtyDaysAgo,
        endDate: now,
        source: 'ga4',
      });

      if (ga4Data && ga4Data.length >= 2) {
        const recentData = ga4Data.filter((d: any) => d.date >= sevenDaysAgo);
        const previousData = ga4Data.filter(
          (d: any) => d.date < sevenDaysAgo && d.date >= sevenDaysAgo - 7 * 24 * 60 * 60 * 1000
        );

        const recentSessions = recentData.reduce(
          (acc: number, d: any) => acc + (d.sessions || 0),
          0
        );
        const previousSessions = previousData.reduce(
          (acc: number, d: any) => acc + (d.sessions || 0),
          0
        );

        if (previousSessions > 0) {
          sessionsChange = ((recentSessions - previousSessions) / previousSessions) * 100;
        }

        const latestGA4 = ga4Data[ga4Data.length - 1];
        bounceRate = latestGA4.bounceRate || null;

        // Capture KPI snapshot from latest GA4 data
        kpiSessions = latestGA4.sessions || 0;
        kpiPageViews = latestGA4.pageViews || 0;
        kpiAvgSessionDuration = latestGA4.avgSessionDuration || 0;
        kpiNewUsers = latestGA4.newUsers || 0;
        kpiEngagedSessions = latestGA4.engagedSessions || 0;
        kpiEventCount = latestGA4.eventCount || 0;
        kpiConversions = latestGA4.conversions || 0;
      }
    } catch (e) {
      console.error('[MR] Failed to get GA4 data:', e);
    }

    // 3. Get Quick Win count
    let quickWinCount = 0;
    try {
      const quickWins = await ctx.runQuery(internal.analytics.gscKeywords.getQuickWinKeywords, {
        projectId: args.projectId,
        minImpressions: 300,
      });
      quickWinCount = quickWins?.length || 0;
    } catch (e) {
      console.error('[MR] Failed to get Quick Wins:', e);
    }

    // 4. Get content velocity
    let briefsThisMonth = 0;
    const contentTarget = 4;
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const briefCount = await ctx.runQuery(
        internal.analytics.martaiRatingQueries.countBriefsThisMonth,
        {
          projectId: args.projectId,
          since: startOfMonth.getTime(),
        }
      );
      briefsThisMonth = briefCount || 0;
    } catch (e) {
      console.error('[MR] Failed to get briefs:', e);
    }

    // 4b. Get keyword count from enriched keywords table
    let keywordCount = 0;
    try {
      keywordCount = await ctx.runQuery(internal.analytics.keywordEnrichment.countKeywords, {
        projectId: args.projectId,
      });
    } catch (e) {
      console.error('[MR] Failed to get keyword count:', e);
    }

    // 5. Calculate component scores
    const visibility = scoreVisibility(avgPosition);
    const trafficHealth = scoreTrafficHealth(sessionsChange);
    const ctrPerformance = scoreCTR(ctr);
    const engagementQuality = scoreEngagement(bounceRate);
    const quickWinPotential = scoreQuickWins(quickWinCount);
    const contentVelocity = scoreVelocity(briefsThisMonth, contentTarget);

    // 6. Calculate weighted overall score
    const overall = Math.round(
      (visibility * WEIGHTS.visibility +
        trafficHealth * WEIGHTS.trafficHealth +
        ctrPerformance * WEIGHTS.ctrPerformance +
        engagementQuality * WEIGHTS.engagementQuality +
        quickWinPotential * WEIGHTS.quickWinPotential +
        contentVelocity * WEIGHTS.contentVelocity) /
        100
    );

    // 7. Determine tier
    const { tier, label } = getTier(overall);

    // 8. Store the score with full KPI snapshot
    await ctx.runMutation(internal.analytics.martaiRatingQueries.storeScore, {
      projectId: args.projectId,
      date: now,
      overall,
      tier,
      visibility,
      trafficHealth,
      ctrPerformance,
      engagementQuality,
      quickWinPotential,
      contentVelocity,
      rawMetrics: {
        // MR scoring inputs
        avgPosition: avgPosition ?? undefined,
        sessionsChange: sessionsChange ?? undefined,
        ctr: ctr ?? undefined,
        bounceRate: bounceRate ?? undefined,
        quickWinCount,
        briefsThisMonth,
        // Dashboard KPI snapshot
        sessions: kpiSessions,
        pageViews: kpiPageViews,
        avgSessionDuration: kpiAvgSessionDuration,
        impressions: gscImpressions,
        clicks: gscClicks,
        newUsers: kpiNewUsers,
        engagedSessions: kpiEngagedSessions,
        eventCount: kpiEventCount,
        conversions: kpiConversions,
        keywordCount,
      },
    });

    console.log(`[MR] Project ${args.projectId}: Score ${overall} (${label})`);

    return {
      overall,
      tier,
      label,
      components: {
        visibility,
        trafficHealth,
        ctrPerformance,
        engagementQuality,
        quickWinPotential,
        contentVelocity,
      },
    };
  },
});

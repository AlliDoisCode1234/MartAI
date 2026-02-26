'use node';
/**
 * Phoo Rating — Unified SEO Health Score (0-100)
 *
 * Component Hierarchy:
 * convex/analytics/martaiRating.ts (this file)
 * └── Called by: sync.ts (every 6h via cron)
 * └── Stored in: projectScores table
 * └── Read by: canonical/rating.ts (SSOT for all consumers)
 *
 * 8 weighted components blending external signals (GA4/GSC IL)
 * with internal platform signals.
 *
 * INSPIRED BY:
 * - SEMrush Authority Score (link power + traffic + spam)
 * - Moz Domain Authority (backlink profile quality)
 * - Ahrefs Domain Rating (referring domain strength)
 *
 * OUR DIFFERENTIATION:
 * - External 55%: Real GA4/GSC data from Integration Layer
 * - Platform 45%: How well the user is EXECUTING their SEO strategy
 *
 * STRICT SCORING: No data = 0, max component scores capped at 95
 */

import { internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';

/** Shape of rows returned by getAnalyticsData */
interface AnalyticsRow {
  date: number;
  sessions?: number;
  pageViews?: number;
  bounceRate?: number;
  avgSessionDuration?: number;
  newUsers?: number;
  engagedSessions?: number;
  eventCount?: number;
  conversions?: number;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  avgPosition?: number;
}

// ─── Weight Configuration ────────────────────────────────────────────────────
// Must sum to 100

const WEIGHTS = {
  // External signals (55%)
  visibility: 25, // GSC avg position + quick wins
  trafficHealth: 15, // GA4 session trends
  ctrPerformance: 10, // GSC CTR
  engagementQuality: 5, // GA4 bounce rate
  // Platform signals (45%)
  seoAudit: 15, // seoAudits table
  keywordStrategy: 10, // keywords table
  contentExecution: 10, // contentPieces + clusters + calendar
  geoReadiness: 10, // live site checks
};

// ─── Tier Thresholds ─────────────────────────────────────────────────────────

const TIERS = [
  { min: 85, tier: 'excellent', label: 'Excellent' },
  { min: 70, tier: 'great', label: 'Great' },
  { min: 50, tier: 'good', label: 'Good' },
  { min: 30, tier: 'fair', label: 'Fair' },
  { min: 0, tier: 'needs_work', label: 'Needs Work' },
] as const;

function getTier(score: number): { tier: string; label: string } {
  for (const t of TIERS) {
    if (score >= t.min) return { tier: t.tier, label: t.label };
  }
  return { tier: 'needs_work', label: 'Needs Work' };
}

// ─── Scoring Functions ───────────────────────────────────────────────────────
// STRICT: no data = 0, not 50

function scoreVisibility(avgPosition: number | null, quickWinCount: number): number {
  if (avgPosition === null || avgPosition === 0) {
    // Even without position data, quick wins shows GSC is connected
    return quickWinCount > 0 ? Math.min(quickWinCount * 5, 30) : 0;
  }
  let positionScore: number;
  if (avgPosition < 3) positionScore = 95;
  else if (avgPosition < 5) positionScore = 85;
  else if (avgPosition < 10) positionScore = 70;
  else if (avgPosition < 15) positionScore = 55;
  else if (avgPosition < 20) positionScore = 40;
  else if (avgPosition < 30) positionScore = 25;
  else if (avgPosition < 50) positionScore = 15;
  else positionScore = 5;

  // Quick win bonus: up to +10 points for having actionable opportunities
  const quickWinBonus = Math.min(quickWinCount * 2, 10);
  return Math.min(positionScore + quickWinBonus, 95);
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

function scoreSEOAudit(overallScore: number | null): number {
  if (overallScore === null) return 0;
  return Math.min(overallScore, 95);
}

function scoreKeywordStrategy(
  count: number,
  withVolume: number,
  highPriority: number,
  approved: number
): number {
  if (count === 0) return 0;
  // Coverage (30pts max): diminishing returns after 20
  const coverage = Math.min(count / 20, 1) * 30;
  // Data quality (30pts max): keywords with volume/difficulty
  const dataQuality = (withVolume / count) * 30;
  // Curation (40pts max): prioritized + approved
  const curation = ((highPriority + approved) / (count * 2)) * 40;
  return Math.min(Math.round(coverage + dataQuality + curation), 95);
}

function scoreContentExecution(
  contentCount: number,
  publishedCount: number,
  clusterCount: number,
  hasCalendar: boolean
): number {
  if (contentCount === 0 && clusterCount === 0 && !hasCalendar) return 0;
  // Content pieces (30pts max)
  const contentScore = Math.min(publishedCount / 10, 1) * 30;
  // Clusters (25pts max)
  const clusterScore = Math.min(clusterCount / 5, 1) * 25;
  // Calendar existence (20pts)
  const calendarScore = hasCalendar ? 20 : 0;
  // Total content count bonus (20pts max)
  const volumeScore = Math.min(contentCount / 15, 1) * 20;
  return Math.min(Math.round(contentScore + clusterScore + calendarScore + volumeScore), 95);
}

function scoreGEOReadiness(checks: {
  hasSitemap: boolean;
  hasRobotsTxt: boolean;
  hasJsonLd: boolean;
  hasLlmsTxt: boolean;
  schemaTypes: string[];
}): number {
  let score = 0;
  if (checks.hasSitemap) score += 20;
  if (checks.hasRobotsTxt) score += 20;
  if (checks.hasJsonLd) score += 25;
  if (checks.hasLlmsTxt) score += 10;
  // Schema type bonus: 5pts per type, up to 25pts
  const schemaBonus = Math.min(checks.schemaTypes.length * 5, 25);
  score += schemaBonus;
  return Math.min(score, 95);
}

// ─── GEO Live Site Checks ────────────────────────────────────────────────────

/**
 * SSRF protection: ensures the URL is purely public web HTTP(S) and not
 * attempting to access internal Convex infrastructure.
 */
function isSafeUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

    // SSRF protection against common internal/private IPs
    const forbidden = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '169.254.169.254',
      '10.',
      '192.168.',
      '172.16.',
      '172.17.',
      '172.18.',
      '172.19.',
      '172.2',
      '172.30.',
      '172.31.',
    ];
    if (forbidden.some((f) => url.hostname === f || url.hostname.startsWith(f))) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function checkGEOReadiness(websiteUrl: string): Promise<{
  hasSitemap: boolean;
  hasRobotsTxt: boolean;
  hasJsonLd: boolean;
  hasLlmsTxt: boolean;
  schemaTypes: string[];
}> {
  const baseUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;

  const result = {
    hasSitemap: false,
    hasRobotsTxt: false,
    hasJsonLd: false,
    hasLlmsTxt: false,
    schemaTypes: [] as string[],
  };

  // SSRF guard
  if (!isSafeUrl(baseUrl)) {
    console.warn(`[PhooRating] Skipping GEO checks for unsafe URL: ${baseUrl}`);
    return result;
  }

  const origin = new URL(baseUrl).origin;

  const fetchWithTimeout = (url: string, timeoutMs = 8000) =>
    fetch(url, {
      headers: { 'User-Agent': 'PhooBot/1.0 (SEO Health Check)' },
      signal: AbortSignal.timeout(timeoutMs),
    }).catch(() => null);

  // Run all checks concurrently
  const [sitemapRes, robotsRes, llmsRes, homepageRes] = await Promise.all([
    fetchWithTimeout(`${origin}/sitemap.xml`),
    fetchWithTimeout(`${origin}/robots.txt`),
    fetchWithTimeout(`${origin}/llms.txt`),
    fetchWithTimeout(baseUrl),
  ]);

  // Check sitemap
  if (sitemapRes && sitemapRes.ok) {
    const contentType = sitemapRes.headers.get('content-type') || '';
    result.hasSitemap = contentType.includes('xml') || contentType.includes('text');
  }

  // Check robots.txt
  if (robotsRes && robotsRes.ok) {
    const text = await robotsRes.text().catch(() => '');
    result.hasRobotsTxt = text.length > 10; // Must have meaningful content
  }

  // Check llms.txt
  if (llmsRes && llmsRes.ok) {
    const text = await llmsRes.text().catch(() => '');
    result.hasLlmsTxt = text.length > 10;
  }

  // Check homepage for JSON-LD structured data
  if (homepageRes && homepageRes.ok) {
    const html = await homepageRes.text().catch(() => '');

    // Find JSON-LD blocks
    const jsonLdMatches = html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    );

    for (const match of jsonLdMatches) {
      result.hasJsonLd = true;
      try {
        const data = JSON.parse(match[1]);
        // Extract @type from JSON-LD (can be string or array)
        const types = Array.isArray(data)
          ? data.map((d: { '@type'?: string }) => d['@type']).filter(Boolean)
          : data['@type']
            ? [data['@type']]
            : [];
        result.schemaTypes.push(...types);
      } catch {
        // Malformed JSON-LD — still counts as having it
      }
    }
    // Deduplicate schema types
    result.schemaTypes = [...new Set(result.schemaTypes)];
  }

  return result;
}

// ─── Main Calculator ─────────────────────────────────────────────────────────

interface PhooRatingReturn {
  overall: number;
  tier: string;
  label: string;
  components: Record<string, number>;
}

/** Extract safe error message without stack traces */
function safeErrorMsg(e: unknown): string {
  return e instanceof Error ? e.message : 'Unknown error';
}

export const calculatePhooRating = internalAction({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args): Promise<PhooRatingReturn> => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    // ── 1. Get project for website URL ──
    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
      projectId: args.projectId,
    });

    // ══════════════════════════════════════════════════════════════════════════
    // EXTERNAL SIGNALS (55%)
    // ══════════════════════════════════════════════════════════════════════════

    // ── 1a. GSC data for visibility and CTR ──
    let avgPosition: number | null = null;
    let ctr: number | null = null;
    let gscImpressions = 0;
    let gscClicks = 0;

    try {
      const gscData = (await ctx.runQuery(api.analytics.analytics.getAnalyticsData, {
        projectId: args.projectId,
        startDate: thirtyDaysAgo,
        endDate: now,
        source: 'gsc',
      })) as AnalyticsRow[];
      if (gscData && gscData.length > 0) {
        const latestGSC = gscData[gscData.length - 1];
        avgPosition = latestGSC.avgPosition || null;
        ctr = latestGSC.ctr || null;
        gscImpressions = latestGSC.impressions || 0;
        gscClicks = latestGSC.clicks || 0;
      }
    } catch (e) {
      console.error('[PhooRating] GSC data fetch failed:', safeErrorMsg(e));
    }

    // ── 1b. GA4 data for traffic health and engagement ──
    let sessionsChange: number | null = null;
    let bounceRate: number | null = null;
    let kpiSessions = 0;
    let kpiPageViews = 0;
    let kpiAvgSessionDuration = 0;
    let kpiNewUsers = 0;
    let kpiEngagedSessions = 0;
    let kpiEventCount = 0;
    let kpiConversions = 0;

    try {
      const ga4Data = (await ctx.runQuery(api.analytics.analytics.getAnalyticsData, {
        projectId: args.projectId,
        startDate: thirtyDaysAgo,
        endDate: now,
        source: 'ga4',
      })) as AnalyticsRow[];
      if (ga4Data && ga4Data.length >= 2) {
        const recentData = ga4Data.filter((d) => d.date >= sevenDaysAgo);
        const previousData = ga4Data.filter(
          (d) => d.date < sevenDaysAgo && d.date >= sevenDaysAgo - 7 * 24 * 60 * 60 * 1000
        );
        const recentSessions = recentData.reduce((acc: number, d) => acc + (d.sessions || 0), 0);
        const previousSessions = previousData.reduce(
          (acc: number, d) => acc + (d.sessions || 0),
          0
        );
        if (previousSessions > 0) {
          sessionsChange = ((recentSessions - previousSessions) / previousSessions) * 100;
        }
        const latestGA4 = ga4Data[ga4Data.length - 1];
        bounceRate = latestGA4.bounceRate || null;
        kpiSessions = latestGA4.sessions || 0;
        kpiPageViews = latestGA4.pageViews || 0;
        kpiAvgSessionDuration = latestGA4.avgSessionDuration || 0;
        kpiNewUsers = latestGA4.newUsers || 0;
        kpiEngagedSessions = latestGA4.engagedSessions || 0;
        kpiEventCount = latestGA4.eventCount || 0;
        kpiConversions = latestGA4.conversions || 0;
      }
    } catch (e) {
      console.error('[PhooRating] GA4 data fetch failed:', safeErrorMsg(e));
    }

    // ── 1c. Quick Win count ──
    let quickWinCount = 0;
    try {
      const quickWins = await ctx.runQuery(internal.analytics.gscKeywords.getQuickWinKeywords, {
        projectId: args.projectId,
        minImpressions: 300,
      });
      quickWinCount = quickWins?.length || 0;
    } catch (e) {
      console.error('[PhooRating] Quick wins fetch failed:', safeErrorMsg(e));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // PLATFORM SIGNALS (45%)
    // ══════════════════════════════════════════════════════════════════════════

    // ── 2a. SEO Audit ──
    let seoAuditRawScore: number | null = null;
    try {
      const seoAudit = await ctx.runQuery(
        internal.analytics.martaiRatingQueries.getLatestSEOAudit,
        {
          projectId: args.projectId,
        }
      );
      if (seoAudit) {
        const technical = seoAudit.technicalSeo?.score ?? 0;
        const onPage = seoAudit.onPageSeo?.score ?? 0;
        const content = seoAudit.contentQuality?.score ?? 0;
        seoAuditRawScore = Math.round((technical + onPage + content) / 3);
      }
    } catch (e) {
      console.error('[PhooRating] SEO audit fetch failed:', safeErrorMsg(e));
    }

    // ── 2b. Keyword Strategy ──
    let keywordCount = 0;
    let keywordsWithVolume = 0;
    let keywordsHighPriority = 0;
    let keywordsApproved = 0;
    try {
      const keywordStats = await ctx.runQuery(
        internal.analytics.martaiRatingQueries.getKeywordStats,
        { projectId: args.projectId }
      );
      keywordCount = keywordStats.total;
      keywordsWithVolume = keywordStats.withVolume;
      keywordsHighPriority = keywordStats.highPriority;
      keywordsApproved = keywordStats.approved;
    } catch (e) {
      console.error('[PhooRating] Keyword stats fetch failed:', safeErrorMsg(e));
    }

    // ── 2c. Content Execution ──
    let contentPieceCount = 0;
    let publishedCount = 0;
    let clusterCount = 0;
    let hasCalendar = false;
    try {
      const contentStats = (await ctx.runQuery(
        internal.analytics.martaiRatingQueries.getContentStats,
        { projectId: args.projectId }
      )) as { totalPieces: number; published: number; clusters: number; hasCalendar: boolean };
      contentPieceCount = contentStats.totalPieces;
      publishedCount = contentStats.published;
      clusterCount = contentStats.clusters;
      hasCalendar = contentStats.hasCalendar;
    } catch (e) {
      console.error('[PhooRating] Content stats fetch failed:', safeErrorMsg(e));
    }

    // ── 2d. GEO Readiness (live site checks) ──
    let geoChecks = {
      hasSitemap: false,
      hasRobotsTxt: false,
      hasJsonLd: false,
      hasLlmsTxt: false,
      schemaTypes: [] as string[],
    };
    if (project?.websiteUrl) {
      try {
        geoChecks = await checkGEOReadiness(project.websiteUrl);
      } catch (e) {
        console.error('[PhooRating] GEO readiness check failed:', safeErrorMsg(e));
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SCORE CALCULATION
    // ══════════════════════════════════════════════════════════════════════════

    const scores: Record<string, number> = {
      visibility: scoreVisibility(avgPosition, quickWinCount),
      trafficHealth: scoreTrafficHealth(sessionsChange),
      ctrPerformance: scoreCTR(ctr),
      engagementQuality: scoreEngagement(bounceRate),
      seoAudit: scoreSEOAudit(seoAuditRawScore),
      keywordStrategy: scoreKeywordStrategy(
        keywordCount,
        keywordsWithVolume,
        keywordsHighPriority,
        keywordsApproved
      ),
      contentExecution: scoreContentExecution(
        contentPieceCount,
        publishedCount,
        clusterCount,
        hasCalendar
      ),
      geoReadiness: scoreGEOReadiness(geoChecks),
    };

    const overall = Math.round(
      (scores.visibility * WEIGHTS.visibility +
        scores.trafficHealth * WEIGHTS.trafficHealth +
        scores.ctrPerformance * WEIGHTS.ctrPerformance +
        scores.engagementQuality * WEIGHTS.engagementQuality +
        scores.seoAudit * WEIGHTS.seoAudit +
        scores.keywordStrategy * WEIGHTS.keywordStrategy +
        scores.contentExecution * WEIGHTS.contentExecution +
        scores.geoReadiness * WEIGHTS.geoReadiness) /
        100
    );

    const { tier, label } = getTier(overall);

    // ── Store ──
    await ctx.runMutation(internal.analytics.martaiRatingQueries.storeScore, {
      projectId: args.projectId,
      date: now,
      overall,
      tier,
      visibility: scores.visibility,
      trafficHealth: scores.trafficHealth,
      ctrPerformance: scores.ctrPerformance,
      engagementQuality: scores.engagementQuality,
      seoAudit: scores.seoAudit,
      keywordStrategy: scores.keywordStrategy,
      contentExecution: scores.contentExecution,
      geoReadiness: scores.geoReadiness,
      rawMetrics: {
        avgPosition: avgPosition ?? undefined,
        sessionsChange: sessionsChange ?? undefined,
        ctr: ctr ?? undefined,
        bounceRate: bounceRate ?? undefined,
        quickWinCount,
        briefsThisMonth: publishedCount,
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
        hasSitemap: geoChecks.hasSitemap,
        hasRobotsTxt: geoChecks.hasRobotsTxt,
        hasJsonLd: geoChecks.hasJsonLd,
        hasLlmsTxt: geoChecks.hasLlmsTxt,
        schemaTypesFound: geoChecks.schemaTypes,
        seoAuditScore: seoAuditRawScore ?? undefined,
        keywordCount_total: keywordCount,
        clusterCount,
        contentPieceCount,
        publishedCount,
      },
    });

    console.log(`[PhooRating] Project ${args.projectId}: ${overall} (${label})`);

    return {
      overall,
      tier,
      label,
      components: scores,
    };
  },
});

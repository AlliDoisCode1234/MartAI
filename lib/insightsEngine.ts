/**
 * Insights Engine — Market Intelligence Resolver
 *
 * Module Hierarchy:
 * lib → insightsEngine (this file)
 *
 * Pure functions that resolve market intelligence metrics from
 * DataForSEO-enriched keyword data. Designed to complement
 * Traffic Intelligence (GA4/GSC) without conflating data sources.
 *
 * Used by: app/studio/insights/page.tsx (Row 2: Market Intelligence)
 * Data source: api.seo.keywordsData.getKeywordsEnriched
 */

// ============================================================================
// Types
// ============================================================================

/** Shape of a single enriched keyword from getKeywordsEnriched */
export interface EnrichedKeywordForInsights {
  searchVolume: number | null;
  difficulty: number | null;
  cpc: number | null;
  isQuickWin: boolean;
  gscPosition: number | null;
  gscClicks: number | null;
  gscImpressions: number | null;
}

/** Resolved market intelligence metrics */
export interface MarketIntelligence {
  /** Sum of monthly search volumes across all tracked keywords */
  totalSearchVolume: number;
  /** Average keyword difficulty (0-100 scale) */
  avgDifficulty: number;
  /** Count of keywords flagged as quick wins (DFS position 11-20 or low difficulty) */
  quickWinCount: number;
  /** Estimated monthly market value: sum(volume * CPC) */
  revenueOpportunity: number;
  /** Whether any meaningful DFS data exists */
  hasData: boolean;
  /** Total tracked keywords with search volume data */
  keywordCount: number;
  /** Keywords currently ranking on Google (have GSC position) */
  rankingCount: number;
}

// ============================================================================
// Core Resolver
// ============================================================================

/**
 * Resolve market intelligence metrics from enriched keywords.
 * Accepts the raw keyword array from getKeywordsEnriched and
 * computes aggregate metrics for the Market Intelligence row.
 */
export function resolveMarketIntelligence(
  keywords: EnrichedKeywordForInsights[]
): MarketIntelligence {
  if (keywords.length === 0) {
    return {
      totalSearchVolume: 0,
      avgDifficulty: 0,
      quickWinCount: 0,
      revenueOpportunity: 0,
      hasData: false,
      keywordCount: 0,
      rankingCount: 0,
    };
  }

  // Filter to keywords that have searchVolume (DFS enriched)
  const withVolume = keywords.filter(
    (k) => k.searchVolume !== null && k.searchVolume > 0
  );

  const totalSearchVolume = withVolume.reduce(
    (sum, k) => sum + (k.searchVolume ?? 0),
    0
  );

  // Difficulty: average across keywords that have difficulty data
  const withDifficulty = keywords.filter(
    (k) => k.difficulty !== null && k.difficulty > 0
  );
  const avgDifficulty =
    withDifficulty.length > 0
      ? Math.round(
          withDifficulty.reduce((sum, k) => sum + (k.difficulty ?? 0), 0) /
            withDifficulty.length
        )
      : 0;

  // Quick wins: pre-computed by getKeywordsEnriched (position 11-20 OR low difficulty + volume)
  const quickWinCount = keywords.filter((k) => k.isQuickWin).length;

  // Revenue opportunity: sum of (volume * CPC) — represents monthly market value
  const revenueOpportunity = withVolume.reduce((sum, k) => {
    const volume = k.searchVolume ?? 0;
    const cpc = k.cpc ?? 0;
    return sum + volume * cpc;
  }, 0);

  // Keywords with GSC position data (actually ranking on Google)
  const rankingCount = keywords.filter(
    (k) => k.gscPosition !== null && k.gscPosition > 0
  ).length;

  // hasData: at least some keywords have search volume from DFS
  const hasData = withVolume.length > 0;

  return {
    totalSearchVolume,
    avgDifficulty,
    quickWinCount,
    revenueOpportunity: Math.round(revenueOpportunity),
    hasData,
    keywordCount: keywords.length,
    rankingCount,
  };
}

// ============================================================================
// Formatters
// ============================================================================

/**
 * Format currency for revenue opportunity display.
 * Compact form: $1.2K, $45.6K, $1.2M
 */
export function formatRevenue(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  if (value > 0) return `$${value.toLocaleString()}`;
  return '$0';
}

/**
 * Get a human-readable difficulty label from 0-100 score.
 */
export function getDifficultyLabel(score: number): string {
  if (score >= 80) return 'Very Hard';
  if (score >= 60) return 'Hard';
  if (score >= 40) return 'Medium';
  if (score >= 20) return 'Easy';
  return 'Very Easy';
}

/**
 * Get a color for difficulty display.
 */
export function getDifficultyColor(score: number): string {
  if (score >= 70) return '#EF4444'; // red
  if (score >= 50) return '#F59E0B'; // amber
  if (score >= 30) return '#3B82F6'; // blue
  return '#22C55E'; // green
}

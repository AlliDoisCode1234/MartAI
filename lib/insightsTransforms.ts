/**
 * Insights Data Transforms
 *
 * Pure functions for transforming content piece data into insights metrics.
 * No framework dependencies — fully testable.
 *
 * Used by: app/studio/insights/page.tsx
 * Tested by: lib/insightsTransforms.test.ts
 */

import { STUDIO_COLORS } from '@/lib/constants/studioTokens';

// ============================================================================
// Types
// ============================================================================

export interface ContentPieceForInsights {
  title: string;
  status: string;
  seoScore?: number;
  wordCount?: number;
  keywords?: string[];
  contentType?: string;
  h2Outline?: string[];
  internalLinks?: number;
  updatedAt: number;
}

export interface PipelineCounts {
  total: number;
  drafts: number;
  approved: number;
  published: number;
  scheduled: number;
  generating: number;
}

export interface RankedArticle {
  rank: number;
  title: string;
  seoScore: number;
  wordCount: number;
  keywordCount: number;
  trend: number;
  quickWin: boolean;
}

export interface GrowthAction {
  title: string;
  description: string;
  color: string;
}

export interface OptimizationHealth {
  onPageScore: number;
  internalLinkingScore: number;
  clusterCoverage: number;
  totalReworksBunch: string;
}

// ============================================================================
// Pipeline Aggregation
// ============================================================================

/**
 * Aggregate content pieces into pipeline status counts.
 */
export function aggregatePipeline(pieces: ContentPieceForInsights[]): PipelineCounts {
  const counts: PipelineCounts = {
    total: pieces.length,
    drafts: 0,
    approved: 0,
    published: 0,
    scheduled: 0,
    generating: 0,
  };

  for (const piece of pieces) {
    switch (piece.status) {
      case 'draft':
        counts.drafts++;
        break;
      case 'approved':
        counts.approved++;
        break;
      case 'published':
        counts.published++;
        break;
      case 'scheduled':
        counts.scheduled++;
        break;
      case 'generating':
        counts.generating++;
        break;
    }
  }

  return counts;
}

// ============================================================================
// Article Ranking
// ============================================================================

/**
 * Get top performing articles sorted by SEO score descending.
 */
export function getTopPerforming(pieces: ContentPieceForInsights[], limit = 5): RankedArticle[] {
  return pieces
    .filter((p) => p.seoScore !== undefined && p.seoScore > 0)
    .sort((a, b) => (b.seoScore ?? 0) - (a.seoScore ?? 0))
    .slice(0, limit)
    .map((p, i) => ({
      rank: i + 1,
      title: p.title,
      seoScore: p.seoScore ?? 0,
      wordCount: p.wordCount ?? 0,
      keywordCount: p.keywords?.length ?? 0,
      trend: estimateTrend(p),
      quickWin: false,
    }));
}

/**
 * Get underperforming articles (low SEO scores with improvement potential).
 */
export function getUnderperforming(pieces: ContentPieceForInsights[], limit = 3): RankedArticle[] {
  return pieces
    .filter(
      (p) =>
        p.seoScore !== undefined && p.seoScore > 0 && p.seoScore < 70 && p.status !== 'generating'
    )
    .sort((a, b) => (a.seoScore ?? 0) - (b.seoScore ?? 0))
    .slice(0, limit)
    .map((p, i) => ({
      rank: pieces.indexOf(p) + 1,
      title: p.title,
      seoScore: p.seoScore ?? 0,
      wordCount: p.wordCount ?? 0,
      keywordCount: p.keywords?.length ?? 0,
      trend: 0,
      quickWin: isQuickWin(p),
    }));
}

// ============================================================================
// Optimization Health
// ============================================================================

/**
 * Calculate optimization health metrics from content pieces.
 */
export function calculateOptimizationHealth(pieces: ContentPieceForInsights[]): OptimizationHealth {
  const scored = pieces.filter((p) => p.seoScore !== undefined && p.seoScore > 0);
  if (scored.length === 0) {
    return {
      onPageScore: 0,
      internalLinkingScore: 0,
      clusterCoverage: 0,
      totalReworksBunch: '0/0',
    };
  }

  const avgSeoScore = Math.round(
    scored.reduce((sum, p) => sum + (p.seoScore ?? 0), 0) / scored.length
  );

  // Internal linking: percentage of pieces with at least some internal links
  const withLinks = scored.filter((p) => (p.internalLinks ?? 0) > 0).length;
  const internalLinkingScore = Math.round((withLinks / scored.length) * 100);

  // Cluster coverage: percentage of pieces that have keywords assigned
  const withKeywords = scored.filter((p) => p.keywords && p.keywords.length > 0).length;
  const clusterCoverage = Math.round((withKeywords / scored.length) * 100);

  return {
    onPageScore: avgSeoScore,
    internalLinkingScore,
    clusterCoverage,
    totalReworksBunch: `${scored.length}/${pieces.length}`,
  };
}

// ============================================================================
// Growth Actions
// ============================================================================

/**
 * Generate top 3 growth actions based on content analysis.
 * Returns actionable recommendations, not just data.
 */
export function generateGrowthActions(
  pieces: ContentPieceForInsights[],
  pipeline: PipelineCounts
): GrowthAction[] {
  const actions: GrowthAction[] = [];

  // Action 1: Refresh underperforming content
  const underperforming = pieces.filter(
    (p) => p.seoScore !== undefined && p.seoScore > 0 && p.seoScore < 60
  );
  if (underperforming.length > 0) {
    const worst = underperforming.sort((a, b) => (a.seoScore ?? 0) - (b.seoScore ?? 0))[0];
    actions.push({
      title: `Refresh "${truncate(worst.title, 30)}"`,
      description: `SEO score is ${worst.seoScore}. Add keyword density, internal links, and expand thin sections.`,
      color: STUDIO_COLORS.coral,
    });
  }

  // Action 2: Publish approved content
  if (pipeline.approved > 0) {
    actions.push({
      title: `Publish ${pipeline.approved} approved article${pipeline.approved > 1 ? 's' : ''}`,
      description: `${pipeline.approved} piece${pipeline.approved > 1 ? 's are' : ' is'} approved and ready. Publishing quickly improves indexing freshness.`,
      color: STUDIO_COLORS.green,
    });
  }

  // Action 3: Improve internal linking
  const noLinks = pieces.filter((p) => (p.internalLinks ?? 0) === 0 && p.status === 'published');
  if (noLinks.length > 0) {
    actions.push({
      title: `Improve internal links in ${noLinks.length} article${noLinks.length > 1 ? 's' : ''}`,
      description: `Add 2-3 internal links to boost cluster authority and improve crawlability.`,
      color: STUDIO_COLORS.blue,
    });
  }

  // Action 4: Create new content for gaps
  if (actions.length < 3 && pipeline.total < 10) {
    actions.push({
      title: 'Create more content',
      description: `Only ${pipeline.total} articles. Aim for at least 10 to establish topical authority.`,
      color: STUDIO_COLORS.amber,
    });
  }

  // Action 5: Add keywords to unassigned content
  const noKeywords = pieces.filter((p) => !p.keywords || p.keywords.length === 0);
  if (actions.length < 3 && noKeywords.length > 0) {
    actions.push({
      title: `Assign keywords to ${noKeywords.length} article${noKeywords.length > 1 ? 's' : ''}`,
      description:
        'Content without target keywords cannot rank effectively. Assign from your keyword library.',
      color: STUDIO_COLORS.purple,
    });
  }

  return actions.slice(0, 3);
}

// ============================================================================
// Content Contribution
// ============================================================================

/**
 * Calculate content contribution percentage.
 * Published content as a ratio of total content created.
 */
export function calculateContentContribution(pipeline: PipelineCounts): number {
  if (pipeline.total === 0) return 0;
  return Math.round((pipeline.published / pipeline.total) * 100);
}

/**
 * Calculate average SEO score across all scored pieces.
 */
export function calculateAvgSeoScore(pieces: ContentPieceForInsights[]): number {
  const scored = pieces.filter((p) => p.seoScore !== undefined && p.seoScore > 0);
  if (scored.length === 0) return 0;
  return Math.round(scored.reduce((sum, p) => sum + (p.seoScore ?? 0), 0) / scored.length);
}

// ============================================================================
// Helpers (exported for testing)
// ============================================================================

/**
 * Estimate trend score based on article freshness.
 * Deterministic — no randomness. Consistent across re-renders.
 */
export function estimateTrend(piece: ContentPieceForInsights): number {
  const now = Date.now();
  const ageMs = now - piece.updatedAt;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  // Recently updated (< 7 days) -> positive trend
  if (ageDays < 7) return Math.round(15 - ageDays * 1.5);
  // Moderately fresh (< 30 days) -> small positive
  if (ageDays < 30) return Math.round(5 - (ageDays - 7) * 0.2);
  // Stale -> negative trend proportional to staleness
  return -Math.round(Math.min((ageDays - 30) * 0.1, 10));
}

/**
 * Determine if a piece is a "quick win" — close to good score with minor fixes.
 */
export function isQuickWin(piece: ContentPieceForInsights): boolean {
  const score = piece.seoScore ?? 0;
  // Quick win: score between 50-70 (close to good, needs small improvements)
  return score >= 50 && score < 70;
}

/**
 * Truncate a string to a max length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '\u2026';
}

/**
 * Format a number into compact form (1.2K, 3.4M, etc.)
 * Used by Insights page for large metric display.
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

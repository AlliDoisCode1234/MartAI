/**
 * SEO Scoring Utility (Client-Side)
 *
 * Component Hierarchy:
 * lib/seoScoring.ts (shared utility, no framework dependencies)
 *
 * Pure, deterministic scoring functions extracted from contentGeneration.ts
 * for real-time SEO feedback in the Content Editor. These functions run
 * client-side with zero network calls — scores update as the user types.
 *
 * RULES:
 * 1. No Convex imports — this is a pure client-side module
 * 2. All functions must be deterministic (same input = same output)
 * 3. Scoring weights match the server-side `scoreContent` exactly
 */

// ============================================================================
// Types
// ============================================================================

export interface SEOScoreResult {
  /** Overall SEO score 0-100 */
  score: number;
  /** Individual metric breakdowns (each 0-100) */
  metrics: SEOMetrics;
}

export interface SEOMetrics {
  wordCountScore: number;
  h2Score: number;
  keywordScore: number;
  structureScore: number;
  readabilityScore: number;
}

export interface SEOScoringInput {
  /** Raw markdown content being edited */
  content: string;
  /** H2 outline sections (from the generated outline) */
  outline: string[];
  /** Target keywords for this content piece */
  keywords: string[];
  /** Target word count for this content type (e.g. 1200 for blog) */
  targetWordCount?: number;
}

// ============================================================================
// Constants
// ============================================================================

/** Default word count target when content type is unknown */
const DEFAULT_TARGET_WORD_COUNT = 750;

/** Scoring weights — must match server-side contentGeneration.ts */
const WEIGHTS = {
  wordCount: 0.25,
  keywords: 0.25,
  structure: 0.2,
  h2: 0.15,
  readability: 0.15,
} as const;

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Count words in content string.
 * Matches server-side `countWords` exactly.
 */
export function countWords(content: string): number {
  return (content || '').split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Count H2 headings in markdown content.
 */
export function countH2s(content: string): number {
  return (content.match(/^## /gm) || []).length;
}

/**
 * Count markdown links in content.
 */
export function countLinks(content: string): number {
  return (content.match(/\[.*?\]\(.*?\)/g) || []).length;
}

/**
 * Count occurrences of the primary keyword in content.
 * Returns exact phrase match count for accurate display in the SEO panel.
 * This is a COUNT, not a score — use scoreContentRealTime for scoring.
 */
export function countKeywordOccurrences(content: string, keywords: string[]): number {
  const primary = keywords[0]?.toLowerCase() || '';
  if (!primary) return 0;
  const escaped = primary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (content.toLowerCase().match(new RegExp(escaped, 'g')) || []).length;
}

/**
 * Score content for SEO quality in real-time.
 *
 * This is a pure extraction of `scoreContent` from contentGeneration.ts.
 * The weights and thresholds are identical to ensure consistency between
 * the real-time preview and the final server-side score.
 *
 * @returns SEOScoreResult with overall score and per-metric breakdowns
 */
export function scoreContentRealTime(input: SEOScoringInput): SEOScoreResult {
  const { content, outline, keywords, targetWordCount = DEFAULT_TARGET_WORD_COUNT } = input;

  const safeContent = content || '';
  const wordCount = countWords(safeContent);
  const h2Count = countH2s(safeContent);
  const primaryKeyword = keywords[0]?.toLowerCase() || '';

  // ── Keyword Scoring ──────────────────────────────────────────────
  // Smart matching: handles multi-word keywords like "lip fillers kansas city"
  let keywordScore = 0;
  if (primaryKeyword) {
    const contentLower = safeContent.toLowerCase();

    // Count exact phrase matches
    const exactMatches = (
      contentLower.match(new RegExp(primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ||
      []
    ).length;

    // For multi-word keywords, also score individual significant words
    const words = primaryKeyword.split(/\s+/).filter((w) => w.length > 2);
    let wordMatchScore = 0;

    if (words.length > 1) {
      const wordCounts = words.map((word) => {
        const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        return (contentLower.match(wordRegex) || []).length;
      });
      const avgWordCount = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
      wordMatchScore = Math.min(100, (avgWordCount / 6) * 100);
    }

    const exactScore = Math.min(100, (exactMatches / 4) * 100);

    // Combined: 60% word presence + 40% exact phrase (multi-word)
    keywordScore =
      words.length > 1
        ? exactScore * 0.4 + wordMatchScore * 0.6
        : Math.min(100, (exactMatches / 8) * 100);
  }

  // ── Component Scores (each 0-100) ────────────────────────────────
  const wordCountScore = Math.min(100, (wordCount / targetWordCount) * 100);
  const h2Score = Math.min(100, (h2Count / 6) * 100);
  const readabilityScore = 85; // Baseline for well-structured content

  // Outline coverage: how many outline sections appear in content
  const outlineCoverage = outline.reduce((count, section) => {
    return count + (safeContent.toLowerCase().includes(section.toLowerCase().slice(0, 20)) ? 1 : 0);
  }, 0);
  const structureScore = Math.min(100, (outlineCoverage / Math.max(outline.length, 1)) * 100);

  // ── Weighted Average ─────────────────────────────────────────────
  const score = Math.round(
    wordCountScore * WEIGHTS.wordCount +
      keywordScore * WEIGHTS.keywords +
      structureScore * WEIGHTS.structure +
      h2Score * WEIGHTS.h2 +
      readabilityScore * WEIGHTS.readability
  );

  return {
    score: Math.min(100, score),
    metrics: {
      wordCountScore: Math.round(wordCountScore),
      h2Score: Math.round(h2Score),
      keywordScore: Math.round(keywordScore),
      structureScore: Math.round(structureScore),
      readabilityScore: Math.round(readabilityScore),
    },
  };
}

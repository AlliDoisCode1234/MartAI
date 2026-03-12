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
 *
 * Readability: Flesch Reading Ease formula
 *   Reference: https://codebeautify.org/flesch-kincaid-calculator
 *   Formula: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
 *   Target: 60-70 for web content (https://hemingwayapp.com)
 *
 * Keyword Density: 0.5-2% recommended
 *   Reference: https://contenthero.co.uk, https://postaffiliatepro.com
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
// Core Counting Functions
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

// ============================================================================
// Readability Scoring — Flesch Reading Ease
// ============================================================================

/**
 * Count syllables in a single English word using heuristic rules.
 *
 * Heuristic approach (no dictionary lookup):
 * 1. Count vowel groups (a,e,i,o,u,y)
 * 2. Subtract silent-e at end
 * 3. Handle common suffixes (-le, -es, -ed)
 * 4. Minimum 1 syllable per word
 *
 * Reference: Carnegie Mellon Pronouncing Dictionary heuristic approach
 */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 2) return 1;

  let count = 0;
  const vowels = 'aeiouy';
  let prevIsVowel = false;

  for (let i = 0; i < w.length; i++) {
    const isVowel = vowels.includes(w[i]);
    if (isVowel && !prevIsVowel) {
      count++;
    }
    prevIsVowel = isVowel;
  }

  // Silent-e: subtract if word ends in 'e' and has other vowel groups
  if (w.endsWith('e') && count > 1) {
    count--;
  }

  // Handle -le ending (e.g., "table", "simple") — adds a syllable
  if (w.endsWith('le') && w.length > 2 && !vowels.includes(w[w.length - 3])) {
    count++;
  }

  // Handle -ed ending: usually not a syllable unless preceded by t or d
  if (w.endsWith('ed') && w.length > 3) {
    const beforeEd = w[w.length - 3];
    if (beforeEd !== 't' && beforeEd !== 'd') {
      // "played" = 1 syllable, not 2. But "wanted" = 2.
      count = Math.max(1, count - 1);
    }
  }

  return Math.max(1, count);
}

/**
 * Count sentences in text content.
 * Strips markdown formatting before splitting on sentence-ending punctuation.
 * Also counts paragraph breaks as sentence boundaries for markdown content
 * where paragraphs may not end with periods.
 */
export function countSentences(content: string): number {
  if (!content || !content.trim()) return 0;

  // Strip all markdown formatting to get plain prose
  const cleaned = content
    .replace(/^#{1,6}\s+.*$/gm, '')        // headings
    .replace(/```[\s\S]*?```/g, '')         // code blocks
    .replace(/`[^`]+`/g, '')               // inline code
    .replace(/!?\[.*?\]\(.*?\)/g, '')      // links and images
    .replace(/^[-*+]\s+/gm, '')            // bullet points
    .replace(/^\d+\.\s+/gm, '')            // numbered lists
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // bold
    .replace(/\*([^*]+)\*/g, '$1')         // italic
    .replace(/^>\s*/gm, '')               // blockquotes
    .replace(/---+/g, '')                  // horizontal rules
    .trim();

  if (!cleaned) return 0;

  // Split on sentence-ending punctuation
  const sentences = cleaned.split(/[.!?]+/).filter((s) => {
    const trimmed = s.trim();
    // Must have at least 2 words to count as a sentence
    return trimmed.length > 0 && trimmed.split(/\s+/).length >= 2;
  });

  return Math.max(1, sentences.length);
}

/**
 * Compute Flesch Reading Ease score.
 *
 * Formula: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
 *
 * Score interpretation:
 *   90-100: Very Easy (5th grade)
 *   80-89:  Easy (6th grade)
 *   70-79:  Fairly Easy (7th grade)
 *   60-69:  Standard (8th-9th grade) — ideal for web content
 *   50-59:  Fairly Difficult (10th-12th grade)
 *   30-49:  Difficult (college level)
 *   0-29:   Very Difficult (college graduate)
 *
 * Returns a score clamped to 0-100.
 */
export function computeFleschReadingEase(content: string): number {
  // Strip markdown to get plain prose for accurate syllable counting
  const plainText = (content || '')
    .replace(/^#{1,6}\s+/gm, '')           // heading markers
    .replace(/```[\s\S]*?```/g, '')         // code blocks
    .replace(/`[^`]+`/g, '')               // inline code
    .replace(/!?\[.*?\]\(.*?\)/g, '')      // links and images
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // bold
    .replace(/\*([^*]+)\*/g, '$1')         // italic
    .replace(/^[-*+>]\s*/gm, '')           // bullets, blockquotes
    .replace(/---+/g, '')                  // horizontal rules
    .trim();

  const words = countWords(plainText);
  const sentences = countSentences(content);

  if (words < 10 || sentences === 0) return 0;

  // Count total syllables on plain text only
  const wordList = plainText.split(/\s+/).filter((w) => w.length > 0);
  const totalSyllables = wordList.reduce((sum, w) => sum + countSyllables(w), 0);

  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = totalSyllables / words;

  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ============================================================================
// Keyword Counting
// ============================================================================

/**
 * Count how many of the provided keywords are actually present in the content.
 * Returns the number of UNIQUE keywords found (at least once each).
 *
 * This answers the user question: "Did the AI use ALL my keywords?"
 * Example: keywords=["lip fillers","botox","med spa"], content mentions 2 → returns 2
 *
 * @deprecated Use `countKeywordsUsed` instead. This name is kept for backward compat.
 */
export function countKeywordOccurrences(content: string, keywords: string[]): number {
  return countKeywordsUsed(content, keywords);
}

/**
 * Count how many of the provided keywords appear in the content at least once.
 * Returns the count of unique keywords found.
 *
 * This is a COUNT of coverage, not frequency — use scoreContentRealTime for scoring.
 */
export function countKeywordsUsed(content: string, keywords: string[]): number {
  if (!keywords || keywords.length === 0) return 0;
  const contentLower = (content || '').toLowerCase();

  let found = 0;
  for (const keyword of keywords) {
    const kw = keyword.toLowerCase().trim();
    if (!kw) continue;
    if (contentLower.includes(kw)) {
      found++;
    }
  }
  return found;
}

/**
 * Compute keyword density as a percentage.
 * Industry standard target: 0.5-2%
 *
 * Reference: https://contenthero.co.uk, https://postaffiliatepro.com
 */
export function computeKeywordDensity(content: string, primaryKeyword: string): number {
  if (!primaryKeyword || !content) return 0;
  const words = countWords(content);
  if (words === 0) return 0;

  const escaped = primaryKeyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = (content.toLowerCase().match(new RegExp(escaped, 'g')) || []).length;
  const keywordWordCount = primaryKeyword.split(/\s+/).length;

  return Number((((matches * keywordWordCount) / words) * 100).toFixed(2));
}

// ============================================================================
// Real-Time SEO Scoring
// ============================================================================

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
  // Two dimensions: (1) keyword coverage — how many keywords appear,
  // (2) primary keyword density — is it in a healthy range?
  let keywordScore = 0;
  if (keywords.length > 0) {
    // Coverage: what percentage of keywords appear in the content?
    const keywordsFound = countKeywordsUsed(safeContent, keywords);
    const coverageScore = Math.min(100, (keywordsFound / keywords.length) * 100);

    // Density: is the primary keyword used in a healthy range (0.5-2%)?
    let densityScore = 0;
    if (primaryKeyword && wordCount > 0) {
      const density = computeKeywordDensity(safeContent, primaryKeyword);
      if (density >= 0.5 && density <= 2.0) {
        densityScore = 100; // Sweet spot
      } else if (density > 0 && density < 0.5) {
        densityScore = (density / 0.5) * 80; // Under-optimized
      } else if (density > 2.0 && density <= 3.0) {
        densityScore = 100 - (density - 2.0) * 50; // Slightly over
      } else if (density > 3.0) {
        densityScore = Math.max(0, 50 - (density - 3.0) * 20); // Keyword stuffing
      }
    }

    // Combined: 70% coverage + 30% density
    keywordScore = coverageScore * 0.7 + densityScore * 0.3;
  }

  // ── Component Scores (each 0-100) ────────────────────────────────
  const wordCountScore = Math.min(100, (wordCount / targetWordCount) * 100);
  const h2Score = Math.min(100, (h2Count / 6) * 100);

  // Real readability: Flesch Reading Ease (not hardcoded!)
  const readabilityScore = wordCount >= 10 ? computeFleschReadingEase(safeContent) : 0;

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

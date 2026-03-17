/**
 * Content Generation Helpers — Pure Functions
 *
 * Extracted from convex/contentGeneration.ts for testability.
 * Contains the deterministic logic for content creation:
 *
 * - Word counting and readability scoring
 * - Content quality scoring (5-metric weighted average)
 * - Default outline generation per content type
 * - Fallback content generation
 * - Target word/section mapping
 * - Flesch Reading Ease computation
 *
 * IMPORTANT: These must stay in sync with convex/contentGeneration.ts.
 * They are re-exported there for production use.
 */

import {
  CONTENT_TYPES,
  DEFAULT_SEO_CHECKLIST,
  type ContentTypeId,
} from '../convex/phoo/contentTypes';

// ============================================================================
// Constants
// ============================================================================

/** Quality threshold for A+ grade — 95% minimum for production content */
export const QUALITY_THRESHOLD = 95;

/** Maximum generation retry attempts */
export const MAX_GENERATION_ATTEMPTS = 3;

// ============================================================================
// Word Counting
// ============================================================================

/** Count words in content (splits on whitespace, filters empties) */
export function countWords(content: string): number {
  return (content || '').split(/\s+/).filter((word) => word.length > 0).length;
}

// ============================================================================
// Target Mapping
// ============================================================================

/** Get target H2 section count for a content type */
export function getTargetSections(contentType: string): number {
  const targets: Record<string, number> = {
    blog: 8,
    pillar: 10,
    howto: 8,
    comparison: 9,
    listicle: 9,
  };
  return targets[contentType] || 8;
}

/** Get target word count for a content type (from CONTENT_TYPES registry) */
export function getTargetWords(contentType: string): number {
  const config = CONTENT_TYPES[contentType as ContentTypeId];
  if (config) {
    return config.wordCount;
  }
  // Fallback for legacy types
  const legacyTargets: Record<string, number> = {
    pillar: 3500,
    howto: 1800,
    comparison: 2000,
    listicle: 1500,
  };
  return legacyTargets[contentType] || DEFAULT_SEO_CHECKLIST.wordCount;
}

// ============================================================================
// Default Outlines
// ============================================================================

/** Generate a default outline for a given content type and keyword */
export function getDefaultOutline(contentType: string, primaryKeyword: string): string[] {
  const templates: Record<string, string[]> = {
    blog: [
      'Introduction',
      `What is ${primaryKeyword}?`,
      `Why ${primaryKeyword} Matters`,
      'Key Benefits',
      'How to Get Started',
      'Best Practices',
      'Common Mistakes to Avoid',
      'Conclusion',
    ],
    pillar: [
      'Introduction',
      `Complete Guide to ${primaryKeyword}`,
      'Understanding the Fundamentals',
      'Step-by-Step Process',
      'Advanced Strategies',
      'Tools and Resources',
      'Case Studies',
      'Expert Tips',
      'Frequently Asked Questions',
      'Conclusion and Next Steps',
    ],
    howto: [
      'Introduction',
      'What You Will Need',
      'Step 1: Getting Started',
      'Step 2: The Process',
      'Step 3: Implementation',
      'Step 4: Verification',
      'Troubleshooting Common Issues',
      'Conclusion',
    ],
    comparison: [
      'Introduction',
      'Quick Comparison Table',
      'Option A: Overview',
      'Option B: Overview',
      'Feature-by-Feature Comparison',
      'Pricing Comparison',
      'Pros and Cons',
      'Which One is Right for You?',
      'Conclusion',
    ],
    listicle: [
      'Introduction',
      `Top ${primaryKeyword} Options`,
      '1. First Item',
      '2. Second Item',
      '3. Third Item',
      '4. Fourth Item',
      '5. Fifth Item',
      'Honorable Mentions',
      'Conclusion',
    ],
  };

  return templates[contentType] || templates.blog;
}

// ============================================================================
// Fallback Content
// ============================================================================

/** Generate basic fallback content when AI fails */
export function generateFallbackContent(
  title: string,
  outline: string[],
  keywords: string[]
): string {
  const primaryKeyword = keywords[0] || 'topic';
  let content = `# ${title}\n\n`;

  for (const section of outline) {
    content += `## ${section}\n\n`;
    content += `When it comes to ${primaryKeyword}, understanding this section is essential for success. `;
    content += `Many professionals overlook the importance of ${section.toLowerCase()}, but it can make a significant difference in your results.\n\n`;
    content += `By focusing on key elements related to ${primaryKeyword}, you can achieve better outcomes. `;
    content += `This section provides actionable insights that you can implement immediately.\n\n`;
  }

  return content;
}

// ============================================================================
// Readability Scoring (Server-Side)
// ============================================================================

/** Count syllables in a single English word (heuristic) */
export function countSyllablesServer(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 2) return 1;

  let count = 0;
  const vowels = 'aeiouy';
  let prevIsVowel = false;

  for (let i = 0; i < w.length; i++) {
    const isVowel = vowels.includes(w[i]);
    if (isVowel && !prevIsVowel) count++;
    prevIsVowel = isVowel;
  }

  if (w.endsWith('e') && count > 1) count--;
  if (w.endsWith('le') && w.length > 2 && !vowels.includes(w[w.length - 3])) count++;
  if (w.endsWith('ed') && w.length > 3) {
    const beforeEd = w[w.length - 3];
    if (beforeEd !== 't' && beforeEd !== 'd') count = Math.max(1, count - 1);
  }

  return Math.max(1, count);
}

/** Count sentences in text content. Strips markdown before counting. */
export function countSentencesServer(content: string): number {
  if (!content || !content.trim()) return 0;
  const cleaned = content
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^>\s*/gm, '')
    .replace(/---+/g, '')
    .trim();
  if (!cleaned) return 0;
  const sentences = cleaned.split(/[.!?]+/).filter((s) => {
    const trimmed = s.trim();
    return trimmed.length > 0 && trimmed.split(/\s+/).length >= 2;
  });
  return Math.max(1, sentences.length);
}

/** Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words) */
export function computeFleschReadingEaseServer(content: string, wordCount: number): number {
  const plainText = (content || '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[-*+>]\s*/gm, '')
    .replace(/---+/g, '')
    .trim();

  const plainWordCount = plainText.split(/\s+/).filter((w) => w.length > 0).length;
  const sentences = countSentencesServer(content);
  if (plainWordCount < 10 || sentences === 0) return 0;

  const wordList = plainText.split(/\s+/).filter((w) => w.length > 0);
  const totalSyllables = wordList.reduce((sum, w) => sum + countSyllablesServer(w), 0);

  const score =
    206.835 - 1.015 * (plainWordCount / sentences) - 84.6 * (totalSyllables / plainWordCount);
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ============================================================================
// Content Quality Scoring
// ============================================================================

/**
 * Score content quality on 5 weighted metrics (0-100 each):
 * - Word Count (25%): ratio to target
 * - Keywords (25%): coverage + density
 * - Structure (20%): outline coverage
 * - H2 Count (15%): ratio to 6
 * - Readability (15%): Flesch Reading Ease
 */
export function scoreContent(
  content: string,
  outline: string[],
  keywords: string[],
  targetWordCount: number = 1200
): { score: number; metrics: Record<string, number> } {
  const safeContent = content || '';
  const wordCount = countWords(safeContent);
  const h2Count = (safeContent.match(/^## /gm) || []).length;
  const primaryKeyword = keywords[0]?.toLowerCase() || '';

  // Keyword Scoring: coverage + density
  let keywordScore = 0;
  if (keywords.length > 0) {
    const contentLower = safeContent.toLowerCase();
    let keywordsFound = 0;
    for (const kw of keywords) {
      if (contentLower.includes(kw.toLowerCase().trim())) {
        keywordsFound++;
      }
    }
    const coverageScore = Math.min(100, (keywordsFound / keywords.length) * 100);

    let densityScore = 0;
    if (primaryKeyword && wordCount > 0) {
      const escaped = primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = (contentLower.match(new RegExp(escaped, 'g')) || []).length;
      const kwWordCount = primaryKeyword.split(/\s+/).length;
      const density = Number((((matches * kwWordCount) / wordCount) * 100).toFixed(2));
      if (density >= 0.5 && density <= 2.0) {
        densityScore = 100;
      } else if (density > 0 && density < 0.5) {
        densityScore = (density / 0.5) * 80;
      } else if (density > 2.0 && density <= 3.0) {
        densityScore = 100 - (density - 2.0) * 50;
      } else if (density > 3.0) {
        densityScore = Math.max(0, 50 - (density - 3.0) * 20);
      }
    }

    keywordScore = coverageScore * 0.7 + densityScore * 0.3;
  }

  const wordCountScore = Math.min(100, (wordCount / targetWordCount) * 100);
  const h2Score = Math.min(100, (h2Count / 6) * 100);
  const readabilityScore = computeFleschReadingEaseServer(safeContent, wordCount);

  const outlineCoverage = outline.reduce((count, section) => {
    return count + (safeContent.toLowerCase().includes(section.toLowerCase().slice(0, 20)) ? 1 : 0);
  }, 0);
  const structureScore = Math.min(100, (outlineCoverage / Math.max(outline.length, 1)) * 100);

  const score = Math.round(
    wordCountScore * 0.25 +
      keywordScore * 0.25 +
      structureScore * 0.2 +
      h2Score * 0.15 +
      readabilityScore * 0.15
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

// Re-export CONTENT_TYPES and types for test convenience
export { CONTENT_TYPES, DEFAULT_SEO_CHECKLIST };
export type { ContentTypeId };

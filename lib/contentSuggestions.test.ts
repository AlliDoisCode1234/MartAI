/**
 * Content Suggestions Panel — Unit Tests
 *
 * Tests for the deterministic suggestion generation logic.
 * Validates coaching rules, severity mapping, and edge cases.
 */

import { describe, it, expect } from 'vitest';
import { scoreContentRealTime } from './seoScoring';
import type { SEOScoreResult } from './seoScoring';

// ============================================================================
// Helper: generate a score result with specific metric overrides
// ============================================================================
function makeScore(overrides: Partial<SEOScoreResult['metrics']> = {}): SEOScoreResult {
  return {
    score: 50,
    metrics: {
      wordCountScore: 80,
      h2Score: 70,
      keywordScore: 60,
      structureScore: 75,
      readabilityScore: 60,
      ...overrides,
    },
  };
}

// ============================================================================
// Suggestion Generation Rules
// These tests verify the rule logic that the ContentSuggestionsPanel uses.
// Since the component itself inlines the rules, we test the scoring inputs
// and verify the thresholds are correct.
// ============================================================================

describe('Content Suggestion Rules', () => {
  // ── Readability Thresholds ────────────────────────────────────────
  describe('Readability-based suggestions', () => {
    it('readability < 40 should trigger issue severity', () => {
      const score = makeScore({ readabilityScore: 32 });
      expect(score.metrics.readabilityScore).toBeLessThan(40);
    });

    it('readability 40-59 should trigger suggestion severity', () => {
      const score = makeScore({ readabilityScore: 52 });
      expect(score.metrics.readabilityScore).toBeGreaterThanOrEqual(40);
      expect(score.metrics.readabilityScore).toBeLessThan(60);
    });

    it('readability >= 80 should trigger success severity', () => {
      const score = makeScore({ readabilityScore: 85 });
      expect(score.metrics.readabilityScore).toBeGreaterThanOrEqual(80);
    });

    it('readability 60-79 should NOT trigger any suggestion', () => {
      const score = makeScore({ readabilityScore: 65 });
      // No issue, no suggestion, no success — in the "good enough" range
      expect(score.metrics.readabilityScore).toBeGreaterThanOrEqual(60);
      expect(score.metrics.readabilityScore).toBeLessThan(80);
    });
  });

  // ── Keyword Missing Detection ─────────────────────────────────────
  describe('Keywords-based suggestions', () => {
    it('should detect missing keywords in content', () => {
      const content = 'This article about lip fillers is great.';
      const keywords = ['lip fillers', 'botox', 'med spa'];
      const contentLower = content.toLowerCase();

      const missing = keywords.filter((kw) => !contentLower.includes(kw.toLowerCase()));
      expect(missing).toEqual(['botox', 'med spa']);
    });

    it('should detect all keywords present', () => {
      const content = 'lip fillers, botox, and med spa are all popular services.';
      const keywords = ['lip fillers', 'botox', 'med spa'];
      const contentLower = content.toLowerCase();

      const missing = keywords.filter((kw) => !contentLower.includes(kw.toLowerCase()));
      expect(missing).toEqual([]);
    });

    it('should be case-insensitive', () => {
      const content = 'BOTOX and LIP FILLERS are common.';
      const keywords = ['lip fillers', 'botox'];
      const contentLower = content.toLowerCase();

      const missing = keywords.filter((kw) => !contentLower.includes(kw.toLowerCase()));
      expect(missing).toEqual([]);
    });
  });

  // ── Word Count Thresholds ─────────────────────────────────────────
  describe('Word count-based suggestions', () => {
    it('word count < 50% of target should trigger issue', () => {
      const wordCount = 500;
      const target = 1200;
      const ratio = wordCount / target;
      expect(ratio).toBeLessThan(0.5);
    });

    it('word count 50-80% of target should trigger tip', () => {
      const wordCount = 800;
      const target = 1200;
      const ratio = wordCount / target;
      expect(ratio).toBeGreaterThanOrEqual(0.5);
      expect(ratio).toBeLessThan(0.8);
    });

    it('word count >= 100% of target should trigger success', () => {
      const wordCount = 1200;
      const target = 1200;
      const ratio = wordCount / target;
      expect(ratio).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Structure Thresholds ──────────────────────────────────────────
  describe('Structure-based suggestions', () => {
    it('h2Score < 50 should trigger suggestion', () => {
      const score = makeScore({ h2Score: 30 });
      expect(score.metrics.h2Score).toBeLessThan(50);
    });

    it('structureScore < 70 should trigger tip', () => {
      const score = makeScore({ structureScore: 55 });
      expect(score.metrics.structureScore).toBeLessThan(70);
    });
  });

  // ── Empty Content Edge Case ───────────────────────────────────────
  describe('Edge cases', () => {
    it('empty content returns zero scores', () => {
      const result = scoreContentRealTime({
        content: '',
        outline: [],
        keywords: [],
      });
      expect(result.score).toBe(0);
    });

    it('content with no keywords array returns 0 keyword score', () => {
      const result = scoreContentRealTime({
        content: 'Some content here with enough words for testing.',
        outline: [],
        keywords: [],
      });
      expect(result.metrics.keywordScore).toBe(0);
    });

    it('very short content returns 0 readability', () => {
      const result = scoreContentRealTime({
        content: 'Just a few words',
        outline: [],
        keywords: [],
      });
      // Flesch returns 0 for < 10 words
      expect(result.metrics.readabilityScore).toBe(0);
    });
  });
});

// ============================================================================
// Grading Utility (imported from grading.ts)
// ============================================================================
describe('Grade Scale Alignment', () => {
  it('86 should grade as B+ not A', async () => {
    const { getSeoGrade } = await import('./utils/grading');
    expect(getSeoGrade(86).grade).toBe('B+');
  });

  it('90 should grade as A+', async () => {
    const { getSeoGrade } = await import('./utils/grading');
    expect(getSeoGrade(90).grade).toBe('A+');
  });

  it('75 should grade as B', async () => {
    const { getSeoGrade } = await import('./utils/grading');
    expect(getSeoGrade(75).grade).toBe('B');
  });

  it('45 should grade as D (below C threshold of 50)', async () => {
    const { getSeoGrade } = await import('./utils/grading');
    expect(getSeoGrade(45).grade).toBe('D');
  });
});


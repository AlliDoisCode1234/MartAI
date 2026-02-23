/**
 * SEO Scoring Utility — Unit Tests
 *
 * Tests for lib/seoScoring.ts (pure client-side scoring functions).
 * Validates counting accuracy, scoring weights, and edge cases.
 */

import { describe, it, expect } from 'vitest';
import {
  countWords,
  countH2s,
  countLinks,
  countKeywordOccurrences,
  scoreContentRealTime,
} from './seoScoring';

// ============================================================================
// countWords
// ============================================================================
describe('countWords', () => {
  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('returns 0 for null-ish input', () => {
    // The function handles falsy input defensively
    expect(countWords(undefined as unknown as string)).toBe(0);
  });

  it('counts simple words', () => {
    expect(countWords('hello world')).toBe(2);
  });

  it('handles extra whitespace correctly', () => {
    expect(countWords('  hello   world   foo  ')).toBe(3);
  });

  it('handles newlines and tabs', () => {
    expect(countWords('hello\nworld\tfoo')).toBe(3);
  });
});

// ============================================================================
// countH2s
// ============================================================================
describe('countH2s', () => {
  it('returns 0 when no headings', () => {
    expect(countH2s('Just some text')).toBe(0);
  });

  it('counts H2 headings correctly', () => {
    const md = '## Heading 1\nSome text\n## Heading 2\nMore text\n## Heading 3';
    expect(countH2s(md)).toBe(3);
  });

  it('does NOT count H3s or H1s', () => {
    const md = '# H1\n### H3\n#### H4';
    expect(countH2s(md)).toBe(0);
  });

  it('requires space after ##', () => {
    expect(countH2s('##no-space')).toBe(0);
  });
});

// ============================================================================
// countLinks
// ============================================================================
describe('countLinks', () => {
  it('returns 0 when no links', () => {
    expect(countLinks('Just plain text')).toBe(0);
  });

  it('counts markdown links', () => {
    const md = 'See [Google](https://google.com) and [Bing](https://bing.com)';
    expect(countLinks(md)).toBe(2);
  });
});

// ============================================================================
// countKeywordOccurrences
// ============================================================================
describe('countKeywordOccurrences', () => {
  it('returns 0 for empty keywords array', () => {
    expect(countKeywordOccurrences('some content', [])).toBe(0);
  });

  it('returns 0 when keyword not found', () => {
    expect(countKeywordOccurrences('hello world', ['banana'])).toBe(0);
  });

  it('counts exact phrase matches (case-insensitive)', () => {
    const content = 'Lip fillers are popular. LIP FILLERS cost varies. lip fillers near me.';
    expect(countKeywordOccurrences(content, ['lip fillers'])).toBe(3);
  });

  it('uses only the primary (first) keyword', () => {
    const content = 'hello hello hello world';
    expect(countKeywordOccurrences(content, ['hello', 'world'])).toBe(3);
  });
});

// ============================================================================
// scoreContentRealTime
// ============================================================================
describe('scoreContentRealTime', () => {
  it('returns baseline score for empty content', () => {
    const result = scoreContentRealTime({
      content: '',
      outline: [],
      keywords: [],
    });
    // Empty content: only readability (85 * 0.15 = 12.75) contributes
    expect(result.score).toBe(13); // Math.round(12.75)
    expect(result.metrics.wordCountScore).toBe(0);
    expect(result.metrics.h2Score).toBe(0);
    expect(result.metrics.keywordScore).toBe(0);
  });

  it('scores well for content that hits targets', () => {
    // Build content that hits: ~1200 words, 6+ H2s, keyword present, outline covered
    const words = Array(1200).fill('word').join(' ');
    const h2s = Array(6)
      .fill(0)
      .map((_, i) => `## Section ${i + 1}`)
      .join('\n');
    const outline = ['Section 1', 'Section 2', 'Section 3'];
    const content = `${h2s}\n\n${words}\n\nseo keyword seo keyword seo keyword seo keyword seo keyword seo keyword seo keyword seo keyword`;

    const result = scoreContentRealTime({
      content,
      outline,
      keywords: ['seo keyword'],
      targetWordCount: 1200,
    });

    // Should score 80+ with all targets hit
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it('returns all metric fields in the expected shape', () => {
    const result = scoreContentRealTime({
      content: 'test',
      outline: [],
      keywords: ['test'],
    });

    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('metrics');
    expect(result.metrics).toHaveProperty('wordCountScore');
    expect(result.metrics).toHaveProperty('h2Score');
    expect(result.metrics).toHaveProperty('keywordScore');
    expect(result.metrics).toHaveProperty('structureScore');
    expect(result.metrics).toHaveProperty('readabilityScore');
  });

  it('caps score at 100', () => {
    // Even with extreme values, score should never exceed 100
    const words = Array(5000).fill('keyword').join(' ');
    const h2s = Array(20)
      .fill(0)
      .map((_, i) => `## Section ${i}`)
      .join('\n');

    const result = scoreContentRealTime({
      content: `${h2s}\n${words}`,
      outline: [],
      keywords: ['keyword'],
      targetWordCount: 100,
    });

    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('handles multi-word keyword scoring correctly', () => {
    const content =
      'lip fillers kansas city is great. lip fillers kansas city rocks. We do lip fillers kansas city.';

    const result = scoreContentRealTime({
      content,
      outline: [],
      keywords: ['lip fillers kansas city'],
    });

    expect(result.metrics.keywordScore).toBeGreaterThan(0);
  });
});

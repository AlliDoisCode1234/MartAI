/**
 * SEO Scoring Utility — Unit Tests
 *
 * Tests for lib/seoScoring.ts (pure client-side scoring functions).
 * Validates counting accuracy, scoring weights, readability, and edge cases.
 */

import { describe, it, expect } from 'vitest';
import {
  countWords,
  countH2s,
  countLinks,
  countKeywordsUsed,
  countKeywordOccurrences,
  countSyllables,
  countSentences,
  computeFleschReadingEase,
  computeKeywordDensity,
  scoreContentRealTime,
  scoreReadabilityForIndustry,
} from './seoScoring';

// ============================================================================
// countWords
// ============================================================================
describe('countWords', () => {
  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('returns 0 for null-ish input', () => {
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
// countSyllables
// ============================================================================
describe('countSyllables', () => {
  it('counts single-syllable words', () => {
    expect(countSyllables('cat')).toBe(1);
    expect(countSyllables('dog')).toBe(1);
    expect(countSyllables('run')).toBe(1);
  });

  it('counts multi-syllable words', () => {
    expect(countSyllables('hello')).toBe(2);
    expect(countSyllables('beautiful')).toBe(3);
    expect(countSyllables('information')).toBe(4);
  });

  it('handles short words as 1 syllable', () => {
    expect(countSyllables('a')).toBe(1);
    expect(countSyllables('I')).toBe(1);
    expect(countSyllables('an')).toBe(1);
  });

  it('returns at least 1 for any word', () => {
    expect(countSyllables('xyz')).toBeGreaterThanOrEqual(1);
    expect(countSyllables('')).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// countSentences
// ============================================================================
describe('countSentences', () => {
  it('returns 0 for empty string', () => {
    expect(countSentences('')).toBe(0);
  });

  it('counts sentences ending with periods', () => {
    const text = 'This is sentence one. This is sentence two. And this is three.';
    expect(countSentences(text)).toBe(3);
  });

  it('counts sentences ending with exclamation and question marks', () => {
    const text = 'Hello there friend! How are you doing? I am doing fine.';
    expect(countSentences(text)).toBe(3);
  });

  it('strips markdown headings', () => {
    const text = '## My Heading\nThis is a real sentence here. And another one here.';
    expect(countSentences(text)).toBe(2);
  });

  it('returns at least 1 for content with words', () => {
    expect(countSentences('A short fragment with some words')).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// computeFleschReadingEase
// ============================================================================
describe('computeFleschReadingEase', () => {
  it('returns 0 for very short content', () => {
    expect(computeFleschReadingEase('Too short')).toBe(0);
  });

  it('returns a score between 0 and 100 for normal content', () => {
    const content =
      'The cat sat on the mat. The dog ran in the park. Birds fly in the sky. Fish swim in the sea.';
    const score = computeFleschReadingEase(content);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('simple text scores higher (easier to read) than complex text', () => {
    const simple = 'The cat sat on the mat. The dog ran fast. I like cake. You are nice.';
    const complex =
      'The implementation of sophisticated algorithmic methodologies necessitates a comprehensive understanding of computational complexity. Furthermore, the fundamental paradigms underlying theoretical frameworks require substantial intellectual consideration.';

    const simpleScore = computeFleschReadingEase(simple);
    const complexScore = computeFleschReadingEase(complex);

    expect(simpleScore).toBeGreaterThan(complexScore);
  });

  it('never returns a negative score', () => {
    const veryComplex =
      'Electroencephalographically sophisticated neuropsychological investigations demonstrated unprecedented counterrevolutionary characteristics.';
    expect(computeFleschReadingEase(veryComplex)).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================================
// countKeywordsUsed (replaces countKeywordOccurrences)
// ============================================================================
describe('countKeywordsUsed', () => {
  it('returns 0 for empty keywords array', () => {
    expect(countKeywordsUsed('some content', [])).toBe(0);
  });

  it('returns 0 when no keywords found', () => {
    expect(countKeywordsUsed('hello world', ['banana'])).toBe(0);
  });

  it('counts unique keywords found (case-insensitive)', () => {
    const content = 'Lip fillers are popular. BOTOX is common. Med spa services are growing.';
    expect(countKeywordsUsed(content, ['lip fillers', 'botox', 'med spa'])).toBe(3);
  });

  it('returns 2/3 when only 2 of 3 keywords present', () => {
    const content = 'Lip fillers are popular. This med spa is great.';
    expect(countKeywordsUsed(content, ['lip fillers', 'botox', 'med spa'])).toBe(2);
  });

  it('counts each keyword only once regardless of frequency', () => {
    const content = 'botox botox botox botox botox botox botox botox';
    expect(countKeywordsUsed(content, ['botox'])).toBe(1);
  });

  it('backward compat: countKeywordOccurrences maps to countKeywordsUsed', () => {
    const content = 'lip fillers are great. lip fillers rock. lip fillers forever.';
    // Old function returned frequency (3), new function returns coverage (1)
    expect(countKeywordOccurrences(content, ['lip fillers'])).toBe(1);
  });
});

// ============================================================================
// computeKeywordDensity
// ============================================================================
describe('computeKeywordDensity', () => {
  it('returns 0 for empty content', () => {
    expect(computeKeywordDensity('', 'keyword')).toBe(0);
  });

  it('returns 0 for no keyword', () => {
    expect(computeKeywordDensity('some content here', '')).toBe(0);
  });

  it('computes density correctly', () => {
    // 100 words with "seo" appearing 1 time = 1%
    const words = Array(99).fill('word').join(' ') + ' seo';
    const density = computeKeywordDensity(words, 'seo');
    expect(density).toBe(1);
  });

  it('handles multi-word keywords', () => {
    // "lip fillers" = 2 words, appearing 1 time in 100 words = 2%
    const words = Array(98).fill('word').join(' ') + ' lip fillers';
    const density = computeKeywordDensity(words, 'lip fillers');
    expect(density).toBe(2);
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
    // Empty content: only readability contributes, but FRE returns 0 for <10 words
    expect(result.score).toBe(0);
    expect(result.metrics.wordCountScore).toBe(0);
    expect(result.metrics.h2Score).toBe(0);
    expect(result.metrics.keywordScore).toBe(0);
    expect(result.metrics.readabilityScore).toBe(0);
  });

  it('scores well for content that hits targets', () => {
    // Build realistic content: ~1200 words, 6+ H2s, keywords present, readable
    const sections = Array(6)
      .fill(0)
      .map(
        (_, i) =>
          `## Section ${i + 1}\n\nThis section provides detailed information about the topic. We explore key aspects and offer practical advice. The goal is to help readers understand the subject better and take action on what they learn.\n`
      )
      .join('\n');

    const filler = Array(180).fill('The quick brown fox jumps over the lazy dog.').join(' ');
    const content = `${sections}\n\n${filler}\n\nseo keyword appears here. seo keyword again.`;

    const result = scoreContentRealTime({
      content,
      outline: ['Section 1', 'Section 2', 'Section 3'],
      keywords: ['seo keyword'],
      targetWordCount: 1200,
    });

    // Should score reasonably well with targets partially hit
    expect(result.score).toBeGreaterThan(30);
  });

  it('readability score is NOT hardcoded to 85', () => {
    // Critical test: verify we compute real readability, not return 85
    const simpleContent = Array(50).fill('The cat sat on the mat.').join(' ');
    const result = scoreContentRealTime({
      content: simpleContent,
      outline: [],
      keywords: [],
    });

    // Simple content should have HIGH readability (FRE > 85 or so)
    // But the key assertion: it's NOT always 85
    expect(result.metrics.readabilityScore).not.toBe(85);
    expect(result.metrics.readabilityScore).toBeGreaterThan(0);
  });

  it('returns all metric fields in the expected shape', () => {
    const result = scoreContentRealTime({
      content: 'This is a test of the scoring system with enough words to count properly.',
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

  it('keyword score uses coverage (unique keywords found), not frequency', () => {
    // 3 keywords, content has 2 of them
    const content =
      'This article about lip fillers and botox treatments provides important information for patients.';

    const result = scoreContentRealTime({
      content,
      outline: [],
      keywords: ['lip fillers', 'botox', 'med spa'], // med spa NOT in content
    });

    // Coverage = 2/3 = 66.7%, score should reflect partial coverage
    expect(result.metrics.keywordScore).toBeGreaterThan(0);
    expect(result.metrics.keywordScore).toBeLessThan(100);
  });
});

// ============================================================================
// scoreReadabilityForIndustry (Phase 2)
// ============================================================================
describe('scoreReadabilityForIndustry', () => {
  it('tech industry: Flesch 35 scores above 70 (between floor 30 and target 50)', () => {
    const score = scoreReadabilityForIndustry(35, 'technology');
    expect(score).toBeGreaterThanOrEqual(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('tech industry: Flesch 50 (at target) scores 100', () => {
    expect(scoreReadabilityForIndustry(50, 'technology')).toBe(100);
  });

  it('tech industry: Flesch 60 (above target) scores 100', () => {
    expect(scoreReadabilityForIndustry(60, 'technology')).toBe(100);
  });

  it('lifestyle industry: Flesch 35 scores below 70 (below floor 60)', () => {
    const score = scoreReadabilityForIndustry(35, 'lifestyle');
    expect(score).toBeLessThan(70);
  });

  it('lifestyle industry: Flesch 75 (at target) scores 100', () => {
    expect(scoreReadabilityForIndustry(75, 'lifestyle')).toBe(100);
  });

  it('undefined industry uses default thresholds (floor 40, target 60)', () => {
    // At target
    expect(scoreReadabilityForIndustry(60, undefined)).toBe(100);
    // Between floor and target
    const score = scoreReadabilityForIndustry(50, undefined);
    expect(score).toBeGreaterThanOrEqual(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('Flesch 0 always returns 0', () => {
    expect(scoreReadabilityForIndustry(0, 'technology')).toBe(0);
    expect(scoreReadabilityForIndustry(0, 'lifestyle')).toBe(0);
    expect(scoreReadabilityForIndustry(0, undefined)).toBe(0);
  });

  it('at exact floor boundary returns 70', () => {
    // Tech floor = 30
    expect(scoreReadabilityForIndustry(30, 'technology')).toBe(70);
    // Legal floor = 20
    expect(scoreReadabilityForIndustry(20, 'legal')).toBe(70);
  });

  it('scoreContentRealTime uses industry param', () => {
    // Simple content that has a known Flesch score range
    const content = Array(50).fill('The cat sat on the mat.').join(' ');
    const withoutIndustry = scoreContentRealTime({
      content,
      outline: [],
      keywords: [],
    });
    const withTech = scoreContentRealTime({
      content,
      outline: [],
      keywords: [],
      industry: 'technology',
    });

    // Both should have non-zero readability
    expect(withoutIndustry.metrics.readabilityScore).toBeGreaterThan(0);
    expect(withTech.metrics.readabilityScore).toBeGreaterThan(0);

    // Simple content should score well in both — readability score should be >= 70
    expect(withTech.metrics.readabilityScore).toBeGreaterThanOrEqual(70);
  });
});

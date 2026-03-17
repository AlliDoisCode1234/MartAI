/**
 * Suggestion Engine Tests — EXHAUSTIVE
 *
 * Tests for lib/suggestionEngine.ts
 *
 * Coverage areas:
 * 1. Completeness invariants — every fixable suggestion has fixInstruction
 * 2. Cross-metric guards — every fix protects other metrics
 * 3. Content integrity — no emojis, no meta-headers, no fabrication language
 * 4. Dynamic value interpolation — no undefined, NaN, or template artifacts
 * 5. Threshold boundaries — exact boundary values for every severity
 * 6. Industry calibration — all 11 industries
 * 7. Keywords — all count permutations
 * 8. Word count — every ratio band
 * 9. Structure — every H2/structureScore band
 * 10. Combined scenarios — multiple issues at once
 * 11. Edge cases — empty content, zero target, extreme values
 * 12. Regression guards — every bug we've fixed
 */

import { describe, test, expect } from 'vitest';
import { generateSuggestions, type Suggestion } from '../../lib/suggestionEngine';
import type { SEOScoreResult } from '../../lib/seoScoring';

// ============================================================================
// Test Helpers
// ============================================================================

/** Emoji regex — matches common emoji ranges */
const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}\u{FE0F}]/u;

/** Meta-header patterns the AI should never produce */
const META_HEADER_PATTERNS = [
  'Missing Sections',
  'Added Content',
  'New Sections',
  'Updated Sections',
  'Additional Content',
  'Revised Sections',
  'New Content',
  'Inserted Content',
  'Appended Sections',
];

/** All industries in our system */
const ALL_INDUSTRIES = [
  'technology', 'healthcare', 'legal', 'finance',
  'education', 'lifestyle', 'ecommerce', 'marketing',
  'realestate', 'other',
];

/** Dense industries (floor <= 35) */
const DENSE_INDUSTRIES = ['technology', 'healthcare', 'legal', 'finance'];

/** Non-dense industries (floor > 35) */
const NON_DENSE_INDUSTRIES = ['education', 'lifestyle', 'ecommerce', 'marketing', 'realestate', 'other'];

/** Valid iconKey values */
const VALID_ICON_KEYS = ['edit', 'type', 'hash', 'file'];

/** Valid severity values */
const VALID_SEVERITIES = ['issue', 'suggestion', 'tip', 'success'];

/** Valid category values */
const VALID_CATEGORIES = ['readability', 'keywords', 'structure', 'wordcount'];

function makeScore(overrides: Partial<SEOScoreResult['metrics']> = {}): SEOScoreResult {
  return {
    score: 50,
    metrics: {
      h2Score: 60,
      keywordScore: 50,
      readabilityScore: 55,
      wordCountScore: 50,
      structureScore: 75,
      ...overrides,
    },
  };
}

/** Create content with exact word count */
function makeContent(wordCount: number, keyword?: string): string {
  const base = keyword || 'word';
  return Array(wordCount).fill(base).join(' ');
}

function getFixableSuggestions(suggestions: Suggestion[]): Suggestion[] {
  return suggestions.filter((s) => s.fixable && s.severity !== 'success');
}

function getSuccessSuggestions(suggestions: Suggestion[]): Suggestion[] {
  return suggestions.filter((s) => s.severity === 'success');
}

// ============================================================================
// 1. COMPLETENESS INVARIANTS
// ============================================================================

describe('Suggestion Engine', () => {
  describe('1. Completeness Invariants', () => {
    test('every fixable non-success suggestion has a non-empty fixInstruction', () => {
      const score = makeScore({
        readabilityScore: 30,
        h2Score: 40,
        structureScore: 60,
      });
      const suggestions = generateSuggestions(
        score,
        'Short content about SEO tips and tricks.',
        ['seo tips', 'organic traffic', 'keyword research'],
        1200
      );

      const fixable = getFixableSuggestions(suggestions);
      expect(fixable.length).toBeGreaterThan(0);

      for (const s of fixable) {
        expect(s.fixInstruction, `${s.id} should have fixInstruction`).toBeDefined();
        expect(s.fixInstruction!.length, `${s.id} fixInstruction too short`).toBeGreaterThan(10);
      }
    });

    test('outline coverage suggestion is fixable', () => {
      const score = makeScore({ h2Score: 60, structureScore: 65 });
      const suggestions = generateSuggestions(score, 'Some content here.', [], 1200);
      const outline = suggestions.find((s) => s.id === 'structure-outline');

      expect(outline).toBeDefined();
      expect(outline!.fixable).toBe(true);
      expect(outline!.fixInstruction).toBeDefined();
    });

    test('structure-low suggestion is fixable', () => {
      const score = makeScore({ h2Score: 40 });
      const suggestions = generateSuggestions(score, 'Some content.', [], 1200);
      const structure = suggestions.find((s) => s.id === 'structure-low');

      expect(structure).toBeDefined();
      expect(structure!.fixable).toBe(true);
      expect(structure!.fixInstruction).toBeDefined();
    });

    test('success suggestions are NOT fixable', () => {
      const score = makeScore({
        readabilityScore: 90,
        h2Score: 80,
        structureScore: 80,
      });
      const content = makeContent(1200);
      const suggestions = generateSuggestions(score, content, ['word'], 1200);
      const successes = getSuccessSuggestions(suggestions);

      for (const s of successes) {
        expect(s.fixable, `${s.id} should not be fixable`).toBe(false);
      }
    });

    test('success suggestions do NOT have fixInstruction', () => {
      const score = makeScore({ readabilityScore: 90 });
      const content = makeContent(1200);
      const suggestions = generateSuggestions(score, content, ['word'], 1200);
      const successes = getSuccessSuggestions(suggestions);

      for (const s of successes) {
        expect(s.fixInstruction, `${s.id} should not have fixInstruction`).toBeUndefined();
      }
    });

    test('every suggestion has a valid iconKey', () => {
      const score = makeScore({ readabilityScore: 30, h2Score: 40 });
      const suggestions = generateSuggestions(score, 'Content.', ['seo'], 1200);

      for (const s of suggestions) {
        expect(VALID_ICON_KEYS, `${s.id} has invalid iconKey: ${s.iconKey}`).toContain(s.iconKey);
      }
    });

    test('every suggestion has a valid severity', () => {
      const score = makeScore({ readabilityScore: 30 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);

      for (const s of suggestions) {
        expect(VALID_SEVERITIES, `${s.id} has invalid severity: ${s.severity}`).toContain(s.severity);
      }
    });

    test('every suggestion has a valid category', () => {
      const score = makeScore({ readabilityScore: 30, h2Score: 40 });
      const suggestions = generateSuggestions(score, 'Content.', ['seo'], 1200);

      for (const s of suggestions) {
        expect(VALID_CATEGORIES, `${s.id} has invalid category: ${s.category}`).toContain(s.category);
      }
    });

    test('every suggestion has a non-empty title', () => {
      const score = makeScore({ readabilityScore: 30, h2Score: 40 });
      const suggestions = generateSuggestions(score, 'Content.', ['seo'], 1200);

      for (const s of suggestions) {
        expect(s.title.length, `${s.id} has empty title`).toBeGreaterThan(0);
      }
    });

    test('every suggestion has a non-empty coaching string', () => {
      const score = makeScore({ readabilityScore: 30, h2Score: 40 });
      const suggestions = generateSuggestions(score, 'Content.', ['seo'], 1200);

      for (const s of suggestions) {
        expect(s.coaching.length, `${s.id} has empty coaching`).toBeGreaterThan(0);
      }
    });

    test('suggestion IDs are unique within a single call', () => {
      const score = makeScore({ readabilityScore: 30, h2Score: 40 });
      const suggestions = generateSuggestions(score, 'Content.', ['seo'], 1200);
      const ids = suggestions.map((s) => s.id);
      const unique = new Set(ids);

      expect(unique.size).toBe(ids.length);
    });
  });

  // ============================================================================
  // 2. CROSS-METRIC GUARDS
  // ============================================================================

  describe('2. Cross-Metric Guards', () => {
    test('every fixInstruction contains CRITICAL CONSTRAINT', () => {
      const score = makeScore({
        readabilityScore: 30,
        h2Score: 40,
        structureScore: 60,
      });
      const suggestions = generateSuggestions(
        score,
        'Short content about tips.',
        ['seo tips', 'organic traffic', 'keyword research'],
        1200
      );

      const fixable = getFixableSuggestions(suggestions);
      expect(fixable.length).toBeGreaterThan(0);
      for (const s of fixable) {
        expect(
          s.fixInstruction,
          `${s.id} must contain cross-metric guard`
        ).toContain('CRITICAL CONSTRAINT');
      }
    });

    test('readability fix protects word count', () => {
      const score = makeScore({ readabilityScore: 30 });
      const content = makeContent(500);
      const suggestions = generateSuggestions(score, content, [], 1200);
      const readability = suggestions.find((s) => s.id === 'readability-hard');

      expect(readability!.fixInstruction).toContain('maintain or increase');
      expect(readability!.fixInstruction).toContain('Do NOT shorten');
    });

    test('readability fix protects structure', () => {
      const score = makeScore({ readabilityScore: 30 });
      const content = makeContent(500);
      const suggestions = generateSuggestions(score, content, [], 1200);
      const readability = suggestions.find((s) => s.id === 'readability-hard');

      expect(readability!.fixInstruction).toContain('outline structure');
      expect(readability!.fixInstruction).toContain('H2 headings');
    });

    test('medium readability fix protects word count', () => {
      const score = makeScore({ readabilityScore: 50 });
      const content = makeContent(500);
      const suggestions = generateSuggestions(score, content, [], 1200);
      const readability = suggestions.find((s) => s.id === 'readability-medium');

      expect(readability!.fixInstruction).toContain('maintain or increase');
    });

    test('word count fix (low) protects structure', () => {
      const content = makeContent(100);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const wordcount = suggestions.find((s) => s.id === 'wordcount-low');

      expect(wordcount!.fixInstruction).toContain('maintain ALL existing H2');
      expect(wordcount!.fixInstruction).toContain('Do NOT remove or rename');
    });

    test('word count fix (low) protects readability', () => {
      const content = makeContent(100);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const wordcount = suggestions.find((s) => s.id === 'wordcount-low');

      expect(wordcount!.fixInstruction).toContain('readability');
      expect(wordcount!.fixInstruction).toContain('scannable');
    });

    test('word count fix (medium) protects structure', () => {
      const content = makeContent(800);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const wordcount = suggestions.find((s) => s.id === 'wordcount-medium');

      expect(wordcount!.fixInstruction).toContain('maintain ALL existing H2');
    });

    test('keyword fix protects all other metrics', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(
        score,
        'Content about marketing.',
        ['seo', 'organic traffic'],
        1200
      );
      const keywords = suggestions.find((s) => s.id === 'keywords-missing');

      expect(keywords!.fixInstruction).toContain('CRITICAL CONSTRAINT');
      expect(keywords!.fixInstruction).toContain('word count');
      expect(keywords!.fixInstruction).toContain('readability');
    });

    test('structure-low fix protects word count', () => {
      const score = makeScore({ h2Score: 40 });
      const content = makeContent(500);
      const suggestions = generateSuggestions(score, content, [], 1200);
      const structure = suggestions.find((s) => s.id === 'structure-low');

      expect(structure!.fixInstruction).toContain('maintain or increase');
      expect(structure!.fixInstruction).toContain('word count');
    });

    test('outline coverage fix protects word count', () => {
      const score = makeScore({ h2Score: 60, structureScore: 65 });
      const content = makeContent(500);
      const suggestions = generateSuggestions(score, content, [], 1200);
      const outline = suggestions.find((s) => s.id === 'structure-outline');

      expect(outline!.fixInstruction).toContain('maintain or increase');
    });
  });

  // ============================================================================
  // 3. CONTENT INTEGRITY (No emojis, no meta-headers)
  // ============================================================================

  describe('3. Content Integrity', () => {
    test('no fixInstruction contains emoji characters', () => {
      const score = makeScore({
        readabilityScore: 30,
        h2Score: 40,
        structureScore: 60,
      });
      const suggestions = generateSuggestions(
        score,
        'Short content.',
        ['seo', 'marketing'],
        1200
      );

      for (const s of suggestions) {
        if (s.fixInstruction) {
          expect(
            EMOJI_REGEX.test(s.fixInstruction),
            `${s.id} fixInstruction contains emoji`
          ).toBe(false);
        }
      }
    });

    test('no coaching text contains emoji characters', () => {
      const score = makeScore({ readabilityScore: 30, h2Score: 40 });
      const suggestions = generateSuggestions(score, 'Content.', ['seo'], 1200);

      for (const s of suggestions) {
        expect(
          EMOJI_REGEX.test(s.coaching),
          `${s.id} coaching contains emoji`
        ).toBe(false);
      }
    });

    test('outline coverage fixInstruction explicitly bans Missing Sections header', () => {
      const score = makeScore({ h2Score: 60, structureScore: 65 });
      const suggestions = generateSuggestions(score, 'Some content.', [], 1200);
      const outline = suggestions.find((s) => s.id === 'structure-outline');

      expect(outline!.fixInstruction).toContain('Do NOT add a "Missing Sections"');
    });

    test('outline coverage fixInstruction bans emojis', () => {
      const score = makeScore({ h2Score: 60, structureScore: 65 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const outline = suggestions.find((s) => s.id === 'structure-outline');

      expect(outline!.fixInstruction).toContain('Do NOT use emojis');
    });

    test('outline coverage fixInstruction requires tone matching', () => {
      const score = makeScore({ h2Score: 60, structureScore: 65 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const outline = suggestions.find((s) => s.id === 'structure-outline');

      expect(outline!.fixInstruction).toContain('tone');
      expect(outline!.fixInstruction).toContain('writing style');
    });

    test('no fixInstruction instructs adding meta-commentary headers', () => {
      const score = makeScore({
        readabilityScore: 30,
        h2Score: 40,
        structureScore: 60,
      });
      const suggestions = generateSuggestions(score, 'Short.', ['seo'], 1200);

      for (const s of suggestions) {
        if (s.fixInstruction) {
          for (const pattern of META_HEADER_PATTERNS) {
            if (s.fixInstruction.includes(pattern)) {
              // If mentioned, it should be in the context of a ban
              expect(
                s.fixInstruction,
                `${s.id} should ban "${pattern}", not instruct adding it`
              ).toContain('Do NOT');
            }
          }
        }
      }
    });

    test('fixInstructions for all categories avoid fabrication language', () => {
      const score = makeScore({ readabilityScore: 30, h2Score: 40 });
      const suggestions = generateSuggestions(score, 'Content.', ['seo'], 1200);

      for (const s of suggestions) {
        if (s.fixInstruction) {
          // Should not instruct to "make up" or "invent" data
          expect(s.fixInstruction.toLowerCase()).not.toContain('make up');
          expect(s.fixInstruction.toLowerCase()).not.toContain('invent a');
          expect(s.fixInstruction.toLowerCase()).not.toContain('fabricate');
        }
      }
    });
  });

  // ============================================================================
  // 4. DYNAMIC VALUE INTERPOLATION
  // ============================================================================

  describe('4. Dynamic Value Interpolation', () => {
    test('readability-hard fixInstruction contains actual score', () => {
      const score = makeScore({ readabilityScore: 35 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const readability = suggestions.find((s) => s.id === 'readability-hard');

      expect(readability!.fixInstruction).toContain('35/100');
    });

    test('readability-medium fixInstruction contains actual score', () => {
      const score = makeScore({ readabilityScore: 55 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const readability = suggestions.find((s) => s.id === 'readability-medium');

      expect(readability!.fixInstruction).toContain('55/100');
    });

    test('wordcount-low fixInstruction contains actual word count and target', () => {
      const content = makeContent(400);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const wordcount = suggestions.find((s) => s.id === 'wordcount-low');

      expect(wordcount!.fixInstruction).toContain('400');
      expect(wordcount!.fixInstruction).toContain('1200');
    });

    test('wordcount-low fixInstruction contains percentage', () => {
      const content = makeContent(300);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const wordcount = suggestions.find((s) => s.id === 'wordcount-low');

      expect(wordcount!.fixInstruction).toContain('25%');
    });

    test('wordcount-medium fixInstruction contains words needed', () => {
      const content = makeContent(800);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const wordcount = suggestions.find((s) => s.id === 'wordcount-medium');

      expect(wordcount!.fixInstruction).toContain('400'); // 1200 - 800
    });

    test('no fixInstruction contains "undefined"', () => {
      const score = makeScore({ readabilityScore: 30 });
      const suggestions = generateSuggestions(score, 'Short.', ['seo'], 1200);

      for (const s of suggestions) {
        if (s.fixInstruction) {
          expect(s.fixInstruction, `${s.id}`).not.toContain('undefined');
        }
        expect(s.coaching, `${s.id}`).not.toContain('undefined');
        expect(s.title, `${s.id}`).not.toContain('undefined');
      }
    });

    test('no fixInstruction contains "NaN"', () => {
      const score = makeScore({ readabilityScore: 30 });
      const suggestions = generateSuggestions(score, 'Short.', ['seo'], 1200);

      for (const s of suggestions) {
        if (s.fixInstruction) {
          expect(s.fixInstruction, `${s.id}`).not.toContain('NaN');
        }
        expect(s.coaching, `${s.id}`).not.toContain('NaN');
      }
    });

    test('no fixInstruction contains raw template syntax like ${', () => {
      const score = makeScore({ readabilityScore: 30, h2Score: 40 });
      const suggestions = generateSuggestions(score, 'Short.', ['seo'], 1200);

      for (const s of suggestions) {
        if (s.fixInstruction) {
          expect(s.fixInstruction, `${s.id}`).not.toContain('${');
        }
      }
    });

    test('keyword fixInstruction contains quoted keyword names', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(
        score,
        'Content about marketing.',
        ['seo', 'organic traffic'],
        1200
      );
      const keywords = suggestions.find((s) => s.id === 'keywords-missing');

      expect(keywords!.fixInstruction).toContain('"seo"');
      expect(keywords!.fixInstruction).toContain('"organic traffic"');
    });

    test('readability fixInstruction contains word count for constraint', () => {
      const content = makeContent(750);
      const score = makeScore({ readabilityScore: 35 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const readability = suggestions.find((s) => s.id === 'readability-hard');

      // Should reference the actual word count in the constraint
      expect(readability!.fixInstruction).toContain('750');
    });
  });

  // ============================================================================
  // 5. THRESHOLD BOUNDARIES
  // ============================================================================

  describe('5. Threshold Boundaries', () => {
    // ── Readability ──
    test.each([
      [0, 'readability-hard', 'issue'],
      [1, 'readability-hard', 'issue'],
      [20, 'readability-hard', 'issue'],
      [39, 'readability-hard', 'issue'],
    ])('readability %i => %s (%s)', (score, expectedId, expectedSeverity) => {
      const s = makeScore({ readabilityScore: score });
      const suggestions = generateSuggestions(s, 'Content.', [], 1200);
      const match = suggestions.find((sg) => sg.id === expectedId);

      expect(match).toBeDefined();
      expect(match!.severity).toBe(expectedSeverity);
    });

    test.each([
      [40, 'readability-medium', 'suggestion'],
      [50, 'readability-medium', 'suggestion'],
      [59, 'readability-medium', 'suggestion'],
    ])('readability %i => %s (%s)', (score, expectedId, expectedSeverity) => {
      const s = makeScore({ readabilityScore: score });
      const suggestions = generateSuggestions(s, 'Content.', [], 1200);
      const match = suggestions.find((sg) => sg.id === expectedId);

      expect(match).toBeDefined();
      expect(match!.severity).toBe(expectedSeverity);
    });

    test('readability 60 generates no readability suggestion', () => {
      const score = makeScore({ readabilityScore: 60 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const readability = suggestions.filter((s) => s.category === 'readability');

      expect(readability).toHaveLength(0);
    });

    test('readability 70 is in dead zone (no suggestion)', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const readability = suggestions.filter((s) => s.category === 'readability');

      expect(readability).toHaveLength(0);
    });

    test('readability 79 is in dead zone (no suggestion)', () => {
      const score = makeScore({ readabilityScore: 79 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const readability = suggestions.filter((s) => s.category === 'readability');

      expect(readability).toHaveLength(0);
    });

    test.each([
      [80, 'readability-great', 'success'],
      [90, 'readability-great', 'success'],
      [100, 'readability-great', 'success'],
    ])('readability %i => %s (%s)', (score, expectedId, expectedSeverity) => {
      const s = makeScore({ readabilityScore: score });
      const suggestions = generateSuggestions(s, 'Content.', [], 1200);
      const match = suggestions.find((sg) => sg.id === expectedId);

      expect(match).toBeDefined();
      expect(match!.severity).toBe(expectedSeverity);
    });

    // ── Word Count Ratio ──
    test('word ratio 0 (1 word / 1200 target) => wordcount-low issue', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, 'word', [], 1200);
      const match = suggestions.find((s) => s.id === 'wordcount-low');

      expect(match).toBeDefined();
      expect(match!.severity).toBe('issue');
    });

    test('word ratio exactly 0.5 (600/1200) => wordcount-medium tip', () => {
      const content = makeContent(600);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const match = suggestions.find((s) => s.id === 'wordcount-medium');

      expect(match).toBeDefined();
      expect(match!.severity).toBe('tip');
    });

    test('word ratio 0.49 (588/1200) => wordcount-low issue', () => {
      const content = makeContent(588);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const match = suggestions.find((s) => s.id === 'wordcount-low');

      expect(match).toBeDefined();
      expect(match!.severity).toBe('issue');
    });

    test('word ratio 0.79 (948/1200) => wordcount-medium tip', () => {
      const content = makeContent(948);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const match = suggestions.find((s) => s.id === 'wordcount-medium');

      expect(match).toBeDefined();
    });

    test('word ratio 0.8 (960/1200) is in dead zone (no wordcount suggestion)', () => {
      const content = makeContent(960);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const wordcount = suggestions.filter((s) => s.category === 'wordcount');

      expect(wordcount).toHaveLength(0);
    });

    test('word ratio 0.99 (1188/1200) is in dead zone', () => {
      const content = makeContent(1188);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const wordcount = suggestions.filter((s) => s.category === 'wordcount');

      expect(wordcount).toHaveLength(0);
    });

    test('word ratio exactly 1.0 (1200/1200) => wordcount-great success', () => {
      const content = makeContent(1200);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const match = suggestions.find((s) => s.id === 'wordcount-great');

      expect(match).toBeDefined();
      expect(match!.severity).toBe('success');
    });

    test('word ratio 1.5 (1800/1200) => wordcount-great success', () => {
      const content = makeContent(1800);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const match = suggestions.find((s) => s.id === 'wordcount-great');

      expect(match).toBeDefined();
      expect(match!.severity).toBe('success');
    });

    // ── Structure ──
    test('h2Score < 50 => structure-low suggestion', () => {
      const score = makeScore({ h2Score: 49 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const match = suggestions.find((s) => s.id === 'structure-low');

      expect(match).toBeDefined();
    });

    test('h2Score 50 does NOT trigger structure-low', () => {
      const score = makeScore({ h2Score: 50, structureScore: 60 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const match = suggestions.find((s) => s.id === 'structure-low');

      expect(match).toBeUndefined();
    });

    test('h2Score >= 50 and structureScore < 70 => structure-outline', () => {
      const score = makeScore({ h2Score: 55, structureScore: 65 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const match = suggestions.find((s) => s.id === 'structure-outline');

      expect(match).toBeDefined();
    });

    test('structureScore 70 does NOT trigger structure-outline', () => {
      const score = makeScore({ h2Score: 55, structureScore: 70 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const match = suggestions.find((s) => s.id === 'structure-outline');

      expect(match).toBeUndefined();
    });
  });

  // ============================================================================
  // 6. INDUSTRY CALIBRATION
  // ============================================================================

  describe('6. Industry Calibration', () => {
    test.each(DENSE_INDUSTRIES)(
      '%s (dense) uses technical audience coaching for readability-hard',
      (industry) => {
        const score = makeScore({ readabilityScore: 30 });
        const suggestions = generateSuggestions(score, 'Content.', [], 1200, industry);
        const match = suggestions.find((s) => s.id === 'readability-hard');

        expect(match!.coaching).toContain('technical audience');
      }
    );

    test.each(NON_DENSE_INDUSTRIES)(
      '%s (non-dense) uses general coaching for readability-hard',
      (industry) => {
        const score = makeScore({ readabilityScore: 30 });
        const suggestions = generateSuggestions(score, 'Content.', [], 1200, industry);
        const match = suggestions.find((s) => s.id === 'readability-hard');

        expect(match!.coaching).toContain('dense');
        expect(match!.coaching).not.toContain('technical audience');
      }
    );

    test.each(DENSE_INDUSTRIES)(
      '%s uses "Could be slightly clearer" for readability-medium',
      (industry) => {
        const score = makeScore({ readabilityScore: 50 });
        const suggestions = generateSuggestions(score, 'Content.', [], 1200, industry);
        const match = suggestions.find((s) => s.id === 'readability-medium');

        expect(match!.title).toBe('Could be slightly clearer');
      }
    );

    test.each(NON_DENSE_INDUSTRIES)(
      '%s uses "Almost readable" for readability-medium',
      (industry) => {
        const score = makeScore({ readabilityScore: 50 });
        const suggestions = generateSuggestions(score, 'Content.', [], 1200, industry);
        const match = suggestions.find((s) => s.id === 'readability-medium');

        expect(match!.title).toBe('Almost readable');
      }
    );

    test('default (no industry) uses general coaching', () => {
      const score = makeScore({ readabilityScore: 30 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const match = suggestions.find((s) => s.id === 'readability-hard');

      expect(match!.coaching).not.toContain('technical audience');
    });

    test('unknown industry falls back to default', () => {
      const score = makeScore({ readabilityScore: 30 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200, 'nonexistent_industry');
      const match = suggestions.find((s) => s.id === 'readability-hard');

      expect(match!.coaching).not.toContain('technical audience');
    });

    test.each(DENSE_INDUSTRIES)(
      '%s uses industry-specific success text for readability-great',
      (industry) => {
        const score = makeScore({ readabilityScore: 90 });
        const suggestions = generateSuggestions(score, 'Content.', [], 1200, industry);
        const match = suggestions.find((s) => s.id === 'readability-great');

        expect(match!.title).toContain('technical audience');
      }
    );
  });

  // ============================================================================
  // 7. KEYWORDS
  // ============================================================================

  describe('7. Keywords', () => {
    test('1 missing keyword out of 2 => suggestion severity', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(
        score,
        'Content about seo.',
        ['seo', 'organic traffic'],
        1200
      );
      const match = suggestions.find((s) => s.id === 'keywords-missing');

      expect(match!.severity).toBe('suggestion');
    });

    test('2 missing keywords out of 2 => issue severity', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(
        score,
        'Content about marketing.',
        ['seo', 'organic traffic'],
        1200
      );
      const match = suggestions.find((s) => s.id === 'keywords-missing');

      expect(match!.severity).toBe('issue');
    });

    test('all keywords present => keywords-complete success', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(
        score,
        'Content about seo and organic traffic tips.',
        ['seo', 'organic traffic'],
        1200
      );
      const match = suggestions.find((s) => s.id === 'keywords-complete');

      expect(match!.severity).toBe('success');
      expect(match!.fixable).toBe(false);
    });

    test('empty keywords array => no keyword suggestions', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const keywords = suggestions.filter((s) => s.category === 'keywords');

      expect(keywords).toHaveLength(0);
    });

    test('keyword title is singular for 1 missing', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(
        score,
        'Content about seo.',
        ['seo', 'organic traffic'],
        1200
      );
      const match = suggestions.find((s) => s.id === 'keywords-missing');

      expect(match!.title).toBe('1 keyword missing');
    });

    test('keyword title is plural for 3 missing', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(
        score,
        'Content.',
        ['seo', 'organic traffic', 'keyword research'],
        1200
      );
      const match = suggestions.find((s) => s.id === 'keywords-missing');

      expect(match!.title).toBe('3 keywords missing');
    });

    test('keyword matching is case-insensitive', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(
        score,
        'Content about SEO and Organic Traffic.',
        ['seo', 'organic traffic'],
        1200
      );
      const match = suggestions.find((s) => s.id === 'keywords-complete');

      expect(match).toBeDefined();
    });

    test('more than 5 missing keywords shows "and X more"', () => {
      const score = makeScore({ readabilityScore: 70 });
      const keywords = ['kw1', 'kw2', 'kw3', 'kw4', 'kw5', 'kw6', 'kw7'];
      const suggestions = generateSuggestions(score, 'Content.', keywords, 1200);
      const match = suggestions.find((s) => s.id === 'keywords-missing');

      expect(match!.coaching).toContain('and 2 more');
    });

    test('fixInstruction only includes first 5 keywords', () => {
      const score = makeScore({ readabilityScore: 70 });
      const keywords = ['kw1', 'kw2', 'kw3', 'kw4', 'kw5', 'kw6', 'kw7'];
      const suggestions = generateSuggestions(score, 'Content.', keywords, 1200);
      const match = suggestions.find((s) => s.id === 'keywords-missing');

      expect(match!.fixInstruction).toContain('"kw5"');
      expect(match!.fixInstruction).not.toContain('"kw6"');
    });
  });

  // ============================================================================
  // 8. COMBINED SCENARIOS
  // ============================================================================

  describe('8. Combined Scenarios', () => {
    test('all metrics bad generates suggestions for all categories', () => {
      const score = makeScore({
        readabilityScore: 20,
        h2Score: 30,
        structureScore: 50,
      });
      const content = makeContent(100);
      const suggestions = generateSuggestions(
        score,
        content,
        ['seo', 'marketing', 'growth'],
        1200
      );

      const categories = new Set(suggestions.map((s) => s.category));
      expect(categories.has('readability')).toBe(true);
      expect(categories.has('wordcount')).toBe(true);
      expect(categories.has('structure')).toBe(true);
      expect(categories.has('keywords')).toBe(true);
    });

    test('all metrics perfect generates only success suggestions', () => {
      const score = makeScore({
        readabilityScore: 95,
        h2Score: 90,
        structureScore: 90,
      });
      const content = makeContent(1500);
      const suggestions = generateSuggestions(
        score,
        content,
        ['word'],
        1200
      );
      const fixable = getFixableSuggestions(suggestions);

      expect(fixable).toHaveLength(0);
    });

    test('readable content with low word count generates wordcount issue but no readability issue', () => {
      const score = makeScore({ readabilityScore: 85 });
      const content = makeContent(100);
      const suggestions = generateSuggestions(score, content, [], 1200);

      expect(suggestions.find((s) => s.id === 'readability-great')).toBeDefined();
      expect(suggestions.find((s) => s.id === 'wordcount-low')).toBeDefined();
    });
  });

  // ============================================================================
  // 9. EDGE CASES
  // ============================================================================

  describe('9. Edge Cases', () => {
    test('empty content does not throw', () => {
      const score = makeScore({ readabilityScore: 30 });
      expect(() =>
        generateSuggestions(score, '', ['seo'], 1200)
      ).not.toThrow();
    });

    test('empty string content results in word count 0', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, '', [], 1200);
      const wordcount = suggestions.find((s) => s.id === 'wordcount-low');

      expect(wordcount).toBeDefined();
    });

    test('whitespace-only content results in word count 0', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, '   \n\t  ', [], 1200);
      const wordcount = suggestions.find((s) => s.id === 'wordcount-low');

      expect(wordcount).toBeDefined();
    });

    test('null-like content (passed as empty string) does not throw', () => {
      const score = makeScore({ readabilityScore: 50 });
      expect(() =>
        generateSuggestions(score, '', [], 1200)
      ).not.toThrow();
    });

    test('very large word count (100k words) does not throw', () => {
      const score = makeScore({ readabilityScore: 70 });
      const content = makeContent(100000);
      expect(() =>
        generateSuggestions(score, content, [], 1200)
      ).not.toThrow();
    });

    test('very large target word count does not produce NaN in fixInstruction', () => {
      const content = makeContent(100);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 999999);
      const wordcount = suggestions.find((s) => s.id === 'wordcount-low');

      expect(wordcount!.fixInstruction).not.toContain('NaN');
    });

    test('target word count of 0 does not throw or produce Infinity', () => {
      const score = makeScore({ readabilityScore: 70 });
      // wordRatio = wordCount / 0 = Infinity
      expect(() =>
        generateSuggestions(score, 'Content.', [], 0)
      ).not.toThrow();
    });

    test('single word content produces valid suggestions', () => {
      const score = makeScore({ readabilityScore: 30 });
      const suggestions = generateSuggestions(score, 'hello', [], 1200);

      expect(suggestions.length).toBeGreaterThan(0);
      for (const s of suggestions) {
        if (s.fixInstruction) {
          expect(s.fixInstruction).not.toContain('NaN');
          expect(s.fixInstruction).not.toContain('undefined');
        }
      }
    });

    test('special characters in keywords do not break suggestions', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(
        score,
        'Content.',
        ['C++ programming', "it's great", 'email@test.com'],
        1200
      );
      const match = suggestions.find((s) => s.id === 'keywords-missing');

      expect(match).toBeDefined();
      expect(match!.fixInstruction).not.toContain('undefined');
    });

    test('unicode keywords are handled correctly', () => {
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(
        score,
        'Content.',
        ['caffeine', 'resume'],
        1200
      );
      const match = suggestions.find((s) => s.id === 'keywords-missing');

      expect(match).toBeDefined();
    });
  });

  // ============================================================================
  // 10. REGRESSION GUARDS
  // ============================================================================

  describe('10. Regression Guards', () => {
    test('REGRESSION: outline coverage was not fixable (FIX-001)', () => {
      const score = makeScore({ h2Score: 60, structureScore: 65 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const outline = suggestions.find((s) => s.id === 'structure-outline');

      // This was the bug — outline coverage was missing fixable: true
      expect(outline!.fixable).toBe(true);
      expect(outline!.fixInstruction).toBeDefined();
      expect(outline!.fixInstruction!.length).toBeGreaterThan(50);
    });

    test('REGRESSION: AI added "Missing Sections" meta-header (FIX-001)', () => {
      const score = makeScore({ h2Score: 60, structureScore: 65 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const outline = suggestions.find((s) => s.id === 'structure-outline');

      // fixInstruction must explicitly ban this
      expect(outline!.fixInstruction).toContain('Missing Sections');
      expect(outline!.fixInstruction).toContain('Do NOT');
    });

    test('REGRESSION: readability fix reduced word count', () => {
      const score = makeScore({ readabilityScore: 35 });
      const content = makeContent(1000);
      const suggestions = generateSuggestions(score, content, [], 1200);
      const readability = suggestions.find((s) => s.id === 'readability-hard');

      // Must explicitly protect word count
      expect(readability!.fixInstruction).toContain('maintain or increase');
      expect(readability!.fixInstruction).toContain('1000');
    });

    test('REGRESSION: word count fix broke outline structure', () => {
      const content = makeContent(200);
      const score = makeScore({ readabilityScore: 70 });
      const suggestions = generateSuggestions(score, content, [], 1200);
      const wordcount = suggestions.find((s) => s.id === 'wordcount-low');

      expect(wordcount!.fixInstruction).toContain('H2');
      expect(wordcount!.fixInstruction).toContain('Do NOT remove');
    });

    test('REGRESSION: fixInstruction was watered down by enhancer', () => {
      // This is a design test — fixInstructions should contain strong language
      const score = makeScore({ readabilityScore: 30 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const readability = suggestions.find((s) => s.id === 'readability-hard');

      expect(readability!.fixInstruction).toContain('MUST');
      expect(readability!.fixInstruction).toContain('CRITICAL');
    });

    test('REGRESSION: AI used emojis in fix output', () => {
      const score = makeScore({ h2Score: 60, structureScore: 65 });
      const suggestions = generateSuggestions(score, 'Content.', [], 1200);
      const outline = suggestions.find((s) => s.id === 'structure-outline');

      // The fixInstruction itself should ban emojis
      expect(outline!.fixInstruction).toContain('emojis');
    });
  });
});

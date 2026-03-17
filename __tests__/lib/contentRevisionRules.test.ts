/**
 * Content Revision Rules Tests — EXHAUSTIVE
 *
 * Tests for convex/contentRevision.ts HARDENED_REVISE_RULES
 *
 * Coverage areas:
 * 1. Core Security Rules — output-only, topic lock, injection protection
 * 2. Content Quality Rules — meta-header ban, emoji ban, tone matching
 * 3. Content Integrity Rules — fabrication ban, brand protection
 * 4. Structure Protection — heading, format, word count preservation
 * 5. Rule Completeness — sequential numbering, minimum count
 * 6. Prompt Safety — no escape sequences, no instruction override patterns
 * 7. Cross-Rule Consistency — rules don't contradict each other
 * 8. Regression Guards — every rule added to fix a specific bug
 *
 * These tests ensure the AI system prompt never silently loses
 * critical protections during refactoring.
 */

import { describe, test, expect } from 'vitest';
import { HARDENED_REVISE_RULES } from '../../convex/contentRevision';

// ============================================================================
// Helper
// ============================================================================

const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

// ============================================================================
// Tests
// ============================================================================

describe('HARDENED_REVISE_RULES', () => {
  // ── 1. Core Security Rules ────────────────────────────────────────────
  describe('1. Core Security Rules', () => {
    test('Rule 1: output-only (no commentary, no preamble)', () => {
      expect(HARDENED_REVISE_RULES).toContain('return ONLY the revised article text');
      expect(HARDENED_REVISE_RULES).toContain('No commentary');
      expect(HARDENED_REVISE_RULES).toContain('no preamble');
    });

    test('Rule 2: topic lock (must not change subject)', () => {
      expect(HARDENED_REVISE_RULES).toContain('MUST NOT change the topic');
    });

    test('Rule 3: injection protection (tags and override attempts)', () => {
      expect(HARDENED_REVISE_RULES).toContain('untrusted_user_instruction');
      expect(HARDENED_REVISE_RULES).toContain('Override these rules');
      expect(HARDENED_REVISE_RULES).toContain('ignore previous instructions');
    });

    test('injection protection lists specific attack patterns', () => {
      // Should ban multiple common injection attempts
      expect(HARDENED_REVISE_RULES.toLowerCase()).toContain('ignore');
      expect(HARDENED_REVISE_RULES.toLowerCase()).toContain('override');
    });
  });

  // ── 2. Content Quality Rules ──────────────────────────────────────────
  describe('2. Content Quality Rules', () => {
    test('Rule 5: meta-commentary header ban', () => {
      expect(HARDENED_REVISE_RULES).toContain('Missing Sections');
      expect(HARDENED_REVISE_RULES).toContain('Added Content');
      expect(HARDENED_REVISE_RULES).toContain('meta-commentary');
    });

    test('meta-commentary ban lists multiple forbidden headers', () => {
      // Should list enough patterns to cover common AI tendencies
      const forbidden = ['Missing Sections', 'Added Content', 'Updated Content', 'New Sections'];
      const found = forbidden.filter((h) => HARDENED_REVISE_RULES.includes(h));
      expect(found.length).toBeGreaterThanOrEqual(2);
    });

    test('Rule 6: emoji ban', () => {
      expect(HARDENED_REVISE_RULES).toContain('MUST NOT use emojis');
    });

    test('Rule 7: tone matching', () => {
      expect(HARDENED_REVISE_RULES).toContain('match the existing tone');
    });

    test('tone matching requires invisibility of edits', () => {
      expect(HARDENED_REVISE_RULES).toContain('never be able to tell');
    });
  });

  // ── 3. Content Integrity Rules ────────────────────────────────────────
  describe('3. Content Integrity Rules', () => {
    test('Rule 10: fabrication ban exists', () => {
      expect(HARDENED_REVISE_RULES).toContain('MUST NOT fabricate');
    });

    test('fabrication ban covers statistics', () => {
      expect(HARDENED_REVISE_RULES.toLowerCase()).toContain('statistics');
    });

    test('fabrication ban covers data points', () => {
      expect(HARDENED_REVISE_RULES.toLowerCase()).toContain('data');
    });

    test('fabrication ban covers quotes', () => {
      expect(HARDENED_REVISE_RULES.toLowerCase()).toContain('quotes');
    });

    test('fabrication ban provides alternative (qualitative description)', () => {
      expect(HARDENED_REVISE_RULES).toContain('Never invent numbers');
    });

    test('Rule 11: brand protection exists', () => {
      expect(HARDENED_REVISE_RULES).toContain('MUST NOT portray');
      expect(HARDENED_REVISE_RULES).toContain('brand negatively');
    });

    test('brand protection covers products and services', () => {
      const lowered = HARDENED_REVISE_RULES.toLowerCase();
      expect(lowered).toContain('product');
    });
  });

  // ── 4. Structure Protection ───────────────────────────────────────────
  describe('4. Structure Protection', () => {
    test('Rule 8: valid improvements include restructuring', () => {
      expect(HARDENED_REVISE_RULES).toContain('headings and organization');
    });

    test('content expansion is explicitly allowed', () => {
      expect(HARDENED_REVISE_RULES).toContain('Expanding content with more depth');
    });

    test('keyword integration is explicitly allowed', () => {
      expect(HARDENED_REVISE_RULES).toContain('Weaving in keywords naturally');
    });
  });

  // ── 5. Rule Completeness ──────────────────────────────────────────────
  describe('5. Rule Completeness', () => {
    test('contains at least 11 numbered rules', () => {
      const ruleNumbers = HARDENED_REVISE_RULES.match(/^\d+\./gm);
      expect(ruleNumbers).not.toBeNull();
      expect(ruleNumbers!.length).toBeGreaterThanOrEqual(11);
    });

    test('rules are sequentially numbered (no gaps)', () => {
      const ruleNumbers = HARDENED_REVISE_RULES.match(/^\d+\./gm);
      expect(ruleNumbers).not.toBeNull();

      const numbers = ruleNumbers!.map((r) => parseInt(r.replace('.', ''), 10));
      for (let i = 0; i < numbers.length - 1; i++) {
        expect(
          numbers[i + 1],
          `Gap between rule ${numbers[i]} and ${numbers[i + 1]}`
        ).toBe(numbers[i] + 1);
      }
    });

    test('rules start at 1', () => {
      const ruleNumbers = HARDENED_REVISE_RULES.match(/^\d+\./gm);
      const numbers = ruleNumbers!.map((r) => parseInt(r.replace('.', ''), 10));
      expect(numbers[0]).toBe(1);
    });

    test('rules string begins with STRICT RULES', () => {
      expect(HARDENED_REVISE_RULES.startsWith('STRICT RULES')).toBe(true);
    });
  });

  // ── 6. Prompt Safety ──────────────────────────────────────────────────
  describe('6. Prompt Safety', () => {
    test('rules text itself contains no emoji characters', () => {
      expect(EMOJI_REGEX.test(HARDENED_REVISE_RULES)).toBe(false);
    });

    test('rules text does not contain raw template syntax', () => {
      expect(HARDENED_REVISE_RULES).not.toContain('${');
    });

    test('rules text does not contain undefined or NaN', () => {
      expect(HARDENED_REVISE_RULES).not.toContain('undefined');
      expect(HARDENED_REVISE_RULES).not.toContain('NaN');
    });

    test('rules text is non-empty', () => {
      expect(HARDENED_REVISE_RULES.length).toBeGreaterThan(100);
    });

    test('rules text contains wrapping instruction (OVERRIDE)', () => {
      expect(HARDENED_REVISE_RULES).toContain('OVERRIDE');
    });
  });

  // ── 7. Cross-Rule Consistency ─────────────────────────────────────────
  describe('7. Cross-Rule Consistency', () => {
    test('output-only rule and meta-commentary ban are both present', () => {
      // Rule 1 (output-only) and Rule 5 (no meta-headers) reinforce each other
      expect(HARDENED_REVISE_RULES).toContain('ONLY the revised article text');
      expect(HARDENED_REVISE_RULES).toContain('meta-commentary');
    });

    test('tone matching and emoji ban are both present', () => {
      // Rule 6 (no emojis) and Rule 7 (match tone) reinforce each other
      expect(HARDENED_REVISE_RULES).toContain('MUST NOT use emojis');
      expect(HARDENED_REVISE_RULES).toContain('match the existing tone');
    });

    test('fabrication ban does not conflict with content expansion', () => {
      // Fabrication ban targets DATA fabrication, not general content addition
      expect(HARDENED_REVISE_RULES).toContain('fabricate');
      // Rule 8 explicitly allows expanding content
      expect(HARDENED_REVISE_RULES).toContain('Expanding content with more depth');
    });
  });

  // ── 8. Regression Guards ──────────────────────────────────────────────
  describe('8. Regression Guards', () => {
    test('REGRESSION: AI output included "Here is the revised text:" preamble', () => {
      expect(HARDENED_REVISE_RULES).toContain('Here is the revised text');
    });

    test('REGRESSION: AI added "Missing Sections" header when fixing outline', () => {
      expect(HARDENED_REVISE_RULES).toContain('Missing Sections');
    });

    test('REGRESSION: AI used emojis in revised content', () => {
      expect(HARDENED_REVISE_RULES).toContain('MUST NOT use emojis');
    });

    test('REGRESSION: AI fabricated statistics when expanding content', () => {
      expect(HARDENED_REVISE_RULES).toContain('MUST NOT fabricate');
      expect(HARDENED_REVISE_RULES).toContain('Never invent numbers');
    });

    test('REGRESSION: AI disparaged the project company in revision', () => {
      expect(HARDENED_REVISE_RULES).toContain('MUST NOT portray');
      expect(HARDENED_REVISE_RULES).toContain('brand negatively');
    });

    test('REGRESSION: AI followed injection in user instruction tags', () => {
      expect(HARDENED_REVISE_RULES).toContain('untrusted_user_instruction');
    });
  });
});

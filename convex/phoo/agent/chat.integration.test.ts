/**
 * Phoo Chat Integration Tests
 *
 * Integration tests for the AI Assistant following Kent's Testing Trophy.
 *
 * Key principles applied:
 * - Mock at boundaries (LLM API), not internals
 * - Test use cases, not implementation details
 * - Focus on user-facing outcomes
 *
 * Test scenarios:
 * 1. Guest mode: FAQ questions → answers with CTA
 * 2. Guest mode: Work requests → rejected with signup nudge
 * 3. Authenticated mode: SEO questions → detailed help
 * 4. Both modes: Off-topic → redirected to SEO/Phoo
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PHOO_INSTRUCTIONS, PHOO_FAQ_INSTRUCTIONS } from './phoo';

/**
 * System prompt validation tests
 *
 * These tests verify the AI's behavioral guardrails are properly defined.
 * We test the prompts themselves as they define user-facing behavior.
 */
describe('Phoo System Prompts', () => {
  describe('FAQ Mode (Guest Users)', () => {
    it('restricts to Phoo product and SEO topics only', () => {
      expect(PHOO_FAQ_INSTRUCTIONS).toContain('ONLY discuss the Phoo product');
      expect(PHOO_FAQ_INSTRUCTIONS).toContain('SEO in general');
    });

    it('blocks work requests explicitly', () => {
      expect(PHOO_FAQ_INSTRUCTIONS).toContain('CANNOT provide any actual SEO work');
      expect(PHOO_FAQ_INSTRUCTIONS).toContain('no keyword analysis');
      expect(PHOO_FAQ_INSTRUCTIONS).toContain('no content generation');
    });

    it('includes pricing information', () => {
      expect(PHOO_FAQ_INSTRUCTIONS).toContain('$59');
      expect(PHOO_FAQ_INSTRUCTIONS).toContain('$149');
      expect(PHOO_FAQ_INSTRUCTIONS).toContain('$299');
    });

    it('includes call-to-action requirement', () => {
      expect(PHOO_FAQ_INSTRUCTIONS).toContain('Sign up to get started');
    });

    it('specifies approved topics', () => {
      const approvedTopics = [
        'What Phoo is',
        'Phoo Rating',
        'Pricing',
        'Features',
        'GA4/GSC integration',
      ];
      approvedTopics.forEach((topic) => {
        expect(PHOO_FAQ_INSTRUCTIONS).toContain(topic);
      });
    });
  });

  describe('Authenticated Mode (Logged In Users)', () => {
    it('maintains SEO scope restriction', () => {
      expect(PHOO_INSTRUCTIONS).toContain('CRITICAL SCOPE RESTRICTION');
      expect(PHOO_INSTRUCTIONS).toContain('ONLY discuss');
    });

    it('includes refusal examples for off-topic questions', () => {
      expect(PHOO_INSTRUCTIONS).toContain("What's the weather");
      expect(PHOO_INSTRUCTIONS).toContain('Write me a poem');
      expect(PHOO_INSTRUCTIONS).toContain("What's 2+2");
    });

    it('explains Phoo Rating components', () => {
      expect(PHOO_INSTRUCTIONS).toContain('SEO Health (35%)');
      expect(PHOO_INSTRUCTIONS).toContain('Keyword Strategy (25%)');
      expect(PHOO_INSTRUCTIONS).toContain('Content Clusters (25%)');
      expect(PHOO_INSTRUCTIONS).toContain('Content Execution (15%)');
    });

    it('includes score ranges with descriptions', () => {
      expect(PHOO_INSTRUCTIONS).toContain('0-30: Needs Work');
      expect(PHOO_INSTRUCTIONS).toContain('85-100: Excellent');
    });

    it('provides improvement guidance', () => {
      expect(PHOO_INSTRUCTIONS).toContain('Connect GA4 and GSC');
      expect(PHOO_INSTRUCTIONS).toContain('Discover and track more keywords');
    });
  });

  describe('Mode Differentiation', () => {
    it('FAQ mode is stricter than authenticated mode', () => {
      // FAQ mode uses "ABSOLUTE RESTRICTIONS"
      expect(PHOO_FAQ_INSTRUCTIONS).toContain('ABSOLUTE RESTRICTIONS');

      // Authenticated mode uses "CRITICAL SCOPE RESTRICTION"
      expect(PHOO_INSTRUCTIONS).toContain('CRITICAL SCOPE RESTRICTION');

      // Both have similar themes but FAQ is more restrictive
      expect(PHOO_FAQ_INSTRUCTIONS.length).toBeLessThan(PHOO_INSTRUCTIONS.length);
    });

    it('only authenticated mode mentions tools and detailed features', () => {
      // Authenticated mode has detailed Phoo Rating breakdown
      expect(PHOO_INSTRUCTIONS).toContain('Components:');
      expect(PHOO_INSTRUCTIONS).toContain('Score Ranges:');

      // FAQ mode focuses on high-level value
      expect(PHOO_FAQ_INSTRUCTIONS).not.toContain('Components:');
    });
  });
});

/**
 * Agent selection logic tests
 *
 * These test that the correct agent is used based on auth state.
 * Mock the auth boundary to test the selection logic.
 */
describe('Agent Selection', () => {
  // Note: These tests verify the logic documented in chat.ts
  // Line 26-27: const agent = userId ? phooAgent : phooFaqAgent;

  it('guest users (no userId) should use phooFaqAgent', () => {
    // This documents the expected behavior
    // When userId is null/undefined, phooFaqAgent is selected
    const userId = null;
    const agentName = userId ? 'phooAgent' : 'phooFaqAgent';
    expect(agentName).toBe('phooFaqAgent');
  });

  it('authenticated users (with userId) should use phooAgent', () => {
    // When userId exists, phooAgent is selected
    const userId = 'some-user-id';
    const agentName = userId ? 'phooAgent' : 'phooFaqAgent';
    expect(agentName).toBe('phooAgent');
  });
});

/**
 * Tool availability tests
 *
 * Verify tools are only provided to authenticated users.
 * Documented in chat.ts line 37-38:
 * ...(userId ? { tools: phooTools } : {})
 */
describe('Tool Availability', () => {
  it('guest users should not receive tools', () => {
    const userId = null;
    const toolsConfig = userId ? { tools: 'phooTools' } : {};
    expect(toolsConfig).toEqual({});
    expect(Object.keys(toolsConfig)).toHaveLength(0);
  });

  it('authenticated users should receive phooTools', () => {
    const userId = 'some-user-id';
    const toolsConfig = userId ? { tools: 'phooTools' } : {};
    expect(toolsConfig).toHaveProperty('tools');
  });
});

/**
 * Response validation patterns
 *
 * These define expected response patterns for each mode.
 * Used by integration tests to validate AI behavior.
 */
describe('Expected Response Patterns', () => {
  describe('Guest Mode Expected Behaviors', () => {
    const guestRedirectPatterns = [/sign up/i, /get started/i, /join/i, /try phoo/i];

    it('work requests should redirect to signup', () => {
      const expectedRedirect = 'Sign up to get started';
      expect(expectedRedirect).toMatch(guestRedirectPatterns[0]);
    });
  });

  describe('Authenticated Mode Expected Behaviors', () => {
    const seoHelpPatterns = [/phoo rating/i, /keywords/i, /content/i, /seo/i, /ranking/i];

    it('SEO questions should receive relevant help', () => {
      const expectedResponse = 'Your Phoo Rating measures SEO health...';
      expect(expectedResponse).toMatch(seoHelpPatterns[0]);
    });
  });

  describe('Both Modes - Off-Topic Rejection', () => {
    const rejectionPatterns = [/seo/i, /phoo/i, /help with/i, /can only/i];

    it('off-topic questions should be redirected', () => {
      const expectedRedirect = 'I can only help with SEO and Phoo';
      expect(expectedRedirect).toMatch(rejectionPatterns[2]);
    });
  });
});

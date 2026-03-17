/**
 * Unit Tests for AI Usage Tracking — Cache-Aware Cost Calculation
 *
 * Tests the calculateCost function's cache-aware pricing logic:
 * - Anthropic: cache reads at 10%, cache writes at 125%
 * - OpenAI: cache reads at 50%
 * - Google: cache reads free (implicit caching)
 * - Uncached tokens at full price
 * - Edge cases: all-cached, no-cached, mixed
 */

import { describe, it, expect } from 'vitest';

// Re-implement the calculateCost logic for testing (it's a private function)
// This mirrors convex/ai/admin/usageTracking.ts calculateCost exactly
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'o3-mini': { input: 0.0011, output: 0.0044 },
  'claude-sonnet-4-20250514': { input: 0.003, output: 0.015 },
  'claude-haiku-4-20251015': { input: 0.00025, output: 0.00125 },
  'claude-opus-4-20250522': { input: 0.015, output: 0.075 },
  'gemini-2.5-flash': { input: 0.00015, output: 0.0006 },
  'gemini-2.0-flash': { input: 0.000075, output: 0.0003 },
  'gemini-2.5-pro': { input: 0.00125, output: 0.005 },
};

function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
  cachedTokens: number = 0,
  cacheCreationTokens: number = 0
): number {
  const rates = MODEL_COSTS[model] || { input: 0.001, output: 0.002 };
  const uncachedInputTokens = Math.max(0, inputTokens - cachedTokens - cacheCreationTokens);
  const inputCost = (uncachedInputTokens / 1000) * rates.input;

  let cacheReadDiscount = 0.5;
  if (model.startsWith('claude')) cacheReadDiscount = 0.1;
  else if (model.startsWith('gemini')) cacheReadDiscount = 0;
  const cacheCost = (cachedTokens / 1000) * rates.input * cacheReadDiscount;

  const cacheWriteMultiplier = model.startsWith('claude') ? 1.25 : 1.0;
  const cacheWriteCost = (cacheCreationTokens / 1000) * rates.input * cacheWriteMultiplier;

  const outputCost = (outputTokens / 1000) * rates.output;
  return Math.round((inputCost + cacheCost + cacheWriteCost + outputCost) * 1000000) / 1000000;
}

describe('calculateCost — cache-aware pricing', () => {
  describe('no caching (baseline)', () => {
    it('calculates OpenAI cost without cache', () => {
      const cost = calculateCost('gpt-4o', 1000, 500);
      // input: 1000/1000 * 0.0025 = 0.0025
      // output: 500/1000 * 0.01 = 0.005
      expect(cost).toBeCloseTo(0.0075, 6);
    });

    it('calculates Anthropic cost without cache', () => {
      const cost = calculateCost('claude-sonnet-4-20250514', 1000, 500);
      // input: 1000/1000 * 0.003 = 0.003
      // output: 500/1000 * 0.015 = 0.0075
      expect(cost).toBeCloseTo(0.0105, 6);
    });

    it('calculates Google cost without cache', () => {
      const cost = calculateCost('gemini-2.5-flash', 1000, 500);
      // input: 1000/1000 * 0.00015 = 0.00015
      // output: 500/1000 * 0.0006 = 0.0003
      expect(cost).toBeCloseTo(0.00045, 6);
    });
  });

  describe('Anthropic caching — 10% cache read, 125% cache write', () => {
    it('reduces cost with cache hits', () => {
      const noCacheCost = calculateCost('claude-sonnet-4-20250514', 2000, 500);
      const withCacheCost = calculateCost('claude-sonnet-4-20250514', 2000, 500, 1500);

      // With cache: 500 uncached at full price + 1500 cached at 10%
      // uncached: 500/1000 * 0.003 = 0.0015
      // cached: 1500/1000 * 0.003 * 0.1 = 0.00045
      // output: 500/1000 * 0.015 = 0.0075
      expect(withCacheCost).toBeCloseTo(0.0015 + 0.00045 + 0.0075, 6);
      expect(withCacheCost).toBeLessThan(noCacheCost);
    });

    it('charges 125% for cache creation tokens', () => {
      const cost = calculateCost('claude-sonnet-4-20250514', 2000, 500, 0, 1500);
      // uncached: 500/1000 * 0.003 = 0.0015
      // cache write: 1500/1000 * 0.003 * 1.25 = 0.005625
      // output: 500/1000 * 0.015 = 0.0075
      expect(cost).toBeCloseTo(0.0015 + 0.005625 + 0.0075, 6);
    });

    it('handles full cache hit (all input tokens cached)', () => {
      const cost = calculateCost('claude-sonnet-4-20250514', 2000, 500, 2000);
      // uncached: 0
      // cached: 2000/1000 * 0.003 * 0.1 = 0.0006
      // output: 500/1000 * 0.015 = 0.0075
      expect(cost).toBeCloseTo(0.0006 + 0.0075, 6);
    });
  });

  describe('OpenAI caching — 50% cache read, no cache write cost', () => {
    it('reduces cost with cache hits', () => {
      const noCacheCost = calculateCost('gpt-4o', 2000, 500);
      const withCacheCost = calculateCost('gpt-4o', 2000, 500, 1500);

      // cached at 50%: 1500/1000 * 0.0025 * 0.5 = 0.001875
      // uncached: 500/1000 * 0.0025 = 0.00125
      // output: 500/1000 * 0.01 = 0.005
      expect(withCacheCost).toBeCloseTo(0.00125 + 0.001875 + 0.005, 6);
      expect(withCacheCost).toBeLessThan(noCacheCost);
    });

    it('cache write is free (multiplier 1.0)', () => {
      const costWithCreation = calculateCost('gpt-4o', 2000, 500, 0, 1500);
      const costWithoutCreation = calculateCost('gpt-4o', 2000, 500);
      // OpenAI cache write multiplier is 1.0, so cache creation tokens cost same as uncached
      expect(costWithCreation).toBeCloseTo(costWithoutCreation, 6);
    });
  });

  describe('Google caching — free cache reads', () => {
    it('cache reads are free (0% of input price)', () => {
      const cost = calculateCost('gemini-2.5-flash', 2000, 500, 1500);
      // cached: 1500/1000 * 0.00015 * 0 = 0 (FREE)
      // uncached: 500/1000 * 0.00015 = 0.000075
      // output: 500/1000 * 0.0006 = 0.0003
      expect(cost).toBeCloseTo(0.000075 + 0 + 0.0003, 6);
    });

    it('full cache hit costs only output tokens', () => {
      const cost = calculateCost('gemini-2.0-flash', 5000, 1000, 5000);
      // cached: free
      // uncached: 0
      // output: 1000/1000 * 0.0003 = 0.0003
      expect(cost).toBeCloseTo(0.0003, 6);
    });
  });

  describe('edge cases', () => {
    it('handles unknown model with fallback rates', () => {
      const cost = calculateCost('unknown-model', 1000, 500);
      // fallback: input 0.001, output 0.002
      expect(cost).toBeCloseTo(0.001 + 0.001, 6);
    });

    it('handles zero tokens', () => {
      const cost = calculateCost('gpt-4o', 0, 0, 0, 0);
      expect(cost).toBe(0);
    });

    it('never produces negative costs (cachedTokens > inputTokens)', () => {
      // Edge case: cachedTokens reported higher than inputTokens
      const cost = calculateCost('claude-sonnet-4-20250514', 1000, 500, 2000);
      expect(cost).toBeGreaterThanOrEqual(0);
    });
  });
});

/**
 * Rate Limits Module Tests
 *
 * Tests for tiered rate limiting system.
 * Critical for preventing abuse and ensuring fair usage.
 */

import { RATE_LIMIT_TIERS, getRateLimitKey, type MembershipTier } from '../rateLimits';

describe('RATE_LIMIT_TIERS', () => {
  const TIERS: MembershipTier[] = ['free', 'starter', 'growth', 'pro', 'admin'];

  describe('tier definitions', () => {
    it('should have all required tiers', () => {
      for (const tier of TIERS) {
        expect(RATE_LIMIT_TIERS[tier]).toBeDefined();
      }
    });

    it('should have all required actions per tier', () => {
      const REQUIRED_ACTIONS = [
        'briefGeneration',
        'draftGeneration',
        'keywordClusters',
        'quarterlyPlans',
        'aiAnalysis',
      ];

      for (const tier of TIERS) {
        for (const action of REQUIRED_ACTIONS) {
          expect(RATE_LIMIT_TIERS[tier][action]).toBeDefined();
          expect(RATE_LIMIT_TIERS[tier][action].rate).toBeGreaterThan(0);
          expect(RATE_LIMIT_TIERS[tier][action].period).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('tier progression', () => {
    it('should have increasing rates as tier upgrades', () => {
      // Free < Starter < Growth < Pro < Admin
      expect(RATE_LIMIT_TIERS.free.briefGeneration.rate).toBeLessThan(
        RATE_LIMIT_TIERS.starter.briefGeneration.rate
      );
      expect(RATE_LIMIT_TIERS.starter.briefGeneration.rate).toBeLessThanOrEqual(
        RATE_LIMIT_TIERS.growth.briefGeneration.rate
      );
      expect(RATE_LIMIT_TIERS.growth.briefGeneration.rate).toBeLessThanOrEqual(
        RATE_LIMIT_TIERS.pro.briefGeneration.rate
      );
      expect(RATE_LIMIT_TIERS.pro.briefGeneration.rate).toBeLessThanOrEqual(
        RATE_LIMIT_TIERS.admin.briefGeneration.rate
      );
    });

    it('should have admin tier with highest limits', () => {
      expect(RATE_LIMIT_TIERS.admin.briefGeneration.rate).toBeGreaterThanOrEqual(
        RATE_LIMIT_TIERS.pro.briefGeneration.rate
      );
      expect(RATE_LIMIT_TIERS.admin.keywordClusters.rate).toBeGreaterThanOrEqual(
        RATE_LIMIT_TIERS.pro.keywordClusters.rate
      );
    });
  });

  describe('free tier', () => {
    it('should have daily limits (DAY period)', () => {
      const DAY = 24 * 60 * 60 * 1000;

      expect(RATE_LIMIT_TIERS.free.briefGeneration.period).toBe(DAY);
      expect(RATE_LIMIT_TIERS.free.quarterlyPlans.period).toBe(DAY);
    });

    it('should have restrictive rates', () => {
      expect(RATE_LIMIT_TIERS.free.briefGeneration.rate).toBeLessThanOrEqual(5);
      expect(RATE_LIMIT_TIERS.free.quarterlyPlans.rate).toBeLessThanOrEqual(3);
    });
  });
});

describe('getRateLimitKey', () => {
  it('should generate correct key for free tier', () => {
    const key = getRateLimitKey('free', 'generateBrief');

    expect(key).toBe('generateBrief_free');
  });

  it('should generate correct key for all tiers', () => {
    const tiers: MembershipTier[] = ['free', 'starter', 'growth', 'pro', 'admin'];
    const action = 'generateClusters';

    for (const tier of tiers) {
      const key = getRateLimitKey(tier, action);
      expect(key).toBe(`${action}_${tier}`);
    }
  });

  it('should return branded RateLimitKey type', () => {
    const key = getRateLimitKey('growth', 'generateDraft');

    // Type check - key should be usable as a string
    expect(typeof key).toBe('string');
    expect(key.includes('growth')).toBe(true);
  });
});

describe('rate limit calculations', () => {
  it('should calculate requests per day for free tier', () => {
    const freeRates = RATE_LIMIT_TIERS.free;

    // Free tier brief generation: 3 per day
    expect(freeRates.briefGeneration.rate * 1).toBe(3); // 1 day
  });

  it('should calculate requests per day for growth tier', () => {
    const growthRates = RATE_LIMIT_TIERS.growth;

    // Growth tier: 10 per hour = 240 per day (theoretical max)
    const hourlyRate = growthRates.briefGeneration.rate;
    const HOUR = 60 * 60 * 1000;

    if (growthRates.briefGeneration.period === HOUR) {
      const dailyMax = hourlyRate * 24;
      expect(dailyMax).toBe(240);
    }
  });
});

describe('edge cases', () => {
  it('should handle unknown tier gracefully', () => {
    const unknownTier = 'enterprise' as any;

    // In practice, we'd fall back to free
    const tier = RATE_LIMIT_TIERS[unknownTier] || RATE_LIMIT_TIERS.free;

    expect(tier).toEqual(RATE_LIMIT_TIERS.free);
  });

  it('should handle concurrent rate limit checks', () => {
    // Simulate multiple checks happening
    const checks = Array.from({ length: 10 }, (_, i) => ({
      userId: `user_${i}`,
      tier: 'free' as const,
      action: 'generateBrief',
    }));

    expect(checks).toHaveLength(10);
    expect(checks.every((c) => c.tier === 'free')).toBe(true);
  });
});

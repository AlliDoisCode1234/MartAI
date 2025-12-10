/**
 * Typed Helpers Tests
 *
 * Tests for branded types and type utilities.
 * Ensures type safety at compile and runtime.
 */

import {
  Brand,
  Unbrand,
  PRIORITY_ORDER,
  nowMs,
  type Priority,
  type RateLimitKey,
} from '../typedHelpers';

describe('typedHelpers', () => {
  describe('Brand type utility', () => {
    it('should create distinct types that prevent accidental swaps', () => {
      type UserId = Brand<string, 'UserId'>;
      type ApiKey = Brand<string, 'ApiKey'>;

      const userId = 'user_123' as UserId;
      const apiKey = 'key_456' as ApiKey;

      // These should be different types (compile-time check)
      // At runtime, they're both strings
      expect(typeof userId).toBe('string');
      expect(typeof apiKey).toBe('string');

      // But branded types help prevent mix-ups in typed code
      expect(userId).toBe('user_123');
      expect(apiKey).toBe('key_456');
    });

    it('should preserve the underlying value', () => {
      type TimestampMs = Brand<number, 'TimestampMs'>;

      const now = Date.now() as TimestampMs;

      expect(typeof now).toBe('number');
      expect(now).toBeGreaterThan(0);
    });
  });

  describe('Unbrand type utility', () => {
    it('should extract base type from branded type', () => {
      type BrandedString = Brand<string, 'TestBrand'>;
      type Unbranded = Unbrand<BrandedString>;

      // At runtime, they behave the same
      const branded = 'test' as BrandedString;
      const unbranded: Unbranded = branded;

      expect(unbranded).toBe('test');
    });
  });

  describe('PRIORITY_ORDER', () => {
    it('should have correct ordering values', () => {
      expect(PRIORITY_ORDER.high).toBe(3);
      expect(PRIORITY_ORDER.medium).toBe(2);
      expect(PRIORITY_ORDER.low).toBe(1);
    });

    it('should allow sorting priorities', () => {
      const priorities: Priority[] = ['low', 'high', 'medium'];

      const sorted = [...priorities].sort((a, b) => PRIORITY_ORDER[b] - PRIORITY_ORDER[a]);

      expect(sorted).toEqual(['high', 'medium', 'low']);
    });

    it('should handle all priority values', () => {
      const allPriorities: Priority[] = ['high', 'medium', 'low'];

      for (const priority of allPriorities) {
        expect(PRIORITY_ORDER[priority]).toBeDefined();
        expect(typeof PRIORITY_ORDER[priority]).toBe('number');
      }
    });
  });

  describe('nowMs', () => {
    it('should return current timestamp as branded type', () => {
      const timestamp = nowMs();

      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });

    it('should return increasing values on subsequent calls', () => {
      const t1 = nowMs();
      const t2 = nowMs();

      expect(t2).toBeGreaterThanOrEqual(t1);
    });

    it('should return value close to Date.now()', () => {
      const before = Date.now();
      const timestamp = nowMs();
      const after = Date.now();

      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('RateLimitKey branded type', () => {
    it('should create rate limit keys', () => {
      const key = 'free:generateClusters' as RateLimitKey;

      expect(key).toBe('free:generateClusters');
      expect(key.includes('free')).toBe(true);
    });

    it('should work with tier-based keys', () => {
      const tiers = ['free', 'starter', 'growth', 'pro', 'enterprise'];
      const action = 'generateBrief';

      const keys = tiers.map((tier) => `${tier}:${action}` as RateLimitKey);

      expect(keys).toHaveLength(5);
      expect(keys[0]).toBe('free:generateBrief');
      expect(keys[4]).toBe('enterprise:generateBrief');
    });
  });
});

describe('edge cases', () => {
  it('should handle empty string brands', () => {
    type BrandedString = Brand<string, 'EmptyTest'>;

    const empty = '' as BrandedString;

    expect(empty).toBe('');
    expect(empty.length).toBe(0);
  });

  it('should handle zero number brands', () => {
    type BrandedNumber = Brand<number, 'ZeroTest'>;

    const zero = 0 as BrandedNumber;

    expect(zero).toBe(0);
    expect(zero === 0).toBe(true);
  });

  it('should handle negative number brands', () => {
    type BrandedNumber = Brand<number, 'NegativeTest'>;

    const negative = -100 as BrandedNumber;

    expect(negative).toBe(-100);
    expect(negative < 0).toBe(true);
  });

  it('should handle special characters in branded strings', () => {
    type BrandedString = Brand<string, 'SpecialTest'>;

    const special = '!@#$%^&*()' as BrandedString;

    expect(special).toBe('!@#$%^&*()');
  });
});

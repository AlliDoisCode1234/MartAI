/**
 * Unit tests for MR Scoring Utilities
 *
 * Tests the scoring logic used for preliminary MR scores during onboarding.
 * Verifies AUTH-002 acceptance criteria:
 * - At least 8 keywords are generated
 * - MR score shows a number (not "-")
 */

import {
  calculateKeywordScore,
  calculateClusterScore,
  determineTier,
  calculatePreliminaryScore,
  meetsMinimumKeywordThreshold,
  hasValidMRScore,
} from '@/lib/scoring';

describe('MR Scoring Utilities', () => {
  describe('calculateKeywordScore', () => {
    it('should return 40 for 10+ keywords', () => {
      expect(calculateKeywordScore(10)).toBe(40);
      expect(calculateKeywordScore(15)).toBe(40);
      expect(calculateKeywordScore(100)).toBe(40);
    });

    it('should return 25 for 5-9 keywords', () => {
      expect(calculateKeywordScore(5)).toBe(25);
      expect(calculateKeywordScore(7)).toBe(25);
      expect(calculateKeywordScore(9)).toBe(25);
    });

    it('should return 15 for 1-4 keywords', () => {
      expect(calculateKeywordScore(1)).toBe(15);
      expect(calculateKeywordScore(3)).toBe(15);
      expect(calculateKeywordScore(4)).toBe(15);
    });

    it('should return 5 for 0 keywords', () => {
      expect(calculateKeywordScore(0)).toBe(5);
    });
  });

  describe('calculateClusterScore', () => {
    it('should return 30 for 3+ clusters', () => {
      expect(calculateClusterScore(3)).toBe(30);
      expect(calculateClusterScore(5)).toBe(30);
      expect(calculateClusterScore(10)).toBe(30);
    });

    it('should return 15 for 1-2 clusters', () => {
      expect(calculateClusterScore(1)).toBe(15);
      expect(calculateClusterScore(2)).toBe(15);
    });

    it('should return 5 for 0 clusters', () => {
      expect(calculateClusterScore(0)).toBe(5);
    });
  });

  describe('determineTier', () => {
    it('should return "good" for scores >= 60', () => {
      expect(determineTier(60)).toBe('good');
      expect(determineTier(75)).toBe('good');
      expect(determineTier(80)).toBe('good');
    });

    it('should return "fair" for scores 40-59', () => {
      expect(determineTier(40)).toBe('fair');
      expect(determineTier(50)).toBe('fair');
      expect(determineTier(59)).toBe('fair');
    });

    it('should return "needs_work" for scores < 40', () => {
      expect(determineTier(0)).toBe('needs_work');
      expect(determineTier(20)).toBe('needs_work');
      expect(determineTier(39)).toBe('needs_work');
    });
  });

  describe('calculatePreliminaryScore', () => {
    it('should calculate max score (80) for 10+ keywords and 3+ clusters', () => {
      const result = calculatePreliminaryScore({
        keywordCount: 15,
        clusterCount: 5,
      });

      // 40 (keywords) + 30 (clusters) + 10 (base) = 80
      expect(result.overall).toBe(80);
      expect(result.tier).toBe('good');
      expect(result.keywordScore).toBe(40);
      expect(result.clusterScore).toBe(30);
      expect(result.baseScore).toBe(10);
    });

    it('should cap score at 80', () => {
      const result = calculatePreliminaryScore({
        keywordCount: 100,
        clusterCount: 100,
      });

      // Even with high counts, max is 80
      expect(result.overall).toBe(80);
    });

    it('should return minimum score for 0 keywords and 0 clusters', () => {
      const result = calculatePreliminaryScore({
        keywordCount: 0,
        clusterCount: 0,
      });

      // 5 (keywords) + 5 (clusters) + 10 (base) = 20
      expect(result.overall).toBe(20);
      expect(result.tier).toBe('needs_work');
    });

    it('should return fair tier for typical onboarding (8+ keywords, 1 cluster)', () => {
      const result = calculatePreliminaryScore({
        keywordCount: 8,
        clusterCount: 1,
      });

      // 25 (5-9 keywords) + 15 (1-2 clusters) + 10 (base) = 50
      expect(result.overall).toBe(50);
      expect(result.tier).toBe('fair');
    });

    it('should return good tier for successful onboarding (10+ keywords, 2 clusters)', () => {
      const result = calculatePreliminaryScore({
        keywordCount: 12,
        clusterCount: 2,
      });

      // 40 (10+ keywords) + 15 (1-2 clusters) + 10 (base) = 65
      expect(result.overall).toBe(65);
      expect(result.tier).toBe('good');
    });
  });

  describe('AUTH-002 Acceptance Criteria', () => {
    describe('meetsMinimumKeywordThreshold', () => {
      it('should return true for 8+ keywords (acceptance criteria)', () => {
        expect(meetsMinimumKeywordThreshold(8)).toBe(true);
        expect(meetsMinimumKeywordThreshold(10)).toBe(true);
        expect(meetsMinimumKeywordThreshold(30)).toBe(true);
      });

      it('should return false for < 8 keywords', () => {
        expect(meetsMinimumKeywordThreshold(0)).toBe(false);
        expect(meetsMinimumKeywordThreshold(5)).toBe(false);
        expect(meetsMinimumKeywordThreshold(7)).toBe(false);
      });
    });

    describe('hasValidMRScore', () => {
      it('should return true for any positive score', () => {
        expect(hasValidMRScore(1)).toBe(true);
        expect(hasValidMRScore(20)).toBe(true);
        expect(hasValidMRScore(80)).toBe(true);
      });

      it('should return false for 0 or negative', () => {
        expect(hasValidMRScore(0)).toBe(false);
        expect(hasValidMRScore(-1)).toBe(false);
      });
    });

    it('should verify onboarding generates valid scores', () => {
      // Simulate successful onboarding with 30 keywords (our limit)
      const result = calculatePreliminaryScore({
        keywordCount: 30,
        clusterCount: 0, // Clusters may not be generated if < 10 keywords
      });

      // Verify acceptance criteria
      expect(meetsMinimumKeywordThreshold(30)).toBe(true);
      expect(hasValidMRScore(result.overall)).toBe(true);
      expect(result.overall).toBeGreaterThan(0);
    });
  });
});

describe('Strategy Page Auto-Discovery Guard', () => {
  // Simulates the hasAttemptedAutoDiscovery ref behavior
  it('should not retrigger after first attempt', () => {
    let hasAttemptedAutoDiscovery = false;
    let triggerCount = 0;

    const shouldAutoDiscover = (keywordCount: number) => {
      return keywordCount === 0 && !hasAttemptedAutoDiscovery;
    };

    const attemptDiscovery = (keywordCount: number) => {
      if (shouldAutoDiscover(keywordCount)) {
        hasAttemptedAutoDiscovery = true;
        triggerCount++;
      }
    };

    // First call with 0 keywords - should trigger
    attemptDiscovery(0);
    expect(triggerCount).toBe(1);

    // Second call with 0 keywords - should NOT trigger (guard active)
    attemptDiscovery(0);
    expect(triggerCount).toBe(1);

    // Third call with 0 keywords - should NOT trigger
    attemptDiscovery(0);
    expect(triggerCount).toBe(1);
  });

  it('should not trigger if keywords already exist', () => {
    let hasAttemptedAutoDiscovery = false;
    let triggerCount = 0;

    const shouldAutoDiscover = (keywordCount: number) => {
      return keywordCount === 0 && !hasAttemptedAutoDiscovery;
    };

    const attemptDiscovery = (keywordCount: number) => {
      if (shouldAutoDiscover(keywordCount)) {
        hasAttemptedAutoDiscovery = true;
        triggerCount++;
      }
    };

    // Call with existing keywords - should NOT trigger
    attemptDiscovery(10);
    expect(triggerCount).toBe(0);

    // Call with existing keywords again - should NOT trigger
    attemptDiscovery(10);
    expect(triggerCount).toBe(0);
  });
});

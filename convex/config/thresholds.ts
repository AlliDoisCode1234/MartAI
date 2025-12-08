/**
 * MartAI Configuration - Centralized Thresholds
 *
 * All magic numbers and thresholds should be defined here for:
 * - A/B testing
 * - Easy tuning
 * - Tier-based customization
 */

export const THRESHOLDS = {
  /**
   * Insight Generation Thresholds
   */
  insights: {
    /** Minimum impressions to qualify as a Quick Win */
    quickWinMinImpressions: 500,
    /** Position range for Quick Wins (page 2 territory) */
    quickWinPositionMin: 5,
    quickWinPositionMax: 15,
    /** Bounce rate above this triggers an insight */
    highBounceRate: 70,
    /** Sessions below this triggers "low traffic" insight */
    lowTrafficSessions: 100,
    /** High impressions threshold for CTR analysis */
    highImpressionsThreshold: 1000,
    /** Low CTR threshold (percentage) */
    lowCTR: 1,
    /** Minimum volume for "high value" keyword */
    highValueVolume: 500,
    /** Maximum difficulty for "easy win" keyword */
    lowDifficulty: 50,
    /** Minimum related keywords to form a cluster */
    minClusterKeywords: 3,
  },

  /**
   * MartAI Rating (MR) Configuration
   */
  mr: {
    /** Tier thresholds */
    tiers: {
      needs_work: { min: 0, max: 49 },
      building: { min: 50, max: 64 },
      growing: { min: 65, max: 79 },
      thriving: { min: 80, max: 100 },
    },
    /** Component weights (must sum to 100) */
    weights: {
      visibility: 20,
      trafficHealth: 15,
      ctrPerformance: 15,
      engagementQuality: 15,
      quickWinPotential: 20,
      contentVelocity: 15,
    },
    /** Scoring benchmarks */
    benchmarks: {
      minKeywordsForVisibility: 10,
      minSessionsForTraffic: 100,
      minCTR: 2,
      maxBounceRate: 50,
      minQuickWins: 5,
      minBriefsPerMonth: 2,
    },
  },

  /**
   * Sync & Analytics Configuration
   */
  sync: {
    /** Default number of days to fetch */
    defaultDays: 30,
    /** Maximum keywords to process per sync */
    maxKeywordsPerSync: 200,
    /** Pagination limit for library queries */
    libraryPageSize: 50,
  },

  /**
   * Content Generation
   */
  content: {
    /** Default content velocity (posts per week) */
    defaultVelocity: 2,
    /** Maximum briefs per quarterly plan */
    maxBriefsPerPlan: 26, // 2/week * 13 weeks
  },

  /**
   * Rate Limiting (per tier)
   */
  rateLimits: {
    free: {
      aiGenerationsPerDay: 5,
      syncsPerDay: 1,
    },
    starter: {
      aiGenerationsPerDay: 50,
      syncsPerDay: 4,
    },
    growth: {
      aiGenerationsPerDay: 200,
      syncsPerDay: 12,
    },
    pro: {
      aiGenerationsPerDay: 1000,
      syncsPerDay: 48,
    },
    enterprise: {
      aiGenerationsPerDay: 10000,
      syncsPerDay: 288,
    },
  },
} as const;

/**
 * Type helpers
 */
export type MRTier = keyof typeof THRESHOLDS.mr.tiers;
export type MembershipTier = keyof typeof THRESHOLDS.rateLimits;

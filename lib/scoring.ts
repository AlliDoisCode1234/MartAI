/**
 * MR Scoring Utilities
 *
 * Pure functions for calculating preliminary MR scores.
 * Extracted for testability and reuse.
 */

export interface ScoringInput {
  keywordCount: number;
  clusterCount: number;
}

export interface ScoringResult {
  overall: number;
  tier: 'needs_work' | 'fair' | 'good';
  keywordScore: number;
  clusterScore: number;
  baseScore: number;
}

/**
 * Calculate keyword score based on count
 * - 10+ keywords = 40 points
 * - 5-9 keywords = 25 points
 * - 1-4 keywords = 15 points
 * - 0 keywords = 5 points
 */
export function calculateKeywordScore(keywordCount: number): number {
  if (keywordCount >= 10) return 40;
  if (keywordCount >= 5) return 25;
  if (keywordCount >= 1) return 15;
  return 5;
}

/**
 * Calculate cluster score based on count
 * - 3+ clusters = 30 points
 * - 1-2 clusters = 15 points
 * - 0 clusters = 5 points
 */
export function calculateClusterScore(clusterCount: number): number {
  if (clusterCount >= 3) return 30;
  if (clusterCount >= 1) return 15;
  return 5;
}

/**
 * Determine tier based on overall score
 * - 60+ = 'good'
 * - 40-59 = 'fair'
 * - 0-39 = 'needs_work'
 */
export function determineTier(overall: number): 'needs_work' | 'fair' | 'good' {
  if (overall >= 60) return 'good';
  if (overall >= 40) return 'fair';
  return 'needs_work';
}

/**
 * Calculate preliminary MR score for a project
 * Max score without GA4/GSC is 80, encouraging integration
 */
export function calculatePreliminaryScore(input: ScoringInput): ScoringResult {
  const keywordScore = calculateKeywordScore(input.keywordCount);
  const clusterScore = calculateClusterScore(input.clusterCount);
  const baseScore = 10; // Base score for having a project

  const overall = Math.min(keywordScore + clusterScore + baseScore, 80);
  const tier = determineTier(overall);

  return {
    overall,
    tier,
    keywordScore,
    clusterScore,
    baseScore,
  };
}

/**
 * Check if keyword count meets minimum threshold for onboarding
 * Acceptance criteria: at least 8 keywords
 */
export function meetsMinimumKeywordThreshold(keywordCount: number): boolean {
  return keywordCount >= 8;
}

/**
 * Check if MR score is valid (not showing "-")
 * Acceptance criteria: MR score > 0
 */
export function hasValidMRScore(overall: number): boolean {
  return overall > 0;
}

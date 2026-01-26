import { RateLimiter, MINUTE, HOUR } from '@convex-dev/rate-limiter';
import { components } from './_generated/api';
import type { RateLimitKey } from './lib/typedHelpers';

// Define DAY constant (24 hours in milliseconds)
const DAY = 24 * HOUR;

// Define tiered rate limits based on membership tier
// NOTE: 'free' tier is a LEGACY/FALLBACK tier for rate limiting only.
// Business policy: MartAI has NO FREE TIER for marketing/billing.
// This exists to handle edge cases (trial users, migration, testing).
// Do NOT expose 'free' tier in UI or marketing materials.
export const RATE_LIMIT_TIERS = {
  // Legacy fallback - restricted limits for edge cases only
  free: {
    briefGeneration: { rate: 3, period: DAY },
    draftGeneration: { rate: 3, period: DAY },
    keywordClusters: { rate: 5, period: DAY },
    quarterlyPlans: { rate: 1, period: DAY },
    aiAnalysis: { rate: 2, period: DAY },
  },
  starter: {
    briefGeneration: { rate: 5, period: HOUR },
    draftGeneration: { rate: 5, period: HOUR },
    keywordClusters: { rate: 10, period: HOUR },
    quarterlyPlans: { rate: 2, period: DAY },
    aiAnalysis: { rate: 3, period: DAY },
  },
  growth: {
    briefGeneration: { rate: 10, period: HOUR },
    draftGeneration: { rate: 10, period: HOUR },
    keywordClusters: { rate: 20, period: HOUR },
    quarterlyPlans: { rate: 5, period: DAY },
    aiAnalysis: { rate: 10, period: DAY },
  },
  pro: {
    briefGeneration: { rate: 20, period: HOUR },
    draftGeneration: { rate: 20, period: HOUR },
    keywordClusters: { rate: 50, period: HOUR },
    quarterlyPlans: { rate: 10, period: DAY },
    aiAnalysis: { rate: 20, period: DAY },
  },
  admin: {
    // Generous limits for testing
    briefGeneration: { rate: 100, period: HOUR },
    draftGeneration: { rate: 100, period: HOUR },
    keywordClusters: { rate: 200, period: HOUR },
    quarterlyPlans: { rate: 50, period: DAY },
    aiAnalysis: { rate: 100, period: DAY },
  },
} as const;

// Create rate limiter instance
// Note: Using `as any` because RateLimiter generics don't fully support
// dynamic rate limit names (tier-based keys like 'generateBrief_free')
export const rateLimits = new RateLimiter(components.rateLimiter as any, {
  // Brief generation - token bucket for smooth usage
  generateBrief_free: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.free.briefGeneration.rate,
    period: RATE_LIMIT_TIERS.free.briefGeneration.period,
    capacity: 1,
  },
  generateBrief_starter: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.starter.briefGeneration.rate,
    period: RATE_LIMIT_TIERS.starter.briefGeneration.period,
    capacity: 2,
  },
  generateBrief_growth: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.growth.briefGeneration.rate,
    period: RATE_LIMIT_TIERS.growth.briefGeneration.period,
    capacity: 3,
  },
  generateBrief_pro: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.pro.briefGeneration.rate,
    period: RATE_LIMIT_TIERS.pro.briefGeneration.period,
    capacity: 5,
  },
  generateBrief_admin: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.admin.briefGeneration.rate,
    period: RATE_LIMIT_TIERS.admin.briefGeneration.period,
    capacity: 20,
  },

  // Draft generation
  generateDraft_free: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.free.draftGeneration.rate,
    period: RATE_LIMIT_TIERS.free.draftGeneration.period,
    capacity: 1,
  },
  generateDraft_starter: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.starter.draftGeneration.rate,
    period: RATE_LIMIT_TIERS.starter.draftGeneration.period,
    capacity: 2,
  },
  generateDraft_growth: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.growth.draftGeneration.rate,
    period: RATE_LIMIT_TIERS.growth.draftGeneration.period,
    capacity: 3,
  },
  generateDraft_pro: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.pro.draftGeneration.rate,
    period: RATE_LIMIT_TIERS.pro.draftGeneration.period,
    capacity: 5,
  },
  generateDraft_admin: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.admin.draftGeneration.rate,
    period: RATE_LIMIT_TIERS.admin.draftGeneration.period,
    capacity: 20,
  },

  // Keyword clustering
  generateKeywordClusters_free: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.free.keywordClusters.rate,
    period: RATE_LIMIT_TIERS.free.keywordClusters.period,
    capacity: 2,
  },
  generateKeywordClusters_starter: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.starter.keywordClusters.rate,
    period: RATE_LIMIT_TIERS.starter.keywordClusters.period,
    capacity: 3,
  },
  generateKeywordClusters_growth: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.growth.keywordClusters.rate,
    period: RATE_LIMIT_TIERS.growth.keywordClusters.period,
    capacity: 5,
  },
  generateKeywordClusters_pro: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.pro.keywordClusters.rate,
    period: RATE_LIMIT_TIERS.pro.keywordClusters.period,
    capacity: 10,
  },
  generateKeywordClusters_admin: {
    kind: 'token bucket',
    rate: RATE_LIMIT_TIERS.admin.keywordClusters.rate,
    period: RATE_LIMIT_TIERS.admin.keywordClusters.period,
    capacity: 50,
  },

  // Quarterly planning - fixed window
  createQuarterlyPlan_free: {
    kind: 'fixed window',
    rate: RATE_LIMIT_TIERS.free.quarterlyPlans.rate,
    period: RATE_LIMIT_TIERS.free.quarterlyPlans.period,
  },
  createQuarterlyPlan_starter: {
    kind: 'fixed window',
    rate: RATE_LIMIT_TIERS.starter.quarterlyPlans.rate,
    period: RATE_LIMIT_TIERS.starter.quarterlyPlans.period,
  },
  createQuarterlyPlan_growth: {
    kind: 'fixed window',
    rate: RATE_LIMIT_TIERS.growth.quarterlyPlans.rate,
    period: RATE_LIMIT_TIERS.growth.quarterlyPlans.period,
  },
  createQuarterlyPlan_pro: {
    kind: 'fixed window',
    rate: RATE_LIMIT_TIERS.pro.quarterlyPlans.rate,
    period: RATE_LIMIT_TIERS.pro.quarterlyPlans.period,
  },
  createQuarterlyPlan_admin: {
    kind: 'fixed window',
    rate: RATE_LIMIT_TIERS.admin.quarterlyPlans.rate,
    period: RATE_LIMIT_TIERS.admin.quarterlyPlans.period,
  },

  // AI analysis - fixed window
  aiAnalysis_free: {
    kind: 'fixed window',
    rate: RATE_LIMIT_TIERS.free.aiAnalysis.rate,
    period: RATE_LIMIT_TIERS.free.aiAnalysis.period,
  },
  aiAnalysis_starter: {
    kind: 'fixed window',
    rate: RATE_LIMIT_TIERS.starter.aiAnalysis.rate,
    period: RATE_LIMIT_TIERS.starter.aiAnalysis.period,
  },
  aiAnalysis_growth: {
    kind: 'fixed window',
    rate: RATE_LIMIT_TIERS.growth.aiAnalysis.rate,
    period: RATE_LIMIT_TIERS.growth.aiAnalysis.period,
  },
  aiAnalysis_pro: {
    kind: 'fixed window',
    rate: RATE_LIMIT_TIERS.pro.aiAnalysis.rate,
    period: RATE_LIMIT_TIERS.pro.aiAnalysis.period,
  },
  aiAnalysis_admin: {
    kind: 'fixed window',
    rate: RATE_LIMIT_TIERS.admin.aiAnalysis.rate,
    period: RATE_LIMIT_TIERS.admin.aiAnalysis.period,
  },

  // ============================================
  // PUBLIC API RATE LIMITS (Enterprise tier)
  // ============================================

  // API endpoints - token bucket for burst handling
  api_keywords_read: {
    kind: 'token bucket',
    rate: 100, // 100 requests per minute
    period: MINUTE,
    capacity: 20, // Allow burst of 20
  },
  api_keywords_write: {
    kind: 'token bucket',
    rate: 50, // 50 writes per minute
    period: MINUTE,
    capacity: 10,
  },
  api_clusters_read: {
    kind: 'token bucket',
    rate: 100,
    period: MINUTE,
    capacity: 20,
  },
  api_briefs_read: {
    kind: 'token bucket',
    rate: 100,
    period: MINUTE,
    capacity: 20,
  },
  api_analytics_read: {
    kind: 'token bucket',
    rate: 60, // Slightly lower for analytics (more expensive)
    period: MINUTE,
    capacity: 10,
  },

  // ============================================
  // ADMIN OPERATIONS RATE LIMITS
  // ============================================

  // Password verification - prevent brute force on authenticated sessions
  // 5 attempts per 15 minutes per user (OWASP recommended)
  passwordVerification: {
    kind: 'token bucket',
    rate: 5,
    period: 15 * MINUTE,
    capacity: 5,
  },

  // Impersonation - prevent brute-force session creation
  // 5 impersonations per hour per admin
  admin_impersonation: {
    kind: 'fixed window',
    rate: 5,
    period: HOUR,
  },
});

// Helper type for rate limit names
export type RateLimitName =
  | 'generateBrief'
  | 'generateDraft'
  | 'generateKeywordClusters'
  | 'createQuarterlyPlan'
  | 'aiAnalysis';

// Helper type for membership tiers
export type MembershipTier = 'free' | 'starter' | 'growth' | 'pro' | 'admin';

// API Rate limit names
export type ApiRateLimitName =
  | 'api_keywords_read'
  | 'api_keywords_write'
  | 'api_clusters_read'
  | 'api_briefs_read'
  | 'api_analytics_read';

// API Rate limit info returned from check
export type ApiRateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // Unix timestamp in seconds
  retryAfter?: number; // Seconds until reset (if rate limited)
};

/**
 * Get the appropriate rate limit key for a user based on their tier
 */
export function getRateLimitKey(operation: RateLimitName, tier: MembershipTier): RateLimitKey {
  return `${operation}_${tier}` as RateLimitKey;
}

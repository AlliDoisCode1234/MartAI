import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

// Define DAY constant (24 hours in milliseconds)
const DAY = 24 * HOUR;

// Define tiered rate limits based on membership tier
export const RATE_LIMIT_TIERS = {
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
export const rateLimits = new RateLimiter(components.rateLimiter, {
  // Brief generation - token bucket for smooth usage
  generateBrief_free: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.free.briefGeneration.rate,
    period: RATE_LIMIT_TIERS.free.briefGeneration.period,
    capacity: 1,
  },
  generateBrief_starter: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.starter.briefGeneration.rate,
    period: RATE_LIMIT_TIERS.starter.briefGeneration.period,
    capacity: 2,
  },
  generateBrief_growth: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.growth.briefGeneration.rate,
    period: RATE_LIMIT_TIERS.growth.briefGeneration.period,
    capacity: 3,
  },
  generateBrief_pro: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.pro.briefGeneration.rate,
    period: RATE_LIMIT_TIERS.pro.briefGeneration.period,
    capacity: 5,
  },
  generateBrief_admin: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.admin.briefGeneration.rate,
    period: RATE_LIMIT_TIERS.admin.briefGeneration.period,
    capacity: 20,
  },

  // Draft generation
  generateDraft_free: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.free.draftGeneration.rate,
    period: RATE_LIMIT_TIERS.free.draftGeneration.period,
    capacity: 1,
  },
  generateDraft_starter: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.starter.draftGeneration.rate,
    period: RATE_LIMIT_TIERS.starter.draftGeneration.period,
    capacity: 2,
  },
  generateDraft_growth: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.growth.draftGeneration.rate,
    period: RATE_LIMIT_TIERS.growth.draftGeneration.period,
    capacity: 3,
  },
  generateDraft_pro: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.pro.draftGeneration.rate,
    period: RATE_LIMIT_TIERS.pro.draftGeneration.period,
    capacity: 5,
  },
  generateDraft_admin: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.admin.draftGeneration.rate,
    period: RATE_LIMIT_TIERS.admin.draftGeneration.period,
    capacity: 20,
  },

  // Keyword clustering
  generateKeywordClusters_free: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.free.keywordClusters.rate,
    period: RATE_LIMIT_TIERS.free.keywordClusters.period,
    capacity: 2,
  },
  generateKeywordClusters_starter: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.starter.keywordClusters.rate,
    period: RATE_LIMIT_TIERS.starter.keywordClusters.period,
    capacity: 3,
  },
  generateKeywordClusters_growth: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.growth.keywordClusters.rate,
    period: RATE_LIMIT_TIERS.growth.keywordClusters.period,
    capacity: 5,
  },
  generateKeywordClusters_pro: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.pro.keywordClusters.rate,
    period: RATE_LIMIT_TIERS.pro.keywordClusters.period,
    capacity: 10,
  },
  generateKeywordClusters_admin: {
    kind: "token bucket",
    rate: RATE_LIMIT_TIERS.admin.keywordClusters.rate,
    period: RATE_LIMIT_TIERS.admin.keywordClusters.period,
    capacity: 50,
  },

  // Quarterly planning - fixed window
  createQuarterlyPlan_free: {
    kind: "fixed window",
    rate: RATE_LIMIT_TIERS.free.quarterlyPlans.rate,
    period: RATE_LIMIT_TIERS.free.quarterlyPlans.period,
  },
  createQuarterlyPlan_starter: {
    kind: "fixed window",
    rate: RATE_LIMIT_TIERS.starter.quarterlyPlans.rate,
    period: RATE_LIMIT_TIERS.starter.quarterlyPlans.period,
  },
  createQuarterlyPlan_growth: {
    kind: "fixed window",
    rate: RATE_LIMIT_TIERS.growth.quarterlyPlans.rate,
    period: RATE_LIMIT_TIERS.growth.quarterlyPlans.period,
  },
  createQuarterlyPlan_pro: {
    kind: "fixed window",
    rate: RATE_LIMIT_TIERS.pro.quarterlyPlans.rate,
    period: RATE_LIMIT_TIERS.pro.quarterlyPlans.period,
  },
  createQuarterlyPlan_admin: {
    kind: "fixed window",
    rate: RATE_LIMIT_TIERS.admin.quarterlyPlans.rate,
    period: RATE_LIMIT_TIERS.admin.quarterlyPlans.period,
  },

  // AI analysis - fixed window
  aiAnalysis_free: {
    kind: "fixed window",
    rate: RATE_LIMIT_TIERS.free.aiAnalysis.rate,
    period: RATE_LIMIT_TIERS.free.aiAnalysis.period,
  },
  aiAnalysis_starter: {
    kind: "fixed window",
    rate: RATE_LIMIT_TIERS.starter.aiAnalysis.rate,
    period: RATE_LIMIT_TIERS.starter.aiAnalysis.period,
  },
  aiAnalysis_growth: {
    kind: "fixed window",
    rate: RATE_LIMIT_TIERS.growth.aiAnalysis.rate,
    period: RATE_LIMIT_TIERS.growth.aiAnalysis.period,
  },
  aiAnalysis_pro: {
    kind: "fixed window",
    rate: RATE_LIMIT_TIERS.pro.aiAnalysis.rate,
    period: RATE_LIMIT_TIERS.pro.aiAnalysis.period,
  },
  aiAnalysis_admin: {
    kind: "fixed window",
    rate: RATE_LIMIT_TIERS.admin.aiAnalysis.rate,
    period: RATE_LIMIT_TIERS.admin.aiAnalysis.period,
  },
});

// Helper type for rate limit names
export type RateLimitName =
  | "generateBrief"
  | "generateDraft"
  | "generateKeywordClusters"
  | "createQuarterlyPlan"
  | "aiAnalysis";

// Helper type for membership tiers
export type MembershipTier = "free" | "starter" | "growth" | "pro" | "admin";

/**
 * Get the appropriate rate limit key for a user based on their tier
 */
export function getRateLimitKey(
  operation: RateLimitName,
  tier: MembershipTier
): string {
  return `${operation}_${tier}`;
}

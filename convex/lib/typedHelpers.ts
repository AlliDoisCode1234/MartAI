/**
 * Typed Helpers for Convex
 *
 * Provides:
 * 1. Brand<T, B> utility for nominal typing
 * 2. Re-exports of Convex table ID types
 * 3. Essential domain types (Priority, Status)
 *
 * Keep this file MINIMAL - add new types only when they're reused 3+ times.
 * @see https://www.learningtypescript.com/articles/branded-types
 */

// ============================================
// BRANDED TYPE UTILITY
// ============================================

/**
 * Brand<T, B> - Create a branded (nominal) type
 * Prevents accidental type swaps at compile time.
 *
 * @example
 * type UserId = Brand<string, 'UserId'>;
 * type ApiKey = Brand<string, 'ApiKey'>;
 * const fn = (id: UserId) => {};
 * fn(apiKey); // Error! Type 'ApiKey' is not assignable to 'UserId'
 */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/** Unbrand<T> - Extract the base type from a branded type */
export type Unbrand<T> = T extends Brand<infer U, string> ? U : T;

// ============================================
// CONVEX TABLE ID TYPES (from codegen)
// ============================================

import { Id, TableNames } from '../_generated/dataModel';

/** Re-export Convex types for convenience */
export type { Id, TableNames };

/** Aliases for common table IDs (IntelliSense friendlier) */
export type UserId = Id<'users'>;
export type ProjectId = Id<'projects'>;
export type KeywordId = Id<'keywords'>;
export type ClusterId = Id<'keywordClusters'>;
export type BriefId = Id<'briefs'>;
export type DraftId = Id<'drafts'>;
export type PlanId = Id<'quarterlyPlans'>;

// ============================================
// DOMAIN LITERAL TYPES
// ============================================

/** Priority levels used across the app */
export type Priority = 'high' | 'medium' | 'low';
export const PRIORITY_ORDER: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

/** Content/workflow status */
export type ContentStatus = 'draft' | 'in_progress' | 'approved' | 'published' | 'scheduled';

/** Intent types for keywords/clusters */
export type Intent = 'informational' | 'commercial' | 'transactional' | 'navigational';

/** User roles */
export type UserRole = 'user' | 'admin' | 'super_admin';

/** Membership tiers (must match schema) */
export type MembershipTier = 'free' | 'starter' | 'growth' | 'pro' | 'enterprise';

/** WordPress post status (matches lib/integrations/wordpress) */
export type WordPressStatus = 'publish' | 'draft' | 'private';

// ============================================
// BRANDED PRIMITIVES
// ============================================

/** Unix timestamp in milliseconds */
export type TimestampMs = Brand<number, 'TimestampMs'>;

/** Percentage (0-100 range) */
export type Percentage = Brand<number, 'Percentage'>;

/** PR Score (0-100 range) - Phoo Rating */
export type MRScore = Brand<number, 'MRScore'>;

/** Search volume (positive integer) */
export type SearchVolume = Brand<number, 'SearchVolume'>;

/** Rate limit key - used for tiered rate limiting */
export type RateLimitKey = Brand<string, 'RateLimitKey'>;

/** Get current timestamp as branded type */
export const nowMs = (): TimestampMs => Date.now() as TimestampMs;

// ============================================
// COMPONENT ACCESS NOTES
// ============================================
/**
 * Some `as any` casts are REQUIRED when accessing Convex components:
 *
 * 1. Rate Limiter - `(rateLimits as any).limit(ctx, dynamicKey, ...)``
 *    Reason: Dynamic tier-based keys don't match static component generics
 *
 * 2. RAG Component - `(components as any).rag.add/search`
 *    Reason: RAG component types aren't exposed in generated api.d.ts
 *
 * 3. NeutralCost - `(components as any).neutralCost.aiCosts.*`
 *    Reason: External component, types aren't available
 *
 * 4. Component tables - `ctx.db.query('neutralCost:aiCosts' as any)`
 *    Reason: Component tables use prefixed names not in TableNames union
 *
 * 5. Auth context - `auth.getUserId(ctx as any)`
 *    Reason: Context union type doesn't satisfy @convex-dev/auth signature
 */

/**
 * Tier Limits — Single Source of Truth
 *
 * Centralizes the tier → seat/project mapping so it's never duplicated.
 * Used by: sync.ts, teams.ts (getSeatUsage, createOrganization, syncSeatsWithTier)
 */

export type MembershipTier = 'starter' | 'engine' | 'agency' | 'enterprise';

const TIER_SEATS: Record<MembershipTier, number> = {
  starter: 1,
  engine: 5,
  agency: 25,
  enterprise: 999,
};

/**
 * Get max seats for a membership tier.
 * Returns 1 (starter) for unknown/undefined tiers.
 * For enterprise, uses enterpriseOverride if provided (org.seatsPurchased).
 */
export function getMaxSeatsForTier(tier: string | undefined, enterpriseOverride?: number | null): number {
  if (!tier) return 1;
  if (tier === 'enterprise') return enterpriseOverride ?? TIER_SEATS.enterprise;
  return TIER_SEATS[tier as MembershipTier] ?? 1;
}

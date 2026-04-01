/**
 * Tier Limits — Single Source of Truth
 *
 * Centralizes the tier → seat/project/workspace mapping so it's never duplicated.
 * Used by: sync.ts, teams.ts, invitations.ts, OrganizationSwitcher.tsx
 */

export type MembershipTier = 'starter' | 'engine' | 'agency' | 'enterprise';

/** Max team members per org */
const TIER_SEATS: Record<MembershipTier, number> = {
  starter: 1,
  engine: 5,
  agency: 25,
  enterprise: 999,
};

/** Max workspaces (orgs) a user can own/belong to */
const TIER_WORKSPACES: Record<MembershipTier, number> = {
  starter: 1,
  engine: 3,
  agency: 10,
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

/**
 * Get max workspaces a user can own/belong to for their tier.
 * Returns 1 (starter) for unknown/undefined tiers — fail-closed.
 */
export function getMaxWorkspacesForTier(tier: string | undefined): number {
  if (!tier) return 1;
  return TIER_WORKSPACES[tier as MembershipTier] ?? 1;
}

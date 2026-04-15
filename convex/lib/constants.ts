/**
 * Shared constants for the Convex backend.
 *
 * Component Hierarchy:
 * convex/lib/constants.ts (shared utility — no parent)
 */

/**
 * Sentinel value stored as `propertyId` or `siteUrl` when
 * a Google OAuth connection has multiple properties/sites
 * and the user has not yet selected one.
 *
 * All consumers of `getGA4ConnectionInternal` / `getGSCConnectionInternal`
 * MUST check for this sentinel before using the connection's IDs
 * in external API calls.
 */
export const PENDING_SELECTION = 'PENDING_SELECTION' as const;

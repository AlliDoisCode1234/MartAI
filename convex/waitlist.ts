import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

/**
 * Waitlist Mutations & Queries
 *
 * Component Hierarchy:
 * └── Landing Page (phoo.ai) → WaitlistForm → joinWaitlist mutation
 *
 * Lead capture for phoo.ai pre-launch waitlist.
 * Creates BOTH:
 * - Waitlist entry (for tracking/admin)
 * - User record (for lifetime value tracking)
 *
 * On signup, syncs to HubSpot CRM for sales follow-up.
 */

/**
 * Join the waitlist with email and optional tracking metadata.
 * Idempotent: if email already exists, returns existing entry ID.
 * Creates a user record with acquisitionSource='waitlist_beta'.
 * Triggers HubSpot sync for new signups.
 */
export const joinWaitlist = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        referrer: v.optional(v.string()),
        utmSource: v.optional(v.string()),
        utmMedium: v.optional(v.string()),
        utmCampaign: v.optional(v.string()),
        userAgent: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error('Invalid email format');
    }

    // Normalize email to lowercase
    const normalizedEmail = args.email.toLowerCase().trim();

    // Check for existing waitlist entry (idempotent)
    const existingWaitlist = await ctx.db
      .query('waitlist')
      .withIndex('by_email', (q) => q.eq('email', normalizedEmail))
      .first();

    if (existingWaitlist) {
      // Already on waitlist - return existing ID
      return { id: existingWaitlist._id, alreadyExists: true };
    }

    const now = Date.now();

    // Create new waitlist entry
    const waitlistId = await ctx.db.insert('waitlist', {
      email: normalizedEmail,
      source: args.source ?? 'phoo.ai',
      metadata: args.metadata,
      status: 'pending',
      createdAt: now,
    });

    // Check if user record already exists (e.g., previous organic signup)
    const existingUser = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', normalizedEmail))
      .first();

    let userId = existingUser?._id;

    if (!existingUser) {
      // Create user record with acquisition tracking
      // This makes waitlist signups "real users" from day one
      // Beta users get solo tier - betaExpiresAt set when onboarding completes
      userId = await ctx.db.insert('users', {
        email: normalizedEmail,
        createdAt: now,
        updatedAt: now,
        role: 'user',
        accountStatus: 'inactive', // Activate when they complete onboarding
        onboardingStatus: 'not_started',
        acquisitionSource: 'waitlist_beta',
        acquisitionDate: now,
        acquisitionMetadata: {
          utmSource: args.metadata?.utmSource,
          utmMedium: args.metadata?.utmMedium,
          utmCampaign: args.metadata?.utmCampaign,
          referrer: args.metadata?.referrer,
          waitlistId: waitlistId,
        },
        // Beta user fields - skip pricing/payment in onboarding
        // betaExpiresAt set when onboarding completes (6 months from then)
        isBetaUser: true,
        membershipTier: 'solo',
      });
    }

    // Schedule HubSpot sync (non-blocking, fire-and-forget)
    await ctx.scheduler.runAfter(0, api.integrations.hubspot.syncWaitlistToHubspot, {
      email: normalizedEmail,
      source: args.source ?? 'phoo.ai',
      utmSource: args.metadata?.utmSource,
      utmMedium: args.metadata?.utmMedium,
      utmCampaign: args.metadata?.utmCampaign,
    });

    return { id: waitlistId, userId, alreadyExists: false };
  },
});

/**
 * Get waitlist count for social proof on landing page.
 * Returns approximate count (no PII exposed).
 */
export const getWaitlistCount = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query('waitlist').collect();
    return { count: entries.length };
  },
});

/**
 * Admin: Get all waitlist entries (super_admin only).
 * For internal use in admin dashboard.
 */
export const listWaitlistEntries = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Note: Add authentication check when integrating with admin
    const limit = args.limit ?? 100;
    const entries = await ctx.db
      .query('waitlist')
      .withIndex('by_created')
      .order('desc')
      .take(limit);

    return entries;
  },
});

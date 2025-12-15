/**
 * Engagement Milestones - ADMIN-003
 *
 * Helper functions to track user engagement funnel:
 * Keywords → Clusters → Briefs → Drafts → Published
 */

import { mutation, internalMutation } from '../_generated/server';
import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

// Internal helper to update engagement milestones
async function updateMilestone(
  ctx: MutationCtx,
  userId: Id<'users'>,
  milestone: 'keyword' | 'cluster' | 'brief' | 'draft' | 'published' | 'ga4' | 'gsc' | 'wordpress',
  incrementTotal: boolean = true
): Promise<void> {
  const user = await ctx.db.get(userId);
  if (!user) return;

  const now = Date.now();
  const milestones = user.engagementMilestones || {};

  // Map milestone type to field names
  const fieldMap: Record<string, { first: string; total?: string }> = {
    keyword: { first: 'firstKeywordCreatedAt', total: 'totalKeywords' },
    cluster: { first: 'firstClusterCreatedAt', total: 'totalClusters' },
    brief: { first: 'firstBriefCreatedAt', total: 'totalBriefs' },
    draft: { first: 'firstDraftCreatedAt', total: 'totalDrafts' },
    published: { first: 'firstContentPublishedAt', total: 'totalPublished' },
    ga4: { first: 'firstGa4ConnectedAt' },
    gsc: { first: 'firstGscConnectedAt' },
    wordpress: { first: 'firstWordPressConnectedAt' },
  };

  const fields = fieldMap[milestone];
  if (!fields) return;

  const updates: Record<string, number> = {};

  // Set first-time timestamp if not already set
  if (!milestones[fields.first as keyof typeof milestones]) {
    updates[fields.first] = now;
  }

  // Increment total if applicable
  if (incrementTotal && fields.total) {
    const currentTotal = (milestones[fields.total as keyof typeof milestones] as number) || 0;
    updates[fields.total] = currentTotal + 1;
  }

  // Only update if there are changes
  if (Object.keys(updates).length > 0) {
    await ctx.db.patch(userId, {
      engagementMilestones: {
        ...milestones,
        ...updates,
      },
    });
  }
}

// Internal mutation for use by other modules
export const trackEngagement = internalMutation({
  args: {
    userId: v.id('users'),
    milestone: v.union(
      v.literal('keyword'),
      v.literal('cluster'),
      v.literal('brief'),
      v.literal('draft'),
      v.literal('published'),
      v.literal('ga4'),
      v.literal('gsc'),
      v.literal('wordpress')
    ),
    incrementTotal: v.optional(v.boolean()),
  },
  handler: async (ctx, { userId, milestone, incrementTotal = true }) => {
    await updateMilestone(ctx, userId, milestone, incrementTotal);
  },
});

// Direct mutation for client-side calls (used by integrations)
export const trackIntegrationConnected = mutation({
  args: {
    integration: v.union(v.literal('ga4'), v.literal('gsc'), v.literal('wordpress')),
  },
  handler: async (ctx, { integration }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), identity.email))
      .first();

    if (!user) throw new Error('User not found');

    await updateMilestone(ctx, user._id, integration, false);
  },
});

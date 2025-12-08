/**
 * Webhook Internal Queries
 *
 * Internal queries for webhook delivery system
 */

import { internalQuery } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Get active webhooks that subscribe to a specific event
 */
export const getActiveWebhooksForEvent = internalQuery({
  args: {
    projectId: v.optional(v.id('projects')),
    organizationId: v.optional(v.id('organizations')),
    event: v.string(),
  },
  handler: async (ctx, args) => {
    let webhooks: any[] = [];

    // Get project-level webhooks
    if (args.projectId) {
      const projectWebhooks = await ctx.db
        .query('webhooks')
        .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
        .filter((q) => q.eq(q.field('isActive'), true))
        .collect();
      webhooks = [...webhooks, ...projectWebhooks];
    }

    // Get org-level webhooks
    if (args.organizationId) {
      const orgWebhooks = await ctx.db
        .query('webhooks')
        .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
        .filter((q) => q.eq(q.field('isActive'), true))
        .collect();
      webhooks = [...webhooks, ...orgWebhooks];
    }

    // Filter to only webhooks that subscribe to this event
    return webhooks.filter((w) => w.events.includes(args.event));
  },
});

/**
 * Get delivery by ID
 */
export const getDeliveryById = internalQuery({
  args: { deliveryId: v.id('webhookDeliveries') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.deliveryId);
  },
});

/**
 * Get webhook by ID
 */
export const getWebhookById = internalQuery({
  args: { webhookId: v.id('webhooks') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.webhookId);
  },
});

/**
 * Get deliveries pending retry
 */
export const getPendingRetries = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    return await ctx.db
      .query('webhookDeliveries')
      .withIndex('by_status', (q) => q.eq('status', 'retrying'))
      .filter((q) =>
        q.and(q.neq(q.field('nextRetryAt'), undefined), q.lte(q.field('nextRetryAt'), now))
      )
      .take(100);
  },
});

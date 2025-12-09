/**
 * Webhook Delivery Mutations
 *
 * Database operations for webhook deliveries
 * (Mutations cannot run in 'use node' files)
 */

import { internalMutation } from '../_generated/server';
import { v } from 'convex/values';

const MAX_RETRIES = 3;

/**
 * Create delivery record and attempt to send
 */
export const createDeliveryAndSend = internalMutation({
  args: {
    webhookId: v.id('webhooks'),
    event: v.string(),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Create delivery record
    const deliveryId = await ctx.db.insert('webhookDeliveries', {
      webhookId: args.webhookId,
      event: args.event,
      payload: args.payload,
      status: 'pending',
      attempts: 0,
      maxAttempts: MAX_RETRIES,
      createdAt: now,
    });

    // Schedule the actual HTTP call
    // Note: In production, use scheduler. For now, we'll use internal action
    // await ctx.scheduler.runAfter(0, internal.webhooks.webhookActions.sendWebhook, {
    //   deliveryId,
    // });

    return { deliveryId };
  },
});

/**
 * Update delivery status
 */
export const updateDeliveryStatus = internalMutation({
  args: {
    deliveryId: v.id('webhookDeliveries'),
    status: v.union(
      v.literal('pending'),
      v.literal('success'),
      v.literal('failed'),
      v.literal('retrying')
    ),
    responseStatus: v.optional(v.number()),
    responseBody: v.optional(v.string()),
    responseTime: v.optional(v.number()),
    attempts: v.optional(v.number()),
    nextRetryAt: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { deliveryId, ...updates } = args;
    const cleanUpdates: Record<string, any> = {
      lastAttemptAt: Date.now(),
    };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    await ctx.db.patch(deliveryId, cleanUpdates);
  },
});

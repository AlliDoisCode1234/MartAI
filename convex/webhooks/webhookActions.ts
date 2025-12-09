/**
 * Webhook Delivery Actions
 *
 * Phase 3: Send webhooks to registered endpoints
 */
'use node';

import { internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { internal } from '../_generated/api';

const MAX_RETRIES = 3;
const RETRY_DELAYS = [60000, 300000, 900000]; // 1min, 5min, 15min

/**
 * Send a webhook to all registered endpoints for an event
 */
export const triggerWebhook = internalAction({
  args: {
    projectId: v.optional(v.id('projects')),
    organizationId: v.optional(v.id('organizations')),
    event: v.string(),
    payload: v.any(),
  },
  handler: async (ctx, args): Promise<{ delivered: number }> => {
    // Get all active webhooks for this project/org that subscribe to this event
    const webhooks = await ctx.runQuery(
      internal.webhooks.webhookQueries.getActiveWebhooksForEvent,
      {
        projectId: args.projectId,
        organizationId: args.organizationId,
        event: args.event,
      }
    );

    if (webhooks.length === 0) {
      console.log(`[Webhooks] No webhooks registered for event: ${args.event}`);
      return { delivered: 0 };
    }

    console.log(`[Webhooks] Triggering ${webhooks.length} webhooks for event: ${args.event}`);

    // Create delivery records and send
    for (const webhook of webhooks) {
      await ctx.runMutation(internal.webhooks.webhookMutations.createDeliveryAndSend, {
        webhookId: webhook._id,
        event: args.event,
        payload: args.payload,
      });
    }

    return { delivered: webhooks.length };
  },
});

/**
 * Actually send the webhook HTTP request
 */
export const sendWebhook = internalAction({
  args: {
    deliveryId: v.id('webhookDeliveries'),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string; status?: number }> => {
    const delivery = await ctx.runQuery(internal.webhooks.webhookQueries.getDeliveryById, {
      deliveryId: args.deliveryId,
    });

    if (!delivery) {
      console.error(`[Webhooks] Delivery not found: ${args.deliveryId}`);
      return { success: false, error: 'Delivery not found' };
    }

    const webhook = await ctx.runQuery(internal.webhooks.webhookQueries.getWebhookById, {
      webhookId: delivery.webhookId,
    });

    if (!webhook || !webhook.isActive) {
      await ctx.runMutation(internal.webhooks.webhookMutations.updateDeliveryStatus, {
        deliveryId: args.deliveryId,
        status: 'failed',
        error: 'Webhook is inactive or deleted',
      });
      return { success: false, error: 'Webhook inactive' };
    }

    // Prepare the request
    const body = JSON.stringify({
      event: delivery.event,
      timestamp: Date.now(),
      payload: delivery.payload,
    });

    // Create HMAC signature
    const crypto = await import('node:crypto');
    const signature = crypto.createHmac('sha256', webhook.secret).update(body).digest('hex');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Webhook-Event': delivery.event,
      'X-Webhook-Signature': `sha256=${signature}`,
      'X-Webhook-Timestamp': Date.now().toString(),
      ...(webhook.headers || {}),
    };

    const startTime = Date.now();

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body,
      });

      const responseTime = Date.now() - startTime;
      const responseBody = await response.text().catch(() => '');

      if (response.ok) {
        await ctx.runMutation(internal.webhooks.webhookMutations.updateDeliveryStatus, {
          deliveryId: args.deliveryId,
          status: 'success',
          responseStatus: response.status,
          responseBody: responseBody.substring(0, 500),
          responseTime,
        });
        return { success: true };
      } else {
        // Failed but might retry
        const attempts = delivery.attempts + 1;
        if (attempts < MAX_RETRIES) {
          const nextRetryAt = Date.now() + RETRY_DELAYS[attempts - 1];
          await ctx.runMutation(internal.webhooks.webhookMutations.updateDeliveryStatus, {
            deliveryId: args.deliveryId,
            status: 'retrying',
            responseStatus: response.status,
            responseBody: responseBody.substring(0, 500),
            responseTime,
            attempts,
            nextRetryAt,
            error: `HTTP ${response.status}`,
          });
        } else {
          await ctx.runMutation(internal.webhooks.webhookMutations.updateDeliveryStatus, {
            deliveryId: args.deliveryId,
            status: 'failed',
            responseStatus: response.status,
            responseBody: responseBody.substring(0, 500),
            responseTime,
            attempts,
            error: `Max retries exceeded. Last: HTTP ${response.status}`,
          });
        }
        return { success: false, status: response.status };
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const attempts = delivery.attempts + 1;

      if (attempts < MAX_RETRIES) {
        const nextRetryAt = Date.now() + RETRY_DELAYS[attempts - 1];
        await ctx.runMutation(internal.webhooks.webhookMutations.updateDeliveryStatus, {
          deliveryId: args.deliveryId,
          status: 'retrying',
          responseTime,
          attempts,
          nextRetryAt,
          error: error.message,
        });
      } else {
        await ctx.runMutation(internal.webhooks.webhookMutations.updateDeliveryStatus, {
          deliveryId: args.deliveryId,
          status: 'failed',
          responseTime,
          attempts,
          error: `Max retries exceeded. Last: ${error.message}`,
        });
      }
      return { success: false, error: error.message };
    }
  },
});

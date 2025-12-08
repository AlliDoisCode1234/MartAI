/**
 * Webhooks CRUD Operations
 *
 * Phase 3: Enterprise webhook management
 */

import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { auth } from '../auth';
import { requireProjectAccess, requireOrgRole } from '../lib/rbac';

// Available webhook events
export const WEBHOOK_EVENTS = [
  'brief.created',
  'brief.updated',
  'draft.created',
  'draft.published',
  'insight.generated',
  'sync.completed',
  'project.created',
  'project.updated',
] as const;

/**
 * Create a new webhook endpoint
 */
export const createWebhook = mutation({
  args: {
    projectId: v.optional(v.id('projects')),
    organizationId: v.optional(v.id('organizations')),
    name: v.string(),
    url: v.string(),
    events: v.array(v.string()),
    description: v.optional(v.string()),
    headers: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Verify access
    if (args.projectId) {
      await requireProjectAccess(ctx, args.projectId, 'admin');
    } else if (args.organizationId) {
      await requireOrgRole(ctx, args.organizationId, 'admin');
    } else {
      throw new Error('Either projectId or organizationId is required');
    }

    // Validate URL
    try {
      new URL(args.url);
    } catch {
      throw new Error('Invalid webhook URL');
    }

    // Generate secret for HMAC signing
    const secret = crypto.randomUUID() + '-' + crypto.randomUUID();

    const now = Date.now();
    const webhookId = await ctx.db.insert('webhooks', {
      projectId: args.projectId,
      organizationId: args.organizationId,
      userId,
      name: args.name,
      url: args.url,
      secret,
      events: args.events,
      isActive: true,
      description: args.description,
      headers: args.headers,
      createdAt: now,
      updatedAt: now,
    });

    return { webhookId, secret };
  },
});

/**
 * Get webhooks for a project
 */
export const getWebhooksByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    try {
      await requireProjectAccess(ctx, args.projectId, 'viewer');
    } catch {
      return [];
    }

    return await ctx.db
      .query('webhooks')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

/**
 * Get webhooks for an organization
 */
export const getWebhooksByOrganization = query({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    try {
      await requireOrgRole(ctx, args.organizationId, 'viewer');
    } catch {
      return [];
    }

    return await ctx.db
      .query('webhooks')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .collect();
  },
});

/**
 * Update a webhook
 */
export const updateWebhook = mutation({
  args: {
    webhookId: v.id('webhooks'),
    name: v.optional(v.string()),
    url: v.optional(v.string()),
    events: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
    description: v.optional(v.string()),
    headers: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const webhook = await ctx.db.get(args.webhookId);
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    // Verify access
    if (webhook.projectId) {
      await requireProjectAccess(ctx, webhook.projectId, 'admin');
    } else if (webhook.organizationId) {
      await requireOrgRole(ctx, webhook.organizationId, 'admin');
    }

    // Validate URL if provided
    if (args.url) {
      try {
        new URL(args.url);
      } catch {
        throw new Error('Invalid webhook URL');
      }
    }

    const { webhookId, ...updates } = args;
    const cleanUpdates: Record<string, any> = { updatedAt: Date.now() };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    await ctx.db.patch(webhookId, cleanUpdates);
    return { success: true };
  },
});

/**
 * Delete a webhook
 */
export const deleteWebhook = mutation({
  args: { webhookId: v.id('webhooks') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const webhook = await ctx.db.get(args.webhookId);
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    // Verify access
    if (webhook.projectId) {
      await requireProjectAccess(ctx, webhook.projectId, 'admin');
    } else if (webhook.organizationId) {
      await requireOrgRole(ctx, webhook.organizationId, 'admin');
    }

    // Delete associated deliveries
    const deliveries = await ctx.db
      .query('webhookDeliveries')
      .withIndex('by_webhook', (q) => q.eq('webhookId', args.webhookId))
      .collect();

    for (const delivery of deliveries) {
      await ctx.db.delete(delivery._id);
    }

    await ctx.db.delete(args.webhookId);
    return { success: true };
  },
});

/**
 * Regenerate webhook secret
 */
export const regenerateWebhookSecret = mutation({
  args: { webhookId: v.id('webhooks') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const webhook = await ctx.db.get(args.webhookId);
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    // Verify access - only admin can regenerate secrets
    if (webhook.projectId) {
      await requireProjectAccess(ctx, webhook.projectId, 'admin');
    } else if (webhook.organizationId) {
      await requireOrgRole(ctx, webhook.organizationId, 'admin');
    }

    const newSecret = crypto.randomUUID() + '-' + crypto.randomUUID();

    await ctx.db.patch(args.webhookId, {
      secret: newSecret,
      updatedAt: Date.now(),
    });

    return { secret: newSecret };
  },
});

/**
 * Get webhook delivery logs
 */
export const getWebhookDeliveries = query({
  args: {
    webhookId: v.id('webhooks'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const webhook = await ctx.db.get(args.webhookId);
    if (!webhook) {
      return [];
    }

    // Verify access
    try {
      if (webhook.projectId) {
        await requireProjectAccess(ctx, webhook.projectId, 'viewer');
      } else if (webhook.organizationId) {
        await requireOrgRole(ctx, webhook.organizationId, 'viewer');
      }
    } catch {
      return [];
    }

    return await ctx.db
      .query('webhookDeliveries')
      .withIndex('by_webhook', (q) => q.eq('webhookId', args.webhookId))
      .order('desc')
      .take(args.limit || 50);
  },
});

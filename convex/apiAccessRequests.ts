/**
 * API Access Requests
 *
 * CRUD operations for the API access request form (Enterprise lead gen).
 * Wires to HubSpot for sales pipeline.
 */

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import { auth } from './auth';

// ============================================
// PUBLIC MUTATIONS (Form Submission)
// ============================================

/**
 * Submit an API access request (public form)
 */
export const submitRequest = mutation({
  args: {
    email: v.string(),
    companyName: v.string(),
    contactName: v.optional(v.string()),
    useCase: v.string(),
    useCaseDetails: v.optional(v.string()),
    expectedMonthlyVolume: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if request already exists for this email
    const existing = await ctx.db
      .query('apiAccessRequests')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (existing) {
      // Update existing request instead of creating duplicate
      await ctx.db.patch(existing._id, {
        companyName: args.companyName,
        contactName: args.contactName,
        useCase: args.useCase,
        useCaseDetails: args.useCaseDetails,
        expectedMonthlyVolume: args.expectedMonthlyVolume,
        updatedAt: now,
      });

      // Fire-and-forget HubSpot sync
      ctx.scheduler.runAfter(0, api.integrations.hubspot.syncApiAccessRequest, {
        requestId: existing._id,
      });

      return { requestId: existing._id, isNew: false };
    }

    // Create new request
    const requestId = await ctx.db.insert('apiAccessRequests', {
      email: args.email,
      companyName: args.companyName,
      contactName: args.contactName,
      useCase: args.useCase,
      useCaseDetails: args.useCaseDetails,
      expectedMonthlyVolume: args.expectedMonthlyVolume,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });

    // Fire-and-forget HubSpot sync
    ctx.scheduler.runAfter(0, api.integrations.hubspot.syncApiAccessRequest, {
      requestId,
    });

    return { requestId, isNew: true };
  },
});

// ============================================
// ADMIN QUERIES
// ============================================

/**
 * List all API access requests (admin only)
 */
export const listRequests = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('approved'),
        v.literal('rejected'),
        v.literal('contacted')
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // TODO: Add admin role check when auth is available

    if (args.status) {
      const requests = await ctx.db
        .query('apiAccessRequests')
        .withIndex('by_status', (q) => q.eq('status', args.status!))
        .order('desc')
        .take(args.limit ?? 50);
      return requests;
    }

    const requests = await ctx.db
      .query('apiAccessRequests')
      .order('desc')
      .take(args.limit ?? 50);

    return requests;
  },
});

/**
 * Get a single API access request by ID
 */
export const getRequest = query({
  args: { requestId: v.id('apiAccessRequests') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.requestId);
  },
});

// ============================================
// ADMIN MUTATIONS
// ============================================

/**
 * Approve an API access request (generates API key)
 */
export const approveRequest = mutation({
  args: {
    requestId: v.id('apiAccessRequests'),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminId = await auth.getUserId(ctx);
    if (!adminId) throw new Error('Unauthorized');

    // TODO: Check admin role

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error('Request not found');

    if (request.status === 'approved') {
      return { success: false, reason: 'already_approved' };
    }

    const now = Date.now();

    // Update request status
    await ctx.db.patch(args.requestId, {
      status: 'approved',
      adminNotes: args.adminNotes,
      reviewedBy: adminId,
      reviewedAt: now,
      updatedAt: now,
    });

    // TODO: Generate API key and link to request
    // TODO: Send approval email notification

    // Fire-and-forget HubSpot sync (update status)
    ctx.scheduler.runAfter(0, api.integrations.hubspot.syncApiAccessRequest, {
      requestId: args.requestId,
    });

    return { success: true };
  },
});

/**
 * Reject an API access request
 */
export const rejectRequest = mutation({
  args: {
    requestId: v.id('apiAccessRequests'),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminId = await auth.getUserId(ctx);
    if (!adminId) throw new Error('Unauthorized');

    const now = Date.now();

    await ctx.db.patch(args.requestId, {
      status: 'rejected',
      adminNotes: args.adminNotes,
      reviewedBy: adminId,
      reviewedAt: now,
      updatedAt: now,
    });

    // Fire-and-forget HubSpot sync
    ctx.scheduler.runAfter(0, api.integrations.hubspot.syncApiAccessRequest, {
      requestId: args.requestId,
    });

    return { success: true };
  },
});

/**
 * Mark request as contacted (sales reached out)
 */
export const markContacted = mutation({
  args: {
    requestId: v.id('apiAccessRequests'),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminId = await auth.getUserId(ctx);
    if (!adminId) throw new Error('Unauthorized');

    const now = Date.now();

    await ctx.db.patch(args.requestId, {
      status: 'contacted',
      adminNotes: args.adminNotes,
      reviewedBy: adminId,
      reviewedAt: now,
      updatedAt: now,
    });

    return { success: true };
  },
});

/**
 * Update HubSpot sync status (internal, called by HubSpot action)
 */
export const updateHubspotSync = mutation({
  args: {
    requestId: v.id('apiAccessRequests'),
    hubspotContactId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.requestId, {
      hubspotContactId: args.hubspotContactId,
      hubspotSyncedAt: Date.now(),
    });

    return { success: true };
  },
});

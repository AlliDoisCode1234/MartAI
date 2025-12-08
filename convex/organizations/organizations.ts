/**
 * Organizations CRUD Operations
 *
 * Phase 3: Enterprise multi-tenancy support
 */

import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { auth } from '../auth';

/**
 * Create a new organization
 */
export const createOrganization = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    logoUrl: v.optional(v.string()),
    plan: v.optional(
      v.union(
        v.literal('free'),
        v.literal('starter'),
        v.literal('growth'),
        v.literal('pro'),
        v.literal('enterprise')
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Check slug uniqueness
    const existingOrg = await ctx.db
      .query('organizations')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();

    if (existingOrg) {
      throw new Error('Organization slug already exists');
    }

    const now = Date.now();

    // Create the organization
    const orgId = await ctx.db.insert('organizations', {
      name: args.name,
      slug: args.slug,
      logoUrl: args.logoUrl,
      plan: args.plan || 'free',
      maxProjects: args.plan === 'enterprise' ? 100 : args.plan === 'pro' ? 20 : 5,
      maxMembers: args.plan === 'enterprise' ? 50 : args.plan === 'pro' ? 10 : 3,
      ownerId: userId,
      createdAt: now,
      updatedAt: now,
    });

    // Add the creator as owner in teamMembers
    await ctx.db.insert('teamMembers', {
      userId,
      organizationId: orgId,
      role: 'owner',
      status: 'active',
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return { organizationId: orgId };
  },
});

/**
 * Get organization by ID
 */
export const getOrganizationById = query({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.organizationId);
  },
});

/**
 * Get organization by slug
 */
export const getOrganizationBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('organizations')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();
  },
});

/**
 * Get organizations for current user
 */
export const getMyOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get all team memberships for this user
    const memberships = await ctx.db
      .query('teamMembers')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();

    // Fetch the organizations
    const organizations = await Promise.all(
      memberships.map(async (membership) => {
        const org = await ctx.db.get(membership.organizationId);
        return org ? { ...org, role: membership.role } : null;
      })
    );

    return organizations.filter(Boolean);
  },
});

/**
 * Update organization
 */
export const updateOrganization = mutation({
  args: {
    organizationId: v.id('organizations'),
    name: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    billingEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Check if user is owner or admin
    const membership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      throw new Error('Insufficient permissions');
    }

    const { organizationId, ...updates } = args;
    const cleanUpdates: Record<string, any> = { updatedAt: Date.now() };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    await ctx.db.patch(organizationId, cleanUpdates);
    return { success: true };
  },
});

/**
 * Delete organization (owner only)
 */
export const deleteOrganization = mutation({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const org = await ctx.db.get(args.organizationId);
    if (!org) {
      throw new Error('Organization not found');
    }

    if (org.ownerId !== userId) {
      throw new Error('Only the owner can delete an organization');
    }

    // Delete all team members
    const members = await ctx.db
      .query('teamMembers')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .collect();

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // Delete all invitations
    const invitations = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .collect();

    for (const invitation of invitations) {
      await ctx.db.delete(invitation._id);
    }

    // Delete the organization
    await ctx.db.delete(args.organizationId);

    return { success: true };
  },
});

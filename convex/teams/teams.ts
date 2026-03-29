import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';

import { getAuthUserId } from '@convex-dev/auth/server';
import { getMaxSeatsForTier, getMaxWorkspacesForTier } from '../lib/tierLimits';

/**
 * Team Management Mutations
 *
 * Security: All mutations check auth and RBAC permissions
 * Audit: All changes are logged to teamAuditLogs
 */

// ========================================
// CONSTANTS
// ========================================

// Convex-style slug word lists
const ADJECTIVES = [
  'happy',
  'clever',
  'swift',
  'bright',
  'brave',
  'calm',
  'bold',
  'eager',
  'fancy',
  'gentle',
  'jolly',
  'keen',
  'lively',
  'merry',
  'noble',
  'proud',
  'quick',
  'sharp',
  'witty',
  'zesty',
  'cosmic',
  'stellar',
  'lunar',
  'solar',
];

const ANIMALS = [
  'lemming',
  'falcon',
  'otter',
  'panda',
  'koala',
  'dolphin',
  'phoenix',
  'tiger',
  'eagle',
  'wolf',
  'bear',
  'fox',
  'owl',
  'hawk',
  'raven',
  'lynx',
  'jaguar',
  'panther',
  'cheetah',
  'leopard',
  'griffin',
  'dragon',
];

function generateSlug(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${adj}-${animal}-${num}`;
}

// ========================================
// QUERIES
// ========================================

/**
 * Get organization for current user
 */
export const getMyOrganization = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user?.organizationId) return null;

    return ctx.db.get(user.organizationId);
  },
});

/**
 * Get ALL organizations the current user belongs to.
 * Used by OrganizationSwitcher for multi-org users.
 * Returns org data enriched with the user's role per org.
 */
export const getMyOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const memberships = await ctx.db
      .query('teamMembers')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const activeMemberships = memberships.filter(
      (m) => !m.status || m.status === 'active'
    );

    const organizations = await Promise.all(
      activeMemberships.map(async (membership) => {
        const org = await ctx.db.get(membership.organizationId);
        if (!org) return null;
        return {
          _id: org._id,
          name: org.name,
          role: membership.role,
        };
      })
    );

    return organizations.filter(
      (org): org is NonNullable<typeof org> => org !== null
    );
  },
});

/**
 * Get current user's role in their organization
 * Returns null if not authenticated or not in an org
 */
export const getMyTeamRole = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user?.organizationId) return null;

    const membership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', user.organizationId!)
      )
      .first();

    return membership?.role ?? null;
  },
});

/**
 * Get team members for an organization
 */
export const getTeamMembers = query({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Verify caller is a member of this org
    const membership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!membership) {
      throw new Error('Not a member of this organization');
    }

    // Get all team members
    const members = await ctx.db
      .query('teamMembers')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();

    // Enrich with user data
    const enrichedMembers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user: user
            ? {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
              }
            : null,
        };
      })
    );

    return enrichedMembers;
  },
});

/**
 * Get seat usage for organization
 */
export const getSeatUsage = query({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error('Organization not found');

    // Get owner's membership tier to calculate max seats dynamically
    const owner = await ctx.db.get(org.ownerId);
    const maxSeats = getMaxSeatsForTier(owner?.membershipTier, org.seatsPurchased);

    const activeMembers = await ctx.db
      .query('teamMembers')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();

    const pendingInvites = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .filter((q) =>
        q.and(
          q.eq(q.field('status'), 'pending'),
          q.gt(q.field('expiresAt'), Date.now()) // GAP-7: exclude expired invites from seat count
        )
      )
      .collect();

    return {
      used: activeMembers.length,
      pending: pendingInvites.length,
      max: maxSeats,
      remaining: maxSeats - activeMembers.length - pendingInvites.length,
    };
  },
});

// ========================================
// MUTATIONS
// ========================================

/**
 * Create organization (called during onboarding)
 * Security: Authenticated users only
 */
export const createOrganization = mutation({
  args: {
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.get(userId);

    // Enforce workspace limit per tier
    const existingMemberships = await ctx.db
      .query('teamMembers')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();
    const maxWorkspaces = getMaxWorkspacesForTier(user?.membershipTier);
    if (existingMemberships.length >= maxWorkspaces) {
      throw new Error(
        `Workspace limit reached (${existingMemberships.length}/${maxWorkspaces}). Upgrade your plan to create more workspaces.`
      );
    }

    // Generate unique slug
    let slug = generateSlug();
    let existing = await ctx.db
      .query('organizations')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first();

    // Retry if collision
    while (existing) {
      slug = generateSlug();
      existing = await ctx.db
        .query('organizations')
        .withIndex('by_slug', (q) => q.eq('slug', slug))
        .first();
    }

    const now = Date.now();

    // Determine max members based on user's membership tier
    const maxMembers = getMaxSeatsForTier(user?.membershipTier);

    // Create organization
    const orgId = await ctx.db.insert('organizations', {
      name: args.name || slug,
      slug,
      plan: user?.membershipTier || 'starter',
      maxMembers,
      ownerId: userId,
      createdAt: now,
      updatedAt: now,
    });

    // Add user as owner in teamMembers
    await ctx.db.insert('teamMembers', {
      userId,
      organizationId: orgId,
      role: 'owner',
      status: 'active',
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Update user with organizationId
    await ctx.db.patch(userId, { organizationId: orgId });

    return orgId;
  },
});

/**
 * Sync organization seats with owner's membership tier
 * Call this when user's tier changes to update maxMembers
 */
export const syncSeatsWithTier = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.get(userId);
    if (!user?.organizationId) throw new Error('No organization found');

    const org = await ctx.db.get(user.organizationId);
    if (!org || org.ownerId !== userId) {
      throw new Error('Only the organization owner can sync seats');
    }

    // Determine max members based on membership tier
    const maxMembers = getMaxSeatsForTier(user.membershipTier, org.seatsPurchased);

    await ctx.db.patch(user.organizationId, {
      plan: user.membershipTier || 'starter',
      maxMembers,
      updatedAt: Date.now(),
    });

    return { success: true, maxMembers };
  },
});

/**
 * Update organization name
 * Security: Owner only
 */
export const updateOrganizationName = mutation({
  args: {
    organizationId: v.id('organizations'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Check ownership
    const membership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!membership || membership.role !== 'owner') {
      throw new Error('Only the owner can update organization name');
    }

    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error('Organization not found');

    const previousName = org.name;

    await ctx.db.patch(args.organizationId, {
      name: args.name,
      updatedAt: Date.now(),
    });

    // Audit log
    await ctx.db.insert('teamAuditLogs', {
      organizationId: args.organizationId,
      actorId: userId,
      action: 'org_name_changed',
      details: { previousName, newName: args.name },
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Update member role
 * Security: Owner or Admin (admins can't change other admins)
 */
export const updateMemberRole = mutation({
  args: {
    organizationId: v.id('organizations'),
    targetMemberId: v.id('teamMembers'),
    newRole: v.union(v.literal('admin'), v.literal('editor'), v.literal('viewer')),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Check caller permissions
    const callerMembership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!callerMembership || !['owner', 'admin'].includes(callerMembership.role)) {
      throw new Error('Only owners and admins can change member roles');
    }

    const targetMember = await ctx.db.get(args.targetMemberId);
    if (!targetMember || targetMember.organizationId !== args.organizationId) {
      throw new Error('Member not found in this organization');
    }

    // Can't change owner's role
    if (targetMember.role === 'owner') {
      throw new Error("Cannot change the owner's role");
    }

    // Admins can't change other admins (only owner can)
    if (callerMembership.role === 'admin' && targetMember.role === 'admin') {
      throw new Error('Admins cannot change other admin roles');
    }
    // Note: Can't promote to owner - type system prevents it (newRole is 'admin' | 'editor' | 'viewer')

    const previousRole = targetMember.role;

    await ctx.db.patch(args.targetMemberId, {
      role: args.newRole,
      updatedAt: Date.now(),
    });

    // Audit log
    await ctx.db.insert('teamAuditLogs', {
      organizationId: args.organizationId,
      actorId: userId,
      targetUserId: targetMember.userId,
      action: 'role_changed',
      details: { previousRole, newRole: args.newRole },
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Remove member from organization
 * Security: Owner or Admin only
 */
export const removeMember = mutation({
  args: {
    organizationId: v.id('organizations'),
    targetMemberId: v.id('teamMembers'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Check caller permissions
    const callerMembership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!callerMembership || !['owner', 'admin'].includes(callerMembership.role)) {
      throw new Error('Only owners and admins can remove members');
    }

    const targetMember = await ctx.db.get(args.targetMemberId);
    if (!targetMember || targetMember.organizationId !== args.organizationId) {
      throw new Error('Member not found in this organization');
    }

    // Can't remove owner
    if (targetMember.role === 'owner') {
      throw new Error('Cannot remove the owner from the organization');
    }

    // Can't remove yourself (use leaveOrganization instead)
    if (targetMember.userId === userId) {
      throw new Error('Cannot remove yourself. Use the leave organization option instead.');
    }

    // Admins can't remove other admins
    if (callerMembership.role === 'admin' && targetMember.role === 'admin') {
      throw new Error('Admins cannot remove other admins');
    }

    const targetUser = await ctx.db.get(targetMember.userId);

    // Remove from team
    await ctx.db.delete(args.targetMemberId);

    // Clear user's organizationId
    if (targetUser) {
      await ctx.db.patch(targetMember.userId, { organizationId: undefined });
    }

    // Audit log
    await ctx.db.insert('teamAuditLogs', {
      organizationId: args.organizationId,
      actorId: userId,
      targetUserId: targetMember.userId,
      action: 'member_removed',
      details: { email: targetUser?.email },
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Leave organization (self-removal for non-owner members)
 * Security: Authenticated member, cannot be owner
 */
export const leaveOrganization = mutation({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const membership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!membership) {
      throw new Error('You are not a member of this organization');
    }

    if (membership.role === 'owner') {
      throw new Error('Owners cannot leave. Transfer ownership first.');
    }

    // Remove membership
    await ctx.db.delete(membership._id);

    // Clear organizationId
    await ctx.db.patch(userId, { organizationId: undefined });

    // Audit log
    const user = await ctx.db.get(userId);
    await ctx.db.insert('teamAuditLogs', {
      organizationId: args.organizationId,
      actorId: userId,
      action: 'member_left',
      details: { email: user?.email },
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Transfer organization ownership
 * Security: Current owner only
 */
export const transferOwnership = mutation({
  args: {
    organizationId: v.id('organizations'),
    targetMemberId: v.id('teamMembers'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Verify caller is the owner
    const callerMembership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!callerMembership || callerMembership.role !== 'owner') {
      throw new Error('Only the owner can transfer ownership');
    }

    const targetMember = await ctx.db.get(args.targetMemberId);
    if (!targetMember || targetMember.organizationId !== args.organizationId) {
      throw new Error('Target member not found in this organization');
    }

    if (targetMember.userId === userId) {
      throw new Error('You already own this organization');
    }

    const now = Date.now();

    // Promote target to owner
    await ctx.db.patch(args.targetMemberId, { role: 'owner', updatedAt: now });

    // Demote current owner to admin
    await ctx.db.patch(callerMembership._id, { role: 'admin', updatedAt: now });

    // Update org.ownerId
    await ctx.db.patch(args.organizationId, { ownerId: targetMember.userId, updatedAt: now });

    // Audit log
    const targetUser = await ctx.db.get(targetMember.userId);
    await ctx.db.insert('teamAuditLogs', {
      organizationId: args.organizationId,
      actorId: userId,
      targetUserId: targetMember.userId,
      action: 'ownership_transferred',
      details: { newOwnerEmail: targetUser?.email },
      createdAt: now,
    });

    return { success: true };
  },
});

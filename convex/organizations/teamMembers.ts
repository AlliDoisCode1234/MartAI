/**
 * Team Members Management
 *
 * Phase 3: Enterprise - Invite, manage, and remove team members
 */

import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { auth } from '../auth';

/**
 * Get team members for an organization
 */
export const getTeamMembers = query({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    // Check if user is a member of this org
    const membership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!membership) {
      return [];
    }

    // Get all members
    const members = await ctx.db
      .query('teamMembers')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .collect();

    // Enrich with user details
    const enrichedMembers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user: user
            ? {
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
 * Invite a new team member
 */
export const inviteMember = mutation({
  args: {
    organizationId: v.id('organizations'),
    email: v.string(),
    role: v.union(v.literal('admin'), v.literal('editor'), v.literal('viewer')),
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

    // Check org member limit
    const org = await ctx.db.get(args.organizationId);
    if (!org) {
      throw new Error('Organization not found');
    }

    const currentMembers = await ctx.db
      .query('teamMembers')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .collect();

    if (org.maxMembers && currentMembers.length >= org.maxMembers) {
      throw new Error(`Organization has reached the maximum of ${org.maxMembers} members`);
    }

    // Check if already invited
    const existingInvite = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .filter((q) =>
        q.and(
          q.eq(q.field('organizationId'), args.organizationId),
          q.eq(q.field('status'), 'pending')
        )
      )
      .first();

    if (existingInvite) {
      throw new Error('User already has a pending invitation');
    }

    // Generate invite token
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    await ctx.db.insert('organizationInvitations', {
      organizationId: args.organizationId,
      email: args.email,
      role: args.role,
      invitedBy: userId,
      token,
      expiresAt,
      status: 'pending',
      createdAt: Date.now(),
    });

    // TODO: Send invitation email

    return { success: true, token };
  },
});

/**
 * Accept an invitation
 */
export const acceptInvitation = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const invitation = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!invitation) {
      throw new Error('Invalid invitation');
    }

    if (invitation.status !== 'pending') {
      throw new Error('Invitation is no longer valid');
    }

    if (Date.now() > invitation.expiresAt) {
      await ctx.db.patch(invitation._id, { status: 'expired' });
      throw new Error('Invitation has expired');
    }

    // Check if user email matches invitation
    const user = await ctx.db.get(userId);
    if (user?.email !== invitation.email) {
      throw new Error('Invitation email does not match your account');
    }

    const now = Date.now();

    // Create team membership
    await ctx.db.insert('teamMembers', {
      userId,
      organizationId: invitation.organizationId,
      role: invitation.role,
      status: 'active',
      invitedBy: invitation.invitedBy,
      invitedAt: invitation.createdAt,
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // Update invitation status
    await ctx.db.patch(invitation._id, { status: 'accepted' });

    return { success: true, organizationId: invitation.organizationId };
  },
});

/**
 * Update a team member's role
 */
export const updateMemberRole = mutation({
  args: {
    memberId: v.id('teamMembers'),
    role: v.union(v.literal('admin'), v.literal('editor'), v.literal('viewer')),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const targetMember = await ctx.db.get(args.memberId);
    if (!targetMember) {
      throw new Error('Member not found');
    }

    // Can't change owner role
    if (targetMember.role === 'owner') {
      throw new Error('Cannot change owner role');
    }

    // Check if current user is owner or admin
    const myMembership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', targetMember.organizationId)
      )
      .first();

    if (!myMembership || !['owner', 'admin'].includes(myMembership.role)) {
      throw new Error('Insufficient permissions');
    }

    // Admins can't change other admins
    if (myMembership.role === 'admin' && targetMember.role === 'admin') {
      throw new Error('Admins cannot modify other admins');
    }

    await ctx.db.patch(args.memberId, {
      role: args.role,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Remove a team member
 */
export const removeMember = mutation({
  args: { memberId: v.id('teamMembers') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const targetMember = await ctx.db.get(args.memberId);
    if (!targetMember) {
      throw new Error('Member not found');
    }

    // Can't remove owner
    if (targetMember.role === 'owner') {
      throw new Error('Cannot remove the owner');
    }

    // Check permissions
    const myMembership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', targetMember.organizationId)
      )
      .first();

    // Users can remove themselves
    if (targetMember.userId === userId) {
      await ctx.db.delete(args.memberId);
      return { success: true };
    }

    // Otherwise need owner or admin
    if (!myMembership || !['owner', 'admin'].includes(myMembership.role)) {
      throw new Error('Insufficient permissions');
    }

    // Admins can't remove other admins
    if (myMembership.role === 'admin' && targetMember.role === 'admin') {
      throw new Error('Admins cannot remove other admins');
    }

    await ctx.db.delete(args.memberId);
    return { success: true };
  },
});

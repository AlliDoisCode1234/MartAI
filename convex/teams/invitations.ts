import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { api } from '../_generated/api';
import { getAuthUserId } from '@convex-dev/auth/server';

/**
 * Team Invitation Mutations
 *
 * Security: All mutations check auth and RBAC permissions
 * Tokens: UUID v4 format with 7-day expiry
 * Audit: All changes are logged to teamAuditLogs
 */

// Generate UUID v4 token (cryptographically random)
function generateInviteToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Set version 4 bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set variant bits
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// 7 days in milliseconds
const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

// ========================================
// QUERIES
// ========================================

/**
 * Get pending invitations for an organization
 */
export const getPendingInvitations = query({
  args: { organizationId: v.id('organizations') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Verify caller is a member with invite permissions
    const membership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      throw new Error('Insufficient permissions to view invitations');
    }

    const invitations = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .collect();

    // Enrich with inviter info
    const enriched = await Promise.all(
      invitations.map(async (inv) => {
        const inviter = await ctx.db.get(inv.invitedBy);
        return {
          ...inv,
          inviterName: inviter?.name,
          isExpired: inv.expiresAt < Date.now(),
        };
      })
    );

    return enriched;
  },
});

/**
 * Validate an invitation token (for accept page)
 */
export const validateInviteToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!invitation) {
      return { valid: false, error: 'Invitation not found' };
    }

    if (invitation.status !== 'pending') {
      return { valid: false, error: 'Invitation already used or revoked' };
    }

    if (invitation.expiresAt < Date.now()) {
      return { valid: false, error: 'Invitation has expired' };
    }

    const org = await ctx.db.get(invitation.organizationId);

    return {
      valid: true,
      invitation: {
        email: invitation.email,
        role: invitation.role,
        organizationName: org?.name,
      },
    };
  },
});

// ========================================
// MUTATIONS
// ========================================

/**
 * Create invitation
 * Security: Owner or Admin only
 * Validates: Seat limits, duplicate emails
 */
export const createInvitation = mutation({
  args: {
    organizationId: v.id('organizations'),
    email: v.string(),
    role: v.union(v.literal('admin'), v.literal('editor'), v.literal('viewer')),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error('Invalid email format');
    }

    // Check caller permissions
    const callerMembership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', args.organizationId)
      )
      .first();

    if (!callerMembership || !['owner', 'admin'].includes(callerMembership.role)) {
      throw new Error('Only owners and admins can invite members');
    }

    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error('Organization not found');

    // Check seat limits
    const activeMembers = await ctx.db
      .query('teamMembers')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();

    const pendingInvites = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_org', (q) => q.eq('organizationId', args.organizationId))
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .collect();

    const maxSeats = org.seatsPurchased ?? org.maxMembers ?? 1;
    const usedSeats = activeMembers.length + pendingInvites.length;

    if (usedSeats >= maxSeats) {
      throw new Error(
        `Seat limit reached (${usedSeats}/${maxSeats}). Upgrade your plan for more seats.`
      );
    }

    // Check for existing pending invite to same email
    const existingInvite = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .filter((q) =>
        q.and(
          q.eq(q.field('organizationId'), args.organizationId),
          q.eq(q.field('status'), 'pending')
        )
      )
      .first();

    if (existingInvite) {
      throw new Error('An invitation has already been sent to this email');
    }

    // Check if user is already a member
    const existingUser = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email.toLowerCase()))
      .first();

    if (existingUser) {
      const existingMembership = await ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) =>
          q.eq('userId', existingUser._id).eq('organizationId', args.organizationId)
        )
        .first();

      if (existingMembership && existingMembership.status === 'active') {
        throw new Error('This user is already a member of the organization');
      }
    }

    // Create invitation
    const token = generateInviteToken();
    const now = Date.now();

    const inviteId = await ctx.db.insert('organizationInvitations', {
      organizationId: args.organizationId,
      email: args.email.toLowerCase(),
      role: args.role,
      invitedBy: userId,
      token,
      expiresAt: now + INVITE_EXPIRY_MS,
      status: 'pending',
      createdAt: now,
    });

    // Audit log
    await ctx.db.insert('teamAuditLogs', {
      organizationId: args.organizationId,
      actorId: userId,
      action: 'member_invited',
      details: { email: args.email.toLowerCase(), newRole: args.role },
      createdAt: now,
    });

    return { inviteId, token };
  },
});

/**
 * Accept invitation
 * Security: Authenticated user, email must match
 */
export const acceptInvitation = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.get(userId);
    if (!user?.email) throw new Error('User email not found');

    const invitation = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new Error('Invitation already used or revoked');
    }

    if (invitation.expiresAt < Date.now()) {
      await ctx.db.patch(invitation._id, { status: 'expired' });
      throw new Error('Invitation has expired');
    }

    // Verify email matches
    if (invitation.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new Error('This invitation was sent to a different email address');
    }

    // Check if user already belongs to an organization
    if (user.organizationId) {
      throw new Error('You already belong to an organization. Multi-org support coming soon.');
    }

    const now = Date.now();

    // Add to team
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

    // Update user's organizationId
    await ctx.db.patch(userId, { organizationId: invitation.organizationId });

    // Mark invitation as accepted
    await ctx.db.patch(invitation._id, { status: 'accepted' });

    // Audit log
    await ctx.db.insert('teamAuditLogs', {
      organizationId: invitation.organizationId,
      actorId: userId,
      action: 'member_joined',
      details: { email: user.email, newRole: invitation.role },
      createdAt: now,
    });

    // Notify inviter via email (fire-and-forget)
    const inviter = await ctx.db.get(invitation.invitedBy);
    const org = await ctx.db.get(invitation.organizationId);
    if (inviter?.email) {
      ctx.scheduler.runAfter(0, api.email.emailActions.sendInviteAcceptedEmail, {
        inviterEmail: inviter.email,
        memberName: user.name,
        memberEmail: user.email,
        orgName: org?.name,
        role: invitation.role,
      });
    }

    return { success: true, organizationId: invitation.organizationId };
  },
});

/**
 * Revoke invitation
 * Security: Owner or Admin only
 */
export const revokeInvitation = mutation({
  args: {
    invitationId: v.id('organizationInvitations'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) throw new Error('Invitation not found');

    // Check caller permissions
    const callerMembership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', invitation.organizationId)
      )
      .first();

    if (!callerMembership || !['owner', 'admin'].includes(callerMembership.role)) {
      throw new Error('Only owners and admins can revoke invitations');
    }

    if (invitation.status !== 'pending') {
      throw new Error('Can only revoke pending invitations');
    }

    await ctx.db.patch(args.invitationId, { status: 'revoked' });

    // Audit log
    await ctx.db.insert('teamAuditLogs', {
      organizationId: invitation.organizationId,
      actorId: userId,
      action: 'invite_revoked',
      details: { email: invitation.email },
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

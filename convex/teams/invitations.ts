import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { api, internal } from '../_generated/api';
import { getAuthUserId } from '@convex-dev/auth/server';
import { hashToken, generateSecureToken } from '../lib/hashing';
import { getMaxSeatsForTier } from '../lib/tierLimits';
import { BI_EVENTS } from '../lib/eventTypes';

/**
 * Team Invitation Mutations
 *
 * Security: All mutations check auth and RBAC permissions
 * Tokens: Secure random tokens, SHA-256 hashed before storage
 * Audit: All changes are logged to teamAuditLogs
 */

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
    // Hash the incoming token to match storage format
    const tokenHash = await hashToken(args.token);

    const invitation = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_token', (q) => q.eq('token', tokenHash))
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
      .filter((q) =>
        q.and(
          q.eq(q.field('status'), 'pending'),
          q.gt(q.field('expiresAt'), Date.now()) // GAP-7: exclude expired invites from seat count
        )
      )
      .collect();

    // Dynamically calculate max seats from owner's current tier (not stale org.maxMembers)
    // This matches the same logic as getSeatUsage in teams.ts
    const owner = await ctx.db.get(org.ownerId);
    let maxSeats = 1; // Default for starter
    if (owner?.membershipTier === 'engine') {
      maxSeats = 5;
    } else if (owner?.membershipTier === 'agency') {
      maxSeats = 25;
    } else if (owner?.membershipTier === 'enterprise') {
      maxSeats = org.seatsPurchased ?? org.maxMembers ?? 999;
    }
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

    // Create invitation with hashed token
    // Generate secure token, hash for storage, send original to user
    const token = generateSecureToken();
    const tokenHash = await hashToken(token);
    const now = Date.now();

    const inviteId = await ctx.db.insert('organizationInvitations', {
      organizationId: args.organizationId,
      email: args.email.toLowerCase(),
      role: args.role,
      invitedBy: userId,
      token: tokenHash, // Store hash, not plain token
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

    // Send invitation email with ORIGINAL token (not hash)
    const caller = await ctx.db.get(userId);
    ctx.scheduler.runAfter(0, api.email.emailActions.sendTeamInviteEmail, {
      email: args.email.toLowerCase(),
      inviterName: caller?.name,
      orgName: org.name,
      role: args.role,
      token, // Send original token to user
    });

    // BI Event: team_invite_sent (BI-5)
    ctx.scheduler.runAfter(0, internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.TEAM_INVITE_SENT,
      userId,
      properties: { organizationId: args.organizationId, email: args.email.toLowerCase(), role: args.role },
    });

    return { inviteId, token }; // Return original token for UI/testing
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

    // Hash the incoming token to match storage format
    const tokenHash = await hashToken(args.token);

    const invitation = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_token', (q) => q.eq('token', tokenHash))
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

    // Update user's organizationId and mark onboarding as complete
    // Team members joining via invite don't need onboarding - they're joining an existing org
    await ctx.db.patch(userId, {
      organizationId: invitation.organizationId,
      onboardingStatus: 'completed',
    });

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

    // Fire-and-forget HubSpot sync (team members skip normal onboarding)
    ctx.scheduler.runAfter(0, api.integrations.hubspot.syncUserToHubspot, {
      userId,
    });

    // BI Event: team_invite_accepted (BI-5)
    ctx.scheduler.runAfter(0, internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.TEAM_INVITE_ACCEPTED,
      userId,
      properties: { organizationId: invitation.organizationId, role: invitation.role },
    });

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

/**
 * Resend invitation (creates new token, revokes old one)
 * Security: Owner or Admin only
 */
export const resendInvitation = mutation({
  args: {
    invitationId: v.id('organizationInvitations'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const oldInvite = await ctx.db.get(args.invitationId);
    if (!oldInvite) throw new Error('Invitation not found');

    // Check caller permissions
    const callerMembership = await ctx.db
      .query('teamMembers')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('organizationId', oldInvite.organizationId)
      )
      .first();

    if (!callerMembership || !['owner', 'admin'].includes(callerMembership.role)) {
      throw new Error('Only owners and admins can resend invitations');
    }

    // Can only resend pending/expired invites
    if (oldInvite.status === 'accepted') {
      throw new Error('This invitation has already been accepted');
    }

    // Revoke old invite
    await ctx.db.patch(args.invitationId, { status: 'revoked' });

    // Re-check seat limits before creating new invite
    const org = await ctx.db.get(oldInvite.organizationId);
    if (!org) throw new Error('Organization not found');
    const owner = await ctx.db.get(org.ownerId);
    const maxSeats = getMaxSeatsForTier(owner?.membershipTier, org.seatsPurchased);
    const activeMembers = await ctx.db
      .query('teamMembers')
      .withIndex('by_org', (q) => q.eq('organizationId', oldInvite.organizationId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();
    const activePending = await ctx.db
      .query('organizationInvitations')
      .withIndex('by_org', (q) => q.eq('organizationId', oldInvite.organizationId))
      .filter((q) => q.and(
        q.eq(q.field('status'), 'pending'),
        q.gt(q.field('expiresAt'), Date.now())
      ))
      .collect();
    if (activeMembers.length + activePending.length >= maxSeats) {
      throw new Error(`Seat limit reached (${activeMembers.length + activePending.length}/${maxSeats}). Upgrade your plan.`);
    }

    // Create new invite with fresh token and expiry
    const newToken = generateSecureToken();
    const tokenHash = await hashToken(newToken);
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    await ctx.db.insert('organizationInvitations', {
      organizationId: oldInvite.organizationId,
      email: oldInvite.email,
      role: oldInvite.role,
      invitedBy: userId,
      token: tokenHash,
      expiresAt,
      status: 'pending',
      createdAt: now,
    });

    // Send email notification
    const inviter = await ctx.db.get(userId);

    await ctx.scheduler.runAfter(0, api.email.emailActions.sendEmail, {
      to: oldInvite.email,
      template: 'team_invite',
      data: {
        orgName: org?.name || 'your team',
        inviterName: inviter?.name || 'Your teammate',
        role: oldInvite.role,
        token: newToken,
      },
    });

    return { success: true };
  },
});

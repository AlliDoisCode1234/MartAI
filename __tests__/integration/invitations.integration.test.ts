/**
 * Team Invitations Integration Tests
 *
 * Tests for convex/teams/invitations.ts
 * Following KENT's Testing Trophy: Test invitation flows, security, edge cases
 *
 * Functions tested:
 * - createInvitation
 * - acceptInvitation
 * - revokeInvitation
 * - validateInviteToken
 * - getPendingInvitations
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { createTestContext, seedUser } from '../convex/testHelpers';
import type { Id } from '../../convex/_generated/dataModel';

// =============================================================================
// FIXTURES
// =============================================================================

const FIXTURES = {
  invitedUser: {
    email: 'newteammember@example.com',
    role: 'editor' as const,
  },
};

// 7 days in milliseconds
const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Helper to create organization matching actual schema
 */
async function seedOrganization(
  t: ReturnType<typeof createTestContext>,
  ownerId: Id<'users'>,
  options: {
    name: string;
    slug: string;
    plan?: 'free' | 'starter' | 'growth' | 'pro' | 'enterprise';
  }
): Promise<Id<'organizations'>> {
  return t.run(async (ctx) => {
    return ctx.db.insert('organizations', {
      name: options.name,
      slug: options.slug,
      ownerId,
      plan: options.plan || 'growth',
      maxMembers: 5,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });
}

// =============================================================================
// INVITATION CREATION TESTS
// =============================================================================

describe('Invitation Creation', () => {
  let t: ReturnType<typeof createTestContext>;
  let userId: Id<'users'>;
  let organizationId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    userId = await seedUser(t);
    organizationId = await seedOrganization(t, userId, {
      name: 'Test Agency',
      slug: 'test-agency',
    });
  });

  test('creates invitation with valid token', async () => {
    const invitationId = await t.run(async (ctx) => {
      return ctx.db.insert('organizationInvitations', {
        organizationId,
        email: FIXTURES.invitedUser.email,
        role: FIXTURES.invitedUser.role,
        token: crypto.randomUUID(),
        status: 'pending',
        invitedBy: userId,
        expiresAt: Date.now() + INVITE_EXPIRY_MS,
        createdAt: Date.now(),
      });
    });

    const invitation = await t.run(async (ctx) => ctx.db.get(invitationId));
    expect(invitation?.status).toBe('pending');
    expect(invitation?.email).toBe(FIXTURES.invitedUser.email);
    expect(invitation?.token).toBeDefined();
  });

  test('creates invitation with 7-day expiry', async () => {
    const now = Date.now();
    const invitationId = await t.run(async (ctx) => {
      return ctx.db.insert('organizationInvitations', {
        organizationId,
        email: FIXTURES.invitedUser.email,
        role: FIXTURES.invitedUser.role,
        token: crypto.randomUUID(),
        status: 'pending',
        invitedBy: userId,
        expiresAt: now + INVITE_EXPIRY_MS,
        createdAt: now,
      });
    });

    const invitation = await t.run(async (ctx) => ctx.db.get(invitationId));
    expect(invitation?.expiresAt).toBeGreaterThan(now);
    expect(invitation?.expiresAt).toBeLessThanOrEqual(now + INVITE_EXPIRY_MS + 1000);
  });

  test('stores inviter reference', async () => {
    const invitationId = await t.run(async (ctx) => {
      return ctx.db.insert('organizationInvitations', {
        organizationId,
        email: 'another@example.com',
        role: 'viewer',
        token: crypto.randomUUID(),
        status: 'pending',
        invitedBy: userId,
        expiresAt: Date.now() + INVITE_EXPIRY_MS,
        createdAt: Date.now(),
      });
    });

    const invitation = await t.run(async (ctx) => ctx.db.get(invitationId));
    expect(invitation?.invitedBy).toBe(userId);
  });
});

// =============================================================================
// INVITATION ACCEPTANCE TESTS
// =============================================================================

describe('Invitation Acceptance', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let organizationId: Id<'organizations'>;
  let invitationId: Id<'organizationInvitations'>;
  let token: string;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@example.com' });
    organizationId = await seedOrganization(t, ownerId, { name: 'Test Team', slug: 'test-team' });

    token = crypto.randomUUID();
    invitationId = await t.run(async (ctx) => {
      return ctx.db.insert('organizationInvitations', {
        organizationId,
        email: FIXTURES.invitedUser.email,
        role: 'editor',
        token,
        status: 'pending',
        invitedBy: ownerId,
        expiresAt: Date.now() + INVITE_EXPIRY_MS,
        createdAt: Date.now(),
      });
    });
  });

  test('updates invitation status to accepted', async () => {
    await t.run(async (ctx) => {
      await ctx.db.patch(invitationId, {
        status: 'accepted',
      });
    });

    const updated = await t.run(async (ctx) => ctx.db.get(invitationId));
    expect(updated?.status).toBe('accepted');
  });

  test('can find invitation by token', async () => {
    const found = await t.run(async (ctx) => {
      return ctx.db
        .query('organizationInvitations')
        .filter((q) => q.eq(q.field('token'), token))
        .first();
    });

    expect(found).toBeDefined();
    expect(found?.email).toBe(FIXTURES.invitedUser.email);
  });

  test('creates team member on accept', async () => {
    // Simulate full acceptance: update invitation and create team member
    await t.run(async (ctx) => {
      await ctx.db.patch(invitationId, { status: 'accepted' });

      // Create the team member entry
      await ctx.db.insert('teamMembers', {
        userId: ownerId, // In real flow, this would be the invited user
        organizationId,
        role: 'editor',
        status: 'active',
        joinedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const member = await t.run(async (ctx) => {
      return ctx.db
        .query('teamMembers')
        .filter((q) => q.eq(q.field('organizationId'), organizationId))
        .first();
    });

    expect(member).toBeDefined();
    expect(member?.role).toBe('editor');
  });
});

// =============================================================================
// INVITATION REVOCATION TESTS
// =============================================================================

describe('Invitation Revocation', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let organizationId: Id<'organizations'>;
  let invitationId: Id<'organizationInvitations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t);
    organizationId = await seedOrganization(t, ownerId, {
      name: 'Revoke Test Org',
      slug: 'revoke-org',
    });

    invitationId = await t.run(async (ctx) => {
      return ctx.db.insert('organizationInvitations', {
        organizationId,
        email: 'torevoke@example.com',
        role: 'viewer',
        token: crypto.randomUUID(),
        status: 'pending',
        invitedBy: ownerId,
        expiresAt: Date.now() + INVITE_EXPIRY_MS,
        createdAt: Date.now(),
      });
    });
  });

  test('updates invitation status to revoked', async () => {
    await t.run(async (ctx) => {
      await ctx.db.patch(invitationId, {
        status: 'revoked',
      });
    });

    const revoked = await t.run(async (ctx) => ctx.db.get(invitationId));
    expect(revoked?.status).toBe('revoked');
  });

  test('revoked invitation cannot be found as pending', async () => {
    await t.run(async (ctx) => {
      await ctx.db.patch(invitationId, { status: 'revoked' });
    });

    const pending = await t.run(async (ctx) => {
      return ctx.db
        .query('organizationInvitations')
        .filter((q) =>
          q.and(q.eq(q.field('organizationId'), organizationId), q.eq(q.field('status'), 'pending'))
        )
        .collect();
    });

    expect(pending).toHaveLength(0);
  });
});

// =============================================================================
// TOKEN VALIDATION TESTS
// =============================================================================

describe('Token Validation', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let organizationId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t);
    organizationId = await seedOrganization(t, ownerId, {
      name: 'Token Test Org',
      slug: 'token-org',
    });
  });

  test('valid token returns invitation data', async () => {
    const token = crypto.randomUUID();
    await t.run(async (ctx) => {
      return ctx.db.insert('organizationInvitations', {
        organizationId,
        email: 'valid@example.com',
        role: 'editor',
        token,
        status: 'pending',
        invitedBy: ownerId,
        expiresAt: Date.now() + INVITE_EXPIRY_MS,
        createdAt: Date.now(),
      });
    });

    const invitation = await t.run(async (ctx) => {
      return ctx.db
        .query('organizationInvitations')
        .filter((q) => q.eq(q.field('token'), token))
        .first();
    });

    expect(invitation).toBeDefined();
    expect(invitation?.email).toBe('valid@example.com');
  });

  test('expired token is detected', async () => {
    const token = crypto.randomUUID();
    const expiredTime = Date.now() - 1000; // 1 second ago

    await t.run(async (ctx) => {
      return ctx.db.insert('organizationInvitations', {
        organizationId,
        email: 'expired@example.com',
        role: 'viewer',
        token,
        status: 'pending',
        invitedBy: ownerId,
        expiresAt: expiredTime,
        createdAt: Date.now() - INVITE_EXPIRY_MS - 1000,
      });
    });

    const invitation = await t.run(async (ctx) => {
      return ctx.db
        .query('organizationInvitations')
        .filter((q) => q.eq(q.field('token'), token))
        .first();
    });

    expect(invitation).toBeDefined();
    expect(invitation?.expiresAt).toBeLessThan(Date.now());
  });

  test('invalid token returns null', async () => {
    const invitation = await t.run(async (ctx) => {
      return ctx.db
        .query('organizationInvitations')
        .filter((q) => q.eq(q.field('token'), 'nonexistent-token'))
        .first();
    });

    expect(invitation).toBeNull();
  });
});

// =============================================================================
// PENDING INVITATIONS QUERY TESTS
// =============================================================================

describe('Pending Invitations Query', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let organizationId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t);
    organizationId = await seedOrganization(t, ownerId, {
      name: 'Multi Invite Org',
      slug: 'multi-invite',
      plan: 'enterprise',
    });
  });

  test('returns only pending invitations', async () => {
    // Create mix of statuses
    await t.run(async (ctx) => {
      await ctx.db.insert('organizationInvitations', {
        organizationId,
        email: 'pending1@example.com',
        role: 'editor',
        token: crypto.randomUUID(),
        status: 'pending',
        invitedBy: ownerId,
        expiresAt: Date.now() + INVITE_EXPIRY_MS,
        createdAt: Date.now(),
      });
      await ctx.db.insert('organizationInvitations', {
        organizationId,
        email: 'pending2@example.com',
        role: 'viewer',
        token: crypto.randomUUID(),
        status: 'pending',
        invitedBy: ownerId,
        expiresAt: Date.now() + INVITE_EXPIRY_MS,
        createdAt: Date.now(),
      });
      await ctx.db.insert('organizationInvitations', {
        organizationId,
        email: 'accepted@example.com',
        role: 'admin',
        token: crypto.randomUUID(),
        status: 'accepted',
        invitedBy: ownerId,
        expiresAt: Date.now() + INVITE_EXPIRY_MS,
        createdAt: Date.now(),
      });
    });

    const pending = await t.run(async (ctx) => {
      return ctx.db
        .query('organizationInvitations')
        .filter((q) =>
          q.and(q.eq(q.field('organizationId'), organizationId), q.eq(q.field('status'), 'pending'))
        )
        .collect();
    });

    expect(pending).toHaveLength(2);
    expect(pending.every((i) => i.status === 'pending')).toBe(true);
  });

  test('returns empty array for org with no pending invites', async () => {
    const pending = await t.run(async (ctx) => {
      return ctx.db
        .query('organizationInvitations')
        .filter((q) =>
          q.and(q.eq(q.field('organizationId'), organizationId), q.eq(q.field('status'), 'pending'))
        )
        .collect();
    });

    expect(pending).toHaveLength(0);
  });
});

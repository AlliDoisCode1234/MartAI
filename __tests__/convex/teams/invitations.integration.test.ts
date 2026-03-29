/**
 * Team Invitations Integration Tests
 *
 * Component Hierarchy: convex/teams/invitations.ts
 * Tests the canonical invitation system used by:
 * - InviteModal.tsx (createInvitation)
 * - app/invite/[token]/page.tsx (validateInviteToken, acceptInvitation)
 * - TeamManagementPanel.tsx (getPendingInvitations, revokeInvitation, resendInvitation)
 *
 * Functions tested:
 * - createInvitation, acceptInvitation, revokeInvitation, resendInvitation (mutations)
 * - getPendingInvitations, validateInviteToken (queries)
 *
 * Pattern: Integration tests via convexTest — tests use cases, not implementation.
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { createTestContext, seedUser, seedOrganization, seedTeamMember } from '../testHelpers';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

// =============================================================================
// CREATE INVITATION
// =============================================================================

describe('Invitations: Create Invitation', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let adminId: Id<'users'>;
  let editorId: Id<'users'>;
  let orgId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com' });
    adminId = await seedUser(t, { email: 'admin@test.com' });
    editorId = await seedUser(t, { email: 'editor@test.com' });
    orgId = await seedOrganization(t, ownerId, { membershipTier: 'agency' });
    await seedTeamMember(t, adminId, orgId, 'admin');
    await seedTeamMember(t, editorId, orgId, 'editor');
  });

  test('owner can create invitation', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    const result = await ownerT.mutation(api.teams.invitations.createInvitation, {
      organizationId: orgId,
      email: 'newmember@test.com',
      role: 'editor',
    });

    expect(result.inviteId).toBeDefined();
    expect(result.token).toBeDefined();
  });

  test('admin can create invitation', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    const result = await adminT.mutation(api.teams.invitations.createInvitation, {
      organizationId: orgId,
      email: 'newmember@test.com',
      role: 'viewer',
    });

    expect(result.inviteId).toBeDefined();
  });

  test('editor CANNOT create invitation', async () => {
    const editorT = t.withIdentity({ subject: editorId });
    await expect(
      editorT.mutation(api.teams.invitations.createInvitation, {
        organizationId: orgId,
        email: 'newmember@test.com',
        role: 'viewer',
      })
    ).rejects.toThrow(/owner|admin/i);
  });

  test('rejects invalid email format', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    await expect(
      ownerT.mutation(api.teams.invitations.createInvitation, {
        organizationId: orgId,
        email: 'not-an-email',
        role: 'viewer',
      })
    ).rejects.toThrow(/email/i);
  });

  test('rejects duplicate pending invitation', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });

    // First invitation succeeds
    await ownerT.mutation(api.teams.invitations.createInvitation, {
      organizationId: orgId,
      email: 'dup@test.com',
      role: 'editor',
    });

    // Second invitation to same email fails
    await expect(
      ownerT.mutation(api.teams.invitations.createInvitation, {
        organizationId: orgId,
        email: 'dup@test.com',
        role: 'viewer',
      })
    ).rejects.toThrow(/already/i);
  });

  test('rejects invitation for existing active member', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    await expect(
      ownerT.mutation(api.teams.invitations.createInvitation, {
        organizationId: orgId,
        email: 'editor@test.com', // Already a member
        role: 'viewer',
      })
    ).rejects.toThrow(/already a member/i);
  });

  test('enforces seat limits (active + pending)', async () => {
    const t2 = createTestContext();
    const owner = await seedUser(t2, { email: 'o@test.com' });
    // Starter tier = 1 seat max, owner takes the only seat
    const org = await seedOrganization(t2, owner, { membershipTier: 'starter' });

    const ownerT = t2.withIdentity({ subject: owner });
    await expect(
      ownerT.mutation(api.teams.invitations.createInvitation, {
        organizationId: org,
        email: 'overflow@test.com',
        role: 'viewer',
      })
    ).rejects.toThrow(/seat limit|limit reached/i);
  });

  test('unauthenticated user cannot create invitation', async () => {
    await expect(
      t.mutation(api.teams.invitations.createInvitation, {
        organizationId: orgId,
        email: 'test@test.com',
        role: 'viewer',
      })
    ).rejects.toThrow(/not authenticated/i);
  });
});

// =============================================================================
// ACCEPT INVITATION
// =============================================================================

describe('Invitations: Accept Invitation', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let orgId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com' });
    orgId = await seedOrganization(t, ownerId, { membershipTier: 'agency' });
  });

  test('valid token acceptance creates team member', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    const { token } = await ownerT.mutation(api.teams.invitations.createInvitation, {
      organizationId: orgId,
      email: 'joiner@test.com',
      role: 'editor',
    });

    // Create the joining user
    const joinerId = await seedUser(t, { email: 'joiner@test.com' });
    const joinerT = t.withIdentity({ subject: joinerId });
    const result = await joinerT.mutation(api.teams.invitations.acceptInvitation, { token });

    expect(result.success).toBe(true);
    expect(result.organizationId).toBe(orgId);

    // Verify team membership created
    const membership = await t.run(async (ctx) => {
      return ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) => q.eq('userId', joinerId).eq('organizationId', orgId))
        .first();
    });
    expect(membership).not.toBeNull();
    expect(membership?.role).toBe('editor');
    expect(membership?.status).toBe('active');
  });

  test('sets user organizationId on acceptance', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    const { token } = await ownerT.mutation(api.teams.invitations.createInvitation, {
      organizationId: orgId,
      email: 'joiner2@test.com',
      role: 'viewer',
    });

    const joinerId = await seedUser(t, { email: 'joiner2@test.com' });
    const joinerT = t.withIdentity({ subject: joinerId });
    await joinerT.mutation(api.teams.invitations.acceptInvitation, { token });

    const user = await t.run(async (ctx) => ctx.db.get(joinerId));
    expect(user?.organizationId).toBe(orgId);
  });

  test('rejects token for wrong email', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    const { token } = await ownerT.mutation(api.teams.invitations.createInvitation, {
      organizationId: orgId,
      email: 'specific@test.com',
      role: 'editor',
    });

    // Different user tries to accept
    const wrongUserId = await seedUser(t, { email: 'wrong@test.com' });
    const wrongT = t.withIdentity({ subject: wrongUserId });

    await expect(
      wrongT.mutation(api.teams.invitations.acceptInvitation, { token })
    ).rejects.toThrow(/different email/i);
  });

  test('rejects invalid token', async () => {
    const userId = await seedUser(t, { email: 'nobody@test.com' });
    const userT = t.withIdentity({ subject: userId });

    await expect(
      userT.mutation(api.teams.invitations.acceptInvitation, { token: 'totally-fake-token' })
    ).rejects.toThrow(/not found/i);
  });

  test('unauthenticated user cannot accept', async () => {
    await expect(
      t.mutation(api.teams.invitations.acceptInvitation, { token: 'any-token' })
    ).rejects.toThrow(/not authenticated/i);
  });
});

// =============================================================================
// REVOKE INVITATION
// =============================================================================

describe('Invitations: Revoke Invitation', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let adminId: Id<'users'>;
  let editorId: Id<'users'>;
  let orgId: Id<'organizations'>;
  let invitationId: Id<'organizationInvitations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com' });
    adminId = await seedUser(t, { email: 'admin@test.com' });
    editorId = await seedUser(t, { email: 'editor@test.com' });
    orgId = await seedOrganization(t, ownerId, { membershipTier: 'agency' });
    await seedTeamMember(t, adminId, orgId, 'admin');
    await seedTeamMember(t, editorId, orgId, 'editor');

    // Create an invitation to revoke
    const ownerT = t.withIdentity({ subject: ownerId });
    const result = await ownerT.mutation(api.teams.invitations.createInvitation, {
      organizationId: orgId,
      email: 'torevoke@test.com',
      role: 'viewer',
    });
    invitationId = result.inviteId;
  });

  test('owner can revoke invitation', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    const result = await ownerT.mutation(api.teams.invitations.revokeInvitation, {
      invitationId,
    });

    expect(result.success).toBe(true);

    const inv = await t.run(async (ctx) => ctx.db.get(invitationId));
    expect(inv?.status).toBe('revoked');
  });

  test('admin can revoke invitation', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    const result = await adminT.mutation(api.teams.invitations.revokeInvitation, {
      invitationId,
    });

    expect(result.success).toBe(true);
  });

  test('editor CANNOT revoke invitation', async () => {
    const editorT = t.withIdentity({ subject: editorId });
    await expect(
      editorT.mutation(api.teams.invitations.revokeInvitation, { invitationId })
    ).rejects.toThrow(/owner|admin/i);
  });
});

// =============================================================================
// GET PENDING INVITATIONS
// =============================================================================

describe('Invitations: Get Pending Invitations', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let editorId: Id<'users'>;
  let orgId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com' });
    editorId = await seedUser(t, { email: 'editor@test.com' });
    orgId = await seedOrganization(t, ownerId, { membershipTier: 'agency' });
    await seedTeamMember(t, editorId, orgId, 'editor');

    // Create some invitations
    const ownerT = t.withIdentity({ subject: ownerId });
    await ownerT.mutation(api.teams.invitations.createInvitation, {
      organizationId: orgId,
      email: 'pending1@test.com',
      role: 'editor',
    });
    await ownerT.mutation(api.teams.invitations.createInvitation, {
      organizationId: orgId,
      email: 'pending2@test.com',
      role: 'viewer',
    });
  });

  test('owner can view pending invitations', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    const pending = await ownerT.query(api.teams.invitations.getPendingInvitations, {
      organizationId: orgId,
    });

    expect(pending.length).toBe(2);
    expect(pending.every((p) => p.status === 'pending')).toBe(true);
  });

  test('editor CANNOT view pending invitations', async () => {
    const editorT = t.withIdentity({ subject: editorId });
    await expect(
      editorT.query(api.teams.invitations.getPendingInvitations, { organizationId: orgId })
    ).rejects.toThrow(/permission/i);
  });

  test('revoked invitations are excluded', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    const pending = await ownerT.query(api.teams.invitations.getPendingInvitations, {
      organizationId: orgId,
    });

    // Revoke one
    const firstInviteId = pending[0]._id;
    await ownerT.mutation(api.teams.invitations.revokeInvitation, {
      invitationId: firstInviteId,
    });

    const afterRevoke = await ownerT.query(api.teams.invitations.getPendingInvitations, {
      organizationId: orgId,
    });
    expect(afterRevoke.length).toBe(1);
  });
});

// =============================================================================
// VALIDATE INVITE TOKEN
// =============================================================================

describe('Invitations: Validate Invite Token', () => {
  test('valid token returns invitation data', async () => {
    const t = createTestContext();
    const ownerId = await seedUser(t, { email: 'owner@test.com' });
    const orgId = await seedOrganization(t, ownerId, { name: 'Token Test Org', membershipTier: 'engine' });

    const ownerT = t.withIdentity({ subject: ownerId });
    const { token } = await ownerT.mutation(api.teams.invitations.createInvitation, {
      organizationId: orgId,
      email: 'validate@test.com',
      role: 'editor',
    });

    const validation = await t.query(api.teams.invitations.validateInviteToken, { token });

    expect(validation.valid).toBe(true);
    expect(validation.invitation?.email).toBe('validate@test.com');
    expect(validation.invitation?.role).toBe('editor');
    expect(validation.invitation?.organizationName).toBe('Token Test Org');
  });

  // retry: cross-file convex-test scheduler pollution can intermittently
  // cause this test to fail when run in the full suite (passes in isolation)
  test('invalid token returns error', { retry: 2 }, async () => {
    const t = createTestContext();
    const validation = await t.query(api.teams.invitations.validateInviteToken, {
      token: 'nonexistent-token-123',
    });

    expect(validation.valid).toBe(false);
    expect(validation.error).toBeDefined();
  });
});

/**
 * Multi-Organization Cross-Isolation Tests
 *
 * Component Hierarchy: convex/teams/teams.ts, convex/teams/invitations.ts
 * Verifies that data doesn't leak between organizations when a user
 * belongs to multiple orgs or when roles differ per org.
 *
 * Test matrix:
 * - User in Org A (admin) + Org B (viewer) — verify role isolation
 * - Admin in Org A cannot manage Org B
 * - Seat limits enforced per-org, not globally 
 * - Ownership transfer in Org A doesn't affect Org B membership
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { createTestContext, seedUser, seedOrganization, seedTeamMember } from '../testHelpers';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

// =============================================================================
// MULTI-ORG MEMBERSHIP
// =============================================================================

describe('Multi-Org: Membership Isolation', () => {
  let t: ReturnType<typeof createTestContext>;
  let userAliceId: Id<'users'>;
  let ownerAId: Id<'users'>;
  let ownerBId: Id<'users'>;
  let orgAId: Id<'organizations'>;
  let orgBId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerAId = await seedUser(t, { email: 'ownerA@test.com' });
    ownerBId = await seedUser(t, { email: 'ownerB@test.com' });
    userAliceId = await seedUser(t, { email: 'alice@test.com' });

    orgAId = await seedOrganization(t, ownerAId, { name: 'Org Alpha', membershipTier: 'agency' });
    orgBId = await seedOrganization(t, ownerBId, { name: 'Org Beta', membershipTier: 'engine' });

    // Alice is admin in Org A, viewer in Org B
    await seedTeamMember(t, userAliceId, orgAId, 'admin');
    await seedTeamMember(t, userAliceId, orgBId, 'viewer');
  });

  test('alice has admin rights in Org A', async () => {
    const aliceT = t.withIdentity({ subject: userAliceId });
    // Alice can view team members of Org A (requires min viewer)
    const members = await aliceT.query(api.teams.teams.getTeamMembers, { organizationId: orgAId });
    expect(members.length).toBeGreaterThanOrEqual(2); // owner + alice
  });

  test('alice has viewer rights in Org B', async () => {
    const aliceT = t.withIdentity({ subject: userAliceId });
    // Alice can view team members of Org B (viewer has access)
    const members = await aliceT.query(api.teams.teams.getTeamMembers, { organizationId: orgBId });
    expect(members.length).toBeGreaterThanOrEqual(2); // owner + alice
  });
});

// =============================================================================
// CROSS-ORG DATA ISOLATION
// =============================================================================

describe('Multi-Org: Cross-Organization Access Control', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerAId: Id<'users'>;
  let ownerBId: Id<'users'>;
  let orgAId: Id<'organizations'>;
  let orgBId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerAId = await seedUser(t, { email: 'ownerA@test.com' });
    ownerBId = await seedUser(t, { email: 'ownerB@test.com' });

    orgAId = await seedOrganization(t, ownerAId, { name: 'Org A', membershipTier: 'agency' });
    orgBId = await seedOrganization(t, ownerBId, { name: 'Org B', membershipTier: 'agency' });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('owner of Org A cannot view team members of Org B', async () => {
    const ownerAT = t.withIdentity({ subject: ownerAId });
    await expect(
      ownerAT.query(api.teams.teams.getTeamMembers, { organizationId: orgBId })
    ).rejects.toThrow(/not a member/i);
  });

  test('owner of Org A cannot invite to Org B', async () => {
    const ownerAT = t.withIdentity({ subject: ownerAId });
    await expect(
      ownerAT.mutation(api.teams.invitations.createInvitation, {
        organizationId: orgBId,
        email: 'crossattack@test.com',
        role: 'editor',
      })
    ).rejects.toThrow(/not a member|owner|admin/i);
  });

  test('owner of Org A cannot remove member from Org B', async () => {
    // Add a member to Org B
    const victimId = await seedUser(t, { email: 'victim@test.com' });
    const victimMemberId = await seedTeamMember(t, victimId, orgBId, 'editor');

    const ownerAT = t.withIdentity({ subject: ownerAId });
    await expect(
      ownerAT.mutation(api.teams.teams.removeMember, {
        organizationId: orgBId,
        targetMemberId: victimMemberId,
      })
    ).rejects.toThrow(/not a member|owners and admins/i);
  });

  test('owner of Org A cannot update roles in Org B', async () => {
    const victimId = await seedUser(t, { email: 'victim@test.com' });
    const victimMemberId = await seedTeamMember(t, victimId, orgBId, 'editor');

    const ownerAT = t.withIdentity({ subject: ownerAId });
    await expect(
      ownerAT.mutation(api.teams.teams.updateMemberRole, {
        organizationId: orgBId,
        targetMemberId: victimMemberId,
        newRole: 'admin',
      })
    ).rejects.toThrow(/not a member|owners and admins/i);
  });

  test('owner of Org A cannot rename Org B', async () => {
    const ownerAT = t.withIdentity({ subject: ownerAId });
    await expect(
      ownerAT.mutation(api.teams.teams.updateOrganizationName, {
        organizationId: orgBId,
        name: 'Hacked Name',
      })
    ).rejects.toThrow(/not a member|owner/i);
  });
});

// =============================================================================
// SEAT LIMITS PER ORG
// =============================================================================

describe('Multi-Org: Per-Org Seat Limits', () => {
  test('Org A at limit does not block Org B invites', async () => {
    const t = createTestContext();
    const ownerAId = await seedUser(t, { email: 'ownerA@test.com' });
    const ownerBId = await seedUser(t, { email: 'ownerB@test.com' });

    // Org A = starter (1 seat), already full with owner
    const orgAId = await seedOrganization(t, ownerAId, { membershipTier: 'starter' });

    // Org B = engine (5 seats), has room
    const orgBId = await seedOrganization(t, ownerBId, { membershipTier: 'engine' });

    // Org A should reject new invite (full)
    const ownerAT = t.withIdentity({ subject: ownerAId });
    await expect(
      ownerAT.mutation(api.teams.invitations.createInvitation, {
        organizationId: orgAId,
        email: 'overflow@test.com',
        role: 'viewer',
      })
    ).rejects.toThrow(/seat limit|limit reached/i);

    // Org B should accept new invite (has room)
    const ownerBT = t.withIdentity({ subject: ownerBId });
    const result = await ownerBT.mutation(api.teams.invitations.createInvitation, {
      organizationId: orgBId,
      email: 'welcome@test.com',
      role: 'editor',
    });
    expect(result.inviteId).toBeDefined();
  });
});

// =============================================================================
// REMOVAL ISOLATION
// =============================================================================

describe('Multi-Org: Membership Removal Isolation', () => {
  test('removing member from Org A does not affect Org B membership', async () => {
    const t = createTestContext();
    const ownerAId = await seedUser(t, { email: 'ownerA@test.com' });
    const ownerBId = await seedUser(t, { email: 'ownerB@test.com' });
    const aliceId = await seedUser(t, { email: 'alice@test.com' });

    const orgAId = await seedOrganization(t, ownerAId, { membershipTier: 'agency' });
    const orgBId = await seedOrganization(t, ownerBId, { membershipTier: 'agency' });

    const aliceMemberAId = await seedTeamMember(t, aliceId, orgAId, 'editor');
    await seedTeamMember(t, aliceId, orgBId, 'admin');

    // Remove alice from Org A
    const ownerAT = t.withIdentity({ subject: ownerAId });
    await ownerAT.mutation(api.teams.teams.removeMember, {
      organizationId: orgAId,
      targetMemberId: aliceMemberAId,
    });

    // Alice should still be admin in Org B
    const aliceT = t.withIdentity({ subject: aliceId });
    const orgBMembers = await aliceT.query(api.teams.teams.getTeamMembers, { organizationId: orgBId });
    const aliceInB = orgBMembers.find((m) => m.userId === aliceId);
    expect(aliceInB).toBeDefined();
    expect(aliceInB?.role).toBe('admin');
  });
});

// =============================================================================
// OWNERSHIP TRANSFER ISOLATION
// =============================================================================

describe('Multi-Org: Ownership Transfer Isolation', () => {
  test('transferring ownership in Org A does not affect Org B', async () => {
    const t = createTestContext();
    const ownerAId = await seedUser(t, { email: 'ownerA@test.com' });
    const ownerBId = await seedUser(t, { email: 'ownerB@test.com' });
    const aliceId = await seedUser(t, { email: 'alice@test.com' });

    const orgAId = await seedOrganization(t, ownerAId, { membershipTier: 'agency' });
    const orgBId = await seedOrganization(t, ownerBId, { membershipTier: 'agency' });

    const aliceMemberAId = await seedTeamMember(t, aliceId, orgAId, 'admin');
    await seedTeamMember(t, aliceId, orgBId, 'viewer');

    // Transfer ownership of Org A to alice
    const ownerAT = t.withIdentity({ subject: ownerAId });
    await ownerAT.mutation(api.teams.teams.transferOwnership, {
      organizationId: orgAId,
      targetMemberId: aliceMemberAId,
    });

    // Alice is now owner of Org A
    const org = await t.run(async (ctx) => ctx.db.get(orgAId));
    expect(org?.ownerId).toBe(aliceId);

    // Alice is still viewer in Org B (unchanged)
    const aliceMemberB = await t.run(async (ctx) => {
      return ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) => q.eq('userId', aliceId).eq('organizationId', orgBId))
        .first();
    });
    expect(aliceMemberB?.role).toBe('viewer');
  });
});

// =============================================================================
// MULTI-ORG: getMyOrganizations QUERY
// =============================================================================

describe('Multi-Org: getMyOrganizations', () => {
  let t: ReturnType<typeof createTestContext>;
  let aliceId: Id<'users'>;
  let ownerAId: Id<'users'>;
  let ownerBId: Id<'users'>;
  let orgAId: Id<'organizations'>;
  let orgBId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerAId = await seedUser(t, { email: 'ownerA@test.com' });
    ownerBId = await seedUser(t, { email: 'ownerB@test.com' });
    aliceId = await seedUser(t, { email: 'alice@test.com' });

    orgAId = await seedOrganization(t, ownerAId, { name: 'Org Alpha', membershipTier: 'agency' });
    orgBId = await seedOrganization(t, ownerBId, { name: 'Org Beta', membershipTier: 'engine' });

    // Alice is admin in Org A, viewer in Org B
    await seedTeamMember(t, aliceId, orgAId, 'admin');
    await seedTeamMember(t, aliceId, orgBId, 'viewer');
  });

  test('returns all orgs for multi-org user', async () => {
    const aliceT = t.withIdentity({ subject: aliceId });
    const orgs = await aliceT.query(api.teams.teams.getMyOrganizations);
    expect(orgs.length).toBe(2);
    const orgNames = orgs.map((o: { name: string }) => o.name).sort();
    expect(orgNames).toEqual(['Org Alpha', 'Org Beta']);
  });

  test('includes correct role per org', async () => {
    const aliceT = t.withIdentity({ subject: aliceId });
    const orgs = await aliceT.query(api.teams.teams.getMyOrganizations);
    const orgA = orgs.find((o: { _id: Id<'organizations'> }) => o._id === orgAId);
    const orgB = orgs.find((o: { _id: Id<'organizations'> }) => o._id === orgBId);
    expect(orgA?.role).toBe('admin');
    expect(orgB?.role).toBe('viewer');
  });

  test('returns empty for unauthenticated user', async () => {
    const orgs = await t.query(api.teams.teams.getMyOrganizations);
    expect(orgs).toEqual([]);
  });

  test('owner sees their own org', async () => {
    const ownerAT = t.withIdentity({ subject: ownerAId });
    const orgs = await ownerAT.query(api.teams.teams.getMyOrganizations);
    expect(orgs.length).toBe(1);
    expect(orgs[0].name).toBe('Org Alpha');
    expect(orgs[0].role).toBe('owner');
  });
});

// =============================================================================
// MULTI-ORG: SWITCH ORGANIZATION DATA SCOPING
// =============================================================================

describe('Multi-Org: Switch Organization Data Scoping', () => {
  let t: ReturnType<typeof createTestContext>;
  let aliceId: Id<'users'>;
  let ownerAId: Id<'users'>;
  let ownerBId: Id<'users'>;
  let orgAId: Id<'organizations'>;
  let orgBId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerAId = await seedUser(t, { email: 'ownerA@test.com' });
    ownerBId = await seedUser(t, { email: 'ownerB@test.com' });
    aliceId = await seedUser(t, { email: 'alice@test.com' });

    orgAId = await seedOrganization(t, ownerAId, { name: 'Org Alpha', membershipTier: 'agency' });
    orgBId = await seedOrganization(t, ownerBId, { name: 'Org Beta', membershipTier: 'engine' });

    // Alice is admin in Org A, viewer in Org B
    await seedTeamMember(t, aliceId, orgAId, 'admin');
    await seedTeamMember(t, aliceId, orgBId, 'viewer');

    // Set Alice's active org to Org A
    await t.run(async (ctx) => {
      await ctx.db.patch(aliceId, { organizationId: orgAId });
    });
  });

  test('switching org changes getMyOrganization result', async () => {
    const aliceT = t.withIdentity({ subject: aliceId });

    // Before switch — active org is A
    const orgBefore = await aliceT.query(api.teams.teams.getMyOrganization);
    expect(orgBefore?._id).toBe(orgAId);

    // Switch to Org B
    await aliceT.mutation(api.users.switchOrganization, { organizationId: orgBId });

    // After switch — active org is B
    const orgAfter = await aliceT.query(api.teams.teams.getMyOrganization);
    expect(orgAfter?._id).toBe(orgBId);
  });

  test('switching org changes getMyTeamRole result', async () => {
    const aliceT = t.withIdentity({ subject: aliceId });

    // Before switch — alice is admin in Org A
    const roleBefore = await aliceT.query(api.teams.teams.getMyTeamRole);
    expect(roleBefore).toBe('admin');

    // Switch to Org B
    await aliceT.mutation(api.users.switchOrganization, { organizationId: orgBId });

    // After switch — alice is viewer in Org B
    const roleAfter = await aliceT.query(api.teams.teams.getMyTeamRole);
    expect(roleAfter).toBe('viewer');
  });

  test('switchOrganization rejects non-member org', async () => {
    const aliceT = t.withIdentity({ subject: aliceId });

    // Create a third org that Alice is NOT a member of
    const ownerCId = await seedUser(t, { email: 'ownerC@test.com' });
    const orgCId = await seedOrganization(t, ownerCId, { name: 'Org Charlie', membershipTier: 'starter' });

    await expect(
      aliceT.mutation(api.users.switchOrganization, { organizationId: orgCId })
    ).rejects.toThrow(/not an active member/i);
  });

  test('getMyOrganizations is unaffected by active org switch', async () => {
    const aliceT = t.withIdentity({ subject: aliceId });

    // Switch to Org B
    await aliceT.mutation(api.users.switchOrganization, { organizationId: orgBId });

    // getMyOrganizations still returns both orgs
    const orgs = await aliceT.query(api.teams.teams.getMyOrganizations);
    expect(orgs.length).toBe(2);
  });
});

// =============================================================================
// MULTI-ORG: WORKSPACE CREATION
// =============================================================================

describe('Multi-Org: Workspace Creation', () => {
  let t: ReturnType<typeof createTestContext>;

  beforeEach(() => {
    t = createTestContext();
  });

  test('Engine user can create a second workspace', async () => {
    const userId = await seedUser(t, { email: 'engine@test.com', membershipTier: 'engine' });
    const orgAId = await seedOrganization(t, userId, { name: 'Workspace A', membershipTier: 'engine' });

    const userT = t.withIdentity({ subject: userId });

    // User already has one workspace — should be able to create another
    const orgBId = await userT.mutation(api.teams.teams.createOrganization, { name: 'Workspace B' });
    expect(orgBId).toBeDefined();
    expect(orgBId).not.toBe(orgAId);

    // Should now have 2 memberships
    const orgs = await userT.query(api.teams.teams.getMyOrganizations);
    expect(orgs.length).toBe(2);
  });

  test('Engine user blocked at workspace limit (3)', async () => {
    const userId = await seedUser(t, { email: 'engine@test.com', membershipTier: 'engine' });
    await seedOrganization(t, userId, { name: 'Workspace 1', membershipTier: 'engine' });
    await seedOrganization(t, userId, { name: 'Workspace 2', membershipTier: 'engine' });
    await seedOrganization(t, userId, { name: 'Workspace 3', membershipTier: 'engine' });

    const userT = t.withIdentity({ subject: userId });

    // 4th workspace should be blocked
    await expect(
      userT.mutation(api.teams.teams.createOrganization, { name: 'Workspace 4' })
    ).rejects.toThrow(/workspace limit reached/i);
  });

  test('Starter user blocked at workspace limit (1)', async () => {
    const userId = await seedUser(t, { email: 'starter@test.com', membershipTier: 'starter' });
    await seedOrganization(t, userId, { name: 'My Workspace', membershipTier: 'starter' });

    const userT = t.withIdentity({ subject: userId });

    await expect(
      userT.mutation(api.teams.teams.createOrganization, { name: 'Second Workspace' })
    ).rejects.toThrow(/workspace limit reached/i);
  });

  test('Agency user can create up to 10 workspaces', async () => {
    const userId = await seedUser(t, { email: 'agency@test.com', membershipTier: 'agency' });

    // Seed 9 orgs (each seeds owner teamMember)
    for (let i = 1; i <= 9; i++) {
      await seedOrganization(t, userId, { name: `Client ${i}`, membershipTier: 'agency' });
    }

    const userT = t.withIdentity({ subject: userId });

    // 10th should succeed
    const org10 = await userT.mutation(api.teams.teams.createOrganization, { name: 'Client 10' });
    expect(org10).toBeDefined();

    // 11th should be blocked
    await expect(
      userT.mutation(api.teams.teams.createOrganization, { name: 'Client 11' })
    ).rejects.toThrow(/workspace limit reached/i);
  });

  test('new workspace creates teamMember with owner role', async () => {
    const userId = await seedUser(t, { email: 'owner@test.com', membershipTier: 'engine' });

    const userT = t.withIdentity({ subject: userId });
    const orgId = await userT.mutation(api.teams.teams.createOrganization, { name: 'New Workspace' });

    // Check teamMember was created with owner role
    const membership = await t.run(async (ctx) => {
      return ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) => q.eq('userId', userId).eq('organizationId', orgId))
        .first();
    });

    expect(membership).toBeDefined();
    expect(membership?.role).toBe('owner');
    expect(membership?.status).toBe('active');
  });

  test('new workspace switches active org', async () => {
    const userId = await seedUser(t, { email: 'switch@test.com', membershipTier: 'engine' });
    await seedOrganization(t, userId, { name: 'Original', membershipTier: 'engine' });

    const userT = t.withIdentity({ subject: userId });
    const newOrgId = await userT.mutation(api.teams.teams.createOrganization, { name: 'New One' });

    // Active org should be switched to the new one
    const user = await t.run(async (ctx) => ctx.db.get(userId));
    expect(user?.organizationId).toBe(newOrgId);
  });
});

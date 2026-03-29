/**
 * Team Management Integration Tests
 *
 * Component Hierarchy: convex/teams/teams.ts
 * Tests the canonical team management module used by:
 * - TeamManagementPanel.tsx
 * - InviteModal.tsx
 * - convex/onboarding.ts
 *
 * Functions tested:
 * - getMyOrganization, getMyTeamRole, getTeamMembers, getSeatUsage (queries)
 * - createOrganization, updateOrganizationName, updateMemberRole,
 *   removeMember, leaveOrganization, transferOwnership, syncSeatsWithTier (mutations)
 *
 * Pattern: Integration tests via convexTest — tests use cases, not implementation.
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { createTestContext, seedUser, seedOrganization, seedTeamMember } from '../testHelpers';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

// =============================================================================
// ORGANIZATION LIFECYCLE
// =============================================================================

describe('Team Management: Organization Lifecycle', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com', name: 'Org Owner' });
  });

  test('getMyOrganization returns null for user without org', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    const org = await ownerT.query(api.teams.teams.getMyOrganization, {});
    expect(org).toBeNull();
  });

  test('getMyOrganization returns null for unauthenticated user', async () => {
    const org = await t.query(api.teams.teams.getMyOrganization, {});
    expect(org).toBeNull();
  });

  test('getMyOrganization returns org after creation', async () => {
    const orgId = await seedOrganization(t, ownerId, { name: 'My Org', membershipTier: 'engine' });
    const ownerT = t.withIdentity({ subject: ownerId });
    const org = await ownerT.query(api.teams.teams.getMyOrganization, {});

    expect(org).not.toBeNull();
    expect(org?.name).toBe('My Org');
    expect(org?._id).toBe(orgId);
  });
});

// =============================================================================
// TEAM ROLE QUERIES
// =============================================================================

describe('Team Management: Role Queries', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let editorId: Id<'users'>;
  let outsiderId: Id<'users'>;
  let orgId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com' });
    editorId = await seedUser(t, { email: 'editor@test.com' });
    outsiderId = await seedUser(t, { email: 'outsider@test.com' });
    orgId = await seedOrganization(t, ownerId, { name: 'Role Test Org', membershipTier: 'agency' });
    await seedTeamMember(t, editorId, orgId, 'editor');
  });

  test('getMyTeamRole returns owner for org owner', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    const role = await ownerT.query(api.teams.teams.getMyTeamRole, {});
    expect(role).toBe('owner');
  });

  test('getMyTeamRole returns editor for editor member', async () => {
    const editorT = t.withIdentity({ subject: editorId });
    const role = await editorT.query(api.teams.teams.getMyTeamRole, {});
    expect(role).toBe('editor');
  });

  test('getMyTeamRole returns null for unauthenticated user', async () => {
    const role = await t.query(api.teams.teams.getMyTeamRole, {});
    expect(role).toBeNull();
  });

  test('getMyTeamRole returns null for user without org', async () => {
    const outsiderT = t.withIdentity({ subject: outsiderId });
    const role = await outsiderT.query(api.teams.teams.getMyTeamRole, {});
    expect(role).toBeNull();
  });
});

// =============================================================================
// TEAM MEMBERS QUERY
// =============================================================================

describe('Team Management: Get Team Members', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let editorId: Id<'users'>;
  let outsiderId: Id<'users'>;
  let orgId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com', name: 'Owner' });
    editorId = await seedUser(t, { email: 'editor@test.com', name: 'Editor' });
    outsiderId = await seedUser(t, { email: 'outsider@test.com', name: 'Outsider' });
    orgId = await seedOrganization(t, ownerId, { membershipTier: 'agency' });
    await seedTeamMember(t, editorId, orgId, 'editor');
  });

  test('returns enriched member list for org member', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    const members = await ownerT.query(api.teams.teams.getTeamMembers, { organizationId: orgId });

    expect(members.length).toBe(2);
    const ownerMember = members.find((m) => m.role === 'owner');
    expect(ownerMember?.user?.name).toBe('Owner');
  });

  test('rejects non-member from viewing team', async () => {
    const outsiderT = t.withIdentity({ subject: outsiderId });
    await expect(
      outsiderT.query(api.teams.teams.getTeamMembers, { organizationId: orgId })
    ).rejects.toThrow(/not a member/i);
  });

  test('rejects unauthenticated user', async () => {
    await expect(
      t.query(api.teams.teams.getTeamMembers, { organizationId: orgId })
    ).rejects.toThrow(/not authenticated/i);
  });
});

// =============================================================================
// SEAT USAGE
// =============================================================================

describe('Team Management: Seat Usage', () => {
  test('calculates seats correctly for engine tier', async () => {
    const t = createTestContext();
    const ownerId = await seedUser(t, { email: 'owner@test.com' });
    const editorId = await seedUser(t, { email: 'editor@test.com' });
    const orgId = await seedOrganization(t, ownerId, { membershipTier: 'engine' });
    await seedTeamMember(t, editorId, orgId, 'editor');

    const ownerT = t.withIdentity({ subject: ownerId });
    const usage = await ownerT.query(api.teams.teams.getSeatUsage, { organizationId: orgId });

    expect(usage.used).toBe(2); // owner + editor
    expect(usage.max).toBe(5); // engine tier
    expect(usage.remaining).toBe(3);
  });

  test('uses owner membershipTier dynamically, not stale org.maxMembers', async () => {
    const t = createTestContext();
    const ownerId = await seedUser(t, { email: 'owner@test.com' });
    // Create with starter but set owner to agency tier
    const orgId = await seedOrganization(t, ownerId, { maxMembers: 1, membershipTier: 'agency' });

    const ownerT = t.withIdentity({ subject: ownerId });
    const usage = await ownerT.query(api.teams.teams.getSeatUsage, { organizationId: orgId });

    // Should use dynamic tier (agency=25), not stale org.maxMembers (1)
    expect(usage.max).toBe(25);
  });
});

// =============================================================================
// UPDATE ORGANIZATION NAME
// =============================================================================

describe('Team Management: Update Organization Name', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let editorId: Id<'users'>;
  let orgId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com' });
    editorId = await seedUser(t, { email: 'editor@test.com' });
    orgId = await seedOrganization(t, ownerId, { name: 'Original Name', membershipTier: 'engine' });
    await seedTeamMember(t, editorId, orgId, 'editor');
  });

  test('owner can update organization name', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    await ownerT.mutation(api.teams.teams.updateOrganizationName, {
      organizationId: orgId,
      name: 'Updated Name',
    });

    const org = await ownerT.query(api.teams.teams.getMyOrganization, {});
    expect(org?.name).toBe('Updated Name');
  });

  test('non-owner cannot update organization name', async () => {
    const editorT = t.withIdentity({ subject: editorId });
    await expect(
      editorT.mutation(api.teams.teams.updateOrganizationName, {
        organizationId: orgId,
        name: 'Hacked Name',
      })
    ).rejects.toThrow(/owner/i);
  });

  test('creates audit log on name change', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    await ownerT.mutation(api.teams.teams.updateOrganizationName, {
      organizationId: orgId,
      name: 'Audited Name',
    });

    const logs = await t.run(async (ctx) => {
      return ctx.db
        .query('teamAuditLogs')
        .filter((q) => q.eq(q.field('organizationId'), orgId))
        .collect();
    });

    expect(logs.length).toBeGreaterThanOrEqual(1);
    const nameLog = logs.find((l) => l.action === 'org_name_changed');
    expect(nameLog).toBeDefined();
    expect(nameLog?.details).toEqual(
      expect.objectContaining({ previousName: 'Original Name', newName: 'Audited Name' })
    );
  });
});

// =============================================================================
// UPDATE MEMBER ROLE
// =============================================================================

describe('Team Management: Update Member Role', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let adminId: Id<'users'>;
  let editorId: Id<'users'>;
  let orgId: Id<'organizations'>;
  let adminMemberId: Id<'teamMembers'>;
  let editorMemberId: Id<'teamMembers'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com' });
    adminId = await seedUser(t, { email: 'admin@test.com' });
    editorId = await seedUser(t, { email: 'editor@test.com' });
    orgId = await seedOrganization(t, ownerId, { membershipTier: 'agency' });
    adminMemberId = await seedTeamMember(t, adminId, orgId, 'admin');
    editorMemberId = await seedTeamMember(t, editorId, orgId, 'editor');
  });

  test('owner can change editor to admin', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    await ownerT.mutation(api.teams.teams.updateMemberRole, {
      organizationId: orgId,
      targetMemberId: editorMemberId,
      newRole: 'admin',
    });

    const member = await t.run(async (ctx) => ctx.db.get(editorMemberId));
    expect(member?.role).toBe('admin');
  });

  test('admin can change editor to viewer', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    await adminT.mutation(api.teams.teams.updateMemberRole, {
      organizationId: orgId,
      targetMemberId: editorMemberId,
      newRole: 'viewer',
    });

    const member = await t.run(async (ctx) => ctx.db.get(editorMemberId));
    expect(member?.role).toBe('viewer');
  });

  test('admin CANNOT change another admin role (escalation prevention)', async () => {
    // Promote editor to admin first
    const ownerT = t.withIdentity({ subject: ownerId });
    await ownerT.mutation(api.teams.teams.updateMemberRole, {
      organizationId: orgId,
      targetMemberId: editorMemberId,
      newRole: 'admin',
    });

    // Now admin tries to demote the other admin
    const adminT = t.withIdentity({ subject: adminId });
    await expect(
      adminT.mutation(api.teams.teams.updateMemberRole, {
        organizationId: orgId,
        targetMemberId: editorMemberId,
        newRole: 'viewer',
      })
    ).rejects.toThrow(/admin/i);
  });

  test('cannot change owner role', async () => {
    const ownerMemberId = await t.run(async (ctx) => {
      const m = await ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) => q.eq('userId', ownerId).eq('organizationId', orgId))
        .first();
      return m!._id;
    });

    const ownerT = t.withIdentity({ subject: ownerId });
    await expect(
      ownerT.mutation(api.teams.teams.updateMemberRole, {
        organizationId: orgId,
        targetMemberId: ownerMemberId,
        newRole: 'admin',
      })
    ).rejects.toThrow(/owner/i);
  });

  test('editor cannot change roles', async () => {
    const editorT = t.withIdentity({ subject: editorId });
    await expect(
      editorT.mutation(api.teams.teams.updateMemberRole, {
        organizationId: orgId,
        targetMemberId: adminMemberId,
        newRole: 'viewer',
      })
    ).rejects.toThrow(/owner|admin/i);
  });
});

// =============================================================================
// REMOVE MEMBER
// =============================================================================

describe('Team Management: Remove Member', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let adminId: Id<'users'>;
  let editorId: Id<'users'>;
  let viewerId: Id<'users'>;
  let orgId: Id<'organizations'>;
  let adminMemberId: Id<'teamMembers'>;
  let editorMemberId: Id<'teamMembers'>;
  let viewerMemberId: Id<'teamMembers'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com' });
    adminId = await seedUser(t, { email: 'admin@test.com' });
    editorId = await seedUser(t, { email: 'editor@test.com' });
    viewerId = await seedUser(t, { email: 'viewer@test.com' });
    orgId = await seedOrganization(t, ownerId, { membershipTier: 'agency' });
    adminMemberId = await seedTeamMember(t, adminId, orgId, 'admin');
    editorMemberId = await seedTeamMember(t, editorId, orgId, 'editor');
    viewerMemberId = await seedTeamMember(t, viewerId, orgId, 'viewer');
  });

  test('owner can remove editor', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    await ownerT.mutation(api.teams.teams.removeMember, {
      organizationId: orgId,
      targetMemberId: editorMemberId,
    });

    const member = await t.run(async (ctx) => ctx.db.get(editorMemberId));
    expect(member).toBeNull();
  });

  test('admin can remove viewer', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    await adminT.mutation(api.teams.teams.removeMember, {
      organizationId: orgId,
      targetMemberId: viewerMemberId,
    });

    const member = await t.run(async (ctx) => ctx.db.get(viewerMemberId));
    expect(member).toBeNull();
  });

  test('admin CANNOT remove another admin', async () => {
    // Create second admin
    const admin2Id = await seedUser(t, { email: 'admin2@test.com' });
    const admin2MemberId = await seedTeamMember(t, admin2Id, orgId, 'admin');

    const adminT = t.withIdentity({ subject: adminId });
    await expect(
      adminT.mutation(api.teams.teams.removeMember, {
        organizationId: orgId,
        targetMemberId: admin2MemberId,
      })
    ).rejects.toThrow(/admin/i);
  });

  test('cannot remove owner', async () => {
    const ownerMemberId = await t.run(async (ctx) => {
      const m = await ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) => q.eq('userId', ownerId).eq('organizationId', orgId))
        .first();
      return m!._id;
    });

    const adminT = t.withIdentity({ subject: adminId });
    await expect(
      adminT.mutation(api.teams.teams.removeMember, {
        organizationId: orgId,
        targetMemberId: ownerMemberId,
      })
    ).rejects.toThrow(/owner/i);
  });

  test('cannot remove self (use leave instead)', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    await expect(
      adminT.mutation(api.teams.teams.removeMember, {
        organizationId: orgId,
        targetMemberId: adminMemberId,
      })
    ).rejects.toThrow(/yourself|leave/i);
  });

  test('clears user organizationId after removal', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    await ownerT.mutation(api.teams.teams.removeMember, {
      organizationId: orgId,
      targetMemberId: editorMemberId,
    });

    const user = await t.run(async (ctx) => ctx.db.get(editorId));
    expect(user?.organizationId).toBeUndefined();
  });
});

// =============================================================================
// LEAVE ORGANIZATION
// =============================================================================

describe('Team Management: Leave Organization', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let editorId: Id<'users'>;
  let orgId: Id<'organizations'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com' });
    editorId = await seedUser(t, { email: 'editor@test.com' });
    orgId = await seedOrganization(t, ownerId, { membershipTier: 'engine' });
    await seedTeamMember(t, editorId, orgId, 'editor');
  });

  test('editor can leave organization', async () => {
    const editorT = t.withIdentity({ subject: editorId });
    const result = await editorT.mutation(api.teams.teams.leaveOrganization, {
      organizationId: orgId,
    });

    expect(result.success).toBe(true);

    // Verify membership deleted
    const memberships = await t.run(async (ctx) => {
      return ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) => q.eq('userId', editorId).eq('organizationId', orgId))
        .collect();
    });
    expect(memberships).toHaveLength(0);
  });

  test('owner CANNOT leave organization', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    await expect(
      ownerT.mutation(api.teams.teams.leaveOrganization, { organizationId: orgId })
    ).rejects.toThrow(/owner|transfer/i);
  });

  test('clears user organizationId on leave', async () => {
    const editorT = t.withIdentity({ subject: editorId });
    await editorT.mutation(api.teams.teams.leaveOrganization, { organizationId: orgId });

    const user = await t.run(async (ctx) => ctx.db.get(editorId));
    expect(user?.organizationId).toBeUndefined();
  });

  test('non-member cannot leave', async () => {
    const outsiderId = await seedUser(t, { email: 'outsider@test.com' });
    const outsiderT = t.withIdentity({ subject: outsiderId });

    await expect(
      outsiderT.mutation(api.teams.teams.leaveOrganization, { organizationId: orgId })
    ).rejects.toThrow(/not a member/i);
  });
});

// =============================================================================
// TRANSFER OWNERSHIP
// =============================================================================

describe('Team Management: Transfer Ownership', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let adminId: Id<'users'>;
  let editorId: Id<'users'>;
  let orgId: Id<'organizations'>;
  let adminMemberId: Id<'teamMembers'>;
  let editorMemberId: Id<'teamMembers'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com' });
    adminId = await seedUser(t, { email: 'admin@test.com' });
    editorId = await seedUser(t, { email: 'editor@test.com' });
    orgId = await seedOrganization(t, ownerId, { membershipTier: 'agency' });
    adminMemberId = await seedTeamMember(t, adminId, orgId, 'admin');
    editorMemberId = await seedTeamMember(t, editorId, orgId, 'editor');
  });

  test('owner can transfer ownership to admin', async () => {
    const ownerT = t.withIdentity({ subject: ownerId });
    const result = await ownerT.mutation(api.teams.teams.transferOwnership, {
      organizationId: orgId,
      targetMemberId: adminMemberId,
    });

    expect(result.success).toBe(true);

    // New owner has 'owner' role
    const newOwnerMember = await t.run(async (ctx) => ctx.db.get(adminMemberId));
    expect(newOwnerMember?.role).toBe('owner');

    // Old owner demoted to 'admin'
    const oldOwnerMember = await t.run(async (ctx) => {
      return ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) => q.eq('userId', ownerId).eq('organizationId', orgId))
        .first();
    });
    expect(oldOwnerMember?.role).toBe('admin');

    // Org.ownerId updated
    const org = await t.run(async (ctx) => ctx.db.get(orgId));
    expect(org?.ownerId).toBe(adminId);
  });

  test('non-owner cannot transfer ownership', async () => {
    const adminT = t.withIdentity({ subject: adminId });
    await expect(
      adminT.mutation(api.teams.teams.transferOwnership, {
        organizationId: orgId,
        targetMemberId: editorMemberId,
      })
    ).rejects.toThrow(/owner/i);
  });

  test('cannot transfer ownership to self', async () => {
    const ownerMemberId = await t.run(async (ctx) => {
      const m = await ctx.db
        .query('teamMembers')
        .withIndex('by_user_org', (q) => q.eq('userId', ownerId).eq('organizationId', orgId))
        .first();
      return m!._id;
    });

    const ownerT = t.withIdentity({ subject: ownerId });
    await expect(
      ownerT.mutation(api.teams.teams.transferOwnership, {
        organizationId: orgId,
        targetMemberId: ownerMemberId,
      })
    ).rejects.toThrow(/already own/i);
  });
});

// =============================================================================
// SYNC SEATS WITH TIER
// =============================================================================

describe('Team Management: Sync Seats With Tier', () => {
  test('updates maxMembers on tier change', async () => {
    const t = createTestContext();
    const ownerId = await seedUser(t, { email: 'owner@test.com' });
    const orgId = await seedOrganization(t, ownerId, { membershipTier: 'starter' });

    // Upgrade user to agency tier
    await t.run(async (ctx) => {
      await ctx.db.patch(ownerId, { membershipTier: 'agency' });
    });

    const ownerT = t.withIdentity({ subject: ownerId });
    const result = await ownerT.mutation(api.teams.teams.syncSeatsWithTier, {});

    expect(result.success).toBe(true);
    expect(result.maxMembers).toBe(25);

    // Verify org was updated
    const org = await t.run(async (ctx) => ctx.db.get(orgId));
    expect(org?.maxMembers).toBe(25);
    expect(org?.plan).toBe('agency');
  });

  test('only owner can sync seats', async () => {
    const t = createTestContext();
    const ownerId = await seedUser(t, { email: 'owner@test.com' });
    const editorId = await seedUser(t, { email: 'editor@test.com' });
    const orgId = await seedOrganization(t, ownerId, { membershipTier: 'engine' });
    await seedTeamMember(t, editorId, orgId, 'editor');

    const editorT = t.withIdentity({ subject: editorId });
    await expect(
      editorT.mutation(api.teams.teams.syncSeatsWithTier, {})
    ).rejects.toThrow(/owner/i);
  });
});

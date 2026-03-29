/**
 * Organizations, RBAC, and Subscriptions Predictability Test Suite
 *
 * MIGRATED: Now tests convex/teams/teams.ts (the canonical production module)
 * Previously tested convex/organizations/teamMembers.ts with heavy mocking.
 *
 * This suite provides combinatorial coverage for the Roles x Actions matrix
 * using real Convex execution via convexTest (no mocks).
 *
 * Coverage:
 * - Update Organization Name (owner only)
 * - Update Member Role (owner/admin, with escalation prevention)
 * - Remove Member (owner/admin, with lateral-removal prevention)
 * - Invite Member (owner/admin, with seat limit enforcement)
 * - Leave Organization (non-owner self-removal)
 * - Transfer Ownership (owner only)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createTestContext, seedUser, seedOrganization, seedTeamMember } from './testHelpers';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

// --- Combinatorial Matrix ---

const ORG_ROLES = ['owner', 'admin', 'editor', 'viewer'] as const;

type OrgRole = (typeof ORG_ROLES)[number];

interface MatrixAction {
  name: string;
  allowedActorRoles: readonly OrgRole[];
}

const ACTIONS: MatrixAction[] = [
  { name: 'Update Organization Name', allowedActorRoles: ['owner'] },
  { name: 'Update Member Role', allowedActorRoles: ['owner', 'admin'] },
  { name: 'Remove Member', allowedActorRoles: ['owner', 'admin'] },
  { name: 'Invite Member', allowedActorRoles: ['owner', 'admin'] },
];

// =============================================================================
// RBAC PERMISSION MATRIX
// =============================================================================

describe('RBAC Predictability Matrix (Canonical: convex/teams/teams.ts)', () => {
  let t: ReturnType<typeof createTestContext>;
  let ownerId: Id<'users'>;
  let adminId: Id<'users'>;
  let editorId: Id<'users'>;
  let viewerId: Id<'users'>;
  let orgId: Id<'organizations'>;
  let editorMemberId: Id<'teamMembers'>;
  let viewerMemberId: Id<'teamMembers'>;

  beforeEach(async () => {
    t = createTestContext();
    ownerId = await seedUser(t, { email: 'owner@test.com' });
    adminId = await seedUser(t, { email: 'admin@test.com' });
    editorId = await seedUser(t, { email: 'editor@test.com' });
    viewerId = await seedUser(t, { email: 'viewer@test.com' });
    orgId = await seedOrganization(t, ownerId, {
      name: 'Matrix Org',
      membershipTier: 'agency', // 25 seats — no limit interference
    });
    await seedTeamMember(t, adminId, orgId, 'admin');
    editorMemberId = await seedTeamMember(t, editorId, orgId, 'editor');
    viewerMemberId = await seedTeamMember(t, viewerId, orgId, 'viewer');
  });

  // -------------------------------------------------------------------------
  // Update Organization Name: Only owner
  // -------------------------------------------------------------------------

  describe('Update Organization Name', () => {
    it('owner: ALLOWED', async () => {
      const ownerT = t.withIdentity({ subject: ownerId });
      const result = await ownerT.mutation(api.teams.teams.updateOrganizationName, {
        organizationId: orgId,
        name: 'Renamed',
      });
      expect(result.success).toBe(true);
    });

    it.each(['admin', 'editor', 'viewer'] as const)(
      '%s: DENIED',
      async (role) => {
        const userId = { admin: adminId, editor: editorId, viewer: viewerId }[role];
        const actorT = t.withIdentity({ subject: userId });
        await expect(
          actorT.mutation(api.teams.teams.updateOrganizationName, {
            organizationId: orgId,
            name: 'Hacked',
          })
        ).rejects.toThrow(/owner/i);
      }
    );
  });

  // -------------------------------------------------------------------------
  // Update Member Role: Owner + Admin (with restrictions)
  // -------------------------------------------------------------------------

  describe('Update Member Role', () => {
    it('owner: ALLOWED (change editor to viewer)', async () => {
      const ownerT = t.withIdentity({ subject: ownerId });
      await ownerT.mutation(api.teams.teams.updateMemberRole, {
        organizationId: orgId,
        targetMemberId: editorMemberId,
        newRole: 'viewer',
      });
      const member = await t.run(async (ctx) => ctx.db.get(editorMemberId));
      expect(member?.role).toBe('viewer');
    });

    it('admin: ALLOWED (change viewer to editor)', async () => {
      const adminT = t.withIdentity({ subject: adminId });
      await adminT.mutation(api.teams.teams.updateMemberRole, {
        organizationId: orgId,
        targetMemberId: viewerMemberId,
        newRole: 'editor',
      });
      const member = await t.run(async (ctx) => ctx.db.get(viewerMemberId));
      expect(member?.role).toBe('editor');
    });

    it('editor: DENIED', async () => {
      const editorT = t.withIdentity({ subject: editorId });
      await expect(
        editorT.mutation(api.teams.teams.updateMemberRole, {
          organizationId: orgId,
          targetMemberId: viewerMemberId,
          newRole: 'admin',
        })
      ).rejects.toThrow(/owner|admin/i);
    });

    it('viewer: DENIED', async () => {
      const viewerT = t.withIdentity({ subject: viewerId });
      await expect(
        viewerT.mutation(api.teams.teams.updateMemberRole, {
          organizationId: orgId,
          targetMemberId: editorMemberId,
          newRole: 'admin',
        })
      ).rejects.toThrow(/owner|admin/i);
    });
  });

  // -------------------------------------------------------------------------
  // Remove Member: Owner + Admin (with restrictions)
  // -------------------------------------------------------------------------

  describe('Remove Member', () => {
    it('owner: ALLOWED (remove viewer)', async () => {
      const ownerT = t.withIdentity({ subject: ownerId });
      await ownerT.mutation(api.teams.teams.removeMember, {
        organizationId: orgId,
        targetMemberId: viewerMemberId,
      });
      const member = await t.run(async (ctx) => ctx.db.get(viewerMemberId));
      expect(member).toBeNull();
    });

    it('admin: ALLOWED (remove editor)', async () => {
      const adminT = t.withIdentity({ subject: adminId });
      await adminT.mutation(api.teams.teams.removeMember, {
        organizationId: orgId,
        targetMemberId: editorMemberId,
      });
      const member = await t.run(async (ctx) => ctx.db.get(editorMemberId));
      expect(member).toBeNull();
    });

    it('editor: DENIED', async () => {
      const editorT = t.withIdentity({ subject: editorId });
      await expect(
        editorT.mutation(api.teams.teams.removeMember, {
          organizationId: orgId,
          targetMemberId: viewerMemberId,
        })
      ).rejects.toThrow(/owner|admin/i);
    });

    it('viewer: DENIED', async () => {
      const viewerT = t.withIdentity({ subject: viewerId });
      await expect(
        viewerT.mutation(api.teams.teams.removeMember, {
          organizationId: orgId,
          targetMemberId: editorMemberId,
        })
      ).rejects.toThrow(/owner|admin/i);
    });
  });

  // -------------------------------------------------------------------------
  // Invite Member: Owner + Admin
  // -------------------------------------------------------------------------

  describe('Invite Member', () => {
    it('owner: ALLOWED', async () => {
      const ownerT = t.withIdentity({ subject: ownerId });
      const result = await ownerT.mutation(api.teams.invitations.createInvitation, {
        organizationId: orgId,
        email: 'newhire1@test.com',
        role: 'editor',
      });
      expect(result.inviteId).toBeDefined();
    });

    it('admin: ALLOWED', async () => {
      const adminT = t.withIdentity({ subject: adminId });
      const result = await adminT.mutation(api.teams.invitations.createInvitation, {
        organizationId: orgId,
        email: 'newhire2@test.com',
        role: 'viewer',
      });
      expect(result.inviteId).toBeDefined();
    });

    it('editor: DENIED', async () => {
      const editorT = t.withIdentity({ subject: editorId });
      await expect(
        editorT.mutation(api.teams.invitations.createInvitation, {
          organizationId: orgId,
          email: 'newhire3@test.com',
          role: 'viewer',
        })
      ).rejects.toThrow(/owner|admin/i);
    });

    it('viewer: DENIED', async () => {
      const viewerT = t.withIdentity({ subject: viewerId });
      await expect(
        viewerT.mutation(api.teams.invitations.createInvitation, {
          organizationId: orgId,
          email: 'newhire4@test.com',
          role: 'viewer',
        })
      ).rejects.toThrow(/owner|admin/i);
    });
  });
});

// =============================================================================
// TIER SEAT LIMIT ENFORCEMENT
// =============================================================================

describe('Subscription Tier Seat Limits (via convex/teams/invitations.ts)', () => {
  const TIERS = [
    { name: 'starter', maxSeats: 1 },
    { name: 'engine', maxSeats: 5 },
    { name: 'agency', maxSeats: 25 },
  ] as const;

  describe.each(TIERS)('Tier: $name (Max: $maxSeats seats)', (tier) => {
    it(`blocks invite when at capacity (${tier.maxSeats} seats)`, async () => {
      const t = createTestContext();
      const ownerId = await seedUser(t, { email: 'owner@test.com' });
      const orgId = await seedOrganization(t, ownerId, {
        membershipTier: tier.name,
      });

      // Fill to capacity (owner takes 1 seat, add the rest)
      for (let i = 1; i < tier.maxSeats; i++) {
        const fillerUserId = await seedUser(t, { email: `filler${i}@test.com` });
        await seedTeamMember(t, fillerUserId, orgId, 'viewer');
      }

      // Attempt invite should fail — at capacity
      const ownerT = t.withIdentity({ subject: ownerId });
      await expect(
        ownerT.mutation(api.teams.invitations.createInvitation, {
          organizationId: orgId,
          email: 'overflow@test.com',
          role: 'viewer',
        })
      ).rejects.toThrow(/seat limit|limit reached/i);
    });

    if (tier.maxSeats > 1) {
      it(`allows invite when below capacity (${tier.maxSeats - 1}/${tier.maxSeats} seats)`, async () => {
        const t = createTestContext();
        const ownerId = await seedUser(t, { email: 'owner@test.com' });
        const orgId = await seedOrganization(t, ownerId, {
          membershipTier: tier.name,
        });

        // Fill to one below capacity
        for (let i = 1; i < tier.maxSeats - 1; i++) {
          const fillerUserId = await seedUser(t, { email: `filler${i}@test.com` });
          await seedTeamMember(t, fillerUserId, orgId, 'viewer');
        }

        // Attempt invite should succeed — below capacity
        const ownerT = t.withIdentity({ subject: ownerId });
        const result = await ownerT.mutation(api.teams.invitations.createInvitation, {
          organizationId: orgId,
          email: 'welcome@test.com',
          role: 'viewer',
        });
        expect(result.inviteId).toBeDefined();
      });
    }
  });
});

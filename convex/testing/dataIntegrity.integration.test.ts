import { describe, expect, it, beforeEach } from 'vitest';
import { convexTest } from 'convex-test';
import { api } from '../_generated/api';
import schema from '../schema';

let t: ReturnType<typeof convexTest>;

beforeEach(() => {
  t = convexTest(schema);
});

describe('Data Integrity & Project/Org Scoping', () => {
  it('SEC-002: Prevents cross-organization data leakage and strictly limits analytics querying', async () => {
    // 1. Create Team A and Team B context users
    const userIdA = await t.run(async (ctx) => {
      return await ctx.db.insert('users', {
        email: 'a@test.com',
        name: 'User A',
        role: 'user',
        membershipTier: 'enterprise',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
      });
    });
    const userA = t.withIdentity({ subject: userIdA });

    const userIdB = await t.run(async (ctx) => {
      return await ctx.db.insert('users', {
        email: 'b@test.com',
        name: 'User B',
        role: 'user',
        membershipTier: 'enterprise',
        onboardingStatus: 'completed',
        createdAt: Date.now(),
      });
    });
    const userB = t.withIdentity({ subject: userIdB });

    // Setup User A
    const projAId = await userA.mutation(api.projects.projects.createProject, {
      name: 'Project A',
      websiteUrl: 'https://team-a.com',
      projectType: 'own',
    });

    // Setup User B
    const projBId = await userB.mutation(api.projects.projects.createProject, {
      name: 'Project B',
      websiteUrl: 'https://team-b.com',
      projectType: 'own',
    });

    // 2. Validate List Boundaries
    // User A should only see Project A
    const listA = await userA.query(api.projects.projects.list);
    expect(listA.length).toBe(1);
    expect(listA[0]._id).toBe(projAId);

    // User B should only see Project B
    const listB = await userB.query(api.projects.projects.list);
    expect(listB.length).toBe(1);
    expect(listB[0]._id).toBe(projBId);

    // 3. Setup Mock GA4/GSC connections for Project A
    await userA.mutation(api.integrations.ga4Connections.upsertGA4Connection, {
      projectId: projAId,
      propertyId: 'ga4-1234',
      propertyName: 'Team A GA4',
      accessToken: 'dummy_token',
    });

    await userA.mutation(api.integrations.gscConnections.upsertGSCConnection, {
      projectId: projAId,
      siteUrl: 'sc-domain:team-a.com',
      accessToken: 'dummy_token',
      availableSites: [{ siteUrl: 'sc-domain:team-a.com', permissionLevel: 'siteOwner' }],
    });

    // 4. Attempt Access Violation
    // User B tries to query User A's connections directly
    await expect(
      userB.mutation(api.integrations.ga4Connections.selectGA4Property, {
        projectId: projAId,
        propertyId: 'ga4-1234',
      })
    ).rejects.toThrow('Forbidden: No access to this project');

    await expect(
      userB.mutation(api.integrations.gscConnections.switchGSCSite, {
        projectId: projAId,
        siteUrl: 'sc-domain:team-a.com',
      })
    ).rejects.toThrow('Forbidden: No access to this project');

    // User A reads their own GSC connection successfully
    const gscA = await userA.query(api.integrations.gscConnections.getGSCConnection, {
      projectId: projAId,
    });
    expect(gscA?.siteUrl).toBe('sc-domain:team-a.com');
  });
});

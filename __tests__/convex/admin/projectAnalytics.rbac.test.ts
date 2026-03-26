/**
 * Admin: Project Analytics RBAC Tests (TKT-8)
 *
 * Enforces the Zero Authorization Bypass mandate for the internal
 * Admin Intelligence Firehose. Standard users must never be able
 * to access these paginated routes.
 */

import { describe, test, expect } from 'vitest';
import { createTestContext, seedUser, seedProject } from '../testHelpers';
import { api } from '../../../convex/_generated/api';

describe('Admin Intelligence Firehose: RBAC Security', () => {
  async function setup() {
    const t = createTestContext();

    // Standard user (attacker)
    const standardEmail = `user-${Date.now()}@test.com`;
    const standardId = await seedUser(t, { email: standardEmail, role: 'user' });
    const standardCtx = t.withIdentity({ subject: standardId, email: standardEmail });

    // Admin user 
    const adminEmail = `admin-${Date.now()}@martai.com`;
    const adminId = await seedUser(t, { email: adminEmail, role: 'admin' });
    const adminCtx = t.withIdentity({ subject: adminId, email: adminEmail });

    const projectId = await seedProject(t, standardId, { name: 'Target Project' });

    return { t, standardCtx, adminCtx, projectId };
  }

  test('admin can access raw GA4 and GSC feeds', async () => {
    const { adminCtx, projectId } = await setup();

    // Should succeed because they are an admin
    const gscResponse = await adminCtx.query(api.admin.projectAnalytics.getRawGSCFeed, {
      projectId,
      paginationOpts: { numItems: 10, cursor: null },
    });

    const ga4Response = await adminCtx.query(api.admin.projectAnalytics.getRawGA4Feed, {
      projectId,
      paginationOpts: { numItems: 10, cursor: null },
    });

    expect(gscResponse.page).toBeDefined();
    expect(ga4Response.page).toBeDefined();
  });

  test('standard user CANNOT access raw GSC feed', async () => {
    const { standardCtx, projectId } = await setup();

    await expect(
      standardCtx.query(api.admin.projectAnalytics.getRawGSCFeed, {
        projectId,
        paginationOpts: { numItems: 10, cursor: null },
      })
    ).rejects.toThrow('Forbidden: Requires admin role or higher');
  });

  test('standard user CANNOT access raw GA4 feed', async () => {
    const { standardCtx, projectId } = await setup();

    await expect(
      standardCtx.query(api.admin.projectAnalytics.getRawGA4Feed, {
        projectId,
        paginationOpts: { numItems: 10, cursor: null },
      })
    ).rejects.toThrow('Forbidden: Requires admin role or higher');
  });

  test('unauthenticated user is rejected', async () => {
    const { t, projectId } = await setup();

    await expect(
      t.query(api.admin.projectAnalytics.getRawGSCFeed, {
        projectId,
        paginationOpts: { numItems: 10, cursor: null },
      })
    ).rejects.toThrow();
  });
});

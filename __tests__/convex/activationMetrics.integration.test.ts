/**
 * Activation Rate — Integration Tests (GTM-2)
 *
 * Tests the getActivationMetrics admin query that computes
 * what % of onboarded users have generated content.
 */

import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser } from './testHelpers';
import { api, internal } from '../../convex/_generated/api';
import { BI_EVENTS } from '../../convex/lib/eventTypes';

describe('Activation Metrics (GTM-2)', () => {
  it('should return 0% activation when no users exist', async () => {
    const t = createTestContext();
    const superAdminId = await seedUser(t, { role: 'super_admin' });
    const adminT = t.withIdentity({ subject: superAdminId });

    const metrics = await adminT.query(api.analytics.activation.getActivationMetrics, {});

    expect(metrics.totalOnboarded).toBe(1); // super_admin is onboarded
    expect(metrics.activated).toBe(0);
    expect(metrics.activationRate).toBe(0);
  });

  it('should compute correct activation rate', async () => {
    const t = createTestContext();
    const superAdminId = await seedUser(t, { role: 'super_admin' });
    const adminT = t.withIdentity({ subject: superAdminId });

    // Create 3 onboarded users
    const user1 = await seedUser(t, { email: 'user1@test.com' });
    const user2 = await seedUser(t, { email: 'user2@test.com' });
    await seedUser(t, { email: 'user3@test.com' }); // never generates content

    // Emit content_generated for users 1 and 2
    await t.mutation(internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.CONTENT_GENERATED,
      userId: user1,
      properties: { contentType: 'blog' },
    });

    await t.mutation(internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.CONTENT_GENERATED,
      userId: user2,
      properties: { contentType: 'service' },
    });

    const metrics = await adminT.query(api.analytics.activation.getActivationMetrics, {});

    // 4 total onboarded (3 users + super_admin), 2 activated
    expect(metrics.totalOnboarded).toBe(4);
    expect(metrics.activated).toBe(2);
    expect(metrics.activationRate).toBe(50); // 2/4 = 50%
  });

  it('should block non-super_admin access', async () => {
    const t = createTestContext();
    const userId = await seedUser(t, { role: 'user' });
    const userT = t.withIdentity({ subject: userId });

    await expect(
      userT.query(api.analytics.activation.getActivationMetrics, {})
    ).rejects.toThrow();
  });

  it('should handle duplicate content_generated events for same user', async () => {
    const t = createTestContext();
    const superAdminId = await seedUser(t, { role: 'super_admin' });
    const adminT = t.withIdentity({ subject: superAdminId });

    const user1 = await seedUser(t, { email: 'user1@test.com' });

    // Same user generates content twice — should only count as 1 activated user
    await t.mutation(internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.CONTENT_GENERATED,
      userId: user1,
    });
    await t.mutation(internal.analytics.eventTracking.internalTrackBiEvent, {
      event: BI_EVENTS.CONTENT_GENERATED,
      userId: user1,
    });

    const metrics = await adminT.query(api.analytics.activation.getActivationMetrics, {});

    // user1 activated (deduplicated), super_admin not activated
    expect(metrics.activated).toBe(1);
    expect(metrics.totalOnboarded).toBe(2);
    expect(metrics.activationRate).toBe(50);
  });
});

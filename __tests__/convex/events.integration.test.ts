import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Analytics Events', () => {
  it('should track an event and allow admins to see reports', async () => {
    const t = createTestContext();
    const userId = await seedUser(t);
    const authT = t.withIdentity({ subject: userId });

    // Track an event
    await authT.mutation(api.analytics.events.trackEvent, {
      event: 'login',
      sessionId: 'sess_abc',
      properties: { browser: 'chrome' },
    });

    // An admin comes along to view the reports
    const adminId = await seedUser(t, { role: 'admin' });
    const adminT = t.withIdentity({ subject: adminId });

    const userEvents = await adminT.query(api.analytics.events.getEventsByUser, {
      userId,
    });
    expect(userEvents).toHaveLength(1);
    expect(userEvents[0].event).toBe('login');

    const funnel = await adminT.query(api.analytics.events.getFunnelMetrics, {});
    expect(funnel?.totalEvents).toBeGreaterThan(0);
  });

  it('should block non-admins from viewing reports', async () => {
    const t = createTestContext();
    const strangerId = await seedUser(t, { role: 'user' });
    const strangerT = t.withIdentity({ subject: strangerId });

    // Try to get funnel metrics (admin restricted)
    const funnel = await strangerT.query(api.analytics.events.getFunnelMetrics, {});
    expect(funnel).toBeNull();

    // Try to get events by user
    const otherUserId = await seedUser(t);
    const userEvents = await strangerT.query(api.analytics.events.getEventsByUser, {
      userId: otherUserId,
    });
    expect(userEvents).toHaveLength(0);
  });
});

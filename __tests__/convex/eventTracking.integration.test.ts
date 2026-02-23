import { describe, it, expect } from 'vitest';
import { createTestContext, seedUser } from './testHelpers';
import { api } from '../../convex/_generated/api';

describe('Event Tracking (Admin/SuperAdmin)', () => {
  it('should allow public event tracking', async () => {
    const t = createTestContext();

    // Unauthenticated context
    await t.mutation(api.analytics.eventTracking.trackEvent, {
      event: 'page_view',
      sessionId: 'sess_123',
    });

    // Authenticated context
    const userId = await seedUser(t);
    const authT = t.withIdentity({ subject: userId });
    await authT.mutation(api.analytics.eventTracking.trackEvent, {
      event: 'signup_started',
      sessionId: 'sess_123',
    });
  });

  it('should aggregate metrics for super_admin', async () => {
    const t = createTestContext();
    const superAdminId = await seedUser(t, { role: 'super_admin' });
    const superT = t.withIdentity({ subject: superAdminId });

    // Insert dummy events using the internal context or public mutation
    await superT.mutation(api.analytics.eventTracking.trackEvent, {
      event: 'signup_completed',
      sessionId: 'sess_456',
    });

    await superT.mutation(api.analytics.eventTracking.trackEvent, {
      event: 'signup_completed', // duplicate
      sessionId: 'sess_789',
    });

    // Funnel metrics
    const funnel = await superT.query(api.analytics.eventTracking.getFunnelMetrics, {});
    expect(funnel.totalEvents).toBeGreaterThanOrEqual(2);

    // Trends
    const trends = await superT.query(api.analytics.eventTracking.getEventTrends, {
      groupBy: 'day',
    });
    expect(trends.trend.length).toBeGreaterThanOrEqual(1);

    // Top Events
    const top = await superT.query(api.analytics.eventTracking.getTopEvents, { limit: 5 });
    expect(top.topEvents[0].event).toBe('signup_completed');

    // Recent Events
    const recent = await superT.query(api.analytics.eventTracking.getRecentEvents, { limit: 10 });
    expect(recent.length).toBeGreaterThanOrEqual(2);
  });

  it('should block non-super_admins', async () => {
    const t = createTestContext();
    const adminId = await seedUser(t, { role: 'admin' });
    const adminT = t.withIdentity({ subject: adminId });

    await expect(adminT.query(api.analytics.eventTracking.getFunnelMetrics, {})).rejects.toThrow();
  });
});

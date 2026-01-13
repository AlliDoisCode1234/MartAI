/**
 * Admin Portal Integration Tests
 *
 * Comprehensive tests for:
 * - Dashboard metrics (admin.dashboard)
 * - BI Analytics (analytics.eventTracking) - super_admin only
 * - Subscription metrics (subscriptions.subscriptionMetrics) - super_admin only
 * - Cost tracking (admin.costs) - super_admin only
 *
 * Security: Tests verify RBAC enforcement at each level
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { convexTest } from 'convex-test';
import schema from './schema';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';

describe('Admin Dashboard Metrics', () => {
  let t: ReturnType<typeof convexTest>;
  let adminUserId: Id<'users'>;
  let superAdminUserId: Id<'users'>;
  let regularUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const regular = await ctx.db.insert('users', {
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const admin = await ctx.db.insert('users', {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const superAdmin = await ctx.db.insert('users', {
        email: 'super@example.com',
        name: 'Super Admin',
        role: 'super_admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { regular, admin, superAdmin };
    });

    regularUserId = result.regular;
    adminUserId = result.admin;
    superAdminUserId = result.superAdmin;
  });

  test('should reject unauthenticated dashboard request', async () => {
    await expect(t.query(api.admin.dashboard.getAdminDashboardMetrics, {})).rejects.toThrow(
      'Unauthorized'
    );
  });

  test('should reject regular user from dashboard', async () => {
    const regularT = t.withIdentity({ subject: regularUserId });
    await expect(regularT.query(api.admin.dashboard.getAdminDashboardMetrics, {})).rejects.toThrow(
      /Forbidden|admin/i
    );
  });

  test('should allow admin to view dashboard', async () => {
    const adminT = t.withIdentity({ subject: adminUserId });
    const metrics = await adminT.query(api.admin.dashboard.getAdminDashboardMetrics, {});

    expect(metrics).toHaveProperty('totalUsers');
    expect(metrics).toHaveProperty('newUsersThisWeek');
    expect(metrics).toHaveProperty('activeUsers');
    expect(metrics).toHaveProperty('activeSubscriptions');
    expect(metrics).toHaveProperty('recentActivity');
    expect(metrics).toHaveProperty('recentUsers');
    expect(metrics).toHaveProperty('userTrend');
  });

  test('should allow super_admin to view dashboard', async () => {
    const superT = t.withIdentity({ subject: superAdminUserId });
    const metrics = await superT.query(api.admin.dashboard.getAdminDashboardMetrics, {});

    expect(metrics.totalUsers).toBeGreaterThanOrEqual(3); // Our 3 test users
    expect(Array.isArray(metrics.userTrend)).toBe(true);
  });
});

describe('Admin Users: Extended Queries', () => {
  let t: ReturnType<typeof convexTest>;
  let adminUserId: Id<'users'>;
  let superAdminUserId: Id<'users'>;
  let regularUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const regular = await ctx.db.insert('users', {
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const admin = await ctx.db.insert('users', {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const superAdmin = await ctx.db.insert('users', {
        email: 'super@example.com',
        name: 'Super Admin',
        role: 'super_admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { regular, admin, superAdmin };
    });

    regularUserId = result.regular;
    adminUserId = result.admin;
    superAdminUserId = result.superAdmin;
  });

  test('should allow admin to getUserDetails', async () => {
    const adminT = t.withIdentity({ subject: adminUserId });
    const details = await adminT.query(api.admin.users.getUserDetails, { userId: regularUserId });

    expect(details).toHaveProperty('email');
    expect(details).toHaveProperty('name');
    expect(details?.email).toBe('user@example.com');
  });

  test('should allow admin to getUserByEmail', async () => {
    const adminT = t.withIdentity({ subject: adminUserId });
    const user = await adminT.query(api.admin.users.getUserByEmail, { email: 'user@example.com' });

    expect(user).not.toBeNull();
    expect(user?._id).toEqual(regularUserId);
  });

  test('should return null for non-existent email', async () => {
    const adminT = t.withIdentity({ subject: adminUserId });
    const user = await adminT.query(api.admin.users.getUserByEmail, {
      email: 'notexist@example.com',
    });

    expect(user).toBeNull();
  });

  test('should allow admin to listAdmins', async () => {
    const adminT = t.withIdentity({ subject: adminUserId });
    const admins = await adminT.query(api.admin.users.listAdmins, {});

    expect(Array.isArray(admins)).toBe(true);
    expect(admins.length).toBeGreaterThanOrEqual(2); // admin + super_admin
    expect(admins.some((a: { email?: string }) => a.email === 'admin@example.com')).toBe(true);
    expect(admins.some((a: { email?: string }) => a.email === 'super@example.com')).toBe(true);
  });

  test('should reject regular user from getUserDetails', async () => {
    const regularT = t.withIdentity({ subject: regularUserId });
    await expect(
      regularT.query(api.admin.users.getUserDetails, { userId: adminUserId })
    ).rejects.toThrow(/Forbidden|admin/i);
  });
});

describe('Admin Costs (super_admin only)', () => {
  let t: ReturnType<typeof convexTest>;
  let adminUserId: Id<'users'>;
  let superAdminUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const admin = await ctx.db.insert('users', {
        email: 'admin@example.com',
        role: 'admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const superAdmin = await ctx.db.insert('users', {
        email: 'super@example.com',
        role: 'super_admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { admin, superAdmin };
    });

    adminUserId = result.admin;
    superAdminUserId = result.superAdmin;
  });

  test('should reject admin from getAllAICosts', async () => {
    const adminT = t.withIdentity({ subject: adminUserId });
    await expect(adminT.query(api.admin.costs.getAllAICosts, {})).rejects.toThrow(
      /super_admin|Forbidden/i
    );
  });

  test('should reject admin from getAICostSummary', async () => {
    const adminT = t.withIdentity({ subject: adminUserId });
    await expect(adminT.query(api.admin.costs.getAICostSummary, {})).rejects.toThrow(
      /super_admin|Forbidden/i
    );
  });

  // Note: super_admin tests for costs require neutralCost component table
  // which isn't available in unit test context - these are tested manually
});

describe('BI Analytics: Event Tracking (super_admin only)', () => {
  let t: ReturnType<typeof convexTest>;
  let adminUserId: Id<'users'>;
  let superAdminUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const admin = await ctx.db.insert('users', {
        email: 'admin@example.com',
        name: 'Admin',
        role: 'admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const superAdmin = await ctx.db.insert('users', {
        email: 'super@example.com',
        name: 'Super Admin',
        role: 'super_admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Seed some analytics events
      const now = Date.now();
      await ctx.db.insert('analyticsEvents', {
        event: 'signup_started',
        timestamp: now - 1000,
      });
      await ctx.db.insert('analyticsEvents', {
        event: 'signup_completed',
        timestamp: now - 500,
        userId: superAdmin,
      });
      await ctx.db.insert('analyticsEvents', {
        event: 'project_created',
        timestamp: now,
        userId: superAdmin,
      });

      return { admin, superAdmin };
    });

    adminUserId = result.admin;
    superAdminUserId = result.superAdmin;
  });

  test('should reject admin from getFunnelMetrics (requires super_admin)', async () => {
    const adminT = t.withIdentity({ subject: adminUserId, email: 'admin@example.com' });
    await expect(adminT.query(api.analytics.eventTracking.getFunnelMetrics, {})).rejects.toThrow(
      /super_admin|Super admin/i
    );
  });

  test('should allow super_admin to getFunnelMetrics', async () => {
    const superT = t.withIdentity({ subject: superAdminUserId, email: 'super@example.com' });
    const result = await superT.query(api.analytics.eventTracking.getFunnelMetrics, {});

    expect(result).toHaveProperty('funnel');
    expect(result).toHaveProperty('totalEvents');
    expect(Array.isArray(result.funnel)).toBe(true);
    expect(result.totalEvents).toBeGreaterThanOrEqual(3);
  });

  test('should reject admin from getTopEvents', async () => {
    const adminT = t.withIdentity({ subject: adminUserId, email: 'admin@example.com' });
    await expect(adminT.query(api.analytics.eventTracking.getTopEvents, {})).rejects.toThrow(
      /super_admin|Super admin/i
    );
  });

  test('should allow super_admin to getTopEvents', async () => {
    const superT = t.withIdentity({ subject: superAdminUserId, email: 'super@example.com' });
    const result = await superT.query(api.analytics.eventTracking.getTopEvents, { days: 7 });

    expect(result).toHaveProperty('topEvents');
    expect(Array.isArray(result.topEvents)).toBe(true);
  });

  test('should reject admin from getRecentEvents', async () => {
    const adminT = t.withIdentity({ subject: adminUserId, email: 'admin@example.com' });
    await expect(adminT.query(api.analytics.eventTracking.getRecentEvents, {})).rejects.toThrow(
      /super_admin|Super admin/i
    );
  });

  test('should allow super_admin to getRecentEvents', async () => {
    const superT = t.withIdentity({ subject: superAdminUserId, email: 'super@example.com' });
    const events = await superT.query(api.analytics.eventTracking.getRecentEvents, { limit: 10 });

    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty('event');
    expect(events[0]).toHaveProperty('timestamp');
  });

  test('should reject admin from getEventTrends', async () => {
    const adminT = t.withIdentity({ subject: adminUserId, email: 'admin@example.com' });
    await expect(adminT.query(api.analytics.eventTracking.getEventTrends, {})).rejects.toThrow(
      /super_admin|Super admin/i
    );
  });

  test('should allow super_admin to getEventTrends', async () => {
    const superT = t.withIdentity({ subject: superAdminUserId, email: 'super@example.com' });
    const result = await superT.query(api.analytics.eventTracking.getEventTrends, { days: 7 });

    expect(result).toHaveProperty('trend');
    expect(Array.isArray(result.trend)).toBe(true);
  });
});

describe('Subscription Metrics (super_admin only)', () => {
  let t: ReturnType<typeof convexTest>;
  let adminUserId: Id<'users'>;
  let superAdminUserId: Id<'users'>;

  beforeEach(async () => {
    t = convexTest(schema);

    const result = await t.run(async (ctx) => {
      const admin = await ctx.db.insert('users', {
        email: 'admin@example.com',
        role: 'admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const superAdmin = await ctx.db.insert('users', {
        email: 'super@example.com',
        role: 'super_admin',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Seed a subscription with all required fields
      await ctx.db.insert('subscriptions', {
        userId: admin,
        status: 'active',
        planTier: 'growth',
        billingCycle: 'monthly',
        features: {
          maxUrls: 10,
          maxKeywordIdeas: 1000,
          maxAiReports: 50,
          maxContentPieces: 100,
        },
        priceMonthly: 99,
        startsAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { admin, superAdmin };
    });

    adminUserId = result.admin;
    superAdminUserId = result.superAdmin;
  });

  test('should reject admin from getSubscriptionMetrics', async () => {
    const adminT = t.withIdentity({ subject: adminUserId, email: 'admin@example.com' });
    await expect(
      adminT.query(api.subscriptions.subscriptionMetrics.getSubscriptionMetrics, {})
    ).rejects.toThrow(/super_admin|Forbidden/i);
  });

  test('should allow super_admin to getSubscriptionMetrics', async () => {
    const superT = t.withIdentity({ subject: superAdminUserId, email: 'super@example.com' });
    const metrics = await superT.query(
      api.subscriptions.subscriptionMetrics.getSubscriptionMetrics,
      {}
    );

    expect(metrics).toHaveProperty('mrr');
    expect(metrics).toHaveProperty('mrrFormatted');
    expect(metrics).toHaveProperty('activeCount');
    expect(metrics).toHaveProperty('churnRate');
    expect(metrics).toHaveProperty('growthRate');
    expect(metrics.activeCount).toBeGreaterThanOrEqual(1);
  });
});

describe('Event Tracking: trackEvent mutation', () => {
  let t: ReturnType<typeof convexTest>;

  beforeEach(() => {
    t = convexTest(schema);
  });

  test('should allow unauthenticated event tracking (for landing page)', async () => {
    const eventId = await t.mutation(api.analytics.eventTracking.trackEvent, {
      event: 'page_view',
      url: '/landing',
      sessionId: 'test-session-123',
    });

    expect(eventId).toBeDefined();
  });

  test('should track event with all properties', async () => {
    const result = await t.run(async (ctx) => {
      const user = await ctx.db.insert('users', {
        email: 'tracker@example.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { userId: user };
    });

    const authT = t.withIdentity({ subject: result.userId });
    const eventId = await authT.mutation(api.analytics.eventTracking.trackEvent, {
      event: 'content_published',
      properties: { contentId: 'abc123', platform: 'wordpress' },
      url: '/studio/abc123',
      referrer: '/studio',
      sessionId: 'session-456',
      userAgent: 'Test Agent',
      trackId: 'publish-btn',
    });

    expect(eventId).toBeDefined();
  });
});

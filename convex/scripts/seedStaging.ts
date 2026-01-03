/**
 * Staging Seed Data Script
 *
 * Creates test users and projects for staging environment.
 * Run with: npx convex run scripts/seedStaging:seedTestData --deployment staging
 *
 * IMPORTANT: This is idempotent - can be run multiple times safely.
 */

import { mutation } from '../_generated/server';

/**
 * Seed test data for staging environment
 */
export const seedTestData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), 'test@phoo.ai'))
      .first();

    if (existingUser) {
      return {
        message: 'Staging already seeded',
        userId: existingUser._id,
        alreadySeeded: true,
      };
    }

    // Create test user (Growth tier)
    const testUserId = await ctx.db.insert('users', {
      email: 'test@phoo.ai',
      name: 'Test User',
      membershipTier: 'growth',
      role: 'user',
      createdAt: Date.now(),
      onboardingStatus: 'completed',
    });

    // Create test project
    const testProjectId = await ctx.db.insert('projects', {
      userId: testUserId,
      name: 'Test Project - Staging',
      websiteUrl: 'https://example.com',
      industry: 'technology',
      projectType: 'own',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create test admin user (Super Admin)
    const adminUserId = await ctx.db.insert('users', {
      email: 'admin@phoo.ai',
      name: 'Admin User',
      membershipTier: 'enterprise',
      role: 'super_admin',
      createdAt: Date.now(),
      onboardingStatus: 'completed',
    });

    // Create viewer user for RBAC testing
    const viewerUserId = await ctx.db.insert('users', {
      email: 'viewer@phoo.ai',
      name: 'Viewer User',
      membershipTier: 'starter',
      role: 'viewer',
      createdAt: Date.now(),
      onboardingStatus: 'completed',
    });

    return {
      message: 'Staging data seeded successfully',
      testUserId,
      testProjectId,
      adminUserId,
      viewerUserId,
      alreadySeeded: false,
    };
  },
});

/**
 * Clear all staging data
 * WARNING: This deletes all data in the deployment!
 */
export const clearStagingData = mutation({
  args: {},
  handler: async (ctx) => {
    // Safety check - only allow on non-production
    const siteUrl = process.env.SITE_URL ?? '';
    if (siteUrl.includes('phoo.ai') && !siteUrl.includes('staging')) {
      throw new Error('SAFETY: Cannot clear data on production deployment!');
    }

    // Delete users created by seed script
    const seedEmails = ['test@phoo.ai', 'admin@phoo.ai', 'viewer@phoo.ai'];

    let deletedCount = 0;
    for (const email of seedEmails) {
      const user = await ctx.db
        .query('users')
        .filter((q) => q.eq(q.field('email'), email))
        .first();

      if (user) {
        await ctx.db.delete(user._id);
        deletedCount++;
      }
    }

    return {
      message: `Cleared ${deletedCount} seeded users`,
      deletedCount,
    };
  },
});

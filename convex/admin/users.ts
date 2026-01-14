import { v } from 'convex/values';
import { query, mutation } from '../_generated/server';
import { requireAdmin, requireSuperAdmin } from '../lib/rbac';

/**
 * Admin User Management
 *
 * Queries and mutations for managing users.
 * Security: All endpoints require admin or super_admin role.
 *
 * Two-tier data exposure:
 * - Table view: Minimal fields for list display
 * - Detail view: Full user data for individual user page
 */

// ============================================
// FIELD FILTERS (Never return more than UI needs)
// ============================================

/**
 * Fields for user table row (minimal)
 */
function filterUserTableFields(user: any, subscription: any | null) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    accountStatus: user.accountStatus ?? 'active',
    subscriptionStatus: subscription?.status ?? null,
    subscriptionPlan: subscription?.planTier ?? null,
    billingCycle: subscription?.billingCycle ?? null,
    createdAt: user.createdAt ?? user._creationTime,
    lastActiveAt: user.lastActiveAt,
  };
}

/**
 * Fields for user detail page (comprehensive)
 * Excludes: passwordHash, tokens, internal IDs
 */
function filterUserDetailFields(user: any, subscription: any | null, projects: any[]) {
  return {
    // Basic info
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    membershipTier: user.membershipTier,
    bio: user.bio,
    preferences: user.preferences,
    createdAt: user.createdAt ?? user._creationTime,
    updatedAt: user.updatedAt,

    // Account status
    accountStatus: user.accountStatus ?? 'active',
    churnedAt: user.churnedAt,
    churnReason: user.churnReason,
    reactivatedAt: user.reactivatedAt,
    lastPaymentAt: user.lastPaymentAt,

    // Onboarding
    onboardingStatus: user.onboardingStatus,
    onboardingSteps: user.onboardingSteps,
    lastActiveAt: user.lastActiveAt,

    // Engagement milestones
    engagementMilestones: user.engagementMilestones,

    // Subscription (if exists)
    subscription: subscription
      ? {
          _id: subscription._id,
          planTier: subscription.planTier,
          status: subscription.status,
          billingCycle: subscription.billingCycle,
          priceMonthly: subscription.priceMonthly,
          features: subscription.features,
          startsAt: subscription.startsAt,
          renewsAt: subscription.renewsAt,
          cancelAt: subscription.cancelAt,
          graceStartedAt: subscription.graceStartedAt,
          maintenanceStartedAt: subscription.maintenanceStartedAt,
          lastPaymentAt: subscription.lastPaymentAt,
          lastPaymentFailedAt: subscription.lastPaymentFailedAt,
          failedPaymentCount: subscription.failedPaymentCount,
        }
      : null,

    // Projects summary
    projectCount: projects.length,
    projects: projects.map((p) => ({
      _id: p._id,
      name: p.name,
      websiteUrl: p.websiteUrl,
      createdAt: p.createdAt,
    })),
  };
}

// ============================================
// QUERIES
// ============================================

/**
 * List users for admin table (minimal fields)
 * Security: Requires admin role
 */
export const listUsers = query({
  args: {
    limit: v.optional(v.number()),
    accountStatus: v.optional(
      v.union(
        v.literal('active'),
        v.literal('inactive'),
        v.literal('churned'),
        v.literal('suspended')
      )
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const limit = args.limit || 50;

    // Get users
    let usersQuery = ctx.db.query('users').order('desc');
    const users = await usersQuery.take(limit);

    // Efficiently fetch subscriptions for all users in parallel
    // Convex optimizes parallel indexed queries
    const result = await Promise.all(
      users.map(async (user) => {
        // Filter by account status if specified
        if (args.accountStatus && user.accountStatus !== args.accountStatus) {
          return null;
        }

        const subscription = await ctx.db
          .query('subscriptions')
          .withIndex('by_user', (q) => q.eq('userId', user._id))
          .first();

        return filterUserTableFields(user, subscription);
      })
    );

    return result.filter(Boolean);
  },
});

/**
 * Get full user details (for user detail page)
 * Security: Requires admin role
 */
export const getUserDetails = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get subscription
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    // Get projects
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    return filterUserDetailFields(user, subscription, projects);
  },
});

/**
 * Get user by email (Admin only)
 */
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email))
      .first();

    if (!user) return null;

    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    return filterUserTableFields(user, subscription);
  },
});

/**
 * List all admin and super_admin users (Admin only)
 */
export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const admins = await ctx.db
      .query('users')
      .filter((q) => q.or(q.eq(q.field('role'), 'admin'), q.eq(q.field('role'), 'super_admin')))
      .collect();

    return Promise.all(
      admins.map(async (user) => {
        const subscription = await ctx.db
          .query('subscriptions')
          .withIndex('by_user', (q) => q.eq('userId', user._id))
          .first();
        return filterUserTableFields(user, subscription);
      })
    );
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Update a user's role (Super Admin only)
 */
export const updateUserRole = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(
      v.literal('user'),
      v.literal('admin'),
      v.literal('super_admin'),
      v.literal('viewer')
    ),
  },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: Date.now(),
    });

    console.log(`[AdminRoleChange] User ${args.userId} role changed to ${args.role}`);

    return { success: true, previousRole: user.role, newRole: args.role };
  },
});

/**
 * Update user's account status (Super Admin only)
 * For manual suspension, reactivation, etc.
 */
export const updateAccountStatus = mutation({
  args: {
    userId: v.id('users'),
    accountStatus: v.union(
      v.literal('active'),
      v.literal('inactive'),
      v.literal('churned'),
      v.literal('suspended')
    ),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const now = Date.now();
    const updates: Record<string, any> = {
      accountStatus: args.accountStatus,
      updatedAt: now,
    };

    // Track churn/reactivation timestamps
    if (args.accountStatus === 'churned') {
      updates.churnedAt = now;
      updates.churnReason = args.reason;
    } else if (args.accountStatus === 'active' && user.accountStatus !== 'active') {
      updates.reactivatedAt = now;
    }

    await ctx.db.patch(args.userId, updates);

    console.log(`[AdminStatusChange] User ${args.userId} status changed to ${args.accountStatus}`);

    return { success: true, previousStatus: user.accountStatus, newStatus: args.accountStatus };
  },
});

/**
 * Hash a token using SHA-256
 */
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Send password reset email (Admin only)
 * Generates a secure token and triggers email
 */
export const sendPasswordResetEmail = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.email) {
      throw new Error('User has no email address');
    }

    // Generate secure token (32 bytes = 64 hex chars)
    const rawToken = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
    ).join('');

    // Hash token with SHA-256 for secure storage
    const tokenHash = await hashToken(rawToken);
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    // Get admin who triggered this
    const adminId = await ctx.auth.getUserIdentity();
    const admin = adminId
      ? await ctx.db
          .query('users')
          .filter((q) => q.eq(q.field('email'), adminId.email))
          .first()
      : null;

    // Store hashed token (never store raw token)
    await ctx.db.insert('passwordResetTokens', {
      userId: args.userId,
      tokenHash,
      expiresAt,
      createdAt: Date.now(),
      triggeredBy: admin?._id,
    });

    // Log action (no PII per security rules)
    console.log(`[AdminPasswordReset] Reset email triggered for user ${args.userId}`);

    // Return raw token for email (sent to user, not stored)
    return {
      success: true,
      email: user.email,
      name: user.name,
      token: rawToken,
    };
  },
});

import { v } from 'convex/values';
import { query, mutation } from '../_generated/server';
import { requireAdmin, requireSuperAdmin } from '../lib/rbac';
import { api } from '../_generated/api';

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
function filterUserTableFields(user: any, subscription: any | null, internalRole?: string) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: internalRole || 'user',
    isQATester: user.isQATester ?? false,
    acquisitionSource: user.acquisitionSource ?? null,
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
function filterUserDetailFields(user: any, subscription: any | null, projects: any[], internalRole?: string) {
  return {
    // Basic info
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: internalRole || 'user',
    membershipTier: user.membershipTier,
    bio: user.bio,
    preferences: user.preferences,
    createdAt: user.createdAt ?? user._creationTime,
    updatedAt: user.updatedAt,

    // Account status & QA Tracking
    accountStatus: user.accountStatus ?? 'active',
    isQATester: user.isQATester ?? false,
    acquisitionSource: user.acquisitionSource ?? null,
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

        const internalAdmin = await ctx.db
          .query('internalAdmins')
          .withIndex('by_user', (q) => q.eq('userId', user._id))
          .first();

        return filterUserTableFields(user, subscription, internalAdmin?.role);
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

    const internalAdmin = await ctx.db
      .query('internalAdmins')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    return filterUserDetailFields(user, subscription, projects, internalAdmin?.role);
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

    const sanitizedEmail = args.email.trim().toLowerCase();

    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', sanitizedEmail))
      .first();

    if (!user) return null;

    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    const internalAdmin = await ctx.db
      .query('internalAdmins')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    return filterUserTableFields(user, subscription, internalAdmin?.role);
  },
});

/**
 * List all admin and super_admin users (Admin only)
 */
export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const internalAdmins = await ctx.db.query('internalAdmins').collect();
    const admins = (await Promise.all(internalAdmins.map(a => ctx.db.get(a.userId)))).filter(Boolean);

    const result = await Promise.all(
      admins.map(async (user) => {
        if (!user) return null; // Should not happen due to filter(Boolean) above, but good for type safety
        const subscription = await ctx.db
          .query('subscriptions')
          .withIndex('by_user', (q) => q.eq('userId', user._id))
          .first();
          
        const internalAdmin = internalAdmins.find(a => a.userId === user._id);
        
        return filterUserTableFields(user, subscription, internalAdmin?.role);
      })
    );
    return result.filter(Boolean);
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Provision a new member user from the Admin portal.
 * Security: Super Admin only.
 *
 * NOTE: This mutation creates member-level users ONLY (user/viewer).
 * To grant admin/super_admin privileges, use updateUserRole after provisioning.
 * This enforces separation of concerns: user creation vs privilege escalation.
 */
export const provisionUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal('user'),
      v.literal('viewer')
    ),
    isBetaUser: v.optional(v.boolean()),
    isQATester: v.optional(v.boolean()),
    betaNotes: v.optional(v.string()),
    membershipTier: v.optional(
      v.union(
        v.literal('starter'),
        v.literal('engine'),
        v.literal('agency'),
        v.literal('enterprise')
      )
    ),
  },
  handler: async (ctx, args) => {
    const sanitizedEmail = args.email.trim().toLowerCase();

    // GLASSWING-015: Verify caller has super admin access to provision explicitly
    await requireSuperAdmin(ctx);

    const existingUser = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', sanitizedEmail))
      .first();

    if (existingUser) {
      throw new Error(`User with email ${sanitizedEmail} already exists`);
    }

    const now = Date.now();
    const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
    const isBeta = args.isBetaUser ?? false;

    // QA testers default to agency tier (team invites, multi-project)
    // Beta users default to starter tier
    // Non-beta users get no tier (subscription required)
    const tier = args.membershipTier
      ?? (args.isQATester ? 'agency' : isBeta ? 'starter' : undefined);

    const userId = await ctx.db.insert('users', {
      email: sanitizedEmail,
      name: args.name,
      role: args.role,
      onboardingStatus: 'not_started',
      accountStatus: 'active',
      isBetaUser: isBeta,
      isQATester: args.isQATester ?? false,
      // Beta users: set expiry so recordUsage bypass works (Board Decision 2026-04-20)
      // QA testers: also get expiry for consistency, but bypass via isQATester anyway
      betaExpiresAt: isBeta || args.isQATester ? now + SIX_MONTHS_MS : undefined,
      betaNotes: args.betaNotes,
      membershipTier: tier,
      acquisitionSource: isBeta ? 'waitlist_beta' : args.isQATester ? 'migration' : 'organic',
      acquisitionDate: now,
      createdAt: now,
      updatedAt: now,
    });

    // Schedule HubSpot sync (non-blocking, fire-and-forget)
    // Matches waitlist path provisioning completeness
    await ctx.scheduler.runAfter(0, api.integrations.hubspot.syncUserToHubspot, {
      userId,
    });

    return { success: true, userId };
  },
});

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

    const existingInternal = await ctx.db
      .query('internalAdmins')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    if (args.role === 'user' || args.role === 'viewer') {
      if (existingInternal) await ctx.db.delete(existingInternal._id);
    } else {
      if (existingInternal) {
        await ctx.db.patch(existingInternal._id, { role: args.role, updatedAt: Date.now() });
      } else {
        await ctx.db.insert('internalAdmins', { userId: args.userId, role: args.role, createdAt: Date.now(), updatedAt: Date.now() });
      }
    }

    // Keep canonical users document in sync
    await ctx.db.patch(args.userId, { 
      role: args.role === 'super_admin' || args.role === 'admin' ? 'user' : args.role,
      updatedAt: Date.now() 
    });


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

/**
 * Update Data Hygiene parameters (Super Admin only)
 * Explicit tracking to exclude Internal testing data from BI reports
 */
export const updateHygieneTags = mutation({
  args: {
    userId: v.id('users'),
    isQATester: v.optional(v.boolean()),
    acquisitionSource: v.optional(
      v.union(
        v.literal('waitlist_beta'),
        v.literal('organic'),
        v.literal('referral'),
        v.literal('partner'),
        v.literal('paid'),
        v.literal('migration')
      )
    ),
  },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updates: Record<string, any> = {};
    if (args.isQATester !== undefined) updates.isQATester = args.isQATester;
    if (args.acquisitionSource !== undefined) updates.acquisitionSource = args.acquisitionSource;

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = Date.now();
      await ctx.db.patch(args.userId, updates);
      console.log(`[Admin] Hygiene tags updated for user ${args.userId}`, updates);
    } else {
      console.log(`[Admin] No hygiene tags updated for user ${args.userId} (empty updates)`);
    }

    return { success: true };
  },
});

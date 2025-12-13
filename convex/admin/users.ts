import { v } from 'convex/values';
import { query, mutation } from '../_generated/server';
import { requireAdmin, requireSuperAdmin } from '../lib/rbac';

/**
 * Admin User Management
 *
 * Queries and mutations for managing user roles.
 * Security: All endpoints require admin or super_admin role.
 */

/**
 * Filter user object to safe fields only.
 * Rule: Never return more data than the UI requires.
 */
function filterUserFields(user: any) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt ?? user._creationTime,
    onboardingStatus: user.onboardingStatus,
  };
}

/**
 * Get user by email (Admin only)
 */
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Security: Require admin role
    await requireAdmin(ctx);

    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email))
      .first();

    return user ? filterUserFields(user) : null;
  },
});

/**
 * List all admin and super_admin users (Admin only)
 */
export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    // Security: Require admin role
    await requireAdmin(ctx);

    const admins = await ctx.db
      .query('users')
      .filter((q) => q.or(q.eq(q.field('role'), 'admin'), q.eq(q.field('role'), 'super_admin')))
      .collect();

    return admins.map(filterUserFields);
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
    // Security: Only super_admin can change roles
    await requireSuperAdmin(ctx);

    // Verify the user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update the role
    await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: Date.now(),
    });

    return { success: true, previousRole: user.role, newRole: args.role };
  },
});

/**
 * Get all users (paginated) for admin management (Admin only)
 */
export const listUsers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Security: Require admin role
    await requireAdmin(ctx);

    const limit = args.limit || 50;
    const users = await ctx.db.query('users').order('desc').take(limit);

    return users.map(filterUserFields);
  },
});

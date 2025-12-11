import { v } from 'convex/values';
import { query, mutation } from '../_generated/server';

/**
 * Admin User Management
 *
 * Queries and mutations for managing user roles.
 */

/**
 * Get user by email
 */
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email))
      .first();
  },
});

/**
 * List all admin and super_admin users
 */
export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    const admins = await ctx.db
      .query('users')
      .filter((q) => q.or(q.eq(q.field('role'), 'admin'), q.eq(q.field('role'), 'super_admin')))
      .collect();

    return admins;
  },
});

/**
 * Update a user's role
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
 * Get all users (paginated) for admin management
 */
export const listUsers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    return await ctx.db.query('users').order('desc').take(limit);
  },
});

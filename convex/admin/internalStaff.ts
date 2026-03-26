import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { requireSuperAdmin } from '../lib/rbac';

/**
 * Get all internal staff
 * Security: Requires super_admin role.
 */
export const listStaff = query({
  args: {},
  handler: async (ctx) => {
    // Only super_admins can view the staff roster
    await requireSuperAdmin(ctx);

    const internalAdmins = await ctx.db.query('internalAdmins').collect();
    
    // Enrich with user names/emails for the UI
    const enriched = await Promise.all(
      internalAdmins.map(async (admin) => {
        const user = await ctx.db.get(admin.userId);
        return {
          _id: admin._id,
          userId: admin.userId,
          role: admin.role,
          email: user?.email || 'Unknown',
          name: user?.name || 'Unknown',
          createdAt: admin.createdAt,
          lastActiveAt: admin.lastActiveAt,
        };
      })
    );

    return enriched;
  },
});

/**
 * Promote an existing user to internal staff via exact email match.
 * Security: Requires super_admin. High friction pattern.
 */
export const promoteUser = mutation({
  args: { 
    email: v.string(), 
    role: v.union(v.literal('super_admin'), v.literal('admin'), v.literal('sales')) 
  },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);

    // 1. Exact email match required to prevent accidental elevation
    const user = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email))
      .first();

    if (!user) {
      throw new Error(`Execution Failed: No standard user found matching exact email "${args.email}".`);
    }

    // 2. Check if already staff
    const existing = await ctx.db
      .query('internalAdmins')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    if (existing) {
      throw new Error(`Execution Failed: User "${args.email}" is already internal staff.`);
    }

    // 3. Insert into the isolated internalAdmins table
    const newAdminId = await ctx.db.insert('internalAdmins', {
      userId: user._id,
      role: args.role,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return newAdminId;
  },
});

/**
 * Demote internal staff (Revoke access)
 * Security: Requires super_admin. Cannot demote the last super_admin or oneself.
 */
export const revokeAccess = mutation({
  args: { adminId: v.id('internalAdmins') },
  handler: async (ctx, args) => {
    const callerId = await requireSuperAdmin(ctx);

    const targetAdmin = await ctx.db.get(args.adminId);
    if (!targetAdmin) {
      throw new Error('Not found: Staff record does not exist.');
    }

    // Prevent self-lockout
    if (targetAdmin.userId === callerId) {
      throw new Error('Action blocked: You cannot revoke your own super_admin privileges this way.');
    }

    // Prevent revoking the last super_admin
    if (targetAdmin.role === 'super_admin') {
      const superAdmins = await ctx.db
        .query('internalAdmins')
        .withIndex('by_role', (q) => q.eq('role', 'super_admin'))
        .collect();
      
      if (superAdmins.length <= 1) {
        throw new Error('Action blocked: Cannot revoke the last super_admin.');
      }
    }

    await ctx.db.delete(args.adminId);
  },
});

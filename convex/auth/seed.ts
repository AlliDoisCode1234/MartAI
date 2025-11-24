/**
 * Seed mutations for development
 * Create test users, admin accounts, etc.
 */

import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Create admin user - internal mutation for seeding
 * This should only be called manually or in development
 */
export const createAdminUser = internalMutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error(`User with email ${args.email} already exists`);
    }

    // Hash password synchronously (Convex mutations can't use setTimeout)
    const passwordHash = bcrypt.hashSync(args.password, SALT_ROUNDS);

    // Create admin user
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name || "Admin User",
      passwordHash,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });

    return { userId, email: args.email, role: "admin" };
  },
});

/**
 * Create a fake test user
 */
export const createTestUser = internalMutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"), v.literal("viewer"))),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error(`User with email ${args.email} already exists`);
    }

    // Hash password synchronously (Convex mutations can't use setTimeout)
    const passwordHash = bcrypt.hashSync(args.password, SALT_ROUNDS);

    // Create user
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name || "Test User",
      passwordHash,
      role: args.role || "user",
      createdAt: now,
      updatedAt: now,
    });

    return { userId, email: args.email, role: args.role || "user" };
  },
});


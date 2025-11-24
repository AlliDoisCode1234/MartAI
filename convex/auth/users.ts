import { mutation, query, internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";

// Create user
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    passwordHash: v.string(), // Hashed on API side
    role: v.optional(v.union(v.literal("admin"), v.literal("user"), v.literal("viewer"))),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      passwordHash: args.passwordHash,
      role: args.role || "user", // Default to "user" role
      avatarUrl: args.avatarUrl,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Internal: Get user by email (includes passwordHash for verification only)
// NEVER expose this publicly - use getUserSnapshotByEmail instead
export const getUserByEmailInternal = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get user snapshot by email (excludes passwordHash)
export const getUserSnapshotByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!user) return null;
    
    // Return only safe fields
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
});

// Get user snapshot by ID (excludes passwordHash) - PUBLIC
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    
    // Return only safe fields
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
});

// Internal: Get user by ID (includes passwordHash) - for internal use only
export const getUserByIdInternal = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Internal: Verify user password (never exposes passwordHash)
export const verifyUserPassword = internalMutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!user || !user.passwordHash) {
      return { valid: false, userId: null };
    }
    
    // Import bcrypt dynamically (Convex mutations can't use setTimeout)
    const bcrypt = require("bcryptjs");
    const isValid = bcrypt.compareSync(args.password, user.passwordHash);
    
    // NEVER log passwordHash or password
    return {
      valid: isValid,
      userId: isValid ? user._id : null,
      user: isValid ? {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } : null,
    };
  },
});

// Alias for getUserById (kept for backward compatibility)
export const getUserSnapshotById = getUserById;

// Update user
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"), v.literal("viewer"))),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    preferences: v.optional(v.object({
      theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("auto"))),
      notifications: v.optional(v.boolean()),
      timezone: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      updatedAt: Date.now(),
    };
    
    if (args.name !== undefined) updates.name = args.name;
    if (args.role !== undefined) updates.role = args.role;
    if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.preferences !== undefined) updates.preferences = args.preferences;
    
    return await ctx.db.patch(args.userId, updates);
  },
});

// Update user profile (non-sensitive fields only)
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    preferences: v.optional(v.object({
      theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("auto"))),
      notifications: v.optional(v.boolean()),
      timezone: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      updatedAt: Date.now(),
    };
    
    if (args.name !== undefined) updates.name = args.name;
    if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.preferences !== undefined) updates.preferences = args.preferences;
    
    return await ctx.db.patch(args.userId, updates);
  },
});


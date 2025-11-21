// @ts-nocheck
// Note: Run `npx convex dev` to generate proper types
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store session token
export const createSession = mutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Remove old sessions for this user
    const oldSessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const session of oldSessions) {
      await ctx.db.delete(session._id);
    }

    return await ctx.db.insert("sessions", {
      userId: args.userId,
      token: args.token,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
  },
});

// Get session by token
export const getSessionByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) return null;
    
    // Check if expired
    if (session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  },
});

// Delete session
export const deleteSession = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

// Clean expired sessions
export const cleanExpiredSessions = mutation({
  handler: async (ctx) => {
    const sessions = await ctx.db.query("sessions").collect();
    const now = Date.now();
    
    for (const session of sessions) {
      if (session.expiresAt < now) {
        await ctx.db.delete(session._id);
      }
    }
  },
});


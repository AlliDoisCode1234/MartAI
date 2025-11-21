// @ts-nocheck
// Note: Run `npx convex dev` to generate proper types
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add ranking data
export const addRanking = mutation({
  args: {
    clientId: v.id("clients"),
    keyword: v.string(),
    position: v.number(),
    url: v.string(),
    searchEngine: v.string(),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("rankings", {
      clientId: args.clientId,
      keyword: args.keyword,
      position: args.position,
      url: args.url,
      searchEngine: args.searchEngine,
      location: args.location,
      date: Date.now(),
    });
  },
});

// Get rankings for keyword
export const getRankingsByKeyword = query({
  args: {
    clientId: v.id("clients"),
    keyword: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rankings")
      .withIndex("by_client_keyword", (q) => 
        q.eq("clientId", args.clientId).eq("keyword", args.keyword)
      )
      .order("desc")
      .collect();
  },
});

// Get all rankings for client
export const getRankingsByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rankings")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .order("desc")
      .take(100); // Latest 100 rankings
  },
});


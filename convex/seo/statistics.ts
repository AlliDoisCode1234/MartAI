import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update SEO statistics
export const upsertStatistics = mutation({
  args: {
    clientId: v.id("clients"),
    organicTraffic: v.optional(v.number()),
    organicKeywords: v.optional(v.number()),
    backlinks: v.optional(v.number()),
    referringDomains: v.optional(v.number()),
    avgPosition: v.optional(v.number()),
    clickThroughRate: v.optional(v.number()),
    impressions: v.optional(v.number()),
    periodStart: v.number(),
    periodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("seoStatistics", {
      clientId: args.clientId,
      organicTraffic: args.organicTraffic,
      organicKeywords: args.organicKeywords,
      backlinks: args.backlinks,
      referringDomains: args.referringDomains,
      avgPosition: args.avgPosition,
      clickThroughRate: args.clickThroughRate,
      impressions: args.impressions,
      periodStart: args.periodStart,
      periodEnd: args.periodEnd,
      createdAt: Date.now(),
    });
  },
});

// Get latest statistics
export const getLatestStatistics = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("seoStatistics")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .order("desc")
      .take(1);
    return stats[0] || null;
  },
});

// Get statistics by period
export const getStatisticsByPeriod = query({
  args: {
    clientId: v.id("clients"),
    periodStart: v.number(),
    periodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const allStats = await ctx.db
      .query("seoStatistics")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .collect();
    
    return allStats.filter(stat => 
      stat.periodStart >= args.periodStart && 
      stat.periodEnd <= args.periodEnd
    );
  },
});


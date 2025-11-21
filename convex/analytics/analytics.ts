import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Store analytics data point
export const storeAnalyticsData = mutation({
  args: {
    projectId: v.id("projects"),
    date: v.number(), // timestamp
    source: v.string(), // ga4, gsc
    sessions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    impressions: v.optional(v.number()),
    ctr: v.optional(v.number()),
    avgPosition: v.optional(v.number()),
    leads: v.optional(v.number()),
    revenue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { projectId, date, source, ...metrics } = args;
    
    // Check if data point exists
    const existing = await ctx.db
      .query("analyticsData")
      .withIndex("by_project_date_source", (q) => 
        q.eq("projectId", projectId).eq("date", date).eq("source", source)
      )
      .first();

    const data = {
      projectId,
      date,
      source,
      ...metrics,
      updatedAt: Date.now(),
    };

    if (existing) {
      return await ctx.db.patch(existing._id, data);
    }

    return await ctx.db.insert("analyticsData", {
      ...data,
      createdAt: Date.now(),
    });
  },
});

// Get analytics data for date range
export const getAnalyticsData = query({
  args: {
    projectId: v.id("projects"),
    startDate: v.number(),
    endDate: v.number(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("analyticsData")
      .withIndex("by_project_date", (q) => 
        q.eq("projectId", args.projectId)
      );

    const allData = await query.collect();
    
    return allData.filter(d => 
      d.date >= args.startDate && 
      d.date <= args.endDate &&
      (!args.source || d.source === args.source)
    ).sort((a, b) => a.date - b.date);
  },
});

// Get aggregated KPIs
export const getKPIs = query({
  args: {
    projectId: v.id("projects"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const allData = await ctx.db
      .query("analyticsData")
      .withIndex("by_project_date", (q) => 
        q.eq("projectId", args.projectId)
      )
      .collect();
    
    const data = allData.filter(d => 
      d.date >= args.startDate && 
      d.date <= args.endDate
    );

    const ga4Data = data.filter((d: any) => d.source === 'ga4');
    const gscData = data.filter((d: any) => d.source === 'gsc');

    // Calculate totals
    const sessions = ga4Data.reduce((sum: number, d: any) => sum + (d.sessions || 0), 0);
    const clicks = gscData.reduce((sum: number, d: any) => sum + (d.clicks || 0), 0);
    const impressions = gscData.reduce((sum: number, d: any) => sum + (d.impressions || 0), 0);
    const leads = ga4Data.reduce((sum: number, d: any) => sum + (d.leads || 0), 0);
    const revenue = ga4Data.reduce((sum: number, d: any) => sum + (d.revenue || 0), 0);

    // Calculate averages
    const avgCTR = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const avgPosition = gscData.length > 0
      ? gscData.reduce((sum: number, d: any) => sum + (d.avgPosition || 0), 0) / gscData.length
      : 0;
    const conversionRate = sessions > 0 ? (leads / sessions) * 100 : 0;

    return {
      sessions,
      clicks,
      impressions,
      ctr: avgCTR,
      avgPosition,
      leads,
      revenue,
      conversionRate,
    };
  },
});

// Store insight
export const storeInsight = mutation({
  args: {
    projectId: v.id("projects"),
    type: v.string(), // top_gainer, underperformer, quick_win
    title: v.string(),
    description: v.string(),
    action: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("insights", {
      projectId: args.projectId,
      type: args.type,
      title: args.title,
      description: args.description,
      action: args.action,
      metadata: args.metadata,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get insights
export const getInsights = query({
  args: {
    projectId: v.id("projects"),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("insights")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId));

    const insights = await query.collect();
    
    return insights
      .filter(i => !args.type || i.type === args.type)
      .filter(i => i.status === 'active')
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Apply insight (mark as applied)
export const applyInsight = mutation({
  args: {
    insightId: v.id("insights"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.insightId, {
      status: 'applied',
      updatedAt: Date.now(),
    });
  },
});


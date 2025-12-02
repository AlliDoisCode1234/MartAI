import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

const metricsInput = v.object({
  coverageScore: v.optional(v.number()),
  backlinksProxy: v.optional(v.number()),
  domainRatingProxy: v.optional(v.number()),
  organicKeywords: v.optional(v.number()),
  trafficEstimate: v.optional(v.number()),
});

const confidenceInput = v.object({
  score: v.number(),
  sources: v.array(v.string()),
});

export const createAiReport = mutation({
  args: {
    prospectId: v.optional(v.id("prospects")),
    projectId: v.optional(v.id("projects")),
    url: v.optional(v.string()),
    status: v.optional(v.string()),
    summary: v.optional(v.string()),
    metrics: v.optional(metricsInput),
    confidence: confidenceInput,
    dataSources: v.optional(v.array(v.string())),
    crawlData: v.optional(v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      wordCount: v.optional(v.number()),
      headings: v.optional(v.array(v.string())),
      loadTime: v.optional(v.number()),
      htmlSample: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("aiReports", {
      prospectId: args.prospectId,
      projectId: args.projectId,
      url: args.url,
      status: args.status ?? "pending",
      summary: args.summary,
      metrics: args.metrics ?? {},
      confidence: args.confidence,
      dataSources: args.dataSources ?? [],
      crawlData: args.crawlData,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateAiReport = mutation({
  args: {
    reportId: v.id("aiReports"),
    status: v.optional(v.string()),
    summary: v.optional(v.string()),
    metrics: v.optional(metricsInput),
    confidence: v.optional(confidenceInput),
    dataSources: v.optional(v.array(v.string())),
    crawlData: v.optional(v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      wordCount: v.optional(v.number()),
      headings: v.optional(v.array(v.string())),
      loadTime: v.optional(v.number()),
      htmlSample: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { reportId, ...rest } = args;
    const existing = await ctx.db.get(reportId);
    if (!existing) {
      throw new Error("AI report not found");
    }

    const updates: Record<string, any> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    await ctx.db.patch(reportId, updates);
    return { success: true };
  },
});

export const listAiReports = query({
  args: {
    prospectId: v.optional(v.id("prospects")),
    projectId: v.optional(v.id("projects")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let builder = ctx.db.query("aiReports").order("desc");

    if (args.prospectId) {
      builder = ctx.db
        .query("aiReports")
        .withIndex("by_prospect", (q) => q.eq("prospectId", args.prospectId))
        .order("desc");
    } else if (args.projectId) {
      builder = ctx.db
        .query("aiReports")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .order("desc");
    }

    return args.limit ? builder.take(args.limit) : builder.collect();
  },
});

export const getLatestAiReport = query({
  args: {
    prospectId: v.optional(v.id("prospects")),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    if (!args.prospectId && !args.projectId) {
      throw new Error("prospectId or projectId is required");
    }

    const builder = args.prospectId
      ? ctx.db
          .query("aiReports")
          .withIndex("by_prospect", (q) => q.eq("prospectId", args.prospectId))
          .order("desc")
      : ctx.db
          .query("aiReports")
          .withIndex("by_project", (q) => q.eq("projectId", args.projectId!))
          .order("desc");

    return await builder.first();
  },
});


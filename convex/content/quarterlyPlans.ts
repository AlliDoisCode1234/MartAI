import { action, mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
// generatePlanSummary, estimateTraffic, estimateLeads moved to quarterlyPlanActions.ts

// Create quarterly plan
export const createQuarterlyPlan = mutation({
  args: {
    projectId: v.id("projects"),
    contentVelocity: v.number(), // posts per week
    startDate: v.number(), // timestamp
    goals: v.object({
      traffic: v.optional(v.number()),
      leads: v.optional(v.number()),
      revenue: v.optional(v.number()),
    }),
    assumptions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const planId = await ctx.db.insert("quarterlyPlans", {
      projectId: args.projectId,
      contentVelocity: args.contentVelocity,
      startDate: args.startDate,
      goals: args.goals,
      assumptions: args.assumptions || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Generate brief placeholders for 12 weeks
    const briefs = generateBriefPlaceholders(args.startDate, args.contentVelocity);
    
    // Get clusters to assign
    const clusters = await ctx.db
      .query("keywordClusters")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
    
    const sortedClusters = clusters.sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0));
    
    for (let i = 0; i < briefs.length; i++) {
      const brief = briefs[i];
      const cluster = sortedClusters[i % sortedClusters.length];
      
      await ctx.db.insert("briefs", {
        planId: planId,
        projectId: args.projectId,
        clusterId: cluster?._id,
        title: brief.title,
        scheduledDate: brief.scheduledDate,
        status: "planned",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return planId;
  },
});

// Helper to generate brief placeholders
function generateBriefPlaceholders(startDate: number, contentVelocity: number) {
  const briefs: Array<{ title: string; scheduledDate: number }> = [];
  const weeks = 12;
  const postsPerWeek = contentVelocity;

  // Distribute posts across 12 weeks
  for (let week = 0; week < weeks; week++) {
    for (let post = 0; post < postsPerWeek; post++) {
      const daysPerPost = 7 / postsPerWeek;
      const dayOffset = week * 7 + Math.floor(post * daysPerPost);
      const scheduledDate = startDate + (dayOffset * 24 * 60 * 60 * 1000);
      
      briefs.push({
        title: `Content Brief ${briefs.length + 1}`,
        scheduledDate,
      });
    }
  }

  return briefs;
}

// Get plan by project
export const getPlanByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const plan = await ctx.db
      .query("quarterlyPlans")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    if (!plan) return null;

    // Get associated briefs
    const briefs = await ctx.db
      .query("briefs")
      .withIndex("by_plan", (q) => q.eq("planId", plan._id))
      .collect();

    return {
      ...plan,
      briefs: briefs.sort((a, b) => a.scheduledDate - b.scheduledDate),
    };
  },
});

// Update plan
export const updatePlan = mutation({
  args: {
    planId: v.id("quarterlyPlans"),
    contentVelocity: v.optional(v.number()),
    goals: v.optional(v.object({
      traffic: v.optional(v.number()),
      leads: v.optional(v.number()),
      revenue: v.optional(v.number()),
    })),
    assumptions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { planId, ...updates } = args;
    const cleanUpdates: Record<string, any> = { updatedAt: Date.now() };
    
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }
    
    return await ctx.db.patch(planId, cleanUpdates);
  },
});

// Reschedule brief
export const rescheduleBrief = mutation({
  args: {
    briefId: v.id("briefs"),
    newDate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.briefId, {
      scheduledDate: args.newDate,
      updatedAt: Date.now(),
    });
  },
});

// Assign cluster to brief
export const assignClusterToBrief = mutation({
  args: {
    briefId: v.id("briefs"),
    clusterId: v.id("keywordClusters"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.briefId, {
      clusterId: args.clusterId,
      updatedAt: Date.now(),
    });
  },
});

// Delete plan
export const deletePlan = mutation({
  args: { planId: v.id("quarterlyPlans") },
  handler: async (ctx, args) => {
    // Delete associated briefs
    const briefs = await ctx.db
      .query("briefs")
      .withIndex("by_plan", (q) => q.eq("planId", args.planId))
      .collect();
    
    for (const brief of briefs) {
      await ctx.db.delete(brief._id);
    }
    
    await ctx.db.delete(args.planId);
  },
});

// generatePlan action moved to quarterlyPlanActions.ts


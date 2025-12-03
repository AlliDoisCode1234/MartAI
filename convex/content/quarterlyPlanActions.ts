"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import {
  generatePlanSummary,
  estimateTraffic,
  estimateLeads,
} from "../../lib/quarterlyPlanning";
import { auth } from "../auth";
import { rateLimits, getRateLimitKey, type MembershipTier } from "../rateLimits";
import { ConvexError } from "convex/values";

export const generatePlan = action({
  args: {
    projectId: v.id("projects"),
    contentVelocity: v.number(),
    startDate: v.optional(v.number()),
    goals: v.optional(
      v.object({
        traffic: v.optional(v.number()),
        leads: v.optional(v.number()),
        revenue: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get user to check membership tier and role
    const user = await ctx.runQuery((api as any).users.current);
    if (!user) {
      throw new Error("User not found");
    }

    // Determine rate limit tier
    let tier: MembershipTier;
    if (user.role === "admin" || user.role === "super_admin") {
      tier = "admin";
    } else {
      tier = (user.membershipTier as MembershipTier) || "free";
    }

    // Check rate limit
    const rateLimitKey = getRateLimitKey("createQuarterlyPlan", tier);
    const { ok, retryAfter } = await rateLimits.limit(ctx, rateLimitKey as any, {
      key: userId as string,
    });

    if (!ok) {
      const retryMinutes = Math.ceil(retryAfter / 1000 / 60);
      throw new ConvexError({
        kind: "RateLimitError",
        message: `Rate limit exceeded. You can generate ${tier === "free" ? "1 plan per day" : tier === "admin" ? "50 plans per day" : `${tier} tier limit reached`}. Try again in ${retryMinutes} minute${retryMinutes !== 1 ? "s" : ""}.`,
        retryAfter,
      });
    }

    if (args.contentVelocity < 1 || args.contentVelocity > 7) {
      throw new Error("contentVelocity must be between 1 and 7 posts per week");
    }

    const startDate = args.startDate ?? Date.now();

    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
      projectId: args.projectId,
    });
    const clusters = await ctx.runQuery(api.seo.keywordClusters.getActiveClusters, {
      projectId: args.projectId,
    });

    const fallbackTraffic = estimateTraffic(args.contentVelocity);
    const trafficGoal = args.goals?.traffic ?? fallbackTraffic;
    const leadsGoal = args.goals?.leads ?? estimateLeads(trafficGoal);
    const revenueGoal = args.goals?.revenue;

    const goals = {
      traffic: trafficGoal,
      leads: leadsGoal,
      revenue: revenueGoal,
    };

    let assumptions = "";
    try {
      assumptions = await generatePlanSummary(
        args.contentVelocity,
        goals,
        clusters.length,
        project?.industry,
      );
    } catch (error) {
      console.warn("Plan summary generation failed:", error);
      assumptions = `Quarterly plan with ${args.contentVelocity} posts/week targeting ${clusters.length} keyword clusters.`;
    }

    const planId = await ctx.runMutation(api.content.quarterlyPlans.createQuarterlyPlan, {
      projectId: args.projectId,
      contentVelocity: args.contentVelocity,
      startDate,
      goals,
      assumptions,
    }) as Id<"quarterlyPlans">;

    return {
      success: true,
      planId,
      assumptions,
      goals,
    };
  },
});

'use node';

import { action } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';
import { Id } from '../_generated/dataModel';
import { generatePlanSummary, estimateTraffic, estimateLeads } from '../../lib/quarterlyPlanning';
import { auth } from '../auth';
import { rateLimits, getRateLimitKey, type MembershipTier } from '../rateLimits';
import { ConvexError } from 'convex/values';
import { cache, getCacheKey, CACHE_TTL } from '../cache';

export const generatePlan = action({
  args: {
    projectId: v.id('projects'),
    contentVelocity: v.number(),
    startDate: v.optional(v.number()),
    goals: v.optional(
      v.object({
        traffic: v.optional(v.number()),
        leads: v.optional(v.number()),
        revenue: v.optional(v.number()),
      })
    ),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    planId: Id<'quarterlyPlans'>;
    assumptions: string;
    goals: {
      traffic: number;
      leads: number;
      revenue?: number;
    };
    cached?: boolean;
    storage?: boolean;
  }> => {
    // Get authenticated user
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Get user to check membership tier and role
    const user = await ctx.runQuery((api as any).users.current);
    if (!user) {
      throw new Error('User not found');
    }

    // Determine rate limit tier
    let tier: MembershipTier;
    if (user.role === 'admin' || user.role === 'super_admin') {
      tier = 'admin';
    } else {
      tier = (user.membershipTier as MembershipTier) || 'free';
    }

    // Check rate limit
    const rateLimitKey = getRateLimitKey('createQuarterlyPlan', tier);
    const { ok, retryAfter } = await rateLimits.limit(ctx, rateLimitKey as any, {
      key: userId as string,
    });

    if (!ok) {
      const retryMinutes = Math.ceil(retryAfter / 1000 / 60);
      throw new ConvexError({
        kind: 'RateLimitError',
        message: `Rate limit exceeded. You can generate ${tier === 'free' ? '1 plan per day' : tier === 'admin' ? '50 plans per day' : `${tier} tier limit reached`}. Try again in ${retryMinutes} minute${retryMinutes !== 1 ? 's' : ''}.`,
        retryAfter,
      });
    }

    if (args.contentVelocity < 1 || args.contentVelocity > 7) {
      throw new Error('contentVelocity must be between 1 and 7 posts per week');
    }

    const startDate = args.startDate ?? Date.now();

    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
      projectId: args.projectId,
    });
    const clusters = await ctx.runQuery(api.seo.keywordClusters.getActiveClusters, {
      projectId: args.projectId,
    });

    // Generate cache key
    const cacheKey = getCacheKey('generatePlan', {
      projectId: args.projectId,
      contentVelocity: args.contentVelocity,
      clusterCount: clusters.length,
    });

    // 1. Check Persistent Storage
    const crypto = await import('node:crypto');
    const inputForHash = JSON.stringify({
      projectId: args.projectId,
      contentVelocity: args.contentVelocity,
      clusterCount: clusters.length,
      // goals are optional but affect output, so include in hash
      goals: args.goals,
    });
    const inputHash: string = crypto.createHash('sha256').update(inputForHash).digest('hex');

    const stored = await ctx.runQuery((api as any).aiStorage.getStored, { inputHash });

    if (stored) {
      console.log('Persistent Storage Hit for quarterly planning');
      const { assumptions, goals } = stored.output;

      const planId = (await ctx.runMutation(
        (api as any).content.quarterlyPlans.createQuarterlyPlan,
        {
          ...args,
          assumptions,
          goals,
        }
      )) as Id<'quarterlyPlans'>;
      return { success: true, planId, cached: true, storage: true, assumptions, goals };
    }

    // 2. Try ephemeral cache
    const cached = await cache.get(ctx, cacheKey);
    if (cached) {
      console.log('Cache hit for quarterly planning');
      const planId = (await ctx.runMutation(
        (api as any).content.quarterlyPlans.createQuarterlyPlan,
        {
          ...args,
          assumptions: cached.assumptions,
          goals: cached.goals,
        }
      )) as Id<'quarterlyPlans'>;
      return { success: true, planId, cached: true, ...cached };
    }

    console.log('Cache miss for quarterly planning');

    const fallbackTraffic = estimateTraffic(args.contentVelocity);
    const trafficGoal = args.goals?.traffic ?? fallbackTraffic;
    const leadsGoal = args.goals?.leads ?? estimateLeads(trafficGoal);
    const revenueGoal = args.goals?.revenue;

    const goals = {
      traffic: trafficGoal,
      leads: leadsGoal,
      revenue: revenueGoal,
    };

    let assumptions = '';
    try {
      assumptions = await generatePlanSummary(
        args.contentVelocity,
        goals,
        clusters.length,
        project?.industry
      );
    } catch (error) {
      console.warn('Plan summary generation failed:', error);
      assumptions = `Quarterly plan with ${args.contentVelocity} posts/week targeting ${clusters.length} keyword clusters.`;
    }

    // 3. Store in Persistence & Cache
    const outputData = { assumptions, goals };

    await cache.set(ctx, cacheKey, outputData, CACHE_TTL.QUARTERLY_PLANNING);

    // Using (api as any) to avoid stale type errors, assuming aiStorage exists at runtime
    await ctx.runMutation((api as any).aiStorage.store, {
      inputHash,
      operation: 'generatePlan',
      provider: 'openai',
      model: 'gpt-4o',
      inputArgs: {
        projectId: args.projectId,
        contentVelocity: args.contentVelocity,
        clusterCount: clusters.length,
        goals: args.goals,
      },
      output: outputData,
      tokensIn: 0,
      tokensOut: 0,
    });

    const planId = (await ctx.runMutation(api.content.quarterlyPlans.createQuarterlyPlan, {
      projectId: args.projectId,
      contentVelocity: args.contentVelocity,
      startDate,
      goals,
      assumptions,
    })) as Id<'quarterlyPlans'>;

    return {
      success: true,
      planId,
      assumptions,
      goals,
    };
  },
});

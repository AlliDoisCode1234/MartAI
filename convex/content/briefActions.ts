'use node';

import { action } from '../_generated/server';
import { v } from 'convex/values';
import { api, components } from '../_generated/api';
import { generateBriefDetails, type ClusterInfo } from '../../lib/briefGenerator';
import { auth } from '../auth';
import { rateLimits, getRateLimitKey, type MembershipTier } from '../rateLimits';
import { ConvexError } from 'convex/values';
import { cache, getCacheKey, CACHE_TTL } from '../cache';
import { IntelligenceService } from '../lib/services/intelligence';

export const generateBrief = action({
  args: {
    briefId: v.id('briefs'),
    projectId: v.id('projects'),
    clusterId: v.optional(v.id('keywordClusters')),
  },
  handler: async (ctx, args) => {
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
    const rateLimitKey = getRateLimitKey('generateBrief', tier);
    const { ok, retryAfter } = await rateLimits.limit(ctx, rateLimitKey as any, {
      key: userId as string,
    });

    if (!ok) {
      const retryMinutes = Math.ceil(retryAfter / 1000 / 60);
      throw new ConvexError({
        kind: 'RateLimitError',
        message: `Rate limit exceeded. You can generate ${tier === 'free' ? '3 briefs per day' : tier === 'admin' ? '100 briefs per hour' : `${tier} tier limit reached`}. Try again in ${retryMinutes} minute${retryMinutes !== 1 ? 's' : ''}.`,
        retryAfter,
      });
    }

    const cacheKey = getCacheKey('generateBrief', {
      clusterId: args.clusterId,
      projectId: args.projectId,
    });

    // 1. Check Persistent Storage
    // We need 'inputs' logic first.
    // So logic flow: Get Project -> Get Cluster -> Build Inputs -> Check Persistence -> Check Cache -> Generate -> Store.

    // Get project info
    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
      projectId: args.projectId,
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Get cluster info if available
    let clusterInfo: ClusterInfo;

    if (args.clusterId) {
      const clusters = await ctx.runQuery((api as any).seo.keywordClusters.getClustersByProject, {
        projectId: args.projectId,
      });
      const cluster = clusters.find((c: any) => c._id === args.clusterId);

      if (cluster) {
        clusterInfo = {
          clusterName: cluster.clusterName,
          keywords: cluster.keywords,
          intent: cluster.intent,
          volumeRange: cluster.volumeRange,
        };
      } else {
        clusterInfo = {
          clusterName: 'General Topic',
          keywords: [project.industry || 'Business'],
          intent: 'informational',
          volumeRange: { min: 100, max: 1000 },
        };
      }
    } else {
      const brief = await ctx.runQuery((api as any).content.briefs.getBriefById, {
        briefId: args.briefId,
      });
      if (!brief) throw new Error('Brief not found');

      clusterInfo = {
        clusterName: brief.title,
        keywords: [brief.title],
        intent: 'informational',
        volumeRange: { min: 0, max: 0 },
      };
    }

    const inputs = {
      clusterInfo,
      website: project.websiteUrl,
      industry: project.industry,
    };

    // Check Persistence
    const crypto = await import('node:crypto');
    const inputHash = crypto.createHash('sha256').update(JSON.stringify(inputs)).digest('hex');

    const stored = await ctx.runQuery((api as any).aiStorage.getStored, { inputHash });

    if (stored) {
      console.log('Persistent Storage Hit for brief generation');
      await ctx.runMutation((api as any).content.briefs.updateBrief, {
        briefId: args.briefId,
        ...stored.output,
        status: 'in_progress',
      });
      return { success: true, cached: true, storage: true };
    }

    // Check Cache
    const cached = await cache.get(ctx, cacheKey);
    if (cached) {
      console.log('Cache hit for brief generation');
      await ctx.runMutation((api as any).content.briefs.updateBrief, {
        briefId: args.briefId,
        ...cached,
        status: 'in_progress',
      });
      return { success: true, cached: true };
    }

    console.log('Cache miss for brief generation');

    // Fetch RAG Context (via IntelligenceService)
    let ragContext = '';
    const intelligence = new IntelligenceService(ctx);
    ragContext = await intelligence.retrieve(clusterInfo.clusterName, 3);

    const details = await generateBriefDetails(
      clusterInfo,
      project.websiteUrl,
      project.industry,
      undefined,
      ragContext
    );

    // Store in Persistent Storage
    await ctx.runMutation((api as any).aiStorage.store, {
      inputHash,
      operation: 'generateBrief',
      provider: 'openai',
      model: 'gpt-4o',
      inputArgs: inputs,
      output: details,
      tokensIn: 0,
      tokensOut: 0,
    });

    // Store in cache
    await cache.set(ctx, cacheKey, details, CACHE_TTL.BRIEF_GENERATION);

    // Update brief with details
    await ctx.runMutation((api as any).content.briefs.updateBrief, {
      briefId: args.briefId,
      ...details,
      status: 'in_progress',
    });

    return { success: true };
  },
});

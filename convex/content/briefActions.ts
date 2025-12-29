'use node';

import { action } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';
// NOTE: Do NOT import from '../lib/api' - causes circular type inference
import { generateBriefDetails, type ClusterInfo } from '../../lib/generators/briefGenerator';
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
    const user = await ctx.runQuery(api.users.current);
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

    // DEV MODE: Skip rate limiting for development/testing
    const isDevMode = process.env.CONVEX_DEV_MODE === 'true';

    if (!isDevMode) {
      // Check rate limit
      const rateLimitKey = getRateLimitKey('generateBrief', tier);
      // rateLimitKey is dynamic (tier-based) so we need type assertion
      const { ok, retryAfter } = await (rateLimits as any).limit(ctx, rateLimitKey, {
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
      const clusters = await ctx.runQuery(api['seo/keywordClusters'].getClustersByProject, {
        projectId: args.projectId,
      });
      const cluster = clusters.find((c: { _id: string }) => c._id === args.clusterId);

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
      const brief = await ctx.runQuery(api['content/briefs'].getBriefById, {
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

    const stored = await ctx.runQuery(api.aiStorage.getStored, { inputHash });

    if (stored) {
      console.log('Persistent Storage Hit for brief generation');
      await ctx.runMutation(api['content/briefs'].updateBrief, {
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
      await ctx.runMutation(api['content/briefs'].updateBrief, {
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
    await ctx.runMutation(api.aiStorage.store, {
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
    await ctx.runMutation(api['content/briefs'].updateBrief, {
      briefId: args.briefId,
      ...details,
      status: 'in_progress',
    });

    return { success: true };
  },
});

export const optimizeCTR = action({
  args: {
    briefId: v.id('briefs'),
    recommendations: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const brief = await ctx.runQuery(api['content/briefs'].getBriefById, {
      briefId: args.briefId,
    });
    if (!brief) throw new Error('Brief not found');

    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
      projectId: brief.projectId,
    });
    if (!project) throw new Error('Project not found');

    const intelligence = new IntelligenceService(ctx);

    const prompt = `You are an SEO expert specializing in Click-Through Rate (CTR) optimization.
    
    Current Metadata:
    Title: ${brief.title}
    Meta Title: ${brief.metaTitle}
    Meta Description: ${brief.metaDescription}
    
    Recommendations for improvement:
    ${args.recommendations.map((r) => `- ${r}`).join('\n')}
    
    Please provide:
    1. A highly optimized Meta Title (max 60 chars)
    2. A highly optimized Meta Description (max 160 chars)
    3. 3 Alternative catchy Titles
    
    Return ONLY JSON format:
    {
      "metaTitle": "string",
      "metaDescription": "string",
      "titleOptions": ["string", "string", "string"]
    }`;

    const result = await intelligence.generate(prompt, '', {
      temperature: 0.7,
      userId,
    });

    let optimizedData;
    try {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : result.content;
      optimizedData = JSON.parse(jsonText);
    } catch (e) {
      console.error('Failed to parse optimized CTR data', e);
      throw new Error('Failed to generate optimized metadata');
    }

    await ctx.runMutation(api['content/briefs'].updateBrief, {
      briefId: args.briefId,
      metaTitle: optimizedData.metaTitle,
      metaDescription: optimizedData.metaDescription,
      titleOptions: optimizedData.titleOptions,
    });

    return { success: true };
  },
});

/**
 * Batch generate briefs with controlled concurrency
 *
 * Generates multiple briefs sequentially with delay to avoid rate limits.
 * Useful for workflows processing multiple briefs at once.
 */
export const generateBriefsBatch = action({
  args: {
    briefIds: v.array(v.id('briefs')),
    projectId: v.id('projects'),
    /** Delay between brief generations in ms (default: 2000) */
    delayMs: v.optional(v.number()),
    /** Continue on error? (default: true) */
    continueOnError: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const delayMs = args.delayMs ?? 2000;
    const continueOnError = args.continueOnError ?? true;

    const results: Array<{
      briefId: string;
      success: boolean;
      cached?: boolean;
      error?: string;
    }> = [];

    for (let i = 0; i < args.briefIds.length; i++) {
      const briefId = args.briefIds[i];

      try {
        // Call the single brief generator
        const result = await ctx.runAction(api.content.briefActions.generateBrief, {
          briefId,
          projectId: args.projectId,
        });

        results.push({
          briefId: briefId as string,
          success: true,
          cached: result.cached,
        });
      } catch (error: any) {
        console.error(`[BatchBriefs] Failed to generate brief ${briefId}:`, error.message);

        if (continueOnError) {
          results.push({
            briefId: briefId as string,
            success: false,
            error: error.message,
          });
        } else {
          throw error;
        }
      }

      // Delay between briefs (skip after last)
      if (i < args.briefIds.length - 1 && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return {
      success: failCount === 0,
      total: args.briefIds.length,
      successCount,
      failCount,
      results,
    };
  },
});

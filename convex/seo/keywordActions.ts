'use node';

import { action } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';
import { auth } from '../auth';
import { rateLimits, getRateLimitKey, type MembershipTier } from '../rateLimits';
import { ConvexError } from 'convex/values';
import { generateKeywordClusters } from '../../lib/generators/keywordClustering';
import { cache, getCacheKey, CACHE_TTL } from '../cache';
import { getGSCData } from '../../lib/googleAuth';
import * as crypto from 'node:crypto';

function importKeywordsFromGSC(gscData: any): KeywordInput[] {
  if (!gscData?.rows) return [];
  return gscData.rows.map((row: any) => ({
    keyword: row.keys[0],
    volume: row.impressions || 0, // Use impressions as proxy for volume
    difficulty: 50, // Default mid-range difficulty
    intent: 'informational', // Default intent
  }));
}

export interface KeywordInput {
  keyword: string;
  volume: number;
  difficulty: number;
  intent: string;
}

const keywordInputArg = v.object({
  keyword: v.string(),
  volume: v.number(),
  difficulty: v.number(),
  intent: v.string(),
});

export const generateClusters = action({
  args: {
    projectId: v.id('projects'),
    keywords: v.optional(v.array(keywordInputArg)),
    importFromGSC: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    count: number;
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

    // Admin portal RBAC: only super_admin can generate keywords
    // Regular admins can view but not generate (prevents accidental expensive AI calls)
    if (user.role === 'admin' && user.role !== 'super_admin') {
      // Check if this is being called from admin context (no projectId ownership)
      const project = await ctx.runQuery(api.projects.projects.getProjectById, {
        projectId: args.projectId,
      });
      if (project && project.userId !== userId) {
        throw new Error('Only super admins can generate keywords for other users projects');
      }
    }

    // Determine rate limit tier
    let tier: MembershipTier;
    if (user.role === 'admin' || user.role === 'super_admin') {
      tier = 'admin';
    } else {
      tier = (user.membershipTier as MembershipTier) || 'free';
    }

    // Check rate limit
    const rateLimitKey = getRateLimitKey('generateKeywordClusters', tier);
    const { ok, retryAfter } = await rateLimits.limit(ctx, rateLimitKey as any, {
      key: userId as string,
    });

    if (!ok) {
      const retryMinutes = Math.ceil(retryAfter / 1000 / 60);
      throw new ConvexError({
        kind: 'RateLimitError',
        message: `Rate limit exceeded. You can generate ${tier === 'free' ? '5 clusters per day' : tier === 'admin' ? '200 clusters per hour' : `${tier} tier limit reached`}. Try again in ${retryMinutes} minute${retryMinutes !== 1 ? 's' : ''}.`,
        retryAfter,
      });
    }

    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
      projectId: args.projectId,
    });

    let keywordInputs: KeywordInput[] = (args.keywords ?? []).map((keyword) => ({
      keyword: keyword.keyword,
      volume: keyword.volume,
      difficulty: keyword.difficulty,
      intent: keyword.intent,
    }));

    if (args.importFromGSC ?? false) {
      try {
        const connection = await ctx.runQuery(api.integrations.gscConnections.getGSCConnection, {
          projectId: args.projectId,
        });
        if (connection?.accessToken && connection?.siteUrl) {
          const gscData = await getGSCData(
            connection.accessToken,
            connection.refreshToken,
            connection.siteUrl,
            '30daysAgo',
            'today',
            150
          );
          const imported = importKeywordsFromGSC(gscData);
          if (imported.length > 0) {
            keywordInputs = keywordInputs.concat(imported);
            await ctx.runMutation(api.integrations.gscConnections.updateLastSync, {
              connectionId: connection._id,
            });
          }
        }
      } catch (error) {
        console.warn('GSC import failed:', error);
      }
    }

    if (keywordInputs.length === 0) {
      keywordInputs = buildFallbackKeywords(project ?? undefined);
    }

    if (keywordInputs.length === 0) {
      throw new Error('Unable to find keywords to cluster. Add keywords or connect GSC.');
    }

    // Generate cache key based on keyword set
    const sortedKeywords = keywordInputs.map((k) => k.keyword).sort();
    const keywordHash = sortedKeywords.join(',');

    const cacheKey = getCacheKey('generateClusters', {
      projectId: args.projectId,
      keywordHash,
    });

    // 1. Check Persistent Storage (Audit Log/Infinite Cache)
    const inputForHash = JSON.stringify({
      keywords: sortedKeywords,
      projectId: args.projectId,
      website: project?.websiteUrl,
    });
    const fullInputHash: string = crypto.createHash('sha256').update(inputForHash).digest('hex');

    const stored = await ctx.runQuery((api as any).aiStorage.getStored, {
      inputHash: fullInputHash,
    });

    if (stored) {
      console.log('Persistent Storage Hit for keyword clustering');
      const clusters = stored.output.clusters;

      for (const cluster of clusters) {
        await ctx.runMutation((api as any).seo.keywordClusters.createCluster, {
          ...cluster,
          projectId: args.projectId,
        });
      }

      return { success: true, count: clusters.length, cached: true, storage: true };
    }

    // 2. Try ephemeral cache
    const cached = await cache.get(ctx, cacheKey);
    if (cached) {
      console.log('Cache hit for keyword clustering');
      for (const cluster of cached.clusters) {
        await ctx.runMutation((api as any).seo.keywordClusters.createCluster, cluster);
      }
      return { success: true, count: cached.clusters.length, cached: true };
    }

    console.log('Cache miss for keyword clustering');

    const clusters = await generateKeywordClusters(
      keywordInputs,
      project?.websiteUrl,
      project?.industry
    );

    let createdCount = 0;
    for (const cluster of clusters) {
      try {
        await ctx.runMutation(api.seo.keywordClusters.createCluster, {
          projectId: args.projectId,
          clusterName: cluster.clusterName,
          keywords: cluster.keywords,
          intent: cluster.intent,
          difficulty: cluster.difficulty,
          volumeRange: cluster.volumeRange,
          impactScore: cluster.impactScore,
          topSerpUrls: cluster.topSerpUrls,
          status: 'active',
          createdAt: Date.now(),
        });
        createdCount += 1;
      } catch (error) {
        console.error('Failed to store cluster:', error);
      }
    }

    // 3. Store in Persistence & Cache
    const outputData = { clusters };

    await cache.set(ctx, cacheKey, outputData, CACHE_TTL.KEYWORD_CLUSTERING);

    await ctx.runMutation((api as any).aiStorage.store, {
      inputHash: fullInputHash,
      operation: 'generateKeywordClusters',
      provider: 'openai',
      model: 'gpt-4o',
      inputArgs: {
        keywords: sortedKeywords,
        projectId: args.projectId,
        website: project?.websiteUrl,
      },
      output: outputData,
      tokensIn: 0,
      tokensOut: 0,
    });

    return {
      success: true,
      count: createdCount,
    };
  },
});

function buildFallbackKeywords(project?: { industry?: string; name?: string }): KeywordInput[] {
  const base = (project?.industry || project?.name || 'growth marketing').toLowerCase();
  const topics = [
    `${base} strategy`,
    `${base} software`,
    `${base} tools`,
    `${base} best practices`,
    `${base} pricing`,
    `${base} case studies`,
    `${base} automation`,
    `${base} templates`,
  ];

  return topics.map((keyword, index) => ({
    keyword,
    volume: 500 - index * 30,
    difficulty: 35 + index * 3,
    intent: index < 3 ? 'commercial' : index < 5 ? 'transactional' : 'informational',
  }));
}

export const splitCluster = action({
  args: {
    clusterId: v.id('keywordClusters'),
  },
  handler: async (ctx, args) => {
    return [args.clusterId];
  },
});

export const reclusterKeywords = action({
  args: {
    clusterIds: v.array(v.id('keywordClusters')),
  },
  handler: async (ctx, args) => {
    return args.clusterIds;
  },
});

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
    const user = await ctx.runQuery(api.users.current);
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
    // rateLimitKey is dynamic (tier-based) so we need type assertion for the string union
    const { ok, retryAfter } = await (rateLimits as any).limit(ctx, rateLimitKey, {
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

    const stored = await ctx.runQuery(api.aiStorage.getStored, {
      inputHash: fullInputHash,
    });

    if (stored) {
      console.log('Persistent Storage Hit for keyword clustering');
      const clusters = stored.output.clusters;

      for (const cluster of clusters) {
        await ctx.runMutation(api.seo.keywordClusters.createCluster, {
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
        await ctx.runMutation(api.seo.keywordClusters.createCluster, cluster);
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

    await ctx.runMutation(api.aiStorage.store, {
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

/**
 * Get semantically similar keywords from the library
 *
 * Uses vector embeddings to find keywords with similar meaning.
 * This enables intelligent keyword discovery beyond exact matches.
 *
 * Example: "content marketing" might return:
 * - "content strategy"
 * - "blog post ideas"
 * - "editorial calendar"
 */
export const getSimilarKeywords = action({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
    minVolume: v.optional(v.number()),
    maxDifficulty: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Search library using semantic vector search
    const results = await ctx.runAction(api.seo.library.searchLibrary, {
      query: args.query,
      limit: args.limit || 10,
    });

    // Define type for library results
    type LibraryResult = {
      keyword: string;
      searchVolume: number;
      difficulty: number;
      intent: string;
      _score: number;
    };

    // Apply optional filters
    let filtered: LibraryResult[] = results as LibraryResult[];

    if (args.minVolume !== undefined) {
      filtered = filtered.filter((k: LibraryResult) => k.searchVolume >= args.minVolume!);
    }

    if (args.maxDifficulty !== undefined) {
      filtered = filtered.filter((k: LibraryResult) => k.difficulty <= args.maxDifficulty!);
    }

    return filtered.map((k: LibraryResult) => ({
      keyword: k.keyword,
      searchVolume: k.searchVolume,
      difficulty: k.difficulty,
      intent: k.intent,
      similarityScore: k._score,
    }));
  },
});

/**
 * Enrich user keywords with semantically related library keywords
 *
 * For each user keyword, finds similar keywords from the library
 * to provide context for better AI clustering.
 */
export const enrichKeywordsWithLibrary = action({
  args: {
    keywords: v.array(v.string()),
    limitPerKeyword: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const enriched: Record<string, Array<{ keyword: string; score: number }>> = {};

    for (const kw of args.keywords) {
      try {
        const similar = await ctx.runAction(api.seo.library.searchLibrary, {
          query: kw,
          limit: args.limitPerKeyword || 3,
        });

        enriched[kw] = similar.map((s: { keyword: string; _score: number }) => ({
          keyword: s.keyword,
          score: s._score,
        }));
      } catch (e) {
        console.warn(`Failed to enrich keyword "${kw}":`, e);
        enriched[kw] = [];
      }
    }

    return enriched;
  },
});

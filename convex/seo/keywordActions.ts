'use node';

import { action, internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { auth } from '../auth';
import { rateLimits, getRateLimitKey, type MembershipTier } from '../rateLimits';
import { ConvexError } from 'convex/values';
import { generateKeywordClusters } from '../../lib/generators/keywordClustering';
import { cache, getCacheKey, CACHE_TTL } from '../cache';
import { getGSCData } from '../../lib/googleAuth';
import * as crypto from 'node:crypto';
import type { Id } from '../_generated/dataModel';
import type { GenericActionCtx } from 'convex/server';
import type { DataModel } from '../_generated/dataModel';
import type { NormalizedSerpUrl, NormalizedKeywordMetric } from '../integrations/dataForSeo';
import { PENDING_SELECTION } from '../lib/constants';

/** Shape of a single row returned by the GSC Search Analytics API */
interface GSCRow {
  keys?: string[] | null;
  clicks?: number | null;
  impressions?: number | null;
  ctr?: number | null;
  position?: number | null;
}

/** Shape of the GSC Search Analytics API response */
interface GSCResponse {
  rows?: GSCRow[];
}

function importKeywordsFromGSC(gscData: GSCResponse): KeywordInput[] {
  if (!gscData?.rows) return [];
  return gscData.rows
    .filter((row: GSCRow) => row.keys && row.keys.length > 0)
    .map((row: GSCRow) => ({
      keyword: row.keys![0],
      volume: row.impressions || 0,
      difficulty: 50,
      intent: 'informational',
    }));
}

export interface KeywordInput {
  keyword: string;
  volume: number;
  difficulty: number;
  intent: string;
}

async function insertKeywordsFromInputs(
  ctx: Pick<GenericActionCtx<DataModel>, 'runMutation' | 'runQuery'>,
  projectId: Id<'projects'>,
  inputs: KeywordInput[]
) {
  if (inputs.length === 0) return;

  // Deduplicate by keyword string within input list
  const seen = new Set<string>();
  const unique = inputs.filter((k) => {
    const lower = k.keyword.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });

  // Deduplicate against existing DB records to prevent duplicate rows
  const existing = await ctx.runQuery(api.seo.keywords.getKeywordsByProject, { projectId });
  const existingSet = new Set(
    (existing as Array<{ keyword: string }>).map((k) => k.keyword.toLowerCase())
  );
  const newOnly = unique.filter((k) => !existingSet.has(k.keyword.toLowerCase()));

  if (newOnly.length === 0) return;

  // Batch in chunks of 50 to avoid mutation size limits
  const BATCH_SIZE = 50;
  for (let i = 0; i < newOnly.length; i += BATCH_SIZE) {
    const batch = newOnly.slice(i, i + BATCH_SIZE);
    await ctx.runMutation(api.seo.keywords.createKeywords, {
      projectId,
      keywords: batch.map((k) => ({
        keyword: k.keyword,
        searchVolume: k.volume,
        difficulty: k.difficulty,
        intent: k.intent,
      })),
    });
  }
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
    error?: string;
    cached?: boolean;
    storage?: boolean;
  }> => {
    // Get authenticated user
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return { success: false, count: 0, error: 'Unauthorized' };
    }

    // Get user to check membership tier and role
    const user = await ctx.runQuery(api.users.current);
    if (!user) {
      return { success: false, count: 0, error: 'User not found' };
    }

    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
      projectId: args.projectId,
    });
    if (!project) {
      return { success: false, count: 0, error: 'Project not found' };
    }

    // Authorization: User must own the project UNLESS they are a super_admin
    if (project.userId !== userId && user.role !== 'super_admin') {
      return { success: false, count: 0, error: 'Unauthorized to generate clusters for this project' };
    }

    // Determine rate limit tier
    let tier: MembershipTier;
    if (user.role === 'admin' || user.role === 'super_admin') {
      tier = 'admin';
    } else {
      tier = (user.membershipTier as MembershipTier) || 'starter';
      if (!['starter', 'engine', 'agency', 'enterprise', 'admin'].includes(tier)) {
        tier = 'starter';
      }
    }

    // DEV MODE: Skip rate limiting for development/testing
    const isDevMode = process.env.CONVEX_DEV_MODE === 'true';

    if (!isDevMode) {
      // Check rate limit
      const rateLimitKey = getRateLimitKey('generateKeywordClusters', tier);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Dynamic tier-based key requires cast; root cause is RateLimiter generic constraint (see rateLimits.ts:54)
      const { ok, retryAfter } = await (rateLimits as any).limit(ctx, rateLimitKey, {
        key: userId as string,
      });

      if (!ok) {
        const retryMinutes = Math.ceil(retryAfter / 1000 / 60);
        return { 
          success: false, 
          count: 0, 
          error: `Rate limit exceeded. You can generate ${tier === 'starter' ? '5 clusters per day' : tier === 'admin' ? '200 clusters per hour' : `${tier} tier limit reached`}. Try again in ${retryMinutes} minute${retryMinutes !== 1 ? 's' : ''}.` 
        };
      }
    }



    let keywordInputs: KeywordInput[] = (args.keywords ?? []).map((keyword) => ({
      keyword: keyword.keyword,
      volume: keyword.volume,
      difficulty: keyword.difficulty,
      intent: keyword.intent,
    }));

    if (args.importFromGSC ?? false) {
      const connection = await ctx.runQuery(
        internal.integrations.gscConnections.getGSCConnectionInternal,
        {
          projectId: args.projectId,
        }
      );

      if (!connection?.accessToken || !connection?.siteUrl || connection.siteUrl === PENDING_SELECTION) {
        return { success: false, count: 0, error: connection?.siteUrl === PENDING_SELECTION ? 'Please select a Search Console site in Settings before importing keywords.' : 'GSC is not connected. Please connect Google Search Console in Settings first.' };
      }

      try {
        // GSC API requires yyyy-MM-dd format (not GA4-style relative dates)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90); // 90 days for broader coverage
        const fmt = (d: Date) => d.toISOString().split('T')[0];

        const gscData = await getGSCData(
          connection.accessToken,
          connection.refreshToken,
          connection.siteUrl,
          fmt(startDate),
          fmt(endDate),
          150
        );
        const imported = importKeywordsFromGSC(gscData);
        if (imported.length > 0) {
          keywordInputs = keywordInputs.concat(imported);
          await ctx.runMutation(internal.integrations.gscConnections.updateLastSync, {
            connectionId: connection._id,
          });
          console.log(
            JSON.stringify({
              event: 'gsc_import',
              projectId: args.projectId,
              count: imported.length,
            })
          );
        } else {
          return { success: false, count: 0, error: 'GSC returned no keyword data. Your site may not have enough search impressions yet.' };
        }
      } catch (error) {
        console.error('[KeywordActions] GSC sync error:', error);
        // Security: Do NOT expose raw error.message to caller, but log it on the server
        return { success: false, count: 0, error: 'GSC sync failed. Please check your Google Search Console connection and try again.' };
      }
    }

    // Only use IL fallback when GSC was NOT explicitly requested
    if (keywordInputs.length === 0 && !(args.importFromGSC ?? false)) {
      keywordInputs = await buildFallbackKeywords(ctx, project ?? undefined);
    }

    if (keywordInputs.length === 0) {
      return { success: false, count: 0, error: 'Unable to find keywords to cluster. Add keywords or connect GSC.' };
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
          projectId: args.projectId,
          clusterName: cluster.clusterName,
          keywords: cluster.keywords,
          intent: cluster.intent,
          difficulty: cluster.difficulty,
          volumeRange: cluster.volumeRange,
          impactScore: cluster.impactScore,
          topSerpUrls: cluster.topSerpUrls ?? [],
          status: cluster.status ?? 'active',
          createdAt: cluster.createdAt ?? Date.now(),
        });
      }

      // Also insert individual keywords into the keywords table
      await insertKeywordsFromInputs(ctx, args.projectId, keywordInputs);

      // Link newly inserted keywords to their clusters
      await ctx.runMutation(api.seo.keywords.linkKeywordsToClusters, {
        projectId: args.projectId,
      });

      return { success: true, count: clusters.length, cached: true, storage: true };
    }

    // 2. Try ephemeral cache
    const cached = await cache.get(ctx, cacheKey);
    if (cached) {
      console.log('Cache hit for keyword clustering');
      for (const cluster of cached.clusters) {
        await ctx.runMutation(api.seo.keywordClusters.createCluster, {
          projectId: args.projectId,
          clusterName: cluster.clusterName,
          keywords: cluster.keywords,
          intent: cluster.intent,
          difficulty: cluster.difficulty,
          volumeRange: cluster.volumeRange,
          impactScore: cluster.impactScore,
          topSerpUrls: cluster.topSerpUrls ?? [],
          status: cluster.status ?? 'active',
          createdAt: cluster.createdAt ?? Date.now(),
        });
      }

      // Also insert individual keywords into the keywords table
      await insertKeywordsFromInputs(ctx, args.projectId, keywordInputs);

      // Link newly inserted keywords to their clusters
      await ctx.runMutation(api.seo.keywords.linkKeywordsToClusters, {
        projectId: args.projectId,
      });

      return { success: true, count: cached.clusters.length, cached: true };
    }

    console.log('Cache miss for keyword clustering');

    const clusters = await generateKeywordClusters(
      keywordInputs,
      project?.websiteUrl,
      project?.industry
    );

    // [Cost Control Rule]: 1 API hit per cluster for SERP analysis (using the primary keyword)
    // [Network Efficiency]: Batched deeply into a single external HTTP transaction via getBulkTopSerpUrls
    const serpsToFetch = clusters
      .filter((c) => c.keywords.length > 0)
      .map((c) => c.keywords[0]);
      
    if (serpsToFetch.length > 0) {
      try {
        const bulkSerps = await ctx.runAction(internal.integrations.dataForSeo.getBulkTopSerpUrls, {
          keywords: serpsToFetch,
          limit: 5
        }) as any[];
        
        for (const cluster of clusters) {
          if (cluster.keywords.length > 0) {
            const match = bulkSerps.find(s => s.keyword === cluster.keywords[0]);
            if (match && match.urls && match.urls.length > 0) {
              cluster.topSerpUrls = match.urls.map((u: any) => u.url);
            }
          }
        }
      } catch (serpError) {
        console.warn(`Bulk SERP fetch failed:`, serpError);
      }
    }

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

    // Also insert individual keywords into the keywords table
    await insertKeywordsFromInputs(ctx, args.projectId, keywordInputs);

    // Link newly inserted keywords to their clusters
    await ctx.runMutation(api.seo.keywords.linkKeywordsToClusters, {
      projectId: args.projectId,
    });

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

/**
 * Internal-only cluster generation for background orchestration workflows.
 * Skips auth/rate-limiting (validated at trigger level).
 * Uses only internal.* mutations to avoid auth context loss.
 */
export const generateClustersInternal = internalAction({
  args: {
    projectId: v.id('projects'),
    userId: v.id('users'),
  },
  handler: async (ctx, args): Promise<{ success: boolean; count: number; error?: string }> => {
    // Get project via internal query (no auth needed)
    const project = await ctx.runQuery(internal.projects.projects.getProjectInternal, {
      projectId: args.projectId,
    });
    if (!project) {
      return { success: false, count: 0, error: 'Project not found' };
    }

    // Build keyword inputs from fallback (onboarding has no GSC)
    const keywordInputs = await buildFallbackKeywords(ctx, project);
    if (keywordInputs.length === 0) {
      return { success: false, count: 0, error: 'Unable to find keywords to cluster.' };
    }

    // Generate clusters via AI (pure function, no Convex calls)
    const clusters = await generateKeywordClusters(
      keywordInputs,
      project.websiteUrl,
      project.industry
    );

    // Optional: Batch SERP fetch
    const serpsToFetch = clusters
      .filter((c) => c.keywords.length > 0)
      .map((c) => c.keywords[0]);
    if (serpsToFetch.length > 0) {
      try {
        const bulkSerps = await ctx.runAction(internal.integrations.dataForSeo.getBulkTopSerpUrls, {
          keywords: serpsToFetch,
          limit: 5,
        }) as any[];
        for (const cluster of clusters) {
          if (cluster.keywords.length > 0) {
            const match = bulkSerps.find((s) => s.keyword === cluster.keywords[0]);
            if (match?.urls?.length > 0) {
              cluster.topSerpUrls = match.urls.map((u: any) => u.url);
            }
          }
        }
      } catch (serpError) {
        console.warn('[generateClustersInternal] Bulk SERP fetch failed:', serpError);
      }
    }

    // Store clusters via internal mutations
    let createdCount = 0;
    for (const cluster of clusters) {
      try {
        await ctx.runMutation(internal.seo.keywordClusters.createClusterInternal, {
          projectId: args.projectId,
          clusterName: cluster.clusterName,
          keywords: cluster.keywords,
          intent: cluster.intent,
          difficulty: cluster.difficulty,
          volumeRange: cluster.volumeRange,
          impactScore: cluster.impactScore,
          topSerpUrls: cluster.topSerpUrls || [],
          status: 'active',
          createdAt: Date.now(),
          userId: args.userId,
        });
        createdCount++;
      } catch (error) {
        console.error('[generateClustersInternal] Failed to store cluster:', error);
      }
    }

    // Insert individual keywords via internal mutation (with dedup)
    const existingKeywords = await ctx.runQuery(internal.seo.keywords.getKeywordsByProjectInternal, {
      projectId: args.projectId,
    }) as Array<{ keyword: string }>;
    const existingSet = new Set(existingKeywords.map((k) => k.keyword.toLowerCase().trim()));

    // Deduplicate incoming keywords against DB and within batch
    const seen = new Set<string>();
    const newKeywords = keywordInputs.filter((k) => {
      const normalized = k.keyword.toLowerCase().trim();
      if (existingSet.has(normalized) || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });

    const BATCH_SIZE = 50;
    for (let i = 0; i < newKeywords.length; i += BATCH_SIZE) {
      const batch = newKeywords.slice(i, i + BATCH_SIZE);
      try {
        await ctx.runMutation(internal.seo.keywords.createKeywordsInternal, {
          projectId: args.projectId,
          keywords: batch.map((k) => ({
            keyword: k.keyword,
            searchVolume: k.volume,
            difficulty: k.difficulty,
            intent: k.intent,
          })),
          userId: args.userId,
        });
      } catch (error) {
        console.error('[generateClustersInternal] Failed to insert keywords batch:', error);
      }
    }

    // Link keywords to clusters
    await ctx.runMutation(internal.seo.keywords.linkKeywordsToClustersInternal, {
      projectId: args.projectId,
    });

    return { success: true, count: createdCount };
  },
});

async function buildFallbackKeywords(
  ctx: Pick<GenericActionCtx<DataModel>, 'runAction' | 'runQuery' | 'runMutation'>,
  project?: { industry?: string; name?: string }
): Promise<KeywordInput[]> {
  const base = (project?.industry || project?.name || 'growth marketing').toLowerCase();
  // Semantic expansion: Prioritize lead generation (High Intent)
  const topics = [
    `hire ${base} expert`,             // Commercial
    `best ${base} services`,           // Commercial
    `${base} consultant for hire`,     // Transactional
    `${base} pricing guide`,           // Transactional
    `top rated ${base} firm`,          // Commercial
    `${base} case studies`,            // Informational
    `how to evaluate ${base}`,         // Informational
    `${base} ROI calculator`,          // Transactional
  ];

  try {
    const rawMetrics = await ctx.runAction(internal.integrations.dataForSeo.getKeywordIdeas, {
      keywords: topics,
    });
    
    if (rawMetrics && rawMetrics.length > 0) {
      return rawMetrics.map((metric: NormalizedKeywordMetric) => ({
        keyword: metric.keyword || 'Unknown Keyword',
        volume: metric.monthlySearches ?? 0,
        difficulty: metric.rankingDifficulty ?? 50,
        intent: metric.paidCompetition === 'HIGH' ? 'commercial' : metric.paidCompetition === 'MEDIUM' ? 'transactional' : 'informational',
      }));
    }
  } catch (error) {
    console.error('[KeywordActions] DataForSEO fallback failed, degrading to mock data:', error);
  }

  return topics.map((keyword, index) => ({
    keyword,
    volume: 500 - index * 30,
    difficulty: 35 + index * 3,
    intent: index < 3 ? 'commercial' : index < 5 ? 'transactional' : 'informational',
  }));
}

export const createManualClusterWithMetrics = action({
  args: {
    projectId: v.id('projects'),
    clusterName: v.string(),
    keywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Authenticate user
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    // Extract unique keywords
    const keywords = [...new Set(args.keywords.map((k) => k.trim()).filter(Boolean))];
    if (keywords.length < 3) throw new Error('A cluster needs at least 3 unique keywords');

    // 2. Fetch Metrics from DataForSEO
    let volumeRange = { min: 0, max: 0 };
    let difficulty = 50;
    let intent = 'informational';
    let impactScore = 0.5;

    try {
      const rawMetrics = await ctx.runAction(internal.integrations.dataForSeo.getKeywordIdeas, {
        keywords,
      });

      if (rawMetrics && rawMetrics.length > 0) {
        difficulty = Math.round(
          rawMetrics.reduce((sum: number, m: NormalizedKeywordMetric) => sum + (m.rankingDifficulty ?? 50), 0) /
            rawMetrics.length
        );
        const volumes = rawMetrics
          .map((m: NormalizedKeywordMetric) => m.monthlySearches ?? 0)
          .filter((v: number) => v > 0);
        if (volumes.length > 0) {
          volumeRange = { min: Math.min(...volumes), max: Math.max(...volumes) };
        }

        // Use intent from top keyword
        const topMetric = rawMetrics[0];
        intent =
          topMetric.paidCompetition === 'HIGH'
            ? 'commercial'
            : topMetric.paidCompetition === 'MEDIUM'
              ? 'transactional'
              : 'informational';

        // Simple impact calculation based on DFS Data
        const avgVol = (volumeRange.min + volumeRange.max) / 2;
        impactScore = Math.min((avgVol / 10000) * 0.4 + (1 - difficulty / 100) * 0.3 + 0.3, 1);
      }
    } catch (e) {
      console.warn('Manual cluster DFS metric fetch failed:', e);
    }

    // 3. Fetch Top SERPs from DataForSEO (Batch lookup for the primary keyword)
    let topSerpUrls: string[] = [];
    try {
      if (keywords.length > 0) {
        const bulkSerps = (await ctx.runAction(internal.integrations.dataForSeo.getBulkTopSerpUrls, {
          keywords: [keywords[0]],
          limit: 5,
        })) as any[];

        if (bulkSerps && bulkSerps.length > 0 && bulkSerps[0].urls) {
          topSerpUrls = bulkSerps[0].urls.map((u: any) => u.url);
        }
      }
    } catch (e) {
      console.warn('Manual cluster DFS SERP fetch failed:', e);
    }

    // 4. Create the cluster mapping using actual DFS payload metrics
    const clusterId = await ctx.runMutation(api.seo.keywordClusters.createCluster, {
      projectId: args.projectId,
      clusterName: args.clusterName,
      keywords,
      intent,
      difficulty,
      volumeRange,
      impactScore: Math.round(impactScore * 100) / 100,
      topSerpUrls,
      status: 'active',
      createdAt: Date.now(),
    });

    // 5. Insert these keywords into global keyword pool so the counts update correctly
    const keywordInputs = keywords.map((kw) => ({
      keyword: kw,
      volume: volumeRange.max,
      difficulty,
      intent,
    }));
    await insertKeywordsFromInputs(ctx, args.projectId, keywordInputs);
    await ctx.runMutation(api.seo.keywords.linkKeywordsToClusters, { projectId: args.projectId });

    return clusterId;
  },
});

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
 * Generate keywords from project URL using semantic library
 *
 * This allows users to get keywords without GSC by:
 * 1. Extracting relevant terms from their website URL/domain
 * 2. Searching the semantic keyword library for related keywords
 * 3. Adding discovered keywords to the project
 */
export const generateKeywordsFromUrlHandler = async (
  ctx: any,
  args: { projectId: Id<'projects'>; limit?: number; },
  userId: string
): Promise<{
  success: boolean;
  count: number;
  error?: string;
  keywords: Array<{ keyword: string; volume: number; difficulty: number; intent: string }>;
}> => {
  // Use internal query since workflows (or internal actions) don't have ctx.auth implicitly when hitting public API queries
  const project = await ctx.runQuery(internal.projects.projects.getProjectInternal, {
    projectId: args.projectId,
  });

  if (!project) {
    return { success: false, count: 0, keywords: [], error: 'Project not found' };
  }

    // Extract search terms from URL and project info
    const searchTerms = extractSearchTermsFromProject(project);

    const limit = args.limit || 30;
    const allKeywords: Array<{
      keyword: string;
      volume: number;
      difficulty: number;
      intent: string;
    }> = [];

    // If we have search terms, try library search first
    if (searchTerms.length > 0) {
      const keywordsPerTerm = Math.ceil(limit / searchTerms.length);

      // Search semantic library for each term
      for (const term of searchTerms) {
        try {
          const results = await ctx.runAction(api.seo.library.searchLibrary, {
            query: term,
            limit: keywordsPerTerm,
          });

          for (const r of results) {
            // Avoid duplicates
            if (!allKeywords.some((k) => k.keyword === r.keyword)) {
              allKeywords.push({
                keyword: r.keyword,
                volume: r.searchVolume,
                difficulty: r.difficulty,
                intent: r.intent,
              });
            }
          }
        } catch (e) {
          console.warn(`Failed to search library for term "${term}":`, e);
        }
      }
    }

    // If library search returned nothing (or we had no search terms), fall back to generated keywords
    if (allKeywords.length === 0) {
      const fallback = await buildFallbackKeywords(ctx, project);
      allKeywords.push(...fallback);
    }

    // Store keywords in the project
    if (allKeywords.length > 0) {
      // Use internal mutation so auth passes through
      await ctx.runMutation(internal.seo.keywords.createKeywordsInternal, {
        projectId: args.projectId,
        keywords: allKeywords.map((k) => ({
          keyword: k.keyword,
          searchVolume: k.volume,
          difficulty: k.difficulty,
          intent: k.intent,
        })),
        userId,
      });
    }

    return {
      success: true,
      count: allKeywords.length,
      keywords: allKeywords.slice(0, limit),
    };
};

export const generateKeywordsFromUrlInternal = internalAction({
  args: {
    projectId: v.id('projects'),
    userId: v.id('users'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await generateKeywordsFromUrlHandler(ctx, args, args.userId);
  },
});

export const generateKeywordsFromUrl = action({
  args: {
    projectId: v.id('projects'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return { success: false, count: 0, keywords: [], error: 'Unauthorized' };
    }
    return await generateKeywordsFromUrlHandler(ctx, args, userId);
  },
});


/**
 * Extract search terms from project URL and metadata
 */
function extractSearchTermsFromProject(project: {
  websiteUrl?: string;
  name?: string;
  industry?: string;
}): string[] {
  const terms: string[] = [];

  // Extract from URL
  if (project.websiteUrl) {
    try {
      const url = new URL(project.websiteUrl);
      const hostname = url.hostname.replace('www.', '');

      // Get domain name without TLD
      const domainParts = hostname.split('.');
      if (domainParts.length > 0) {
        const domainName = domainParts[0];
        // Split camelCase or hyphenated names
        const nameParts = domainName
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/-/g, ' ')
          .toLowerCase()
          .split(' ')
          .filter((p) => p.length > 2);
        terms.push(...nameParts);
      }

      // Extract from path if meaningful
      const pathParts = url.pathname.split('/').filter((p) => p.length > 2);
      terms.push(...pathParts.slice(0, 2));
    } catch {
      // Invalid URL, continue with other sources
    }
  }

  // Add industry if available
  if (project.industry) {
    terms.push(project.industry.toLowerCase());
  }

  // Add project name terms
  if (project.name) {
    const nameParts = project.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter((p) => p.length > 2);
    terms.push(...nameParts);
  }

  // Deduplicate and filter core terms
  const coreTerms = [...new Set(terms)].slice(0, 3);
  
  // Native Commercial Mapping Enhancement
  // We want the AI vector search to retrieve high-intent, transactional queries from the DB 
  // rather than informational generalities. We map commercial intent natively below.
  const commercialModifiers = ['services', 'agency', 'company', 'consultant', 'pricing'];
  const enrichedTerms: string[] = [];
  
  for (const term of coreTerms) {
    enrichedTerms.push(term);
    enrichedTerms.push(`hire ${term}`);
    enrichedTerms.push(`best ${term}`);
    // Attach one random commercial modifier to expand breadth efficiently
    const mod = commercialModifiers[Math.floor(Math.random() * commercialModifiers.length)];
    enrichedTerms.push(`${term} ${mod}`);
  }

  // Cap at 6 semantic query terms to maintain DB execution speed
  return [...new Set(enrichedTerms)].slice(0, 6);
}

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

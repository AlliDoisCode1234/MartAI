'use node';

import { action } from '../_generated/server';
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
import type { NormalizedSerpUrl } from '../integrations/dataForSeo';

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

    // Admin portal RBAC: only super_admin can generate keywords
    // Regular admins can view but not generate (prevents accidental expensive AI calls)
    if (user.role === 'admin' && user.role !== 'super_admin') {
      // Check if this is being called from admin context (no projectId ownership)
      const project = await ctx.runQuery(api.projects.projects.getProjectById, {
        projectId: args.projectId,
      });
      if (project && project.userId !== userId) {
        return { success: false, count: 0, error: 'Only super admins can generate keywords for other users projects' };
      }
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
      const connection = await ctx.runQuery(
        internal.integrations.gscConnections.getGSCConnectionInternal,
        {
          projectId: args.projectId,
        }
      );

      if (!connection?.accessToken || !connection?.siteUrl) {
        return { success: false, count: 0, error: 'GSC is not connected. Please connect Google Search Console in Settings first.' };
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
    await Promise.allSettled(
      clusters.map(async (cluster) => {
        if (cluster.keywords.length > 0) {
          try {
            const topSerpUrls = await ctx.runAction(internal.integrations.dataForSeo.getTopSerpUrls, {
               keyword: cluster.keywords[0],
               limit: 5
            }) as NormalizedSerpUrl[];
            
            if (topSerpUrls && topSerpUrls.length > 0) {
              cluster.topSerpUrls = topSerpUrls.map(u => u.url);
            }
          } catch (serpError) {
            console.warn(`SERP fetch failed for cluster ${cluster.clusterName}:`, serpError);
          }
        }
      })
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

async function buildFallbackKeywords(
  ctx: Pick<GenericActionCtx<DataModel>, 'runAction' | 'runQuery' | 'runMutation'>,
  project?: { industry?: string; name?: string }
): Promise<KeywordInput[]> {
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

  try {
    const rawMetrics = await ctx.runAction(internal.integrations.dataForSeo.getKeywordIdeas, {
      keywords: topics,
    });
    
    if (rawMetrics && rawMetrics.length > 0) {
      return rawMetrics.map((metric: { keyword: string; monthlySearches: number; rankingDifficulty: number; paidCompetition: string }) => ({
        keyword: metric.keyword,
        volume: metric.monthlySearches,
        difficulty: metric.rankingDifficulty || 50,
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
export const generateKeywordsFromUrl = action({
  args: {
    projectId: v.id('projects'),
    limit: v.optional(v.number()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    count: number;
    error?: string;
    keywords: Array<{ keyword: string; volume: number; difficulty: number; intent: string }>;
  }> => {
    // Get authenticated user
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return { success: false, count: 0, keywords: [], error: 'Unauthorized' };
    }

    // Get project details
    const project = await ctx.runQuery(api.projects.projects.getProjectById, {
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
      await ctx.runMutation(api.seo.keywords.createKeywords, {
        projectId: args.projectId,
        keywords: allKeywords.map((k) => ({
          keyword: k.keyword,
          searchVolume: k.volume,
          difficulty: k.difficulty,
          intent: k.intent,
        })),
      });
    }

    return {
      success: true,
      count: allKeywords.length,
      keywords: allKeywords.slice(0, limit),
    };
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

  // Deduplicate and limit
  return [...new Set(terms)].slice(0, 5);
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

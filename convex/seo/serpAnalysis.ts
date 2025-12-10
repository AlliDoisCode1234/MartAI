/**
 * SERP Analysis
 *
 * Analyze competitor rankings for any keyword.
 * Limit: 1 SERP analysis per project (upsell for more).
 */

import { action, mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';
import type { Id } from '../_generated/dataModel';

// ============================================
// TYPES
// ============================================

interface SerpResult {
  position: number;
  url: string;
  domain: string;
  title: string;
  snippet?: string;
  isAd?: boolean;
}

// ============================================
// QUERIES
// ============================================

/**
 * Get SERP analyses for a project
 */
export const getByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('serpAnalyses')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .collect();
  },
});

/**
 * Get the count of SERP analyses for a project (for limit checking)
 */
export const getAnalysisCount = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const analyses = await ctx.db
      .query('serpAnalyses')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    return analyses.length;
  },
});

/**
 * Check if project can perform SERP analysis (limit check)
 */
export const canAnalyze = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const analyses = await ctx.db
      .query('serpAnalyses')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Free tier: 1 SERP analysis per project
    const limit = 1;
    const remaining = Math.max(0, limit - analyses.length);

    return {
      canAnalyze: analyses.length < limit,
      used: analyses.length,
      limit,
      remaining,
    };
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Store SERP analysis results
 */
export const storeSerpResults = mutation({
  args: {
    projectId: v.id('projects'),
    keyword: v.string(),
    location: v.optional(v.string()),
    results: v.array(
      v.object({
        position: v.number(),
        url: v.string(),
        domain: v.string(),
        title: v.string(),
        snippet: v.optional(v.string()),
        isAd: v.optional(v.boolean()),
      })
    ),
    searchVolume: v.optional(v.number()),
    difficulty: v.optional(v.number()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if analysis already exists for this keyword
    const existing = await ctx.db
      .query('serpAnalyses')
      .withIndex('by_project_keyword', (q) =>
        q.eq('projectId', args.projectId).eq('keyword', args.keyword)
      )
      .first();

    if (existing) {
      // Update existing analysis
      await ctx.db.patch(existing._id, {
        results: args.results,
        searchVolume: args.searchVolume,
        difficulty: args.difficulty,
        source: args.source,
        analyzedAt: Date.now(),
      });
      return existing._id;
    }

    // Create new analysis
    return await ctx.db.insert('serpAnalyses', {
      projectId: args.projectId,
      keyword: args.keyword,
      location: args.location,
      results: args.results,
      searchVolume: args.searchVolume,
      difficulty: args.difficulty,
      source: args.source,
      analyzedAt: Date.now(),
    });
  },
});

// ============================================
// ACTIONS
// ============================================

/**
 * Analyze SERP for a keyword
 * Returns top 10 organic results
 */
export const analyzeSERP = action({
  args: {
    projectId: v.id('projects'),
    keyword: v.string(),
    location: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    results?: SerpResult[];
    error?: string;
    limitReached?: boolean;
  }> => {
    // Check usage limit
    const limitCheck = await ctx.runQuery(api.seo.serpAnalysis.canAnalyze, {
      projectId: args.projectId,
    });

    if (!limitCheck.canAnalyze) {
      return {
        success: false,
        error: 'SERP analysis limit reached. Upgrade to analyze more keywords.',
        limitReached: true,
      };
    }

    try {
      // For now, use mock data
      // TODO: Integrate DataForSEO or SerpAPI
      const mockResults: SerpResult[] = generateMockSerpResults(args.keyword);

      // Store results
      await ctx.runMutation(api.seo.serpAnalysis.storeSerpResults, {
        projectId: args.projectId,
        keyword: args.keyword,
        location: args.location || 'US',
        results: mockResults,
        searchVolume: Math.floor(Math.random() * 10000) + 100,
        difficulty: Math.floor(Math.random() * 100),
        source: 'mock',
      });

      return {
        success: true,
        results: mockResults,
      };
    } catch (error: any) {
      console.error('SERP analysis failed:', error);
      return {
        success: false,
        error: error?.message || 'Failed to analyze SERP',
      };
    }
  },
});

// ============================================
// HELPERS
// ============================================

/**
 * Generate mock SERP results for development
 */
function generateMockSerpResults(keyword: string): SerpResult[] {
  const domains = [
    'wikipedia.org',
    'forbes.com',
    'hubspot.com',
    'neilpatel.com',
    'moz.com',
    'semrush.com',
    'ahrefs.com',
    'searchenginejournal.com',
    'backlinko.com',
    'contentmarketinginstitute.com',
  ];

  const titlePrefixes = [
    'The Complete Guide to',
    'How to Master',
    '10 Best',
    'What is',
    "Beginner's Guide to",
    '7 Tips for',
    'The Ultimate',
    'Everything You Need to Know About',
    'Why',
    'How',
  ];

  return domains.map((domain, index) => ({
    position: index + 1,
    url: `https://www.${domain}/${keyword.toLowerCase().replace(/\s+/g, '-')}`,
    domain,
    title: `${titlePrefixes[index]} ${keyword} | ${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)}`,
    snippet: `Learn everything about ${keyword}. This comprehensive guide covers the most important aspects...`,
    isAd: false,
  }));
}

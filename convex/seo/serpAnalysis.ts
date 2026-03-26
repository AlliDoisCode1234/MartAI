/**
 * SERP Analysis
 *
 * AI-powered competitive SERP analysis for keywords.
 * Uses the AI router for multi-provider LLM inference.
 * Limit: 1 SERP analysis per project (upsell for more).
 */

import { action, mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { api } from '../_generated/api';
import { requireProjectAccess } from '../lib/rbac';

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
    await requireProjectAccess(ctx, args.projectId, 'viewer');
    return await ctx.db
      .query('serpAnalyses')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .collect();
  },
});

/**
 * Get SERP analysis for a specific keyword in a project
 */
export const getByKeyword = query({
  args: {
    projectId: v.id('projects'),
    keyword: v.string(),
  },
  handler: async (ctx, args) => {
    await requireProjectAccess(ctx, args.projectId, 'viewer');
    return await ctx.db
      .query('serpAnalyses')
      .withIndex('by_project_keyword', (q) =>
        q.eq('projectId', args.projectId).eq('keyword', args.keyword)
      )
      .first();
  },
});

/**
 * Get the count of SERP analyses for a project (for limit checking)
 */
export const getAnalysisCount = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await requireProjectAccess(ctx, args.projectId, 'viewer');
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
    await requireProjectAccess(ctx, args.projectId, 'viewer');
    const analyses = await ctx.db
      .query('serpAnalyses')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Limit: 1 SERP analysis per project
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

/**
 * Verify editor access for a project (used by analyzeSERP action before AI call)
 */
export const verifyEditorAccess = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await requireProjectAccess(ctx, args.projectId, 'editor');
    return { authorized: true };
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
    await requireProjectAccess(ctx, args.projectId, 'editor');

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
 * AI-powered SERP analysis for a keyword.
 * Uses the AI router to generate competitive landscape data.
 * Returns top organic results with position, domain, title, and snippet.
 */
export const analyzeSERP = action({
  args: {
    projectId: v.id('projects'),
    keyword: v.string(),
    location: v.optional(v.string()),
    searchVolume: v.optional(v.number()),
    difficulty: v.optional(v.number()),
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
      // Security: Verify editor access BEFORE expensive AI call
      // canAnalyze only checks viewer access; storeSerpResults checks editor but runs after AI
      await ctx.runQuery(api.seo.serpAnalysis.verifyEditorAccess, {
        projectId: args.projectId,
      });

      // Use the AI router for intelligent SERP analysis
      const aiResult = await ctx.runAction(api.ai.router.router.generateWithFallback, {
        systemPrompt: `You are an expert SEO analyst. When given a keyword, you analyze the likely top 10 Google organic search results for that keyword. Provide realistic, data-informed results based on your knowledge of which domains typically rank well for this type of query.

IMPORTANT: Respond ONLY with a valid JSON array. No markdown, no explanation, no code fences. Just the raw JSON array.

Each result object must have exactly these fields:
- "position": number (1-10)
- "url": string (a realistic URL path on the domain)
- "domain": string (just the domain, no www or protocol)
- "title": string (a realistic page title)
- "snippet": string (a realistic meta description / search snippet)
- "isAd": boolean (always false for organic results)`,
        prompt: `Analyze the top 10 organic Google SERP results for the keyword: "${args.keyword}"${args.location ? ` in location: ${args.location}` : ''}.

Consider:
- Which authoritative domains typically rank for this type of query
- The search intent behind this keyword (informational, commercial, transactional, navigational)
- Content types that Google tends to favor for this query
- Realistic page titles and meta descriptions

Return a JSON array of exactly 10 results.`,
        temperature: 0.4,
        taskType: 'structured',
        strategy: 'balanced',
      });

      // Parse the AI response into structured SERP results
      let parsedResults: SerpResult[];
      try {
        // Clean the response — strip markdown fences if present
        let cleaned = aiResult.content.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        const raw = JSON.parse(cleaned);

        if (!Array.isArray(raw)) {
          throw new Error('AI response is not an array');
        }

        // Validate and normalize each result
        parsedResults = raw.slice(0, 10).map((item: Record<string, unknown>, index: number) => ({
          position: typeof item.position === 'number' ? item.position : index + 1,
          url: typeof item.url === 'string' ? item.url : `https://${item.domain || 'example.com'}`,
          domain: typeof item.domain === 'string' ? item.domain : 'unknown.com',
          title: typeof item.title === 'string' ? item.title : `Result ${index + 1}`,
          snippet: typeof item.snippet === 'string' ? item.snippet : undefined,
          isAd: typeof item.isAd === 'boolean' ? item.isAd : false,
        }));
      } catch (parseError) {
        console.error('[SerpAnalysis] Failed to parse AI response:', parseError);
        // Security: Do NOT log raw AI content — may contain user-provided context
        return {
          success: false,
          error: 'Failed to parse SERP analysis results. Please try again.',
        };
      }

      // Store results in the database
      await ctx.runMutation(api.seo.serpAnalysis.storeSerpResults, {
        projectId: args.projectId,
        keyword: args.keyword,
        location: args.location || 'US',
        results: parsedResults,
        searchVolume: args.searchVolume,
        difficulty: args.difficulty,
        source: 'ai_analysis',
      });

      return {
        success: true,
        results: parsedResults,
      };
    } catch (error: unknown) {
      console.error('[SerpAnalysis] SERP analysis failed:', error);
      // Security: Return generic error — do NOT expose internal error.message to caller
      return {
        success: false,
        error: 'SERP analysis failed. Please try again.',
      };
    }
  },
});

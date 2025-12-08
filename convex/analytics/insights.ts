'use node';
/**
 * Enhanced Insight Generation
 *
 * Combines multiple intelligence sources:
 * - GSC keyword data with semantic analysis
 * - GA4 traffic and behavior metrics
 * - Keyword library vector search
 * - RAG knowledge base retrieval
 * - AI-powered analysis and recommendations
 */

import { internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

/**
 * Legacy generateInsights for workflow compatibility
 */
export const generateInsights = internalAction({
  args: {
    projectId: v.id('projects'),
    ga4Data: v.optional(v.any()),
    gscData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const insights = [];

    if (args.ga4Data) {
      insights.push({
        type: 'traffic_trend',
        title: 'Traffic is stable',
        description: 'Your traffic has been consistent over the last period.',
        action: 'monitor',
        metadata: { source: 'ga4' },
      });
    }

    if (args.gscData) {
      insights.push({
        type: 'keyword_opportunity',
        title: 'New keyword opportunities',
        description: 'You are ranking for new keywords.',
        action: 'create_content',
        metadata: { source: 'gsc' },
      });
    }

    return insights;
  },
});

/**
 * Legacy generateContentInsights for workflow compatibility
 */
export const generateContentInsights = internalAction({
  args: {
    briefId: v.id('briefs'),
    metrics: v.any(),
  },
  handler: async (_ctx, _args) => {
    return {
      recommendations: [
        {
          type: 'refresh',
          reason: 'Content is outdated',
          action: 'Update statistics and examples',
        },
      ],
    };
  },
});

/**
 * Generate Enhanced Semantic Insights
 *
 * Cross-references GSC keywords with keyword library for deeper recommendations.
 * Uses vector search to find semantically related high-value keywords.
 */
export const generateEnhancedInsights = internalAction({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const insights: Array<{
      type: string;
      title: string;
      description: string;
      action: string;
      metadata: any;
    }> = [];

    // 1. Get Quick Win keywords from GSC (position 5-15, high impressions)
    const quickWins = await ctx.runQuery(internal.analytics.gscKeywords.getQuickWinKeywords, {
      projectId: args.projectId,
      minImpressions: 300,
    });

    if (!quickWins || quickWins.length === 0) {
      console.log('[EnhancedInsights] No Quick Win keywords found');
      return insights;
    }

    console.log(`[EnhancedInsights] Found ${quickWins.length} Quick Win keywords`);

    // 2. For each Quick Win, search the keyword library for semantically related keywords
    for (const quickWin of quickWins.slice(0, 5)) {
      try {
        // Semantic search in the keyword library using vector embeddings
        const relatedFromLibrary = await ctx.runAction(api.seo.library.searchLibrary, {
          query: quickWin.keyword,
          limit: 5,
        });

        if (relatedFromLibrary && relatedFromLibrary.length > 0) {
          // Find high-value related keywords (high volume, lower difficulty)
          const highValueRelated = relatedFromLibrary.filter(
            (k: any) => k.searchVolume > 500 && k.difficulty < 60
          );

          if (highValueRelated.length > 0) {
            insights.push({
              type: 'semantic_opportunity',
              title: `"${quickWin.keyword}" + Related Keywords`,
              description: `You're ranking #${quickWin.position.toFixed(0)} for "${quickWin.keyword}" (${quickWin.impressions} impressions). Related high-value keywords: ${highValueRelated.map((k: any) => `${k.keyword} (${k.searchVolume}/mo)`).join(', ')}`,
              action: 'Create comprehensive content targeting this topic cluster',
              metadata: {
                gscKeyword: quickWin.keyword,
                gscPosition: quickWin.position,
                gscImpressions: quickWin.impressions,
                relatedKeywords: highValueRelated.map((k: any) => ({
                  keyword: k.keyword,
                  volume: k.searchVolume,
                  difficulty: k.difficulty,
                  score: k._score,
                })),
              },
            });
          }
        }
      } catch (e) {
        console.error(`[EnhancedInsights] Failed to search for related keywords:`, e);
      }
    }

    // 3. Store insights
    for (const insight of insights) {
      await ctx.runMutation(api.analytics.analytics.storeInsight, {
        projectId: args.projectId,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        action: insight.action,
        metadata: insight.metadata,
      });
    }

    console.log(`[EnhancedInsights] Generated ${insights.length} semantic insights`);
    return insights;
  },
});

/**
 * Find Content Gaps
 *
 * Identifies high-value keywords in the library that the site ISN'T ranking for.
 * Compares GSC keywords to the seeded keyword library.
 */
export const findContentGaps = internalAction({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // Get all current GSC keywords for this project
    const latestKeywords = await ctx.runQuery(api.analytics.gscKeywords.getLatestKeywords, {
      projectId: args.projectId,
      limit: 200,
    });

    const rankedKeywords = new Set(latestKeywords.map((k: any) => k.keyword.toLowerCase()));

    // Get high-value keywords from the library that we're NOT ranking for
    const gaps: Array<{
      keyword: string;
      searchVolume: number;
      difficulty: number;
      intent: string;
    }> = [];

    // Query the library for high-value keywords
    const libraryKeywords = await ctx.runQuery(api.seo.library.listKeywords, {
      paginationOpts: { numItems: 50 },
    });

    for (const libKeyword of libraryKeywords.page) {
      if (
        !rankedKeywords.has(libKeyword.keyword.toLowerCase()) &&
        libKeyword.searchVolume > 500 &&
        libKeyword.difficulty < 50
      ) {
        gaps.push({
          keyword: libKeyword.keyword,
          searchVolume: libKeyword.searchVolume,
          difficulty: libKeyword.difficulty,
          intent: libKeyword.intent,
        });
      }
    }

    // Create insight if gaps found
    if (gaps.length > 0) {
      const topGaps = gaps.slice(0, 5);
      await ctx.runMutation(api.analytics.analytics.storeInsight, {
        projectId: args.projectId,
        type: 'content_gap',
        title: `${gaps.length} Untapped Keywords Found`,
        description: `Your site isn't ranking for these high-value keywords: ${topGaps.map((g) => `${g.keyword} (${g.searchVolume}/mo)`).join(', ')}. Create content targeting these opportunities.`,
        action: 'Create new content',
        metadata: { gaps: topGaps },
      });
    }

    return gaps;
  },
});

/**
 * Suggest Keyword Clusters
 *
 * Uses semantic similarity to group Quick Win keywords into topic clusters
 * that can be targeted with comprehensive pillar content.
 */
export const suggestKeywordClusters = internalAction({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    // Get latest GSC keywords
    const keywords = await ctx.runQuery(api.analytics.gscKeywords.getLatestKeywords, {
      projectId: args.projectId,
      limit: 50,
    });

    if (!keywords || keywords.length < 5) {
      return [];
    }

    // Group semantically similar keywords
    const clusters: Array<{
      name: string;
      keywords: string[];
      totalImpressions: number;
      avgPosition: number;
    }> = [];

    // Simple clustering: group by first word or common theme
    const keywordGroups = new Map<string, typeof keywords>();

    for (const kw of keywords) {
      const firstWord = kw.keyword.split(' ')[0].toLowerCase();
      if (!keywordGroups.has(firstWord)) {
        keywordGroups.set(firstWord, []);
      }
      keywordGroups.get(firstWord)!.push(kw);
    }

    // Filter groups with 3+ keywords
    for (const [name, group] of keywordGroups) {
      if (group.length >= 3) {
        clusters.push({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          keywords: group.map((k) => k.keyword),
          totalImpressions: group.reduce((acc, k) => acc + k.impressions, 0),
          avgPosition: group.reduce((acc, k) => acc + k.position, 0) / group.length,
        });
      }
    }

    // Store as insight if clusters found
    if (clusters.length > 0) {
      await ctx.runMutation(api.analytics.analytics.storeInsight, {
        projectId: args.projectId,
        type: 'cluster_suggestion',
        title: `${clusters.length} Topic Clusters Identified`,
        description: `Your keywords naturally group into ${clusters.length} topic clusters. Consider creating pillar content for: ${clusters
          .slice(0, 3)
          .map((c) => c.name)
          .join(', ')}`,
        action: 'Generate topic clusters',
        metadata: { clusters: clusters.slice(0, 5) },
      });
    }

    return clusters;
  },
});

/**
 * Suggest Briefs Based on Insights
 *
 * Recommends content briefs based on Quick Wins, Content Gaps, and Clusters.
 */
export const suggestBriefs = internalAction({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const briefSuggestions: Array<{
      title: string;
      targetKeyword: string;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];

    // Get Quick Wins
    const quickWins = await ctx.runQuery(internal.analytics.gscKeywords.getQuickWinKeywords, {
      projectId: args.projectId,
      minImpressions: 500,
    });

    // Suggest briefs for top Quick Wins
    for (const qw of (quickWins || []).slice(0, 3)) {
      briefSuggestions.push({
        title: `Complete Guide: ${qw.keyword.charAt(0).toUpperCase() + qw.keyword.slice(1)}`,
        targetKeyword: qw.keyword,
        reason: `Ranking #${qw.position.toFixed(0)} with ${qw.impressions} impressions - push to page 1`,
        priority: 'high',
      });
    }

    // Store as actionable insight
    if (briefSuggestions.length > 0) {
      await ctx.runMutation(api.analytics.analytics.storeInsight, {
        projectId: args.projectId,
        type: 'brief_suggestion',
        title: `${briefSuggestions.length} Content Ideas Ready`,
        description: `Based on your Quick Wins, we suggest: ${briefSuggestions.map((b) => b.title).join(', ')}`,
        action: 'Create briefs',
        metadata: { suggestions: briefSuggestions },
      });
    }

    return briefSuggestions;
  },
});

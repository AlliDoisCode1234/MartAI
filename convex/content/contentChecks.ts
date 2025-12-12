'use node';

import { v } from 'convex/values';
import { action } from '../_generated/server';
import { internal } from '../_generated/api';

/**
 * Content Quality Checker
 *
 * Integrates with Originality.ai API for:
 * - Plagiarism detection
 * - AI content detection
 * - Readability scoring
 */

// Thresholds for determining pass/warning/fail
const THRESHOLDS = {
  plagiarism: {
    pass: 90, // >90% unique = pass
    warning: 70, // 70-90% = warning
    // <70% = fail
  },
  ai: {
    pass: 30, // <30% AI = pass
    warning: 60, // 30-60% = warning
    // >60% = fail
  },
};

type CheckStatus = 'pass' | 'warning' | 'fail';

interface ContentCheckResult {
  plagiarismScore: number;
  aiScore: number;
  readabilityScore?: number;
  status: CheckStatus;
  details?: {
    flaggedSentences?: { text: string; aiProbability: number }[];
    plagiarismMatches?: { text: string; source: string; matchPercentage: number }[];
  };
  provider: string;
  rawResponse?: unknown;
}

/**
 * Calculate overall status based on scores
 */
function calculateStatus(plagiarismScore: number, aiScore: number): CheckStatus {
  // If plagiarism is very bad, fail
  if (plagiarismScore < THRESHOLDS.plagiarism.warning) {
    return 'fail';
  }
  // If AI is very high, fail
  if (aiScore > THRESHOLDS.ai.warning) {
    return 'fail';
  }
  // If either is in warning zone
  if (plagiarismScore < THRESHOLDS.plagiarism.pass || aiScore > THRESHOLDS.ai.pass) {
    return 'warning';
  }
  return 'pass';
}

/**
 * Check content quality using Originality.ai API
 */
export const checkContent = action({
  args: {
    draftId: v.id('drafts'),
    content: v.string(),
  },
  handler: async (ctx, args): Promise<ContentCheckResult> => {
    const apiKey = process.env.ORIGINALITY_API_KEY;

    // If no API key, return mock data for development
    if (!apiKey) {
      console.warn('ORIGINALITY_API_KEY not set, using mock data');
      const mockResult: ContentCheckResult = {
        plagiarismScore: 95,
        aiScore: 25,
        readabilityScore: 72,
        status: 'pass',
        provider: 'mock',
        details: {
          flaggedSentences: [],
          plagiarismMatches: [],
        },
      };
      return mockResult;
    }

    // Skip check for very short content
    if (args.content.length < 100) {
      return {
        plagiarismScore: 100,
        aiScore: 0,
        status: 'pass',
        provider: 'skipped',
        details: {
          flaggedSentences: [],
          plagiarismMatches: [],
        },
      };
    }

    try {
      // Call Originality.ai API
      const response = await fetch('https://api.originality.ai/api/v1/scan/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OAI-API-KEY': apiKey,
        },
        body: JSON.stringify({
          content: args.content,
          aiModelVersion: '3', // Latest model
          storeScan: false, // Don't store in their system
        }),
      });

      if (!response.ok) {
        throw new Error(`Originality.ai API error: ${response.status}`);
      }

      const data = await response.json();

      // Parse response
      const aiScore = Math.round((data.ai?.isAi || 0) * 100);
      const plagiarismScore = Math.round(data.plagiarism?.totalTextScore || 100);
      const status = calculateStatus(plagiarismScore, aiScore);

      // Extract flagged sentences if available
      const flaggedSentences =
        data.ai?.sentences
          ?.filter((s: { isAi: number }) => s.isAi > 0.5)
          .map((s: { text: string; isAi: number }) => ({
            text: s.text,
            aiProbability: Math.round(s.isAi * 100),
          })) || [];

      // Extract plagiarism matches if available
      const plagiarismMatches =
        data.plagiarism?.matchedParts?.map(
          (m: { text: string; source: string; score: number }) => ({
            text: m.text,
            source: m.source,
            matchPercentage: Math.round(m.score * 100),
          })
        ) || [];

      const result: ContentCheckResult = {
        plagiarismScore,
        aiScore,
        status,
        provider: 'originality.ai',
        details: {
          flaggedSentences,
          plagiarismMatches,
        },
        rawResponse: data,
      };

      return result;
    } catch (error) {
      console.error('Content check failed:', error);
      // Return a warning result if API fails - don't block publishing
      return {
        plagiarismScore: 100,
        aiScore: 0,
        status: 'warning',
        provider: 'error',
        details: {
          flaggedSentences: [],
          plagiarismMatches: [],
        },
      };
    }
  },
});

/**
 * Run content check and store result
 */
export const runAndStoreCheck = action({
  args: {
    draftId: v.id('drafts'),
    briefId: v.optional(v.id('briefs')),
    projectId: v.id('projects'),
    content: v.string(),
  },
  handler: async (ctx, args): Promise<ContentCheckResult> => {
    // Run the check
    const result: ContentCheckResult = await ctx.runAction(
      internal['content/contentChecks'].checkContent,
      {
        draftId: args.draftId,
        content: args.content,
      }
    );

    // Store the result (mutation is in contentCheckQueries.ts)
    await ctx.runMutation(internal.content.contentCheckQueries.storeCheckResult, {
      draftId: args.draftId,
      briefId: args.briefId,
      projectId: args.projectId,
      ...result,
      checkedAt: Date.now(),
    });

    return result;
  },
});

// Note: Queries and mutations are in contentCheckQueries.ts because they can't be in 'use node' files

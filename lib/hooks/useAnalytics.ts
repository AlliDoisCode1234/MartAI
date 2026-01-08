/**
 * useAnalytics Hook
 *
 * Consolidated hook for analytics-related data fetching.
 * Includes MR score and insights.
 */
'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useMemo } from 'react';

interface UseAnalyticsOptions {
  /** Skip fetching if true */
  skip?: boolean;
}

interface MRScore {
  overall: number;
  tier: string;
  [key: string]: unknown;
}

interface Insight {
  _id: string;
  type: string;
  title: string;
  description?: string;
  [key: string]: unknown;
}

interface UseAnalyticsResult {
  /** MR score object */
  mrScore: MRScore | null | undefined;
  /** All insights */
  insights: Insight[];
  /** Quick win insights (filtered) */
  quickWins: Insight[];
  /** Content gap insights (filtered) */
  contentGaps: Insight[];
  /** Whether data is still loading */
  isLoading: boolean;
  /** Current MR tier */
  mrTier: 'needs_work' | 'building' | 'growing' | 'thriving' | null;
  /** MR score value (0-100) */
  mrScoreValue: number | null;
}

export function useAnalytics(
  projectId?: string | null,
  options: UseAnalyticsOptions = {}
): UseAnalyticsResult {
  const { skip = false } = options;

  const typedProjectId = projectId as Id<'projects'> | undefined;
  const shouldFetch = !skip && !!typedProjectId;

  // Fetch MR score
  const mrScore = useQuery(
    api.analytics.martaiRatingQueries.getLatestScore,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  // Fetch insights
  const insights = useQuery(
    api.analytics.analytics.getInsights,
    shouldFetch && typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  const result = useMemo<UseAnalyticsResult>(() => {
    const isLoading = mrScore === undefined || insights === undefined;

    // Determine MR tier
    let mrTier: UseAnalyticsResult['mrTier'] = null;
    const mrScoreValue = mrScore?.overall ?? null;

    if (mrScoreValue !== null) {
      if (mrScoreValue >= 80) mrTier = 'thriving';
      else if (mrScoreValue >= 65) mrTier = 'growing';
      else if (mrScoreValue >= 50) mrTier = 'building';
      else mrTier = 'needs_work';
    }

    // Filter insights by type
    const insightList = insights ?? [];
    const quickWins = insightList.filter((i: Insight) => i.type === 'quick_win');
    const contentGaps = insightList.filter((i: Insight) => i.type === 'content_gap');

    return {
      mrScore,
      insights: insightList,
      quickWins,
      contentGaps,
      isLoading,
      mrTier,
      mrScoreValue,
    };
  }, [mrScore, insights]);

  return result;
}

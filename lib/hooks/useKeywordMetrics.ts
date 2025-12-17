'use client';

/**
 * useKeywordMetrics Hook
 *
 * Fetches keyword metrics (volume, difficulty) for a given keyword string.
 * Looks up the keyword in the project's keywords table.
 */

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

type KeywordMetrics = {
  volume: number | null;
  difficulty: number | null;
  intent: string | null;
  priority: string | null;
  found: boolean;
};

export function useKeywordMetrics(
  projectId: Id<'projects'> | null,
  keyword: string | undefined
): KeywordMetrics {
  const keywords = useQuery(
    api.seo.keywords.getKeywordsByProject,
    projectId ? { projectId } : 'skip'
  );

  if (!keyword || !keywords) {
    return { volume: null, difficulty: null, intent: null, priority: null, found: false };
  }

  // Find matching keyword (case-insensitive)
  const match = keywords.find(
    (k: {
      keyword: string;
      searchVolume?: number;
      difficulty?: number;
      intent?: string;
      priority?: string;
    }) => k.keyword.toLowerCase() === keyword.toLowerCase()
  );

  if (!match) {
    return { volume: null, difficulty: null, intent: null, priority: null, found: false };
  }

  return {
    volume: match.searchVolume ?? null,
    difficulty: match.difficulty ?? null,
    intent: match.intent ?? null,
    priority: match.priority ?? null,
    found: true,
  };
}

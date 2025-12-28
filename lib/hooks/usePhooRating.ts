/**
 * usePhooRating Hook
 *
 * Single source of truth for Phoo Rating data.
 * Works across member and admin portals.
 */

'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface PhooRatingData {
  rating: number;
  status: 'Needs Work' | 'Fair' | 'Good' | 'Great' | 'Excellent';
  color: string;
  breakdown: Array<{
    component: string;
    score: number;
    weight: number;
    weighted: number;
    details: string;
  }>;
  insights: string[];
  topOpportunity: string;
}

interface UsePhooRatingResult {
  rating: number;
  status: string;
  color: string;
  breakdown: PhooRatingData['breakdown'];
  insights: string[];
  topOpportunity: string;
  isLoading: boolean;
  data: PhooRatingData | null;
}

export function usePhooRating(projectId?: Id<'projects'>): UsePhooRatingResult {
  const rating = useQuery(
    projectId ? api.phoo.lib.rating.getPhooRating : undefined,
    projectId ? { projectId } : 'skip'
  );

  return {
    rating: rating?.rating ?? 0,
    status: rating?.status ?? 'Needs Work',
    color: rating?.color ?? 'red',
    breakdown: rating?.breakdown ?? [],
    insights: rating?.insights ?? [],
    topOpportunity: rating?.topOpportunity ?? '',
    isLoading: rating === undefined,
    data: rating ?? null,
  };
}

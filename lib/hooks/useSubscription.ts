/**
 * useSubscription Hook
 *
 * Consolidated hook for subscription and billing data.
 * Includes plan tier, limits, usage, and feature gates.
 */
'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useMemo } from 'react';
import { useAuth } from '@/lib/useAuth';

// Plan limits matching PLAN_LIMITS in convex/subscriptions/subscriptions.ts
const PLAN_LIMITS = {
  solo: { maxUrls: 1, maxKeywordIdeas: 250, maxAiReports: 4, maxContentPieces: 4 },
  starter: { maxUrls: 1, maxKeywordIdeas: 250, maxAiReports: 4, maxContentPieces: 4 },
  growth: { maxUrls: 3, maxKeywordIdeas: 1000, maxAiReports: 12, maxContentPieces: 12 },
  enterprise: { maxUrls: 999999, maxKeywordIdeas: 10000, maxAiReports: 100, maxContentPieces: 100 },
  scale: { maxUrls: 10, maxKeywordIdeas: 2000, maxAiReports: 20, maxContentPieces: 20 },
} as const;

type PlanTier = keyof typeof PLAN_LIMITS;

interface UseSubscriptionResult {
  /** Raw subscription document */
  subscription: unknown | null | undefined;
  /** Usage document for current period */
  usage: unknown | null | undefined;
  /** Whether data is loading */
  isLoading: boolean;
  /** Current plan tier */
  tier: PlanTier | null;
  /** Whether user has active subscription */
  isActive: boolean;
  /** Whether user is in grace period */
  isGracePeriod: boolean;
  /** Plan limits for current tier */
  limits: (typeof PLAN_LIMITS)[PlanTier] | null;
  /** URLs used / max */
  urlsUsed: number;
  urlsMax: number;
  urlsRemaining: number;
  /** AI reports used / max */
  reportsUsed: number;
  reportsMax: number;
  reportsRemaining: number;
  /** Content pieces used / max */
  contentUsed: number;
  contentMax: number;
  contentRemaining: number;
  /** Feature gates */
  canCreateProject: boolean;
  canGenerateReport: boolean;
  canCreateContent: boolean;
}

export function useSubscription(): UseSubscriptionResult {
  const { user, isAuthenticated } = useAuth();
  const userId = user?._id as Id<'users'> | undefined;

  const subscriptionData = useQuery(
    api.subscriptions.subscriptions.getSubscriptionByUser,
    isAuthenticated && userId ? { userId } : 'skip'
  );

  const result = useMemo<UseSubscriptionResult>(() => {
    const isLoading = subscriptionData === undefined;
    const subscription = subscriptionData?.subscription ?? null;
    const usage = subscriptionData?.usage ?? null;

    // Determine tier from subscription or user's membershipTier
    const tierString = (subscription?.plan ?? user?.membershipTier ?? null) as string | null;
    const tier = tierString?.toLowerCase() as PlanTier | null;
    const limits = tier && PLAN_LIMITS[tier] ? PLAN_LIMITS[tier] : null;

    // Subscription status checks
    const status = subscription?.status as string | undefined;
    const isActive = status === 'active' || status === 'trialing';
    const isGracePeriod = status === 'grace_period';

    // Usage calculations
    const urlsUsed = usage?.urlsAnalyzed ?? 0;
    const urlsMax = limits?.maxUrls ?? 0;
    const reportsUsed = usage?.aiReportsGenerated ?? 0;
    const reportsMax = limits?.maxAiReports ?? 0;
    const contentUsed = usage?.contentPiecesPlanned ?? 0;
    const contentMax = limits?.maxContentPieces ?? 0;

    return {
      subscription,
      usage,
      isLoading,
      tier,
      isActive,
      isGracePeriod,
      limits,
      urlsUsed,
      urlsMax,
      urlsRemaining: Math.max(0, urlsMax - urlsUsed),
      reportsUsed,
      reportsMax,
      reportsRemaining: Math.max(0, reportsMax - reportsUsed),
      contentUsed,
      contentMax,
      contentRemaining: Math.max(0, contentMax - contentUsed),
      // Feature gates
      canCreateProject: urlsUsed < urlsMax || !limits,
      canGenerateReport: reportsUsed < reportsMax || !limits,
      canCreateContent: contentUsed < contentMax || !limits,
    };
  }, [subscriptionData, user?.membershipTier]);

  return result;
}

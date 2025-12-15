/**
 * Admin Types
 *
 * Shared type definitions for admin portal components.
 */

export type OnboardingSteps = {
  signupCompleted?: boolean;
  signupCompletedAt?: number;
  planSelected?: string;
  planSelectedAt?: number;
  paymentCompleted?: boolean;
  paymentCompletedAt?: number;
  projectCreated?: boolean;
  projectCreatedAt?: number;
  ga4Connected?: boolean;
  ga4ConnectedAt?: number;
  gscConnected?: boolean;
  gscConnectedAt?: number;
};

export type EngagementMilestones = {
  firstKeywordCreatedAt?: number;
  firstClusterCreatedAt?: number;
  firstBriefCreatedAt?: number;
  firstDraftCreatedAt?: number;
  firstContentPublishedAt?: number;
  totalKeywords?: number;
  totalClusters?: number;
  totalBriefs?: number;
  totalDrafts?: number;
  totalPublished?: number;
};

export type SubscriptionData = {
  status?: string;
  planTier?: string;
  priceMonthly?: number;
  billingCycle?: string;
  renewsAt?: number;
  graceStartedAt?: number;
  failedPaymentCount?: number;
  lastPaymentFailedAt?: number;
};

export type HealthData = {
  overall: number;
  tier: 'healthy' | 'at_risk' | 'critical';
  factors?: {
    payment: number;
    engagement: number;
    adoption: number;
    login: number;
  };
};

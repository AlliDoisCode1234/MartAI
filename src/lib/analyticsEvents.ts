/**
 * Analytics Event Tracking
 *
 * Event definitions for funnel analysis and feature usage.
 * Integrates with existing useTracking hook.
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

// Event categories
export const EVENT_CATEGORIES = {
  ONBOARDING: 'onboarding',
  PHASE: 'phase',
  FEATURE: 'feature',
  ERROR: 'error',
  ENGAGEMENT: 'engagement',
} as const;

// Standard events from LDD
export const ANALYTICS_EVENTS = {
  // Onboarding funnel
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  GSC_CONNECTED: 'gsc_connected',
  GA4_CONNECTED: 'ga4_connected',
  WORDPRESS_CONNECTED: 'wordpress_connected',
  PROJECT_CREATED: 'project_created',

  // Phase transitions
  PHASE_ENTERED: 'phase_entered',
  PHASE_COMPLETED: 'phase_completed',

  // Feature usage
  KEYWORDS_IMPORTED: 'keywords_imported',
  KEYWORDS_ADDED_MANUAL: 'keywords_added_manual',
  CLUSTERS_GENERATED: 'clusters_generated',
  BRIEF_CREATED: 'brief_created',
  BRIEF_COMPLETED: 'brief_completed',
  CONTENT_PUBLISHED: 'content_published',
  CALENDAR_ITEM_SCHEDULED: 'calendar_item_scheduled',

  // Engagement
  MART_GUIDE_VIEWED: 'mart_guide_viewed',
  MART_GUIDE_DISMISSED: 'mart_guide_dismissed',
  HELP_TOGGLE_ENABLED: 'help_toggle_enabled',
  HELP_TOGGLE_DISABLED: 'help_toggle_disabled',
  NEXT_STEP_CTA_CLICKED: 'next_step_cta_clicked',

  // Errors
  ERROR_DISPLAYED: 'error_displayed',
  ERROR_RETRY_CLICKED: 'error_retry_clicked',
  AI_TIMEOUT: 'ai_timeout',
  OAUTH_FAILED: 'oauth_failed',
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

// Event properties
export interface EventProperties {
  // Common
  timestamp?: number;
  sessionId?: string;
  userId?: string;
  projectId?: string;

  // Phase-specific
  phase?: number;
  previousPhase?: number;

  // Feature-specific
  featureName?: string;
  count?: number;
  source?: string;

  // Error-specific
  errorType?: string;
  errorMessage?: string;

  // Custom
  [key: string]: unknown;
}

/**
 * Track an analytics event
 * Wrapper around existing tracking system
 */
export function trackEvent(event: AnalyticsEvent, properties: EventProperties = {}): void {
  const enrichedProperties = {
    ...properties,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.pathname : '',
  };

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, enrichedProperties);
  }

  // This would call the actual tracking mutation
  // Example: trackEventMutation({ event, properties: enrichedProperties });
}

/**
 * Track phase transition
 */
export function trackPhaseTransition(
  newPhase: number,
  previousPhase: number,
  projectId?: string
): void {
  trackEvent(ANALYTICS_EVENTS.PHASE_ENTERED, {
    phase: newPhase,
    previousPhase,
    projectId,
  });

  if (previousPhase < newPhase) {
    trackEvent(ANALYTICS_EVENTS.PHASE_COMPLETED, {
      phase: previousPhase,
      projectId,
    });
  }
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(
  feature: string,
  action: 'created' | 'updated' | 'deleted' | 'viewed',
  count?: number
): void {
  trackEvent(`feature_${action}` as AnalyticsEvent, {
    featureName: feature,
    count,
  });
}

/**
 * Track error
 */
export function trackError(errorType: string, errorMessage?: string, didRetry = false): void {
  trackEvent(ANALYTICS_EVENTS.ERROR_DISPLAYED, {
    errorType,
    errorMessage,
  });

  if (didRetry) {
    trackEvent(ANALYTICS_EVENTS.ERROR_RETRY_CLICKED, {
      errorType,
    });
  }
}

/**
 * Funnel step tracking
 */
export const ONBOARDING_FUNNEL = [
  ANALYTICS_EVENTS.SIGNUP_STARTED,
  ANALYTICS_EVENTS.SIGNUP_COMPLETED,
  ANALYTICS_EVENTS.PROJECT_CREATED,
  ANALYTICS_EVENTS.GSC_CONNECTED,
  ANALYTICS_EVENTS.KEYWORDS_IMPORTED,
  ANALYTICS_EVENTS.CLUSTERS_GENERATED,
  ANALYTICS_EVENTS.BRIEF_CREATED,
  ANALYTICS_EVENTS.CONTENT_PUBLISHED,
] as const;

/**
 * Hook for component-level tracking
 */
export function useAnalytics() {
  return {
    trackEvent,
    trackPhaseTransition,
    trackFeatureUsage,
    trackError,
    events: ANALYTICS_EVENTS,
  };
}

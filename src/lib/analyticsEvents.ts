/**
 * Analytics Event Tracking
 *
 * Event definitions for funnel analysis and feature usage.
 * Integrates with existing useTracking hook.
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

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

  // Generic Feature actions
  FEATURE_CREATED: 'feature_created',
  FEATURE_UPDATED: 'feature_updated',
  FEATURE_DELETED: 'feature_deleted',
  FEATURE_VIEWED: 'feature_viewed',

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
  const trackMutation = useMutation(api.analytics.eventTracking.trackEvent);

  const trackEvent = (event: AnalyticsEvent, properties: EventProperties = {}): void => {
    const enrichedProperties = {
      ...properties,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.pathname : '',
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, enrichedProperties);
    }

    try {
      trackMutation({ 
        event: event, 
        properties: enrichedProperties as any,
        sessionId: properties.sessionId as string | undefined,
        url: enrichedProperties.url as string | undefined,
        referrer: properties.referrer as string | undefined,
        userAgent: properties.userAgent as string | undefined,
      }).catch(e => {
        console.warn('[Analytics] Failed to track event', e);
      });
    } catch (e) {
      console.warn('[Analytics] Failed to track event', e);
    }
  };

  const trackPhaseTransition = (
    newPhase: number,
    previousPhase: number,
    projectId?: string
  ): void => {
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
  };

  const trackFeatureUsage = (
    feature: string,
    action: 'created' | 'updated' | 'deleted' | 'viewed',
    count?: number
  ): void => {
    const eventMap: Record<string, AnalyticsEvent> = {
      created: ANALYTICS_EVENTS.FEATURE_CREATED,
      updated: ANALYTICS_EVENTS.FEATURE_UPDATED,
      deleted: ANALYTICS_EVENTS.FEATURE_DELETED,
      viewed: ANALYTICS_EVENTS.FEATURE_VIEWED,
    };
    
    trackEvent(eventMap[action], {
      featureName: feature,
      count,
    });
  };

  const trackError = (errorType: string, errorMessage?: string, didRetry = false): void => {
    trackEvent(ANALYTICS_EVENTS.ERROR_DISPLAYED, {
      errorType,
      errorMessage,
    });

    if (didRetry) {
      trackEvent(ANALYTICS_EVENTS.ERROR_RETRY_CLICKED, {
        errorType,
      });
    }
  };

  return {
    trackEvent,
    trackPhaseTransition,
    trackFeatureUsage,
    trackError,
    events: ANALYTICS_EVENTS,
  };
}

/**
 * Pure function for tracking events outside of React components.
 * Warning: Fire-and-forget. Does not use React Query/Mutation state.
 */
export async function trackEventPure(event: AnalyticsEvent, properties: EventProperties = {}): Promise<void> {
  const enrichedProperties = {
    ...properties,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.pathname : '',
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics Pure]', event, enrichedProperties);
  }

  try {
    // If not using convex React hooks, you can use a fetch call to an HTTP action or
    // rely on backend tracking. If the codebase has an api reference, we can use a direct convex client
    // if configured, but normally pure functions without convex hooks need the convex client instance.
    // For now, we will log it as a stub to avoid breaking non-React callers until convexClient is passed.
    console.warn('[Analytics Pure] Event captured, but Convex client not provided for pure function tracking.', event);
  } catch (e) {
    console.warn('[Analytics Pure] Failed to track event', e);
  }
}

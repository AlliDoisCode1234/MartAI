'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

// Generate a session ID that persists for the browser session
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('martai_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('martai_session_id', sessionId);
  }
  return sessionId;
}

// Get simplified user agent info
function getUserAgentSummary(): string {
  if (typeof window === 'undefined') return '';

  const ua = navigator.userAgent;
  const isMobile = /Mobile|Android|iPhone|iPad/.test(ua);
  const browser = /Chrome/.test(ua)
    ? 'Chrome'
    : /Firefox/.test(ua)
      ? 'Firefox'
      : /Safari/.test(ua)
        ? 'Safari'
        : /Edge/.test(ua)
          ? 'Edge'
          : 'Other';

  return `${isMobile ? 'Mobile' : 'Desktop'} - ${browser}`;
}

type TrackingEvent = {
  event: string;
  trackId?: string;
  properties?: Record<string, unknown>;
};

/**
 * Hook for tracking analytics events
 *
 * Features:
 * - Auto-tracks clicks on elements with data-track-id
 * - Debounces rapid clicks (300ms)
 * - Includes sessionId, url, referrer, userAgent
 *
 * Usage:
 * ```tsx
 * const { track, trackPageView } = useTracking();
 *
 * // Manual tracking
 * track('button_click', 'signup_cta', { source: 'homepage' });
 *
 * // Auto-tracking via data-track-id attribute
 * <Button data-track-id="signup_submit">Sign Up</Button>
 * ```
 */
export function useTracking() {
  const trackEventMutation = useMutation(api.analytics.events.trackEvent);
  const lastClickTime = useRef<number>(0);
  const lastTrackId = useRef<string | null>(null);

  const track = useCallback(
    (event: string, trackId?: string, properties?: Record<string, unknown>) => {
      if (typeof window === 'undefined') return;

      trackEventMutation({
        sessionId: getSessionId(),
        event,
        trackId,
        properties,
        url: window.location.pathname,
        referrer: document.referrer || undefined,
        userAgent: getUserAgentSummary(),
      }).catch((err) => {
        // Silent fail - don't break the app if tracking fails
        console.debug('[Analytics] Track failed:', err);
      });
    },
    [trackEventMutation]
  );

  const trackPageView = useCallback(
    (url?: string) => {
      track('page_view', undefined, { url: url || window.location.pathname });
    },
    [track]
  );

  // Auto-track clicks on data-track-id elements with debounce
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-track-id]');
      if (!target) return;

      const trackId = target.getAttribute('data-track-id');
      if (!trackId) return;

      // Debounce: ignore if same element clicked within 300ms
      const now = Date.now();
      if (trackId === lastTrackId.current && now - lastClickTime.current < 300) {
        return;
      }

      lastClickTime.current = now;
      lastTrackId.current = trackId;

      track('click', trackId);
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [track]);

  return { track, trackPageView };
}

/**
 * Predefined event names for consistency
 */
export const TrackingEvents = {
  // Auth funnel
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  LOGIN_STARTED: 'login_started',
  LOGIN_COMPLETED: 'login_completed',

  // Onboarding funnel
  ONBOARDING_STEP: 'onboarding_step',
  ONBOARDING_COMPLETED: 'onboarding_completed',

  // Feature usage
  KEYWORDS_GENERATED: 'keywords_generated',
  CLUSTERS_GENERATED: 'clusters_generated',
  PLAN_GENERATED: 'plan_generated',
  BRIEF_CREATED: 'brief_created',
  DRAFT_CREATED: 'draft_created',

  // Errors
  ERROR: 'error',
  API_ERROR: 'api_error',

  // Engagement
  PAGE_VIEW: 'page_view',
  CLICK: 'click',
} as const;

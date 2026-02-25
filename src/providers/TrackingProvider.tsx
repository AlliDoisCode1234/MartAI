'use client';

/**
 * TrackingProvider
 *
 * Component Hierarchy:
 * App → Layout → TrackingProvider (this file)
 *
 * Wrap your app with this to enable:
 * - Auto page view tracking on route changes
 * - Global click tracking via data-track-id
 *
 * Respects cookie consent: page views and click events are only
 * tracked if the user has consented to analytics cookies ('all').
 */

import { type ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTracking } from '@/lib/useTracking';
import { CONSENT_KEY } from '@/src/components/shared/CookieConsent';

type Props = {
  children: ReactNode;
};

export function TrackingProvider({ children }: Props) {
  const [hasConsent, setHasConsent] = useState(false);
  const { trackPageView } = useTracking({ enabled: hasConsent });
  const pathname = usePathname();

  // Check initial consent and listen for changes
  useEffect(() => {
    try {
      setHasConsent(localStorage.getItem(CONSENT_KEY) === 'all');
    } catch {
      setHasConsent(false);
    }

    const handleConsentChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setHasConsent(detail === 'all');
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    return () => window.removeEventListener('cookieConsentChanged', handleConsentChange);
  }, []);

  // Track page views on route change — only if consented
  useEffect(() => {
    if (pathname && hasConsent) {
      trackPageView(pathname);
    }
  }, [pathname, trackPageView, hasConsent]);

  return <>{children}</>;
}

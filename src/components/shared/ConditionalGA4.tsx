'use client';

/**
 * ConditionalGA4
 *
 * Component Hierarchy:
 * App → Layout → ConditionalGA4 (this file)
 *
 * Only renders the Google Analytics 4 script tags when the user
 * has explicitly consented to "all" cookies via the CookieConsent banner.
 * This ensures GDPR 2026 compliance by never firing tracking pixels
 * before obtaining explicit consent.
 */

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { CONSENT_KEY } from './CookieConsent';

interface Props {
  ga4Id: string;
}

export function ConditionalGA4({ ga4Id }: Props) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check initial consent state
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      setHasConsent(consent === 'all');
    } catch {
      // localStorage unavailable — do not load analytics
      setHasConsent(false);
    }

    // Listen for real-time consent changes from CookieConsent component
    const handleConsentChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setHasConsent(detail === 'all');
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    return () => window.removeEventListener('cookieConsentChanged', handleConsentChange);
  }, []);

  if (!hasConsent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga4Id}');
        `}
      </Script>
    </>
  );
}

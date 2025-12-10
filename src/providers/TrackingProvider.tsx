'use client';

import { type ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTracking } from '@/lib/useTracking';

type Props = {
  children: ReactNode;
};

/**
 * TrackingProvider
 *
 * Wrap your app with this to enable:
 * - Auto page view tracking on route changes
 * - Global click tracking via data-track-id
 */
export function TrackingProvider({ children }: Props) {
  const { trackPageView } = useTracking();
  const pathname = usePathname();

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname, trackPageView]);

  return <>{children}</>;
}

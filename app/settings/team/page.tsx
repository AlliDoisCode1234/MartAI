'use client';

/**
 * TeamSettingsRedirect
 *
 * Component Hierarchy:
 * App → Settings → TeamSettingsRedirect (this file)
 *
 * Legacy route redirect: /settings/team → /settings?tab=team
 * Preserves backwards compatibility for bookmarks, email links, and shared URLs.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeamSettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/settings?tab=team');
  }, [router]);
  return null;
}

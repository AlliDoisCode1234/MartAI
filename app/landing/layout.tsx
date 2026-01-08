'use client';

/**
 * Landing Page Layout
 *
 * Standalone layout for phoo.ai landing page.
 * Bypasses the main app Layout (no navbar, no sidebar).
 * Only includes essential providers for the waitlist form.
 */

import { type ReactNode } from 'react';

export default function LandingLayout({ children }: { children: ReactNode }) {
  // Minimal wrapper - no app shell, just the children
  // CSS is inherited from root layout via index.css import
  return <>{children}</>;
}

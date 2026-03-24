import type { Metadata } from 'next';
import HowItWorksPageClient from './HowItWorksPageClient';

/**
 * How It Works Page — Server Wrapper
 *
 * Component Hierarchy:
 * App → page.tsx (this file, server) → HowItWorksPageClient (client)
 *
 * Exports SEO metadata. Renders the client how-it-works page.
 * Layout file eliminated — metadata lives here per Next.js App Router convention.
 */

export const metadata: Metadata = {
  title: 'How Phoo Works - 3 Steps to Replace Your Marketing Agency',
  description:
    'Connect your site, let AI build your pipeline, and get predictable leads. See exactly how Phoo replaces your $2,500/mo marketing agency in three simple steps.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    title: 'How Phoo Works - 3 Steps to Predictable Leads',
    description:
      'Connect your site, let AI build your pipeline, and get leads. Replace your agency in 3 steps.',
  },
};

export default function HowItWorksPage() {
  return <HowItWorksPageClient />;
}

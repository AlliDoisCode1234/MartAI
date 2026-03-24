import type { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';

/**
 * About Page
 *
 * Component Hierarchy:
 * App → AboutPage (this file, server) → AboutPageClient (client)
 *
 * GEO-optimized about page.
 * NOTE: Organization schema is inherited from root layout's @graph.
 * Do NOT add a standalone Organization schema here — it would duplicate
 * the root layout's Organization and cause Google structured data errors.
 */

export const metadata: Metadata = {
  title: 'About Phoo.ai - AI-Powered SEO & GEO Platform',
  description:
    'Phoo.ai is the first SEO platform built for the AI era. We optimize your content for both traditional search and Google AI Overviews with Generative Engine Optimization (GEO).',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Phoo.ai - AI-Powered SEO & GEO Platform',
    description:
      'The first SEO platform built for AI search. Optimize for Google AI Overviews with GEO.',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}


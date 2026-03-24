import type { Metadata } from 'next';
import PricingPageClient from './PricingPageClient';

/**
 * Pricing Page — Server Wrapper
 *
 * Component Hierarchy:
 * App → page.tsx (this file, server) → PricingPageClient (client)
 *
 * Exports SEO metadata. Renders the client pricing page.
 * Layout file eliminated — metadata lives here per Next.js App Router convention.
 */

export const metadata: Metadata = {
  title: 'Phoo Pricing - Plans That Replace Your Marketing Agency',
  description:
    'Simple, transparent pricing starting at $164/mo. Get AI-powered SEO, content creation, and lead generation for less than a single freelancer.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Phoo Pricing - AI Marketing for Less Than a Freelancer',
    description:
      'Simple pricing starting at $164/mo. AI-powered SEO and lead generation for small businesses.',
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}

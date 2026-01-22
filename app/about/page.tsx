import Script from 'next/script';
import type { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';
import { getOrganizationSchema, schemaToJsonLd } from '@/src/lib/schemas';

/**
 * About Page
 *
 * Component Hierarchy:
 * App → AboutPage (this file, server) → AboutPageClient (client)
 *
 * GEO-optimized about page with Organization schema
 */

export const metadata: Metadata = {
  title: 'About Phoo.ai - AI-Powered SEO & GEO Platform',
  description:
    'Phoo.ai is the first SEO platform built for the AI era. We optimize your content for both traditional search and Google AI Overviews with Generative Engine Optimization (GEO).',
  openGraph: {
    title: 'About Phoo.ai - AI-Powered SEO & GEO Platform',
    description:
      'The first SEO platform built for AI search. Optimize for Google AI Overviews with GEO.',
    type: 'website',
  },
};

export default function AboutPage() {
  const organizationSchema = getOrganizationSchema();

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(organizationSchema) }}
      />
      <AboutPageClient />
    </>
  );
}

import { type ReactNode } from 'react';
import { ChakraProviderWrapper } from '@/src/providers/ChakraProvider';
import { SecurityProvider } from '@/src/providers/SecurityProvider';
import { ConvexProviderWrapper } from '@/src/providers/ConvexProvider';
import { GoogleAuthProvider } from '@/src/providers/GoogleAuthProvider';
import { Layout } from '@/src/components/Layout';
import { ErrorBoundary } from '@/src/components/shared/ErrorBoundary';
import { CookieConsent } from '@/src/components/shared/CookieConsent';
import { ConditionalGA4 } from '@/src/components/shared/ConditionalGA4';
import { TrackingProvider } from '@/src/providers/TrackingProvider';
import { Analytics } from '@vercel/analytics/next';
import '@/src/index.css';
import type { Metadata } from 'next';

// GA4 Measurement ID
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-8LBCMYNZ6R';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.phoo.ai'),
  title: 'Phoo - Get Found on Google and in AI Answers',
  description:
    'Phoo replaces your $2,500/mo marketing agency with an AI-powered lead generation system. Built for Google and the new AI search era.',
  // Canonical URL — prevents duplicate content indexing
  alternates: {
    canonical: '/',
  },
  // Open Graph — social sharing previews
  openGraph: {
    title: 'Phoo - Predictable Leads. No Agency Required.',
    description:
      'AI-powered SEO and lead generation for small businesses. Replace your agency, not your ambition.',
    siteName: 'Phoo',
    type: 'website',
    locale: 'en_US',
    url: 'https://www.phoo.ai',
  },
  // Twitter/X card
  twitter: {
    card: 'summary_large_image',
    title: 'Phoo - Predictable Leads. No Agency Required.',
    description:
      'AI-powered SEO and lead generation for small businesses. Replace your agency, not your ambition.',
  },
  // Security metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Additional hints
  other: {
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data — Organization + App + Breadcrumbs */}
        {/* NOTE: FAQPage schema removed from root @graph (March 2026).
            It was duplicating the pricing page's FAQPage, causing Google Search Console
            "Duplicate field FAQPage" critical error. FAQ schemas belong ONLY on pages
            that display FAQ content (e.g. /pricing/page.tsx). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://www.phoo.ai/#organization',
                  name: 'Phoo AI',
                  url: 'https://www.phoo.ai',
                  description: 'AI-powered SEO and lead generation platform for small businesses.',
                  foundingDate: '2025',
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://www.phoo.ai/#website',
                  url: 'https://www.phoo.ai',
                  name: 'Phoo',
                  publisher: { '@id': 'https://www.phoo.ai/#organization' },
                },
                {
                  '@type': 'SoftwareApplication',
                  '@id': 'https://www.phoo.ai/#application',
                  name: 'Phoo',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web',
                  url: 'https://www.phoo.ai',
                  description:
                    'AI-powered SEO and lead generation system that replaces your marketing agency.',
                  offers: {
                    '@type': 'Offer',
                    price: '164',
                    priceCurrency: 'USD',
                    priceValidUntil: '2027-01-01',
                    availability: 'https://schema.org/InStock',
                  },
                  publisher: { '@id': 'https://www.phoo.ai/#organization' },
                },
                // Breadcrumbs — gets breadcrumb trail in search results
                {
                  '@type': 'BreadcrumbList',
                  '@id': 'https://www.phoo.ai/#breadcrumbs',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Home',
                      item: 'https://www.phoo.ai',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'How It Works',
                      item: 'https://www.phoo.ai/how-it-works',
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: 'Product',
                      item: 'https://www.phoo.ai/product',
                    },
                    {
                      '@type': 'ListItem',
                      position: 4,
                      name: 'Pricing',
                      item: 'https://www.phoo.ai/pricing',
                    },
                    {
                      '@type': 'ListItem',
                      position: 5,
                      name: 'Resources',
                      item: 'https://www.phoo.ai/resources',
                    },
                    {
                      '@type': 'ListItem',
                      position: 6,
                      name: 'About',
                      item: 'https://www.phoo.ai/about',
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <ConvexProviderWrapper>
            <GoogleAuthProvider>
              <SecurityProvider>
                <ChakraProviderWrapper>
                  <TrackingProvider>
                    <Layout>{children}</Layout>
                    <CookieConsent />
                    <ConditionalGA4 ga4Id={GA4_ID} />
                    <Analytics />
                  </TrackingProvider>
                </ChakraProviderWrapper>
              </SecurityProvider>
            </GoogleAuthProvider>
          </ConvexProviderWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}

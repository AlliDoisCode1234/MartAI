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
import '@/src/index.css';
import type { Metadata } from 'next';

// GA4 Measurement ID
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-8LBCMYNZ6R';

export const metadata: Metadata = {
  metadataBase: new URL('https://phoo.ai'),
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
    url: 'https://phoo.ai',
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
        {/* JSON-LD Structured Data — Organization + App + FAQ + Breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://phoo.ai/#organization',
                  name: 'Phoo AI',
                  url: 'https://phoo.ai',
                  description: 'AI-powered SEO and lead generation platform for small businesses.',
                  foundingDate: '2025',
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://phoo.ai/#website',
                  url: 'https://phoo.ai',
                  name: 'Phoo',
                  publisher: { '@id': 'https://phoo.ai/#organization' },
                },
                {
                  '@type': 'SoftwareApplication',
                  '@id': 'https://phoo.ai/#application',
                  name: 'Phoo',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web',
                  url: 'https://phoo.ai',
                  description:
                    'AI-powered SEO and lead generation system that replaces your marketing agency.',
                  offers: {
                    '@type': 'Offer',
                    price: '164',
                    priceCurrency: 'USD',
                    priceValidUntil: '2027-01-01',
                    availability: 'https://schema.org/InStock',
                  },
                  publisher: { '@id': 'https://phoo.ai/#organization' },
                },
                // FAQ schema — triggers rich result dropdowns AND feeds AI citations
                {
                  '@type': 'FAQPage',
                  '@id': 'https://phoo.ai/#faq',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'What is Phoo?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Phoo is an AI-powered SEO and lead generation platform that replaces your marketing agency. It creates optimized content, tracks keywords, and publishes to your CMS — all for a fraction of agency costs.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'How much does Phoo cost compared to a marketing agency?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Phoo starts at $164/month compared to $2,500+/month for a typical marketing agency. You get AI content creation, keyword intelligence, analytics, CMS publishing, and GEO optimization in one platform.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'What is GEO optimization and why does it matter?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: '40% of searches are now answered directly by AI (Google AI Overviews, ChatGPT, Perplexity). GEO (Generative Engine Optimization) ensures your content gets cited by these AI systems, not just ranked in traditional search results.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'What CMS platforms does Phoo integrate with?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Phoo integrates with WordPress, Shopify, and Webflow for one-click publishing. Content is automatically formatted with SEO meta tags, schema markup, and responsive images.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'How does Phoo differ from other SEO tools?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Unlike standalone SEO tools, Phoo is an all-in-one platform that handles content creation, keyword research, analytics, publishing, AND GEO optimization. It replaces 5-6 separate tools and an agency.',
                      },
                    },
                  ],
                },
                // Breadcrumbs — gets breadcrumb trail in search results
                {
                  '@type': 'BreadcrumbList',
                  '@id': 'https://phoo.ai/#breadcrumbs',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Home',
                      item: 'https://phoo.ai',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Product',
                      item: 'https://phoo.ai/product',
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: 'Pricing',
                      item: 'https://phoo.ai/pricing',
                    },
                    {
                      '@type': 'ListItem',
                      position: 4,
                      name: 'How It Works',
                      item: 'https://phoo.ai/how-it-works',
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

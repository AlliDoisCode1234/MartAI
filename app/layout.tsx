import { type ReactNode } from 'react';
import Script from 'next/script';
import { ChakraProviderWrapper } from '@/src/providers/ChakraProvider';
import { SecurityProvider } from '@/src/providers/SecurityProvider';
import { ConvexProviderWrapper } from '@/src/providers/ConvexProvider';
import { GoogleAuthProvider } from '@/src/providers/GoogleAuthProvider';
import { Layout } from '@/src/components/Layout';
import { ErrorBoundary } from '@/src/components/shared/ErrorBoundary';
import { TrackingProvider } from '@/src/providers/TrackingProvider';
import '@/src/index.css';
import type { Metadata } from 'next';

// GA4 Measurement ID
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-8LBCMYNZ6R';

export const metadata: Metadata = {
  title: 'Phoo - AI-Powered SEO Automation',
  description: 'Automate your SEO. Accelerate your growth.',
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
  // Additional security hints
  other: {
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}');
          `}
        </Script>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
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

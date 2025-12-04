import { type ReactNode } from 'react';
import { ChakraProviderWrapper } from '@/src/providers/ChakraProvider';
import { SecurityProvider } from '@/src/providers/SecurityProvider';
import { ConvexProviderWrapper } from '@/src/providers/ConvexProvider';
import { Layout } from '@/src/components/Layout';
import { ErrorBoundary } from '@/src/components/shared/ErrorBoundary';
import '@/src/index.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MartAI - AI-Powered SEO Automation',
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
        <link rel="icon" href="/favicon.ico" />
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
            <SecurityProvider>
              <ChakraProviderWrapper>
                <Layout>{children}</Layout>
              </ChakraProviderWrapper>
            </SecurityProvider>
          </ConvexProviderWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}

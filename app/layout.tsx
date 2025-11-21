import { type ReactNode } from 'react';
import { ChakraProviderWrapper } from '@/src/components/ChakraProviderWrapper';
import { Layout } from '@/src/components/Layout';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import '@/src/index.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phoo - AI-Powered SEO Automation',
  description: 'Automate your SEO. Accelerate your growth.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <ChakraProviderWrapper>
            <Layout>
              {children}
            </Layout>
          </ChakraProviderWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}

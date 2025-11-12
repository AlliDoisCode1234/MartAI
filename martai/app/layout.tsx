import { type ReactNode } from 'react';
import { ChakraProviderWrapper } from '@/src/components/ChakraProviderWrapper';
import { Layout } from '@/src/components/Layout';
import '@/src/index.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ChakraProviderWrapper>
          <Layout>
            {children}
          </Layout>
        </ChakraProviderWrapper>
      </body>
    </html>
  );
}

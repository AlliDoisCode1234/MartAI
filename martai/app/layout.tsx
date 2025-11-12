import { type ReactNode } from 'react';
import { ChakraProviderWrapper } from '@/src/components/ChakraProviderWrapper';
import { Layout } from '@/src/components/Layout';
import '@/src/index.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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


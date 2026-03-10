import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Features | Phoo - AI-Powered SEO & Lead Generation',
  description:
    'Explore Phoo features: Content Studio, Keyword Intelligence, Analytics Dashboard, CMS Publishing, GEO Optimization, and Content Calendar. Everything you need to replace your marketing agency.',
  alternates: { canonical: '/features' },
  openGraph: {
    title: 'Phoo Features - AI-Powered Marketing Tools',
    description: 'Six powerful tools to replace your marketing agency. Explore them all.',
  },
};

export default function FeaturesLayout({ children }: { children: ReactNode }) {
  return children;
}

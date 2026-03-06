import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Solutions | Phoo - AI SEO for Every Business',
  description:
    'Phoo solutions for small businesses, marketing teams, agencies, and e-commerce. AI-powered SEO that replaces your marketing agency at a fraction of the cost.',
  alternates: { canonical: '/solutions' },
  openGraph: {
    title: 'Phoo Solutions - AI Marketing for Your Business',
    description:
      'AI-powered SEO solutions for small businesses, marketing teams, agencies, and e-commerce.',
  },
};

export default function SolutionsLayout({ children }: { children: ReactNode }) {
  return children;
}

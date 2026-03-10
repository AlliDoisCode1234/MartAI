import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phoo Pricing - Plans That Replace Your Marketing Agency',
  description:
    'Simple, transparent pricing starting at $164/mo. Get AI-powered SEO, content creation, and lead generation for less than a single freelancer.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Phoo Pricing - AI Marketing for Less Than a Freelancer',
    description:
      'Simple pricing starting at $164/mo. AI-powered SEO and lead generation for small businesses.',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

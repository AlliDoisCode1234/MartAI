import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Phoo Works - 3 Steps to Replace Your Marketing Agency',
  description:
    'Connect your site, let AI build your pipeline, and get predictable leads. See exactly how Phoo replaces your $2,500/mo marketing agency in three simple steps.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    title: 'How Phoo Works - 3 Steps to Predictable Leads',
    description:
      'Connect your site, let AI build your pipeline, and get leads. Replace your agency in 3 steps.',
  },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

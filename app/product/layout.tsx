import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phoo Product - The All-In-One AI Marketing Platform',
  description:
    'Six powerful tools in one platform: AI Content Studio, Keyword Intelligence, PR Score, Analytics Dashboard, CMS Publishing, and GEO Optimization. See how Phoo compares to agencies and DIY.',
  alternates: { canonical: '/product' },
  openGraph: {
    title: 'Phoo Product - AI Marketing Platform for Small Business',
    description:
      'See all 6 features and how Phoo compares to hiring an agency or doing it yourself.',
  },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

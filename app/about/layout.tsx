import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Phoo - The AI-Powered Marketing Agency Replacement',
  description:
    'Built by marketers who saw the future of search changing. Phoo was born from one question: what if AI could do what agencies do, but better, faster, and for a fraction of the cost?',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Phoo - Born to Replace Marketing Agencies',
    description: 'The story behind the AI marketing platform that replaces your $2,500/mo agency.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

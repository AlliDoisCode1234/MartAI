import type { Metadata } from 'next';

/**
 * Phoo.ai Landing Page
 *
 * Component Hierarchy:
 * └── app/landing/page.tsx (this file)
 *     ├── HeroSection
 *     ├── ProblemSection
 *     ├── FeaturesSection
 *     ├── AudienceSection
 *     ├── BetaSection
 *     ├── WaitlistForm
 *     └── Footer
 *
 * Public landing page for phoo.ai domain with beta signup.
 * Accessible at phoo.ai/ (root) via middleware routing.
 */

import {
  HeroSection,
  ProblemSection,
  FeaturesSection,
  AudienceSection,
  BetaSection,
  WaitlistForm,
} from '@/src/components/landing';

export const metadata: Metadata = {
  title: 'Phoo AI - Automated SEO for Local Businesses',
  description:
    'Turn your website into a steady source of leads. Phoo helps purpose-driven local businesses grow traffic, leads, and revenue with automated SEO.',
  openGraph: {
    title: 'Phoo AI - Automated SEO for Local Businesses',
    description:
      'Turn your website into a steady source of leads. Automated SEO that actually works.',
    url: 'https://phoo.ai',
    siteName: 'Phoo AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phoo AI - Automated SEO for Local Businesses',
    description: 'Turn your website into a steady source of leads.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <AudienceSection />
      <BetaSection />
      <WaitlistForm />

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Phoo AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

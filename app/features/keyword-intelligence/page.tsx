'use client';

/**
 * Keyword Intelligence Feature Page
 *
 * Component Hierarchy:
 * App -> FeaturePageTemplate (Keyword Intelligence)
 */

import { FeaturePageTemplate } from '@/src/components/marketing';
import { FiSearch, FiTrendingUp, FiZap, FiDatabase, FiTarget, FiLayers } from 'react-icons/fi';

export default function KeywordIntelligencePage() {
  return (
    <FeaturePageTemplate
      badge="Keyword Intelligence"
      badgeIcon={FiSearch}
      headline="Find Keywords That"
      headlineHighlight="Actually Convert"
      description="Stop guessing which keywords to target. Phoo identifies high-value opportunities based on your real Google Search Console data, not hypothetical estimates."
      screenshotSrc="/images/feature-keyword-research.png"
      screenshotAlt="Phoo Keyword Intelligence with difficulty scoring and quick wins"
      benefits={[
        'Quick-win keyword discovery from real GSC data',
        'AI-powered difficulty scoring with competitive analysis',
        'Search intent classification (informational, commercial, transactional)',
        'Keyword cluster management for topical authority',
        'Revenue potential scoring for business impact',
        'Real-time rank tracking with change alerts',
      ]}
      differentiators={[
        {
          icon: FiDatabase,
          title: 'Real Data, Not Estimates',
          description:
            'While others guess, Phoo pulls directly from your Google Search Console. Your keyword strategy is built on actual performance data.',
        },
        {
          icon: FiZap,
          title: 'Quick-Win Detection',
          description:
            'Our algorithm identifies keywords where you are close to page one. These are the fastest path to traffic growth with minimal effort.',
        },
        {
          icon: FiLayers,
          title: 'Smart Clustering',
          description:
            'Automatically group related keywords into topic clusters. Build topical authority that Google rewards with higher rankings across entire categories.',
        },
      ]}
      ctaHeadline="Ready to find your best keywords?"
      ctaDescription="Stop guessing. Start ranking. Let Phoo show you the keywords that will drive real results."
      benefitsSectionTitle="Data-driven keyword"
      benefitsSectionHighlight="discovery"
      benefitsSectionSubtitle="Real insights from your Google Search Console — not hypothetical estimates."
      differentiatorsSectionTitle="What sets our research"
      differentiatorsSectionHighlight="apart"
    />
  );
}

'use client';

/**
 * Analytics Dashboard Feature Page
 *
 * Component Hierarchy:
 * App -> FeaturePageTemplate (Analytics Dashboard)
 */

import { FeaturePageTemplate } from '@/src/components/marketing';
import { FiBarChart2, FiTrendingUp, FiActivity, FiPieChart, FiAward, FiEye } from 'react-icons/fi';

export default function AnalyticsDashboardPage() {
  return (
    <FeaturePageTemplate
      badge="Analytics Dashboard"
      badgeIcon={FiBarChart2}
      headline="Track Rankings, Traffic &"
      headlineHighlight="Real Growth"
      description="Your executive briefing for SEO performance. See your Phoo Rating, content journey funnel, keyword movements, and business impact — all in one dashboard."
      screenshotSrc="/images/feature-analytics.png"
      screenshotAlt="Phoo Analytics Dashboard with Phoo Rating and growth charts"
      benefits={[
        'Phoo Rating — your unified visibility score across SEO + GEO',
        'Cumulative growth tracking since day one',
        'Content journey funnel from awareness to conversion',
        'Top performing content with real traffic data',
        'Fastest growth opportunities identified automatically',
        'AI Intelligence Brief with plain-English insights',
      ]}
      differentiators={[
        {
          icon: FiAward,
          title: 'Phoo Rating',
          description:
            'One number that tells you everything. Your Phoo Rating combines SEO health, content quality, and GEO readiness into a single, actionable score.',
        },
        {
          icon: FiTrendingUp,
          title: 'Growth Tracking',
          description:
            'See your cumulative progress since joining Phoo. Track total clicks, keywords ranking, and content published — the metrics that matter.',
        },
        {
          icon: FiActivity,
          title: 'Business Impact',
          description:
            'Not just vanity metrics. See estimated monthly visitors, lead projections, and revenue potential based on your actual keyword positions.',
        },
      ]}
      ctaHeadline="Ready to see your real SEO performance?"
      ctaDescription="Stop flying blind. Get the metrics that actually matter for your business growth."
      benefitsSectionTitle="Metrics that"
      benefitsSectionHighlight="actually matter"
      benefitsSectionSubtitle="No vanity numbers. Every metric ties directly to your business outcomes."
      differentiatorsSectionTitle="Beyond basic"
      differentiatorsSectionHighlight="analytics"
    />
  );
}

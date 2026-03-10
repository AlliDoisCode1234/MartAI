'use client';

/**
 * Small Business Solution Page
 *
 * Component Hierarchy:
 * App -> SolutionPageTemplate (Small Business)
 */

import { SolutionPageTemplate } from '@/src/components/marketing';
import {
  FiDollarSign,
  FiClock,
  FiHelpCircle,
  FiEdit3,
  FiSearch,
  FiBarChart2,
  FiGlobe,
  FiCalendar,
  FiZap,
} from 'react-icons/fi';

export default function SmallBusinessPage() {
  return (
    <SolutionPageTemplate
      persona="Small Business Owners"
      headline="Replace Your $2,500/mo Agency with"
      headlineHighlight="AI That Works 24/7"
      description="You started your business to do what you love, not to become an SEO expert. Phoo handles your content marketing so you can focus on running your business."
      painPoints={[
        {
          icon: FiDollarSign,
          problem: 'Paying $2,500+/mo for an agency that delivers 2 articles',
          solution: 'Unlimited AI-generated content for a fraction of the cost',
        },
        {
          icon: FiClock,
          problem: 'Spending hours learning SEO instead of serving customers',
          solution: 'AI handles the technical stuff — you just approve and publish',
        },
        {
          icon: FiHelpCircle,
          problem: 'No way to know if your SEO is actually working',
          solution: 'Clear dashboard showing real traffic, rankings, and leads',
        },
      ]}
      features={[
        {
          icon: FiEdit3,
          title: 'AI Content Studio',
          description:
            'Generate blog posts, service pages, and local SEO content optimized for your industry.',
        },
        {
          icon: FiSearch,
          title: 'Keyword Discovery',
          description:
            'Find the exact terms your customers are searching for — powered by your real Google data.',
        },
        {
          icon: FiBarChart2,
          title: 'Simple Dashboard',
          description:
            'See your growth at a glance. No jargon, no complexity — just metrics that matter.',
        },
        {
          icon: FiGlobe,
          title: 'One-Click Publishing',
          description:
            'Publish directly to your website. WordPress, Shopify, or Webflow — we support them all.',
        },
        {
          icon: FiCalendar,
          title: 'Content Calendar',
          description:
            'Never wonder what to write next. AI builds your content strategy automatically.',
        },
        {
          icon: FiZap,
          title: 'GEO Optimization',
          description: 'Get cited by ChatGPT and Google AI. The future of search starts here.',
        },
      ]}
      roiStats={[
        { value: '10x', label: 'Faster Content Creation' },
        { value: '$2,200+', label: 'Monthly Savings vs. Agency' },
        { value: '85%', label: 'Less Time on Marketing' },
        { value: '3x', label: 'More Organic Traffic' },
      ]}
      ctaHeadline="Ready to fire your agency?"
      ctaDescription="Join hundreds of small businesses growing with AI-powered content marketing."
      painPointsSectionTitle="Escape the"
      painPointsSectionHighlight="agency trap"
      painPointsSectionSubtitle="You deserve better than overpriced agencies and cookie-cutter SEO."
      featuresSectionTitle="Your SEO on"
      featuresSectionHighlight="autopilot"
      roiSectionTitle="Save money,"
      roiSectionHighlight="grow faster"
    />
  );
}

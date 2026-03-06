'use client';

/**
 * Marketing Teams Solution Page
 *
 * Component Hierarchy:
 * App -> SolutionPageTemplate (Marketing Teams)
 */

import { SolutionPageTemplate } from '@/src/components/marketing';
import {
  FiUsers,
  FiClock,
  FiTrendingDown,
  FiEdit3,
  FiTarget,
  FiBarChart2,
  FiLayers,
  FiCheckCircle,
  FiZap,
} from 'react-icons/fi';

export default function MarketingTeamsPage() {
  return (
    <SolutionPageTemplate
      persona="Marketing Teams"
      headline="Scale Content Production"
      headlineHighlight="10x Without More Headcount"
      description="Your team is stretched thin. Between strategy meetings, campaign management, and reporting, content creation always falls behind. Phoo changes that."
      painPoints={[
        {
          icon: FiClock,
          problem: 'Content bottleneck — writers cannot keep up with demand',
          solution: 'AI generates first drafts in minutes, your team refines and approves',
        },
        {
          icon: FiTrendingDown,
          problem: 'Inconsistent brand voice across team members and channels',
          solution: 'AI trained on your brand guidelines for consistent voice every time',
        },
        {
          icon: FiUsers,
          problem: 'No visibility into content ROI and performance metrics',
          solution: 'Real-time analytics dashboard with content attribution',
        },
      ]}
      features={[
        {
          icon: FiEdit3,
          title: 'Team Content Studio',
          description:
            'Multiple team members create, edit, and approve content with role-based access.',
        },
        {
          icon: FiTarget,
          title: 'Brand Voice Training',
          description:
            'Configure your brand tone, audience, and style guidelines. AI adapts to match perfectly.',
        },
        {
          icon: FiBarChart2,
          title: 'Performance Analytics',
          description:
            'Track content ROI with attribution. See which pieces drive traffic, leads, and conversions.',
        },
        {
          icon: FiLayers,
          title: 'Content Clusters',
          description:
            'Build topical authority with AI-planned content clusters around your key themes.',
        },
        {
          icon: FiCheckCircle,
          title: 'Approval Workflows',
          description:
            'Draft, review, revise, approve — streamlined workflow for team collaboration.',
        },
        {
          icon: FiZap,
          title: 'SEO + GEO Scoring',
          description: 'Every piece is scored for both traditional SEO and AI citation readiness.',
        },
      ]}
      roiStats={[
        { value: '10x', label: 'Content Output' },
        { value: '65%', label: 'Less Time Per Piece' },
        { value: '40%', label: 'More Organic Traffic' },
        { value: '100%', label: 'Brand Consistency' },
      ]}
      ctaHeadline="Ready to supercharge your team?"
      ctaDescription="Give your marketing team the AI-powered edge they have been asking for."
      painPointsSectionTitle="Break through"
      painPointsSectionHighlight="the content bottleneck"
      painPointsSectionSubtitle="Your team has the strategy. Phoo gives them the production power to execute."
      featuresSectionTitle="Tools for"
      featuresSectionHighlight="a 10x content engine"
      roiSectionTitle="Productivity gains"
      roiSectionHighlight="your CMO will love"
    />
  );
}

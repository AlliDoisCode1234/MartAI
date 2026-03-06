'use client';

/**
 * Agencies Solution Page
 *
 * Component Hierarchy:
 * App -> SolutionPageTemplate (Agencies)
 */

import { SolutionPageTemplate } from '@/src/components/marketing';
import {
  FiUsers,
  FiClock,
  FiDollarSign,
  FiEdit3,
  FiBarChart2,
  FiLayers,
  FiGlobe,
  FiShield,
  FiZap,
} from 'react-icons/fi';

export default function AgenciesPage() {
  return (
    <SolutionPageTemplate
      persona="Agencies"
      headline="White-Label AI Content for"
      headlineHighlight="Every Client"
      description="Deliver more content, to more clients, with higher margins. Phoo gives your agency the production capacity of a team 10x your size."
      painPoints={[
        {
          icon: FiDollarSign,
          problem: 'Thin margins — freelance writer costs eat into profits',
          solution: 'AI-generated first drafts cut production costs by 70%',
        },
        {
          icon: FiClock,
          problem: 'Cannot scale beyond current client load without hiring',
          solution: 'Handle 5x more clients with the same team size',
        },
        {
          icon: FiUsers,
          problem: 'Different brand voices and strategies per client is unmanageable',
          solution: 'Per-client brand profiles with isolated content strategies',
        },
      ]}
      features={[
        {
          icon: FiLayers,
          title: 'Multi-Client Management',
          description:
            'Separate projects, brand voices, and keyword strategies per client. Switch context in one click.',
        },
        {
          icon: FiEdit3,
          title: 'Bulk Content Creation',
          description: 'Generate entire content calendars for clients in minutes, not days.',
        },
        {
          icon: FiBarChart2,
          title: 'Client Reporting',
          description:
            'White-label analytics dashboards your clients can access. Show the value you deliver.',
        },
        {
          icon: FiGlobe,
          title: 'Multi-CMS Publishing',
          description:
            "Publish to each client's WordPress, Shopify, or Webflow site with one click.",
        },
        {
          icon: FiShield,
          title: 'Team Permissions',
          description:
            'Role-based access so your account managers can handle their clients independently.',
        },
        {
          icon: FiZap,
          title: 'SEO + GEO Edge',
          description: 'Offer cutting-edge GEO optimization that competitors cannot match.',
        },
      ]}
      roiStats={[
        { value: '5x', label: 'More Clients Per Team' },
        { value: '70%', label: 'Lower Production Costs' },
        { value: '3x', label: 'Higher Margins' },
        { value: '24/7', label: 'AI Production Capacity' },
      ]}
      ctaHeadline="Ready to scale your agency?"
      ctaDescription="Join forward-thinking agencies delivering more results with less overhead."
      painPointsSectionTitle="Escape"
      painPointsSectionHighlight="the margin squeeze"
      painPointsSectionSubtitle="Freelancer costs and client churn are eating your profits. There is a better way."
      featuresSectionTitle="Scale without"
      featuresSectionHighlight="hiring"
      roiSectionTitle="Client results"
      roiSectionHighlight="that speak volumes"
    />
  );
}

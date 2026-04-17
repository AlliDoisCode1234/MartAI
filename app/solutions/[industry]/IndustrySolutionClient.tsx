'use client';

import { INDUSTRY_TEMPLATES, IndustryId } from '@/convex/phoo/industryTemplates';
import { notFound } from 'next/navigation';
import { SolutionPageTemplate } from '@/src/components/marketing';
import {
  FiTarget,
  FiTrendingUp,
  FiLayout,
  FiSettings,
  FiActivity,
  FiFileText,
  FiStar,
  FiTrendingDown,
  FiHash,
} from 'react-icons/fi';
import { type IconType } from 'react-icons';

interface Props {
  industryId: IndustryId;
}

const FEATURE_ICONS: IconType[] = [
  FiLayout,
  FiTrendingUp,
  FiFileText,
  FiActivity,
  FiStar,
  FiSettings,
];

export default function IndustrySolutionClient({ industryId }: Props) {
  const template = INDUSTRY_TEMPLATES[industryId];

  if (!template) {
    return notFound();
  }

  // We assign a dynamic icon to each returned content plan item
  const mappedFeatures = template.contentPlan.slice(0, 6).map((plan, i) => {
    // Generate an attractive title translation from the bare taxonomy
    const titleMap: Record<string, string> = {
      homepage: 'High-Converting Landing Pages',
      blog: 'SEO-Optimized Articles',
      service: 'Specialized Service Pages',
      about: 'Brand Authority Pages',
      leadMagnet: 'Lead Generation Assets',
      blogVersus: 'Competitive Comparison Funnels',
      blogVideo: 'Multimedia Content Expansion',
    };

    return {
      icon: FEATURE_ICONS[i % FEATURE_ICONS.length],
      title: titleMap[plan.contentType] || 'Strategic Content Matrix',
      description: `We'll write: "${plan.titleTemplate
        .replace(/\{\{companyName\}\}/g, 'Your Brand')
        .replace(/\{\{location\}\}/g, 'Your City')
        .replace(/\{\{founderName\}\}/g, 'You')}"`,
    };
  });

  return (
    <SolutionPageTemplate
      persona={template.name}
      headline="The Autonomous SEO Agent for"
      headlineHighlight={template.name}
      description={`Stop guessing. Start ranking. Auto-generate the perfect content plan targeting high-value keywords like "${
        template.keywords[0] || 'your niche'
      }".`}
      painPoints={[
        {
          icon: FiTrendingDown,
          problem: `Ranking for ${template.name} keywords is getting harder and highly expensive to outsource.`,
          solution:
            'Automated content intelligence builds perfect content plans based on real search volume.',
        },
        {
          icon: FiHash,
          problem:
            'You know you need content, but you do not know exactly what to write about.',
          solution:
            'Phoo handles the keyword research and topic clustering completely on auto-pilot.',
        },
        {
          icon: FiTarget,
          problem: 'Traffic without conversions wastes your entire marketing budget.',
          solution: 'Generate high-intent service and lead-magnet pages that convert visitors into clients.',
        }
      ]}
      features={mappedFeatures}
      roiStats={[
        { value: '3x', label: 'Faster Content Output' },
        { value: '70%', label: 'Lower Production Costs' },
        { value: '24/7', label: 'AI Production Capacity' },
        { value: '15+', label: 'Industry Templates' },
      ]}
      ctaHeadline={`Ready to dominate the ${template.name} market?`}
      ctaDescription={`Join forward-thinking businesses delivering more ${template.name} results with less overhead.`}
      painPointsSectionTitle="Escape"
      painPointsSectionHighlight="the content plateau"
      painPointsSectionSubtitle="Freelancer costs and writer's block are eating your margins. There is a better way."
      featuresSectionTitle="Your personalized"
      featuresSectionHighlight="content roadmap"
      roiSectionTitle="Organic traffic"
      roiSectionHighlight="that drives revenue"
      customCtaHref={`/join?industry=${industryId}`}
    />
  );
}

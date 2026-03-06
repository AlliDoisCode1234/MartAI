'use client';

/**
 * GEO Optimization Feature Page
 *
 * Component Hierarchy:
 * App -> FeaturePageTemplate (GEO Optimization)
 */

import { FeaturePageTemplate } from '@/src/components/marketing';
import { FiZap, FiMessageSquare, FiAward, FiBookOpen, FiGlobe, FiTrendingUp } from 'react-icons/fi';

export default function GeoOptimizationPage() {
  return (
    <FeaturePageTemplate
      badge="GEO Optimization"
      badgeIcon={FiZap}
      headline="Get Cited by ChatGPT &"
      headlineHighlight="AI Search"
      description="Google's AI now answers 40% of searches directly. Traditional SEO gets you ranked. Phoo's GEO optimization gets you cited in AI-generated answers."
      screenshotSrc="/images/feature-analytics.png"
      screenshotAlt="Phoo GEO optimization showing AI citation readiness"
      benefits={[
        'GEO readiness scoring for every piece of content',
        'E-E-A-T signal optimization (Experience, Expertise, Authority, Trust)',
        'Answer-first content structure for AI citation',
        'Semantic authority building across topic clusters',
        'Structured data and schema markup automation',
        'Competitive GEO analysis — see who AI is citing today',
      ]}
      differentiators={[
        {
          icon: FiMessageSquare,
          title: 'Cited, Not Just Ranked',
          description:
            'SEO gets you on page one. GEO gets your content cited by ChatGPT, Google AI Overviews, and Perplexity. Phoo optimizes for both simultaneously.',
        },
        {
          icon: FiAward,
          title: 'E-E-A-T Scoring',
          description:
            'Our AI analyzes your content for the trust signals that matter: author expertise, data citations, primary sources, and topical depth.',
        },
        {
          icon: FiBookOpen,
          title: 'Answer-First Structure',
          description:
            'Phoo restructures your content so AI can easily extract and cite your expertise. Concise answers, supporting evidence, and clear conclusions.',
        },
      ]}
      ctaHeadline="Ready to be cited by AI?"
      ctaDescription="The future of search is AI-generated answers. Make sure your business is the one being cited."
      benefitsSectionTitle="Optimized for the"
      benefitsSectionHighlight="AI era"
      benefitsSectionSubtitle="Content structured so AI language models cite and recommend your business."
      differentiatorsSectionTitle="The GEO"
      differentiatorsSectionHighlight="advantage"
    />
  );
}

'use client';

/**
 * Content Studio Feature Page
 *
 * Component Hierarchy:
 * App -> FeaturePageTemplate (Content Studio)
 */

import { FeaturePageTemplate } from '@/src/components/marketing';
import { FiEdit3, FiTarget, FiCpu, FiCheckCircle, FiLayers, FiZap } from 'react-icons/fi';

export default function ContentStudioPage() {
  return (
    <FeaturePageTemplate
      badge="Content Studio"
      badgeIcon={FiEdit3}
      headline="Create SEO-Optimized Content"
      headlineHighlight="in Minutes"
      description="Our AI Content Studio writes high-quality, SEO-optimized articles tailored to your business. Each piece is scored in real-time so you know exactly how it will perform."
      screenshotSrc="/images/feature-content-studio.png"
      screenshotAlt="Phoo Content Studio showing real-time SEO scoring"
      benefits={[
        'AI-generated articles with real-time SEO scoring',
        '17 content types from blog posts to product descriptions',
        'Built-in keyword optimization and density tracking',
        'Brand voice customization for consistent tone',
        'One-click publish to WordPress, Shopify, and Webflow',
        'Content calendar with scheduling automation',
      ]}
      differentiators={[
        {
          icon: FiCpu,
          title: 'AI-Powered Writing',
          description:
            'Our multi-model AI engine crafts content that reads naturally while hitting every SEO signal. No robotic text, no keyword stuffing.',
        },
        {
          icon: FiTarget,
          title: 'Real-Time SEO Scoring',
          description:
            'Watch your SEO score update live as you write. Hit target keywords, optimize headings, and nail your meta descriptions before publishing.',
        },
        {
          icon: FiCheckCircle,
          title: 'Publish Anywhere',
          description:
            'One-click publishing to WordPress, Shopify, and Webflow. Your formatting, images, and meta tags are preserved perfectly.',
        },
      ]}
      ctaHeadline="Ready to create content that ranks?"
      ctaDescription="Join hundreds of businesses creating SEO-optimized content at 10x the speed."
      benefitsSectionTitle="Your AI-powered"
      benefitsSectionHighlight="writing studio"
      benefitsSectionSubtitle="From first draft to published — everything happens in one place."
      differentiatorsSectionTitle="Why writers"
      differentiatorsSectionHighlight="love this"
    />
  );
}

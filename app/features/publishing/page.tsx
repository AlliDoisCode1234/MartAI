'use client';

/**
 * CMS Publishing Feature Page
 *
 * Component Hierarchy:
 * App -> FeaturePageTemplate (CMS Publishing)
 */

import { FeaturePageTemplate } from '@/src/components/marketing';
import { FiGlobe, FiUploadCloud, FiLayout, FiClock, FiShield, FiCode } from 'react-icons/fi';

export default function PublishingPage() {
  return (
    <FeaturePageTemplate
      badge="CMS Publishing"
      badgeIcon={FiGlobe}
      headline="One-Click Publish to"
      headlineHighlight="Any Platform"
      description="Publish directly to WordPress, Shopify, and Webflow with a single click. Your formatting, images, and SEO metadata are preserved perfectly every time."
      screenshotSrc="/images/feature-content-studio.png"
      screenshotAlt="Phoo one-click publishing to WordPress and Shopify"
      benefits={[
        'One-click publish to WordPress, Shopify, and Webflow',
        'Perfect formatting preservation — headings, images, and lists',
        'SEO meta tags and alt text automatically applied',
        'Schedule future publish dates with content calendar',
        'Draft, review, and approve workflow before publishing',
        'Secure OAuth connection — no passwords stored',
      ]}
      differentiators={[
        {
          icon: FiUploadCloud,
          title: 'True One-Click',
          description:
            'No copy-pasting. No format fixing. Write in Phoo, click publish, and your content goes live on your CMS exactly as you designed it.',
        },
        {
          icon: FiLayout,
          title: 'Format Fidelity',
          description:
            'Headings, bullet points, images, internal links, and meta descriptions — everything transfers perfectly. What you see is what you get.',
        },
        {
          icon: FiShield,
          title: 'Secure Connections',
          description:
            'Industry-standard OAuth2 for WordPress and API keys for Shopify. Your credentials are encrypted and never stored in plain text.',
        },
      ]}
      ctaHeadline="Ready to publish smarter?"
      ctaDescription="Stop wasting time on manual formatting. Publish once, publish perfectly."
      benefitsSectionTitle="Publish everywhere,"
      benefitsSectionHighlight="manage nowhere"
      benefitsSectionSubtitle="Your content goes live on your platform of choice with one click."
      differentiatorsSectionTitle="Why this beats"
      differentiatorsSectionHighlight="copy-paste"
    />
  );
}

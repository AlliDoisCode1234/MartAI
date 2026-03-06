'use client';

/**
 * Content Calendar Feature Page
 *
 * Component Hierarchy:
 * App -> FeaturePageTemplate (Content Calendar)
 */

import { FeaturePageTemplate } from '@/src/components/marketing';
import { FiCalendar, FiClock, FiLayers, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';

export default function ContentCalendarPage() {
  return (
    <FeaturePageTemplate
      badge="Content Calendar"
      badgeIcon={FiCalendar}
      headline="Plan and Schedule Your"
      headlineHighlight="Content Strategy"
      description="Visualize your entire content pipeline on a monthly calendar. Drag, drop, schedule, and automate — so you never miss a publishing opportunity."
      screenshotSrc="/images/feature-content-studio.png"
      screenshotAlt="Phoo Content Calendar with monthly planning view"
      benefits={[
        'Monthly calendar view with drag-and-drop scheduling',
        'AI-generated content strategy based on your keywords',
        'Priority scoring for maximum SEO impact',
        'Content pipeline visualization from draft to published',
        'Auto-scheduling based on optimal publish times',
        'Integration with content studio for seamless creation',
      ]}
      differentiators={[
        {
          icon: FiZap,
          title: 'AI Strategy Generation',
          description:
            'Phoo analyzes your keyword data and builds a publishing schedule automatically. No more staring at a blank calendar wondering what to write next.',
        },
        {
          icon: FiTarget,
          title: 'Priority-Based Planning',
          description:
            'Every content piece is scored by potential impact. Focus on the articles that will drive the most traffic and leads first.',
        },
        {
          icon: FiClock,
          title: 'Automated Scheduling',
          description:
            'Set it and forget it. Phoo schedules your content for optimal times and can auto-publish to your CMS when the date arrives.',
        },
      ]}
      ctaHeadline="Ready to plan smarter?"
      ctaDescription="Stop scrambling for content ideas. Let AI build your editorial calendar."
      benefitsSectionTitle="Your content roadmap,"
      benefitsSectionHighlight="automated"
      benefitsSectionSubtitle="AI analyzes your keywords and builds a publishing schedule that maximizes impact."
      differentiatorsSectionTitle="Smarter than a"
      differentiatorsSectionHighlight="spreadsheet"
    />
  );
}

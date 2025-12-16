/**
 * Content Templates Configuration
 *
 * Template types and structures for content creation.
 */

import { FiFileText, FiBookOpen, FiHelpCircle, FiList, FiColumns, FiHash } from 'react-icons/fi';
import type { IconType } from 'react-icons';

export type ContentTemplate = {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  color: string;
  structure: string[];
  useCase: string;
};

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Standard blog article with intro, body, and conclusion',
    icon: FiFileText,
    color: 'blue',
    structure: ['Introduction', 'Key Points (H2s)', 'Supporting Details', 'Conclusion', 'CTA'],
    useCase: 'General SEO content',
  },
  {
    id: 'pillar-page',
    name: 'Pillar Page',
    description: 'Comprehensive guide covering a topic in depth',
    icon: FiBookOpen,
    color: 'purple',
    structure: [
      'Overview',
      'Chapter 1',
      'Chapter 2',
      'Chapter 3',
      'Deep Dive Sections',
      'Resources',
      'CTA',
    ],
    useCase: 'Authority building',
  },
  {
    id: 'faq',
    name: 'FAQ Article',
    description: 'Question and answer format for featured snippets',
    icon: FiHelpCircle,
    color: 'green',
    structure: [
      'Introduction',
      'FAQ Block 1',
      'FAQ Block 2',
      'FAQ Block 3',
      'Related Questions',
      'Conclusion',
    ],
    useCase: 'Featured snippets',
  },
  {
    id: 'how-to',
    name: 'How-To Guide',
    description: 'Step-by-step instructions for procedural content',
    icon: FiList,
    color: 'orange',
    structure: [
      "What You'll Learn",
      'Prerequisites',
      'Step 1',
      'Step 2',
      'Step 3',
      'Tips & Tricks',
      'Summary',
    ],
    useCase: 'Procedural content',
  },
  {
    id: 'comparison',
    name: 'Comparison',
    description: 'Side-by-side comparison with feature tables',
    icon: FiColumns,
    color: 'teal',
    structure: [
      'Overview',
      'Quick Comparison Table',
      'Option A Deep Dive',
      'Option B Deep Dive',
      'Pros & Cons',
      'Our Pick',
      'CTA',
    ],
    useCase: 'Commercial intent',
  },
  {
    id: 'listicle',
    name: 'Listicle',
    description: 'Ranked or numbered list format for engagement',
    icon: FiHash,
    color: 'pink',
    structure: [
      'Introduction',
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
      'Honorable Mentions',
      'Conclusion',
    ],
    useCase: 'Engagement',
  },
];

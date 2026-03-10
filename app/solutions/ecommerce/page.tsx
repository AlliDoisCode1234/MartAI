'use client';

/**
 * E-Commerce Solution Page
 *
 * Component Hierarchy:
 * App -> SolutionPageTemplate (E-commerce)
 */

import { SolutionPageTemplate } from '@/src/components/marketing';
import {
  FiShoppingCart,
  FiClock,
  FiTrendingDown,
  FiEdit3,
  FiSearch,
  FiBarChart2,
  FiGlobe,
  FiTag,
  FiZap,
} from 'react-icons/fi';

export default function EcommercePage() {
  return (
    <SolutionPageTemplate
      persona="E-Commerce Brands"
      headline="Product Content That"
      headlineHighlight="Drives Conversions"
      description="From product descriptions to buying guides, Phoo creates the SEO-optimized content that turns browsers into buyers. Scale your product content without scaling your team."
      painPoints={[
        {
          icon: FiShoppingCart,
          problem: 'Hundreds of products with thin or duplicate descriptions',
          solution: 'Unique, SEO-optimized descriptions generated for every product',
        },
        {
          icon: FiClock,
          problem: 'Cannot write enough category pages and buying guides',
          solution: 'AI generates high-converting content in minutes per page',
        },
        {
          icon: FiTrendingDown,
          problem: 'Losing organic traffic to competitors with better content',
          solution: 'Data-driven keyword targeting to capture high-intent searches',
        },
      ]}
      features={[
        {
          icon: FiEdit3,
          title: 'Product Descriptions',
          description:
            'Generate unique, compelling product descriptions that rank and convert. No more copied manufacturer copy.',
        },
        {
          icon: FiSearch,
          title: 'Buying Guide Generation',
          description:
            'Create comprehensive buying guides that capture high-intent, top-of-funnel search traffic.',
        },
        {
          icon: FiTag,
          title: 'Category Pages',
          description:
            'SEO-optimized category landing pages that rank for competitive product keywords.',
        },
        {
          icon: FiBarChart2,
          title: 'Revenue Attribution',
          description:
            'See exactly which content drives traffic and tracks through to purchase conversions.',
        },
        {
          icon: FiGlobe,
          title: 'Shopify Integration',
          description:
            'Native Shopify publishing. Update product pages and blog posts with one click.',
        },
        {
          icon: FiZap,
          title: 'AI Shopping Answers',
          description:
            'Optimize for AI-powered shopping assistants that recommend products directly.',
        },
      ]}
      roiStats={[
        { value: '200+', label: 'Products Optimized Per Day' },
        { value: '45%', label: 'More Organic Revenue' },
        { value: '10x', label: 'Faster Content Production' },
        { value: '35%', label: 'Higher Conversion Rate' },
      ]}
      ctaHeadline="Ready to scale your product content?"
      ctaDescription="Join e-commerce brands generating the content that drives organic revenue."
      painPointsSectionTitle="Close"
      painPointsSectionHighlight="the content gap"
      painPointsSectionSubtitle="Your competitors are ranking for the keywords your products should own."
      featuresSectionTitle="Built for"
      featuresSectionHighlight="product-led growth"
      roiSectionTitle="Revenue impact"
      roiSectionHighlight="you can measure"
    />
  );
}

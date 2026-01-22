/**
 * JSON-LD Schema Generators for GEO (Generative Engine Optimization)
 *
 * These schemas help Google's AI understand and cite Phoo.ai content.
 * See: https://schema.org for full specification
 *
 * Usage:
 * - Add to pages via <script type="application/ld+json">
 * - Update this file when adding new public pages that need structured data
 *
 * @module src/lib/schemas
 */

// ============================================================================
// Type Definitions (per THEO's recommendation)
// ============================================================================

interface SchemaBase {
  '@context': 'https://schema.org';
  '@type': string;
}

interface OrganizationSchema extends SchemaBase {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    email: string;
    contactType: string;
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchema extends SchemaBase {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToSchema extends SchemaBase {
  '@type': 'HowTo';
  name: string;
  description: string;
  step: Array<{
    '@type': 'HowToStep';
    name: string;
    text: string;
    image?: string;
  }>;
}

interface SoftwareApplicationSchema extends SchemaBase {
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    ratingCount: string;
  };
}

// ============================================================================
// Schema Generators
// ============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phoo.ai';

/**
 * Organization schema for brand authority signals
 * Use on: /about page, root layout
 */
export function getOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Phoo.ai',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description:
      'AI-powered SEO and content automation platform. Optimize for both traditional search and AI-generated search results with GEO (Generative Engine Optimization).',
    sameAs: [
      // Add social profiles as they become available
      // 'https://twitter.com/phooai',
      // 'https://linkedin.com/company/phooai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@phoo.ai',
      contactType: 'customer support',
    },
  };
}

/**
 * FAQ schema for question-answer sections
 * Use on: /pricing page FAQ section
 *
 * @param items - Array of question/answer pairs
 */
export function getFaqSchema(items: FAQItem[]): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * HowTo schema for step-by-step processes
 * Use on: /how-it-works page
 *
 * @param name - Title of the how-to
 * @param description - Brief description
 * @param steps - Array of step objects
 */
export function getHowToSchema(name: string, description: string, steps: HowToStep[]): HowToSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };
}

/**
 * SoftwareApplication schema for product pages
 * Use on: /pricing page, product description pages
 *
 * @param tier - Pricing tier name
 * @param price - Price string (e.g., "149")
 */
export function getSoftwareApplicationSchema(
  tier: string = 'Growth',
  price: string = '149'
): SoftwareApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Phoo.ai ${tier}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
    },
  };
}

/**
 * Helper to render schema as JSON-LD script tag content
 * Properly escapes content for safe embedding
 */
export function schemaToJsonLd(
  schema: OrganizationSchema | FAQSchema | HowToSchema | SoftwareApplicationSchema
): string {
  return JSON.stringify(schema, null, 0);
}

// ============================================================================
// Pre-built Schemas for Common Pages
// ============================================================================

/**
 * Pricing page FAQ items
 * Keep in sync with /pricing page FAQ section
 */
export const PRICING_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do keyword limits work?',
    answer:
      'Each plan includes monthly keyword analysis credits. For example, Growth gives you 1,000 keyword analyses per month—enough to research 10-20 content clusters. Unused credits do not roll over.',
  },
  {
    question: 'What counts as an "AI Article"?',
    answer:
      'Each AI article is a 1,500-2,500 word SEO-optimized blog post, complete with meta tags, headings, and internal linking suggestions. You can regenerate or edit before publishing.',
  },
  {
    question: 'Can I upgrade or downgrade anytime?',
    answer:
      'Yes! Upgrade instantly to unlock more features. Downgrades take effect at the end of your billing cycle. Annual plans can be upgraded mid-term with prorated pricing.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 14-day money-back guarantee on all plans. If you are not satisfied, email us within 14 days of your first payment for a full refund—no questions asked.',
  },
];

/**
 * How It Works page steps
 * Keep in sync with /how-it-works page content
 */
export const HOW_IT_WORKS_STEPS: HowToStep[] = [
  {
    name: 'Enter Your URL',
    text: 'Simply provide your website URL. Phoo instantly analyzes your site structure, existing content, and identifies optimization opportunities through automatic site crawling, content gap analysis, and technical SEO audit.',
  },
  {
    name: 'Connect GSC & GA4',
    text: 'One-click integration with Google Search Console and Google Analytics 4. We pull your real performance data to build a strategy that actually works. No code required, secure OAuth connection, real-time data sync.',
  },
  {
    name: 'Let Phoo Work',
    text: 'Phoo builds your content strategy, writes SEO-optimized articles, and can even publish directly to your CMS. You approve, we execute. Includes AI-generated content calendar, one-click article generation, and WordPress/Shopify publishing.',
  },
];

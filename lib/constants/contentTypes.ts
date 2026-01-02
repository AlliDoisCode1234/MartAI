/**
 * Content Type Configuration
 *
 * Centralized registry for all 17 content types from the Content Intelligence framework.
 * Used across schema, mutations, and UI components.
 *
 * Source: CONTENT_CALENDAR_INTELLIGENCE.md (16 real client datasets, 15 industries)
 */

import { IconType } from 'react-icons';
import {
  FiHome,
  FiUser,
  FiGrid,
  FiFileText,
  FiArrowRight,
  FiGift,
  FiDollarSign,
  FiLayers,
  FiMapPin,
  FiBriefcase,
  FiUsers,
  FiHeart,
  FiCalendar,
  FiLink,
  FiBook,
  FiRefreshCw,
  FiVideo,
} from 'react-icons/fi';

// Content Type IDs (17 total)
export type ContentTypeId =
  | 'homepage'
  | 'about'
  | 'service'
  | 'landing'
  | 'blog'
  | 'blogVersus'
  | 'blogVideo'
  | 'contentRefresh'
  | 'leadMagnet'
  | 'paidProduct'
  | 'areasWeServe'
  | 'employment'
  | 'mentorship'
  | 'donate'
  | 'events'
  | 'partner'
  | 'program';

// Category groupings for UI display
export type ContentCategory =
  | 'Core Pages'
  | 'Blog Content'
  | 'Conversion'
  | 'Local/Geo'
  | 'Specialty';

interface ContentTypeConfig {
  id: ContentTypeId;
  label: string;
  wordTarget: number;
  category: ContentCategory;
  description: string;
  icon: IconType;
}

// Master configuration for all 17 content types
export const CONTENT_TYPE_CONFIG: Record<ContentTypeId, ContentTypeConfig> = {
  // Core Pages
  homepage: {
    id: 'homepage',
    label: 'Homepage',
    wordTarget: 500,
    category: 'Core Pages',
    description: 'SEO-optimized homepage copy',
    icon: FiHome,
  },
  about: {
    id: 'about',
    label: 'About Page',
    wordTarget: 600,
    category: 'Core Pages',
    description: 'Team/founder story pages',
    icon: FiUser,
  },
  service: {
    id: 'service',
    label: 'Service Page',
    wordTarget: 1000,
    category: 'Core Pages',
    description: 'Individual service descriptions',
    icon: FiGrid,
  },
  landing: {
    id: 'landing',
    label: 'Landing Page',
    wordTarget: 600,
    category: 'Core Pages',
    description: 'High-conversion pages',
    icon: FiLayers,
  },

  // Blog Content
  blog: {
    id: 'blog',
    label: 'Blog Post',
    wordTarget: 1200,
    category: 'Blog Content',
    description: 'Educational content',
    icon: FiFileText,
  },
  blogVersus: {
    id: 'blogVersus',
    label: 'Versus Blog',
    wordTarget: 1200,
    category: 'Blog Content',
    description: 'Competitor comparison',
    icon: FiArrowRight,
  },
  blogVideo: {
    id: 'blogVideo',
    label: 'Blog + Video',
    wordTarget: 1200,
    category: 'Blog Content',
    description: 'Combined content with YouTube',
    icon: FiVideo,
  },
  contentRefresh: {
    id: 'contentRefresh',
    label: 'Content Refresh',
    wordTarget: 750,
    category: 'Blog Content',
    description: 'Improve existing content',
    icon: FiRefreshCw,
  },

  // Conversion
  leadMagnet: {
    id: 'leadMagnet',
    label: 'Lead Magnet',
    wordTarget: 500,
    category: 'Conversion',
    description: 'Gated content landing',
    icon: FiGift,
  },
  paidProduct: {
    id: 'paidProduct',
    label: 'Paid Product',
    wordTarget: 800,
    category: 'Conversion',
    description: 'Monetized content',
    icon: FiDollarSign,
  },

  // Local/Geo
  areasWeServe: {
    id: 'areasWeServe',
    label: 'Areas We Serve',
    wordTarget: 400,
    category: 'Local/Geo',
    description: 'Geo-targeted pages',
    icon: FiMapPin,
  },

  // Specialty
  employment: {
    id: 'employment',
    label: 'Employment',
    wordTarget: 800,
    category: 'Specialty',
    description: 'Job recruitment pages',
    icon: FiBriefcase,
  },
  mentorship: {
    id: 'mentorship',
    label: 'Mentorship',
    wordTarget: 600,
    category: 'Specialty',
    description: 'Program/mentor pages',
    icon: FiUsers,
  },
  donate: {
    id: 'donate',
    label: 'Donate',
    wordTarget: 400,
    category: 'Specialty',
    description: 'Non-profit donations',
    icon: FiHeart,
  },
  events: {
    id: 'events',
    label: 'Events',
    wordTarget: 500,
    category: 'Specialty',
    description: 'Event listings',
    icon: FiCalendar,
  },
  partner: {
    id: 'partner',
    label: 'Partner',
    wordTarget: 600,
    category: 'Specialty',
    description: 'B2B partnerships',
    icon: FiLink,
  },
  program: {
    id: 'program',
    label: 'Program',
    wordTarget: 800,
    category: 'Specialty',
    description: 'Curriculum pages',
    icon: FiBook,
  },
};

// Helper: Get icon for content type
export function getContentTypeIcon(contentType: string): IconType {
  return CONTENT_TYPE_CONFIG[contentType as ContentTypeId]?.icon ?? FiFileText;
}

// Helper: Get label for content type
export function getContentTypeLabel(contentType: string): string {
  return CONTENT_TYPE_CONFIG[contentType as ContentTypeId]?.label ?? contentType;
}

// Helper: Get word target for content type
export function getWordTarget(contentType: string): number {
  return CONTENT_TYPE_CONFIG[contentType as ContentTypeId]?.wordTarget ?? 750;
}

// Helper: Get category for content type
export function getContentTypeCategory(contentType: string): ContentCategory | null {
  return CONTENT_TYPE_CONFIG[contentType as ContentTypeId]?.category ?? null;
}

// Get content types grouped by category (for UI dropdowns)
export function getContentTypesByCategory(): Record<ContentCategory, ContentTypeConfig[]> {
  const grouped = {} as Record<ContentCategory, ContentTypeConfig[]>;

  Object.values(CONTENT_TYPE_CONFIG).forEach((config) => {
    if (!grouped[config.category]) {
      grouped[config.category] = [];
    }
    grouped[config.category].push(config);
  });

  return grouped;
}

// All content type IDs (for validation)
export const CONTENT_TYPE_IDS = Object.keys(CONTENT_TYPE_CONFIG) as ContentTypeId[];

// Default SEO Checklist (from Content Intelligence)
export const DEFAULT_SEO_CHECKLIST = {
  wordCount: 750,
  faqCount: 3,
  mainKeywordCount: 4,
  secondaryKeywordCount: 2,
  internalLinks: 3,
  metaDescription: { min: 150, max: 160 },
  keywordInFirst100Words: true,
  imageWithAltText: true,
  refreshInterval: '6-12 months',
  indexViaGSC: true,
};

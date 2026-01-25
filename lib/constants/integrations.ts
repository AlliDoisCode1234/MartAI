/**
 * Integrations Constants
 *
 * Platform info and types for integrations page.
 */

export type Integration = {
  platform: string;
  connected: boolean;
  siteUrl?: string;
  propertyName?: string;
  lastSync?: string;
};

export const DEFAULT_INTEGRATIONS: Integration[] = [
  { platform: 'ga4', connected: false },
  { platform: 'gsc', connected: false },
  { platform: 'wordpress', connected: false },
  { platform: 'shopify', connected: false },
  { platform: 'webflow', connected: false },
];

export type PlatformInfo = {
  name: string;
  description: string;
  color: string;
};

export function getPlatformInfo(platform: string): PlatformInfo {
  switch (platform) {
    case 'ga4':
      return {
        name: 'Google Analytics 4',
        description: 'Connect your GA4 property to track traffic, sessions, and user behavior',
        color: 'orange',
      };
    case 'gsc':
      return {
        name: 'Google Search Console',
        description: 'Connect Search Console to import top queries and track rankings',
        color: 'blue',
      };
    case 'wordpress':
      return {
        name: 'WordPress',
        description: 'Connect your WordPress site to automatically publish SEO-optimized content',
        color: 'orange',
      };
    case 'shopify':
      return {
        name: 'Shopify',
        description: 'Connect your Shopify store to automatically publish SEO-optimized content',
        color: 'teal',
      };
    case 'webflow':
      return {
        name: 'Webflow',
        description: 'Connect your Webflow site to automatically publish SEO-optimized content',
        color: 'purple',
      };
    default:
      return { name: platform, description: '', color: 'gray' };
  }
}

export type OAuthTokens = {
  accessToken: string;
  refreshToken: string;
  projectId: string;
};

// ============================================================================
// CMS Platform Types
// ============================================================================

export type CMSPlatform = 'wordpress' | 'shopify' | 'wix' | 'webflow';

export type ExportFormat = 'wordpress-xml' | 'csv' | 'shopify-csv' | 'markdown' | 'json' | 'pdf';

// ============================================================================
// Content Type Arrays for CMS Capabilities
// ============================================================================

// Page-based content types (13 types)
export const PAGE_CONTENT_TYPES = [
  'homepage',
  'about',
  'service',
  'landing',
  'leadMagnet',
  'paidProduct',
  'areasWeServe',
  'employment',
  'mentorship',
  'donate',
  'events',
  'partner',
  'program',
] as const;

// Blog/post-based content types (4 types)
export const POST_CONTENT_TYPES = ['blog', 'blogVersus', 'blogVideo', 'contentRefresh'] as const;

// All 17 content types
export const ALL_CONTENT_TYPES = [...PAGE_CONTENT_TYPES, ...POST_CONTENT_TYPES] as const;

// ============================================================================
// CMS Capabilities Configuration
// ============================================================================

export interface CMSCapability {
  name: string;
  supports: 'all' | 'pages' | 'blog' | 'cms';
  publishableTypes: readonly string[];
  unsupportedTypes: readonly string[];
  exportFormats: readonly ExportFormat[];
  limitation: string | null;
  workaround: string | null;
}

export const CMS_CAPABILITIES: Record<CMSPlatform, CMSCapability> = {
  wordpress: {
    name: 'WordPress',
    supports: 'all',
    publishableTypes: ALL_CONTENT_TYPES,
    unsupportedTypes: [],
    exportFormats: ['wordpress-xml', 'csv', 'markdown', 'json'],
    limitation: null,
    workaround: null,
  },
  shopify: {
    name: 'Shopify',
    supports: 'pages',
    publishableTypes: PAGE_CONTENT_TYPES,
    unsupportedTypes: POST_CONTENT_TYPES,
    exportFormats: ['shopify-csv', 'wordpress-xml', 'csv'],
    limitation: 'Blog posts require Shopify blogging app (Magefan, Blog Importer)',
    workaround: 'Export as WordPress XML and import via Blog Importer app',
  },
  wix: {
    name: 'Wix',
    supports: 'blog',
    publishableTypes: POST_CONTENT_TYPES,
    unsupportedTypes: PAGE_CONTENT_TYPES,
    exportFormats: ['wordpress-xml'],
    limitation: 'Pages are managed via Wix Editor, not API',
    workaround: 'Export as WordPress XML and use Wix blog import feature',
  },
  webflow: {
    name: 'Webflow',
    supports: 'cms',
    publishableTypes: POST_CONTENT_TYPES,
    unsupportedTypes: PAGE_CONTENT_TYPES,
    exportFormats: ['csv', 'json'],
    limitation: 'Static pages via Webflow Designer only',
    workaround: 'Export as CSV for CMS collections, copy content for static pages',
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a content type can be auto-published to a CMS platform
 */
export function canAutoPublish(platform: CMSPlatform, contentType: string): boolean {
  const capability = CMS_CAPABILITIES[platform];
  return capability.publishableTypes.includes(contentType);
}

/**
 * Get the best export format for a platform and content type
 */
export function getRecommendedExportFormat(
  platform: CMSPlatform,
  contentType: string
): ExportFormat {
  const capability = CMS_CAPABILITIES[platform];

  // If publishable, no export needed (but offer formats anyway)
  if (capability.publishableTypes.includes(contentType)) {
    return capability.exportFormats[0];
  }

  // WordPress XML works with Wix blog import and Shopify Blog Importer
  if (platform === 'wix' || platform === 'shopify') {
    return 'wordpress-xml';
  }

  return capability.exportFormats[0];
}

/**
 * Get all available export formats for a platform
 */
export function getExportFormats(platform: CMSPlatform): readonly ExportFormat[] {
  return CMS_CAPABILITIES[platform].exportFormats;
}

/**
 * Get the limitation message for a platform (if any)
 */
export function getPlatformLimitation(platform: CMSPlatform): string | null {
  return CMS_CAPABILITIES[platform].limitation;
}

/**
 * Check if any platform is connected from an array
 */
export function hasConnectedPlatform(
  connectedPlatforms: CMSPlatform[] | undefined,
  platform: CMSPlatform
): boolean {
  return connectedPlatforms?.includes(platform) ?? false;
}

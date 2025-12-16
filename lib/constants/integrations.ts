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

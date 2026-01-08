/**
 * External API Types - Google Analytics & Search Console
 *
 * These types are based on Google's API documentation:
 * - GA4: https://developers.google.com/analytics/devguides/reporting/data/v1
 * - GSC: https://developers.google.com/webmaster-tools/search-console-api-original
 */

// ============================================
// OAuth Token Types
// ============================================

export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}

// ============================================
// Google Analytics 4 (GA4) Types
// ============================================

export interface GA4DimensionValue {
  value: string;
}

export interface GA4MetricValue {
  value: string;
}

export interface GA4Row {
  dimensionValues?: GA4DimensionValue[];
  metricValues?: GA4MetricValue[];
}

export interface GA4DataResponse {
  rows?: GA4Row[];
  dimensionHeaders?: Array<{ name: string }>;
  metricHeaders?: Array<{ name: string; type: string }>;
  rowCount?: number;
  metadata?: Record<string, string>;
}

export interface GA4Property {
  name: string; // "properties/12345678"
  displayName: string;
  timeZone?: string;
  currencyCode?: string;
  parent?: string;
}

export interface GA4ListPropertiesResponse {
  properties?: GA4Property[];
  nextPageToken?: string;
}

// ============================================
// Google Search Console (GSC) Types
// ============================================

export interface GSCRow {
  keys?: string[] | null;
  clicks?: number | null;
  impressions?: number | null;
  ctr?: number | null;
  position?: number | null;
}

export interface GSCDataResponse {
  rows?: GSCRow[];
  responseAggregationType?: string;
}

// ============================================
// Analytics Data Types (MartAI Internal)
// ============================================

export interface AnalyticsDataPoint {
  _id?: string;
  projectId: string;
  date: number;
  source: 'ga4' | 'gsc';
  sessions?: number;
  pageviews?: number;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  avgPosition?: number;
}

// Type guard for analytics data points
export function isGA4DataPoint(
  data: AnalyticsDataPoint
): data is AnalyticsDataPoint & { source: 'ga4' } {
  return data.source === 'ga4';
}

export function isGSCDataPoint(
  data: AnalyticsDataPoint
): data is AnalyticsDataPoint & { source: 'gsc' } {
  return data.source === 'gsc';
}

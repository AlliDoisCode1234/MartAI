/**
 * Typed API Accessors
 *
 * This module provides properly typed access to all Convex API paths.
 *
 * WHY THIS EXISTS:
 * Convex codegen creates `fullApi` with paths like `"seo/keywordClusters"` but
 * the exported `api` filters them via `FilterApi`, losing bracket notation access.
 * We import the module types directly and re-export with proper typing.
 *
 * USAGE:
 *   import { seoKeywordClusters, contentBriefs } from '../lib/api';
 *   await ctx.runQuery(seoKeywordClusters.getClustersByProject, { projectId });
 */

// Import the module types directly from codegen
import type * as seo_keywordClusters from '../seo/keywordClusters';
import type * as seo_keywords from '../seo/keywords';
import type * as seo_keywordsData from '../seo/keywordsData';
import type * as seo_keywordActions from '../seo/keywordActions';
import type * as seo_keywordIdeas from '../seo/keywordIdeas';
import type * as seo_agentActions from '../seo/agentActions';
import type * as seo_competitors from '../seo/competitors';
import type * as seo_rankings from '../seo/rankings';
import type * as seo_library from '../seo/library';
import type * as seo_strategy from '../seo/strategy';

import type * as content_briefs from '../content/briefs';
import type * as content_drafts from '../content/drafts';
import type * as content_briefActions from '../content/briefActions';
import type * as content_draftActions from '../content/draftActions';
import type * as content_calendars from '../content/calendars';
import type * as content_quarterlyPlans from '../content/quarterlyPlans';
import type * as content_quarterlyPlanActions from '../content/quarterlyPlanActions';

import type * as analytics_adhoc from '../analytics/adhoc';
import type * as analytics_analytics from '../analytics/analytics';
import type * as analytics_insights from '../analytics/insights';
import type * as analytics_gscKeywords from '../analytics/gscKeywords';

import type * as projects_projects from '../projects/projects';
import type * as projects_clients from '../projects/clients';
import type * as prospects_prospects from '../prospects/prospects';

import type * as integrations_hubspot from '../integrations/hubspot';
import type * as integrations_ga4Connections from '../integrations/ga4Connections';
import type * as integrations_gscConnections from '../integrations/gscConnections';
import type * as integrations_google from '../integrations/google';
import type * as integrations_gsc from '../integrations/gsc';
import type * as integrations_oauth from '../integrations/oauth';
import type * as integrations_wordpress from '../integrations/wordpress';

import type * as organizations_organizations from '../organizations/organizations';
import type * as organizations_teamMembers from '../organizations/teamMembers';

import type * as publishing_publishing from '../publishing/publishing';
import type * as publishing_scheduledPosts from '../publishing/scheduledPosts';

import type * as subscriptions_subscriptions from '../subscriptions/subscriptions';

import type * as webhooks_webhooks from '../webhooks/webhooks';

import type * as top_apiAccessRequests from '../apiAccessRequests';

// Import base api for top-level modules
import { api as baseApi, internal as baseInternal } from '../_generated/api';
import type { ApiFromModules, FunctionReference, FilterApi } from 'convex/server';

// Type for the full API with bracket access
type FullApiType = {
  // SEO
  'seo/keywordClusters': typeof seo_keywordClusters;
  'seo/keywords': typeof seo_keywords;
  'seo/keywordsData': typeof seo_keywordsData;
  'seo/keywordActions': typeof seo_keywordActions;
  'seo/keywordIdeas': typeof seo_keywordIdeas;
  'seo/agentActions': typeof seo_agentActions;
  'seo/competitors': typeof seo_competitors;
  'seo/rankings': typeof seo_rankings;
  'seo/library': typeof seo_library;
  'seo/strategy': typeof seo_strategy;
  // Content
  'content/briefs': typeof content_briefs;
  'content/drafts': typeof content_drafts;
  'content/briefActions': typeof content_briefActions;
  'content/draftActions': typeof content_draftActions;
  'content/calendars': typeof content_calendars;
  'content/quarterlyPlans': typeof content_quarterlyPlans;
  'content/quarterlyPlanActions': typeof content_quarterlyPlanActions;
  // Analytics
  'analytics/adhoc': typeof analytics_adhoc;
  'analytics/analytics': typeof analytics_analytics;
  'analytics/insights': typeof analytics_insights;
  'analytics/gscKeywords': typeof analytics_gscKeywords;
  // Projects & Prospects
  'projects/projects': typeof projects_projects;
  'projects/clients': typeof projects_clients;
  'prospects/prospects': typeof prospects_prospects;
  // Integrations
  'integrations/hubspot': typeof integrations_hubspot;
  'integrations/ga4Connections': typeof integrations_ga4Connections;
  'integrations/gscConnections': typeof integrations_gscConnections;
  'integrations/google': typeof integrations_google;
  'integrations/gsc': typeof integrations_gsc;
  'integrations/oauth': typeof integrations_oauth;
  'integrations/wordpress': typeof integrations_wordpress;
  // Organizations
  'organizations/organizations': typeof organizations_organizations;
  'organizations/teamMembers': typeof organizations_teamMembers;
  // Publishing
  'publishing/publishing': typeof publishing_publishing;
  'publishing/scheduledPosts': typeof publishing_scheduledPosts;
  // Subscriptions
  'subscriptions/subscriptions': typeof subscriptions_subscriptions;
  // Webhooks
  'webhooks/webhooks': typeof webhooks_webhooks;
  // Top-level modules
  apiAccessRequests: typeof top_apiAccessRequests;
};

// Cast api to include bracket access
const api = baseApi as typeof baseApi & FullApiType;

// ============================================
// TYPED EXPORTS - SEO
// ============================================
export const seoKeywordClusters = api['seo/keywordClusters'];
export const seoKeywords = api['seo/keywords'];
export const seoKeywordsData = api['seo/keywordsData'];
export const seoKeywordActions = api['seo/keywordActions'];
export const seoKeywordIdeas = api['seo/keywordIdeas'];
export const seoAgentActions = api['seo/agentActions'];
export const seoCompetitors = api['seo/competitors'];
export const seoRankings = api['seo/rankings'];
export const seoLibrary = api['seo/library'];
export const seoStrategy = api['seo/strategy'];

// ============================================
// TYPED EXPORTS - CONTENT
// ============================================
export const contentBriefs = api['content/briefs'];
export const contentDrafts = api['content/drafts'];
export const contentBriefActions = api['content/briefActions'];
export const contentDraftActions = api['content/draftActions'];
export const contentCalendars = api['content/calendars'];
export const contentQuarterlyPlans = api['content/quarterlyPlans'];
export const contentQuarterlyPlanActions = api['content/quarterlyPlanActions'];

// ============================================
// TYPED EXPORTS - ANALYTICS
// ============================================
export const analyticsAdhoc = api['analytics/adhoc'];
export const analyticsAnalytics = api['analytics/analytics'];
export const analyticsInsights = api['analytics/insights'];
export const analyticsGscKeywords = api['analytics/gscKeywords'];

// ============================================
// TYPED EXPORTS - PROJECTS & PROSPECTS
// ============================================
export const projectsProjects = api['projects/projects'];
export const projectsClients = api['projects/clients'];
export const prospectsProspects = api['prospects/prospects'];

// ============================================
// TYPED EXPORTS - AI
// Note: For ai/analysis, ai/reports, ai/personas - use api['ai/...']
// directly from _generated/api to avoid circular refs
// ============================================

// ============================================
// TYPED EXPORTS - INTEGRATIONS
// ============================================
export const integrationsHubspot = api['integrations/hubspot'];
export const integrationsGa4Connections = api['integrations/ga4Connections'];
export const integrationsGscConnections = api['integrations/gscConnections'];
export const integrationsGoogle = api['integrations/google'];
export const integrationsGsc = api['integrations/gsc'];
export const integrationsOauth = api['integrations/oauth'];
export const integrationsWordpress = api['integrations/wordpress'];

// ============================================
// TYPED EXPORTS - ORGANIZATIONS
// ============================================
export const organizationsOrganizations = api['organizations/organizations'];
export const organizationsTeamMembers = api['organizations/teamMembers'];

// ============================================
// TYPED EXPORTS - PUBLISHING
// ============================================
export const publishingPublishing = api['publishing/publishing'];
export const publishingScheduledPosts = api['publishing/scheduledPosts'];

// ============================================
// TYPED EXPORTS - SUBSCRIPTIONS
// ============================================
export const subscriptionsSubscriptions = api['subscriptions/subscriptions'];

// ============================================
// TYPED EXPORTS - WEBHOOKS
// ============================================
export const webhooksWebhooks = api['webhooks/webhooks'];

// ============================================
// TOP-LEVEL MODULES
// Note: For users, aiStorage, etc. - import directly from '../_generated/api'
// to avoid circular reference issues
// ============================================
export const apiKeys = api['apiKeys'];
export const apiAccessRequests = api['apiAccessRequests'];
export const onboarding = api['onboarding'];

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics_analytics from "../analytics/analytics.js";
import type * as auth_seed from "../auth/seed.js";
import type * as auth_sessions from "../auth/sessions.js";
import type * as auth_users from "../auth/users.js";
import type * as content_briefVersions from "../content/briefVersions.js";
import type * as content_briefs from "../content/briefs.js";
import type * as content_drafts from "../content/drafts.js";
import type * as content_quarterlyPlans from "../content/quarterlyPlans.js";
import type * as http from "../http.js";
import type * as http_checkScheduledPosts from "../http/checkScheduledPosts.js";
import type * as http_seedAdmin from "../http/seedAdmin.js";
import type * as integrations_ga4Connections from "../integrations/ga4Connections.js";
import type * as integrations_gscConnections from "../integrations/gscConnections.js";
import type * as integrations_oauth from "../integrations/oauth.js";
import type * as integrations_pages from "../integrations/pages.js";
import type * as projects_clients from "../projects/clients.js";
import type * as projects_projects from "../projects/projects.js";
import type * as publishing_scheduledPosts from "../publishing/scheduledPosts.js";
import type * as seo_competitors from "../seo/competitors.js";
import type * as seo_keywordClusters from "../seo/keywordClusters.js";
import type * as seo_keywords from "../seo/keywords.js";
import type * as seo_rankings from "../seo/rankings.js";
import type * as seo_seoAudits from "../seo/seoAudits.js";
import type * as seo_statistics from "../seo/statistics.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "analytics/analytics": typeof analytics_analytics;
  "auth/seed": typeof auth_seed;
  "auth/sessions": typeof auth_sessions;
  "auth/users": typeof auth_users;
  "content/briefVersions": typeof content_briefVersions;
  "content/briefs": typeof content_briefs;
  "content/drafts": typeof content_drafts;
  "content/quarterlyPlans": typeof content_quarterlyPlans;
  http: typeof http;
  "http/checkScheduledPosts": typeof http_checkScheduledPosts;
  "http/seedAdmin": typeof http_seedAdmin;
  "integrations/ga4Connections": typeof integrations_ga4Connections;
  "integrations/gscConnections": typeof integrations_gscConnections;
  "integrations/oauth": typeof integrations_oauth;
  "integrations/pages": typeof integrations_pages;
  "projects/clients": typeof projects_clients;
  "projects/projects": typeof projects_projects;
  "publishing/scheduledPosts": typeof publishing_scheduledPosts;
  "seo/competitors": typeof seo_competitors;
  "seo/keywordClusters": typeof seo_keywordClusters;
  "seo/keywords": typeof seo_keywords;
  "seo/rankings": typeof seo_rankings;
  "seo/seoAudits": typeof seo_seoAudits;
  "seo/statistics": typeof seo_statistics;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

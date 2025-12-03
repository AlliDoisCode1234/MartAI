/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as ai_analysis from "../ai/analysis.js";
import type * as ai_reports from "../ai/reports.js";
import type * as analytics_analytics from "../analytics/analytics.js";
import type * as analytics_queries from "../analytics/queries.js";
import type * as analytics_scheduler from "../analytics/scheduler.js";
import type * as auth from "../auth.js";
import type * as content_briefActions from "../content/briefActions.js";
import type * as content_briefVersions from "../content/briefVersions.js";
import type * as content_briefs from "../content/briefs.js";
import type * as content_calendars from "../content/calendars.js";
import type * as content_content from "../content/content.js";
import type * as content_draftActions from "../content/draftActions.js";
import type * as content_drafts from "../content/drafts.js";
import type * as content_quarterlyPlanActions from "../content/quarterlyPlanActions.js";
import type * as content_quarterlyPlans from "../content/quarterlyPlans.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as http_checkScheduledPosts from "../http/checkScheduledPosts.js";
import type * as http_publishScheduledPost from "../http/publishScheduledPost.js";
import type * as integrations_ga4Connections from "../integrations/ga4Connections.js";
import type * as integrations_gscConnections from "../integrations/gscConnections.js";
import type * as integrations_integrations from "../integrations/integrations.js";
import type * as integrations_oauth from "../integrations/oauth.js";
import type * as integrations_pages from "../integrations/pages.js";
import type * as projects_clients from "../projects/clients.js";
import type * as projects_projects from "../projects/projects.js";
import type * as prospects_prospects from "../prospects/prospects.js";
import type * as publishing_publishing from "../publishing/publishing.js";
import type * as publishing_scheduledPosts from "../publishing/scheduledPosts.js";
import type * as publishing_wordpressActions from "../publishing/wordpressActions.js";
import type * as rateLimits from "../rateLimits.js";
import type * as seo_competitors from "../seo/competitors.js";
import type * as seo_keywordActions from "../seo/keywordActions.js";
import type * as seo_keywordClusters from "../seo/keywordClusters.js";
import type * as seo_keywordIdeas from "../seo/keywordIdeas.js";
import type * as seo_keywords from "../seo/keywords.js";
import type * as seo_keywordsData from "../seo/keywordsData.js";
import type * as seo_rankings from "../seo/rankings.js";
import type * as seo_seoAudits from "../seo/seoAudits.js";
import type * as seo_statistics from "../seo/statistics.js";
import type * as seo_strategy from "../seo/strategy.js";
import type * as subscriptions_subscriptions from "../subscriptions/subscriptions.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  "ai/analysis": typeof ai_analysis;
  "ai/reports": typeof ai_reports;
  "analytics/analytics": typeof analytics_analytics;
  "analytics/queries": typeof analytics_queries;
  "analytics/scheduler": typeof analytics_scheduler;
  auth: typeof auth;
  "content/briefActions": typeof content_briefActions;
  "content/briefVersions": typeof content_briefVersions;
  "content/briefs": typeof content_briefs;
  "content/calendars": typeof content_calendars;
  "content/content": typeof content_content;
  "content/draftActions": typeof content_draftActions;
  "content/drafts": typeof content_drafts;
  "content/quarterlyPlanActions": typeof content_quarterlyPlanActions;
  "content/quarterlyPlans": typeof content_quarterlyPlans;
  crons: typeof crons;
  http: typeof http;
  "http/checkScheduledPosts": typeof http_checkScheduledPosts;
  "http/publishScheduledPost": typeof http_publishScheduledPost;
  "integrations/ga4Connections": typeof integrations_ga4Connections;
  "integrations/gscConnections": typeof integrations_gscConnections;
  "integrations/integrations": typeof integrations_integrations;
  "integrations/oauth": typeof integrations_oauth;
  "integrations/pages": typeof integrations_pages;
  "projects/clients": typeof projects_clients;
  "projects/projects": typeof projects_projects;
  "prospects/prospects": typeof prospects_prospects;
  "publishing/publishing": typeof publishing_publishing;
  "publishing/scheduledPosts": typeof publishing_scheduledPosts;
  "publishing/wordpressActions": typeof publishing_wordpressActions;
  rateLimits: typeof rateLimits;
  "seo/competitors": typeof seo_competitors;
  "seo/keywordActions": typeof seo_keywordActions;
  "seo/keywordClusters": typeof seo_keywordClusters;
  "seo/keywordIdeas": typeof seo_keywordIdeas;
  "seo/keywords": typeof seo_keywords;
  "seo/keywordsData": typeof seo_keywordsData;
  "seo/rankings": typeof seo_rankings;
  "seo/seoAudits": typeof seo_seoAudits;
  "seo/statistics": typeof seo_statistics;
  "seo/strategy": typeof seo_strategy;
  "subscriptions/subscriptions": typeof subscriptions_subscriptions;
  users: typeof users;
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

export declare const components: {
  rateLimiter: {
    lib: {
      checkRateLimit: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
      getValue: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          key?: string;
          name: string;
          sampleShards?: number;
        },
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          shard: number;
          ts: number;
          value: number;
        }
      >;
      rateLimit: FunctionReference<
        "mutation",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      resetRateLimit: FunctionReference<
        "mutation",
        "internal",
        { key?: string; name: string },
        null
      >;
    };
    time: {
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
    };
  };
};

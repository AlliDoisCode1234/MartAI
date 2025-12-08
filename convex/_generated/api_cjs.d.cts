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
import type * as admin_costs from "../admin/costs.js";
import type * as aiStorage from "../aiStorage.js";
import type * as ai_analysis from "../ai/analysis.js";
import type * as ai_personas from "../ai/personas.js";
import type * as ai_reports from "../ai/reports.js";
import type * as analytics_adhoc from "../analytics/adhoc.js";
import type * as analytics_aggregations from "../analytics/aggregations.js";
import type * as analytics_analytics from "../analytics/analytics.js";
import type * as analytics_competitors from "../analytics/competitors.js";
import type * as analytics_gscKeywords from "../analytics/gscKeywords.js";
import type * as analytics_insights from "../analytics/insights.js";
import type * as analytics_martaiRating from "../analytics/martaiRating.js";
import type * as analytics_martaiRatingQueries from "../analytics/martaiRatingQueries.js";
import type * as analytics_queries from "../analytics/queries.js";
import type * as analytics_scheduler from "../analytics/scheduler.js";
import type * as analytics_sync from "../analytics/sync.js";
import type * as auth from "../auth.js";
import type * as cache from "../cache.js";
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
import type * as index from "../index.js";
import type * as integrations_ga4Connections from "../integrations/ga4Connections.js";
import type * as integrations_google from "../integrations/google.js";
import type * as integrations_gsc from "../integrations/gsc.js";
import type * as integrations_gscConnections from "../integrations/gscConnections.js";
import type * as integrations_integrations from "../integrations/integrations.js";
import type * as integrations_oauth from "../integrations/oauth.js";
import type * as integrations_pages from "../integrations/pages.js";
import type * as integrations_wordpress from "../integrations/wordpress.js";
import type * as lib_aggregates from "../lib/aggregates.js";
import type * as lib_services_intelligence from "../lib/services/intelligence.js";
import type * as migrations from "../migrations.js";
import type * as onboarding from "../onboarding.js";
import type * as projects_clients from "../projects/clients.js";
import type * as projects_projects from "../projects/projects.js";
import type * as prospects_prospects from "../prospects/prospects.js";
import type * as publishing_publishing from "../publishing/publishing.js";
import type * as publishing_scheduledPosts from "../publishing/scheduledPosts.js";
import type * as publishing_wordpressActions from "../publishing/wordpressActions.js";
import type * as rateLimits from "../rateLimits.js";
import type * as seo_agentActions from "../seo/agentActions.js";
import type * as seo_competitors from "../seo/competitors.js";
import type * as seo_keywordActions from "../seo/keywordActions.js";
import type * as seo_keywordClusters from "../seo/keywordClusters.js";
import type * as seo_keywordIdeas from "../seo/keywordIdeas.js";
import type * as seo_keywords from "../seo/keywords.js";
import type * as seo_keywordsData from "../seo/keywordsData.js";
import type * as seo_library from "../seo/library.js";
import type * as seo_rankings from "../seo/rankings.js";
import type * as seo_seoAudits from "../seo/seoAudits.js";
import type * as seo_statistics from "../seo/statistics.js";
import type * as seo_strategy from "../seo/strategy.js";
import type * as subscriptions_subscriptions from "../subscriptions/subscriptions.js";
import type * as users from "../users.js";
import type * as workflows_analyticsWorkflows from "../workflows/analyticsWorkflows.js";
import type * as workflows_contentWorkflows from "../workflows/contentWorkflows.js";
import type * as workflows_index from "../workflows/index.js";
import type * as workflows_keywordWorkflows from "../workflows/keywordWorkflows.js";
import type * as workflows_onboardingWorkflows from "../workflows/onboardingWorkflows.js";
import type * as workflows_strategyWorkflows from "../workflows/strategyWorkflows.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  "admin/costs": typeof admin_costs;
  aiStorage: typeof aiStorage;
  "ai/analysis": typeof ai_analysis;
  "ai/personas": typeof ai_personas;
  "ai/reports": typeof ai_reports;
  "analytics/adhoc": typeof analytics_adhoc;
  "analytics/aggregations": typeof analytics_aggregations;
  "analytics/analytics": typeof analytics_analytics;
  "analytics/competitors": typeof analytics_competitors;
  "analytics/gscKeywords": typeof analytics_gscKeywords;
  "analytics/insights": typeof analytics_insights;
  "analytics/martaiRating": typeof analytics_martaiRating;
  "analytics/martaiRatingQueries": typeof analytics_martaiRatingQueries;
  "analytics/queries": typeof analytics_queries;
  "analytics/scheduler": typeof analytics_scheduler;
  "analytics/sync": typeof analytics_sync;
  auth: typeof auth;
  cache: typeof cache;
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
  index: typeof index;
  "integrations/ga4Connections": typeof integrations_ga4Connections;
  "integrations/google": typeof integrations_google;
  "integrations/gsc": typeof integrations_gsc;
  "integrations/gscConnections": typeof integrations_gscConnections;
  "integrations/integrations": typeof integrations_integrations;
  "integrations/oauth": typeof integrations_oauth;
  "integrations/pages": typeof integrations_pages;
  "integrations/wordpress": typeof integrations_wordpress;
  "lib/aggregates": typeof lib_aggregates;
  "lib/services/intelligence": typeof lib_services_intelligence;
  migrations: typeof migrations;
  onboarding: typeof onboarding;
  "projects/clients": typeof projects_clients;
  "projects/projects": typeof projects_projects;
  "prospects/prospects": typeof prospects_prospects;
  "publishing/publishing": typeof publishing_publishing;
  "publishing/scheduledPosts": typeof publishing_scheduledPosts;
  "publishing/wordpressActions": typeof publishing_wordpressActions;
  rateLimits: typeof rateLimits;
  "seo/agentActions": typeof seo_agentActions;
  "seo/competitors": typeof seo_competitors;
  "seo/keywordActions": typeof seo_keywordActions;
  "seo/keywordClusters": typeof seo_keywordClusters;
  "seo/keywordIdeas": typeof seo_keywordIdeas;
  "seo/keywords": typeof seo_keywords;
  "seo/keywordsData": typeof seo_keywordsData;
  "seo/library": typeof seo_library;
  "seo/rankings": typeof seo_rankings;
  "seo/seoAudits": typeof seo_seoAudits;
  "seo/statistics": typeof seo_statistics;
  "seo/strategy": typeof seo_strategy;
  "subscriptions/subscriptions": typeof subscriptions_subscriptions;
  users: typeof users;
  "workflows/analyticsWorkflows": typeof workflows_analyticsWorkflows;
  "workflows/contentWorkflows": typeof workflows_contentWorkflows;
  "workflows/index": typeof workflows_index;
  "workflows/keywordWorkflows": typeof workflows_keywordWorkflows;
  "workflows/onboardingWorkflows": typeof workflows_onboardingWorkflows;
  "workflows/strategyWorkflows": typeof workflows_strategyWorkflows;
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
  actionCache: {
    crons: {
      purge: FunctionReference<
        "mutation",
        "internal",
        { expiresAt?: number },
        null
      >;
    };
    lib: {
      get: FunctionReference<
        "query",
        "internal",
        { args: any; name: string; ttl: number | null },
        { kind: "hit"; value: any } | { expiredEntry?: string; kind: "miss" }
      >;
      put: FunctionReference<
        "mutation",
        "internal",
        {
          args: any;
          expiredEntry?: string;
          name: string;
          ttl: number | null;
          value: any;
        },
        { cacheHit: boolean; deletedExpiredEntry: boolean }
      >;
      remove: FunctionReference<
        "mutation",
        "internal",
        { args: any; name: string },
        null
      >;
      removeAll: FunctionReference<
        "mutation",
        "internal",
        { batchSize?: number; before?: number; name?: string },
        null
      >;
    };
  };
  workflow: {
    event: {
      create: FunctionReference<
        "mutation",
        "internal",
        { name: string; workflowId: string },
        string
      >;
      send: FunctionReference<
        "mutation",
        "internal",
        {
          eventId?: string;
          name?: string;
          result:
            | { kind: "success"; returnValue: any }
            | { error: string; kind: "failed" }
            | { kind: "canceled" };
          workflowId?: string;
          workpoolOptions?: {
            defaultRetryBehavior?: {
              base: number;
              initialBackoffMs: number;
              maxAttempts: number;
            };
            logLevel?: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
            maxParallelism?: number;
            retryActionsByDefault?: boolean;
          };
        },
        string
      >;
    };
    journal: {
      load: FunctionReference<
        "query",
        "internal",
        { shortCircuit?: boolean; workflowId: string },
        {
          blocked?: boolean;
          journalEntries: Array<{
            _creationTime: number;
            _id: string;
            step:
              | {
                  args: any;
                  argsSize: number;
                  completedAt?: number;
                  functionType: "query" | "mutation" | "action";
                  handle: string;
                  inProgress: boolean;
                  kind?: "function";
                  name: string;
                  runResult?:
                    | { kind: "success"; returnValue: any }
                    | { error: string; kind: "failed" }
                    | { kind: "canceled" };
                  startedAt: number;
                  workId?: string;
                }
              | {
                  args: any;
                  argsSize: number;
                  completedAt?: number;
                  handle: string;
                  inProgress: boolean;
                  kind: "workflow";
                  name: string;
                  runResult?:
                    | { kind: "success"; returnValue: any }
                    | { error: string; kind: "failed" }
                    | { kind: "canceled" };
                  startedAt: number;
                  workflowId?: string;
                }
              | {
                  args: { eventId?: string };
                  argsSize: number;
                  completedAt?: number;
                  eventId?: string;
                  inProgress: boolean;
                  kind: "event";
                  name: string;
                  runResult?:
                    | { kind: "success"; returnValue: any }
                    | { error: string; kind: "failed" }
                    | { kind: "canceled" };
                  startedAt: number;
                };
            stepNumber: number;
            workflowId: string;
          }>;
          logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
          ok: boolean;
          workflow: {
            _creationTime: number;
            _id: string;
            args: any;
            generationNumber: number;
            logLevel?: any;
            name?: string;
            onComplete?: { context?: any; fnHandle: string };
            runResult?:
              | { kind: "success"; returnValue: any }
              | { error: string; kind: "failed" }
              | { kind: "canceled" };
            startedAt?: any;
            state?: any;
            workflowHandle: string;
          };
        }
      >;
      startSteps: FunctionReference<
        "mutation",
        "internal",
        {
          generationNumber: number;
          steps: Array<{
            retry?:
              | boolean
              | { base: number; initialBackoffMs: number; maxAttempts: number };
            schedulerOptions?: { runAt?: number } | { runAfter?: number };
            step:
              | {
                  args: any;
                  argsSize: number;
                  completedAt?: number;
                  functionType: "query" | "mutation" | "action";
                  handle: string;
                  inProgress: boolean;
                  kind?: "function";
                  name: string;
                  runResult?:
                    | { kind: "success"; returnValue: any }
                    | { error: string; kind: "failed" }
                    | { kind: "canceled" };
                  startedAt: number;
                  workId?: string;
                }
              | {
                  args: any;
                  argsSize: number;
                  completedAt?: number;
                  handle: string;
                  inProgress: boolean;
                  kind: "workflow";
                  name: string;
                  runResult?:
                    | { kind: "success"; returnValue: any }
                    | { error: string; kind: "failed" }
                    | { kind: "canceled" };
                  startedAt: number;
                  workflowId?: string;
                }
              | {
                  args: { eventId?: string };
                  argsSize: number;
                  completedAt?: number;
                  eventId?: string;
                  inProgress: boolean;
                  kind: "event";
                  name: string;
                  runResult?:
                    | { kind: "success"; returnValue: any }
                    | { error: string; kind: "failed" }
                    | { kind: "canceled" };
                  startedAt: number;
                };
          }>;
          workflowId: string;
          workpoolOptions?: {
            defaultRetryBehavior?: {
              base: number;
              initialBackoffMs: number;
              maxAttempts: number;
            };
            logLevel?: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
            maxParallelism?: number;
            retryActionsByDefault?: boolean;
          };
        },
        Array<{
          _creationTime: number;
          _id: string;
          step:
            | {
                args: any;
                argsSize: number;
                completedAt?: number;
                functionType: "query" | "mutation" | "action";
                handle: string;
                inProgress: boolean;
                kind?: "function";
                name: string;
                runResult?:
                  | { kind: "success"; returnValue: any }
                  | { error: string; kind: "failed" }
                  | { kind: "canceled" };
                startedAt: number;
                workId?: string;
              }
            | {
                args: any;
                argsSize: number;
                completedAt?: number;
                handle: string;
                inProgress: boolean;
                kind: "workflow";
                name: string;
                runResult?:
                  | { kind: "success"; returnValue: any }
                  | { error: string; kind: "failed" }
                  | { kind: "canceled" };
                startedAt: number;
                workflowId?: string;
              }
            | {
                args: { eventId?: string };
                argsSize: number;
                completedAt?: number;
                eventId?: string;
                inProgress: boolean;
                kind: "event";
                name: string;
                runResult?:
                  | { kind: "success"; returnValue: any }
                  | { error: string; kind: "failed" }
                  | { kind: "canceled" };
                startedAt: number;
              };
          stepNumber: number;
          workflowId: string;
        }>
      >;
    };
    workflow: {
      cancel: FunctionReference<
        "mutation",
        "internal",
        { workflowId: string },
        null
      >;
      cleanup: FunctionReference<
        "mutation",
        "internal",
        { workflowId: string },
        boolean
      >;
      complete: FunctionReference<
        "mutation",
        "internal",
        {
          generationNumber: number;
          runResult:
            | { kind: "success"; returnValue: any }
            | { error: string; kind: "failed" }
            | { kind: "canceled" };
          workflowId: string;
        },
        null
      >;
      create: FunctionReference<
        "mutation",
        "internal",
        {
          maxParallelism?: number;
          onComplete?: { context?: any; fnHandle: string };
          startAsync?: boolean;
          workflowArgs: any;
          workflowHandle: string;
          workflowName: string;
        },
        string
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { workflowId: string },
        {
          inProgress: Array<{
            _creationTime: number;
            _id: string;
            step:
              | {
                  args: any;
                  argsSize: number;
                  completedAt?: number;
                  functionType: "query" | "mutation" | "action";
                  handle: string;
                  inProgress: boolean;
                  kind?: "function";
                  name: string;
                  runResult?:
                    | { kind: "success"; returnValue: any }
                    | { error: string; kind: "failed" }
                    | { kind: "canceled" };
                  startedAt: number;
                  workId?: string;
                }
              | {
                  args: any;
                  argsSize: number;
                  completedAt?: number;
                  handle: string;
                  inProgress: boolean;
                  kind: "workflow";
                  name: string;
                  runResult?:
                    | { kind: "success"; returnValue: any }
                    | { error: string; kind: "failed" }
                    | { kind: "canceled" };
                  startedAt: number;
                  workflowId?: string;
                }
              | {
                  args: { eventId?: string };
                  argsSize: number;
                  completedAt?: number;
                  eventId?: string;
                  inProgress: boolean;
                  kind: "event";
                  name: string;
                  runResult?:
                    | { kind: "success"; returnValue: any }
                    | { error: string; kind: "failed" }
                    | { kind: "canceled" };
                  startedAt: number;
                };
            stepNumber: number;
            workflowId: string;
          }>;
          logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
          workflow: {
            _creationTime: number;
            _id: string;
            args: any;
            generationNumber: number;
            logLevel?: any;
            name?: string;
            onComplete?: { context?: any; fnHandle: string };
            runResult?:
              | { kind: "success"; returnValue: any }
              | { error: string; kind: "failed" }
              | { kind: "canceled" };
            startedAt?: any;
            state?: any;
            workflowHandle: string;
          };
        }
      >;
      listSteps: FunctionReference<
        "query",
        "internal",
        {
          order: "asc" | "desc";
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
          workflowId: string;
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            args: any;
            completedAt?: number;
            eventId?: string;
            kind: "function" | "workflow" | "event";
            name: string;
            nestedWorkflowId?: string;
            runResult?:
              | { kind: "success"; returnValue: any }
              | { error: string; kind: "failed" }
              | { kind: "canceled" };
            startedAt: number;
            stepId: string;
            stepNumber: number;
            workId?: string;
            workflowId: string;
          }>;
          pageStatus?: "SplitRecommended" | "SplitRequired" | null;
          splitCursor?: string | null;
        }
      >;
    };
  };
  rag: {
    chunks: {
      insert: FunctionReference<
        "mutation",
        "internal",
        {
          chunks: Array<{
            content: { metadata?: Record<string, any>; text: string };
            embedding: Array<number>;
            searchableText?: string;
          }>;
          entryId: string;
          startOrder: number;
        },
        { status: "pending" | "ready" | "replaced" }
      >;
      list: FunctionReference<
        "query",
        "internal",
        {
          entryId: string;
          order: "desc" | "asc";
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            metadata?: Record<string, any>;
            order: number;
            state: "pending" | "ready" | "replaced";
            text: string;
          }>;
          pageStatus?: "SplitRecommended" | "SplitRequired" | null;
          splitCursor?: string | null;
        }
      >;
      replaceChunksPage: FunctionReference<
        "mutation",
        "internal",
        { entryId: string; startOrder: number },
        { nextStartOrder: number; status: "pending" | "ready" | "replaced" }
      >;
    };
    entries: {
      add: FunctionReference<
        "mutation",
        "internal",
        {
          allChunks?: Array<{
            content: { metadata?: Record<string, any>; text: string };
            embedding: Array<number>;
            searchableText?: string;
          }>;
          entry: {
            contentHash?: string;
            filterValues: Array<{ name: string; value: any }>;
            importance: number;
            key?: string;
            metadata?: Record<string, any>;
            namespaceId: string;
            title?: string;
          };
          onComplete?: string;
        },
        {
          created: boolean;
          entryId: string;
          status: "pending" | "ready" | "replaced";
        }
      >;
      addAsync: FunctionReference<
        "mutation",
        "internal",
        {
          chunker: string;
          entry: {
            contentHash?: string;
            filterValues: Array<{ name: string; value: any }>;
            importance: number;
            key?: string;
            metadata?: Record<string, any>;
            namespaceId: string;
            title?: string;
          };
          onComplete?: string;
        },
        { created: boolean; entryId: string; status: "pending" | "ready" }
      >;
      deleteAsync: FunctionReference<
        "mutation",
        "internal",
        { entryId: string; startOrder: number },
        null
      >;
      deleteByKeyAsync: FunctionReference<
        "mutation",
        "internal",
        { beforeVersion?: number; key: string; namespaceId: string },
        null
      >;
      deleteByKeySync: FunctionReference<
        "action",
        "internal",
        { key: string; namespaceId: string },
        null
      >;
      deleteSync: FunctionReference<
        "action",
        "internal",
        { entryId: string },
        null
      >;
      findByContentHash: FunctionReference<
        "query",
        "internal",
        {
          contentHash: string;
          dimension: number;
          filterNames: Array<string>;
          key: string;
          modelId: string;
          namespace: string;
        },
        {
          contentHash?: string;
          entryId: string;
          filterValues: Array<{ name: string; value: any }>;
          importance: number;
          key?: string;
          metadata?: Record<string, any>;
          replacedAt?: number;
          status: "pending" | "ready" | "replaced";
          title?: string;
        } | null
      >;
      get: FunctionReference<
        "query",
        "internal",
        { entryId: string },
        {
          contentHash?: string;
          entryId: string;
          filterValues: Array<{ name: string; value: any }>;
          importance: number;
          key?: string;
          metadata?: Record<string, any>;
          replacedAt?: number;
          status: "pending" | "ready" | "replaced";
          title?: string;
        } | null
      >;
      list: FunctionReference<
        "query",
        "internal",
        {
          namespaceId?: string;
          order?: "desc" | "asc";
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
          status: "pending" | "ready" | "replaced";
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            contentHash?: string;
            entryId: string;
            filterValues: Array<{ name: string; value: any }>;
            importance: number;
            key?: string;
            metadata?: Record<string, any>;
            replacedAt?: number;
            status: "pending" | "ready" | "replaced";
            title?: string;
          }>;
          pageStatus?: "SplitRecommended" | "SplitRequired" | null;
          splitCursor?: string | null;
        }
      >;
      promoteToReady: FunctionReference<
        "mutation",
        "internal",
        { entryId: string },
        {
          replacedEntry: {
            contentHash?: string;
            entryId: string;
            filterValues: Array<{ name: string; value: any }>;
            importance: number;
            key?: string;
            metadata?: Record<string, any>;
            replacedAt?: number;
            status: "pending" | "ready" | "replaced";
            title?: string;
          } | null;
        }
      >;
    };
    namespaces: {
      deleteNamespace: FunctionReference<
        "mutation",
        "internal",
        { namespaceId: string },
        {
          deletedNamespace: null | {
            createdAt: number;
            dimension: number;
            filterNames: Array<string>;
            modelId: string;
            namespace: string;
            namespaceId: string;
            status: "pending" | "ready" | "replaced";
            version: number;
          };
        }
      >;
      deleteNamespaceSync: FunctionReference<
        "action",
        "internal",
        { namespaceId: string },
        null
      >;
      get: FunctionReference<
        "query",
        "internal",
        {
          dimension: number;
          filterNames: Array<string>;
          modelId: string;
          namespace: string;
        },
        null | {
          createdAt: number;
          dimension: number;
          filterNames: Array<string>;
          modelId: string;
          namespace: string;
          namespaceId: string;
          status: "pending" | "ready" | "replaced";
          version: number;
        }
      >;
      getOrCreate: FunctionReference<
        "mutation",
        "internal",
        {
          dimension: number;
          filterNames: Array<string>;
          modelId: string;
          namespace: string;
          onComplete?: string;
          status: "pending" | "ready";
        },
        { namespaceId: string; status: "pending" | "ready" }
      >;
      list: FunctionReference<
        "query",
        "internal",
        {
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
          status: "pending" | "ready" | "replaced";
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            createdAt: number;
            dimension: number;
            filterNames: Array<string>;
            modelId: string;
            namespace: string;
            namespaceId: string;
            status: "pending" | "ready" | "replaced";
            version: number;
          }>;
          pageStatus?: "SplitRecommended" | "SplitRequired" | null;
          splitCursor?: string | null;
        }
      >;
      listNamespaceVersions: FunctionReference<
        "query",
        "internal",
        {
          namespace: string;
          paginationOpts: {
            cursor: string | null;
            endCursor?: string | null;
            id?: number;
            maximumBytesRead?: number;
            maximumRowsRead?: number;
            numItems: number;
          };
        },
        {
          continueCursor: string;
          isDone: boolean;
          page: Array<{
            createdAt: number;
            dimension: number;
            filterNames: Array<string>;
            modelId: string;
            namespace: string;
            namespaceId: string;
            status: "pending" | "ready" | "replaced";
            version: number;
          }>;
          pageStatus?: "SplitRecommended" | "SplitRequired" | null;
          splitCursor?: string | null;
        }
      >;
      lookup: FunctionReference<
        "query",
        "internal",
        {
          dimension: number;
          filterNames: Array<string>;
          modelId: string;
          namespace: string;
        },
        null | string
      >;
      promoteToReady: FunctionReference<
        "mutation",
        "internal",
        { namespaceId: string },
        {
          replacedNamespace: null | {
            createdAt: number;
            dimension: number;
            filterNames: Array<string>;
            modelId: string;
            namespace: string;
            namespaceId: string;
            status: "pending" | "ready" | "replaced";
            version: number;
          };
        }
      >;
    };
    search: {
      search: FunctionReference<
        "action",
        "internal",
        {
          chunkContext?: { after: number; before: number };
          embedding: Array<number>;
          filters: Array<{ name: string; value: any }>;
          limit: number;
          modelId: string;
          namespace: string;
          vectorScoreThreshold?: number;
        },
        {
          entries: Array<{
            contentHash?: string;
            entryId: string;
            filterValues: Array<{ name: string; value: any }>;
            importance: number;
            key?: string;
            metadata?: Record<string, any>;
            replacedAt?: number;
            status: "pending" | "ready" | "replaced";
            title?: string;
          }>;
          results: Array<{
            content: Array<{ metadata?: Record<string, any>; text: string }>;
            entryId: string;
            order: number;
            score: number;
            startOrder: number;
          }>;
        }
      >;
    };
  };
  neutralCost: {
    aiCosts: {
      addAICost: FunctionReference<
        "action",
        "internal",
        {
          markupMultiplier?: number;
          messageId: string;
          modelId: string;
          providerId: string;
          threadId: string;
          usage: {
            cachedInputTokens?: number;
            completionTokens: number;
            promptTokens: number;
            reasoningTokens?: number;
            totalTokens: number;
          };
          userId?: string;
        },
        any
      >;
      getAICostByMessageId: FunctionReference<
        "query",
        "internal",
        { messageId: string },
        any
      >;
      getAICostsByThread: FunctionReference<
        "query",
        "internal",
        { threadId: string },
        Array<{
          _creationTime: number;
          _id: string;
          cost: {
            cachedInputTokensCost?: number;
            completionTokensCost: number;
            promptTokensCost: number;
            reasoningTokensCost?: number;
            totalCost: number;
          };
          costForUser: {
            cachedInputTokensCost?: number;
            completionTokensCost: number;
            promptTokensCost: number;
            reasoningTokensCost?: number;
            totalCost: number;
          };
          messageId: string;
          threadId: string;
          usage: {
            cachedInputTokens?: number;
            completionTokens: number;
            promptTokens: number;
            reasoningTokens?: number;
            totalTokens: number;
          };
          userId?: string;
        }>
      >;
      getAICostsByUser: FunctionReference<
        "query",
        "internal",
        { userId: string },
        Array<{
          _creationTime: number;
          _id: string;
          cost: {
            cachedInputTokensCost?: number;
            completionTokensCost: number;
            promptTokensCost: number;
            reasoningTokensCost?: number;
            totalCost: number;
          };
          costForUser: {
            cachedInputTokensCost?: number;
            completionTokensCost: number;
            promptTokensCost: number;
            reasoningTokensCost?: number;
            totalCost: number;
          };
          messageId: string;
          threadId: string;
          usage: {
            cachedInputTokens?: number;
            completionTokens: number;
            promptTokens: number;
            reasoningTokens?: number;
            totalTokens: number;
          };
          userId?: string;
        }>
      >;
      getTotalAICostsByThread: FunctionReference<
        "query",
        "internal",
        { threadId: string },
        any
      >;
      getTotalAICostsByUser: FunctionReference<
        "query",
        "internal",
        { userId: string },
        any
      >;
    };
    markup: {
      deleteMarkup: FunctionReference<
        "mutation",
        "internal",
        {
          modelId?: string;
          providerId: string;
          scope: "provider" | "model" | "tool";
          toolId?: string;
        },
        boolean
      >;
      getMarkupMultiplier: FunctionReference<
        "query",
        "internal",
        { modelId?: string; providerId: string; toolId?: string },
        number
      >;
      getMarkupMultiplierById: FunctionReference<
        "query",
        "internal",
        { markupMultiplierId: string },
        any
      >;
      getMarkupMultipliers: FunctionReference<
        "query",
        "internal",
        {},
        {
          modelMarkupMultipliers: Array<{
            markupMultiplier: number;
            modelId: string;
            providerId: string;
          }>;
          providerMultipliers: Array<{
            markupMultiplier: number;
            providerId: string;
          }>;
          toolMarkupMultipliers: Array<{
            markupMultiplier: number;
            providerId: string;
            toolId: string;
          }>;
        }
      >;
      upsertModelMarkup: FunctionReference<
        "mutation",
        "internal",
        {
          markupMultiplier: number;
          modelId: string;
          providerId: string;
          scope: "model";
        },
        string
      >;
      upsertProviderMarkup: FunctionReference<
        "mutation",
        "internal",
        { markupMultiplier: number; providerId: string; scope: "provider" },
        string
      >;
      upsertToolMarkup: FunctionReference<
        "mutation",
        "internal",
        {
          markupMultiplier: number;
          providerId: string;
          scope: "tool";
          toolId: string;
        },
        string
      >;
    };
    pricing: {
      deleteToolPricing: FunctionReference<
        "mutation",
        "internal",
        { modelId?: string; providerId: string },
        any
      >;
      getAllPricing: FunctionReference<"query", "internal", {}, any>;
      getAllToolPricing: FunctionReference<"query", "internal", {}, any>;
      getPricing: FunctionReference<
        "query",
        "internal",
        { modelId: string; providerId: string },
        any
      >;
      getPricingByProvider: FunctionReference<
        "query",
        "internal",
        { providerId: string },
        any
      >;
      getToolPricing: FunctionReference<
        "query",
        "internal",
        { providerId: string; toolId: string },
        any
      >;
      getToolPricingByProvider: FunctionReference<
        "query",
        "internal",
        { providerId: string },
        any
      >;
      searchPricingByModelName: FunctionReference<
        "query",
        "internal",
        { searchTerm: string },
        any
      >;
      updatePricingData: FunctionReference<
        "action",
        "internal",
        { envKeys?: Record<string, string> },
        any
      >;
      updatePricingTable: FunctionReference<
        "mutation",
        "internal",
        {
          pricingData: Array<{
            lastUpdated: number;
            limits: { context: number; output: number };
            modelId: string;
            modelName: string;
            pricing: {
              cache_read?: number;
              cache_write?: number;
              input: number;
              output: number;
              reasoning?: number;
            };
            providerId: string;
            providerName: string;
          }>;
        },
        any
      >;
      upsertToolPricing: FunctionReference<
        "mutation",
        "internal",
        {
          limits?: {
            maxBytesPerRequest?: number;
            maxConcurrentRequests?: number;
            maxRequestsPerDay?: number;
            maxRequestsPerHour?: number;
            maxRequestsPerMinute?: number;
            maxRequestsPerMonth?: number;
            maxRequestsPerSecond?: number;
            maxTokensPerRequest?: number;
          };
          modelId?: string;
          modelName?: string;
          pricing:
            | {
                costPerCredit: number;
                creditTypes?: Record<string, number>;
                currency: string;
                type: "credits";
              }
            | {
                cache_read?: number;
                cache_write?: number;
                currency: string;
                input: number;
                output: number;
                reasoning?: number;
                type: "tokens";
              }
            | {
                costPerRequest: number;
                currency: string;
                requestTypes?: Record<string, number>;
                type: "requests";
              }
            | {
                computeTypes?: Record<string, number>;
                costPerMs: number;
                currency: string;
                tiers?: Record<string, number>;
                type: "compute";
              }
            | {
                costPerByteSecond: number;
                currency: string;
                storageClasses?: Record<string, number>;
                type: "storage";
              }
            | {
                costPerByteIn?: number;
                costPerByteOut?: number;
                currency: string;
                regions?: Record<string, number>;
                type: "bandwidth";
              }
            | {
                costPerUnit: number;
                currency: string;
                type: "units";
                unitType: string;
              }
            | {
                currency: string;
                tiers: Array<{ from: number; rate: number; to?: number }>;
                type: "tiered";
                unitType: string;
              }
            | {
                components: Array<{
                  costPerUnit: number;
                  name: string;
                  unitType: string;
                }>;
                currency: string;
                type: "composite";
              }
            | {
                currency: string;
                data: any;
                description?: string;
                type: "custom";
              };
          providerId: string;
          providerName: string;
        },
        any
      >;
    };
    toolCosts: {
      addToolCost: FunctionReference<
        "action",
        "internal",
        {
          markupMultiplier?: number;
          messageId: string;
          providerId: string;
          threadId: string;
          toolId: string;
          usage:
            | { creditType?: string; credits: number; type: "credits" }
            | {
                cacheReadTokens?: number;
                cacheWriteTokens?: number;
                inputTokens: number;
                outputTokens: number;
                reasoningTokens?: number;
                type: "tokens";
              }
            | { requestType?: string; requests: number; type: "requests" }
            | {
                computeType?: string;
                durationMs: number;
                tier?: string;
                type: "compute";
              }
            | {
                bytes: number;
                durationSeconds?: number;
                storageClass?: string;
                type: "storage";
              }
            | {
                bytesIn?: number;
                bytesOut?: number;
                region?: string;
                type: "bandwidth";
              }
            | {
                metadata?: Record<string, any>;
                type: "units";
                unitType: string;
                units: number;
              }
            | {
                quantity: number;
                tierName?: string;
                type: "tiered";
                unitType: string;
              }
            | {
                components: Array<{
                  cost?: number;
                  name: string;
                  quantity: number;
                  unitType: string;
                }>;
                type: "composite";
              }
            | { data: any; description?: string; type: "custom" };
          userId?: string;
        },
        any
      >;
      getToolCostsByProviderAndTool: FunctionReference<
        "query",
        "internal",
        { providerId: string; toolId?: string },
        any
      >;
      getToolCostsByThread: FunctionReference<
        "query",
        "internal",
        { threadId: string },
        Array<{
          _creationTime: number;
          _id: string;
          cost: {
            amount: number;
            breakdown?:
              | { costPerCredit: number; credits: number; type: "credits" }
              | {
                  cacheReadTokensCost?: number;
                  cacheWriteTokensCost?: number;
                  inputTokensCost?: number;
                  outputTokensCost?: number;
                  reasoningTokensCost?: number;
                  type: "tokens";
                }
              | { costPerRequest: number; requests: number; type: "requests" }
              | {
                  computeType?: string;
                  costPerMs: number;
                  durationMs: number;
                  type: "compute";
                }
              | {
                  bytes: number;
                  costPerByteSecond: number;
                  durationSeconds: number;
                  type: "storage";
                }
              | {
                  bytesInCost?: number;
                  bytesOutCost?: number;
                  type: "bandwidth";
                }
              | {
                  costPerUnit: number;
                  type: "units";
                  unitType: string;
                  units: number;
                }
              | {
                  effectiveRate: number;
                  quantity: number;
                  tierApplied: string;
                  type: "tiered";
                }
              | {
                  components: Array<{
                    name: string;
                    quantity: number;
                    totalCost: number;
                    unitCost: number;
                  }>;
                  type: "composite";
                }
              | { data: any; type: "custom" };
            currency: string;
          };
          costForUser: {
            amount: number;
            breakdown?:
              | { costPerCredit: number; credits: number; type: "credits" }
              | {
                  cacheReadTokensCost?: number;
                  cacheWriteTokensCost?: number;
                  inputTokensCost?: number;
                  outputTokensCost?: number;
                  reasoningTokensCost?: number;
                  type: "tokens";
                }
              | { costPerRequest: number; requests: number; type: "requests" }
              | {
                  computeType?: string;
                  costPerMs: number;
                  durationMs: number;
                  type: "compute";
                }
              | {
                  bytes: number;
                  costPerByteSecond: number;
                  durationSeconds: number;
                  type: "storage";
                }
              | {
                  bytesInCost?: number;
                  bytesOutCost?: number;
                  type: "bandwidth";
                }
              | {
                  costPerUnit: number;
                  type: "units";
                  unitType: string;
                  units: number;
                }
              | {
                  effectiveRate: number;
                  quantity: number;
                  tierApplied: string;
                  type: "tiered";
                }
              | {
                  components: Array<{
                    name: string;
                    quantity: number;
                    totalCost: number;
                    unitCost: number;
                  }>;
                  type: "composite";
                }
              | { data: any; type: "custom" };
            currency: string;
            markupMultiplier?: number;
          };
          messageId: string;
          providerId: string;
          threadId: string;
          timestamp: number;
          toolId: string;
          usage:
            | { creditType?: string; credits: number; type: "credits" }
            | {
                cacheReadTokens?: number;
                cacheWriteTokens?: number;
                inputTokens: number;
                outputTokens: number;
                reasoningTokens?: number;
                type: "tokens";
              }
            | { requestType?: string; requests: number; type: "requests" }
            | {
                computeType?: string;
                durationMs: number;
                tier?: string;
                type: "compute";
              }
            | {
                bytes: number;
                durationSeconds?: number;
                storageClass?: string;
                type: "storage";
              }
            | {
                bytesIn?: number;
                bytesOut?: number;
                region?: string;
                type: "bandwidth";
              }
            | {
                metadata?: Record<string, any>;
                type: "units";
                unitType: string;
                units: number;
              }
            | {
                quantity: number;
                tierName?: string;
                type: "tiered";
                unitType: string;
              }
            | {
                components: Array<{
                  cost?: number;
                  name: string;
                  quantity: number;
                  unitType: string;
                }>;
                type: "composite";
              }
            | { data: any; description?: string; type: "custom" };
          userId?: string;
        }>
      >;
      getToolCostsByUser: FunctionReference<
        "query",
        "internal",
        { userId: string },
        Array<{
          _creationTime: number;
          _id: string;
          cost: {
            amount: number;
            breakdown?:
              | { costPerCredit: number; credits: number; type: "credits" }
              | {
                  cacheReadTokensCost?: number;
                  cacheWriteTokensCost?: number;
                  inputTokensCost?: number;
                  outputTokensCost?: number;
                  reasoningTokensCost?: number;
                  type: "tokens";
                }
              | { costPerRequest: number; requests: number; type: "requests" }
              | {
                  computeType?: string;
                  costPerMs: number;
                  durationMs: number;
                  type: "compute";
                }
              | {
                  bytes: number;
                  costPerByteSecond: number;
                  durationSeconds: number;
                  type: "storage";
                }
              | {
                  bytesInCost?: number;
                  bytesOutCost?: number;
                  type: "bandwidth";
                }
              | {
                  costPerUnit: number;
                  type: "units";
                  unitType: string;
                  units: number;
                }
              | {
                  effectiveRate: number;
                  quantity: number;
                  tierApplied: string;
                  type: "tiered";
                }
              | {
                  components: Array<{
                    name: string;
                    quantity: number;
                    totalCost: number;
                    unitCost: number;
                  }>;
                  type: "composite";
                }
              | { data: any; type: "custom" };
            currency: string;
          };
          costForUser: {
            amount: number;
            breakdown?:
              | { costPerCredit: number; credits: number; type: "credits" }
              | {
                  cacheReadTokensCost?: number;
                  cacheWriteTokensCost?: number;
                  inputTokensCost?: number;
                  outputTokensCost?: number;
                  reasoningTokensCost?: number;
                  type: "tokens";
                }
              | { costPerRequest: number; requests: number; type: "requests" }
              | {
                  computeType?: string;
                  costPerMs: number;
                  durationMs: number;
                  type: "compute";
                }
              | {
                  bytes: number;
                  costPerByteSecond: number;
                  durationSeconds: number;
                  type: "storage";
                }
              | {
                  bytesInCost?: number;
                  bytesOutCost?: number;
                  type: "bandwidth";
                }
              | {
                  costPerUnit: number;
                  type: "units";
                  unitType: string;
                  units: number;
                }
              | {
                  effectiveRate: number;
                  quantity: number;
                  tierApplied: string;
                  type: "tiered";
                }
              | {
                  components: Array<{
                    name: string;
                    quantity: number;
                    totalCost: number;
                    unitCost: number;
                  }>;
                  type: "composite";
                }
              | { data: any; type: "custom" };
            currency: string;
            markupMultiplier?: number;
          };
          messageId: string;
          providerId: string;
          threadId: string;
          timestamp: number;
          toolId: string;
          usage:
            | { creditType?: string; credits: number; type: "credits" }
            | {
                cacheReadTokens?: number;
                cacheWriteTokens?: number;
                inputTokens: number;
                outputTokens: number;
                reasoningTokens?: number;
                type: "tokens";
              }
            | { requestType?: string; requests: number; type: "requests" }
            | {
                computeType?: string;
                durationMs: number;
                tier?: string;
                type: "compute";
              }
            | {
                bytes: number;
                durationSeconds?: number;
                storageClass?: string;
                type: "storage";
              }
            | {
                bytesIn?: number;
                bytesOut?: number;
                region?: string;
                type: "bandwidth";
              }
            | {
                metadata?: Record<string, any>;
                type: "units";
                unitType: string;
                units: number;
              }
            | {
                quantity: number;
                tierName?: string;
                type: "tiered";
                unitType: string;
              }
            | {
                components: Array<{
                  cost?: number;
                  name: string;
                  quantity: number;
                  unitType: string;
                }>;
                type: "composite";
              }
            | { data: any; description?: string; type: "custom" };
          userId?: string;
        }>
      >;
      getTotalToolCostsByThread: FunctionReference<
        "query",
        "internal",
        { threadId: string },
        any
      >;
      getTotalToolCostsByUser: FunctionReference<
        "query",
        "internal",
        { userId: string },
        any
      >;
    };
  };
  aggregateBriefs: {
    btree: {
      aggregateBetween: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any },
        { count: number; sum: number }
      >;
      aggregateBetweenBatch: FunctionReference<
        "query",
        "internal",
        { queries: Array<{ k1?: any; k2?: any; namespace?: any }> },
        Array<{ count: number; sum: number }>
      >;
      atNegativeOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffsetBatch: FunctionReference<
        "query",
        "internal",
        {
          queries: Array<{
            k1?: any;
            k2?: any;
            namespace?: any;
            offset: number;
          }>;
        },
        Array<{ k: any; s: number; v: any }>
      >;
      get: FunctionReference<
        "query",
        "internal",
        { key: any; namespace?: any },
        null | { k: any; s: number; v: any }
      >;
      offset: FunctionReference<
        "query",
        "internal",
        { k1?: any; key: any; namespace?: any },
        number
      >;
      offsetUntil: FunctionReference<
        "query",
        "internal",
        { k2?: any; key: any; namespace?: any },
        number
      >;
      paginate: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          k1?: any;
          k2?: any;
          limit: number;
          namespace?: any;
          order: "asc" | "desc";
        },
        {
          cursor: string;
          isDone: boolean;
          page: Array<{ k: any; s: number; v: any }>;
        }
      >;
      paginateNamespaces: FunctionReference<
        "query",
        "internal",
        { cursor?: string; limit: number },
        { cursor: string; isDone: boolean; page: Array<any> }
      >;
      validate: FunctionReference<
        "query",
        "internal",
        { namespace?: any },
        any
      >;
    };
    inspect: {
      display: FunctionReference<"query", "internal", { namespace?: any }, any>;
      dump: FunctionReference<"query", "internal", { namespace?: any }, string>;
      inspectNode: FunctionReference<
        "query",
        "internal",
        { namespace?: any; node?: string },
        null
      >;
      listTreeNodes: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          aggregate?: { count: number; sum: number };
          items: Array<{ k: any; s: number; v: any }>;
          subtrees: Array<string>;
        }>
      >;
      listTrees: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          maxNodeSize: number;
          namespace?: any;
          root: string;
        }>
      >;
    };
    public: {
      clear: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      delete_: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        null
      >;
      deleteIfExists: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        any
      >;
      init: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any; summand?: number; value: any },
        null
      >;
      makeRootLazy: FunctionReference<
        "mutation",
        "internal",
        { namespace?: any },
        null
      >;
      replace: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        null
      >;
      replaceOrInsert: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        any
      >;
    };
  };
  aggregateKeywords: {
    btree: {
      aggregateBetween: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any },
        { count: number; sum: number }
      >;
      aggregateBetweenBatch: FunctionReference<
        "query",
        "internal",
        { queries: Array<{ k1?: any; k2?: any; namespace?: any }> },
        Array<{ count: number; sum: number }>
      >;
      atNegativeOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffsetBatch: FunctionReference<
        "query",
        "internal",
        {
          queries: Array<{
            k1?: any;
            k2?: any;
            namespace?: any;
            offset: number;
          }>;
        },
        Array<{ k: any; s: number; v: any }>
      >;
      get: FunctionReference<
        "query",
        "internal",
        { key: any; namespace?: any },
        null | { k: any; s: number; v: any }
      >;
      offset: FunctionReference<
        "query",
        "internal",
        { k1?: any; key: any; namespace?: any },
        number
      >;
      offsetUntil: FunctionReference<
        "query",
        "internal",
        { k2?: any; key: any; namespace?: any },
        number
      >;
      paginate: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          k1?: any;
          k2?: any;
          limit: number;
          namespace?: any;
          order: "asc" | "desc";
        },
        {
          cursor: string;
          isDone: boolean;
          page: Array<{ k: any; s: number; v: any }>;
        }
      >;
      paginateNamespaces: FunctionReference<
        "query",
        "internal",
        { cursor?: string; limit: number },
        { cursor: string; isDone: boolean; page: Array<any> }
      >;
      validate: FunctionReference<
        "query",
        "internal",
        { namespace?: any },
        any
      >;
    };
    inspect: {
      display: FunctionReference<"query", "internal", { namespace?: any }, any>;
      dump: FunctionReference<"query", "internal", { namespace?: any }, string>;
      inspectNode: FunctionReference<
        "query",
        "internal",
        { namespace?: any; node?: string },
        null
      >;
      listTreeNodes: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          aggregate?: { count: number; sum: number };
          items: Array<{ k: any; s: number; v: any }>;
          subtrees: Array<string>;
        }>
      >;
      listTrees: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          maxNodeSize: number;
          namespace?: any;
          root: string;
        }>
      >;
    };
    public: {
      clear: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      delete_: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        null
      >;
      deleteIfExists: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        any
      >;
      init: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any; summand?: number; value: any },
        null
      >;
      makeRootLazy: FunctionReference<
        "mutation",
        "internal",
        { namespace?: any },
        null
      >;
      replace: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        null
      >;
      replaceOrInsert: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        any
      >;
    };
  };
  aggregate: {
    btree: {
      aggregateBetween: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any },
        { count: number; sum: number }
      >;
      aggregateBetweenBatch: FunctionReference<
        "query",
        "internal",
        { queries: Array<{ k1?: any; k2?: any; namespace?: any }> },
        Array<{ count: number; sum: number }>
      >;
      atNegativeOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffsetBatch: FunctionReference<
        "query",
        "internal",
        {
          queries: Array<{
            k1?: any;
            k2?: any;
            namespace?: any;
            offset: number;
          }>;
        },
        Array<{ k: any; s: number; v: any }>
      >;
      get: FunctionReference<
        "query",
        "internal",
        { key: any; namespace?: any },
        null | { k: any; s: number; v: any }
      >;
      offset: FunctionReference<
        "query",
        "internal",
        { k1?: any; key: any; namespace?: any },
        number
      >;
      offsetUntil: FunctionReference<
        "query",
        "internal",
        { k2?: any; key: any; namespace?: any },
        number
      >;
      paginate: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          k1?: any;
          k2?: any;
          limit: number;
          namespace?: any;
          order: "asc" | "desc";
        },
        {
          cursor: string;
          isDone: boolean;
          page: Array<{ k: any; s: number; v: any }>;
        }
      >;
      paginateNamespaces: FunctionReference<
        "query",
        "internal",
        { cursor?: string; limit: number },
        { cursor: string; isDone: boolean; page: Array<any> }
      >;
      validate: FunctionReference<
        "query",
        "internal",
        { namespace?: any },
        any
      >;
    };
    inspect: {
      display: FunctionReference<"query", "internal", { namespace?: any }, any>;
      dump: FunctionReference<"query", "internal", { namespace?: any }, string>;
      inspectNode: FunctionReference<
        "query",
        "internal",
        { namespace?: any; node?: string },
        null
      >;
      listTreeNodes: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          aggregate?: { count: number; sum: number };
          items: Array<{ k: any; s: number; v: any }>;
          subtrees: Array<string>;
        }>
      >;
      listTrees: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          maxNodeSize: number;
          namespace?: any;
          root: string;
        }>
      >;
    };
    public: {
      clear: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      delete_: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        null
      >;
      deleteIfExists: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        any
      >;
      init: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any; summand?: number; value: any },
        null
      >;
      makeRootLazy: FunctionReference<
        "mutation",
        "internal",
        { namespace?: any },
        null
      >;
      replace: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        null
      >;
      replaceOrInsert: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        any
      >;
    };
  };
};

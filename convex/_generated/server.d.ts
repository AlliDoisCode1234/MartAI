/* eslint-disable */
/**
 * Generated server utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ActionBuilder,
  HttpActionBuilder,
  MutationBuilder,
  QueryBuilder,
} from "convex/server";
import type { DataModel } from "./dataModel";
import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { GenericId } from "convex/values";

/**
 * Define a query in this Convex app's public API.
 *
 * This function will be allowed to read your Convex database and will be accessible from the client.
 *
 * @param func - The query function. It receives a {@link QueryCtx} as its first argument.
 * @returns The wrapped query. Include this as an `export` to name it and make it accessible.
 */
export declare const query: QueryBuilder<"public", "query">;

/**
 * Define a mutation in this Convex app's public API.
 *
 * This function will be allowed to modify your Convex database and will be accessible from the client.
 *
 * @param func - The mutation function. It receives a {@link MutationCtx} as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to name it and make it accessible.
 */
export declare const mutation: MutationBuilder<"public", "mutation">;

/**
 * Define an action in this Convex app's public API.
 *
 * An action is a function that can use external APIs and multiple Convex queries/mutations.
 *
 * @param func - The action. It receives an {@link ActionCtx} as its first argument.
 * @returns The wrapped action. Include this as an `export` to name it and make it accessible.
 */
export declare const action: ActionBuilder<"public", "action">;

/**
 * Define an HTTP action.
 *
 * This function will be called when the Convex HTTP API receives a request to the path where this
 * function is routed.
 *
 * @param func - The HTTP action. It receives an {@link HttpActionCtx} as its first argument.
 * @returns The wrapped HTTP action. Include this as an `export` to name it and make it accessible.
 */
export declare const httpAction: HttpActionBuilder;

/**
 * A set of services for use within Convex mutation, query, and action functions.
 *
 * The `QueryCtx` is passed as the first argument to any Convex query
 * or internal mutation function.
 */
export type QueryCtx = GenericQueryCtx<DataModel>;

/**
 * A set of services for use within Convex mutation functions.
 *
 * The `MutationCtx` is passed as the first argument to any Convex mutation
 * or internal mutation function.
 */
export type MutationCtx = GenericMutationCtx<DataModel>;

/**
 * A type representing your Convex data model.
 *
 * This type includes information about your tables and the indexes defined on them.
 *
 * @typeParam TTableName - The name of the table to get the type for.
 */
export type DataModel = {
  clients: {
    _id: GenericId<"clients">;
    _creationTime: number;
    companyName: string;
    website: string;
    industry: string;
    targetAudience: string;
    monthlyRevenueGoal?: string;
    userId: string;
    createdAt: number;
    updatedAt: number;
  };
  keywords: {
    _id: GenericId<"keywords">;
    _creationTime: number;
    clientId: GenericId<"clients">;
    keyword: string;
    searchVolume?: number;
    difficulty?: number;
    cpc?: number;
    intent?: string;
    priority?: string;
    status: string;
    createdAt: number;
  };
  oauthTokens: {
    _id: GenericId<"oauthTokens">;
    _creationTime: number;
    clientId: GenericId<"clients">;
    platform: string;
    accessToken: string;
    refreshToken?: string;
    tokenExpiry?: number;
    siteUrl: string;
    shopifyShop?: string;
    wordpressSiteId?: string;
    createdAt: number;
    updatedAt: number;
  };
  pages: {
    _id: GenericId<"pages">;
    _creationTime: number;
    clientId: GenericId<"clients">;
    platform: string;
    pageId: string;
    pageUrl: string;
    title: string;
    content: string;
    keywords: string[];
    status: string;
    createdAt: number;
    updatedAt: number;
  };
  rankings: {
    _id: GenericId<"rankings">;
    _creationTime: number;
    clientId: GenericId<"clients">;
    keyword: string;
    position: number;
    url: string;
    searchEngine: string;
    location?: string;
    date: number;
  };
  seoAudits: {
    _id: GenericId<"seoAudits">;
    _creationTime: number;
    clientId: GenericId<"clients">;
    website: string;
    overallScore: number;
    technicalSeo: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    onPageSeo: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    contentQuality: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    backlinks: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    priorityActions: string[];
    pageSpeed?: number;
    mobileFriendly?: boolean;
    sslEnabled?: boolean;
    indexedPages?: number;
    crawlErrors?: number;
    createdAt: number;
  };
  seoStatistics: {
    _id: GenericId<"seoStatistics">;
    _creationTime: number;
    clientId: GenericId<"clients">;
    organicTraffic?: number;
    organicKeywords?: number;
    backlinks?: number;
    referringDomains?: number;
    avgPosition?: number;
    clickThroughRate?: number;
    impressions?: number;
    periodStart: number;
    periodEnd: number;
    createdAt: number;
  };
};


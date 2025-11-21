/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as clients from "../clients";
import type * as keywords from "../keywords";
import type * as oauth from "../oauth";
import type * as pages from "../pages";
import type * as rankings from "../rankings";
import type * as schema from "../schema";
import type * as seoAudits from "../seoAudits";
import type * as statistics from "../statistics";

/**
 * A utility for type-safe Convex queries and mutations.
 *
 * Used to generate type-safe query and mutation hooks.
 */
declare const fullApi: ApiFromModules<{
  clients: typeof clients;
  keywords: typeof keywords;
  oauth: typeof oauth;
  pages: typeof pages;
  rankings: typeof rankings;
  schema: typeof schema;
  schema: typeof schema;
  seoAudits: typeof seoAudits;
  statistics: typeof statistics;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;


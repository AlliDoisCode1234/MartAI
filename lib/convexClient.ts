import { ConvexHttpClient } from "convex/browser";
import type { FunctionReference } from "convex/server";
import type {
  ProjectId,
  BriefId,
  DraftId,
  ClusterId,
  PlanId,
  UserId,
  ClientId,
  InsightId,
  CompetitorId,
  BriefVersionId,
  ScheduledPostId,
} from "@/types";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

// Dynamically import api to avoid build errors when Convex not initialized
// Use any for the dynamic import since it may not exist during build
let api: any = null;

// Only try to import in Node.js environment (not during build)
if (typeof window === 'undefined') {
  try {
    const apiModule = require("../convex/_generated/api");
    api = apiModule?.api || null;
  } catch (error) {
    // API not generated yet - this is expected until npx convex dev is run
    api = null;
  }
}

if (!convexUrl) {
  console.warn("NEXT_PUBLIC_CONVEX_URL is not set. Convex features will not work.");
}

export const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null;

// Type-safe helper to call Convex mutations from API routes
// Generic type preserves the mutation's argument and return types
export async function callConvexMutation<Args = any, Return = any>(
  mutation: any,
  args: Args
): Promise<Return> {
  if (!convexUrl || !convexClient) {
    throw new Error("Convex is not configured. Set NEXT_PUBLIC_CONVEX_URL");
  }
  if (!api) {
    throw new Error("Convex API not generated. Run 'npx convex dev'");
  }
  return await convexClient.mutation(mutation, args);
}

// Type-safe helper to call Convex queries from API routes
// Generic type preserves the query's argument and return types
export async function callConvexQuery<Args = any, Return = any>(
  query: any,
  args: Args
): Promise<Return> {
  if (!convexUrl || !convexClient) {
    throw new Error("Convex is not configured. Set NEXT_PUBLIC_CONVEX_URL");
  }
  if (!api) {
    throw new Error("Convex API not generated. Run 'npx convex dev'");
  }
  return await convexClient.query(query, args);
}

// Type-safe helper to call Convex actions from API routes
export async function callConvexAction<Args = any, Return = any>(
  action: any,
  args: Args
): Promise<Return> {
  if (!convexUrl || !convexClient) {
    throw new Error("Convex is not configured. Set NEXT_PUBLIC_CONVEX_URL");
  }
  if (!api) {
    throw new Error("Convex API not generated. Run 'npx convex dev'");
  }
  return await convexClient.action(action, args);
}

// Export api for use in API routes
export { api };


import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

// Dynamically import api to avoid build errors when Convex not initialized
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

// Helper to call Convex mutations from API routes
export async function callConvexMutation(mutation: any, args: any) {
  if (!convexUrl || !convexClient) {
    throw new Error("Convex is not configured. Set NEXT_PUBLIC_CONVEX_URL");
  }
  if (!api) {
    throw new Error("Convex API not generated. Run 'npx convex dev'");
  }
  return await convexClient.mutation(mutation, args);
}

// Helper to call Convex queries from API routes
export async function callConvexQuery(query: any, args: any) {
  if (!convexUrl || !convexClient) {
    throw new Error("Convex is not configured. Set NEXT_PUBLIC_CONVEX_URL");
  }
  if (!api) {
    throw new Error("Convex API not generated. Run 'npx convex dev'");
  }
  return await convexClient.query(query, args);
}

// Export api for use in API routes
export { api };


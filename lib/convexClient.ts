import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

if (!convexUrl) {
  console.warn("NEXT_PUBLIC_CONVEX_URL is not set. Convex features will not work.");
}

export const convexClient = new ConvexHttpClient(convexUrl);

// Helper to call Convex mutations from API routes
export async function callConvexMutation(mutation: any, args: any) {
  if (!convexUrl) {
    throw new Error("Convex is not configured");
  }
  return await convexClient.mutation(mutation, args);
}

// Helper to call Convex queries from API routes
export async function callConvexQuery(query: any, args: any) {
  if (!convexUrl) {
    throw new Error("Convex is not configured");
  }
  return await convexClient.query(query, args);
}

export { api };


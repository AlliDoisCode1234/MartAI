import { ConvexHttpClient } from 'convex/browser';
import type { FunctionReference, FunctionArgs, FunctionReturnType } from 'convex/server';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '';

if (!convexUrl) {
  console.warn('NEXT_PUBLIC_CONVEX_URL is not set. Convex features will not work.');
}

export const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null;

/**
 * Helper to call Convex mutations from API routes.
 * Note: Using simplified generics to avoid TypeScript's "excessively deep" error.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function callConvexMutation<T = any>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any,
  token?: string
): Promise<T> {
  if (!convexUrl || !convexClient) {
    throw new Error('Convex is not configured. Set NEXT_PUBLIC_CONVEX_URL');
  }
  if (token) {
    convexClient.setAuth(token);
  }
  return await convexClient.mutation(mutation, args);
}

/**
 * Type-safe helper to call Convex queries from API routes.
 * Note: Using simplified generics to avoid TypeScript's "excessively deep" error
 * that occurs with complex FunctionReference types during production builds.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function callConvexQuery<T = any>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any,
  token?: string
): Promise<T> {
  if (!convexUrl || !convexClient) {
    throw new Error('Convex is not configured. Set NEXT_PUBLIC_CONVEX_URL');
  }
  if (token) {
    convexClient.setAuth(token);
  }
  return await convexClient.query(query, args);
}

/**
 * Helper to call Convex actions from API routes.
 * Note: Using simplified generics to avoid TypeScript's "excessively deep" error.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function callConvexAction<T = any>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any,
  token?: string
): Promise<T> {
  if (!convexUrl || !convexClient) {
    throw new Error('Convex is not configured. Set NEXT_PUBLIC_CONVEX_URL');
  }
  if (token) {
    convexClient.setAuth(token);
  }
  return await convexClient.action(action, args);
}

// Re-export api from generated module for type-safe access
export { api } from '@/convex/_generated/api';

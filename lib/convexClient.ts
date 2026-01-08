import { ConvexHttpClient } from 'convex/browser';
import type { FunctionReference, FunctionArgs, FunctionReturnType } from 'convex/server';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '';

if (!convexUrl) {
  console.warn('NEXT_PUBLIC_CONVEX_URL is not set. Convex features will not work.');
}

export const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null;

/**
 * Type-safe helper to call Convex mutations from API routes.
 * Uses FunctionReference generics to preserve type safety.
 */
export async function callConvexMutation<Fn extends FunctionReference<'mutation'>>(
  mutation: Fn,
  args: FunctionArgs<Fn>,
  token?: string
): Promise<FunctionReturnType<Fn>> {
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
 * Uses FunctionReference generics to preserve type safety.
 */
export async function callConvexQuery<Fn extends FunctionReference<'query'>>(
  query: Fn,
  args: FunctionArgs<Fn>,
  token?: string
): Promise<FunctionReturnType<Fn>> {
  if (!convexUrl || !convexClient) {
    throw new Error('Convex is not configured. Set NEXT_PUBLIC_CONVEX_URL');
  }
  if (token) {
    convexClient.setAuth(token);
  }
  return await convexClient.query(query, args);
}

/**
 * Type-safe helper to call Convex actions from API routes.
 * Uses FunctionReference generics to preserve type safety.
 */
export async function callConvexAction<Fn extends FunctionReference<'action'>>(
  action: Fn,
  args: FunctionArgs<Fn>,
  token?: string
): Promise<FunctionReturnType<Fn>> {
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

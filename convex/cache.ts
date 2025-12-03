import { components } from "./_generated/api";

// Cache TTLs in milliseconds
export const CACHE_TTL = {
  BRIEF_GENERATION: 7 * 24 * 60 * 60 * 1000, // 7 days
  DRAFT_GENERATION: 3 * 24 * 60 * 60 * 1000, // 3 days
  KEYWORD_CLUSTERING: 30 * 24 * 60 * 60 * 1000, // 30 days
  SERP_ANALYSIS: 24 * 60 * 60 * 1000, // 24 hours
  QUARTERLY_PLANNING: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export const cache = {
  get: async (ctx: any, key: string) => {
    const result = await ctx.runQuery(components.actionCache.lib.get, {
      name: "manual_cache",
      args: key,
      ttl: null,
    });
    if (result.kind === "hit") {
      return result.value;
    }
    return null;
  },
  set: async (ctx: any, key: string, value: any, ttl: number) => {
    await ctx.runMutation(components.actionCache.lib.put, {
      name: "manual_cache",
      args: key,
      value,
      ttl,
    });
  },
};

// Helper to generate cache keys
export function getCacheKey(operation: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);
  
  return `${operation}:${JSON.stringify(sortedParams)}`;
}
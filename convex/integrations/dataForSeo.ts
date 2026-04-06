import { action, internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { fetchWithExponentialBackoff } from '../lib/apiResilience';
import { internal } from '../_generated/api';

/**
 * DATAFORSEO INTEGRATION ARCHITECTURE
 * 
 * Strict implementation of DataForSEO API v3.
 * Adheres to SEAN's Board Guidelines:
 * - Always uses Basic Auth with Base64 encoding.
 * - Always utilizes the Live delivery method for real-time AI context.
 * - Always sends payloads as arrays.
 * - Validates internal status codes (20000+).
 */

const DFS_API_BASE = 'https://api.dataforseo.com/v3';

// ==========================================
// STRICT TYPESCRIPT SCHEMAS (Theo's Matrix)
// ==========================================

export interface DfsKeywordInfo {
  search_volume: number | null;
  cpc: number | null;
  competition_level: 'LOW' | 'MEDIUM' | 'HIGH' | null;
}

export interface DfsKeywordIdeaResult {
  keyword: string;
  keyword_info: DfsKeywordInfo | null;
  keyword_difficulty: number | null;
}

// DataForSEO nests results deep inside response structures.
// Root -> Tasks Array -> Result Array -> Items
export interface DfsTask<T> {
  id: string;
  status_code: number; // 20000 = Task created/completed beautifully
  status_message: string;
  time: string;
  cost: number;
  resultCount: number;
  path: [string, string];
  data: Record<string, any>;
  result: T[] | null;
}

export interface DfsResponse<T> {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks: DfsTask<T>[] | null;
}

// Normalized UI Return Object (SEAN's Mandate)
export interface NormalizedKeywordMetric {
  keyword: string;
  monthlySearches: number; // mapped from search_volume
  adCostCpc: number; // mapped from cpc
  paidCompetition: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN'; // mapped from competition_level
  rankingDifficulty: number; // mapped from keyword_difficulty (0-100)
}

export interface NormalizedSerpUrl {
  url: string;
  title: string;
  rank: number;
}

// ==========================================
// CORE HTTP ABSTRACTION
// ==========================================

/**
 * Builds the authorization header using credentials from the environment.
 * Gracefully degrades into Mock Mode if credentials vanish.
 */
function getAuthHeader(): string | null {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    return null;
  }

  // Base64 encode the string "login:password"
  const authString = `${login}:${password}`;
  return `Basic ${btoa(authString)}`;
}

export async function performDfsRequest(endpointPath: string, payload: any): Promise<DfsResponse<any>> {
  const authHeader = getAuthHeader();

  // ── FALLBACK MOCK MODE ──
  // Ensures CI pipelines, local devs, and tests pass without billing actual DFS credits.
  if (!authHeader) {
    console.warn(`[DataForSEO] Missing API Credentials. Triggering Mock Fallback Route for ${endpointPath}`);
    return _generateMockDfsResponse(endpointPath, payload);
  }

  const url = `${DFS_API_BASE}${endpointPath}`;
  
  // Using MartAI's infrastructure resilience wrapper for automatic retry handling
  const response = await fetchWithExponentialBackoff(url, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`DataForSEO HTTP Error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as DfsResponse<any>;

  // SEAN RULE: Enforce internal API status boundaries along with HTTP bounds.
  if (json.status_code < 20000 || json.status_code >= 30000) {
    throw new Error(`DataForSEO Internal API Error: [${json.status_code}] ${json.status_message}`);
  }

  return json;
}

export const executeDfsRequest = internalAction({
  args: {
    endpointPath: v.string(), // e.g., '/dataforseo_labs/google/keyword_ideas/live'
    payload: v.any(), // Array of tasks
  },
  handler: async (ctx, args) => {
    return performDfsRequest(args.endpointPath, args.payload);
  },
});

// ==========================================
// PUBLIC IMPLEMENTATION BOUNDARIES
// ==========================================

/**
 * Get Keyword Ideas (Live)
 * Automatically translates the massive DataForSEO payload into SEAN's validated nomenclature UI schema.
 */
export const getKeywordIdeas = internalAction({
  args: {
    keywords: v.array(v.string()), // Target keywords to find ideas for
    locationName: v.optional(v.string()), // Default: "United States"
    languageName: v.optional(v.string()), // Default: "English"
  },
  handler: async (ctx, args): Promise<NormalizedKeywordMetric[]> => {
    
    // Per the DataForSEO v3 guidelines, payload must be an array of query objects
    const postPayload = [{
      keywords: args.keywords,
      location_name: args.locationName || 'United States',
      language_name: args.languageName || 'English',
      // Optional limits for cost control
      limit: 50,
    }];

    const responseData = await performDfsRequest(
      '/dataforseo_labs/google/keyword_ideas/live',
      postPayload
    );

    // Type casting specifically for the Labs Keyword idea shape
    const tasks = responseData.tasks;
    if (!tasks || tasks.length === 0 || !tasks[0].result) {
      return [];
    }

    // Because we sent 1 task dictionary in the array, we check tasks[0]
    const rootResult = tasks[0].result[0]; // The root keyword dict
    if (!rootResult || !rootResult.items) {
      return [];
    }

    const rawItems: DfsKeywordIdeaResult[] = rootResult.items;

    // Nomenclature mapping loop
    return rawItems.map(item => ({
      keyword: item.keyword,
      monthlySearches: item.keyword_info?.search_volume ?? 0,
      adCostCpc: item.keyword_info?.cpc ?? 0,
      paidCompetition: item.keyword_info?.competition_level ?? 'UNKNOWN',
      rankingDifficulty: item.keyword_difficulty ?? 0,
    }));
  },
});

/**
 * Get Top Organic SERP URLs (Live)
 * Automatically fetches and extracts actual generic ranking URLs for a cluster's primary keyword.
 */
export const getTopSerpUrls = internalAction({
  args: {
    keyword: v.string(), // Extracted against the primary cluster keyword
    locationName: v.optional(v.string()), // Default: "United States"
    languageName: v.optional(v.string()), // Default: "English"
    limit: v.optional(v.number()), // Defaults to 5 based on LDD Scope
  },
  handler: async (ctx, args): Promise<NormalizedSerpUrl[]> => {
    const postPayload = [{
      keyword: args.keyword,
      location_name: args.locationName || 'United States',
      language_name: args.languageName || 'English',
      depth: args.limit || 5,
    }];

    const responseData = await performDfsRequest(
      '/serp/google/organic/live',
      postPayload
    );

    const tasks = responseData.tasks;
    if (!tasks || tasks.length === 0 || !tasks[0].result) return [];

    const rootResult = tasks[0].result[0];
    if (!rootResult || !rootResult.items) return [];

    const rawItems: Record<string, any>[] = rootResult.items;

    // Filter to organic results and extract only factual competitor URLs
    const organicUrls: NormalizedSerpUrl[] = [];
    for (const item of rawItems) {
      if (item.type === 'organic' && item.url) {
        organicUrls.push({
          url: item.url,
          title: item.title || '',
          rank: item.rank_group || 0,
        });
      }
    }

    return organicUrls;
  },
});

// ==========================================
// LOCAL MOCK DEGRADATION (Testing & Sandbox)
// ==========================================

function _generateMockDfsResponse(endpoint: string, payload: any): DfsResponse<any> {
    
    // Map specifically for keyword_ideas/live mock structure
    if (endpoint.includes('keyword_ideas/live')) {
        const queryList = payload[0].keywords || ['seo'];
        
        const mockItems = queryList.map((q: string) => ({
            keyword: `${q} mock extension`,
            keyword_difficulty: Math.floor(Math.random() * 40) + 40,
            keyword_info: {
                search_volume: Math.floor(Math.random() * 10000) + 100,
                cpc: parseFloat((Math.random() * 10 + 1).toFixed(2)),
                competition_level: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM'
            }
        }));

        return {
            version: "0.1.mock",
            status_code: 20000,
            status_message: "Ok. (MOCK MODE)",
            time: "0.01 sec",
            cost: 0,
            tasks: [{
                id: "mock-task-12345",
                status_code: 20000,
                status_message: "Ok. (MOCK MODE)",
                time: "0.01 sec",
                cost: 0,
                resultCount: 1,
                path: ["v3", "mock"],
                data: payload[0],
                result: [{
                    items: mockItems
                }]
            }]
        }
    }

    // Map specifically for serp/google/organic/live mock structure
    if (endpoint.includes('serp/google/organic/live')) {
        const query = payload[0].keyword || 'seo';
        
        return {
            version: "0.1.mock",
            status_code: 20000,
            status_message: "Ok. (MOCK SERP MODE)",
            time: "0.01 sec",
            cost: 0,
            tasks: [{
                id: "mock-serp-12345",
                status_code: 20000,
                status_message: "Ok. (MOCK MODE)",
                time: "0.01 sec",
                cost: 0,
                resultCount: 1,
                path: ["v3", "mock"],
                data: payload[0],
                result: [{
                    items: [
                        { type: 'organic', rank_group: 1, url: `https://example.com/best-${query.replace(/\s+/g, '-')}`, title: `Best ${query}` },
                        { type: 'organic', rank_group: 2, url: `https://example.com/guide-${query.replace(/\s+/g, '-')}`, title: `Guide to ${query}` },
                        { type: 'organic', rank_group: 3, url: `https://example.com/top-${query.replace(/\s+/g, '-')}`, title: `Top ${query} Software` },
                    ]
                }]
            }]
        }
    }

    // Catch-all standard mock wrapper
    return {
        version: "0.1.mock",
        status_code: 20000,
        status_message: "Ok. (MOCK MODE UNMAPPED)",
        time: "0.01 sec",
        cost: 0,
        tasks: []
    }
}

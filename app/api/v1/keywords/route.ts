import { NextRequest } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import {
  extractApiKey,
  hashApiKey,
  generateRequestId,
  hasPermission,
  apiResponse,
  unauthorizedResponse,
  forbiddenResponse,
  validationErrorResponse,
  internalErrorResponse,
  corsPreflightResponse,
  rateLimitedResponse,
  ApiKeyValidation,
} from '@/lib/apiAuth';

/**
 * Public API v1 - Keywords
 *
 * GET  /api/v1/keywords - List keywords for a project
 * POST /api/v1/keywords - Create keywords
 *
 * @see docs/API_REFERENCE.md
 */

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ============================================
// OPTIONS - CORS Preflight
// ============================================
export async function OPTIONS(): Promise<Response> {
  return corsPreflightResponse();
}

// ============================================
// GET - List Keywords
// ============================================
export async function GET(request: NextRequest): Promise<Response> {
  const requestId = generateRequestId();

  try {
    // Extract and validate API key
    const apiKey = extractApiKey(request);
    if (!apiKey) {
      return unauthorizedResponse(
        'Missing API key. Use Authorization: Bearer mart_xxx or X-API-Key header',
        requestId
      );
    }

    const keyHash = hashApiKey(apiKey);

    // Validate with Convex
    const validation = await convex.query(api.apiKeys.validateApiKey, { keyHash });
    if (!validation) {
      return unauthorizedResponse('Invalid or expired API key', requestId);
    }

    // Check read permission
    if (!hasPermission(validation as ApiKeyValidation, 'read')) {
      return forbiddenResponse('API key does not have read permission', requestId);
    }

    // Check rate limit
    const rateLimit = await convex.mutation(api.apiKeys.checkApiRateLimit, {
      keyId: validation.keyId,
      endpoint: 'keywords_read',
    });

    if (!rateLimit.allowed) {
      return rateLimitedResponse(rateLimit.retryAfter || 60, requestId);
    }

    // Parse query params with validation
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam) || 50), 100) : 50;
    const offset = offsetParam ? Math.max(0, parseInt(offsetParam) || 0) : 0;

    // Fetch keywords for the project
    const keywords = await convex.query(api.seo.keywords.getKeywordsByProject, {
      projectId: validation.projectId,
    });

    // Apply pagination
    const paginatedKeywords = keywords.slice(offset, offset + limit);

    return apiResponse(
      {
        keywords: paginatedKeywords,
        pagination: {
          total: keywords.length,
          limit,
          offset,
          hasMore: offset + limit < keywords.length,
        },
      },
      200,
      requestId,
      {
        limit: rateLimit.limit,
        remaining: rateLimit.remaining,
        resetAt: rateLimit.resetAt,
      }
    );
  } catch (error) {
    console.error(`[${requestId}] Public API error:`, error);
    return internalErrorResponse('An unexpected error occurred', requestId);
  }
}

// ============================================
// POST - Create Keywords
// ============================================
export async function POST(request: NextRequest): Promise<Response> {
  const requestId = generateRequestId();

  try {
    // Extract and validate API key
    const apiKey = extractApiKey(request);
    if (!apiKey) {
      return unauthorizedResponse('Missing API key', requestId);
    }

    const keyHash = hashApiKey(apiKey);
    const validation = await convex.query(api.apiKeys.validateApiKey, { keyHash });
    if (!validation) {
      return unauthorizedResponse('Invalid or expired API key', requestId);
    }

    // Check write permission
    if (!hasPermission(validation as ApiKeyValidation, 'write')) {
      return forbiddenResponse('API key does not have write permission', requestId);
    }

    // Check rate limit
    const rateLimit = await convex.mutation(api.apiKeys.checkApiRateLimit, {
      keyId: validation.keyId,
      endpoint: 'keywords_write',
    });

    if (!rateLimit.allowed) {
      return rateLimitedResponse(rateLimit.retryAfter || 60, requestId);
    }

    // Parse and validate body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return validationErrorResponse('Invalid JSON body', undefined, requestId);
    }

    // Validate keywords array
    if (!body || typeof body !== 'object' || !('keywords' in body)) {
      return validationErrorResponse(
        'Request body must contain a "keywords" array',
        { expected: { keywords: ['string', '...'] } },
        requestId
      );
    }

    const { keywords } = body as { keywords: unknown };

    if (!Array.isArray(keywords)) {
      return validationErrorResponse(
        '"keywords" must be an array of strings',
        { received: typeof keywords },
        requestId
      );
    }

    if (keywords.length === 0) {
      return validationErrorResponse(
        'Keywords array cannot be empty',
        { received: 0, minimum: 1 },
        requestId
      );
    }

    if (keywords.length > 100) {
      return validationErrorResponse(
        'Maximum 100 keywords per request',
        { received: keywords.length, maximum: 100 },
        requestId
      );
    }

    // Validate each keyword is a non-empty string
    const invalidKeywords = keywords.filter(
      (k, i) => typeof k !== 'string' || k.trim().length === 0
    );
    if (invalidKeywords.length > 0) {
      return validationErrorResponse(
        'All keywords must be non-empty strings',
        { invalidCount: invalidKeywords.length },
        requestId
      );
    }

    // Create keywords
    const result = await convex.mutation(api.seo.keywords.createKeywords, {
      projectId: validation.projectId,
      keywords: keywords.map((k: string) => ({
        keyword: k.trim(),
        source: 'api',
      })),
    });

    // Record usage
    convex.mutation(api.apiKeys.recordApiKeyUsage, { keyId: validation.keyId }).catch(() => {});

    return apiResponse(
      {
        created: result,
        count: keywords.length,
      },
      201,
      requestId
    );
  } catch (error) {
    console.error(`[${requestId}] Public API error:`, error);
    return internalErrorResponse('An unexpected error occurred', requestId);
  }
}

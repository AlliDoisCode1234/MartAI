import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import {
  extractApiKey,
  hashApiKey,
  unauthorizedResponse,
  forbiddenResponse,
  apiResponse,
  errorResponse,
  hasPermission,
} from '@/lib/apiAuth';

/**
 * Public API v1 - Keywords
 *
 * GET /api/v1/keywords - List keywords for a project
 *
 * Headers:
 *   Authorization: Bearer mart_xxxxx
 *   or
 *   X-API-Key: mart_xxxxx
 *
 * Query params:
 *   limit: number (default: 50, max: 100)
 *   offset: number (default: 0)
 */

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  try {
    // Extract and validate API key
    const apiKey = extractApiKey(request);
    if (!apiKey) {
      return unauthorizedResponse('Missing API key. Use Authorization: Bearer mart_xxx');
    }

    const keyHash = hashApiKey(apiKey);

    // Validate with Convex
    const validation = await convex.query(api.apiKeys.validateApiKey, { keyHash });
    if (!validation) {
      return unauthorizedResponse('Invalid or expired API key');
    }

    // Check read permission
    if (!hasPermission(validation, 'read')) {
      return forbiddenResponse('API key does not have read permission');
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch keywords for the project
    const keywords = await convex.query(api.seo.keywords.getKeywordsByProject, {
      projectId: validation.projectId,
    });

    // Record usage
    await convex.mutation(api.apiKeys.recordApiKeyUsage, { keyId: validation.keyId });

    // Apply pagination
    const paginatedKeywords = keywords.slice(offset, offset + limit);

    return apiResponse({
      keywords: paginatedKeywords,
      total: keywords.length,
      limit,
      offset,
      hasMore: offset + limit < keywords.length,
    });
  } catch (error) {
    console.error('Public API error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Extract and validate API key
    const apiKey = extractApiKey(request);
    if (!apiKey) {
      return unauthorizedResponse('Missing API key');
    }

    const keyHash = hashApiKey(apiKey);
    const validation = await convex.query(api.apiKeys.validateApiKey, { keyHash });
    if (!validation) {
      return unauthorizedResponse('Invalid or expired API key');
    }

    // Check write permission
    if (!hasPermission(validation, 'write')) {
      return forbiddenResponse('API key does not have write permission');
    }

    // Parse body
    const body = await request.json();
    const { keywords } = body;

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return errorResponse('Keywords array is required');
    }

    if (keywords.length > 100) {
      return errorResponse('Maximum 100 keywords per request');
    }

    // Create keywords
    const result = await convex.mutation(api.seo.keywords.createKeywords, {
      projectId: validation.projectId,
      keywords: keywords.map((k: string) => ({
        keyword: k,
        source: 'api',
      })),
    });

    // Record usage
    await convex.mutation(api.apiKeys.recordApiKeyUsage, { keyId: validation.keyId });

    return apiResponse({ created: result }, 201);
  } catch (error) {
    console.error('Public API error:', error);
    return errorResponse('Internal server error', 500);
  }
}

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
 * Public API v1 - Briefs
 *
 * GET /api/v1/briefs - List content briefs for a project
 *
 * Headers:
 *   Authorization: Bearer mart_xxxxx
 *
 * Query params:
 *   limit: number (default: 50, max: 100)
 *   offset: number (default: 0)
 *   status: string (optional) - filter by status
 */

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  try {
    const apiKey = extractApiKey(request);
    if (!apiKey) {
      return unauthorizedResponse('Missing API key');
    }

    const keyHash = hashApiKey(apiKey);
    const validation = await convex.query(api.apiKeys.validateApiKey, { keyHash });
    if (!validation) {
      return unauthorizedResponse('Invalid or expired API key');
    }

    if (!hasPermission(validation, 'read')) {
      return forbiddenResponse('API key does not have read permission');
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    // Fetch briefs for the project
    const briefs = await convex.query(api.content.briefs.getBriefsByProject, {
      projectId: validation.projectId,
    });

    // Record usage
    await convex.mutation(api.apiKeys.recordApiKeyUsage, { keyId: validation.keyId });

    // Apply status filter if provided
    let filteredBriefs = briefs;
    if (status) {
      filteredBriefs = briefs.filter((b: { status: string }) => b.status === status);
    }

    const paginatedBriefs = filteredBriefs.slice(offset, offset + limit);

    return apiResponse({
      briefs: paginatedBriefs,
      total: filteredBriefs.length,
      limit,
      offset,
      hasMore: offset + limit < filteredBriefs.length,
    });
  } catch (error) {
    console.error('Public API error:', error);
    return errorResponse('Internal server error', 500);
  }
}

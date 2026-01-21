import { NextRequest } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { unsafeApi as api } from '@/lib/convexClient';
import {
  extractApiKey,
  hashApiKey,
  generateRequestId,
  hasPermission,
  apiResponse,
  unauthorizedResponse,
  forbiddenResponse,
  internalErrorResponse,
  corsPreflightResponse,
  ApiKeyValidation,
} from '@/lib/apiAuth';

/**
 * Public API v1 - Clusters
 *
 * GET /api/v1/clusters - List keyword clusters for a project
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
// GET - List Clusters
// ============================================
export async function GET(request: NextRequest): Promise<Response> {
  const requestId = generateRequestId();

  try {
    const apiKey = extractApiKey(request);
    if (!apiKey) {
      return unauthorizedResponse('Missing API key. Use Authorization: Bearer mart_xxx', requestId);
    }

    const keyHash = hashApiKey(apiKey);
    const validation = await convex.query(api.apiKeys.validateApiKey, { keyHash });
    if (!validation) {
      return unauthorizedResponse('Invalid or expired API key', requestId);
    }

    if (!hasPermission(validation as ApiKeyValidation, 'read')) {
      return forbiddenResponse('API key does not have read permission', requestId);
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0'));

    // Fetch clusters
    const clusters = await convex.query(api.seo.keywordClusters.getClustersByProject, {
      projectId: validation.projectId,
    });

    // Record usage
    convex.mutation(api.apiKeys.recordApiKeyUsage, { keyId: validation.keyId }).catch(() => {});

    const paginatedClusters = clusters.slice(offset, offset + limit);

    return apiResponse(
      {
        clusters: paginatedClusters,
        pagination: {
          total: clusters.length,
          limit,
          offset,
          hasMore: offset + limit < clusters.length,
        },
      },
      200,
      requestId
    );
  } catch (error) {
    console.error(`[${requestId}] Public API error:`, error);
    return internalErrorResponse('An unexpected error occurred', requestId);
  }
}

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
  internalErrorResponse,
  corsPreflightResponse,
  ApiKeyValidation,
} from '@/lib/apiAuth';

/**
 * Public API v1 - Analytics
 *
 * GET /api/v1/analytics - Get analytics summary for a project
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
// GET - Analytics Summary
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
    const days = Math.min(Math.max(1, parseInt(searchParams.get('days') || '30')), 90);

    // Calculate date range
    const endDate = Date.now();
    const startDate = endDate - days * 24 * 60 * 60 * 1000;

    // Fetch analytics KPIs
    const kpis = await convex.query(api.analytics.analytics.getKPIs, {
      projectId: validation.projectId,
      startDate,
      endDate,
    });

    // Record usage
    convex.mutation(api.apiKeys.recordApiKeyUsage, { keyId: validation.keyId }).catch(() => {});

    return apiResponse(
      {
        analytics: kpis,
        filters: {
          days,
          from: new Date(startDate).toISOString(),
          to: new Date(endDate).toISOString(),
        },
        projectId: validation.projectId,
      },
      200,
      requestId
    );
  } catch (error) {
    console.error(`[${requestId}] Public API error:`, error);
    return internalErrorResponse('An unexpected error occurred', requestId);
  }
}

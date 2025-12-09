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
 * Public API v1 - Analytics
 *
 * GET /api/v1/analytics - Get analytics summary for a project
 *
 * Headers:
 *   Authorization: Bearer mart_xxxxx
 *
 * Query params:
 *   days: number (default: 30) - number of days to look back
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
    const days = Math.min(parseInt(searchParams.get('days') || '30'), 90);

    // Fetch analytics KPIs for the project
    const kpis = await convex.query(api.analytics.kpis.getKPIsByProject, {
      projectId: validation.projectId,
    });

    // Record usage
    await convex.mutation(api.apiKeys.recordApiKeyUsage, { keyId: validation.keyId });

    // Get latest KPIs within date range
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const recentKpis = kpis.filter((k: { calculatedAt: number }) => k.calculatedAt >= cutoff);

    return apiResponse({
      analytics: recentKpis,
      days,
      projectId: validation.projectId,
    });
  } catch (error) {
    console.error('Public API error:', error);
    return errorResponse('Internal server error', 500);
  }
}

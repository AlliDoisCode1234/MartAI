import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexQuery, api } from '@/lib/convexClient';
import { assertProjectId } from '@/lib/typeGuards';

// Import api dynamically for routes that need it
let apiLocal: typeof api = api;
if (typeof window === 'undefined' && !apiLocal) {
  try {
    apiLocal = require('@/convex/_generated/api')?.api;
  } catch {
    apiLocal = null as any;
  }
}

/**
 * GET /api/strategy?projectId=xxx
 * Get all strategy data (clusters + plan + briefs) for a project
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['GET'],
    });

    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return secureResponse(
        NextResponse.json(
          { error: 'projectId is required' },
          { status: 400 }
        )
      );
    }

    if (!apiLocal) {
      return secureResponse(
        NextResponse.json(
          { error: 'Convex not configured' },
          { status: 503 }
        )
      );
    }

    const projectIdTyped = assertProjectId(projectId);
    const strategy = await callConvexQuery(apiLocal.seo.strategy.getStrategyByProject, {
      projectId: projectIdTyped,
    });

    return secureResponse(
      NextResponse.json({
        success: true,
        strategy,
      })
    );
  } catch (error: any) {
    console.error('Get strategy error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { 
          error: 'Failed to get strategy data',
          details: error.message,
        },
        { status: 500 }
      )
    );
  }
}


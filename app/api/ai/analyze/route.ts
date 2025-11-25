import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexAction, api } from '@/lib/convexClient';
import { assertProjectId, assertProspectId } from '@/lib/typeGuards';

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });

    if (authUser.role !== 'admin') {
      return secureResponse(
        NextResponse.json(
          { error: 'Admin role required for this endpoint' },
          { status: 403 },
        ),
      );
    }

    const body = await request.json();
    const payload: Record<string, any> = {};

    if (body.prospectId) {
      payload.prospectId = assertProspectId(body.prospectId);
    }
    if (body.projectId) {
      payload.projectId = assertProjectId(body.projectId);
    }
    if (body.url) {
      payload.url = body.url;
    }
    if (body.force !== undefined) {
      payload.force = Boolean(body.force);
    }

    if (!payload.prospectId && !payload.projectId && !payload.url) {
      return secureResponse(
        NextResponse.json(
          { error: 'Provide prospectId, projectId, or url for analysis' },
          { status: 400 },
        ),
      );
    }

    const result = await callConvexAction(api.ai.analysis.runPipeline, payload);

    return secureResponse(
      NextResponse.json({
        success: true,
        reportId: result.reportId,
        keywordIdeasCreated: result.keywordIdeasCreated,
        metrics: result.metrics,
      }),
    );
  } catch (error: any) {
    console.error('AI analysis error', error);
    return secureResponse(
      NextResponse.json(
        {
          error: 'Failed to run intelligence pipeline',
          details: error?.message ?? 'Unknown error',
        },
        { status: 500 },
      ),
    );
  }
}


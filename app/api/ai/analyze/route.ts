import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexAction, unsafeApi as api } from '@/lib/convexClient';
import { assertProjectId, assertProspectId } from '@/lib/typeGuards';
import { sanitizeErrorMessage } from '@/lib/errorSanitizer';

export const dynamic = 'force-dynamic';

interface AnalyzePipelinePayload {
  prospectId?: string;
  projectId?: string;
  url?: string;
  force?: boolean;
}

interface AnalyzePipelineResult {
  reportId: string;
  keywordIdeasCreated: number;
  metrics: Record<string, number>;
}

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
        NextResponse.json({ error: 'Admin role required for this endpoint' }, { status: 403 })
      );
    }

    const body = await request.json();
    const payload: AnalyzePipelinePayload = {};

    if (body.prospectId) {
      payload.prospectId = String(assertProspectId(body.prospectId));
    }
    if (body.projectId) {
      payload.projectId = String(assertProjectId(body.projectId));
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
          { status: 400 }
        )
      );
    }

    const result = (await callConvexAction(
      api.ai.analysis.runPipeline,
      payload
    )) as AnalyzePipelineResult;

    return secureResponse(
      NextResponse.json({
        success: true,
        reportId: result.reportId,
        keywordIdeasCreated: result.keywordIdeasCreated,
        metrics: result.metrics,
      })
    );
  } catch (error) {
    console.error('AI analysis error', error);
    return secureResponse(
      NextResponse.json(
        {
          error: 'Failed to run intelligence pipeline',
          details: sanitizeErrorMessage(error, 'Unknown error'),
        },
        { status: 500 }
      )
    );
  }
}

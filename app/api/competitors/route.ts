import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';
import { assertProjectId, assertCompetitorId } from '@/lib/typeGuards';

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

    if (!api) {
      return secureResponse(
        NextResponse.json(
          { error: 'Convex not configured' },
          { status: 503 }
        )
      );
    }

    // Validate required field - throws if invalid, type is guaranteed after
    const projectIdTyped = assertProjectId(projectId);
    const competitors = await callConvexQuery(api.seo.competitors.getCompetitorsByProject, {
      projectId: projectIdTyped,
    });

    return secureResponse(
      NextResponse.json({ competitors })
    );
  } catch (error: any) {
    console.error('Get competitors error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to get competitors' },
        { status: 500 }
      )
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });
    const body = await request.json();
    const { projectId, domain, priority, notes } = body;

    if (!projectId || !domain) {
      return secureResponse(
        NextResponse.json(
          { error: 'projectId and domain are required' },
          { status: 400 }
        )
      );
    }

    if (!api) {
      return secureResponse(
        NextResponse.json(
          { error: 'Convex not configured' },
          { status: 503 }
        )
      );
    }

    const projectIdTyped = assertProjectId(projectId);
    const competitorId = await callConvexMutation(api.seo.competitors.addCompetitor, {
      projectId: projectIdTyped,
      domain,
      priority,
      notes,
    });

    return secureResponse(
      NextResponse.json({ success: true, competitorId })
    );
  } catch (error: any) {
    console.error('Add competitor error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to add competitor' },
        { status: 500 }
      )
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['DELETE'],
    });
    const searchParams = request.nextUrl.searchParams;
    const competitorId = searchParams.get('competitorId');

    if (!competitorId) {
      return secureResponse(
        NextResponse.json(
          { error: 'competitorId is required' },
          { status: 400 }
        )
      );
    }

    if (!api) {
      return secureResponse(
        NextResponse.json(
          { error: 'Convex not configured' },
          { status: 503 }
        )
      );
    }

    const competitorIdTyped = assertCompetitorId(competitorId);
    await callConvexMutation(api.seo.competitors.removeCompetitor, {
      competitorId: competitorIdTyped,
    });

    return secureResponse(
      NextResponse.json({ success: true })
    );
  } catch (error: any) {
    console.error('Remove competitor error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to remove competitor' },
        { status: 500 }
      )
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['PATCH'],
      allowedContentTypes: ['application/json'],
    });
    const body = await request.json();
    const { competitorId, priority } = body;

    if (!competitorId || priority === undefined) {
      return secureResponse(
        NextResponse.json(
          { error: 'competitorId and priority are required' },
          { status: 400 }
        )
      );
    }

    if (!api) {
      return secureResponse(
        NextResponse.json(
          { error: 'Convex not configured' },
          { status: 503 }
        )
      );
    }

    const competitorIdTyped = assertCompetitorId(competitorId);
    await callConvexMutation(api.seo.competitors.updateCompetitorPriority, {
      competitorId: competitorIdTyped,
      priority,
    });

    return secureResponse(
      NextResponse.json({ success: true })
    );
  } catch (error: any) {
    console.error('Update competitor priority error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to update competitor priority' },
        { status: 500 }
      )
    );
  }
}


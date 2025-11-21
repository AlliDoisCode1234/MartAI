import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const competitors = await callConvexQuery(api.competitors.getCompetitorsByProject, {
      projectId: projectId as any,
    });

    return NextResponse.json({ competitors });
  } catch (error) {
    console.error('Get competitors error:', error);
    return NextResponse.json(
      { error: 'Failed to get competitors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { projectId, domain, priority, notes } = body;

    if (!projectId || !domain) {
      return NextResponse.json(
        { error: 'projectId and domain are required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const competitorId = await callConvexMutation(api.competitors.addCompetitor, {
      projectId: projectId as any,
      domain,
      priority,
      notes,
    });

    return NextResponse.json({ success: true, competitorId });
  } catch (error) {
    console.error('Add competitor error:', error);
    return NextResponse.json(
      { error: 'Failed to add competitor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const competitorId = searchParams.get('competitorId');

    if (!competitorId) {
      return NextResponse.json(
        { error: 'competitorId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    await callConvexMutation(api.competitors.removeCompetitor, {
      competitorId: competitorId as any,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove competitor error:', error);
    return NextResponse.json(
      { error: 'Failed to remove competitor' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { competitorId, priority } = body;

    if (!competitorId || priority === undefined) {
      return NextResponse.json(
        { error: 'competitorId and priority are required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    await callConvexMutation(api.competitors.updateCompetitorPriority, {
      competitorId: competitorId as any,
      priority,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update competitor priority error:', error);
    return NextResponse.json(
      { error: 'Failed to update competitor priority' },
      { status: 500 }
    );
  }
}


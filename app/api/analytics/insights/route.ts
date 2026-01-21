import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, unsafeApi } from '@/lib/convexClient';
import { Id } from '@/convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

// GET - Get insights
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const type = searchParams.get('type');

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const insights = await callConvexQuery(unsafeApi.analytics.analytics.getInsights as any, {
      projectId: projectId as Id<'projects'>,
      type: type || undefined,
    });

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Get insights error:', error);
    return NextResponse.json({ error: 'Failed to get insights' }, { status: 500 });
  }
}

// POST - Apply insight
export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = await request.json();
    const { insightId } = body;

    if (!insightId) {
      return NextResponse.json({ error: 'insightId is required' }, { status: 400 });
    }

    await callConvexMutation(unsafeApi.analytics.analytics.applyInsight as any, {
      insightId: insightId as string,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Apply insight error:', error);
    return NextResponse.json({ error: 'Failed to apply insight' }, { status: 500 });
  }
}

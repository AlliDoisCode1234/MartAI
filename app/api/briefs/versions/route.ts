import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';

// GET - Get versions for a brief
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const briefId = searchParams.get('briefId');

    if (!briefId) {
      return NextResponse.json(
        { error: 'briefId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const versions = await callConvexQuery(api.briefVersions.getBriefVersions, {
      briefId: briefId as any,
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error('Get brief versions error:', error);
    return NextResponse.json(
      { error: 'Failed to get brief versions' },
      { status: 500 }
    );
  }
}

// POST - Create new version
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { briefId, ...versionData } = body;

    if (!briefId) {
      return NextResponse.json(
        { error: 'briefId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const versionId = await callConvexMutation(api.briefVersions.createBriefVersion, {
      briefId: briefId as any,
      ...versionData,
    });

    return NextResponse.json({ success: true, versionId });
  } catch (error) {
    console.error('Create brief version error:', error);
    return NextResponse.json(
      { error: 'Failed to create brief version' },
      { status: 500 }
    );
  }
}

// POST /restore - Restore a version
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json(
        { error: 'versionId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const newVersionId = await callConvexMutation(api.briefVersions.restoreBriefVersion, {
      versionId: versionId as any,
    });

    return NextResponse.json({ success: true, versionId: newVersionId });
  } catch (error) {
    console.error('Restore brief version error:', error);
    return NextResponse.json(
      { error: 'Failed to restore brief version' },
      { status: 500 }
    );
  }
}


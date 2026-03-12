import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexMutation, callConvexQuery, unsafeApi } from '@/lib/convexClient';
import { assertProjectId } from '@/lib/typeGuards';

export const dynamic = 'force-dynamic';

// Use unsafeApi to avoid TypeScript type instantiation issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiLocal: any = unsafeApi;

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = await request.json();
    const { contentPieceId, projectId, publishDate, timezone, platform, tags, categories, slug } =
      body;

    if (!contentPieceId || !projectId || !publishDate || !timezone || !platform) {
      return NextResponse.json(
        {
          error:
            'contentPieceId, projectId, publishDate, timezone, and platform are required',
        },
        { status: 400 }
      );
    }

    if (!apiLocal) {
      return NextResponse.json({ error: 'Convex not configured' }, { status: 503 });
    }

    // Validate content piece exists
    const contentPiece = await callConvexQuery(apiLocal.contentPieces.getById, {
      contentPieceId,
    });

    if (!contentPiece) {
      return NextResponse.json({ error: 'Content piece not found' }, { status: 404 });
    }

    // Parse publish date
    const publishTimestamp =
      typeof publishDate === 'string' ? new Date(publishDate).getTime() : publishDate;

    if (Number.isNaN(publishTimestamp)) {
      return NextResponse.json({ error: 'Invalid publish date' }, { status: 400 });
    }

    // Check if time is in the past
    if (publishTimestamp < Date.now()) {
      return NextResponse.json({ error: 'Publish date must be in the future' }, { status: 400 });
    }

    // Verify platform connection exists
    const projectIdTyped = assertProjectId(projectId);
    const platformConnection = await callConvexQuery(
      apiLocal.integrations.platformConnections.getConnection,
      {
        projectId: projectIdTyped,
        platform,
      }
    );

    if (!platformConnection) {
      return NextResponse.json(
        { error: `${platform} connection not found. Please connect ${platform} first.` },
        { status: 400 }
      );
    }

    // Create scheduled post using contentPieceId (current API)
    const postId = await callConvexMutation(
      apiLocal.publishing.scheduledPosts.createScheduledPost,
      {
        contentPieceId,
        projectId: projectIdTyped,
        publishDate: publishTimestamp,
        timezone,
        platform,
        tags: tags || [],
        categories: categories || [],
        slug: slug || undefined,
        status: 'scheduled',
      }
    );

    return NextResponse.json({
      success: true,
      postId,
      publishDate: publishTimestamp,
      timezone,
    });
  } catch (error) {
    console.error('Schedule publish error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to schedule publish' },
      { status: 500 }
    );
  }
}

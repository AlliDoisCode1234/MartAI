import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexMutation, callConvexQuery } from '@/lib/convexClient';

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { 
      draftId, 
      publishDate, 
      timezone, 
      platform, 
      tags, 
      categories, 
      slug 
    } = body;

    if (!draftId || !publishDate || !timezone || !platform) {
      return NextResponse.json(
        { error: 'draftId, publishDate, timezone, and platform are required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    // Get draft and brief info
    const draft = await callConvexQuery(api.drafts.getDraftById, {
      draftId: draftId as any,
    });

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    if (draft.status !== 'approved') {
      return NextResponse.json(
        { error: 'Draft must be approved before scheduling' },
        { status: 400 }
      );
    }

    // Parse publish date
    const publishTimestamp = typeof publishDate === 'string' 
      ? new Date(publishDate).getTime() 
      : publishDate;

    if (isNaN(publishTimestamp)) {
      return NextResponse.json(
        { error: 'Invalid publish date' },
        { status: 400 }
      );
    }

    // Check if time is in the past
    if (publishTimestamp < Date.now()) {
      return NextResponse.json(
        { error: 'Publish date must be in the future' },
        { status: 400 }
      );
    }

    // Verify platform connection exists
    const platformConnection = await callConvexQuery(api.oauthTokens.getOAuthToken, {
      clientId: draft.projectId as any,
      platform,
    });
    
    if (!platformConnection) {
      return NextResponse.json(
        { error: `${platform} connection not found. Please connect ${platform} first.` },
        { status: 400 }
      );
    }

    // Create scheduled post
    const postId = await callConvexMutation(api.scheduledPosts.createScheduledPost, {
      draftId: draftId as any,
      projectId: draft.projectId,
      briefId: draft.briefId,
      publishDate: publishTimestamp,
      timezone,
      platform,
      tags: tags || [],
      categories: categories || [],
      slug: slug || undefined,
      status: 'scheduled',
    });

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


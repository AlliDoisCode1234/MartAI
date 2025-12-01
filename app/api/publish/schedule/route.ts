import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexMutation, callConvexQuery, api } from '@/lib/convexClient';
import { assertDraftId, assertProjectId } from '@/lib/typeGuards';

export const dynamic = 'force-dynamic';

// Import api dynamically for routes that need it
let apiLocal: typeof api = api;
if (typeof window === 'undefined') {
  if (!apiLocal) {
    try {
      apiLocal = require('@/convex/_generated/api')?.api;
    } catch {
      apiLocal = null as any;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
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

    if (!apiLocal) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    // Validate required field - type guaranteed after assertion
    const draftIdTyped = assertDraftId(draftId);
    const draft = await callConvexQuery(apiLocal.drafts.getDraftById, {
      draftId: draftIdTyped,
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
    const projectIdTyped = assertProjectId(draft.projectId);
    const platformConnection = await callConvexQuery(apiLocal.oauthTokens.getOAuthToken, {
      clientId: projectIdTyped,
      platform,
    });
    
    if (!platformConnection) {
      return NextResponse.json(
        { error: `${platform} connection not found. Please connect ${platform} first.` },
        { status: 400 }
      );
    }

    // Create scheduled post
    const postId = await callConvexMutation(apiLocal.scheduledPosts.createScheduledPost, {
      draftId: draftIdTyped,
      projectId: projectIdTyped,
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

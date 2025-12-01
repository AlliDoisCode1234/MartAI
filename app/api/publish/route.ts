import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';

export const dynamic = 'force-dynamic';

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

// GET - Get scheduled posts
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');

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

    let posts = [];
    try {
      if (status) {
        posts = await callConvexQuery(api.publishing.scheduledPosts.getScheduledPostsByStatus, {
          projectId: projectId as any,
          status,
        });
      } else {
        posts = await callConvexQuery(api.publishing.scheduledPosts.getScheduledPosts, {
          projectId: projectId as any,
        });
      }
    } catch (error) {
      console.error('Error getting scheduled posts:', error);
      posts = [];
    }

    // Sort by publish date
    posts.sort((a: any, b: any) => a.publishDate - b.publishDate);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Get scheduled posts error:', error);
    return NextResponse.json(
      { error: 'Failed to get scheduled posts' },
      { status: 500 }
    );
  }
}

// PATCH - Update scheduled post
export async function PATCH(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = await request.json();
    const { postId, ...updates } = body;

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    // Parse publish date if provided
    if (updates.publishDate) {
      updates.publishDate = typeof updates.publishDate === 'string'
        ? new Date(updates.publishDate).getTime()
        : updates.publishDate;
    }

    await callConvexMutation(api.publishing.scheduledPosts.updateScheduledPost, {
      postId: postId as any,
      ...updates,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update scheduled post error:', error);
    return NextResponse.json(
      { error: 'Failed to update scheduled post' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/delete scheduled post
export async function DELETE(request: NextRequest) {
  try {
    await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    await callConvexMutation(api.publishing.scheduledPosts.cancelScheduledPost, {
      postId: postId as any,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel scheduled post error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel scheduled post' },
      { status: 500 }
    );
  }
}

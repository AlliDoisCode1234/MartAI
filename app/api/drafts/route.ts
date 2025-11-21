import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';
import { validateDraftSEO } from '@/lib/draftGenerator';

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

// GET - Get draft
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const draftId = searchParams.get('draftId');
    const briefId = searchParams.get('briefId');

    if (!draftId && !briefId) {
      return NextResponse.json(
        { error: 'draftId or briefId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    let draft;
    if (draftId) {
      draft = await callConvexQuery(api.drafts.getDraftById, {
        draftId: draftId as any,
      });
    } else {
      draft = await callConvexQuery(api.drafts.getDraftByBrief, {
        briefId: briefId as any,
      });
    }

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    // Get brief for SEO validation
    let brief = null;
    if (draft.briefId) {
      try {
        brief = await callConvexQuery(api.briefs.getBriefById, {
          briefId: draft.briefId,
        });
      } catch (error) {
        console.warn('Failed to get brief:', error);
      }
    }

    // Validate SEO
    const seoCheck = brief ? validateDraftSEO(draft, brief) : null;

    return NextResponse.json({
      draft,
      brief,
      seoCheck,
    });
  } catch (error) {
    console.error('Get draft error:', error);
    return NextResponse.json(
      { error: 'Failed to get draft' },
      { status: 500 }
    );
  }
}

// PATCH - Update draft
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { draftId, ...updates } = body;

    if (!draftId) {
      return NextResponse.json(
        { error: 'draftId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    // Recalculate word count if content changed
    if (updates.content) {
      updates.wordCount = updates.content.split(/\s+/).length;
    }

    await callConvexMutation(api.drafts.updateDraft, {
      draftId: draftId as any,
      ...updates,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update draft error:', error);
    return NextResponse.json(
      { error: 'Failed to update draft' },
      { status: 500 }
    );
  }
}

// POST - Approve draft
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { draftId } = body;

    if (!draftId) {
      return NextResponse.json(
        { error: 'draftId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    await callConvexMutation(api.drafts.approveDraft, {
      draftId: draftId as any,
    });

    // Update brief status
    const draft = await callConvexQuery(api.drafts.getDraftById, {
      draftId: draftId as any,
    });

    if (draft?.briefId) {
      await callConvexMutation(api.briefs.updateBrief, {
        briefId: draft.briefId,
        status: 'approved',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Approve draft error:', error);
    return NextResponse.json(
      { error: 'Failed to approve draft' },
      { status: 500 }
    );
  }
}

// DELETE - Delete draft
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const draftId = searchParams.get('draftId');

    if (!draftId) {
      return NextResponse.json(
        { error: 'draftId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    await callConvexMutation(api.drafts.deleteDraft, {
      draftId: draftId as any,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete draft error:', error);
    return NextResponse.json(
      { error: 'Failed to delete draft' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';
import { validateDraftSEO } from '@/lib/draftGenerator';
import { assertDraftId, assertBriefId } from '@/lib/typeGuards';

// Import api dynamically for routes that need it
let apiLocal: typeof api = api;
if (typeof window === 'undefined' && !apiLocal) {
  try {
    apiLocal = require('@/convex/_generated/api')?.api;
  } catch {
    apiLocal = null as any;
  }
}

// GET - Get draft
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['GET'],
    });
    const searchParams = request.nextUrl.searchParams;
    const draftId = searchParams.get('draftId');
    const briefId = searchParams.get('briefId');

    if (!draftId && !briefId) {
      return secureResponse(
        NextResponse.json(
          { error: 'draftId or briefId is required' },
          { status: 400 }
        )
      );
    }

    if (!apiLocal) {
      return secureResponse(
        NextResponse.json(
          { error: 'Convex not configured' },
          { status: 503 }
        )
      );
    }

    let draft;
    if (draftId) {
      const draftIdTyped = assertDraftId(draftId);
      draft = await callConvexQuery(apiLocal.drafts.getDraftById, {
        draftId: draftIdTyped,
      });
    } else if (briefId) {
      const briefIdTyped = assertBriefId(briefId);
      draft = await callConvexQuery(apiLocal.drafts.getDraftByBrief, {
        briefId: briefIdTyped,
      });
    }

    if (!draft) {
      return secureResponse(
        NextResponse.json(
          { error: 'Draft not found' },
          { status: 404 }
        )
      );
    }

    // Get brief for SEO validation
    let brief = null;
    if (draft.briefId) {
      try {
        brief = await callConvexQuery(apiLocal.briefs.getBriefById, {
          briefId: draft.briefId,
        });
      } catch (error) {
        console.warn('Failed to get brief:', error);
      }
    }

    // Validate SEO
    const seoCheck = brief ? validateDraftSEO(draft, brief) : null;

    return secureResponse(
      NextResponse.json({
        draft,
        brief,
        seoCheck,
      })
    );
  } catch (error: any) {
    console.error('Get draft error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to get draft' },
        { status: 500 }
      )
    );
  }
}

// PATCH - Update draft
export async function PATCH(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['PATCH'],
      allowedContentTypes: ['application/json'],
    });
    const body = await request.json();
    const { draftId, ...updates } = body;

    if (!draftId) {
      return secureResponse(
        NextResponse.json(
          { error: 'draftId is required' },
          { status: 400 }
        )
      );
    }

    if (!apiLocal) {
      return secureResponse(
        NextResponse.json(
          { error: 'Convex not configured' },
          { status: 503 }
        )
      );
    }

    // Recalculate word count if content changed
    if (updates.content) {
      updates.wordCount = updates.content.split(/\s+/).length;
    }

    const draftIdTyped = assertDraftId(draftId);
    await callConvexMutation(apiLocal.drafts.updateDraft, {
      draftId: draftIdTyped,
      ...updates,
    });

    return secureResponse(
      NextResponse.json({ success: true })
    );
  } catch (error: any) {
    console.error('Update draft error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to update draft' },
        { status: 500 }
      )
    );
  }
}

// POST - Approve draft
export async function POST(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });
    const body = await request.json();
    const { draftId } = body;

    if (!draftId) {
      return NextResponse.json(
        { error: 'draftId is required' },
        { status: 400 }
      );
    }

    if (!apiLocal) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const draftIdTyped = assertDraftId(draftId);
    await callConvexMutation(apiLocal.drafts.approveDraft, {
      draftId: draftIdTyped,
    });

    // Update brief status
    const draft = await callConvexQuery(apiLocal.drafts.getDraftById, {
      draftId: draftIdTyped,
    });

    if (draft?.briefId) {
      await callConvexMutation(apiLocal.briefs.updateBrief, {
        briefId: draft.briefId,
        status: 'approved',
      });
    }

    return secureResponse(
      NextResponse.json({ success: true })
    );
  } catch (error: any) {
    console.error('Approve draft error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to approve draft' },
        { status: 500 }
      )
    );
  }
}

// DELETE - Delete draft
export async function DELETE(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['DELETE'],
    });
    const searchParams = request.nextUrl.searchParams;
    const draftId = searchParams.get('draftId');

    if (!draftId) {
      return secureResponse(
        NextResponse.json(
          { error: 'draftId is required' },
          { status: 400 }
        )
      );
    }

    if (!apiLocal) {
      return secureResponse(
        NextResponse.json(
          { error: 'Convex not configured' },
          { status: 503 }
        )
      );
    }

    const draftIdTyped = assertDraftId(draftId);
    await callConvexMutation(apiLocal.drafts.deleteDraft, {
      draftId: draftIdTyped,
    });

    return secureResponse(
      NextResponse.json({ success: true })
    );
  } catch (error: any) {
    console.error('Delete draft error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to delete draft' },
        { status: 500 }
      )
    );
  }
}


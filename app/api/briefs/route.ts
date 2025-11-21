import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';
import { validateSEOChecklist } from '@/lib/briefGenerator';

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

// GET - Get brief by ID
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

    const brief = await callConvexQuery(api.briefs.getBriefById, {
      briefId: briefId as any,
    });

    if (!brief) {
      return NextResponse.json(
        { error: 'Brief not found' },
        { status: 404 }
      );
    }

    // Get cluster info if assigned
    let cluster = null;
    if (brief.clusterId) {
      try {
        const clusters = await callConvexQuery(api.keywordClusters.getClustersByProject, {
          projectId: brief.projectId,
        });
        cluster = clusters?.find((c: any) => c._id === brief.clusterId);
      } catch (error) {
        console.warn('Failed to get cluster:', error);
      }
    }

    // Validate SEO checklist
    const seoCheck = brief.titleOptions && brief.h2Outline
      ? validateSEOChecklist({
          titleOptions: brief.titleOptions || [],
          h2Outline: brief.h2Outline || [],
          faqs: brief.faqs || [],
          metaTitle: brief.metaTitle || '',
          metaDescription: brief.metaDescription || '',
          internalLinks: brief.internalLinks || [],
          schemaSuggestion: brief.schemaSuggestion || '',
        })
      : { valid: false, issues: ['Brief details not generated yet'] };

    return NextResponse.json({
      brief,
      cluster,
      seoCheck,
    });
  } catch (error) {
    console.error('Get brief error:', error);
    return NextResponse.json(
      { error: 'Failed to get brief' },
      { status: 500 }
    );
  }
}

// PATCH - Update brief
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { briefId, ...updates } = body;

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

    await callConvexMutation(api.briefs.updateBrief, {
      briefId: briefId as any,
      ...updates,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update brief error:', error);
    return NextResponse.json(
      { error: 'Failed to update brief' },
      { status: 500 }
    );
  }
}

// DELETE - Delete brief
export async function DELETE(request: NextRequest) {
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

    await callConvexMutation(api.briefs.deleteBrief, {
      briefId: briefId as any,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete brief error:', error);
    return NextResponse.json(
      { error: 'Failed to delete brief' },
      { status: 500 }
    );
  }
}


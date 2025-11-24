import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';
import { validateSEOChecklist } from '@/lib/briefGenerator';
import { assertBriefId, parseClusterId } from '@/lib/typeGuards';

// Import api dynamically for routes that need it
let apiLocal: typeof api = api;
if (typeof window === 'undefined' && !apiLocal) {
  try {
    apiLocal = require('@/convex/_generated/api')?.api;
  } catch {
    apiLocal = null as any;
  }
}

// GET - Get brief by ID
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const briefId = searchParams.get('briefId');

    if (!briefId) {
      return NextResponse.json(
        { error: 'briefId is required' },
        { status: 400 }
      );
    }

    if (!apiLocal) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    // Validate required ID - type guaranteed after assertion
    const briefIdTyped = assertBriefId(briefId);
    const brief = await callConvexQuery(apiLocal.briefs.getBriefById, {
      briefId: briefIdTyped,
    });

    if (!brief) {
      return NextResponse.json(
        { error: 'Brief not found' },
        { status: 404 }
      );
    }

    // Get cluster info if assigned - clusterId is optional in schema
    let cluster = null;
    const clusterId = parseClusterId(brief.clusterId); // Returns null if invalid/absent
    if (clusterId) {
      try {
        const clusters = await callConvexQuery(apiLocal.keywordClusters.getClustersByProject, {
          projectId: brief.projectId,
        });
        cluster = clusters?.find((c: any) => (c._id || c.id) === clusterId) || null;
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
    await requireAuth(request);
    const body = await request.json();
    const { briefId, ...updates } = body;

    if (!briefId) {
      return NextResponse.json(
        { error: 'briefId is required' },
        { status: 400 }
      );
    }

    if (!apiLocal) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const briefIdTyped = assertBriefId(briefId);
    await callConvexMutation(apiLocal.briefs.updateBrief, {
      briefId: briefIdTyped,
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
    await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const briefId = searchParams.get('briefId');

    if (!briefId) {
      return NextResponse.json(
        { error: 'briefId is required' },
        { status: 400 }
      );
    }

    if (!apiLocal) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const briefIdTyped = assertBriefId(briefId);
    await callConvexMutation(apiLocal.briefs.deleteBrief, {
      briefId: briefIdTyped,
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


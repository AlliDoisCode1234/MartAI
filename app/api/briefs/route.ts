import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';
import { validateSEOChecklist } from '@/lib/generators/briefGenerator';
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

// GET - Get brief by ID or briefs by project
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['GET'],
    });
    const searchParams = request.nextUrl.searchParams;
    const briefId = searchParams.get('briefId');
    const projectId = searchParams.get('projectId');

    if (!apiLocal) {
      return NextResponse.json({ error: 'Convex not configured' }, { status: 503 });
    }

    // If projectId is provided, return all briefs for project
    if (projectId) {
      const briefs = await callConvexQuery(apiLocal.briefs.getBriefsByProject, {
        projectId: projectId as any,
      });
      return secureResponse(NextResponse.json({ briefs: briefs || [] }));
    }

    if (!briefId) {
      return NextResponse.json({ error: 'briefId or projectId is required' }, { status: 400 });
    }

    // Validate required ID - type guaranteed after assertion
    const briefIdTyped = assertBriefId(briefId);
    const brief = await callConvexQuery(apiLocal.briefs.getBriefById, {
      briefId: briefIdTyped,
    });

    if (!brief) {
      return secureResponse(NextResponse.json({ error: 'Brief not found' }, { status: 404 }));
    }

    // Get cluster info if assigned - clusterId is optional in schema
    let cluster = null;
    const clusterId = parseClusterId(brief.clusterId); // Returns null if invalid/absent
    if (clusterId) {
      try {
        const clusters = await callConvexQuery(apiLocal.keywordClusters.getClustersByProject, {
          projectId: brief.projectId,
        });
        cluster = clusters?.find((c: any) => c._id === clusterId) || null;
      } catch (error) {
        console.warn('Failed to get cluster:', error);
      }
    }

    // Validate SEO checklist
    const seoCheck =
      brief.titleOptions && brief.h2Outline
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

    return secureResponse(
      NextResponse.json({
        brief,
        cluster,
        seoCheck,
      })
    );
  } catch (error: any) {
    console.error('Get brief error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(NextResponse.json({ error: 'Failed to get brief' }, { status: 500 }));
  }
}

// PATCH - Update brief
export async function PATCH(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['PATCH'],
      allowedContentTypes: ['application/json'],
    });
    const body = await request.json();
    const { briefId, ...updates } = body;

    if (!briefId) {
      return secureResponse(NextResponse.json({ error: 'briefId is required' }, { status: 400 }));
    }

    if (!apiLocal) {
      return secureResponse(NextResponse.json({ error: 'Convex not configured' }, { status: 503 }));
    }

    const briefIdTyped = assertBriefId(briefId);
    await callConvexMutation(apiLocal.briefs.updateBrief, {
      briefId: briefIdTyped,
      ...updates,
    });

    return secureResponse(NextResponse.json({ success: true }));
  } catch (error: any) {
    console.error('Update brief error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(NextResponse.json({ error: 'Failed to update brief' }, { status: 500 }));
  }
}

// DELETE - Delete brief
export async function DELETE(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['DELETE'],
    });
    const searchParams = request.nextUrl.searchParams;
    const briefId = searchParams.get('briefId');

    if (!briefId) {
      return secureResponse(NextResponse.json({ error: 'briefId is required' }, { status: 400 }));
    }

    if (!apiLocal) {
      return secureResponse(NextResponse.json({ error: 'Convex not configured' }, { status: 503 }));
    }

    const briefIdTyped = assertBriefId(briefId);
    await callConvexMutation(apiLocal.briefs.deleteBrief, {
      briefId: briefIdTyped,
    });

    return secureResponse(NextResponse.json({ success: true }));
  } catch (error: any) {
    console.error('Delete brief error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(NextResponse.json({ error: 'Failed to delete brief' }, { status: 500 }));
  }
}

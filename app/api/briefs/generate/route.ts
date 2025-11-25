import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { generateBriefDetails } from '@/lib/briefGenerator';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';
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

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });
    const body = await request.json();
    const { briefId, clusterId } = body;

    if (!briefId) {
      return secureResponse(
        NextResponse.json(
          { error: 'briefId is required' },
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

    // Validate required field - type guaranteed after assertion
    const briefIdTyped = assertBriefId(briefId);
    const brief = await callConvexQuery(apiLocal.briefs.getBriefById, {
      briefId: briefIdTyped,
    });

    if (!brief) {
      return secureResponse(
        NextResponse.json(
          { error: 'Brief not found' },
          { status: 404 }
        )
      );
    }

    // Get cluster info - clusterId is optional
    let cluster;
    const targetClusterId = parseClusterId(clusterId || brief.clusterId);
    
    if (targetClusterId) {
      try {
        const clusters = await callConvexQuery(apiLocal.keywordClusters.getClustersByProject, {
          projectId: brief.projectId,
        });
        cluster = clusters?.find((c: any) => c._id === targetClusterId) || null;
      } catch (error) {
        console.warn('Failed to get cluster:', error);
      }
    }

    if (!cluster) {
      return secureResponse(
        NextResponse.json(
          { error: 'Keyword cluster not found or not assigned' },
          { status: 400 }
        )
      );
    }

    // Get project details for context
    const project = await callConvexQuery(apiLocal.projects.getProjectById, {
      projectId: brief.projectId,
    });

    // Generate brief details
    const briefDetails = await generateBriefDetails(
      {
        clusterName: cluster.clusterName,
        keywords: cluster.keywords,
        intent: cluster.intent,
        volumeRange: cluster.volumeRange,
      },
      project?.websiteUrl,
      project?.industry,
      undefined // brandVoice can be added later
    );

    // Update brief with generated details
    await callConvexMutation(apiLocal.briefs.updateBrief, {
      briefId: briefIdTyped,
      ...briefDetails,
      status: 'in_progress',
    });

    return secureResponse(
      NextResponse.json({
        success: true,
        brief: {
          ...brief,
          ...briefDetails,
          status: 'in_progress',
        },
      })
    );
  } catch (error: any) {
    console.error('Generate brief details error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to generate brief details' },
        { status: 500 }
      )
    );
  }
}


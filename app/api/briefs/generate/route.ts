import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { generateBriefDetails } from '@/lib/briefGenerator';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';

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
    const { briefId, clusterId } = body;

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

    // Get brief
    const brief = await callConvexQuery(api.briefs.getBriefById, {
      briefId: briefId as any,
    });

    if (!brief) {
      return NextResponse.json(
        { error: 'Brief not found' },
        { status: 404 }
      );
    }

    // Get cluster info
    let cluster;
    const targetClusterId = clusterId || brief.clusterId;
    
    if (targetClusterId) {
      try {
        const clusters = await callConvexQuery(api.keywordClusters.getClustersByProject, {
          projectId: brief.projectId,
        });
        cluster = clusters?.find((c: any) => c._id === targetClusterId);
      } catch (error) {
        console.warn('Failed to get cluster:', error);
      }
    }

    if (!cluster) {
      return NextResponse.json(
        { error: 'Keyword cluster not found or not assigned' },
        { status: 400 }
      );
    }

    // Get project details for context
    const project = await callConvexQuery(api.projects.getProjectById, {
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
    await callConvexMutation(api.briefs.updateBrief, {
      briefId: briefId as any,
      ...briefDetails,
      status: 'in_progress',
    });

    return NextResponse.json({
      success: true,
      brief: {
        ...brief,
        ...briefDetails,
        status: 'in_progress',
      },
    });
  } catch (error) {
    console.error('Generate brief details error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate brief details' },
      { status: 500 }
    );
  }
}


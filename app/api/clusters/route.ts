import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, unsafeApi } from '@/lib/convexClient';
import { assertProjectId, assertClusterId } from '@/lib/typeGuards';

// Use unsafeApi to avoid TypeScript type instantiation issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiLocal: any = unsafeApi;

// GET - Get clusters for a project
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['GET'],
    });
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status'); // active, hidden, favorite, all

    if (!projectId) {
      return secureResponse(NextResponse.json({ error: 'projectId is required' }, { status: 400 }));
    }

    if (!apiLocal) {
      return secureResponse(NextResponse.json({ error: 'Convex not configured' }, { status: 503 }));
    }

    // Validate required field - type guaranteed after assertion
    const projectIdTyped = assertProjectId(projectId);

    let clusters;
    if (status === 'all') {
      clusters = await callConvexQuery(apiLocal.keywordClusters.getClustersByProject, {
        projectId: projectIdTyped,
      });
    } else {
      clusters = await callConvexQuery(apiLocal.keywordClusters.getActiveClusters, {
        projectId: projectIdTyped,
      });
    }

    // Sort by impact score descending
    clusters.sort(
      (a: { impactScore?: number }, b: { impactScore?: number }) =>
        (b.impactScore || 0) - (a.impactScore || 0)
    );

    return secureResponse(NextResponse.json({ clusters }));
  } catch (error: any) {
    console.error('Get clusters error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(NextResponse.json({ error: 'Failed to get clusters' }, { status: 500 }));
  }
}

// PATCH - Update cluster
export async function PATCH(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['PATCH'],
      allowedContentTypes: ['application/json'],
    });
    const body = await request.json();
    const { clusterId, ...updates } = body;

    if (!clusterId) {
      return secureResponse(NextResponse.json({ error: 'clusterId is required' }, { status: 400 }));
    }

    if (!apiLocal) {
      return secureResponse(NextResponse.json({ error: 'Convex not configured' }, { status: 503 }));
    }

    const clusterIdTyped = assertClusterId(clusterId);
    await callConvexMutation(apiLocal.keywordClusters.updateCluster, {
      clusterId: clusterIdTyped,
      ...updates,
    });

    return secureResponse(NextResponse.json({ success: true }));
  } catch (error: any) {
    console.error('Update cluster error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json({ error: 'Failed to update cluster' }, { status: 500 })
    );
  }
}

// DELETE - Delete cluster
export async function DELETE(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['DELETE'],
    });
    const searchParams = request.nextUrl.searchParams;
    const clusterId = searchParams.get('clusterId');

    if (!clusterId) {
      return secureResponse(NextResponse.json({ error: 'clusterId is required' }, { status: 400 }));
    }

    if (!apiLocal) {
      return secureResponse(NextResponse.json({ error: 'Convex not configured' }, { status: 503 }));
    }

    const clusterIdTyped = assertClusterId(clusterId);
    await callConvexMutation(apiLocal.keywordClusters.deleteCluster, {
      clusterId: clusterIdTyped,
    });

    return secureResponse(NextResponse.json({ success: true }));
  } catch (error: any) {
    console.error('Delete cluster error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json({ error: 'Failed to delete cluster' }, { status: 500 })
    );
  }
}

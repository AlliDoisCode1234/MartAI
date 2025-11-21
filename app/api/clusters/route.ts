import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';
import { assertProjectId, assertClusterId } from '@/lib/typeGuards';
import type { ProjectId, ClusterId } from '@/types';

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

// GET - Get clusters for a project
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status'); // active, hidden, favorite, all

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
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
    clusters.sort((a: { impactScore?: number }, b: { impactScore?: number }) => 
      (b.impactScore || 0) - (a.impactScore || 0)
    );

    return NextResponse.json({ clusters });
  } catch (error) {
    console.error('Get clusters error:', error);
    return NextResponse.json(
      { error: 'Failed to get clusters' },
      { status: 500 }
    );
  }
}

// PATCH - Update cluster
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { clusterId, ...updates } = body;

    if (!clusterId) {
      return NextResponse.json(
        { error: 'clusterId is required' },
        { status: 400 }
      );
    }

    if (!apiLocal) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const clusterIdTyped = assertClusterId(clusterId);
    await callConvexMutation(apiLocal.keywordClusters.updateCluster, {
      clusterId: clusterIdTyped,
      ...updates,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update cluster error:', error);
    return NextResponse.json(
      { error: 'Failed to update cluster' },
      { status: 500 }
    );
  }
}

// DELETE - Delete cluster
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const clusterId = searchParams.get('clusterId');

    if (!clusterId) {
      return NextResponse.json(
        { error: 'clusterId is required' },
        { status: 400 }
      );
    }

    if (!apiLocal) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const clusterIdTyped = assertClusterId(clusterId);
    await callConvexMutation(apiLocal.keywordClusters.deleteCluster, {
      clusterId: clusterIdTyped,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete cluster error:', error);
    return NextResponse.json(
      { error: 'Failed to delete cluster' },
      { status: 500 }
    );
  }
}


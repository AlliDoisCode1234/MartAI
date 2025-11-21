import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
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

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    let clusters;
    if (status === 'all') {
      clusters = await callConvexQuery(api.keywordClusters.getClustersByProject, {
        projectId: projectId as any,
      });
    } else {
      clusters = await callConvexQuery(api.keywordClusters.getActiveClusters, {
        projectId: projectId as any,
      });
    }

    // Sort by impact score descending
    clusters.sort((a: any, b: any) => b.impactScore - a.impactScore);

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

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    await callConvexMutation(api.keywordClusters.updateCluster, {
      clusterId: clusterId as any,
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

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    await callConvexMutation(api.keywordClusters.deleteCluster, {
      clusterId: clusterId as any,
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


import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexMutation, unsafeApi } from '@/lib/convexClient';
import { assertClusterId } from '@/lib/typeGuards';

// Use unsafeApi to avoid TypeScript type instantiation issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiLocal: any = unsafeApi;

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = await request.json();
    const { clusterId, status } = body;

    if (!clusterId || !status) {
      return NextResponse.json({ error: 'clusterId and status are required' }, { status: 400 });
    }

    if (!['active', 'hidden', 'favorite'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be active, hidden, or favorite' },
        { status: 400 }
      );
    }

    if (!apiLocal) {
      return NextResponse.json({ error: 'Convex not configured' }, { status: 503 });
    }

    const clusterIdTyped = assertClusterId(clusterId);
    await callConvexMutation(apiLocal.keywordClusters.updateClusterStatus, {
      clusterId: clusterIdTyped,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update cluster status error:', error);
    return NextResponse.json({ error: 'Failed to update cluster status' }, { status: 500 });
  }
}

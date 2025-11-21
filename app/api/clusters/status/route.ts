import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexMutation, api } from '@/lib/convexClient';
import { assertClusterId } from '@/lib/typeGuards';
import type { ClusterId } from '@/types';

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

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { clusterId, status } = body;

    if (!clusterId || !status) {
      return NextResponse.json(
        { error: 'clusterId and status are required' },
        { status: 400 }
      );
    }

    if (!['active', 'hidden', 'favorite'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be active, hidden, or favorite' },
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
    await callConvexMutation(apiLocal.keywordClusters.updateClusterStatus, {
      clusterId: clusterIdTyped,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update cluster status error:', error);
    return NextResponse.json(
      { error: 'Failed to update cluster status' },
      { status: 500 }
    );
  }
}


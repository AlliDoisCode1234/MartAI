import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexMutation } from '@/lib/convexClient';

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
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

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    await callConvexMutation(api.keywordClusters.updateClusterStatus, {
      clusterId: clusterId as any,
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


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

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { projectId, volumeWeight, intentWeight, difficultyWeight } = body;

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

    const result = await callConvexMutation(api.keywordClusters.rerankClusters, {
      projectId: projectId as any,
      volumeWeight: volumeWeight ?? 0.4,
      intentWeight: intentWeight ?? 0.3,
      difficultyWeight: difficultyWeight ?? 0.3,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Rerank clusters error:', error);
    return NextResponse.json(
      { error: 'Failed to rerank clusters' },
      { status: 500 }
    );
  }
}


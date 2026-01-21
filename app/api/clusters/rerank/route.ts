import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexMutation, unsafeApi } from '@/lib/convexClient';
import { assertProjectId } from '@/lib/typeGuards';

// Use unsafeApi to avoid TypeScript type instantiation issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiLocal: any = unsafeApi;

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = await request.json();
    const { projectId, volumeWeight, intentWeight, difficultyWeight } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    if (!apiLocal) {
      return NextResponse.json({ error: 'Convex not configured' }, { status: 503 });
    }

    const projectIdTyped = assertProjectId(projectId);
    const result = await callConvexMutation(apiLocal.keywordClusters.rerankClusters, {
      projectId: projectIdTyped,
      volumeWeight: volumeWeight ?? 0.4,
      intentWeight: intentWeight ?? 0.3,
      difficultyWeight: difficultyWeight ?? 0.3,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Rerank clusters error:', error);
    return NextResponse.json({ error: 'Failed to rerank clusters' }, { status: 500 });
  }
}

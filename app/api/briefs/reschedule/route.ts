import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexMutation, api } from '@/lib/convexClient';
import { assertBriefId } from '@/lib/typeGuards';
import type { BriefId } from '@/types';

// Import api dynamically for routes that need it
let apiLocal: typeof api = api;
if (typeof window === 'undefined' && !apiLocal) {
  try {
    apiLocal = require('@/convex/_generated/api')?.api;
  } catch {
    apiLocal = null as any;
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { briefId, newDate } = body;

    if (!briefId || !newDate) {
      return NextResponse.json(
        { error: 'briefId and newDate are required' },
        { status: 400 }
      );
    }

    if (!apiLocal) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const briefIdTyped = assertBriefId(briefId);
    const timestamp = typeof newDate === 'string' ? new Date(newDate).getTime() : newDate;

    await callConvexMutation(apiLocal.quarterlyPlans.rescheduleBrief, {
      briefId: briefIdTyped,
      newDate: timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reschedule brief error:', error);
    return NextResponse.json(
      { error: 'Failed to reschedule brief' },
      { status: 500 }
    );
  }
}


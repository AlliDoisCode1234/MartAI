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
    const { briefId, newDate } = body;

    if (!briefId || !newDate) {
      return NextResponse.json(
        { error: 'briefId and newDate are required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const timestamp = typeof newDate === 'string' ? new Date(newDate).getTime() : newDate;

    await callConvexMutation(api.quarterlyPlans.rescheduleBrief, {
      briefId: briefId as any,
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


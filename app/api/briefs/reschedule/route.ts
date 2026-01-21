import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexMutation, unsafeApi } from '@/lib/convexClient';
import { assertBriefId } from '@/lib/typeGuards';

// Use unsafeApi to avoid TypeScript type instantiation issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiLocal: any = unsafeApi;

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth(request);
    const body = await request.json();
    const { briefId, newDate } = body;

    if (!briefId || !newDate) {
      return NextResponse.json({ error: 'briefId and newDate are required' }, { status: 400 });
    }

    if (!apiLocal) {
      return NextResponse.json({ error: 'Convex not configured' }, { status: 503 });
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
    return NextResponse.json({ error: 'Failed to reschedule brief' }, { status: 500 });
  }
}

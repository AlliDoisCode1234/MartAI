import { NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated This API route is no longer used.
 * GA4 data fetching is now handled server-side by Convex actions (syncProjectData).
 * Token access has been removed from public queries for security.
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint has been deprecated. Use Convex actions instead.' },
    { status: 410 }
  );
}

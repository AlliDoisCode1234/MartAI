import { NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated This API route is no longer used.
 * GA4 property listing is now handled server-side by Convex actions.
 * Token access has been removed from public queries for security.
 * Keeping this file to prevent 404s if any external callers exist.
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint has been deprecated. Use Convex actions instead.' },
    { status: 410 }
  );
}

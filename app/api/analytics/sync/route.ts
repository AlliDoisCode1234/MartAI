import { NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated This API route is no longer used.
 * Analytics sync is now handled by the Convex cron scheduler
 * (syncAllProjects -> syncProjectData) which securely accesses tokens
 * via internal queries. Token access has been removed from public queries.
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint has been deprecated. Sync is now handled by Convex cron.' },
    { status: 410 }
  );
}

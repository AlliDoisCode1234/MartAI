import { NextResponse } from 'next/server';
import { secureResponse } from '@/lib/authMiddleware';

export const dynamic = 'force-dynamic';

/**
 * Legacy strategy endpoint.
 * The client now calls Convex queries directly, so this route stays as a stub
 * until the file can be deleted.
 */
export async function GET() {
  return secureResponse(
    NextResponse.json(
      {
        error: 'Deprecated: call Convex strategy queries directly from the client.',
      },
      { status: 410 },
    ),
  );
}


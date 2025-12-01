import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexQuery, api } from '@/lib/convexClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['GET'],
    });

    if (authUser.role !== 'admin') {
      return secureResponse(
        NextResponse.json({ error: 'Admin access required' }, { status: 403 }),
      );
    }

    const status = request.nextUrl.searchParams.get('status') || undefined;
    const prospects = await callConvexQuery(
      api.prospects.prospects.listProspects,
      { status: status || undefined },
    );

    return secureResponse(NextResponse.json({ prospects }));
  } catch (error: any) {
    console.error('Admin prospect list error:', error);
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to load prospects' },
        { status: 500 },
      ),
    );
  }
}


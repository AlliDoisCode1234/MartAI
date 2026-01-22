import { NextRequest, NextResponse } from 'next/server';

/**
 * Public API v1 - Briefs (DEPRECATED)
 *
 * This endpoint has been deprecated. Use /api/v1/content instead.
 * The briefs system was replaced by contentPieces (2026-01-22).
 */

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}

export async function GET(request: NextRequest): Promise<Response> {
  return NextResponse.json(
    {
      error: 'This endpoint is deprecated',
      message: 'The briefs system has been replaced by contentPieces. Use /api/v1/content instead.',
      migration: {
        oldPath: '/api/v1/briefs',
        newPath: '/api/v1/content',
        reason: 'briefs were consolidated into the contentPieces table',
      },
    },
    { status: 410 } // Gone
  );
}

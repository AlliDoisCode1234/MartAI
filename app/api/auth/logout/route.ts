import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexMutation } from '@/lib/convexClient';

// Import api dynamically - will be available after npx convex dev
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true, // CSRF protection for logout
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });

    // Get token from header for session deletion
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Delete session from Convex
    if (api && token) {
      try {
        await callConvexMutation(api.auth.sessions.deleteSession, { token });
      } catch (error) {
        console.warn('Failed to delete session:', error);
      }
    }

    return secureResponse(
      NextResponse.json({ success: true })
    );
  } catch (error: any) {
    console.error('Logout error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to logout' },
        { status: 500 }
      )
    );
  }
}


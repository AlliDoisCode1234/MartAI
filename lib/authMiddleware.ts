import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export interface AuthRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
  };
}

// Middleware to verify JWT token
export function verifyAuth(request: NextRequest): { user: { userId: string; email: string } } | null {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  return { user: payload };
}

// Helper to create unauthorized response
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}

// Helper to check auth in API routes
export async function requireAuth(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth) {
    const error = new Error('Unauthorized');
    (error as any).status = 401;
    throw error;
  }
  return auth.user;
}


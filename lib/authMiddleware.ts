import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import type { AuthUser } from '@/types';

export interface AuthRequest extends NextRequest {
  user?: AuthUser;
}

// Middleware to verify JWT token
export function verifyAuth(request: NextRequest): { user: AuthUser } | null {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  // Return minimal auth user (no sensitive data)
  return { 
    user: {
      userId: payload.userId,
      email: payload.email,
    }
  };
}

// Helper to create unauthorized response
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}

// Helper to check auth in API routes
// Returns minimal AuthUser (userId, email) - no sensitive data
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const auth = verifyAuth(request);
  if (!auth) {
    const error = new Error('Unauthorized');
    (error as any).status = 401;
    throw error;
  }
  return auth.user;
}


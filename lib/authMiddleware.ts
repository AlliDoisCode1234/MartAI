import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { 
  validateApiSecurity, 
  addSecurityHeaders, 
  unauthorizedResponse,
  type SecurityValidationOptions 
} from './apiSecurity';
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
      username: payload.username,
      role: payload.role,
    }
  };
}

// Helper to create unauthorized response with security headers
export function createUnauthorizedResponse(error: string = 'Unauthorized', code?: string): NextResponse {
  return unauthorizedResponse(error, code);
}

// Enhanced auth check with optional security validation
export interface RequireAuthOptions extends SecurityValidationOptions {
  // Additional options can be added here
}

// Helper to check auth in API routes with security validation
// Returns minimal AuthUser (userId, email) - no sensitive data
export async function requireAuth(
  request: NextRequest,
  securityOptions?: RequireAuthOptions
): Promise<AuthUser> {
  // First validate security if options provided
  if (securityOptions) {
    const securityCheck = await validateApiSecurity(request, securityOptions);
    if (!securityCheck.valid) {
      const response = unauthorizedResponse(securityCheck.error || 'Unauthorized', securityCheck.code);
      response.headers.set('X-Request-ID', securityCheck.requestId || '');
      throw new Error(securityCheck.error || 'Unauthorized');
    }
  }

  // Then verify authentication
  const auth = verifyAuth(request);
  if (!auth) {
    const error = new Error('Unauthorized');
    (error as any).status = 401;
    (error as any).response = createUnauthorizedResponse('Invalid or missing authentication token', 'INVALID_TOKEN');
    throw error;
  }
  return auth.user;
}

// Wrapper to add security headers to any response
export function secureResponse(response: NextResponse): NextResponse {
  return addSecurityHeaders(response);
}


import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/apiSecurity';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';

/**
 * GET - Generate a CSRF token for authenticated users
 * CSRF tokens should be fetched once per session and included in POST/PUT/PATCH/DELETE requests
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication to get CSRF token
    await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['GET'],
    });

    // Generate new CSRF token
    const csrfToken = generateCsrfToken();

    const response = NextResponse.json({
      csrfToken,
      expiresIn: 3600, // 1 hour in seconds
    });

    return secureResponse(response);
  } catch (error: any) {
    console.error('CSRF token generation error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    const response = NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
    return secureResponse(response);
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateToken } from '@/lib/auth';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';
import { createUserSnapshot } from '@/lib/userSnapshots';
import { validateApiSecurity } from '@/lib/apiSecurity';
import { secureResponse } from '@/lib/authMiddleware';

// Import api dynamically
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
    // Validate security (origin validation, no CSRF needed for token refresh)
    const securityCheck = await validateApiSecurity(request, {
      requireOrigin: true,
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });

    if (!securityCheck.valid) {
      return secureResponse(
        NextResponse.json({ error: securityCheck.error }, { status: 401 })
      );
    }

    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return secureResponse(
        NextResponse.json(
          { error: 'Refresh token is required' },
          { status: 400 }
        )
      );
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return secureResponse(
        NextResponse.json(
          { error: 'Invalid or expired refresh token' },
          { status: 401 }
        )
      );
    }

    // Verify session exists in Convex
    if (api) {
      try {
        const sessions = await callConvexQuery(api.auth.sessions.getSessionsByUser, {
          userId: payload.userId as any,
        });
        
        const validSession = sessions?.find((s: any) => s.token === refreshToken);
        if (!validSession || validSession.expiresAt < Date.now()) {
          return secureResponse(
            NextResponse.json(
              { error: 'Session expired' },
              { status: 401 }
            )
          );
        }
      } catch (error) {
        console.warn('Session verification error:', error);
      }
    }

    // Get latest user data
    let userSnapshot = null;
    if (api) {
      try {
        const user = await callConvexQuery(api.auth.users.getUserById, {
          userId: payload.userId as any,
        });
        if (user) {
          userSnapshot = createUserSnapshot(user);
        }
      } catch (error) {
        console.warn('Failed to fetch user:', error);
      }
    }

    // Generate new access token
    const newAccessToken = generateToken({
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    });

    return secureResponse(
      NextResponse.json({
        success: true,
        token: newAccessToken,
        user: userSnapshot || {
          _id: payload.userId as any,
          username: payload.username,
          role: payload.role,
        },
      })
    );
  } catch (error) {
    console.error('Refresh token error:', error);
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to refresh token' },
        { status: 500 }
      )
    );
  }
}


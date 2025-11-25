import { NextRequest, NextResponse } from 'next/server';
import { generateToken, generateRefreshToken, validateEmail } from '@/lib/auth';
import { callConvexMutation } from '@/lib/convexClient';
import type { UserSnapshot } from '@/types';
import { checkRateLimit, getAccountLock, recordFailedAttempt, clearFailedAttempts } from '@/lib/authRateLimiter';
import { logAuthEvent } from '@/lib/auditLogger';
import { validateApiSecurity, extractClientIp } from '@/lib/apiSecurity';
import { secureResponse } from '@/lib/authMiddleware';

// Import api dynamically - will be available after npx convex dev
let api: any = null;
if (typeof window === 'undefined') {
  try {
    const apiModule = require('@/convex/_generated/api');
    api = apiModule?.api || null;
  } catch {
    api = null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate security (origin validation, no CSRF needed for public login)
    const securityCheck = await validateApiSecurity(request, {
      requireOrigin: true, // Validate origin
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });

    if (!securityCheck.valid) {
      return secureResponse(
        NextResponse.json({ error: securityCheck.error }, { status: 401 })
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return secureResponse(
        NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        )
      );
    }

    if (!validateEmail(email)) {
      return secureResponse(
        NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      );
    }

    const identifier = email.toLowerCase();
    const clientIp = extractClientIp(request);
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      logAuthEvent({
        type: 'login.rate_limited',
        email: identifier,
        ip: clientIp || undefined,
        metadata: { retryAfter: rateLimit.retryAfter },
      });
      return secureResponse(
        NextResponse.json(
          {
            error: 'Too many login attempts. Please wait and try again.',
            retryAfter: rateLimit.retryAfter,
          },
          {
            status: 429,
            headers: rateLimit.retryAfter
              ? { 'Retry-After': String(rateLimit.retryAfter) }
              : undefined,
          }
        )
      );
    }

    const lock = getAccountLock(identifier);
    if (lock.locked) {
      logAuthEvent({
        type: 'login.locked',
        email: identifier,
        ip: clientIp || undefined,
        metadata: { lockedUntil: lock.lockedUntil },
      });
      return secureResponse(
        NextResponse.json(
          {
            error: 'Account temporarily locked due to repeated failures. Try again later.',
            lockedUntil: lock.lockedUntil,
          },
          { status: 423 }
        )
      );
    }

    // Verify credentials using action (never exposes passwordHash)
    if (!api || !api.auth?.users?.verifyUserPassword) {
      console.error('API not available:', { 
        hasApi: !!api, 
        hasAuth: !!api?.auth,
        hasUsers: !!api?.auth?.users,
        hasVerify: !!api?.auth?.users?.verifyUserPassword 
      });
      return secureResponse(
        NextResponse.json(
          { error: 'Authentication service not configured. Please run npx convex dev' },
          { status: 503 }
        )
      );
    }

    let verificationResult;
    
    try {
      // Use mutation for password verification - passwordHash never leaves Convex
      verificationResult = await callConvexMutation(api.auth.users.verifyUserPassword, {
        email: identifier,
        password,
      });
    } catch (error) {
      // Log detailed error for debugging
      console.error('Authentication error:', error instanceof Error ? error.message : 'Unknown error', error);
      return secureResponse(
        NextResponse.json(
          { error: `Authentication service error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 503 }
        )
      );
    }

    if (!verificationResult?.valid || !verificationResult?.user) {
      const failed = recordFailedAttempt(identifier);
      logAuthEvent({
        type: 'login.failure',
        email: identifier,
        ip: clientIp || undefined,
        metadata: {
          attempts: failed.attempts,
          lockedUntil: failed.lockedUntil,
        },
      });

      if (failed.locked) {
      return secureResponse(
        NextResponse.json(
          {
            error: 'Account temporarily locked due to repeated failures. Try again later.',
            lockedUntil: failed.lockedUntil,
          },
          { status: 423 }
        )
      );
    }

    return secureResponse(
      NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    );
    }

    clearFailedAttempts(identifier);

    const user = verificationResult.user;

    // Generate tokens
    const payload = { 
      userId: user._id.toString(), 
      username: user.email,
      role: user.role 
    };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store session in Convex with refresh token
    try {
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      await callConvexMutation(api.auth.sessions.createSession, {
        userId: verificationResult.userId,
        token: refreshToken, // Store refresh token in session
        expiresAt,
      });
    } catch (error) {
      console.warn('Failed to create session:', error);
    }

    // User data already excludes passwordHash from internal mutation
    const userSnapshot: UserSnapshot = {
      _id: user._id,
      username: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    logAuthEvent({
      type: 'login.success',
      email: identifier,
      ip: clientIp || undefined,
    });

    return secureResponse(
      NextResponse.json({
        success: true,
        token: accessToken,
        refreshToken: refreshToken,
        user: userSnapshot,
      })
    );
  } catch (error) {
    console.error('Login error:', error);
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to login' },
        { status: 500 }
      )
    );
  }
}



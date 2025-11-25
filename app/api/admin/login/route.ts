import { NextRequest, NextResponse } from 'next/server';
import { generateToken, generateRefreshToken, validateEmail } from '@/lib/auth';
import { callConvexMutation } from '@/lib/convexClient';
import type { UserSnapshot } from '@/types';
import {
  checkRateLimit,
  getAccountLock,
  recordFailedAttempt,
  clearFailedAttempts,
} from '@/lib/authRateLimiter';
import { logAuthEvent } from '@/lib/auditLogger';
import { validateApiSecurity, extractClientIp } from '@/lib/apiSecurity';
import { secureResponse } from '@/lib/authMiddleware';

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
    const securityCheck = await validateApiSecurity(request, {
      requireOrigin: true,
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });
    if (!securityCheck.valid) {
      return secureResponse(
        NextResponse.json({ error: securityCheck.error }, { status: 401 }),
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return secureResponse(
        NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 },
        ),
      );
    }

    if (!validateEmail(email)) {
      return secureResponse(
        NextResponse.json({ error: 'Invalid email format' }, { status: 400 }),
      );
    }

    const identifier = email.toLowerCase();
    const clientIp = extractClientIp(request);
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      logAuthEvent({
        type: 'admin_login.rate_limited',
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
          },
        ),
      );
    }

    const lock = getAccountLock(identifier);
    if (lock.locked) {
      logAuthEvent({
        type: 'admin_login.locked',
        email: identifier,
        ip: clientIp || undefined,
        metadata: { lockedUntil: lock.lockedUntil },
      });
      return secureResponse(
        NextResponse.json(
          {
            error:
              'Account temporarily locked due to repeated failures. Try again later.',
            lockedUntil: lock.lockedUntil,
          },
          { status: 423 },
        ),
      );
    }

    if (!api || !api.auth?.users?.verifyUserPassword) {
      console.error('Admin login: Convex API unavailable');
      return secureResponse(
        NextResponse.json(
          {
            error:
              'Authentication service not configured. Please run npx convex dev',
          },
          { status: 503 },
        ),
      );
    }

    let verificationResult;
    try {
      verificationResult = await callConvexMutation(
        api.auth.users.verifyUserPassword,
        {
          email: identifier,
          password,
        },
      );
    } catch (error) {
      console.error('Admin authentication error:', error);
      return secureResponse(
        NextResponse.json(
          {
            error: `Authentication service error: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
          },
          { status: 503 },
        ),
      );
    }

    if (!verificationResult?.valid || !verificationResult?.user) {
      const failed = recordFailedAttempt(identifier);
      logAuthEvent({
        type: 'admin_login.failure',
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
              error:
                'Account temporarily locked due to repeated failures. Try again later.',
              lockedUntil: failed.lockedUntil,
            },
            { status: 423 },
          ),
        );
      }

      return secureResponse(
        NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 },
        ),
      );
    }

    if (verificationResult.user.role !== 'admin') {
      logAuthEvent({
        type: 'admin_login.non_admin_attempt',
        email: identifier,
        ip: clientIp || undefined,
      });
      return secureResponse(
        NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 },
        ),
      );
    }

    clearFailedAttempts(identifier);

    const payload = {
      userId: verificationResult.user._id.toString(),
      username: verificationResult.user.email,
      role: verificationResult.user.role,
    };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    try {
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      await callConvexMutation(api.auth.sessions.createSession, {
        userId: verificationResult.userId,
        token: refreshToken,
        expiresAt,
      });
    } catch (error) {
      console.warn('Admin session creation failed:', error);
    }

    const userSnapshot: UserSnapshot = {
      _id: verificationResult.user._id,
      username: verificationResult.user.email,
      name: verificationResult.user.name,
      role: verificationResult.user.role,
      avatarUrl: verificationResult.user.avatarUrl,
      createdAt: verificationResult.user.createdAt,
      updatedAt: verificationResult.user.updatedAt,
    };

    logAuthEvent({
      type: 'admin_login.success',
      email: identifier,
      ip: clientIp || undefined,
    });

    return secureResponse(
      NextResponse.json({
        success: true,
        token: accessToken,
        refreshToken,
        user: userSnapshot,
      }),
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to login as admin' },
        { status: 500 },
      ),
    );
  }
}


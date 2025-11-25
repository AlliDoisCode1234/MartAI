import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, validatePassword, validateEmail, generateToken, generateRefreshToken } from '@/lib/auth';
import { callConvexMutation, callConvexQuery } from '@/lib/convexClient';
import { createUserSnapshot } from '@/lib/userSnapshots';
import type { UserSnapshot, UserId } from '@/types';
import { secureResponse, validateApiSecurity } from '@/lib/apiSecurity';

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
    // Validate security (origin validation, no CSRF needed for public signup)
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
    const { email, password, name } = body;

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

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return secureResponse(
        NextResponse.json(
          { error: passwordValidation.error },
          { status: 400 }
        )
      );
    }

    // Check if user exists (using safe snapshot query - no passwordHash)
    if (api) {
      try {
        const existingUser = await callConvexQuery(api.auth.users.getUserSnapshotByEmail, { email });
        if (existingUser) {
          return secureResponse(
            NextResponse.json(
              { error: 'User already exists' },
              { status: 409 }
            )
          );
        }
      } catch (error) {
        // Convex not configured, continue for development
        console.warn('Convex not configured:', error);
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user in Convex
    let userId: UserId | string;
    let createdUser: any = null;
    
    if (api) {
      try {
        userId = await callConvexMutation(api.auth.users.createUser, {
          email,
          name: name || undefined,
          passwordHash,
        });
        
        // Fetch the created user to get full record
        createdUser = await callConvexQuery(api.auth.users.getUserById, { 
          userId: userId as any 
        });
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          return secureResponse(
            NextResponse.json(
              { error: 'User already exists' },
              { status: 409 }
            )
          );
        }
        // Fallback for development without Convex
        console.warn('Convex error, using fallback:', error);
        userId = `user-${Date.now()}`;
      }
    } else {
      // Fallback for development without Convex
      userId = `user-${Date.now()}`;
    }

    // Generate tokens
    const payload = { userId: userId.toString(), username: email, role: createdUser?.role };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store session in Convex
    if (api) {
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      try {
        await callConvexMutation(api.auth.sessions.createSession, {
          userId: userId as any,
          token: refreshToken,
          expiresAt,
        });
      } catch (error) {
        console.warn('Failed to create session in Convex:', error);
      }
    }

    // Create safe user snapshot
    let userSnapshot: UserSnapshot | null = null;
    
    if (createdUser) {
      userSnapshot = createUserSnapshot(createdUser);
    } else {
      // Fallback snapshot for development
      userSnapshot = {
        _id: userId as any,
        username: email,
        name: name || undefined,
        createdAt: Date.now(),
      };
    }

    return secureResponse(
      NextResponse.json({
        success: true,
        token: accessToken,
        refreshToken: refreshToken,
        user: userSnapshot,
      })
    );
  } catch (error) {
    console.error('Signup error:', error);
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      )
    );
  }
}


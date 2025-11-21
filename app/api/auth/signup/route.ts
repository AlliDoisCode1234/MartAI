import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, validatePassword, validateEmail, generateToken } from '@/lib/auth';
import { callConvexMutation, callConvexQuery } from '@/lib/convexClient';

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
    const body = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Check if user exists
    if (api) {
      try {
        const existingUser = await callConvexQuery(api.auth.users.getUserByEmail, { email });
        if (existingUser) {
          return NextResponse.json(
            { error: 'User already exists' },
            { status: 409 }
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
    let userId;
    if (api) {
      try {
        userId = await callConvexMutation(api.auth.users.createUser, {
          email,
          name: name || undefined,
          passwordHash,
        });
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          return NextResponse.json(
            { error: 'User already exists' },
            { status: 409 }
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

    // Generate token
    const token = generateToken({ userId: userId.toString(), email });

    // Store session in Convex
    if (api) {
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      try {
        await callConvexMutation(api.auth.sessions.createSession, {
          userId: userId as any,
          token,
          expiresAt,
        });
      } catch (error) {
        console.warn('Failed to create session in Convex:', error);
      }
    }

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        email,
        name: name || undefined,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}


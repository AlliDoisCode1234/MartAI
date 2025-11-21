import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, validateEmail } from '@/lib/auth';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';
import { createUserSnapshot } from '@/lib/userSnapshots';
import type { UserSnapshot } from '@/types';

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
    const { email, password } = body;

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

    // Get user from Convex
    if (!api) {
      return NextResponse.json(
        { error: 'Authentication service not configured. Please run npx convex dev' },
        { status: 503 }
      );
    }

    let user;
    let passwordHash;
    
    try {
      user = await callConvexQuery(api.auth.users.getUserByEmail, { email });
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      passwordHash = user.passwordHash;
    } catch (error) {
      console.warn('Convex error:', error);
      return NextResponse.json(
        { error: 'Authentication service error' },
        { status: 503 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({ userId: user._id.toString(), email: user.email });

    // Store session in Convex
    if (api) {
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      try {
        await callConvexMutation(api.auth.sessions.createSession, {
          userId: user._id,
          token,
          expiresAt,
        });
      } catch (error) {
        console.warn('Failed to create session:', error);
      }
    }

    // Create safe user snapshot (excludes passwordHash)
    const userSnapshot = createUserSnapshot(user);
    
    if (!userSnapshot) {
      return NextResponse.json(
        { error: 'Failed to get user data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      token,
      user: userSnapshot,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}


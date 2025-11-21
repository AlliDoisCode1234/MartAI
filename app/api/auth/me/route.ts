import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { callConvexQuery } from '@/lib/convexClient';
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

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user snapshot from Convex (excludes passwordHash)
    if (api) {
      try {
        const user = await callConvexQuery(api.auth.users.getUserById, { 
          userId: payload.userId as any 
        });

        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Create safe user snapshot
        const userSnapshot = createUserSnapshot(user);
        
        if (!userSnapshot) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          user: userSnapshot,
        });
      } catch (error) {
        console.warn('Convex error:', error);
      }
    }
    
    // Fallback for development
    return NextResponse.json({
      user: {
        _id: payload.userId as any,
        email: payload.email,
        createdAt: Date.now(),
      } as UserSnapshot,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}


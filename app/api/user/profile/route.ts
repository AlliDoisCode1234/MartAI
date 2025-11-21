import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';
import { createUserSnapshot } from '@/lib/userSnapshots';
import type { UserSnapshot } from '@/types';
import { assertUserId } from '@/lib/typeGuards';

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    
    if (!api) {
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 503 }
      );
    }

    const userId = assertUserId(authUser.userId);
    const user = await callConvexQuery(api.auth.users.getUserById, { userId });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userSnapshot = createUserSnapshot(user);
    
    return NextResponse.json({ user: userSnapshot });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const body = await request.json();
    const { name, avatarUrl, bio, preferences } = body;
    
    if (!api) {
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 503 }
      );
    }

    const userId = assertUserId(authUser.userId);
    
    // Update user profile (non-sensitive fields only)
    await callConvexMutation(api.auth.users.updateUserProfile, {
      userId,
      name,
      avatarUrl,
      bio,
      preferences,
    });
    
    // Get updated user
    const user = await callConvexQuery(api.auth.users.getUserById, { userId });
    const userSnapshot = createUserSnapshot(user);
    
    return NextResponse.json({ user: userSnapshot });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}


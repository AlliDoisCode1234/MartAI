import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
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
    const authUser = await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['GET'],
    });

    // Get user snapshot from Convex (excludes passwordHash)
    if (api) {
      try {
        const user = await callConvexQuery(api.auth.users.getUserById, { 
          userId: authUser.userId as any 
        });

        if (!user) {
          return secureResponse(
            NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            )
          );
        }

        // Create safe user snapshot
        const userSnapshot = createUserSnapshot(user);
        
        if (!userSnapshot) {
          return secureResponse(
            NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            )
          );
        }

        return secureResponse(
          NextResponse.json({
            user: userSnapshot,
          })
        );
      } catch (error) {
        console.warn('Convex error:', error);
      }
    }
    
    // Fallback for development
    return secureResponse(
      NextResponse.json({
        user: {
          _id: authUser.userId as any,
          username: authUser.username || 'user',
          createdAt: Date.now(),
        } as UserSnapshot,
      })
    );
  } catch (error: any) {
    console.error('Get user error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to get user' },
        { status: 500 }
      )
    );
  }
}


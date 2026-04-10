import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexMutation, callConvexQuery, unsafeApi } from '@/lib/convexClient';
import { assertProjectId, assertUserId } from '@/lib/typeGuards';

export const dynamic = 'force-dynamic';

// Use unsafeApi to avoid TypeScript type instantiation issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiLocal: any = unsafeApi;

/**
 * GET - Get projects for authenticated user
 *
 * NOTE: This REST endpoint is a legacy compatibility layer.
 * The primary frontend uses Convex's reactive `projects.list` query directly.
 * This endpoint uses the deprecated `getProjectsByUser` which is user-scoped,
 * not org-scoped. It will be removed in a future release.
 *
 * @deprecated Prefer Convex reactive `projects.list` query for org-aware results.
 */
export async function GET(request: NextRequest) {
  try {
    // Require auth with origin validation for GET requests
    const authUser = await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['GET'],
    });

    if (!apiLocal) {
      const response = NextResponse.json({ error: 'Convex not configured' }, { status: 503 });
      return secureResponse(response);
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Refactored to use the strictly scoped projects.list which handles multi-org boundaries.
    const projects = await callConvexQuery(
      (apiLocal as any)['projects/projects'].list,
      {},
      token
    );

    const response = NextResponse.json({ projects: projects || [] });
    return secureResponse(response);
  } catch (error: any) {
    console.error('Get projects error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    const response = NextResponse.json({ error: 'Failed to get projects' }, { status: 500 });
    return secureResponse(response);
  }
}

/**
 * POST - Create new project
 *
 * NOTE: This REST endpoint is a legacy compatibility layer.
 * The primary frontend uses Convex's `createProject` mutation directly.
 * The backend mutation now auto-scopes to the user's active org via computed orgId.
 *
 * @deprecated Prefer Convex reactive `projects.createProject` mutation directly.
 */
export async function POST(request: NextRequest) {
  try {
    // Require auth for state-changing operations
    // Note: CSRF protection is not needed with JWT auth (tokens in localStorage/sessionStorage are immune to CSRF)
    const authUser = await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });

    console.log('[API] /api/projects POST request received');

    const body = await request.json();
    const { name, websiteUrl, industry } = body;

    if (!name || !websiteUrl) {
      const response = NextResponse.json(
        { error: 'name and websiteUrl are required' },
        { status: 400 }
      );
      return secureResponse(response);
    }

    if (!apiLocal) {
      const response = NextResponse.json({ error: 'Convex not configured' }, { status: 503 });
      return secureResponse(response);
    }

    const userId = assertUserId(authUser.userId);
    const projectId = await callConvexMutation(
      (apiLocal as any)['projects/projects'].createProject,
      {
        userId: userId as any,
        name,
        websiteUrl,
        industry: industry || undefined,
      }
    );

    const response = NextResponse.json({
      success: true,
      projectId: projectId.toString(),
    });
    return secureResponse(response);
  } catch (error: any) {
    console.error('Create project error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }

    const msg = error.message || '';
    if (msg.includes('LIMIT_REACHED')) {
      const response = NextResponse.json(
        { error: msg.replace('LIMIT_REACHED:', '').trim() },
        { status: 403 }
      );
      return secureResponse(response);
    }

    const response = NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    return secureResponse(response);
  }
}

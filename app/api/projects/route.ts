import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexMutation, callConvexQuery, api } from '@/lib/convexClient';
import { assertProjectId, assertUserId } from '@/lib/typeGuards';

// Import api dynamically
let apiLocal: typeof api = api;
if (typeof window === 'undefined') {
  if (!apiLocal) {
    try {
      apiLocal = require('@/convex/_generated/api')?.api;
    } catch {
      apiLocal = null as any;
    }
  }
}

// GET - Get projects for authenticated user
export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);

    if (!apiLocal) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const userId = assertUserId(authUser.userId);
    // Use the path structure matching the generated API: projects/projects
    const projects = await callConvexQuery((apiLocal as any)["projects/projects"].getProjectsByUser, {
      userId: userId as any,
    });

    return NextResponse.json({ projects: projects || [] });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Failed to get projects' },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    const body = await request.json();
    const { name, websiteUrl, industry } = body;

    if (!name || !websiteUrl) {
      return NextResponse.json(
        { error: 'name and websiteUrl are required' },
        { status: 400 }
      );
    }

    if (!apiLocal) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    const userId = assertUserId(authUser.userId);
    // Use the path structure matching the generated API: projects/projects
    const projectId = await callConvexMutation((apiLocal as any)["projects/projects"].createProject, {
      userId: userId as any,
      name,
      websiteUrl,
      industry: industry || undefined,
    });

    return NextResponse.json({
      success: true,
      projectId: projectId.toString(),
    });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}


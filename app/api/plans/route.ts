import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';
import { assertProjectId, assertPlanId } from '@/lib/typeGuards';

// Import api dynamically for routes that need it
let apiLocal: typeof api = api;
if (typeof window === 'undefined' && !apiLocal) {
  try {
    apiLocal = require('@/convex/_generated/api')?.api;
  } catch {
    apiLocal = null as any;
  }
}

// GET - Get plan for a project
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['GET'],
    });
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return secureResponse(
        NextResponse.json(
          { error: 'projectId is required' },
          { status: 400 }
        )
      );
    }

    if (!apiLocal) {
      return secureResponse(
        NextResponse.json(
          { error: 'Convex not configured' },
          { status: 503 }
        )
      );
    }

    const projectIdTyped = assertProjectId(projectId);
    const plan = await callConvexQuery(apiLocal.quarterlyPlans.getPlanByProject, {
      projectId: projectIdTyped,
    });

    return secureResponse(
      NextResponse.json({ plan })
    );
  } catch (error: any) {
    console.error('Get plan error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to get plan' },
        { status: 500 }
      )
    );
  }
}

// PATCH - Update plan
export async function PATCH(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['PATCH'],
      allowedContentTypes: ['application/json'],
    });
    const body = await request.json();
    const { planId, ...updates } = body;

    if (!planId) {
      return secureResponse(
        NextResponse.json(
          { error: 'planId is required' },
          { status: 400 }
        )
      );
    }

    if (!apiLocal) {
      return secureResponse(
        NextResponse.json(
          { error: 'Convex not configured' },
          { status: 503 }
        )
      );
    }

    const planIdTyped = assertPlanId(planId);
    await callConvexMutation(apiLocal.quarterlyPlans.updatePlan, {
      planId: planIdTyped,
      ...updates,
    });

    return secureResponse(
      NextResponse.json({ success: true })
    );
  } catch (error: any) {
    console.error('Update plan error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to update plan' },
        { status: 500 }
      )
    );
  }
}

// DELETE - Delete plan
export async function DELETE(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['DELETE'],
    });
    const searchParams = request.nextUrl.searchParams;
    const planId = searchParams.get('planId');

    if (!planId) {
      return secureResponse(
        NextResponse.json(
          { error: 'planId is required' },
          { status: 400 }
        )
      );
    }

    if (!apiLocal) {
      return secureResponse(
        NextResponse.json(
          { error: 'Convex not configured' },
          { status: 503 }
        )
      );
    }

    const planIdTyped = assertPlanId(planId);
    await callConvexMutation(apiLocal.quarterlyPlans.deletePlan, {
      planId: planIdTyped,
    });

    return secureResponse(
      NextResponse.json({ success: true })
    );
  } catch (error: any) {
    console.error('Delete plan error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: 'Failed to delete plan' },
        { status: 500 }
      )
    );
  }
}

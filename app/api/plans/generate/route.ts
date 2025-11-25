import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { generateQuarterlyPlan, generatePlanSummary, estimateTraffic, estimateLeads } from '@/lib/quarterlyPlanning';
import { callConvexMutation, callConvexQuery, api } from '@/lib/convexClient';
import { assertProjectId } from '@/lib/typeGuards';

// Import api dynamically for routes that need it
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

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });
    const body = await request.json();
    const { projectId, contentVelocity, startDate, goals } = body;

    if (!projectId || !contentVelocity) {
      return secureResponse(
        NextResponse.json(
          { error: 'projectId and contentVelocity are required' },
          { status: 400 }
        )
      );
    }

    // Validate content velocity
    if (contentVelocity < 1 || contentVelocity > 7) {
      return secureResponse(
        NextResponse.json(
          { error: 'contentVelocity must be between 1 and 7 posts per week' },
          { status: 400 }
        )
      );
    }

    const planStartDate = startDate ? new Date(startDate).getTime() : Date.now();

    // Validate required field first
    const projectIdTyped = assertProjectId(projectId);

    // Get keyword clusters for the project
    let clusters: any[] = [];
    if (apiLocal) {
      try {
        clusters = await callConvexQuery(apiLocal.keywordClusters.getActiveClusters, {
          projectId: projectIdTyped,
        });
      } catch (error) {
        console.warn('Failed to get clusters:', error);
      }
    }

    // Generate brief placeholders
    const briefs = generateQuarterlyPlan(
      contentVelocity,
      planStartDate,
      goals || {},
      clusters
    );

    // Generate plan summary/assumptions
    let assumptions = '';
    if (apiLocal) {
      try {
        const project = await callConvexQuery(apiLocal.projects.getProjectById, {
          projectId: projectIdTyped,
        });
        assumptions = await generatePlanSummary(
          contentVelocity,
          goals || {},
          clusters.length,
          project?.industry
        );
      } catch (error) {
        console.warn('Failed to generate plan summary:', error);
        assumptions = `Quarterly plan with ${contentVelocity} posts/week targeting ${clusters.length} keyword clusters.`;
      }
    }

    // Calculate estimated metrics if goals not provided
    const finalGoals = goals || {};
    if (!finalGoals.traffic) {
      finalGoals.traffic = estimateTraffic(contentVelocity);
    }
    if (!finalGoals.leads && finalGoals.traffic) {
      finalGoals.leads = estimateLeads(finalGoals.traffic);
    }

    // Create plan in Convex
    let planId;
    if (apiLocal) {
      try {
        planId = await callConvexMutation(apiLocal.quarterlyPlans.createQuarterlyPlan, {
          projectId: projectIdTyped,
          contentVelocity,
          startDate: planStartDate,
          goals: finalGoals,
          assumptions,
        });
      } catch (error) {
        console.error('Failed to create plan in Convex:', error);
        // Return plan data even if Convex fails
        return secureResponse(
          NextResponse.json({
            success: true,
            plan: {
              contentVelocity,
              startDate: planStartDate,
              goals: finalGoals,
              assumptions,
              briefs,
            },
            count: briefs.length,
          })
        );
      }
    }

    return secureResponse(
      NextResponse.json({
        success: true,
        planId,
        plan: {
          contentVelocity,
          startDate: planStartDate,
          goals: finalGoals,
          assumptions,
          briefs,
        },
        count: briefs.length,
      })
    );
  } catch (error: any) {
    console.error('Generate plan error:', error);
    if (error.status === 401 && error.response) {
      return error.response;
    }
    return secureResponse(
      NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to generate plan' },
        { status: 500 }
      )
    );
  }
}

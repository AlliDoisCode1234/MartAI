import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { generateQuarterlyPlan, generatePlanSummary, estimateTraffic, estimateLeads } from '@/lib/quarterlyPlanning';
import { callConvexMutation, callConvexQuery } from '@/lib/convexClient';

// Import api dynamically
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
    const user = await requireAuth(request);
    const body = await request.json();
    const { projectId, contentVelocity, startDate, goals } = body;

    if (!projectId || !contentVelocity) {
      return NextResponse.json(
        { error: 'projectId and contentVelocity are required' },
        { status: 400 }
      );
    }

    // Validate content velocity
    if (contentVelocity < 1 || contentVelocity > 7) {
      return NextResponse.json(
        { error: 'contentVelocity must be between 1 and 7 posts per week' },
        { status: 400 }
      );
    }

    const planStartDate = startDate ? new Date(startDate).getTime() : Date.now();

    // Get keyword clusters for the project
    let clusters: any[] = [];
    if (api) {
      try {
        clusters = await callConvexQuery(api.keywordClusters.getActiveClusters, {
          projectId: projectId as any,
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
    if (api) {
      try {
        const project = await callConvexQuery(api.projects.getProjectById, {
          projectId: projectId as any,
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
    if (api) {
      try {
        planId = await callConvexMutation(api.quarterlyPlans.createQuarterlyPlan, {
          projectId: projectId as any,
          contentVelocity,
          startDate: planStartDate,
          goals: finalGoals,
          assumptions,
        });
      } catch (error) {
        console.error('Failed to create plan in Convex:', error);
        // Return plan data even if Convex fails
        return NextResponse.json({
          success: true,
          plan: {
            contentVelocity,
            startDate: planStartDate,
            goals: finalGoals,
            assumptions,
            briefs,
          },
          count: briefs.length,
        });
      }
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Generate plan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate plan' },
      { status: 500 }
    );
  }
}


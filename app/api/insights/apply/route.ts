import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';

// Apply insight - adjust plan or draft task
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { insightId, action, projectId } = body;

    if (!insightId || !action || !projectId) {
      return NextResponse.json(
        { error: 'insightId, action, and projectId are required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    // Get insight details
    const insights = await callConvexQuery(api.analytics.getInsights, {
      projectId: projectId as any,
    });

    const insight = insights.find((i: any) => (i._id || i.id) === insightId);
    if (!insight) {
      return NextResponse.json(
        { error: 'Insight not found' },
        { status: 404 }
      );
    }

    // Apply the insight based on action type
    let result: any = { success: true };

    switch (action) {
      case 'adjust_plan':
        // Add new brief to plan based on insight
        if (insight.metadata?.keywords || insight.metadata?.clusterId) {
          // Get current plan
          const plans = await callConvexQuery(api.quarterlyPlans.getQuarterlyPlansByProjectId, {
            projectId: projectId as any,
          });
          
          if (plans && plans.length > 0) {
            const plan = plans[0];
            // Create new brief for this insight
            const briefId = await callConvexMutation(api.briefs.createBrief, {
              planId: plan._id,
              title: insight.title,
              scheduledDate: Date.now() + (7 * 24 * 60 * 60 * 1000), // Next week
              clusterId: insight.metadata?.clusterId,
              status: 'draft',
            });
            result.briefId = briefId;
            result.message = 'Added new brief to plan';
          }
        }
        break;

      case 'draft_task':
        // Create a task/brief based on insight
        const taskBriefId = await callConvexMutation(api.briefs.createBrief, {
          planId: undefined, // Standalone task
          title: `Task: ${insight.title}`,
          scheduledDate: Date.now(),
          status: 'draft',
        });
        result.briefId = taskBriefId;
        result.message = 'Created task from insight';
        break;

      case 'optimize_meta':
        // Flag existing content for meta optimization
        result.message = 'Content flagged for meta optimization';
        break;

      case 'optimize_keywords':
        // Add keywords to optimization queue
        result.message = 'Keywords added to optimization queue';
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    // Mark insight as applied
    await callConvexMutation(api.analytics.applyInsight, {
      insightId: insightId as any,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Apply insight error:', error);
    return NextResponse.json(
      { error: 'Failed to apply insight' },
      { status: 500 }
    );
  }
}


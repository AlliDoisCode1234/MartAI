import { unsafeApi as api, callConvexAction } from '@/lib/convexClient';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, website, industry, targetAudience, monthlyRevenueGoal } = body;

    if (!companyName || !website || !industry) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await callConvexAction(api.seo.agentActions.runSEOAgent, {
      companyName,
      website,
      industry,
      targetAudience: targetAudience || 'General Audience',
      monthlyRevenueGoal: monthlyRevenueGoal || 'Not specified',
    });

    // Map new result structure to maintain backward compatibility with frontend where possible
    return Response.json({
      finalAnswer: result.aiAnalysis.executiveSummary,
      siteAnalysis: result.siteAnalysis,
      // Enhanced data
      keywords: result.keywords,
      scores: result.scores,
      aiAnalysis: result.aiAnalysis,
      traceId: result.traceId,
    });
  } catch (error) {
    console.error('[SEO Agent API] Error:', error);
    return Response.json({ error: 'Failed to run SEO agent' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ status: 'ok', agent: 'convex-refactored-intelligence-service' });
}

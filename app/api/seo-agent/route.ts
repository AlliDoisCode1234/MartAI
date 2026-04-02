import { unsafeApi as api, callConvexAction } from '@/lib/convexClient';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, website, industry, targetAudience, monthlyRevenueGoal } = body;

    if (!companyName || !website || !industry) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';

    const result = await callConvexAction(api.seo.agentActions.runSEOAgent, {
      companyName,
      website,
      industry,
      targetAudience: targetAudience || 'General Audience',
      monthlyRevenueGoal: monthlyRevenueGoal || 'Not specified',
      clientIp: ip,
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
  } catch (error: any) {
    console.error('[SEO Agent API] Error:', error);
    
    // Explicitly catch Rate Limits bubbling from Convex backend
    if (error.message && error.message.includes('[RATE_LIMITED]')) {
      return Response.json({ error: 'Too many requests. Please wait a minute before trying again.' }, { status: 429 });
    }
    
    return Response.json({ error: 'Failed to run SEO agent' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ status: 'ok', agent: 'convex-refactored-intelligence-service' });
}

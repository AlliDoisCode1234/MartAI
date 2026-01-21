/**
 * PR Score Badge API Route
 *
 * Public endpoint that returns SVG badge for embedding.
 * GET /api/badge/{projectId}?style=compact|full&theme=light|dark
 */

import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { unsafeApi as api } from '@/lib/convexClient';
import type { Id } from '@/convex/_generated/dataModel';
import { generateBadgeSvg } from '@/lib/utils/generateBadgeSvg';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await context.params;
    const { searchParams } = new URL(request.url);

    const style = (searchParams.get('style') as 'compact' | 'full') || 'compact';
    const theme = (searchParams.get('theme') as 'light' | 'dark') || 'light';

    // Fetch MR score from Convex
    const score = await convex.query(api.analytics.martaiRatingQueries.getLatestScore, {
      projectId: projectId as Id<'projects'>,
    });

    if (!score) {
      return new NextResponse('Project not found or no score available', { status: 404 });
    }

    // Generate SVG
    const svg = generateBadgeSvg({
      score: score.overall ?? 0,
      style,
      theme,
    });

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600', // Cache 1 hour
      },
    });
  } catch (error) {
    console.error('[Badge API] Error:', error);
    return new NextResponse('Error generating badge', { status: 500 });
  }
}

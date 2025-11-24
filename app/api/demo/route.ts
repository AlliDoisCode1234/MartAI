import { NextRequest, NextResponse } from 'next/server';
import { generateDemoData } from '@/lib/demoData';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, companyName, industry, targetAudience } = body || {};

    if (!url) {
      return NextResponse.json(
        { error: 'url is required (e.g. https://example.com)' },
        { status: 400 }
      );
    }

    const demo = generateDemoData({ url, companyName, industry, targetAudience });
    return NextResponse.json({
      success: true,
      generatedAt: Date.now(),
      demo,
    });
  } catch (error) {
    console.error('Demo generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate demo data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const demo = generateDemoData({ url: 'https://martai-demo.com' });
  return NextResponse.json({
    success: true,
    message: 'Demo endpoint is ready',
    example: demo,
  });
}


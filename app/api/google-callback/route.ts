import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

// Ensure we have the Convex URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn('NEXT_PUBLIC_CONVEX_URL is not defined');
}

const convex = new ConvexHttpClient(convexUrl as string);

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state'); // This is the ProjectId we passed
  const error = req.nextUrl.searchParams.get('error');

  const baseUrl = new URL(req.url).origin;

  if (error) {
    return NextResponse.redirect(new URL(`/integrations?error=${error}`, baseUrl));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/integrations?error=missing_params', baseUrl));
  }

  try {
    console.log(`[GoogleCallback] Exchanging code for Project: ${state}`);

    // Exchange code for tokens and save them to the project
    await convex.action(api.integrations.google.exchangeCode, {
      code,
      projectId: state as any, // Cast because we know it's an ID
    });

    // Redirect back to integrations page with success
    return NextResponse.redirect(new URL('/integrations?success=ga4&property=connected', baseUrl));
  } catch (e) {
    console.error('[GoogleCallback] Error:', e);
    return NextResponse.redirect(new URL('/integrations?error=exchange_failed', baseUrl));
  }
}

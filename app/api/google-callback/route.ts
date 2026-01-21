import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { unsafeApi } from '@/lib/convexClient';

// Ensure we have the Convex URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn('NEXT_PUBLIC_CONVEX_URL is not defined');
}

const convex = new ConvexHttpClient(convexUrl as string);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api: any = unsafeApi;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const stateParam = req.nextUrl.searchParams.get('state'); // Base64-encoded JSON with {projectId, returnTo}
  const error = req.nextUrl.searchParams.get('error');

  const baseUrl = new URL(req.url).origin;

  if (error) {
    return NextResponse.redirect(new URL(`/integrations?error=${error}`, baseUrl));
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(new URL('/integrations?error=missing_params', baseUrl));
  }

  // Decode the base64 state parameter to extract projectId
  let projectId: string | undefined;
  let returnTo: string | undefined;
  try {
    const stateJson = Buffer.from(stateParam, 'base64').toString('utf-8');
    const stateData = JSON.parse(stateJson);
    projectId = stateData.projectId;
    returnTo = stateData.returnTo;
    console.log(`[GoogleCallback] Decoded state - projectId: ${projectId}, returnTo: ${returnTo}`);
  } catch {
    console.error('[GoogleCallback] Failed to decode state parameter');
    return NextResponse.redirect(new URL('/integrations?error=invalid_state', baseUrl));
  }

  if (!projectId) {
    return NextResponse.redirect(new URL('/integrations?error=missing_project_id', baseUrl));
  }

  try {
    console.log(`[GoogleCallback] Exchanging code for Project: ${projectId}`);

    // Exchange code for tokens
    const tokens = await convex.action(api.integrations.google.exchangeCode, {
      code,
      projectId: projectId as any,
    });

    // Encode tokens to pass to frontend for Property ID entry
    // Using base64 to safely pass in URL
    const tokenData = Buffer.from(
      JSON.stringify({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        projectId: projectId,
      })
    ).toString('base64');

    // Redirect to integrations page (or returnTo if specified) with tokens in URL
    const redirectPath = returnTo || '/integrations';
    return NextResponse.redirect(
      new URL(`${redirectPath}?setup=ga4&tokens=${encodeURIComponent(tokenData)}`, baseUrl)
    );
  } catch (e) {
    console.error('[GoogleCallback] Error:', e);
    return NextResponse.redirect(new URL('/integrations?error=exchange_failed', baseUrl));
  }
}

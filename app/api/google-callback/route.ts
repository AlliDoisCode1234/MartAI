import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import type { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';

// Ensure we have the Convex URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn('[GoogleOAuth][Callback] NEXT_PUBLIC_CONVEX_URL is NOT defined');
} else {
  console.log('[GoogleOAuth][Callback] NEXT_PUBLIC_CONVEX_URL:', convexUrl ? 'SET' : 'UNSET');
}

const convex = new ConvexHttpClient(convexUrl as string);

export async function GET(req: NextRequest) {
  console.log('[GoogleOAuth][Callback] === CALLBACK HIT ===');
  console.log('[GoogleOAuth][Callback] Full URL:', req.nextUrl.toString());

  const code = req.nextUrl.searchParams.get('code');
  const stateParam = req.nextUrl.searchParams.get('state');
  const error = req.nextUrl.searchParams.get('error');

  console.log('[GoogleOAuth][Callback] Raw params:', {
    hasCode: !!code,
    hasState: !!stateParam,
    error: error || 'none',
  });

  // Determine the fallback redirect path — use returnTo from state if available,
  // otherwise fall back to settings integrations tab.
  // We need returnTo for ALL error paths, so attempt to decode state early.
  let returnTo: string | undefined;
  let projectId: string | undefined;

  if (stateParam) {
    try {
      const stateJson = Buffer.from(stateParam, 'base64').toString('utf-8');
      const secureState = JSON.parse(stateJson);
      const stateData = secureState.p ? JSON.parse(secureState.p) : secureState;
      projectId = stateData.projectId;
      
      const rawReturnTo = stateData.returnTo;
      if (typeof rawReturnTo === 'string' && rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//')) {
        returnTo = rawReturnTo;
      } else if (rawReturnTo) {
        console.warn('[GoogleOAuth][Callback] Invalid returnTo path rejected');
      }

      console.log('[GoogleOAuth][Callback] Decoded state projectId:', projectId);
    } catch {
      console.error('[GoogleOAuth][Callback] Failed to decode state parameter');
    }
  }

  // Hardcode single base URL strictly based on production environment
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Helper: build redirect URL with error params, respecting returnTo
  const buildErrorRedirect = (errorCode: string) => {
    const path = returnTo || '/settings?tab=integrations';
    const url = new URL(path, baseUrl);
    url.searchParams.set('success', 'false');
    url.searchParams.set('error', errorCode);
    return url;
  };

  if (error) {
    console.error('[GoogleOAuth][Callback] Google returned error:', error);
    return NextResponse.redirect(buildErrorRedirect(error));
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(buildErrorRedirect('missing_params'));
  }

  // State was already decoded above — just validate projectId
  if (!projectId) {
    return NextResponse.redirect(buildErrorRedirect('missing_project_id'));
  }

  // Server-to-server shared secret — validates that this call originates from
  // our own Next.js API route, not an external attacker
  const serverSecret = process.env.CONVEX_SERVER_SECRET;
  if (!serverSecret) {
    console.error('[GoogleOAuth][Callback] CONVEX_SERVER_SECRET is NOT configured');
    return NextResponse.redirect(buildErrorRedirect('server_config_error'));
  }

  try {
    console.log('[GoogleOAuth][Callback] Exchanging code via serverExchangeAndSave...');

    // Call the PUBLIC action with shared-secret gate (NOT internalAction)
    // ConvexHttpClient cannot call internalAction — this is a Convex platform constraint
    const result = await convex.action(api.integrations.google.serverExchangeAndSave, {
      serverSecret,
      code,
      projectId: projectId as Id<'projects'>,
      stateRaw: stateParam,
    });

    const ga4Saved = result.ga4Saved;
    const gscSaved = result.gscSaved;
    const gscSiteCount = result.gscSiteCount;

    console.log('[GoogleOAuth][Callback] === SUMMARY ===', {
      ga4Saved,
      gscSaved,
      projectId,
    });

    // Step 4: Redirect based on actual save results
    const redirectPath = returnTo || '/settings?tab=integrations';
    const redirectUrl = new URL(redirectPath, baseUrl);

    if (ga4Saved || gscSaved) {
      // Trigger initial per-project sync (fire-and-forget so redirect isn't delayed)
      // Uses the public syncProject action (ConvexHttpClient can't call internal functions)
      try {
        console.log(
          '[GoogleOAuth][Callback] Triggering initial sync for project:',
          projectId
        );
        convex
          .action(api['analytics/scheduler'].syncProject, {
            projectId: projectId as Id<'projects'>,
          })
          .then(
            (syncResult: unknown) =>
              console.log('[GoogleOAuth][Callback] Initial sync complete:', syncResult),
            (err: unknown) =>
              console.error('[GoogleOAuth][Callback] Initial sync failed:', err)
          );
      } catch (syncErr) {
        console.error('[GoogleOAuth][Callback] Failed to trigger sync:', syncErr);
      }

      redirectUrl.searchParams.set('setup', 'ga4');
      redirectUrl.searchParams.set('success', 'true');
      if (ga4Saved) redirectUrl.searchParams.set('ga4', 'saved');
      if (gscSaved) {
        redirectUrl.searchParams.set('gsc', 'saved');
        // Signal to UI that multiple sites are available for selection
        if (gscSiteCount > 1) {
          redirectUrl.searchParams.set('gsc_sites', String(gscSiteCount));
        }
      }
      console.log(
        '[GoogleOAuth][Callback] SUCCESS — redirecting to:',
        redirectUrl.toString()
      );
    } else {
      redirectUrl.searchParams.set('error', 'no_properties_saved');
      console.error(
        '[GoogleOAuth][Callback] FAILED — tokens exchanged but no properties saved'
      );
    }

    return NextResponse.redirect(redirectUrl);
  } catch (e) {
    console.error('[GoogleOAuth][Callback] UNHANDLED ERROR:', e);
    return NextResponse.redirect(buildErrorRedirect('exchange_failed'));
  }
}

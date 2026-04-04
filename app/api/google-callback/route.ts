import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import type { Id } from '@/convex/_generated/dataModel';
import { internal } from '@/convex/_generated/api';

// Ensure we have the Convex URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn('[GoogleOAuth][LegacyCallback] NEXT_PUBLIC_CONVEX_URL is NOT defined');
} else {
  console.log('[GoogleOAuth][LegacyCallback] NEXT_PUBLIC_CONVEX_URL:', convexUrl ? 'SET' : 'UNSET');
}

const convex = new ConvexHttpClient(convexUrl as string);

export async function GET(req: NextRequest) {
  console.log('[GoogleOAuth][LegacyCallback] === LEGACY CALLBACK HIT ===');
  console.log('[GoogleOAuth][LegacyCallback] Full URL:', req.nextUrl.toString());

  const code = req.nextUrl.searchParams.get('code');
  const stateParam = req.nextUrl.searchParams.get('state');
  const error = req.nextUrl.searchParams.get('error');

  console.log('[GoogleOAuth][LegacyCallback] Raw params:', {
    hasCode: !!code,
    hasState: !!stateParam,
    error: error || 'none',
  });

  const baseUrl = new URL(req.url).origin;

  if (error) {
    console.error('[GoogleOAuth][LegacyCallback] Google returned error:', error);
    return NextResponse.redirect(new URL(`/settings?tab=integrations&error=${error}`, baseUrl));
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(
      new URL('/settings?tab=integrations&error=missing_params', baseUrl)
    );
  }

  // Decode the base64 state parameter to extract projectId
  let projectId: string | undefined;
  let returnTo: string | undefined;
  try {
    const stateJson = Buffer.from(stateParam, 'base64').toString('utf-8');
    const stateData = JSON.parse(stateJson);
    projectId = stateData.projectId;
    returnTo = stateData.returnTo;
    console.log('[GoogleOAuth][LegacyCallback] Decoded state:', {
      projectId,
      returnTo,
      fullState: stateData,
    });
  } catch {
    console.error(
      '[GoogleOAuth][LegacyCallback] Failed to decode state parameter, raw value:',
      stateParam?.substring(0, 50)
    );
    return NextResponse.redirect(
      new URL('/settings?tab=integrations&error=invalid_state', baseUrl)
    );
  }

  if (!projectId) {
    return NextResponse.redirect(
      new URL('/settings?tab=integrations&error=missing_project_id', baseUrl)
    );
  }

  try {
    console.log('[GoogleOAuth][LegacyCallback] Step 1-3: Exchanging code and saving securely via internalAction...');

    // Use internalAction — this server-side route has no user auth session.
    // Security: projectId was verified at generateAuthUrl time and carried
    // through the OAuth state round-trip.
    const result = await convex.action(internal.integrations.google.internalExchangeAndSave, {
      code,
      projectId: projectId as Id<'projects'>,
      redirectUri: process.env.GOOGLE_REDIRECT_URI || undefined,
    });

    const ga4Saved = result.ga4Saved;
    const gscSaved = result.gscSaved;
    const gscSiteCount = result.gscSiteCount;

    console.log('[GoogleOAuth][LegacyCallback] === SUMMARY ===', {
      ga4Saved,
      gscSaved,
      projectId,
    });

    // Step 4: Redirect based on actual save results
    const redirectPath = returnTo || '/settings?tab=integrations';
    const redirectUrl = new URL(redirectPath, baseUrl);

    if (ga4Saved || gscSaved) {
      // Trigger initial per-project sync (fire-and-forget so redirect isn't delayed)
      try {
        console.log(
          '[GoogleOAuth][LegacyCallback] Triggering initial sync for project:',
          projectId
        );
        convex
          .action(internal.analytics.sync.syncProjectData, {
            projectId: projectId as Id<'projects'>,
          })
          .then(
            (result: unknown) =>
              console.log('[GoogleOAuth][LegacyCallback] Initial sync complete:', result),
            (err: unknown) =>
              console.error('[GoogleOAuth][LegacyCallback] Initial sync failed:', err)
          );
      } catch (syncErr) {
        console.error('[GoogleOAuth][LegacyCallback] Failed to trigger sync:', syncErr);
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
        '[GoogleOAuth][LegacyCallback] SUCCESS — redirecting to:',
        redirectUrl.toString()
      );
    } else {
      redirectUrl.searchParams.set('error', 'no_properties_saved');
      console.error(
        '[GoogleOAuth][LegacyCallback] FAILED — tokens exchanged but no properties saved'
      );
    }

    return NextResponse.redirect(redirectUrl);
  } catch (e) {
    console.error('[GoogleOAuth][LegacyCallback] UNHANDLED ERROR:', e);
    return NextResponse.redirect(
      new URL('/settings?tab=integrations&error=exchange_failed', baseUrl)
    );
  }
}

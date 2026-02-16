import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { unsafeApi } from '@/lib/convexClient';

// Ensure we have the Convex URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn('[GoogleOAuth][LegacyCallback] NEXT_PUBLIC_CONVEX_URL is NOT defined');
} else {
  console.log('[GoogleOAuth][LegacyCallback] NEXT_PUBLIC_CONVEX_URL:', convexUrl ? 'SET' : 'UNSET');
}

const convex = new ConvexHttpClient(convexUrl as string);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api: any = unsafeApi;

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
    console.log('[GoogleOAuth][LegacyCallback] Step 1: Exchanging code for tokens...');

    // Step 1: Exchange authorization code for tokens
    const tokens = await convex.action(api.integrations.google.exchangeCode, {
      code,
      projectId: projectId as any,
    });

    console.log('[GoogleOAuth][LegacyCallback] Token exchange result:', {
      hasAccessToken: !!tokens.accessToken,
      hasRefreshToken: !!tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    });

    if (!tokens.accessToken) {
      console.error('[GoogleOAuth][LegacyCallback] No access token received');
      return NextResponse.redirect(
        new URL('/settings?tab=integrations&error=no_access_token', baseUrl)
      );
    }

    // Step 2: List GA4 properties and save connection server-side
    let ga4Saved = false;
    try {
      console.log('[GoogleOAuth][LegacyCallback] Step 2: Listing GA4 properties...');
      const properties = await convex.action(api.integrations.google.listGA4Properties, {
        accessToken: tokens.accessToken,
      });

      console.log('[GoogleOAuth][LegacyCallback] GA4 properties found:', properties.length);

      if (properties.length > 0) {
        const property = properties[0];
        console.log('[GoogleOAuth][LegacyCallback] GA4 first property:', {
          displayName: property.displayName,
          propertyId: property.propertyId,
        });

        console.log('[GoogleOAuth][LegacyCallback] Saving GA4 connection via mutation...');
        await convex.mutation(api.integrations.ga4Connections.upsertGA4Connection, {
          projectId: projectId as any,
          propertyId: property.propertyId,
          propertyName: property.displayName,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        ga4Saved = true;
        console.log('[GoogleOAuth][LegacyCallback] GA4 connection SAVED');
      } else {
        console.warn('[GoogleOAuth][LegacyCallback] No GA4 properties found for this account');
      }
    } catch (ga4Error) {
      console.error('[GoogleOAuth][LegacyCallback] GA4 property listing/save FAILED:', ga4Error);
      // Continue - GSC may still work
    }

    // Step 3: List GSC sites and save connection server-side
    let gscSaved = false;
    try {
      console.log('[GoogleOAuth][LegacyCallback] Step 3: Listing GSC sites...');
      const sites = await convex.action(api.integrations.google.listGSCSites, {
        accessToken: tokens.accessToken,
      });

      console.log('[GoogleOAuth][LegacyCallback] GSC sites found:', sites.length);

      if (sites.length > 0) {
        const site =
          sites.find((s: { permissionLevel: string }) => s.permissionLevel === 'siteOwner') ||
          sites[0];
        console.log('[GoogleOAuth][LegacyCallback] GSC selected site:', {
          siteUrl: site.siteUrl,
          permissionLevel: site.permissionLevel,
        });

        console.log('[GoogleOAuth][LegacyCallback] Saving GSC connection via mutation...');
        await convex.mutation(api.integrations.gscConnections.upsertGSCConnection, {
          projectId: projectId as any,
          siteUrl: site.siteUrl,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        gscSaved = true;
        console.log('[GoogleOAuth][LegacyCallback] GSC connection SAVED');
      } else {
        console.warn('[GoogleOAuth][LegacyCallback] No GSC sites found for this account');
      }
    } catch (gscError) {
      console.error('[GoogleOAuth][LegacyCallback] GSC site listing/save FAILED:', gscError);
      // Continue - GA4 may have already been saved
    }

    console.log('[GoogleOAuth][LegacyCallback] === SUMMARY ===', {
      ga4Saved,
      gscSaved,
      projectId,
    });

    // Step 4: Redirect to settings page with success indicator
    const redirectPath = returnTo || '/settings?tab=integrations';
    const redirectUrl = new URL(redirectPath, baseUrl);
    redirectUrl.searchParams.set('setup', 'ga4');
    redirectUrl.searchParams.set('success', 'true');
    console.log('[GoogleOAuth][LegacyCallback] Redirecting to:', redirectUrl.toString());

    return NextResponse.redirect(redirectUrl);
  } catch (e) {
    console.error('[GoogleOAuth][LegacyCallback] UNHANDLED ERROR:', e);
    return NextResponse.redirect(
      new URL('/settings?tab=integrations&error=exchange_failed', baseUrl)
    );
  }
}

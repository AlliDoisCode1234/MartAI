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
  const stateParam = req.nextUrl.searchParams.get('state');
  const error = req.nextUrl.searchParams.get('error');

  const baseUrl = new URL(req.url).origin;

  if (error) {
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
    console.log(`[GoogleCallback] Decoded state - projectId: ${projectId}, returnTo: ${returnTo}`);
  } catch {
    console.error('[GoogleCallback] Failed to decode state parameter');
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
    console.log(`[GoogleCallback] Exchanging code for Project: ${projectId}`);

    // Step 1: Exchange authorization code for tokens
    const tokens = await convex.action(api.integrations.google.exchangeCode, {
      code,
      projectId: projectId as any,
    });

    if (!tokens.accessToken) {
      console.error('[GoogleCallback] No access token received');
      return NextResponse.redirect(
        new URL('/settings?tab=integrations&error=no_access_token', baseUrl)
      );
    }

    // Step 2: List GA4 properties and save connection server-side
    try {
      const properties = await convex.action(api.integrations.google.listGA4Properties, {
        accessToken: tokens.accessToken,
      });

      if (properties.length > 0) {
        const property = properties[0];
        console.log(
          `[GoogleCallback] Found GA4 property: ${property.displayName} (${property.propertyId})`
        );

        await convex.mutation(api.integrations.ga4Connections.upsertGA4Connection, {
          projectId: projectId as any,
          propertyId: property.propertyId,
          propertyName: property.displayName,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        console.log('[GoogleCallback] GA4 connection saved');
      } else {
        console.warn('[GoogleCallback] No GA4 properties found for this account');
      }
    } catch (ga4Error) {
      console.error('[GoogleCallback] GA4 property listing/save failed:', ga4Error);
      // Continue — GSC may still work
    }

    // Step 3: List GSC sites and save connection server-side
    try {
      const sites = await convex.action(api.integrations.google.listGSCSites, {
        accessToken: tokens.accessToken,
      });

      if (sites.length > 0) {
        const site =
          sites.find((s: { permissionLevel: string }) => s.permissionLevel === 'siteOwner') ||
          sites[0];
        console.log(`[GoogleCallback] Found GSC site: ${site.siteUrl}`);

        await convex.mutation(api.integrations.gscConnections.upsertGSCConnection, {
          projectId: projectId as any,
          siteUrl: site.siteUrl,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        console.log('[GoogleCallback] GSC connection saved');
      } else {
        console.warn('[GoogleCallback] No GSC sites found for this account');
      }
    } catch (gscError) {
      console.error('[GoogleCallback] GSC site listing/save failed:', gscError);
      // Continue — GA4 may have already been saved
    }

    // Step 4: Redirect to settings page with success indicator
    const redirectPath = returnTo || '/settings?tab=integrations';
    const redirectUrl = new URL(redirectPath, baseUrl);
    redirectUrl.searchParams.set('setup', 'ga4');
    redirectUrl.searchParams.set('success', 'true');

    return NextResponse.redirect(redirectUrl);
  } catch (e) {
    console.error('[GoogleCallback] Error:', e);
    return NextResponse.redirect(
      new URL('/settings?tab=integrations&error=exchange_failed', baseUrl)
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode, getGA4Properties, getGSCSites } from '@/lib/googleAuth';
import { callConvexMutation } from '@/lib/convexClient';

// Import callConvexMutation helper
async function callMutation(mutation: any, args: any) {
  try {
    console.log('[GoogleOAuth][NewerCallback] Calling Convex mutation...');
    return await callConvexMutation(mutation, args);
  } catch (error) {
    console.error('[GoogleOAuth][NewerCallback] Convex mutation error:', error);
    throw error;
  }
}

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
    console.log(
      '[GoogleOAuth][NewerCallback] Convex API import:',
      api ? 'SUCCESS' : 'NULL (import returned falsy)'
    );
  } catch (importErr) {
    console.error('[GoogleOAuth][NewerCallback] Convex API import FAILED:', importErr);
    api = null;
  }
}

// Helper to build redirect URL - preserves existing params in returnTo
function buildRedirectUrl(
  baseUrl: string,
  returnTo: string | undefined,
  params: Record<string, string>
): string {
  // Default to /settings?tab=integrations if no returnTo specified
  const targetPath = returnTo || '/settings?tab=integrations';
  const url = new URL(targetPath, baseUrl);

  // Add new params (won't overwrite existing ones in returnTo)
  for (const [key, value] of Object.entries(params)) {
    // Only add if not already in the URL
    if (!url.searchParams.has(key)) {
      url.searchParams.append(key, value);
    }
  }

  return url.toString();
}

// Helper for OAuth response - redirect to returnTo with params
function oauthResponse(
  baseUrl: string,
  returnTo: string | undefined,
  params: Record<string, string | boolean>
): NextResponse {
  const redirectUrl = buildRedirectUrl(
    baseUrl,
    returnTo,
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
  );
  console.log('[GoogleOAuth][NewerCallback] Redirecting to:', redirectUrl);
  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;
  console.log('[GoogleOAuth][Callback] === CALLBACK HIT ===');

  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('[GoogleOAuth][Callback] Params received:', {
      hasCode: !!code,
      hasState: !!state,
      hasError: !!error,
    });

    // Parse state first to get returnTo
    let stateData: { projectId?: string; returnTo?: string; type?: string } = {};
    if (state) {
      try {
        stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        console.log('[GoogleOAuth][NewerCallback] Decoded state:', stateData);
      } catch {
        // State might be plain projectId for backwards compatibility
        stateData = { projectId: state };
        console.warn(
          '[GoogleOAuth][NewerCallback] State decode failed, treating as plain projectId:',
          state
        );
      }
    }

    const { projectId, returnTo, type = 'both' } = stateData;
    console.log('[GoogleOAuth][NewerCallback] Parsed context:', { projectId, returnTo, type });

    if (error) {
      console.error('[GoogleOAuth][NewerCallback] Google returned error:', error);
      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnTo, { error, success: 'false' })
      );
    }

    if (!code) {
      console.error('[GoogleOAuth][NewerCallback] No code in callback');
      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnTo, { error: 'missing_code', success: 'false' })
      );
    }

    // Exchange code for tokens
    console.log('[GoogleOAuth][NewerCallback] Exchanging code for tokens...');
    const tokens = await getTokensFromCode(code);
    console.log('[GoogleOAuth][NewerCallback] Token exchange result:', {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      tokenType: tokens.token_type,
      expiresIn: tokens.expiry_date,
    });

    if (!tokens.access_token) {
      console.error('[GoogleOAuth][NewerCallback] No access token received');
      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnTo, { error: 'no_access_token', success: 'false' })
      );
    }

    let ga4PropertyName = '';
    let gscSiteUrl = '';
    let ga4Saved = false;
    let gscSaved = false;

    // Get GA4 properties if needed
    if (type === 'ga4' || type === 'both') {
      console.log('[GoogleOAuth][NewerCallback] Fetching GA4 properties...');
      try {
        const properties = await getGA4Properties(tokens.access_token);
        console.log('[GoogleOAuth][NewerCallback] GA4 properties found:', properties.length);
        if (properties.length > 0) {
          const property = properties[0];
          ga4PropertyName = property.name || 'Unknown';
          console.log('[GoogleOAuth][NewerCallback] GA4 first property:', {
            name: ga4PropertyName,
            id: property.id,
          });

          if (api && projectId) {
            console.log('[GoogleOAuth][NewerCallback] Saving GA4 connection via mutation...');
            await callMutation(api.integrations.ga4Connections.upsertGA4Connection, {
              projectId: projectId as any,
              propertyId: property.id || '',
              propertyName: ga4PropertyName,
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
            });
            ga4Saved = true;
            console.log('[GoogleOAuth][NewerCallback] GA4 connection SAVED');
          } else {
            console.error(
              '[GoogleOAuth][NewerCallback] CANNOT save GA4 - api:',
              api ? 'loaded' : 'NULL',
              'projectId:',
              projectId || 'MISSING'
            );
          }
        } else {
          console.warn(
            '[GoogleOAuth][NewerCallback] No GA4 properties found for this Google account'
          );
        }
      } catch (e) {
        console.error('[GoogleOAuth][NewerCallback] GA4 property fetch/save FAILED:', e);
      }
    }

    // Get GSC sites if needed
    if (type === 'gsc' || type === 'both') {
      console.log('[GoogleOAuth][NewerCallback] Fetching GSC sites...');
      try {
        const sites = await getGSCSites(tokens.access_token);
        console.log('[GoogleOAuth][NewerCallback] GSC sites found:', sites.length);
        if (sites.length > 0) {
          const site = sites.find((s) => s.permissionLevel === 'siteOwner') || sites[0];
          gscSiteUrl = site.siteUrl || '';
          console.log('[GoogleOAuth][NewerCallback] GSC selected site:', {
            siteUrl: gscSiteUrl,
            permissionLevel: site.permissionLevel,
          });

          if (api && projectId) {
            console.log('[GoogleOAuth][NewerCallback] Saving GSC connection via mutation...');
            await callMutation(api.integrations.gscConnections.upsertGSCConnection, {
              projectId: projectId as any,
              siteUrl: gscSiteUrl,
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
            });
            gscSaved = true;
            console.log('[GoogleOAuth][NewerCallback] GSC connection SAVED');
          } else {
            console.error(
              '[GoogleOAuth][NewerCallback] CANNOT save GSC - api:',
              api ? 'loaded' : 'NULL',
              'projectId:',
              projectId || 'MISSING'
            );
          }
        } else {
          console.warn('[GoogleOAuth][NewerCallback] No GSC sites found for this Google account');
        }
      } catch (e) {
        console.error('[GoogleOAuth][NewerCallback] GSC site fetch/save FAILED:', e);
      }
    }

    // Handle GTM OAuth — save the new token (which now includes GTM scopes)
    // back to the GA4 connection so provisionTenantContainer can use it.
    // Uses refreshTokensForProject to update ONLY tokens, preserving property metadata.
    if (type === 'gtm') {
      console.log('[GoogleOAuth][NewerCallback] GTM-scoped OAuth flow — updating GA4 token...');
      try {
        if (api && projectId) {
          await callMutation(api.integrations.ga4Connections.refreshTokensForProject, {
            projectId: projectId as any,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          });
          console.log('[GoogleOAuth][NewerCallback] GA4 token updated with GTM scopes (property preserved)');
        }
      } catch (e) {
        console.error('[GoogleOAuth][NewerCallback] Failed to update token for GTM:', e);
      }

      return oauthResponse(baseUrl, returnTo, {
        success: true,
        type: 'gtm',
        setup: 'gtm',
      });
    }

    console.log('[GoogleOAuth][NewerCallback] === SUMMARY ===', {
      ga4PropertyName,
      ga4Saved,
      gscSiteUrl,
      gscSaved,
      type,
    });

    // Return success via postMessage (for popup) or redirect (for full page)
    return oauthResponse(baseUrl, returnTo, {
      success: true,
      type: type,
      ga4Property: ga4PropertyName || '',
      gscSite: gscSiteUrl || '',
    });
  } catch (error) {
    console.error('[GoogleOAuth][NewerCallback] UNHANDLED ERROR:', error);
    return oauthResponse(baseUrl, undefined, {
      success: false,
      error: error instanceof Error ? error.message : 'unknown',
    });
  }
}

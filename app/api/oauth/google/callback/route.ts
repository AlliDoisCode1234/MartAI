import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode, getGA4Properties, getGSCSites } from '@/lib/googleAuth';
import { callConvexMutation } from '@/lib/convexClient';

// Import callConvexMutation helper
async function callMutation(mutation: any, args: any) {
  try {
    return await callConvexMutation(mutation, args);
  } catch (error) {
    console.error('Convex mutation error:', error);
    throw error;
  }
}

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

// Helper to build redirect URL - preserves existing params in returnTo
function buildRedirectUrl(
  baseUrl: string,
  returnTo: string | undefined,
  params: Record<string, string>
): string {
  // Default to /integrations if no returnTo specified
  const targetPath = returnTo || '/integrations';
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
  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;

  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Parse state first to get returnTo
    let stateData: { projectId?: string; returnTo?: string; type?: string } = {};
    if (state) {
      try {
        stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      } catch {
        // State might be plain projectId for backwards compatibility
        stateData = { projectId: state };
      }
    }

    const { projectId, returnTo, type = 'both' } = stateData;

    if (error) {
      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnTo, { error, success: 'false' })
      );
    }

    if (!code) {
      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnTo, { error: 'missing_code', success: 'false' })
      );
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(
        buildRedirectUrl(baseUrl, returnTo, { error: 'no_access_token', success: 'false' })
      );
    }

    let ga4PropertyName = '';
    let gscSiteUrl = '';

    // Get GA4 properties if needed
    if (type === 'ga4' || type === 'both') {
      try {
        const properties = await getGA4Properties(tokens.access_token);
        if (properties.length > 0) {
          const property = properties[0];
          ga4PropertyName = property.name || 'Unknown';

          if (api && projectId) {
            await callMutation(api.integrations.ga4Connections.upsertGA4Connection, {
              projectId: projectId as any,
              propertyId: property.id || '',
              propertyName: ga4PropertyName,
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
            });
          }
        }
      } catch (e) {
        console.warn('GA4 property fetch failed:', e);
      }
    }

    // Get GSC sites if needed
    if (type === 'gsc' || type === 'both') {
      try {
        const sites = await getGSCSites(tokens.access_token);
        if (sites.length > 0) {
          const site = sites.find((s) => s.permissionLevel === 'siteOwner') || sites[0];
          gscSiteUrl = site.siteUrl || '';

          if (api && projectId) {
            await callMutation(api.integrations.gscConnections.upsertGSCConnection, {
              projectId: projectId as any,
              siteUrl: gscSiteUrl,
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
            });
          }
        }
      } catch (e) {
        console.warn('GSC sites fetch failed:', e);
      }
    }

    // Return success via postMessage (for popup) or redirect (for full page)
    return oauthResponse(baseUrl, returnTo, {
      success: true,
      type: type,
      ga4Property: ga4PropertyName || '',
      gscSite: gscSiteUrl || '',
    });
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return oauthResponse(baseUrl, undefined, {
      success: false,
      error: error instanceof Error ? error.message : 'unknown',
    });
  }
}

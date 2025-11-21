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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/integrations?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/integrations?error=missing_params', request.url)
      );
    }

    // Decode state
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    } catch {
      return NextResponse.redirect(
        new URL('/integrations?error=invalid_state', request.url)
      );
    }

    const { userId, projectId, type } = stateData;

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);
    
    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL('/integrations?error=no_access_token', request.url)
      );
    }

    // Store connection based on type
    if (type === 'ga4') {
      // Get GA4 properties
      const properties = await getGA4Properties(tokens.access_token);
      
      if (properties.length === 0) {
        return NextResponse.redirect(
          new URL('/integrations?error=no_properties', request.url)
        );
      }

      // For now, use first property (can enhance to let user select)
      const property = properties[0];
      const propertyId = property.id || '';

      if (api) {
        try {
          await callMutation(api.ga4Connections.upsertGA4Connection, {
            projectId: projectId as any,
            propertyId,
            propertyName: property.name || 'Unknown',
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          });
        } catch (error) {
          console.warn('Failed to save GA4 connection:', error);
        }
      }

      return NextResponse.redirect(
        new URL(`/integrations?success=ga4&property=${encodeURIComponent(property.name || '')}`, request.url)
      );
    }

    if (type === 'gsc') {
      // Get GSC sites
      const sites = await getGSCSites(tokens.access_token);
      
      if (sites.length === 0) {
        return NextResponse.redirect(
          new URL('/integrations?error=no_sites', request.url)
        );
      }

      // For now, use first verified site
      const site = sites.find(s => s.permissionLevel === 'siteOwner') || sites[0];
      const siteUrl = site.siteUrl || '';

      if (api) {
        try {
          await callMutation(api.gscConnections.upsertGSCConnection, {
            projectId: projectId as any,
            siteUrl,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          });
        } catch (error) {
          console.warn('Failed to save GSC connection:', error);
        }
      }

      return NextResponse.redirect(
        new URL(`/integrations?success=gsc&site=${encodeURIComponent(siteUrl)}`, request.url)
      );
    }

    return NextResponse.redirect(
      new URL('/integrations?error=invalid_type', request.url)
    );
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/integrations?error=${encodeURIComponent(error instanceof Error ? error.message : 'unknown')}`, request.url)
    );
  }
}


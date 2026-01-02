'use node';
import { action, internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/analytics.edit', // Required for Admin API (list properties)
  'https://www.googleapis.com/auth/webmasters.readonly',
  'openid',
  'email',
  'profile',
].join(' ');

export const generateAuthUrl = action({
  // Accept projectId and returnTo to pass as state
  args: {
    projectId: v.optional(v.id('projects')),
    returnTo: v.optional(v.string()), // Where to redirect after OAuth
  },
  handler: async (ctx, args) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new Error('Missing Google Client ID or Redirect URI in environment variables');
    }

    const url = new URL(GOOGLE_AUTH_URL);
    url.searchParams.append('client_id', clientId);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', SCOPES);
    url.searchParams.append('access_type', 'offline'); // Crucial for refresh token
    url.searchParams.append('prompt', 'consent'); // Force re-consent to ensure refresh token

    // Encode projectId and returnTo in state as JSON
    const stateData: Record<string, string> = {};
    if (args.projectId) {
      stateData.projectId = args.projectId;
    }
    if (args.returnTo) {
      stateData.returnTo = args.returnTo;
    }
    if (Object.keys(stateData).length > 0) {
      url.searchParams.append('state', Buffer.from(JSON.stringify(stateData)).toString('base64'));
    }

    return url.toString();
  },
});

export const exchangeCode = action({
  args: {
    code: v.string(),
    projectId: v.optional(v.id('projects')),
  },
  handler: async (ctx, args) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing Google Creds');
    }

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: args.code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Google Token Exchange Failed: ${err}`);
    }

    const tokens = await response.json();

    // Return tokens - the callback will pass them to the frontend
    // which will prompt for Property ID and then save
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      tokenType: tokens.token_type,
    };
  },
});

/**
 * List user's GA4 properties (for property picker dropdown)
 */
export const listGA4Properties = action({
  args: { accessToken: v.string() },
  handler: async (ctx, args) => {
    const response = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
      headers: { Authorization: `Bearer ${args.accessToken}` },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to list GA4 properties: ${err}`);
    }

    const data = await response.json();

    // Extract properties with display name + ID + account name
    const properties: Array<{
      propertyId: string;
      displayName: string;
      accountName: string;
    }> = [];

    for (const account of data.accountSummaries || []) {
      for (const prop of account.propertySummaries || []) {
        properties.push({
          propertyId: prop.property.replace('properties/', ''),
          displayName: prop.displayName,
          accountName: account.displayName,
        });
      }
    }

    return properties;
  },
});

/**
 * List user's verified GSC sites (for site picker)
 */
export const listGSCSites = action({
  args: { accessToken: v.string() },
  handler: async (ctx, args) => {
    const response = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { Authorization: `Bearer ${args.accessToken}` },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to list GSC sites: ${err}`);
    }

    const data = await response.json();

    // Return site URLs with permission level
    return (
      data.siteEntry?.map((site: { siteUrl: string; permissionLevel: string }) => ({
        siteUrl: site.siteUrl,
        permissionLevel: site.permissionLevel,
      })) || []
    );
  },
});

// Helper to refresh token
async function refreshAccessToken(refreshToken: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Missing Google Creds');

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) throw new Error('Failed to refresh token');
  return await response.json();
}

/**
 * GA4 Data Fetcher
 */
export const fetchGA4Metrics = internalAction({
  args: {
    connectionId: v.id('ga4Connections'),
    projectId: v.id('projects'),
    propertyId: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    let token = args.accessToken;

    // Try request
    let response = await runGA4Report(args.propertyId, token, args.startDate, args.endDate);

    if (response.status === 401 && args.refreshToken) {
      // Refresh and retry
      const newTokens = await refreshAccessToken(args.refreshToken);
      token = newTokens.access_token;
      // Update DB with new token
      await ctx.runMutation(api.integrations.ga4Connections.updateTokens, {
        connectionId: args.connectionId,
        accessToken: token,
        refreshToken: newTokens.refresh_token,
      });
      response = await runGA4Report(args.propertyId, token, args.startDate, args.endDate);
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`GA4 API Error: ${err}`);
    }

    return await response.json();
  },
});

async function runGA4Report(
  propertyId: string,
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'userEngagementDuration' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'newUsers' },
      ],
    }),
  });
}

/**
 * GSC Data Fetcher
 */
export const fetchGSCMetrics = internalAction({
  args: {
    connectionId: v.id('gscConnections'),
    siteUrl: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    let token = args.accessToken;
    let response = await runGSCQuery(args.siteUrl, token, args.startDate, args.endDate);

    if (response.status === 401 && args.refreshToken) {
      const newTokens = await refreshAccessToken(args.refreshToken);
      token = newTokens.access_token;
      // Update DB with new token
      await ctx.runMutation(api.integrations.gscConnections.updateTokens, {
        connectionId: args.connectionId,
        accessToken: token,
        refreshToken: newTokens.refresh_token,
      });
      response = await runGSCQuery(args.siteUrl, token, args.startDate, args.endDate);
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`GSC API Error: ${err}`);
    }

    return await response.json();
  },
});

async function runGSCQuery(
  siteUrl: string,
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const encodedSite = encodeURIComponent(siteUrl);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`;

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 100,
    }),
  });
}

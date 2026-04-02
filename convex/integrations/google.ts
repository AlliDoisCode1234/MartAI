'use node';
import { action, internalAction } from '../_generated/server';
import { v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { fetchWithExponentialBackoff } from '../lib/apiResilience';
import { verifyProjectAccess } from '../projects/projects';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/tagmanager.edit.containers',
  'openid',
  'email',
  'profile',
].join(' ');

export const generateAuthUrl = action({
  // Accept projectId and returnTo to pass as state
  args: {
    projectId: v.optional(v.id('projects')),
    returnTo: v.optional(v.string()), // Where to redirect after OAuth
    redirectUri: v.optional(v.string()), // Override redirect URI for local dev
  },
  handler: async (ctx, args) => {
    // SECURITY: Ensure caller is authenticated and actually owns the Project ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    if (args.projectId) {
      await ctx.runQuery(internal.projects.projects.verifyProjectAccess, { projectId: args.projectId });
    }

    console.log('[GoogleOAuth][Convex] generateAuthUrl called with:', {
      projectId: args.projectId,
      returnTo: args.returnTo,
    });

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = args.redirectUri || process.env.GOOGLE_REDIRECT_URI;

    console.log('[GoogleOAuth][Convex] Environment check:', {
      GOOGLE_CLIENT_ID: clientId ? 'SET' : 'UNSET',
      GOOGLE_REDIRECT_URI: redirectUri || 'UNSET',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'UNSET',
    });

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
      const encodedState = Buffer.from(JSON.stringify(stateData)).toString('base64');
      url.searchParams.append('state', encodedState);
      console.log('[GoogleOAuth][Convex] State payload:', stateData);
    }

    const finalUrl = url.toString();
    console.log(
      '[GoogleOAuth][Convex] Generated auth URL (first 100 chars):',
      finalUrl.substring(0, 100)
    );
    return finalUrl;
  },
});

export const exchangeCode = action({
  args: {
    code: v.string(),
    projectId: v.optional(v.id('projects')),
    redirectUri: v.optional(v.string()), // Override redirect URI for local dev
  },
  handler: async (ctx, args) => {
    // SECURITY: Ensure caller is authenticated and owns the Project ID context
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    if (args.projectId) {
      await ctx.runQuery(internal.projects.projects.verifyProjectAccess, { projectId: args.projectId });
    }

    console.log('[GoogleOAuth][Convex] exchangeCode called with projectId:', args.projectId);

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = args.redirectUri || process.env.GOOGLE_REDIRECT_URI;

    console.log('[GoogleOAuth][Convex] exchangeCode env check:', {
      GOOGLE_CLIENT_ID: clientId ? 'SET' : 'UNSET',
      GOOGLE_CLIENT_SECRET: clientSecret ? 'SET' : 'UNSET',
      GOOGLE_REDIRECT_URI: redirectUri || 'UNSET',
    });

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing Google Creds');
    }

    console.log('[GoogleOAuth][Convex] Exchanging code for tokens with redirect_uri:', redirectUri);

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

    console.log('[GoogleOAuth][Convex] Token exchange response status:', response.status);

    if (!response.ok) {
      const err = await response.text();
      console.error('[GoogleOAuth][Convex] Token exchange FAILED:', err);
      throw new Error(`Google Token Exchange Failed: ${err}`);
    }

    const tokens = await response.json();

    console.log('[GoogleOAuth][Convex] Token exchange SUCCESS:', {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiresIn: tokens.expires_in,
      tokenType: tokens.token_type,
    });

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

export const exchangeAndSave = action({
  args: {
    code: v.string(),
    projectId: v.id('projects'),
    redirectUri: v.optional(v.string()), // Override redirect URI for local dev
  },
  handler: async (ctx, args) => {
    // SECURITY: Absolute RBAC lock ensuring a malicious user cannot override an arbitrary project API
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    await ctx.runQuery(internal.projects.projects.verifyProjectAccess, { projectId: args.projectId });

    console.log('[GoogleOAuth][Convex] exchangeAndSave called with projectId:', args.projectId);

    // 1. Exchange Code
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = args.redirectUri || process.env.GOOGLE_REDIRECT_URI;

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
      console.error('[GoogleOAuth][Convex] Token exchange FAILED:', err);
      throw new Error(`Google Token Exchange Failed: ${err}`);
    }

    const tokens = await response.json();
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;

    if (!accessToken) {
      throw new Error('No access token received from Google');
    }

    let ga4Saved = false;
    let gscSaved = false;
    let gscSiteCount = 0;

    // 2. Fetch GA4 Properties
    try {
      const ga4Response = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (ga4Response.ok) {
        const data = await ga4Response.json();
        let firstPropertyId: string | null = null;
        let firstPropertyName: string | null = null;

        for (const account of data.accountSummaries || []) {
          for (const prop of account.propertySummaries || []) {
            if (!firstPropertyId) {
                firstPropertyId = prop.property.replace('properties/', '');
                firstPropertyName = prop.displayName;
            }
          }
        }

        if (firstPropertyId && firstPropertyName) {
          // Use internal mutation securely
          await ctx.runMutation(internal.integrations.ga4Connections.upsertGA4ConnectionInternal, {
            projectId: args.projectId,
            propertyId: firstPropertyId,
            propertyName: firstPropertyName,
            accessToken,
            refreshToken,
          });
          ga4Saved = true;
          console.log('[GoogleOAuth][Convex] GA4 saved securely');
        }
      }
    } catch (err) {
      console.error('[GoogleOAuth][Convex] GA4 lookup failed:', err);
    }

    // 3. Fetch GSC Sites
    try {
      const gscResponse = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (gscResponse.ok) {
        const data = await gscResponse.json();
        const sites = data.siteEntry || [];
        gscSiteCount = sites.length;

        if (sites.length > 0) {
          const site = sites.find((s: { permissionLevel: string }) => s.permissionLevel === 'siteOwner') || sites[0];
          const availableSites = sites.map((s: { siteUrl: string; permissionLevel: string }) => ({
            siteUrl: s.siteUrl,
            permissionLevel: s.permissionLevel,
          }));

          await ctx.runMutation(internal.integrations.gscConnections.upsertGSCConnectionInternal, {
            projectId: args.projectId,
            siteUrl: site.siteUrl,
            accessToken,
            refreshToken,
            availableSites,
          });
          gscSaved = true;
          console.log('[GoogleOAuth][Convex] GSC saved securely');
        }
      }
    } catch (err) {
      console.error('[GoogleOAuth][Convex] GSC lookup failed:', err);
    }

    return { ga4Saved, gscSaved, gscSiteCount };
  },
});

/**
 * List user's GA4 properties (for property picker dropdown)
 */
export const listGA4Properties = action({
  args: { accessToken: v.string() },
  handler: async (ctx, args) => {
    console.log('[GoogleOAuth][Convex] listGA4Properties called');

    const response = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
      headers: { Authorization: `Bearer ${args.accessToken}` },
    });

    console.log('[GoogleOAuth][Convex] GA4 accountSummaries response status:', response.status);

    if (!response.ok) {
      const err = await response.text();
      console.error('[GoogleOAuth][Convex] GA4 accountSummaries FAILED:', err);
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

    console.log('[GoogleOAuth][Convex] GA4 properties found:', properties.length);
    return properties;
  },
});

/**
 * List user's verified GSC sites (for site picker)
 */
export const listGSCSites = action({
  args: { accessToken: v.string() },
  handler: async (ctx, args) => {
    console.log('[GoogleOAuth][Convex] listGSCSites called');

    const response = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { Authorization: `Bearer ${args.accessToken}` },
    });

    console.log('[GoogleOAuth][Convex] GSC sites response status:', response.status);

    if (!response.ok) {
      const err = await response.text();
      console.error('[GoogleOAuth][Convex] GSC sites FAILED:', err);
      throw new Error(`Failed to list GSC sites: ${err}`);
    }

    const data = await response.json();

    const sites =
      data.siteEntry?.map((site: { siteUrl: string; permissionLevel: string }) => ({
        siteUrl: site.siteUrl,
        permissionLevel: site.permissionLevel,
      })) || [];

    console.log(
      '[GoogleOAuth][Convex] GSC sites found:',
      sites.length,
      sites.map((s: { siteUrl: string }) => s.siteUrl)
    );
    return sites;
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

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[TOKEN REFRESH FAILED] Status: ${response.status}, Body: ${errorBody}`);
    console.error(`[TOKEN REFRESH FAILED] Client ID: ${clientId?.slice(0, 15)}...`);
    console.error(`[TOKEN REFRESH FAILED] Refresh Token (first 10): ${refreshToken?.slice(0, 10)}...`);
    throw new Error(`Failed to refresh token: ${response.status} — ${errorBody}`);
  }
  const tokenData = await response.json();
  console.log(`[TOKEN REFRESH OK] New access token obtained, expires_in: ${tokenData.expires_in}`);
  return tokenData;
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
      await ctx.runMutation(internal.integrations.ga4Connections.updateTokens, {
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

    const data = await response.json();

    return data;
  },
});

async function runGA4Report(
  propertyId: string,
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  return fetchWithExponentialBackoff(url, {
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
        { name: 'engagedSessions' },
        { name: 'eventCount' },
        { name: 'conversions' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'sessionDefaultChannelGrouping',
          stringFilter: { matchType: 'EXACT', value: 'Organic Search' },
        },
      },
    }),
  });
}

/**
 * GA4 Lead Count Fetcher — filtered by generate_lead event
 */
export const fetchGA4LeadCount = internalAction({
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

    let response = await runGA4LeadReport(args.propertyId, token, args.startDate, args.endDate);

    if (response.status === 401 && args.refreshToken) {
      const newTokens = await refreshAccessToken(args.refreshToken);
      token = newTokens.access_token;
      await ctx.runMutation(internal.integrations.ga4Connections.updateTokens, {
        connectionId: args.connectionId,
        accessToken: token,
        refreshToken: newTokens.refresh_token,
      });
      response = await runGA4LeadReport(args.propertyId, token, args.startDate, args.endDate);
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`GA4 Lead Report Error: ${err}`);
    }

    const data = await response.json();
    // Extract event count from the filtered report
    const leads = data.rows?.[0]?.metricValues?.[0]?.value
      ? parseInt(data.rows[0].metricValues[0].value, 10)
      : 0;

    return { leads };
  },
});

async function runGA4LeadReport(
  propertyId: string,
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  return fetchWithExponentialBackoff(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'eventCount' }],
      // GENERATE LEAD ONLY + ORGANIC SEARCH ONLY
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: 'eventName',
                stringFilter: { value: 'generate_lead' },
              },
            },
            {
              filter: {
                fieldName: 'sessionDefaultChannelGrouping',
                stringFilter: { matchType: 'EXACT', value: 'Organic Search' },
              },
            },
          ],
        },
      },
    }),
  });
}

/**
 * GA4 Lead-by-Page Fetcher — for content attribution (Phase 3)
 */
export const fetchGA4LeadsByPage = internalAction({
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

    let response = await runGA4LeadByPageReport(
      args.propertyId,
      token,
      args.startDate,
      args.endDate
    );

    if (response.status === 401 && args.refreshToken) {
      const newTokens = await refreshAccessToken(args.refreshToken);
      token = newTokens.access_token;
      await ctx.runMutation(internal.integrations.ga4Connections.updateTokens, {
        connectionId: args.connectionId,
        accessToken: token,
        refreshToken: newTokens.refresh_token,
      });
      response = await runGA4LeadByPageReport(args.propertyId, token, args.startDate, args.endDate);
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`GA4 Lead-by-Page Report Error: ${err}`);
    }

    const data = await response.json();
    const leadsByPage: Array<{ pagePath: string; eventCount: number }> = (data.rows || []).map(
      (row: {
        dimensionValues: Array<{ value: string }>;
        metricValues: Array<{ value: string }>;
      }) => ({
        pagePath: row.dimensionValues[0]?.value || '/',
        eventCount: parseInt(row.metricValues[0]?.value || '0', 10),
      })
    );

    return leadsByPage;
  },
});

async function runGA4LeadByPageReport(
  propertyId: string,
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  return fetchWithExponentialBackoff(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'eventCount' }],
      // GENERATE LEAD ONLY + ORGANIC SEARCH ONLY
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: 'eventName',
                stringFilter: { value: 'generate_lead' },
              },
            },
            {
              filter: {
                fieldName: 'sessionDefaultChannelGrouping',
                stringFilter: { matchType: 'EXACT', value: 'Organic Search' },
              },
            },
          ],
        },
      },
    }),
  });
}

/**
 * GA4 Per-Page Traffic Metrics — pageViews, avgTimeOnPage, bounceRate
 * NOT filtered by generate_lead (covers all page traffic)
 */
export const fetchGA4PageMetrics = internalAction({
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

    let response = await runGA4PageMetricsReport(
      args.propertyId,
      token,
      args.startDate,
      args.endDate
    );

    if (response.status === 401 && args.refreshToken) {
      const newTokens = await refreshAccessToken(args.refreshToken);
      token = newTokens.access_token;
      await ctx.runMutation(internal.integrations.ga4Connections.updateTokens, {
        connectionId: args.connectionId,
        accessToken: token,
        refreshToken: newTokens.refresh_token,
      });
      response = await runGA4PageMetricsReport(
        args.propertyId,
        token,
        args.startDate,
        args.endDate
      );
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`GA4 Page Metrics Report Error: ${err}`);
    }

    const data = await response.json();
    const pageMetrics: Array<{
      pagePath: string;
      pageViews: number;
      avgTimeOnPage: number;
      bounceRate: number;
    }> = (data.rows || []).map(
      (row: {
        dimensionValues: Array<{ value: string }>;
        metricValues: Array<{ value: string }>;
      }) => ({
        pagePath: row.dimensionValues[0]?.value || '/',
        pageViews: parseInt(row.metricValues[0]?.value || '0', 10),
        avgTimeOnPage: parseFloat(row.metricValues[1]?.value || '0'),
        bounceRate: parseFloat(row.metricValues[2]?.value || '0'),
      })
    );

    return pageMetrics;
  },
});

async function runGA4PageMetricsReport(
  propertyId: string,
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  return fetchWithExponentialBackoff(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'sessionDefaultChannelGrouping',
          stringFilter: { matchType: 'EXACT', value: 'Organic Search' },
        },
      },
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10000,
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
      await ctx.runMutation(internal.integrations.gscConnections.updateTokens, {
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

    const data = await response.json();
    return data;
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

  return fetchWithExponentialBackoff(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 500,
    }),
  });
}

/**
 * Service Account JSON structure
 */
interface ServiceAccountCredentials {
  type: 'service_account';
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
}

/**
 * Verify and connect using a service account JSON key
 * Enterprise users can use this instead of OAuth
 */
export const verifyServiceAccount = action({
  args: {
    projectId: v.id('projects'),
    serviceAccountJson: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ success: boolean; error?: string; propertyName?: string }> => {
    try {
      // 1. Parse and validate JSON
      let credentials: ServiceAccountCredentials;
      try {
        credentials = JSON.parse(args.serviceAccountJson);
      } catch {
        return { success: false, error: 'Invalid JSON format' };
      }

      if (credentials.type !== 'service_account') {
        return { success: false, error: 'Invalid key type. Expected a service account key.' };
      }

      if (!credentials.client_email || !credentials.private_key) {
        return { success: false, error: 'Missing required fields in service account key' };
      }

      // 2. Generate JWT for authentication
      const jwt = await createServiceAccountJWT(credentials);

      // 3. Exchange JWT for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
        }),
      });

      if (!tokenResponse.ok) {
        const err = await tokenResponse.text();
        console.error('Token exchange failed:', err);
        return {
          success: false,
          error: 'Failed to authenticate with Google. Check that the key is valid.',
        };
      }

      const tokens = await tokenResponse.json();
      const accessToken = tokens.access_token;

      // 4. Verify access by listing GA4 properties
      const propertiesResponse = await fetch(
        'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!propertiesResponse.ok) {
        const status = propertiesResponse.status;
        if (status === 403) {
          return {
            success: false,
            error: `Access denied. Add ${credentials.client_email} as a Viewer in your GA4 property settings.`,
          };
        }
        return {
          success: false,
          error: 'Failed to access GA4. Check that the service account has proper permissions.',
        };
      }

      const data = await propertiesResponse.json();
      const accounts = data.accountSummaries || [];

      if (accounts.length === 0) {
        return {
          success: false,
          error: `No GA4 properties found. Add ${credentials.client_email} to your GA4 property and try again.`,
        };
      }

      // Get first property for now (could enhance to let user pick)
      const firstAccount = accounts[0];
      const firstProperty = firstAccount.propertySummaries?.[0];

      if (!firstProperty) {
        return { success: false, error: 'No GA4 properties available in this account.' };
      }

      const propertyId = firstProperty.property.replace('properties/', '');
      const propertyName = firstProperty.displayName;

      // 5. Save connection to database
      await ctx.runMutation(api.integrations.ga4Connections.saveServiceAccountConnection, {
        projectId: args.projectId,
        propertyId,
        propertyName,
        serviceAccountEmail: credentials.client_email,
        encryptedServiceAccountKey: args.serviceAccountJson, // TODO: encrypt before saving
      });

      return { success: true, propertyName };
    } catch (error) {
      console.error('Service account verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  },
});

/**
 * Create a JWT for service account authentication
 */
async function createServiceAccountJWT(credentials: ServiceAccountCredentials): Promise<string> {
  const crypto = await import('crypto');

  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope:
      'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600, // 1 hour
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const unsignedToken = `${base64Header}.${base64Payload}`;

  // Sign with RSA-SHA256
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsignedToken);
  const signature = sign.sign(credentials.private_key, 'base64url');

  return `${unsignedToken}.${signature}`;
}

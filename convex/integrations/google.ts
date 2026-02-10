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

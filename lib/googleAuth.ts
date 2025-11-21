import { google } from 'googleapis';
import { format } from 'date-fns';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/oauth/google/callback`;

// Scopes for GA4 and GSC
export const GA4_SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
];

export const GSC_SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
];

export const COMBINED_SCOPES = [
  ...GA4_SCOPES,
  ...GSC_SCOPES,
];

// Create OAuth2 client
export function createOAuth2Client() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

// Generate auth URL
export function getAuthUrl(scopes: string[], state?: string): string {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent', // Force consent to get refresh token
    state: state || '',
  });
}

// Exchange code for tokens
export async function getTokensFromCode(code: string) {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
}

// Get GA4 properties
export async function getGA4Properties(accessToken: string) {
  try {
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    // Use GA4 Admin API
    const analytics = google.analytics('v3');
    const response = await analytics.management.accounts.list({
      auth: oauth2Client,
    });
    
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching GA4 properties:', error);
    // Fallback: return empty array
    return [];
  }
}

// Get GA4 property details
export async function getGA4Property(accessToken: string, accountId: string, propertyId: string) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  
  const analytics = google.analytics('v3');
  const response = await analytics.management.webproperties.get({
    auth: oauth2Client,
    accountId,
    webPropertyId: propertyId,
  });
  
  return response.data;
}

// Get Search Console sites
export async function getGSCSites(accessToken: string) {
  try {
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const webmasters = google.webmasters('v3');
    const response = await webmasters.sites.list({
      auth: oauth2Client,
    });
    
    return response.data.siteEntry || [];
  } catch (error) {
    console.error('Error fetching GSC sites:', error);
    // Fallback: return empty array
    return [];
  }
}

// Get GA4 data (example: sessions, users)
export async function getGA4Data(
  accessToken: string,
  propertyId: string,
  startDate: string | Date,
  endDate: string | Date
) {
  try {
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    // Format dates
    const startDateStr = typeof startDate === 'string' ? startDate : format(startDate, 'yyyy-MM-dd');
    const endDateStr = typeof endDate === 'string' ? endDate : format(endDate, 'yyyy-MM-dd');
    
    // Use GA4 Data API
    const analyticsData = google.analyticsdata('v1beta');
    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' },
        ],
        dimensions: [{ name: 'date' }],
      },
      auth: oauth2Client,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    // Return empty data structure on error
    return { rows: [] };
  }
}

// Get GSC data (example: top queries)
export async function getGSCData(
  accessToken: string,
  siteUrl: string,
  startDate: string | Date,
  endDate: string | Date,
  rowLimit: number = 100
) {
  try {
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    // Format dates
    const startDateStr = typeof startDate === 'string' ? startDate : format(startDate, 'yyyy-MM-dd');
    const endDateStr = typeof endDate === 'string' ? endDate : format(endDate, 'yyyy-MM-dd');
    
    const webmasters = google.webmasters('v3');
    const response = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: startDateStr,
        endDate: endDateStr,
        rowLimit,
        dimensions: ['query'],
      },
      auth: oauth2Client,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching GSC data:', error);
    // Return empty data structure on error
    return { rows: [] };
  }
}


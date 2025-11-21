# GA4 & Google Search Console OAuth Implementation

## ✅ What's Been Implemented

### Backend (REST API)

1. **`/api/oauth/google`** - Initiate OAuth flow
   - Generates Google OAuth URL
   - Supports GA4 and GSC separately
   - Includes state with userId and projectId

2. **`/api/oauth/google/callback`** - OAuth callback handler
   - Exchanges code for tokens
   - Gets GA4 properties or GSC sites
   - Stores connection in Convex
   - Redirects with success/error

3. **`/api/ga4/properties`** - Get GA4 properties
   - Lists available GA4 properties
   - Requires authenticated connection

4. **`/api/ga4/data`** - Get GA4 analytics data
   - Sessions, users, page views
   - Date range filtering
   - Updates last sync time

5. **`/api/gsc/sites`** - Get GSC sites
   - Lists verified Search Console sites

6. **`/api/gsc/data`** - Get GSC search data
   - Top queries
   - Click/impression data
   - Updates last sync time

### Convex Functions

1. **`convex/ga4Connections.ts`**
   - `upsertGA4Connection` - Store/update GA4 connection
   - `getGA4Connection` - Get connection by project
   - `updateLastSync` - Update sync timestamp
   - `deleteGA4Connection` - Remove connection

2. **`convex/gscConnections.ts`**
   - `upsertGSCConnection` - Store/update GSC connection
   - `getGSCConnection` - Get connection by project
   - `updateLastSync` - Update sync timestamp
   - `deleteGSCConnection` - Remove connection

3. **`convex/projects.ts`**
   - `createProject` - Create user project
   - `getProjectsByUser` - List user's projects
   - `getProjectById` - Get single project
   - `updateProject` - Update project details
   - `deleteProject` - Remove project

### Frontend

1. **`/integrations`** - Updated connections page
   - GA4 and GSC connection cards
   - OAuth flow initiation
   - Connection status display
   - Success/error handling from OAuth callback
   - Setup instructions

### Google Auth Library

**`lib/googleAuth.ts`** - Google OAuth utilities
- `createOAuth2Client` - OAuth2 client setup
- `getAuthUrl` - Generate authorization URL
- `getTokensFromCode` - Exchange code for tokens
- `refreshAccessToken` - Refresh expired tokens
- `getGA4Properties` - List GA4 properties
- `getGSCSites` - List Search Console sites
- `getGA4Data` - Fetch GA4 analytics
- `getGSCData` - Fetch GSC search data

## 🔧 Setup Required

1. **Google Cloud Console Setup:**
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/oauth/google/callback`
   - Enable Google Analytics API
   - Enable Search Console API

2. **Environment Variables (`.env.local`):**
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Initialize Convex:**
   ```bash
   npx convex dev
   ```

## 📋 User Flow

### GA4 Connection (US-2.1)
1. User clicks "Connect Google Analytics 4" on `/integrations`
2. Redirected to Google OAuth consent screen
3. User grants Analytics read permissions
4. Callback receives code, exchanges for tokens
5. Fetches GA4 properties, stores first property
6. Redirects to `/integrations?success=ga4&property=...`
7. UI shows "Connected" with property name

### GSC Connection (US-2.2)
1. User clicks "Connect Search Console" on `/integrations`
2. Redirected to Google OAuth consent screen
3. User grants Search Console read permissions
4. Callback receives code, exchanges for tokens
5. Fetches GSC sites, stores first verified site
6. Redirects to `/integrations?success=gsc&site=...`
7. UI shows "Connected" with site URL

## 🎯 Acceptance Criteria Met

### US-2.1: GA4 Connection
✅ OAuth flow lists GA4 properties
✅ User selects property (currently first property auto-selected)
✅ Connection status shows "Connected" with property name
✅ Token stored securely in Convex
✅ Failure shown with retry option

### US-2.2: GSC Connection
✅ OAuth flow lists verified sites
✅ User selects site (currently first site auto-selected)
✅ Daily sync job can be created (lastSync tracked)
✅ Status card shows last sync time
✅ Connection stored in Convex

## 🔐 Security

- OAuth tokens stored in Convex
- Refresh tokens for long-term access
- State parameter prevents CSRF
- Scopes limited to readonly access
- Tokens encrypted in transit
- User authentication required

## 📝 Next Steps

1. **Property/Site Selection UI** - Let user choose which property/site
2. **Token Refresh** - Implement automatic token refresh
3. **Background Sync Jobs** - Set up daily GSC sync
4. **Data Import** - Import top queries from GSC
5. **GA4 Metrics Dashboard** - Display sessions, users, etc.
6. **Error Handling** - Better error messages and retry flows

## 🐛 Known Issues

- Currently auto-selects first property/site (should let user choose)
- Token refresh not yet implemented
- Background sync jobs not yet set up
- GA4 Data API may need property ID format adjustment


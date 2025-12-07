# Google Integration Setup Guide

To enable Google Analytics (GA4) and Google Search Console (GSC) data sync in MartAI, follow these steps.

## 1. Google Cloud Setup

1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new Project (or select existing).
3.  **Enable APIs:**
    - Enable "Google Analytics Data API"
    - Enable "Google Search Console API"
4.  **Configure OAuth Consent Screen:**
    - Type: External (or Internal if GSuite)
    - Add Test Users: Add your own email.
    - Scopes:
      - `https://www.googleapis.com/auth/analytics.readonly`
      - `https://www.googleapis.com/auth/webmasters.readonly`
5.  **Create Credentials:**
    - Go to Credentials -> Create Credentials -> OAuth Client ID.
    - Application Type: **Web application**.
    - **Authorized JavaScript Origins:**
      - `http://localhost`
      - `http://localhost:3000` (Crucial for local dev)
      - `https://your-domain.com` (Your production URL)
    - **Authorized Redirect URIs:**
      - Dev: `http://localhost:3000/api/google-callback`
      - Prod: `https://your-domain.com/api/google-callback`
    - Copy **Client ID** and **Client Secret**.

## 2. Convex Environment Variables

Add the following variables to your `.env.local` (for dev) and Convex Dashboard (for prod):

```bash
GOOGLE_CLIENT_ID="your_client_id_here"
GOOGLE_CLIENT_SECRET="your_client_secret_here"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/google-callback"
```

## 3. Frontend Implementation (Completed)

The frontend integration is already built:

1.  **Connect Button:** Located at `/integrations`. It uses `generateAuthUrl` to redirect.
2.  **Callback Handler:** Implemented at `app/api/google-callback/route.ts`. It exchanges the code and saves tokens.

You just need to ensure the **Redirect URI** in Google Cloud Console matches your environment:

- **Dev:** `http://localhost:3000/api/google-callback`
- **Prod:** `https://your-domain.com/api/google-callback`

## 4. Verification

1.  Start your app: `npx convex dev` and `npm run dev`.
2.  Go to `/integrations`.
3.  Click "Connect GA4" or "Connect GSC".
4.  Complete the Google Login.
5.  You should be redirected back to `/integrations` with a "Connected" status.
6.  Check the `analytics-sync` cron job status or trigger it manually in dashboard to verify data flow.

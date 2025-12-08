# MartAI Environment Variables Guide

Complete reference for all environment variables needed for the MartAI platform.

---

## Quick Start - Minimal Setup

For local development, you need these **essential** variables in your `.env.local`:

```bash
# === REQUIRED FOR BASIC FUNCTIONALITY ===

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=https://gregarious-lemming-409.convex.cloud
CONVEX_DEPLOYMENT=dev:gregarious-lemming-409

# OpenAI API (Required for AI features)
OPENAI_API_KEY=your_openai_api_key_here
```

---

## Complete Environment Variables Reference

### 1. Convex Backend (REQUIRED)

```bash
# Public Convex URL - Used by client-side code
NEXT_PUBLIC_CONVEX_URL=https://gregarious-lemming-409.convex.cloud

# Deployment identifier - Used by `npx convex dev`
CONVEX_DEPLOYMENT=dev:gregarious-lemming-409

# Convex Site URL - Used for OAuth callbacks
CONVEX_SITE_URL=https://your-domain.com
```

**Where to add**: `.env.local` (root directory)

**How to get**:

1. Sign up at [convex.dev](https://convex.dev)
2. Create a project
3. Copy the deployment URL from your dashboard
4. Run `npx convex dev` to get your deployment name

---

### 2. OpenAI API (REQUIRED for AI features)

```bash
# OpenAI API Key - Used for content generation, keyword clustering, etc.
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Vercel AI Gateway (alternative to direct OpenAI)
VERCEL_AI_GATEWAY_KEY=your_vercel_gateway_key
```

**Where to add**: `.env.local` (root directory)

**How to get**:

1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to API Keys
3. Create a new secret key

# MartAI Environment Variables Guide

Complete reference for all environment variables needed for the MartAI platform.

---

## Quick Start - Minimal Setup

For local development, you need these **essential** variables in your `.env.local`:

```bash
# === REQUIRED FOR BASIC FUNCTIONALITY ===

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=https://gregarious-lemming-409.convex.cloud
CONVEX_DEPLOYMENT=dev:gregarious-lemming-409

# OpenAI API (Required for AI features)
OPENAI_API_KEY=your_openai_api_key_here
```

---

## Complete Environment Variables Reference

### 1. Convex Backend (REQUIRED)

```bash
# Public Convex URL - Used by client-side code
NEXT_PUBLIC_CONVEX_URL=https://gregarious-lemming-409.convex.cloud

# Deployment identifier - Used by `npx convex dev`
CONVEX_DEPLOYMENT=dev:gregarious-lemming-409

# Convex Site URL - Used for OAuth callbacks
CONVEX_SITE_URL=https://your-domain.com

# Google Frontend Client ID - For One Tap & Sign In
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

**Where to add**: `.env.local` (root directory)

**How to get**:

1. Sign up at [convex.dev](https://convex.dev)
2. Create a project
3. Copy the deployment URL from your dashboard
4. Run `npx convex dev` to get your deployment name

---

### 2. OpenAI API (REQUIRED for AI features)

```bash
# OpenAI API Key - Used for content generation, keyword clustering, etc.
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Vercel AI Gateway (alternative to direct OpenAI)
VERCEL_AI_GATEWAY_KEY=your_vercel_gateway_key
```

**Where to add**: `.env.local` (root directory)

**How to get**:

1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to API Keys
3. Create a new secret key
4. Copy and paste into `.env.local`

**Cost**: ~$0.16-$1.80/month depending on usage (see PRICING.md)

---

### 3. Cron Jobs & Scheduled Tasks (REQUIRED for publishing)

```bash
# Cron Secret - Used to authenticate scheduled job triggers
CRON_SECRET=your-cron-secret-key

# App URL - Used for internal API calls
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Vercel URL (auto-set in Vercel deployments)
VERCEL_URL=your-app.vercel.app
```

**Where to add**: `.env.local` and Vercel environment variables

**Usage**:

- WordPress scheduled publishing
- Analytics data sync
- Rank tracking updates

---

### 4. WordPress Integration (OPTIONAL)

```bash
# WordPress OAuth (if using WordPress.com OAuth)
WORDPRESS_CLIENT_ID=your_wordpress_client_id
WORDPRESS_CLIENT_SECRET=your_wordpress_client_secret
WORDPRESS_REDIRECT_URI=https://yourdomain.com/api/oauth/wordpress/callback
```

**Where to add**: `.env.local` (root)

**How to get**:

1. Go to [developer.wordpress.com](https://developer.wordpress.com)
2. Create a new application
3. Set redirect URI to your callback URL
4. Copy client ID and secret

**Note**: Users can also connect via Application Passwords (no OAuth needed)

---

### 5. Shopify Integration (OPTIONAL)

```bash
# Shopify OAuth
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_REDIRECT_URI=https://yourdomain.com/api/oauth/shopify/callback
```

**Where to add**: `.env.local` (root)

**How to get**:

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Create a new app
3. Set redirect URI
4. Copy API key and secret

---

### 6. Google Analytics & Search Console (OPTIONAL)

```bash
# Google OAuth (for GA4 and GSC integration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/oauth/google/callback
```

**Where to add**: `.env.local` (root)

**How to get Google ID & Secret**:

1.  **Create Project**: Go to [Google Cloud Console](https://console.cloud.google.com/), create a new project (e.g., "MartAI-Analytics").
2.  **Enable APIs**:
    - Search for "Google Analytics Data API" -> Enable.
    - Search for "Google Search Console API" -> Enable.
3.  **Configure OAuth Consent**:
    - Go to "APIs & Services" > "OAuth consent screen".
    - Select "External".
    - Fill in app name (MartAI) and support email.
    - Add your domain (`http://localhost:3000` for dev) to "Authorized domains".
    - Save.
4.  **Create Credentials**:
    - Go to "Credentials" > "Create Credentials" > "OAuth client ID".
    - Application type: "Web application".
    - **Authorized redirect URIs**: Add `http://localhost:3000/api/oauth/google/callback`.
    - Click Create. **Copy the Client ID and Client Secret.**

_(Note: The codebase currently uses User OAuth, not Service Accounts, so you do not need to generate a JSON key file.)_

---

### 7. Admin Seeding (OPTIONAL - for initial setup)

```bash
# Admin Account Details (for scripts/seedAdmin.ts)
ADMIN_EMAIL=admin@martai.com
ADMIN_PASSWORD=secure_admin_password
ADMIN_NAME=Admin User

# Demo Account (for scripts/seedDemoAccount.ts)
DEMO_ADMIN_EMAIL=demo+admin@martai.com
DEMO_ADMIN_PASSWORD=demo_password
```

**Where to add**: `.env.local` (root)

**Usage**: Only needed when running seed scripts to create initial admin users.

---

### 8. HubSpot Integration (OPTIONAL)

```bash
# HubSpot Private App Token - For syncing users/prospects to HubSpot
HUBSPOT_API_KEY=pat-xxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Where to add**: Convex environment variables (via Convex dashboard)

**How to get**:

1. Go to [HubSpot](https://app.hubspot.com) → Settings → Integrations → Private Apps
2. Create a new private app
3. Grant scopes: `crm.objects.contacts.read`, `crm.objects.contacts.write`
4. Copy the access token

**Usage**:

- Auto-sync users to HubSpot on signup
- Sync prospects from lead forms
- Track onboarding status, MR scores
- Abandoned signup tracking

---

### 9. Development & Testing

```bash
# Node Environment
NODE_ENV=development  # or 'production'

# CI/CD
CI=true  # Set by CI systems

# Next.js Public API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Where to add**: `.env.local` (root) or CI/CD environment

---

## File Structure

Your project should have these environment files:

```
MartAI/
├── .env.local              # Local development (git-ignored)
├── .env.example            # Template for other developers
├── .env.production         # Production secrets (git-ignored, use Vercel instead)
└── .env.test               # Test environment (optional)
```

---

## Complete `.env.local` Template

Copy this template to your `.env.local` file:

```bash
# ============================================
# MartAI Environment Variables
# ============================================

# === CONVEX BACKEND (REQUIRED) ===
NEXT_PUBLIC_CONVEX_URL=https://gregarious-lemming-409.convex.cloud
CONVEX_DEPLOYMENT=dev:gregarious-lemming-409
CONVEX_SITE_URL=http://localhost:3000

# === OPENAI API (REQUIRED) ===
OPENAI_API_KEY=sk-proj-your-key-here

# === CRON & SCHEDULED TASKS ===
CRON_SECRET=dev-cron-secret-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000

# === WORDPRESS INTEGRATION (OPTIONAL) ===
# WORDPRESS_CLIENT_ID=your_wordpress_client_id
# WORDPRESS_CLIENT_SECRET=your_wordpress_client_secret
# WORDPRESS_REDIRECT_URI=http://localhost:3000/api/oauth/wordpress/callback

# === SHOPIFY INTEGRATION (OPTIONAL) ===
# SHOPIFY_API_KEY=your_shopify_api_key
# SHOPIFY_API_SECRET=your_shopify_api_secret
# SHOPIFY_REDIRECT_URI=http://localhost:3000/api/oauth/shopify/callback

# === GOOGLE ANALYTICS & SEARCH CONSOLE (OPTIONAL) ===
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback

# === ADMIN SEEDING (OPTIONAL) ===
# ADMIN_EMAIL=admin@martai.com
# ADMIN_PASSWORD=secure_admin_password
# ADMIN_NAME=Admin User

# === DEVELOPMENT ===
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Vercel Deployment

When deploying to Vercel, add these environment variables in your project settings:

### Required for Production:

1.  **Convex**:
    - `NEXT_PUBLIC_CONVEX_URL` (from Convex dashboard)
    - `CONVEX_DEPLOYMENT` (production deployment name)
    - `CONVEX_SITE_URL` (your production domain)

2.  **OpenAI**:
    - `OPENAI_API_KEY` (your OpenAI API key)

3.  **Cron**:
    - `CRON_SECRET` (generate with crypto.randomBytes)
    - `NEXT_PUBLIC_APP_URL` (your production domain)

### Optional (based on features):

- WordPress OAuth credentials
- Shopify OAuth credentials
- Google OAuth credentials

---

## Security Best Practices

1.  **Never commit `.env.local`** - It's in `.gitignore` by default
2.  **Use different secrets for dev/production** - Never reuse secrets
3.  **Rotate secrets regularly** - Especially after team changes
4.  **Use Vercel's encrypted storage** - For production secrets
5.  **Use environment-specific values** - Different keys for dev/staging/prod

---

## Troubleshooting

### "CONVEX_URL is not defined"

- Make sure `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`
- Restart your dev server after adding env vars

### "OpenAI API key not found"

- Check that `OPENAI_API_KEY` is set
- Verify the key starts with `sk-proj-` or `sk-`
- Check for extra spaces or quotes

### Environment variables not updating

- Restart Next.js dev server (`npm run dev`)
- Clear `.next` cache: `rm -rf .next`
- Check for typos in variable names

---

## What You Currently Have

Based on your current `.env.local`:

```bash
OPENAI_API_KEY=KEY"  # ⚠️ Remove the trailing quote
CONVEX_DEPLOYMENT=dev:gregarious-lemming-409  # ✅ Correct
NEXT_PUBLIC_CONVEX_URL=https://gregarious-lemming-409.convex.cloud  # ✅ Correct
```

### Issues to Fix:

1.  **Remove trailing quote** from `OPENAI_API_KEY`
2.  **Add CRON_SECRET** for scheduled publishing
3.  **Add CONVEX_SITE_URL** for OAuth callbacks

---

## Next Steps

1.  **Fix your `.env.local`**:

    ```bash
    OPENAI_API_KEY=your-actual-key-without-quotes
    CONVEX_DEPLOYMENT=dev:gregarious-lemming-409
    NEXT_PUBLIC_CONVEX_URL=https://gregarious-lemming-409.convex.cloud
    CONVEX_SITE_URL=http://localhost:3000
    CRON_SECRET=dev-cron-secret
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

2.  **Generate production secrets** (when ready to deploy):

    ```bash
    node -e "console.log('CRON_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
    ```

3.  **Test locally**:

    ```bash
    npm run dev
    ```

4.  **Deploy to Vercel** and add all production env vars

---

_Last updated: December 3, 2025_

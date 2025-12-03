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
4. Copy and paste into `.env.local`

**Cost**: ~$0.16-$1.80/month depending on usage (see PRICING.md)

---

### 3. Authentication & Security (REQUIRED for production)

```bash
# JWT Secrets - Used for session management
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# API Security
API_SECRET_KEY=your-api-secret-key-change-in-production
CSRF_SECRET=your-csrf-secret-change-in-production
API_KEY_HASH=your-api-key-hash

# Allowed Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

**Where to add**: `.env.local` (root) and Vercel/production environment

**How to generate**:

```bash
# Generate random secrets (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Development defaults**: These have fallback values for local dev, but MUST be set in production.

---

### 4. Cron Jobs & Scheduled Tasks (REQUIRED for publishing)

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

### 5. WordPress Integration (OPTIONAL)

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

### 6. Shopify Integration (OPTIONAL)

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

### 7. Google Analytics & Search Console (OPTIONAL)

```bash
# Google OAuth (for GA4 and GSC integration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/oauth/google/callback

# Google Service Account (alternative to OAuth)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY=your_service_account_private_key
```

**Where to add**: `.env.local` (root)

**How to get**:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Analytics Data API and Search Console API
4. Create OAuth 2.0 credentials
5. Copy client ID and secret

---

### 8. Admin Seeding (OPTIONAL - for initial setup)

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

# === AUTHENTICATION & SECURITY (REQUIRED for production) ===
JWT_SECRET=dev-jwt-secret-change-in-production-min-32-chars
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production-min-32-chars
API_SECRET_KEY=dev-api-secret-key-change-in-production
CSRF_SECRET=dev-csrf-secret-change-in-production
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

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

1. **Convex**:
   - `NEXT_PUBLIC_CONVEX_URL` (from Convex dashboard)
   - `CONVEX_DEPLOYMENT` (production deployment name)
   - `CONVEX_SITE_URL` (your production domain)

2. **OpenAI**:
   - `OPENAI_API_KEY` (your OpenAI API key)

3. **Security**:
   - `JWT_SECRET` (generate with crypto.randomBytes)
   - `JWT_REFRESH_SECRET` (generate with crypto.randomBytes)
   - `API_SECRET_KEY` (generate with crypto.randomBytes)
   - `CSRF_SECRET` (generate with crypto.randomBytes)
   - `ALLOWED_ORIGINS` (your production domain)

4. **Cron**:
   - `CRON_SECRET` (generate with crypto.randomBytes)
   - `NEXT_PUBLIC_APP_URL` (your production domain)

### Optional (based on features):

- WordPress OAuth credentials
- Shopify OAuth credentials
- Google OAuth credentials

---

## Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` by default
2. **Use different secrets for dev/production** - Never reuse secrets
3. **Rotate secrets regularly** - Especially after team changes
4. **Use Vercel's encrypted storage** - For production secrets
5. **Minimum 32 characters** - For all secret keys
6. **Use environment-specific values** - Different keys for dev/staging/prod

---

## Troubleshooting

### "CONVEX_URL is not defined"

- Make sure `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`
- Restart your dev server after adding env vars

### "OpenAI API key not found"

- Check that `OPENAI_API_KEY` is set
- Verify the key starts with `sk-proj-` or `sk-`
- Check for extra spaces or quotes

### "JWT_SECRET is required in production"

- Set `JWT_SECRET` in Vercel environment variables
- Generate a secure random string (min 32 chars)

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

1. **Remove trailing quote** from `OPENAI_API_KEY`
2. **Add security secrets** for production readiness
3. **Add CRON_SECRET** for scheduled publishing
4. **Add CONVEX_SITE_URL** for OAuth callbacks

---

## Next Steps

1. **Fix your `.env.local`**:

   ```bash
   OPENAI_API_KEY=your-actual-key-without-quotes
   CONVEX_DEPLOYMENT=dev:gregarious-lemming-409
   NEXT_PUBLIC_CONVEX_URL=https://gregarious-lemming-409.convex.cloud
   CONVEX_SITE_URL=http://localhost:3000
   CRON_SECRET=dev-cron-secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Generate production secrets** (when ready to deploy):

   ```bash
   node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log('API_SECRET_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log('CSRF_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log('CRON_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Test locally**:

   ```bash
   npm run dev
   ```

4. **Deploy to Vercel** and add all production env vars

---

_Last updated: December 3, 2025_

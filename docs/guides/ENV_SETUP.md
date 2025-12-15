# MartAI Environment Setup Guide

Step-by-step guide to configure all environment variables for MartAI deployment.

---

## Quick Start

```bash
# 1. Copy example file
cp .env.example .env.local

# 2. Generate secrets (run 5 times, save each output)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Fill in the required vars below
# 4. Deploy to Vercel with env vars
```

---

## Required Variables

### Convex Backend

| Variable                 | Description                            | Where to Get                                                                   |
| ------------------------ | -------------------------------------- | ------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL                  | [dashboard.convex.dev](https://dashboard.convex.dev) → Your Project → Settings |
| `CONVEX_DEPLOYMENT`      | Deployment name (e.g., `prod:abc-123`) | Same location                                                                  |
| `CONVEX_SITE_URL`        | Your production URL                    | `https://app.martai.io`                                                        |

### OpenAI

| Variable         | Description             | Where to Get                                                         |
| ---------------- | ----------------------- | -------------------------------------------------------------------- |
| `OPENAI_API_KEY` | API key for AI features | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

> [!TIP]
> Use a dedicated API key for production. Set usage limits in OpenAI dashboard.

### Security Secrets

Generate each with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

| Variable             | Purpose                 |
| -------------------- | ----------------------- |
| `JWT_SECRET`         | Signs auth tokens       |
| `JWT_REFRESH_SECRET` | Signs refresh tokens    |
| `CSRF_SECRET`        | CSRF protection         |
| `CRON_SECRET`        | Authenticates cron jobs |
| `API_SECRET_KEY`     | Internal API calls      |

---

## Optional: Integrations

### Polar Billing

| Variable                | Where to Get                                                |
| ----------------------- | ----------------------------------------------------------- |
| `POLAR_ACCESS_TOKEN`    | [polar.sh/settings](https://polar.sh/settings) → API Tokens |
| `POLAR_WEBHOOK_SECRET`  | Polar Dashboard → Webhooks → Create Webhook                 |
| `POLAR_ORGANIZATION_ID` | Polar Dashboard → URL contains org ID                       |

**Setup Steps:**

1. Create Polar account at [polar.sh](https://polar.sh)
2. Create Organization
3. Add Products (Solo $49, Growth $149, Agency custom)
4. Create API token with full permissions
5. Create webhook pointing to `https://yourdomain.com/api/polar/webhook`

### Google OAuth (GA4 + GSC)

| Variable               | Where to Get                                                                  |
| ---------------------- | ----------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | [console.cloud.google.com](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | Same location                                                                 |
| `GOOGLE_REDIRECT_URI`  | Your callback URL                                                             |

**Setup Steps:**

1. Go to Google Cloud Console
2. Create Project (or use existing)
3. Enable APIs: Google Analytics Data API, Search Console API
4. Configure OAuth consent screen
5. Create OAuth 2.0 Client ID (Web application)
6. Add authorized redirect: `https://yourdomain.com/api/oauth/google/callback`

### WordPress OAuth

| Variable                  | Where to Get                                                          |
| ------------------------- | --------------------------------------------------------------------- |
| `WORDPRESS_CLIENT_ID`     | [developer.wordpress.com/apps](https://developer.wordpress.com/apps/) |
| `WORDPRESS_CLIENT_SECRET` | Same location                                                         |
| `WORDPRESS_REDIRECT_URI`  | Your callback URL                                                     |

**Setup Steps:**

1. Go to WordPress Developer Portal
2. Create New Application
3. Set redirect URL: `https://yourdomain.com/api/oauth/wordpress/callback`
4. Copy Client ID and Secret

---

## Vercel Deployment

### Add to Vercel

```bash
# Using Vercel CLI
vercel env add NEXT_PUBLIC_CONVEX_URL production
vercel env add OPENAI_API_KEY production
# ... repeat for each variable
```

Or add via Vercel Dashboard:

1. Go to Project → Settings → Environment Variables
2. Add each variable for the `Production` environment
3. Redeploy after adding all variables

### Required Vercel Settings

| Setting          | Value           |
| ---------------- | --------------- |
| Framework        | Next.js         |
| Node.js Version  | 18.x or 20.x    |
| Build Command    | `npm run build` |
| Output Directory | `.next`         |

---

## Verification Checklist

After setup, verify each service:

- [ ] Convex: `npx convex dev --once` succeeds
- [ ] OpenAI: Generate keywords works
- [ ] Polar: Checkout flow redirects correctly
- [ ] Google: OAuth returns to callback
- [ ] WordPress: OAuth returns to callback

---

## Security Notes

> [!CAUTION]
>
> - Never commit `.env.local` to git
> - Rotate secrets before production launch
> - Use different secrets for staging vs production
> - Set IP allowlists in OpenAI if possible

---

## Troubleshooting

**"Unauthorized" errors:**

- Check `JWT_SECRET` is set
- Verify Convex URL is correct

**OpenAI timeout:**

- Check API key is valid
- Verify account has credits

**OAuth redirect errors:**

- Ensure redirect URI matches exactly (including trailing slash)
- Check https vs http

**Polar webhook not working:**

- Verify webhook secret matches
- Check webhook URL is publicly accessible

# LDD: Staging Environment Setup with Convex

**Author**: AI Assistant  
**Date**: January 3, 2026  
**Status**: Implementation Plan  
**Priority**: P0 (Blocks OWASP ZAP Security Audit)

---

## 1. Overview

This document outlines the setup of a staging environment for MartAI using Convex's multi-deployment architecture and Vercel Preview environments.

### Objectives

1. Create a separate Convex deployment for staging
2. Configure Vercel staging environment
3. Set up environment-specific secrets
4. Enable safe testing without affecting production data

### Why Staging is Critical

- **Security Audit**: OWASP ZAP testing requires a non-production environment
- **QA Testing**: Safe space for manual testing before releases
- **Third-Party Pentest**: External vendors need a target that won't affect users
- **Feature Previews**: Test new features with real data flow

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MartAI Environments                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐          ┌──────────────────┐             │
│  │   Development    │          │     Staging      │             │
│  │  (localhost)     │          │ (staging.phoo.ai)│             │
│  ├──────────────────┤          ├──────────────────┤             │
│  │ Convex Dev       │          │ Convex Staging   │             │
│  │ Deployment       │          │ Deployment       │             │
│  │ (mart-ai-dev)    │          │ (mart-ai-staging)│             │
│  └──────────────────┘          └──────────────────┘             │
│                                                                  │
│  ┌──────────────────┐                                           │
│  │   Production     │                                           │
│  │   (phoo.ai)      │                                           │
│  ├──────────────────┤                                           │
│  │ Convex Prod      │                                           │
│  │ Deployment       │                                           │
│  │ (mart-ai-prod)   │                                           │
│  └──────────────────┘                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Prerequisites

- [ ] Convex account with project access
- [ ] Vercel account with project access
- [ ] Domain configured (phoo.ai)
- [ ] Access to environment secrets

---

## 4. Implementation Steps

### Phase 1: Convex Staging Deployment

#### Step 1.1: Create Staging Deployment in Convex

```bash
# Login to Convex (if not already)
npx convex login

# Create a new deployment for staging
npx convex deploy --cmd "npm run build" --prod
```

Then in Convex Dashboard:

1. Go to [dashboard.convex.dev](https://dashboard.convex.dev)
2. Select your project "MartAI"
3. Click **"Deployments"** in sidebar
4. Click **"Create Deployment"**
5. Name it: `staging`
6. Copy the new deployment URL (e.g., `https://STAGING_ID.convex.cloud`)

#### Step 1.2: Configure Convex Project for Multi-Deploy

Create/update `convex.json`:

```json
{
  "project": "mart-ai",
  "team": "AlliDoisCode1234",
  "prodUrl": "https://PROD_ID.convex.cloud",
  "functions": "convex/"
}
```

#### Step 1.3: Set Staging Environment Variables in Convex

In Convex Dashboard → Staging Deployment → Settings → Environment Variables:

```bash
# Required for staging
OPENAI_API_KEY=sk-staging-xxx
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
STRIPE_SECRET_KEY=sk_test_xxx  # Use Stripe TEST mode
STRIPE_WEBHOOK_SECRET=whsec_staging_xxx
SITE_URL=https://staging.phoo.ai
AUTH_SECRET=staging-auth-secret-xxx

# Optional - use test/sandbox keys
ORIGINALITY_API_KEY=staging-xxx
```

> ⚠️ **IMPORTANT**: Use Stripe TEST keys for staging, never production keys!

---

### Phase 2: Vercel Staging Environment

#### Step 2.1: Configure Vercel Preview Environment

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select MartAI project
3. Go to **Settings** → **Domains**
4. Add subdomain: `staging.phoo.ai`
5. Configure it to point to `develop` or `staging` branch

#### Step 2.2: Set Vercel Environment Variables

In Vercel → Settings → Environment Variables:

| Variable                 | Environment | Value                             |
| ------------------------ | ----------- | --------------------------------- |
| `NEXT_PUBLIC_CONVEX_URL` | Preview     | `https://STAGING_ID.convex.cloud` |
| `CONVEX_DEPLOY_KEY`      | Preview     | `prod:staging:xxx`                |
| `NEXT_PUBLIC_SITE_URL`   | Preview     | `https://staging.phoo.ai`         |
| `STRIPE_PUBLISHABLE_KEY` | Preview     | `pk_test_xxx`                     |

#### Step 2.3: Create Preview Branch Configuration

In `vercel.json`:

```json
{
  "git": {
    "deploymentEnabled": {
      "develop": true,
      "staging": true,
      "main": true
    }
  },
  "env": {
    "NEXT_PUBLIC_CONVEX_URL": "@convex-url"
  }
}
```

---

### Phase 3: Branch Strategy

#### Step 3.1: Create Staging Branch

```bash
# Create staging branch from main
git checkout main
git pull origin main
git checkout -b staging
git push -u origin staging
```

#### Step 3.2: Configure Branch Protection (GitHub)

In GitHub → Settings → Branches → Add rule for `staging`:

- [x] Require pull request reviews before merging
- [x] Require status checks to pass
- [x] Require branches to be up to date

---

### Phase 4: OAuth Configuration

#### Step 4.1: Google OAuth for Staging

In [Google Cloud Console](https://console.cloud.google.com):

1. Go to APIs & Services → Credentials
2. Edit the existing OAuth 2.0 Client
3. Add Authorized redirect URIs:
   ```
   https://staging.phoo.ai/api/auth/callback/google
   https://STAGING_ID.convex.site/api/auth/callback/google
   ```
4. Add Authorized JavaScript origins:
   ```
   https://staging.phoo.ai
   ```

#### Step 4.2: Stripe Webhooks for Staging

In [Stripe Dashboard](https://dashboard.stripe.com) (Test Mode):

1. Go to Developers → Webhooks
2. Add endpoint: `https://staging.phoo.ai/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret → Add to Convex staging env vars

---

### Phase 5: Data Seeding

#### Step 5.1: Create Seed Script

Create `convex/scripts/seedStaging.ts`:

```typescript
import { mutation } from '../_generated/server';

// Run with: npx convex run scripts/seedStaging --deployment staging
export const seedTestData = mutation({
  args: {},
  handler: async (ctx) => {
    // Create test user
    const userId = await ctx.db.insert('users', {
      email: 'test@phoo.ai',
      name: 'Test User',
      membershipTier: 'growth',
      role: 'user',
      createdAt: Date.now(),
    });

    // Create test project
    const projectId = await ctx.db.insert('projects', {
      userId,
      name: 'Test Project',
      websiteUrl: 'https://example.com',
      industry: 'technology',
      projectType: 'own',
      createdAt: Date.now(),
    });

    // Create test admin user
    await ctx.db.insert('users', {
      email: 'admin@phoo.ai',
      name: 'Admin User',
      membershipTier: 'enterprise',
      role: 'super_admin',
      createdAt: Date.now(),
    });

    return { userId, projectId };
  },
});
```

#### Step 5.2: Run Seed Script

```bash
# Deploy to staging first
npx convex deploy --cmd "npm run build" --deployment staging

# Run seed script
npx convex run scripts/seedStaging:seedTestData --deployment staging
```

---

### Phase 6: CI/CD Configuration

#### Step 6.1: Update GitHub Actions

Update `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Deploy to Convex Staging
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_STAGING_DEPLOY_KEY }}
        run: npx convex deploy --cmd "npm run build"

      - name: Notify Slack
        run: echo "Deployed to staging"

  deploy-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Deploy to Convex Production
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_PROD_DEPLOY_KEY }}
        run: npx convex deploy --cmd "npm run build"
```

#### Step 6.2: Add Secrets to GitHub

In GitHub → Settings → Secrets → Actions:

| Secret Name                 | Value                                      |
| --------------------------- | ------------------------------------------ |
| `CONVEX_STAGING_DEPLOY_KEY` | `prod:staging:xxx` (from Convex Dashboard) |
| `CONVEX_PROD_DEPLOY_KEY`    | `prod:production:xxx`                      |

---

## 5. Verification Checklist

### Environment URLs

| Environment | Frontend URL              | Convex URL         |
| ----------- | ------------------------- | ------------------ |
| Development | `http://localhost:3000`   | Dev deployment     |
| Staging     | `https://staging.phoo.ai` | Staging deployment |
| Production  | `https://phoo.ai`         | Prod deployment    |

### Verification Steps

- [ ] **Frontend**: `https://staging.phoo.ai` loads correctly
- [ ] **Auth**: Can sign up/login with email
- [ ] **OAuth**: Google sign-in works
- [ ] **Database**: Data appears in Convex staging deployment
- [ ] **Stripe**: Test payments work (use card `4242 4242 4242 4242`)
- [ ] **API**: Public API endpoints respond
- [ ] **Admin**: Admin portal accessible with admin credentials

---

## 6. Commands Reference

### Development

```bash
# Run local dev against staging backend
NEXT_PUBLIC_CONVEX_URL=https://STAGING_ID.convex.cloud npm run dev

# Or use .env.staging
npm run dev:staging
```

### Deployment

```bash
# Deploy to staging
npx convex deploy --deployment staging

# Deploy to production
npx convex deploy --deployment production

# Check deployment status
npx convex dashboard --deployment staging
```

### Database Operations

```bash
# View staging data
npx convex dashboard --deployment staging

# Clear staging data (for fresh test)
npx convex run scripts/clearStagingData --deployment staging

# Export staging schema
npx convex export --deployment staging
```

---

## 7. Troubleshooting

### Issue: CORS errors on staging

**Solution**: Ensure `SITE_URL` in Convex staging env vars matches `https://staging.phoo.ai`

### Issue: OAuth callback fails

**Solution**:

1. Check Google Cloud Console redirect URIs include staging
2. Verify `AUTH_SECRET` is set in Convex staging

### Issue: Stripe webhooks not firing

**Solution**:

1. Verify webhook endpoint in Stripe Dashboard
2. Check webhook signing secret matches env var
3. Ensure endpoint is publicly accessible

### Issue: Data not appearing in staging

**Solution**:

1. Verify `NEXT_PUBLIC_CONVEX_URL` points to staging deployment
2. Clear browser cache/cookies
3. Check Convex dashboard for errors

---

## 8. Security Considerations

> [!WARNING]
> **Never use production API keys in staging!**

### Key Differences: Staging vs Production

| Aspect     | Staging           | Production         |
| ---------- | ----------------- | ------------------ |
| Stripe     | TEST mode keys    | LIVE mode keys     |
| Data       | Test/seeded data  | Real user data     |
| OpenAI     | Lower rate limits | Full limits        |
| Monitoring | Reduced           | Full observability |

### Data Isolation

- Staging and production use **separate Convex deployments**
- No data sharing between environments
- Staging can be wiped without affecting production

---

## 9. Rollback Plan

If staging deployment fails:

```bash
# Rollback Convex to previous version
npx convex deploy --preview previous-commit-hash --deployment staging

# Or use Convex Dashboard:
# 1. Go to Deployments → staging
# 2. Click "History"
# 3. Select previous deployment
# 4. Click "Rollback"
```

---

## 10. Next Steps After Setup

1. [ ] Run OWASP ZAP passive scan against staging
2. [ ] Configure staging monitoring in Vercel
3. [ ] Set up staging-specific Slack notifications
4. [ ] Update SECURITY_AUDIT_OWASP_ZAP.md with staging URL
5. [ ] Schedule third-party pentest against staging

---

## 11. Timeline

| Task                             | Owner       | ETA   |
| -------------------------------- | ----------- | ----- |
| Create Convex staging deployment | DevOps      | Day 1 |
| Configure Vercel staging         | DevOps      | Day 1 |
| Set up OAuth for staging         | DevOps      | Day 1 |
| Configure Stripe test webhooks   | DevOps      | Day 1 |
| Create staging branch            | Engineering | Day 1 |
| Seed test data                   | Engineering | Day 2 |
| Verify all integrations          | QA          | Day 2 |
| Begin OWASP ZAP scan             | Security    | Day 3 |

---

**Last Updated**: January 3, 2026

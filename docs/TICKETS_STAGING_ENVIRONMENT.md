# Staging Environment Setup - Tickets

**Epic**: INFRA-STAGING  
**Priority**: P0 (Blocks Security Audit)  
**Target Completion**: January 6-8, 2026  
**Board Approval**: January 3, 2026 (Confidence: 0.92)

---

## STAGING-001: Create Convex Staging Deployment

**Priority**: P0  
**Owner**: DevOps  
**Estimate**: 2 hours  
**Dependencies**: None

### Description

Create a separate Convex deployment for staging environment to isolate test data from production.

### Acceptance Criteria

- [ ] Staging deployment created in Convex Dashboard
- [ ] Deployment URL documented
- [ ] Environment variables configured (see LDD_STAGING_ENVIRONMENT.md)
- [ ] Deploy key generated and stored securely

### Steps

1. Login to [dashboard.convex.dev](https://dashboard.convex.dev)
2. Select MartAI project
3. Go to Deployments → Create Deployment
4. Name: `staging`
5. Copy deployment URL
6. Configure environment variables:
   - `OPENAI_API_KEY` (use same key, lower limits)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `STRIPE_SECRET_KEY` (sk_test_xxx)
   - `STRIPE_WEBHOOK_SECRET` (staging webhook)
   - `SITE_URL` = `https://staging.phoo.ai`
   - `AUTH_SECRET` (generate new for staging)
7. Generate and save deploy key

### Verification

```bash
npx convex deploy --deployment staging
npx convex dashboard --deployment staging
```

---

## STAGING-002: Configure Vercel Staging Environment

**Priority**: P0  
**Owner**: DevOps  
**Estimate**: 1 hour  
**Dependencies**: STAGING-001

### Description

Configure Vercel to deploy to staging.phoo.ai from the staging branch.

### Acceptance Criteria

- [ ] staging.phoo.ai subdomain added
- [ ] Preview environment variables set
- [ ] Staging branch auto-deploys

### Steps

1. Go to [vercel.com/dashboard](https://vercel.com)
2. Select MartAI project → Settings → Domains
3. Add `staging.phoo.ai`
4. Configure to deploy from `staging` branch
5. Add environment variables (Preview only):
   - `NEXT_PUBLIC_CONVEX_URL` = staging deployment URL
   - `NEXT_PUBLIC_SITE_URL` = `https://staging.phoo.ai`
   - `STRIPE_PUBLISHABLE_KEY` = `pk_test_xxx`

### Verification

- Push to staging branch → auto-deploys
- https://staging.phoo.ai loads

---

## STAGING-003: Create Staging Branch with Protection

**Priority**: P0  
**Owner**: Engineering  
**Estimate**: 30 minutes  
**Dependencies**: None

### Description

Create the staging Git branch and configure branch protection rules.

### Acceptance Criteria

- [ ] `staging` branch exists
- [ ] Branch protection enabled
- [ ] PR required for merges

### Steps

```bash
git checkout main
git pull origin main
git checkout -b staging
git push -u origin staging
```

Then in GitHub:

1. Settings → Branches → Add rule
2. Branch name pattern: `staging`
3. Enable:
   - [x] Require pull request reviews
   - [x] Require status checks to pass
   - [x] Require branches to be up to date

---

## STAGING-004: Configure Google OAuth for Staging

**Priority**: P0  
**Owner**: DevOps  
**Estimate**: 30 minutes  
**Dependencies**: STAGING-002

### Description

Add staging redirect URIs to Google Cloud Console OAuth configuration.

### Acceptance Criteria

- [ ] Staging redirect URIs added
- [ ] Staging JS origins added
- [ ] OAuth login works on staging

### Steps

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Edit OAuth 2.0 Client
4. Add Authorized redirect URIs:
   ```
   https://staging.phoo.ai/api/auth/callback/google
   ```
5. Add Authorized JavaScript origins:
   ```
   https://staging.phoo.ai
   ```
6. Save

### Verification

- Can sign in with Google on staging.phoo.ai

---

## STAGING-005: Configure Stripe Test Webhooks

**Priority**: P0  
**Owner**: DevOps  
**Estimate**: 30 minutes  
**Dependencies**: STAGING-002

### Description

Set up Stripe webhooks in TEST mode pointing to staging environment.

### Acceptance Criteria

- [ ] Webhook endpoint created for staging
- [ ] Events configured
- [ ] Webhook secret added to Convex staging

### Steps

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) (Test mode!)
2. Developers → Webhooks → Add endpoint
3. Endpoint URL: `https://staging.phoo.ai/api/webhooks/stripe`
4. Events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy signing secret
6. Add to Convex staging: `STRIPE_WEBHOOK_SECRET`

### Verification

```bash
stripe trigger checkout.session.completed --api-key sk_test_xxx
```

---

## STAGING-006: Create Seed Data Script

**Priority**: P1  
**Owner**: Engineering  
**Estimate**: 2 hours  
**Dependencies**: STAGING-001

### Description

Create idempotent seed script to populate staging with test data.

### Acceptance Criteria

- [ ] Seed script created at `convex/scripts/seedStaging.ts`
- [ ] Test user with email `test@phoo.ai`
- [ ] Test admin with email `admin@phoo.ai`
- [ ] Test project created
- [ ] Script is idempotent (can run multiple times safely)

### Code

```typescript
// convex/scripts/seedStaging.ts
import { mutation } from '../_generated/server';

export const seedTestData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), 'test@phoo.ai'))
      .first();

    if (existing) {
      return { message: 'Already seeded', userId: existing._id };
    }

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

    // Create admin
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

### Verification

```bash
npx convex run scripts/seedStaging:seedTestData --deployment staging
```

---

## STAGING-007: Update CI/CD for Multi-Environment

**Priority**: P1  
**Owner**: Engineering  
**Estimate**: 1 hour  
**Dependencies**: STAGING-001, STAGING-003

### Description

Update GitHub Actions to deploy to correct environment based on branch.

### Acceptance Criteria

- [ ] Push to `staging` deploys to Convex staging
- [ ] Push to `main` deploys to Convex production
- [ ] Secrets configured in GitHub

### Steps

1. Add secrets to GitHub:
   - `CONVEX_STAGING_DEPLOY_KEY`
   - `CONVEX_PROD_DEPLOY_KEY`
2. Update `.github/workflows/deploy.yml` (see LDD)

### Verification

- Push to staging → deploys to staging Convex
- Push to main → deploys to prod Convex

---

## STAGING-008: Add Staging Robots.txt

**Priority**: P1  
**Owner**: Engineering  
**Estimate**: 15 minutes  
**Dependencies**: STAGING-002

### Description

Prevent search engines from indexing staging environment.

### Acceptance Criteria

- [ ] robots.txt blocks all crawlers on staging
- [ ] Production robots.txt unchanged

### Code

Create `app/robots.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isStaging = process.env.NEXT_PUBLIC_SITE_URL?.includes('staging');

  if (isStaging) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://phoo.ai/sitemap.xml',
  };
}
```

---

## STAGING-009: Add Health Check Endpoint

**Priority**: P2  
**Owner**: Engineering  
**Estimate**: 30 minutes  
**Dependencies**: STAGING-001

### Description

Create health check endpoint for monitoring and OWASP ZAP baseline.

### Acceptance Criteria

- [ ] `/api/health` returns 200 with status
- [ ] Includes Convex connectivity check
- [ ] Returns environment name

### Code

Create `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.includes('staging') ? 'staging' : 'production';

  return NextResponse.json({
    status: 'healthy',
    environment: env,
    timestamp: new Date().toISOString(),
  });
}
```

---

## STAGING-010: Verification & Documentation

**Priority**: P1  
**Owner**: QA  
**Estimate**: 2 hours  
**Dependencies**: All above tickets

### Description

Verify all staging integrations work and document test credentials.

### Acceptance Criteria

- [ ] All verification checklist items pass
- [ ] Test credentials documented (secure location)
- [ ] Staging testing guide created

### Verification Checklist

- [ ] https://staging.phoo.ai loads
- [ ] Email signup works
- [ ] Google OAuth login works
- [ ] Dashboard loads after login
- [ ] Test checkout with card `4242 4242 4242 4242` works
- [ ] Admin portal accessible at /admin
- [ ] API endpoints respond at /api/health

---

## Summary

| Ticket      | Owner       | Estimate | Priority |
| ----------- | ----------- | -------- | -------- |
| STAGING-001 | DevOps      | 2h       | P0       |
| STAGING-002 | DevOps      | 1h       | P0       |
| STAGING-003 | Engineering | 30m      | P0       |
| STAGING-004 | DevOps      | 30m      | P0       |
| STAGING-005 | DevOps      | 30m      | P0       |
| STAGING-006 | Engineering | 2h       | P1       |
| STAGING-007 | Engineering | 1h       | P1       |
| STAGING-008 | Engineering | 15m      | P1       |
| STAGING-009 | Engineering | 30m      | P2       |
| STAGING-010 | QA          | 2h       | P1       |

**Total Estimate**: ~10 hours (1.5 days)

**Critical Path**: STAGING-001 → STAGING-002 → STAGING-004/005 → STAGING-010

---

**Created**: January 3, 2026

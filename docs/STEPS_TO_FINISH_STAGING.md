# Steps to Finish Staging

**Status**: Pending  
**Total Time**: ~30 minutes  
**Prerequisites**: Code already pushed to `staging` branch

---

## Step 1: Create Convex Staging Deployment (10 min)

1. Go to [dashboard.convex.dev](https://dashboard.convex.dev)
2. Select **MartAI** project
3. Click **Deployments** → **Create Deployment**
4. Name: `staging`
5. Copy the deployment URL (e.g., `https://xxx.convex.cloud`)
6. Go to **Settings** → **Environment Variables**, add:

```bash
OPENAI_API_KEY=sk-xxx
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
STRIPE_SECRET_KEY=sk_test_xxx  # TEST mode only!
SITE_URL=https://staging.phoo.ai
AUTH_SECRET=generate-new-secret
```

7. Go to **Settings** → **Deploy Keys** → Create key → Copy it

---

## Step 2: Configure Vercel (5 min)

1. Go to [vercel.com/dashboard](https://vercel.com)
2. Select MartAI → **Settings** → **Domains**
3. Add: `staging.phoo.ai` → Point to `staging` branch
4. Go to **Settings** → **Environment Variables**
5. Add for **Preview** environment only:

```bash
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud  # from Step 1
NEXT_PUBLIC_SITE_URL=https://staging.phoo.ai
CONVEX_DEPLOY_KEY=prod:staging:xxx  # from Step 1
```

---

## Step 3: Google OAuth (5 min)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials → Edit OAuth 2.0 Client
3. Add **Authorized redirect URI**:
   ```
   https://staging.phoo.ai/api/auth/callback/google
   ```
4. Add **Authorized JavaScript origin**:
   ```
   https://staging.phoo.ai
   ```
5. Save

---

## Step 4: Stripe Webhook (5 min)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) → **Test mode**
2. Developers → Webhooks → **Add endpoint**
3. URL: `https://staging.phoo.ai/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy signing secret → Add to Convex staging: `STRIPE_WEBHOOK_SECRET`

---

## Step 5: Deploy & Seed (5 min)

```bash
# Deploy to staging
npx convex deploy --deployment staging

# Seed test data
npx convex run scripts/seedStaging:seedTestData --deployment staging

# Verify health endpoint
curl https://staging.phoo.ai/api/health
```

---

## Verification Checklist

- [ ] Convex staging deployment created
- [ ] Convex environment variables set
- [ ] Vercel staging domain added
- [ ] Vercel environment variables set
- [ ] Google OAuth redirect URIs added
- [ ] Stripe test webhook created
- [ ] `npx convex deploy --deployment staging` successful
- [ ] Seed script run
- [ ] https://staging.phoo.ai loads
- [ ] Google login works
- [ ] Test checkout works (card: `4242 4242 4242 4242`)

---

## Test Accounts (After Seeding)

| Email          | Role        | Tier       |
| -------------- | ----------- | ---------- |
| test@phoo.ai   | user        | growth     |
| admin@phoo.ai  | super_admin | enterprise |
| viewer@phoo.ai | viewer      | starter    |

---

**Created**: January 3, 2026

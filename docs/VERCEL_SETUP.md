# Vercel Pipeline Setup Guide

## Overview

This guide covers setting up the CI/CD pipeline for MartAI on Vercel with GitHub Actions.

## Prerequisites

1. Vercel account
2. GitHub repository
3. Convex project deployed

## Step 1: Configure Vercel Project

### Option A: Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build:vercel`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
```

## Step 2: Set Environment Variables in Vercel

Go to Vercel Dashboard > Your Project > Settings > Environment Variables

### Required Variables

```bash
# Core
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
JWT_SECRET=<generate-secure-random-string>
JWT_REFRESH_SECRET=<generate-secure-random-string>
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-app.vercel.app/api/oauth/google/callback

# Optional
OPENAI_API_KEY=sk-your-key
API_SECRET_KEY=<generate-secure-random-string>
CSRF_SECRET=<generate-secure-random-string>
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Generate Secure Secrets

```bash
# Generate JWT secrets
openssl rand -base64 32
openssl rand -base64 32

# Generate API secrets
openssl rand -base64 32
openssl rand -base64 32
```

## Step 3: Configure GitHub Secrets

Go to GitHub Repository > Settings > Secrets and variables > Actions

### Required Secrets

- `VERCEL_TOKEN` - Get from [Vercel Tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` - Run `vercel link` and check `.vercel/project.json`
- `VERCEL_PROJECT_ID` - Run `vercel link` and check `.vercel/project.json`
- `CONVEX_DEPLOY_KEY` - Get from Convex Dashboard > Settings > Deploy Keys

### Optional Secrets (for CI testing)

- `NEXT_PUBLIC_CONVEX_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

## Step 4: Configure Convex for CI/CD

1. Go to Convex Dashboard
2. Settings > Deploy Keys
3. Create new deploy key
4. Add to GitHub Secrets as `CONVEX_DEPLOY_KEY`

## Step 5: Verify Pipeline

### Test CI Pipeline

1. Create a test branch:
   ```bash
   git checkout -b test/ci-pipeline
   git push origin test/ci-pipeline
   ```

2. Create a pull request
3. Check GitHub Actions tab - should see:
   - ✅ Lint & Type Check
   - ✅ Tests
   - ✅ Build
   - ✅ Security Audit
   - ✅ Preview Deployment

### Test Production Deployment

1. Merge to `main` branch
2. Check GitHub Actions - should see:
   - ✅ All CI checks pass
   - ✅ Production deployment to Vercel

## Troubleshooting

### Build Fails: Convex Codegen

**Issue**: `convex codegen` fails in CI

**Solution**:
1. Ensure `CONVEX_DEPLOY_KEY` is set in GitHub Secrets
2. Check Convex dashboard for deploy key permissions
3. The workflow has `continue-on-error: true` as fallback

### Build Fails: Missing Environment Variables

**Issue**: Build fails with "environment variable required"

**Solution**:
1. Add all required variables to Vercel Dashboard
2. Ensure variables are set for Production, Preview, and Development

### Deployment Fails: Vercel Authentication

**Issue**: "Vercel authentication failed"

**Solution**:
1. Regenerate `VERCEL_TOKEN` in Vercel dashboard
2. Update GitHub Secret
3. Verify `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are correct

### Type Errors in CI

**Issue**: TypeScript errors in CI but not locally

**Solution**:
1. Run `npm run type-check` locally
2. Ensure `convex codegen` runs before type check
3. Commit generated types if needed

## Pipeline Flow

```
Push/PR → GitHub Actions
  ├─ Lint & Type Check
  ├─ Run Tests
  ├─ Build Application
  │   └─ Generate Convex Types
  │   └─ Build Next.js
  ├─ Security Audit
  └─ Deploy
      ├─ Preview (on PR)
      └─ Production (on main)
```

## Best Practices

1. **Never commit secrets** - Use environment variables
2. **Test locally first** - Run `npm run build` before pushing
3. **Review preview deployments** - Check PR previews before merging
4. **Monitor deployments** - Check Vercel dashboard for deployment status
5. **Keep dependencies updated** - Run `npm audit` regularly

## Next Steps

- [ ] Set up error tracking (Sentry)
- [ ] Configure monitoring (Vercel Analytics)
- [ ] Set up staging environment
- [ ] Add performance monitoring


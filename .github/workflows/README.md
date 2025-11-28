# GitHub Actions Workflows

This directory contains CI/CD workflows for MartAI.

## Workflows

### `ci.yml` - Continuous Integration
Runs on every push and pull request:
- Lint and type checking
- Unit tests
- Build verification
- Security audit
- Preview deployments (on PRs)

### `deploy.yml` - Production Deployment
Runs on pushes to `main` branch:
- Full build with Convex codegen
- Production deployment to Vercel

## Required Secrets

Configure these secrets in GitHub Settings > Secrets and variables > Actions:

### Vercel Secrets
- `VERCEL_TOKEN` - Vercel API token (get from Vercel dashboard)
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Convex Secrets
- `CONVEX_DEPLOY_KEY` - Convex deployment key (for codegen in CI)

### Application Secrets (for testing)
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - JWT refresh secret

## How to Get Vercel Credentials

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login`
3. Run `vercel link` in project directory
4. Get token from: https://vercel.com/account/tokens
5. Get org/project IDs from `.vercel/project.json` after linking

## How to Get Convex Deploy Key

1. Go to Convex dashboard
2. Settings > Deploy Keys
3. Create new deploy key
4. Copy the key to GitHub secrets


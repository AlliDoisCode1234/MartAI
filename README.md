# MartAI

MartAI is a Next.js + Convex workspace for generating AI-driven SEO roadmaps, demo data, and dashboards without relying on third-party keyword APIs.

## Spin It Up

```bash
npm install
npx convex dev                # generates Convex schema/types and runs the backend
npm run dev                   # Next.js app at http://localhost:3000
```

Need to restart everything? Use the helper script:

```bash
npm run server:restart
```

## Environment

Create `.env.local` with at least:

```
NEXT_PUBLIC_CONVEX_URL=<your convex deployment url>
JWT_SECRET=<secure random string>
JWT_REFRESH_SECRET=<secure random string>
```

Seed demo data (admin user, project, fake analytics) any time with:

```bash
npx tsx scripts/seedDemoAccount.ts
```

That’s it—after the servers start, visit `/auth/login` (demo credentials are printed by the seed script) and explore the dashboard, onboarding journey, and AI demo data.

## Core Convex Workflows

- `api.seo.keywordClusters.generateClusters` replaces the legacy `/api/clusters/generate` route and handles optional GSC imports before persisting clusters.
- `api.content.quarterlyPlans.generatePlan` replaces `/api/plans/generate`, validating inputs and creating the 12-week calendar directly in Convex.


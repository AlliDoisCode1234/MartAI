# MartAI Codebase Review (Nov 24, 2025)

## 1. Project Topology

- **Tech stack** – Next.js 15 + TypeScript + Convex backend + Chakra UI. Scripts in `package.json` cover linting, formatting, Convex codegen, and clean builds (`package.json`).
- **TypeScript config** – Strict mode enabled, `paths` alias `@/*` to repo root for consistent absolute imports (`tsconfig.json`).
- **Next config** – React strict mode on, disables `X-Powered-By`; additional security headers centralized in middleware (`next.config.js`, `middleware.ts`).
- **Major directories**
  - `app/`: App Router pages and API routes
  - `src/components`, `src/providers`: UI layers
  - `lib/`: shared logic (auth, storage, security, generation helpers)
  - `convex/`: schema, queries, mutations
  - `scripts/`: seeding/testing utilities

## 2. Frontend Architecture

- **Global layout** wraps pages with `SecurityProvider`, `ChakraProvider`, and shared `Layout`, ensuring security context + design system everywhere (`app/layout.tsx`, `src/providers/*`, `src/components/Layout`).
- **Routing flow**
  - `app/auth/login`, `app/auth/signup` handle auth entry.
  - Onboarding wizard: `app/onboarding`, `/onboarding/reveal`, `/onboarding/results` leads into dashboard/strategy.
  - Core experiences: `/dashboard`, `/strategy`, `/content`, `/publish`, `/analytics`, `/integrations`, `/keywords`, `/settings`.
- **Shared UI** centralized under `src/components/shared` with barrel exports (`docs/SHARED_COMPONENTS.md`). Components like `LoadingState`, `ErrorState`, `EmptyState`, `InfoBadge`, and `StatsCard` enforce consistent design.
- **Hooks & storage**
  - `lib/useAuth.ts` manages login/signup/logout, token refresh, CSRF fetch, and exposes `isAuthenticated`/`user`.
  - `lib/storage.ts` wraps local/session storage with typed helpers plus CSRF token utilities.
- **Rich editors** – Lexical-based content editor under `src/components/LexicalEditor` with SEO/tone plugins.

## 3. Backend (Convex) Architecture

- **Schema** – `convex/schema.ts` defines tables for users, sessions, projects, connections, keyword clusters, plans/briefs/drafts, publishing, analytics, insights, etc., with indexes for common queries.
- **Modules**
  - `convex/auth/*`: user creation, password handling, sessions, seeding helpers.
  - `convex/projects/*`: project + client records.
  - `convex/content/*`: briefs, drafts, quarterly plans, new `content.ts` aggregator.
  - `convex/seo/*`: keyword clusters, keywords, competitors, analytics metadata, strategy query.
  - `convex/publishing/*`: scheduled posts plus consolidated publishing query.
  - `convex/integrations/*`: GA4/GSC connections, CMS integrations.
- **Aggregated queries** added for dashboard/testing: `seo/strategy`, `content/content`, `publishing/publishing`, `integrations/integrations`, `seo/keywordsData`.

## 4. API Surface & Security

- **Routes** – 40+ API endpoints under `app/api/` (auth, projects, clusters/briefs/plans/drafts, analytics, publishing, integrations, OAuth, strategy, demo). Reference catalog in `docs/API_ROUTES.md`.
- **Security layers**
  - `lib/apiSecurity.ts`: CSRF tokens, origin validation, API keys, signatures, request IDs, shared headers.
  - `lib/authMiddleware.ts`: `requireAuth`, `secureResponse`, JWT verification.
  - Global middleware adds security headers & CSP; `SecurityProvider` refreshes tokens client-side.
  - API routes consistently call `requireAuth` + `secureResponse`, specifying `requireOrigin`, `requireCsrf`, and allowed methods/content types.
- **Tokens** – `lib/auth.ts` issues access + refresh JWTs; refresh endpoint validates Convex sessions before issuing new access tokens.

## 5. Data Seeding & Testing Utilities

- **`scripts/seedDemoAccount.ts`** – Idempotent seeding for `demo+admin@martai.com`:
  - Ensures user, project, client records.
  - Seeds keyword clusters (incl. extra demo clusters), quarterly plan, briefs with generated details, drafts, scheduled posts, analytics history, insights, GA4/GSC integrations, keywords.
- **Testing scripts**
  - `scripts/testAllQueries.ts`: exercises key Convex queries (projects, strategy, content, publishing, integrations, keywords, analytics, insights) to ensure data paths work.
  - `scripts/verifySeededData.ts`: sanity-checks seeded entities (user, project, clusters, plan, drafts, posts, analytics, insights, integrations, keywords).
- **UI demo data** – `/api/demo` leverages `lib/demoData.ts` to fabricate frontend-friendly objects when real integrations aren’t connected.

## 6. Documentation & Workflow

- **README** – Product overview, personas, quick start commands, documentation links.
- **DEV_WORKFLOW.md** – Environment prerequisites, setup steps, script catalog, project structure outline.
- **SECURITY.md** – Detailed explanation of password hygiene, API defenses, middleware headers, environment variables, validation checklist.
- **docs/API_ROUTES.md** – Up-to-date inventory of API endpoints with grouping and recommendations.
- **docs/SHARED_COMPONENTS.md** – Usage patterns for reusable UI widgets.
- Documentation aligns with current implementation (routing, security, shared components) and links to relevant files for deeper dives.

## 7. Findings & Recommendations

### Strengths
- Clear separation between frontend (App Router) and Convex backend with rich documentation.
- Comprehensive security layers (JWT + CSRF + origin validation + middleware headers + client security provider).
- Seed + verification scripts provide reproducible demo data and regression coverage for critical queries.
- Shared component library keeps UI consistent and reduces duplication.

### Risks / Gaps
- `lib/useAuth` still relies on multiple fetch retries and manual JSON handling; consider centralizing API client with consistent error parsing + logging.
- Convex type generation requires running `npx convex dev`; ensure CI/build pipeline always executes `convex codegen` to avoid stale `_generated` imports (build errors noted when missing).
- Some API routes swallow Convex errors (e.g., `/api/auth/me` fallback) which can obscure backend issues; structured logging/alerting would help.
- Documentation mentions OAuth integrations (Shopify/Webflow) but corresponding scripts rely on environment secrets that may not exist—need clear env templates (`.env.example` missing).

### Opportunities
- Add automated tests for Next.js API routes (integration tests using MSW or Next test runner) to complement Convex script tests.
- Consider consolidating dashboard data fetching (currently each page fetches individually) via new `/api/dashboard` aggregator.
- Expand monitoring: add request logging middleware that captures `X-Request-ID`, user, route, latency for auditing.
- Provide Storybook or visual documentation for shared components to streamline design handoffs.


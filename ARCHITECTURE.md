# MartAI Architecture

## System Overview

MartAI is an AI-powered SEO automation platform that automates keyword research, content planning, and publishing to WordPress, Shopify, and Webflow.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: Chakra UI
- **Editor**: Lexical (rich text)
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **State**: React hooks + Convex reactive queries

### Backend
- **Database**: Convex (reactive, type-safe)
- **AI**: OpenAI GPT-4o via AI SDK
- **Auth**: JWT (REST-based)
- **Scheduling**: Convex `runAfter` + HTTP actions for cron

### Integrations
- **WordPress**: REST API with Application Passwords
- **Shopify**: Admin API with Private App tokens
- **Webflow**: API with OAuth
- **Google**: Analytics Data API, Search Console API

## System Architecture

```
┌─────────────────┐
│   Next.js App   │
│  (Frontend)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌──▼────┐
│Convex │  │OpenAI │
│(DB)   │  │(AI)   │
└───┬───┘  └───────┘
    │
┌───▼──────────────────────────┐
│  WordPress / Shopify / Webflow│
│  GA4 / GSC                    │
└───────────────────────────────┘
```

## Data Model (Convex)

### Core Tables
- `users` - User accounts
- `sessions` - JWT sessions
- `projects` - Client projects
- `clients` - Legacy client data

### SEO & Content
- `keywordClusters` - AI-generated keyword clusters
- `quarterlyPlans` - 12-week content calendars
- `briefs` - Content briefs with SEO metadata
- `briefVersions` - Brief version history
- `drafts` - Generated content drafts
- `scheduledPosts` - Publishing schedule

### Analytics
- `ga4Connections` - GA4 OAuth tokens
- `gscConnections` - GSC OAuth tokens
- `analyticsData` - Aggregated GA4/GSC data
- `competitors` - Competitor tracking

### Integrations
- `oauthTokens` - CMS OAuth credentials
- `generatedPages` - Published pages
- `seoAudits` - Site audit results
- `keywords` - Keyword suggestions
- `rankings` - Ranking history
- `seoStatistics` - Aggregated metrics

## Data Flow

### 1. Onboarding
```
User Input → Convex (projects) → AI Analysis → Keywords → Clusters
```

### 2. Content Planning
```
Clusters → AI Planning → Quarterly Plan → Briefs → Drafts → Publish
```

### 3. Analytics
```
GA4/GSC OAuth → Data Sync → Analytics Data → KPIs → Insights
```

## Key Components

### API Routes (`app/api/`)
- **Auth**: `/api/auth/*` - Signup, login, logout, me
- **OAuth**: `/api/oauth/*` - Google, WordPress, Shopify, Webflow
- **Content**: `/api/briefs/*`, `/api/drafts/*`, `/api/publish/*`
- **Planning**: `/api/plans/*`, `/api/clusters/*`
- **Analytics**: `/api/analytics/*`, `/api/ga4/*`, `/api/gsc/*`
- **AI**: `/api/seo-agent` - Main AI agent endpoint

### Convex Functions (`convex/`)
- **Mutations**: Create, update, delete operations
- **Queries**: Read operations with reactive updates
- **Actions**: External API calls, scheduled jobs
- **HTTP Actions**: Cron triggers

### Lib Utilities (`lib/`)
- `typeGuards.ts` - Type validation (assert*, parse*)
- `convexClient.ts` - Convex client wrapper
- `authMiddleware.ts` - JWT verification
- `googleAuth.ts` - GA4/GSC OAuth
- `wordpress.ts`, `shopify.ts`, `webflow.ts` - CMS clients
- `keywordClustering.ts`, `quarterlyPlanning.ts` - AI utilities
- `briefGenerator.ts`, `draftGenerator.ts` - Content generation

### Components (`src/components/`)
- `LexicalEditor/` - Rich text editor with SEO validation
- `DraggableBriefList/` - Drag-and-drop rescheduling
- `Navigation/` - App navigation
- `ProtectedRoute/` - Auth guard

## Type System

### Centralized Types (`types/index.ts`)
- Single source of truth for all domain types
- Convex ID types (ProjectId, BriefId, etc.)
- Component prop types
- API request/response types

### Type Guards (`lib/typeGuards.ts`)
- `assert*` functions: Validate and throw (required fields)
- `parse*` functions: Return null for optional fields
- Validates Convex ID format
- No null returns for required fields

### Principles
- Types reflect reality, not convenience
- Validate at boundaries, guarantee type after
- Pass whole objects to maintain type inference
- No `as any` casting

## Security

- **JWT**: Secure token-based auth
- **OAuth**: Minimal scopes, encrypted tokens
- **API Keys**: Environment variables only
- **Rate Limiting**: Per-route protection
- **Input Validation**: Type guards at boundaries
- **Error Handling**: Comprehensive try-catch

## Deployment

- **Frontend**: Vercel (automatic from main)
- **Backend**: Convex (managed)
- **Environment**: `.env.local` for dev, Vercel env vars for prod
- **Build**: `npm run build` with clean step
- **Cron**: External service triggers HTTP actions

## Future Enhancements

- Ahrefs API integration
- Advanced rank tracking
- Multi-language support
- Competitor analysis
- Automated reporting
- Webhook support

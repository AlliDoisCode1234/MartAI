# MartAI Documentation

## Product Requirements

See [PRD_MARTAI.md](PRD_MARTAI.md) for complete product requirements document.

### MVP Goals
- Intake business details and connect GA4 + GSC
- Generate quarterly SEO plan (keyword clusters → briefs → calendar)
- Produce on-brand content drafts
- Enable approve/schedule/publish to CMS
- Track traffic/leads and generate insights

### User Personas
- **Owner Olivia**: SMB owner wanting traffic → leads without micromanaging
- **Marketer Max**: In-house marketer needing repeatable SEO system
- **Agency Amy**: Agency needing scalable multi-client implementation

## Feature Specifications

### Authentication (US-1.1, US-1.2)
- REST-based JWT authentication
- User signup/login with password validation (≥8 chars)
- Project creation with business info
- Protected routes with middleware

### Data Connections (US-2.1, US-2.2, US-2.3)
- **GA4**: Google OAuth → property selection → token storage → data sync
- **GSC**: Google OAuth → site selection → daily sync → last sync display
- **CMS**: WordPress/Shopify/Webflow credentials → test connection → publishing rights check

### SEO Intelligence (US-3.1, US-3.2)
- Import keywords from GSC
- AI-powered keyword clustering with:
  - Intent classification (informational, commercial, transactional)
  - Difficulty proxy and volume range
  - Impact scoring
  - Top SERP URLs
- Re-rank, hide, favorite clusters

### Planning (US-4.1, US-4.2)
- **Quarterly Plan**: Input content velocity → 12-week calendar with brief placeholders
- **Brief Editor**: Title options, H2 outline, FAQs, meta tags, internal links, schema
- Drag-and-drop rescheduling
- Version saving

### Content Creation (US-5.1, US-5.2)
- **Draft Generation**: AI-powered from briefs with quality/tone scoring
- **Rich Editor**: Lexical with word count, SEO checklist, tone meter
- Re-generation with notes
- Approve workflow

### Publishing (US-6.1)
- Schedule with date/time/timezone
- Immediate publish option
- Tags, categories, slug configuration
- WordPress/Shopify/Webflow support
- Status tracking and retry on failure

### Analytics (US-7.1, US-7.2)
- **KPIs**: Sessions, Clicks, CTR, Avg Position, Leads, Revenue
- **Charts**: Traffic growth, leads trends (Recharts)
- **Time Filters**: 7/30/90 days with period comparison
- **Insights**: Top gainers, underperformers, quick wins with "Apply Suggestion"

## API Reference

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### OAuth
- `GET /api/oauth/google` - Initiate Google OAuth
- `GET /api/oauth/google/callback` - Handle Google callback
- `POST /api/oauth/wordpress` - WordPress connection
- `POST /api/oauth/shopify` - Shopify connection

### Content
- `GET /api/briefs?briefId=` - Get brief
- `POST /api/briefs/generate` - Generate brief details
- `PATCH /api/briefs` - Update brief
- `GET /api/drafts?briefId=` - Get draft
- `POST /api/drafts/generate` - Generate draft
- `POST /api/publish/schedule` - Schedule post
- `POST /api/publish/now` - Publish immediately

### Planning
- `GET /api/clusters?projectId=` - Get clusters
- `POST /api/clusters/generate` - Generate clusters
- `GET /api/plans?projectId=` - Get plan
- `POST /api/plans/generate` - Generate plan
- `PATCH /api/briefs/reschedule` - Reschedule brief

### Analytics
- `GET /api/analytics/data` - Get analytics data
- `GET /api/analytics/kpis` - Get KPIs
- `GET /api/analytics/insights` - Get insights
- `POST /api/analytics/sync` - Trigger sync
- `POST /api/insights/apply` - Apply insight suggestion

## Implementation Status

### ✅ Complete (MVP P0)
- Authentication with JWT
- GA4/GSC OAuth and data sync
- Keyword clustering with AI
- Quarterly planning with drag-drop
- Brief editor with AI generation
- Draft generation with scoring
- Lexical rich text editor
- Scheduling and publishing
- Analytics dashboard with insights

### TypeScript Refactoring
- Reduced `as any` from 69 to 36 instances (48% reduction)
- Created type guards with `assert*` and `parse*`
- Centralized types in `types/index.ts`
- Fixed prop drilling - pass whole objects
- Types reflect reality, validate at boundaries

### Remaining Work
- Replace remaining 36 `as any` instances
- Update components to receive whole objects
- Remove `@ts-nocheck` from Convex files
- Add comprehensive tests
- Edge case handling

## Type System

### Type Guards (`lib/typeGuards.ts`)
```typescript
// Required fields - throws if invalid
assertProjectId(id: string): ProjectId
assertBriefId(id: string): BriefId

// Optional fields - returns null if invalid
parseClusterId(id: string): ClusterId | null
```

### Centralized Types (`types/index.ts`)
- Single source of truth
- Convex ID types
- Component prop types
- API types

### Principles
- Validate at boundaries, guarantee type after
- Pass whole objects to maintain inference
- No null returns for required fields
- Only nullable for `v.optional()` in schema


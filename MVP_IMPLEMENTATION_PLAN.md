# MartAI MVP Implementation Plan

Based on PRD requirements, focusing on MVP P0 features to deliver the core workflow: **Setup → Plan → Draft → Publish → Measure**

## Current Status vs MVP P0 Requirements

### ✅ Already Built
- Basic onboarding form (needs auth)
- WordPress/Shopify CMS connections
- AI-powered keyword generation
- Site crawling and SEO audit
- Basic content generation
- OAuth token storage in Convex

### ❌ MVP P0 Missing (Critical Path)
1. **Authentication** - No user accounts
2. **GA4/GSC Connections** - No data sources
3. **Quarterly Planning** - No calendar/planning system
4. **Briefs System** - No brief generation/editing
5. **Draft Workflow** - No brief→draft→approve flow
6. **Scheduling** - Immediate publish only
7. **Analytics Dashboard** - No KPI visualization

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal:** Enable multi-user, multi-project setup

1. **Authentication System**
   - Add Clerk or implement Convex auth
   - User table in Convex
   - Protected routes
   - Session management

2. **Enhanced Onboarding**
   - Add competitors field (up to 5)
   - Add goals and brand voice samples
   - Project creation with proper user association
   - "Connect Data" landing page after onboarding

3. **Project Management**
   - Multiple projects per user
   - Project switching
   - Project settings

### Phase 2: Data Connections (Week 1-2)
**Goal:** Connect GA4, GSC, and enhance CMS connections

1. **GA4 Integration**
   - Google OAuth flow
   - GA4 property selection
   - Token storage and refresh
   - Connection status UI
   - Background sync job setup

2. **Google Search Console**
   - GSC OAuth flow
   - Site selection
   - Daily sync job
   - Last sync time display
   - Top queries import

3. **Enhanced CMS Connections**
   - Connection status cards
   - Error logging
   - Retry mechanisms
   - Publishing rights validation

### Phase 3: SEO Intelligence & Planning (Week 2-3)
**Goal:** Generate keyword clusters and quarterly plans

1. **Keyword Clustering**
   - Cluster generation algorithm
   - Intent classification
   - Difficulty proxy calculation
   - Volume range estimation
   - SERP URL analysis
   - Impact scoring: `volume_weight*volume + intent_weight*intent - difficulty_weight*difficulty`
   - Re-rank, hide, favorite functionality

2. **Quarterly Planning Engine**
   - Content velocity input (1-4 posts/week)
   - 12-week calendar generation
   - Brief placeholder creation
   - Plan summary with goals/assumptions
   - Drag-drop rescheduling
   - Collision checks
   - Calendar UI component

3. **Brief System**
   - Brief editor UI
   - Title options generation
   - H2 outline creation
   - FAQ generation
   - Meta title/description
   - Internal link recommendations
   - Schema suggestions
   - Version saving
   - Brief status tracking

### Phase 4: Content Creation (Week 3-4)
**Goal:** Brief → Draft → Approve workflow

1. **Draft Generation**
   - Generate from brief
   - Job status tracking
   - Markdown output
   - Heading structure
   - Transparent sections (cost/problems/comparisons)
   - Internal link placeholders
   - Quality/tone scoring
   - Re-generation with notes
   - Brand voice profile application

2. **Rich Text Editor**
   - Markdown editor with preview
   - Word count
   - SEO checklist:
     - Title length (50-60 chars)
     - H2 density
     - FAQs present
     - Internal links
     - Schema presence
   - Brand tone meter
   - Approve button
   - Draft locking on approval

### Phase 5: Publishing & Analytics (Week 4-5)
**Goal:** Schedule/publish and track results

1. **Enhanced Publishing**
   - Schedule modal (date/time/timezone)
   - Tags/categories/slug input
   - Preview URL
   - Status tracking (Scheduled/Published)
   - Retry on failure
   - Internal link resolver [[slug]] → URL
   - Rollback on failure

2. **Analytics Dashboard**
   - KPI cards: Sessions, Clicks, CTR, Avg Position, Leads, Est Revenue
   - Time filters: 7/30/90 days
   - Period comparison
   - Line charts for traffic
   - Bar charts for leads
   - ROI by content
   - Insight cards: Top Gainers, Underperformers, Quick Wins
   - Apply Suggestion functionality

3. **Background Jobs**
   - Nightly GA4/GSC ingest
   - Derived metrics calculation
   - Anomaly alerts
   - CSV export

## Database Schema Additions Needed

```typescript
// New tables for MVP P0
users: {
  _id, email, name, createdAt
}

projects: {
  _id, userId, name, website, industry, competitors[], goals, brandVoice
}

ga4Connections: {
  _id, projectId, propertyId, propertyName, accessToken, refreshToken, lastSync
}

gscConnections: {
  _id, projectId, siteUrl, accessToken, refreshToken, lastSync
}

keywordClusters: {
  _id, projectId, clusterName, keywords[], intent, difficulty, volumeRange, serpUrls[], impactScore, status
}

quarterlyPlans: {
  _id, projectId, startDate, endDate, contentVelocity, briefs[], version
}

briefs: {
  _id, planId, clusterId, titleOptions[], h2Outline[], faqs[], metaTitle, metaDesc, internalLinks[], schemaSuggestion, status, version
}

drafts: {
  _id, briefId, content, wordCount, qualityScore, toneScore, seoChecklist, status, approvedAt
}

scheduledPosts: {
  _id, draftId, cmsPlatform, publishDate, timezone, tags[], categories[], slug, status, cmsUrl
}
```

## UI Components to Build

1. **Calendar Grid** - 12-week view with drag-drop
2. **Brief Editor** - Left meta, right outline, bottom actions
3. **Draft Editor** - Side-by-side brief + markdown, tone meter, SEO checklist
4. **Schedule Modal** - Date/time picker with timezone
5. **KPI Cards** - Sessions, Clicks, CTR, etc.
6. **Charts** - Line (traffic), Bar (leads)
7. **Insight Cards** - Top Gainers, Underperformers, Quick Wins
8. **Connection Status Cards** - GA4, GSC, CMS with last sync
9. **Progress Ring** - For job status
10. **Chat Interface** - For AI Assistant (P1)

## Technical Implementation Notes

### Google OAuth (GA4/GSC)
- Use `@react-oauth/google` or `googleapis` package
- Scopes: `https://www.googleapis.com/auth/analytics.readonly`, `https://www.googleapis.com/auth/webmasters.readonly`
- Store tokens encrypted in Convex
- Implement refresh token rotation

### Keyword Clustering Algorithm
```typescript
function generateClusters(keywords, intent, difficulty, volume) {
  // Group by semantic similarity
  // Calculate impact score
  // Rank by impact
  // Return clusters with metadata
}
```

### Planning Engine
```typescript
function generateQuarterlyPlan(clusters, velocity, startDate) {
  // Distribute clusters across 12 weeks
  // Create brief placeholders
  // Calculate traffic/lead goals
  // Return calendar with briefs
}
```

### Background Jobs (Convex)
- Use Convex `httpAction` for external API calls
- Use Convex cron for scheduled jobs
- Implement retry with exponential backoff

## Success Metrics

- ✅ User can create account and project
- ✅ User can connect GA4, GSC, and CMS
- ✅ User can generate keyword clusters
- ✅ User can generate 12-week quarterly plan
- ✅ User can create and edit briefs
- ✅ User can generate drafts from briefs
- ✅ User can approve and schedule content
- ✅ User can view KPIs and insights
- ✅ Background jobs sync data nightly

## Next Steps

1. Start with authentication (Clerk integration)
2. Add GA4/GSC OAuth flows
3. Build keyword clustering
4. Implement quarterly planning
5. Create brief/draft workflow
6. Add scheduling
7. Build analytics dashboard


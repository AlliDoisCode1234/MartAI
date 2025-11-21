# MartAI MVP P0 Implementation - Next Steps

## Summary

I've reviewed the comprehensive PRD and created:
1. ✅ **PRD_MARTAI.md** - Full PRD with "Phoo" replaced by "MartAI"
2. ✅ **IMPLEMENTATION_VS_PRD.md** - Gap analysis (current ~25% coverage)
3. ✅ **MVP_IMPLEMENTATION_PLAN.md** - Detailed 5-week implementation plan
4. ✅ **Expanded Convex schema** - Added tables for users, projects, GA4/GSC, clusters, plans, briefs, drafts, scheduled posts

## Current State

### What We Have (Foundation)
- ✅ Convex backend with schema
- ✅ Next.js 15 + Chakra UI
- ✅ AI agent with OpenAI
- ✅ Site crawling & SEO audit
- ✅ Keyword generation
- ✅ WordPress/Shopify OAuth & publishing
- ✅ Basic onboarding

### What's Missing for MVP P0 (Critical Path)
1. **Authentication** - No user accounts (US-1.1)
2. **GA4 Connection** - No Google Analytics (US-2.1)
3. **GSC Connection** - No Search Console (US-2.2)
4. **Keyword Clusters** - Only individual keywords (US-3.2)
5. **Quarterly Planning** - No 12-week calendar (US-4.1)
6. **Briefs System** - No brief editor (US-4.2)
7. **Draft Workflow** - No brief→draft→approve (US-5.1, US-5.2)
8. **Scheduling** - Immediate publish only (US-6.1)
9. **Analytics Dashboard** - No KPIs/charts (US-7.1, US-7.2)

## Recommended Implementation Order

### Week 1: Foundation & Data Connections
**Priority: MVP P0 - Critical Path**

1. **Add Authentication** (US-1.1)
   - Install Clerk or implement Convex auth
   - User management
   - Protected routes
   - Update onboarding to create projects

2. **GA4 Integration** (US-2.1)
   - Google OAuth flow
   - GA4 property selection
   - Token storage in Convex
   - Connection status UI
   - Background sync setup

3. **GSC Integration** (US-2.2)
   - GSC OAuth flow
   - Site selection
   - Daily sync job
   - Top queries import

### Week 2: SEO Intelligence & Planning
**Priority: MVP P0 - Core Differentiator**

4. **Keyword Clustering** (US-3.2)
   - Cluster generation algorithm
   - Impact scoring: `volume_weight*volume + intent_weight*intent - difficulty_weight*difficulty`
   - Re-rank, hide, favorite
   - SERP analysis

5. **Quarterly Planning Engine** (US-4.1)
   - Content velocity input (1-4 posts/week)
   - 12-week calendar generation
   - Brief placeholder creation
   - Drag-drop rescheduling
   - Calendar UI component

6. **Brief Editor** (US-4.2)
   - Title options
   - H2 outline
   - FAQs
   - Meta title/description
   - Internal links
   - Schema suggestions
   - Version saving

### Week 3: Content Creation
**Priority: MVP P0 - Core Workflow**

7. **Draft Generation** (US-5.1)
   - Generate from brief
   - Job status tracking
   - Markdown output
   - Quality/tone scoring
   - Re-generation

8. **Rich Text Editor** (US-5.2)
   - Markdown editor
   - SEO checklist
   - Word count
   - Brand tone meter
   - Approve workflow

### Week 4: Publishing & Analytics
**Priority: MVP P0 - Complete Loop**

9. **Scheduling** (US-6.1)
   - Schedule modal
   - Date/time/timezone
   - Tags/categories/slug
   - Status tracking

10. **Analytics Dashboard** (US-7.1, US-7.2)
    - KPI cards
    - Charts (line/bar)
    - Time filters
    - Insight cards
    - Apply Suggestion

## Key Files to Create/Update

### Convex Functions Needed
- `convex/users.ts` - User management
- `convex/projects.ts` - Project CRUD
- `convex/ga4Connections.ts` - GA4 OAuth & sync
- `convex/gscConnections.ts` - GSC OAuth & sync
- `convex/keywordClusters.ts` - Cluster generation
- `convex/quarterlyPlans.ts` - Plan generation
- `convex/briefs.ts` - Brief management
- `convex/drafts.ts` - Draft generation & approval
- `convex/scheduledPosts.ts` - Scheduling

### API Routes Needed
- `app/api/auth/` - Authentication
- `app/api/ga4/` - GA4 OAuth & data
- `app/api/gsc/` - GSC OAuth & data
- `app/api/clusters/` - Keyword clustering
- `app/api/plans/` - Quarterly planning
- `app/api/briefs/` - Brief management
- `app/api/drafts/` - Draft generation
- `app/api/schedule/` - Publishing schedule

### UI Pages Needed
- `app/strategy/page.tsx` - Enhanced with calendar & clusters
- `app/content/page.tsx` - Brief editor & draft workflow
- `app/analytics/page.tsx` - KPI dashboard with charts
- `app/connect/page.tsx` - Data connections (GA4/GSC/CMS)

## Technical Dependencies to Add

```bash
npm install @clerk/nextjs  # or alternative auth
npm install googleapis     # GA4 & GSC APIs
npm install @react-oauth/google
npm install recharts      # Charts for analytics
npm install react-markdown # Rich text editor
npm install date-fns       # Date handling
npm install zod            # Already have
```

## Success Criteria for MVP P0

✅ User can sign up and create project
✅ User can connect GA4, GSC, and CMS
✅ User can generate keyword clusters
✅ User can generate 12-week quarterly plan
✅ User can create and edit briefs
✅ User can generate drafts from briefs
✅ User can approve and schedule content
✅ User can view KPIs and insights
✅ Background jobs sync data

## Next Action

**Start with Authentication** - This unlocks everything else. Recommend Clerk for fastest implementation, or Convex auth for full control.

Would you like me to:
1. Implement authentication first?
2. Start with GA4/GSC connections?
3. Build the keyword clustering algorithm?
4. Create the quarterly planning engine?

Let me know which MVP P0 feature you want to tackle first!


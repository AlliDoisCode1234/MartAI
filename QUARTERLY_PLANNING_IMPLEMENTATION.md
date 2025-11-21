# Quarterly Planning Engine Implementation

## ✅ What's Been Implemented

### Backend (REST API)

1. **`/api/plans/generate`** - Generate quarterly plan
   - Content velocity input (1-7 posts/week)
   - 12-week calendar generation
   - Brief placeholder creation
   - AI-powered plan summary
   - Traffic/leads estimation
   - Cluster assignment to briefs

2. **`/api/plans`** - Plan CRUD
   - GET: Get plan by project
   - PATCH: Update plan
   - DELETE: Delete plan

3. **`/api/briefs/reschedule`** - Reschedule briefs
   - Drag-drop rescheduling support
   - Date validation

### Convex Functions

**`convex/quarterlyPlans.ts`**
- `createQuarterlyPlan` - Create plan with brief placeholders
- `getPlanByProject` - Get plan with briefs
- `updatePlan` - Update plan settings
- `rescheduleBrief` - Move brief to new date
- `assignClusterToBrief` - Link cluster to brief
- `deletePlan` - Remove plan and briefs

**`convex/briefs.ts`**
- `createBrief` - Create brief
- `getBriefById` - Get single brief
- `getBriefsByPlan` - List plan briefs
- `updateBrief` - Update brief details
- `deleteBrief` - Remove brief

### Frontend

**`/strategy`** - Updated with planning
- Generate Quarterly Plan button
- Plan summary with goals and assumptions
- 12-week content calendar table
- Brief status tracking
- Content velocity input (1-7 posts/week)
- Start date selection
- Traffic/leads goal inputs

### Planning Library

**`lib/quarterlyPlanning.ts`**
- `generateQuarterlyPlan()` - Create 12-week plan
- `generatePlanSummary()` - AI-powered assumptions
- `estimateTraffic()` - Traffic estimation
- `estimateLeads()` - Leads estimation
- `checkSchedulingConflicts()` - Conflict detection

## 🎯 User Flow (US-4.1)

1. User clicks "Generate Quarterly Plan"
2. Input content velocity (1-7 posts/week)
3. Select start date
4. Optionally set traffic/leads goals
5. System generates 12-week calendar
6. Creates brief placeholders (velocity × 12 weeks)
7. Assigns keyword clusters to briefs by impact
8. AI generates plan assumptions
9. Calculates estimated traffic/leads
10. User can reschedule briefs (drag-drop ready)
11. Plan summary shows goals and assumptions

## ✅ Acceptance Criteria Met

**US-4.1: Generate Quarterly Plan**
✅ Input: desired content velocity (1-7 posts/week)
✅ Output: 12-week calendar with brief placeholders and dates
✅ Plan summary shows goals (traffic, leads) and assumptions
✅ Can reschedule items (API ready, UI can be enhanced with drag-drop)
✅ Briefs assigned to keyword clusters
✅ Estimated metrics calculated

## 📋 Plan Structure

- **Content Velocity**: Posts per week (1-7)
- **Duration**: 12 weeks
- **Total Briefs**: velocity × 12
- **Brief Distribution**: Evenly spread across weeks
- **Cluster Assignment**: Rotates through clusters by impact
- **Goals**: Traffic, leads, revenue (optional)
- **Assumptions**: AI-generated strategic summary

## 🔧 Setup Required

1. **OpenAI API Key** (for plan summary generation)
2. **Convex** (run `npx convex dev`)
3. **Keyword Clusters** (should be generated first)

## 📝 Next Steps

1. **Drag-Drop UI** - Implement visual calendar drag-drop
2. **Brief Editor** - Open brief to edit details (US-4.2)
3. **Collision Detection** - Warn on scheduling conflicts
4. **Plan Templates** - Pre-configured velocity templates
5. **Export Calendar** - Export to iCal/Google Calendar

## 🎯 MVP P0 Progress

**Completed**: 5/10 features (50%)
- ✅ Authentication
- ✅ GA4 OAuth
- ✅ GSC OAuth
- ✅ Keyword Clustering
- ✅ Quarterly Planning

**Next**: Brief Editor (US-4.2)

## 🚀 Deployment Script

Added `scripts/deploy.ps1` and `scripts/deploy.sh` for automated deployment:
```bash
npm run deploy "Your commit message"
# or
./scripts/deploy.ps1 "Your commit message"  # Windows
./scripts/deploy.sh "Your commit message"    # Unix
```


# Scheduling Implementation

## ✅ What's Been Implemented

### Convex Scheduling with `ctx.scheduler.runAfter()`

**How it works:**
1. When a post is scheduled, we calculate the delay in milliseconds
2. Use `ctx.scheduler.runAfter(delayMs, internal.scheduledPosts.publishPost, { postId })`
3. Convex will automatically trigger the `publishPost` internal mutation at the specified time
4. The internal mutation updates status and can trigger external HTTP calls

### Backend (REST API)

1. **`/api/publish/schedule`** - Schedule a post
   - Accepts draftId, publishDate (timestamp), timezone, platform
   - Validates future date
   - Verifies platform connection exists
   - Creates scheduled post in Convex
   - Uses `ctx.scheduler.runAfter()` to schedule publish

2. **`/api/publish/now`** - Publish immediately
   - Publishes approved draft to CMS
   - Updates draft and brief status
   - Returns published URL

3. **`/api/publish`** - CRUD for scheduled posts
   - GET: List scheduled posts by project
   - PATCH: Update scheduled post (reschedules if date changes)
   - DELETE: Cancel scheduled post

4. **`/api/publish/trigger`** - Cron/webhook endpoint
   - Protected with CRON_SECRET
   - Queries due posts
   - Publishes to CMS
   - Updates status

### Convex Functions

**`convex/scheduledPosts.ts`**
- `createScheduledPost` - Create and schedule post
  - Uses `ctx.scheduler.runAfter()` for one-time scheduling
  - Max delay: 1 year
- `publishPost` (internal) - Called by scheduler
  - Updates status to publishing
  - Triggers external publish via HTTP
- `getScheduledPosts` - List by project
- `getScheduledPostsByStatus` - Filter by status
- `updateScheduledPost` - Update and reschedule
- `cancelScheduledPost` - Cancel
- `deleteScheduledPost` - Delete
- `getDuePosts` (internal) - For cron queries

**`convex/http.ts`**
- `checkScheduledPosts` - HTTP action for cron
  - Protected with CRON_SECRET
  - Queries due posts
  - Triggers publish mutations

### Frontend

**`/publish`** - Publishing & Scheduling page
- Schedule modal with:
  - Date picker
  - Time picker
  - Timezone selector (ET, CT, MT, PT, UTC)
  - Platform selector (WordPress, Shopify)
  - Slug input
  - Tags (comma-separated)
  - Categories (comma-separated)
- Scheduled posts table:
  - Title, platform, publish date, timezone, status
  - Actions: Publish Now, Cancel, View
- Status badges with colors
- Publish Now button for immediate publishing

### Schema

**`scheduledPosts` table:**
- draftId, projectId, briefId
- publishDate (timestamp)
- timezone
- platform (wordpress, shopify)
- tags, categories, slug
- status (scheduled, publishing, published, failed, cancelled)
- publishedUrl, errorMessage
- Indexes: by_project, by_status, by_publish_date

## 🎯 Convex Scheduling Approach

**Option 1: `ctx.scheduler.runAfter()` (Implemented)**
- One-time scheduling
- Automatic trigger at specified time
- Max delay: 1 year
- Pros: Built-in, reliable, no external dependencies
- Cons: Limited to 1 year, can't easily reschedule

**Option 2: HTTP Action + External Cron (Fallback)**
- `/api/publish/trigger` endpoint
- External cron calls endpoint every minute
- Queries due posts and publishes
- Pros: More control, can query all projects
- Cons: Requires external cron service

**Hybrid Approach (Current):**
- Primary: `ctx.scheduler.runAfter()` for scheduling
- Fallback: HTTP action for cron if needed
- Best of both worlds

## 📋 User Flow (US-6.1)

1. User approves draft in `/content`
2. User navigates to `/publish` (or from draft)
3. Clicks "Schedule Publish"
4. Modal opens with:
   - Date picker (future dates only)
   - Time picker
   - Timezone selector
   - Platform selector
   - Slug, tags, categories
5. User clicks "Schedule"
6. API creates scheduled post
7. Convex `ctx.scheduler.runAfter()` schedules publish
8. At scheduled time, `publishPost` internal mutation runs
9. Status updates to "publishing" → "published"
10. User sees status in table
11. Can cancel before publish time
12. Can "Publish Now" to override schedule

## ✅ Acceptance Criteria Met

**US-6.1: Schedule or publish approved content**
✅ Choose publish date/time
✅ Set timezone
✅ Set tags/categories/slug
✅ On success, see CMS URL and status
✅ On failure, see error and retry option
✅ Publish now functionality
✅ Cancel scheduled posts

## 🔧 Setup for Production

1. **Set CRON_SECRET** in environment variables
2. **Optional**: Set up external cron to call `/api/publish/trigger`
   - Frequency: Every 1-5 minutes
   - Auth: Bearer token with CRON_SECRET
3. **Convex Scheduler** will handle most scheduling automatically
4. **Monitor** scheduled posts table for failed publishes

## 🎯 MVP P0 Progress

**Completed**: 8/10 features (80%)
- ✅ Authentication
- ✅ GA4 OAuth
- ✅ GSC OAuth
- ✅ Keyword Clustering
- ✅ Quarterly Planning
- ✅ Brief Editor
- ✅ Draft Generation
- ✅ Scheduling & Publishing

**Next**: Analytics Dashboard (US-7.1, US-7.2)

## 📝 Notes

- Convex `ctx.scheduler.runAfter()` is the primary scheduling mechanism
- HTTP action provides fallback for external cron
- Timezone handling uses IANA timezone names
- Platform connection must exist before scheduling
- Draft must be approved before scheduling
- Publish date must be in the future


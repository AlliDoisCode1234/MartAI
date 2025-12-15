# WordPress Publishing Improvements

## Summary

Enhanced WordPress publishing with retry logic, better error handling, and improved scheduled post automation.

## Changes Made

### 1. **Retry Logic with Exponential Backoff** ✅
- Created `lib/publishingRetry.ts` utility
- Implements exponential backoff (1s, 2s, 4s delays)
- Configurable retry attempts (default: 3)
- Retryable error detection (network, timeout, rate limits)

### 2. **Enhanced Error Handling** ✅
- All publish endpoints now use retry logic
- Failed publishes stored with error messages
- Better error reporting to users

### 3. **Improved Scheduled Posts** ✅
- Added `getScheduledPostById` query
- Added `retryFailedPublish` mutation for manual retries
- Enhanced `updateScheduledPost` to handle status/error updates
- Created HTTP action for Convex scheduler integration

### 4. **Updated Endpoints** ✅
- `/api/publish/now` - Uses retry logic
- `/api/publish/trigger` - Uses retry logic, supports single post or batch
- Better error messages and status tracking

## Files Modified

- `lib/publishingRetry.ts` (new)
- `app/api/publish/now/route.ts`
- `app/api/publish/trigger/route.ts`
- `convex/publishing/scheduledPosts.ts`
- `convex/http/publishScheduledPost.ts` (new)
- `convex/http.ts`

## How It Works

### Retry Logic
```typescript
const result = await publishWithRetry(
  async () => {
    return await wpClient.createPage({ ... });
  },
  {
    maxRetries: 3,
    initialDelayMs: 1000,
    retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'rate limit', ...]
  }
);
```

### Scheduled Posts Flow
1. User schedules post → `createScheduledPost` mutation
2. Convex scheduler triggers at publish time → `publishPost` internal mutation
3. HTTP action calls Next.js API → `/api/publish/trigger`
4. API publishes with retry logic → WordPress API
5. Status updated → `published` or `failed` with error message

## Next Steps

### Still TODO:
- [ ] Set up Vercel Cron to call `/api/publish/trigger` hourly
- [ ] Add UI for retrying failed publishes
- [ ] Add notification system for failed publishes
- [ ] Add logging/monitoring for publish success rates
- [ ] Add unit tests for retry logic

## Setting Up Automated Publishing

### Option 1: Vercel Cron (Recommended)
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/publish/trigger",
    "schedule": "0 * * * *"
  }]
}
```

Set environment variable:
- `CRON_SECRET` - Secure secret for authorization

### Option 2: External Cron Service
Call `POST /api/publish/trigger` with header:
```
Authorization: Bearer <CRON_SECRET>
```

### Option 3: Convex HTTP Action
Convex scheduler can call:
```
POST /publish-scheduled-post
Authorization: Bearer <CRON_SECRET>
Body: { "postId": "..." }
```

## Testing

### Test Retry Logic
```typescript
// Simulate network error
const result = await publishWithRetry(
  async () => {
    throw new Error('ECONNRESET');
  },
  { maxRetries: 3 }
);
// Should retry 3 times before failing
```

### Test Scheduled Post
1. Create scheduled post via API
2. Wait for publish time (or manually trigger)
3. Check status in database
4. Verify WordPress post created

## Error Handling

### Retryable Errors
- Network errors (ECONNRESET, ETIMEDOUT)
- Rate limits (429)
- Server errors (500, 502, 503)
- Timeout errors

### Non-Retryable Errors
- Authentication failures (401)
- Not found (404)
- Validation errors (400)
- Permission errors (403)

## Status Flow

```
scheduled → publishing → published
                ↓
             failed (with error message)
                ↓
         retryFailedPublish → scheduled
```

---

**Status**: ✅ Core improvements complete  
**Remaining**: Cron setup, UI improvements, testing


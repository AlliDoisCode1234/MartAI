# Action Cache Integration - DIY Instructions

## Overview

You're integrating `@convex-dev/action-cache` to cache expensive AI operations and reduce OpenAI costs by 60-80%.

---

## Step 1: Install Package

```bash
npm install @convex-dev/action-cache
```

---

## Step 2: Register Component

**File**: `convex/convex.config.ts`

```typescript
import { defineApp } from "convex/server";
import rateLimiter from "@convex-dev/rate-limiter/convex.config.js";
import actionCache from "@convex-dev/action-cache/convex.config.js";

const app = defineApp();
app.use(rateLimiter);
app.use(actionCache);

export default app;
```

---

## Step 3: Create Cache Configuration

**File**: `convex/cache.ts` (NEW FILE)

```typescript
import { ActionCache } from "@convex-dev/action-cache";
import { components } from "./_generated/api";

// Cache TTLs in milliseconds
export const CACHE_TTL = {
  BRIEF_GENERATION: 7 * 24 * 60 * 60 * 1000, // 7 days
  DRAFT_GENERATION: 3 * 24 * 60 * 60 * 1000, // 3 days
  KEYWORD_CLUSTERING: 30 * 24 * 60 * 60 * 1000, // 30 days
  SERP_ANALYSIS: 24 * 60 * 60 * 1000, // 24 hours
  QUARTERLY_PLANNING: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export const cache = new ActionCache(components.actionCache);

// Helper to generate cache keys
export function getCacheKey(operation: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);
  
  return `${operation}:${JSON.stringify(sortedParams)}`;
}
```

---

## Step 4: Add Caching to Brief Generation

**File**: `convex/content/briefActions.ts`

Add imports at the top:
```typescript
import { cache, getCacheKey, CACHE_TTL } from "../cache";
```

Modify the `generateBrief` handler (after rate limit check, before generating):

```typescript
// Generate cache key based on cluster and project
const cacheKey = getCacheKey("generateBrief", {
  clusterId: args.clusterId,
  projectId: args.projectId,
});

// Try to get from cache
const cached = await cache.get(ctx, cacheKey);
if (cached) {
  console.log("Cache hit for brief generation");
  await ctx.runMutation((api as any).content.briefs.updateBrief, {
    briefId: args.briefId,
    ...cached,
    status: "in_progress",
  });
  return { success: true, cached: true };
}

console.log("Cache miss for brief generation");
```

After generating the brief details, add:
```typescript
// Store in cache
await cache.set(ctx, cacheKey, details, CACHE_TTL.BRIEF_GENERATION);
```

---

## Step 5: Add Caching to Draft Generation

**File**: `convex/content/draftActions.ts`

Add imports:
```typescript
import { cache, getCacheKey, CACHE_TTL } from "../cache";
```

After getting the brief, add cache logic:

```typescript
// Generate cache key (include regeneration notes for cache busting)
const cacheKey = getCacheKey("generateDraft", {
  briefId: args.briefId,
  h2Outline: brief.h2Outline,
  regenerationNotes: args.regenerationNotes || "",
});

// Try cache (only if no regeneration notes)
const cached = await cache.get(ctx, cacheKey);
if (cached && !args.regenerationNotes) {
  console.log("Cache hit for draft generation");
  
  // Update or create draft with cached content
  if (existingDraft) {
    await ctx.runMutation((api as any).content.drafts.updateDraft, {
      draftId: existingDraft._id,
      ...cached,
      status: 'draft',
    });
  } else {
    await ctx.runMutation((api as any).content.drafts.createDraft, {
      briefId: args.briefId,
      projectId: brief.projectId,
      ...cached,
      status: 'draft',
    });
  }
  
  return {
    success: true,
    cached: true,
    ...cached,
  };
}

console.log("Cache miss for draft generation");
```

After generating the draft, add:
```typescript
// Cache the result
await cache.set(ctx, cacheKey, draftResult, CACHE_TTL.DRAFT_GENERATION);
```

---

## Step 6: Add Caching to Keyword Clustering

**File**: `convex/seo/keywordActions.ts`

Add imports:
```typescript
import { cache, getCacheKey, CACHE_TTL } from "../cache";
```

After getting keywords, before clustering:

```typescript
// Get keywords for cache key
const keywords = await ctx.runQuery(/* your existing query */);

// Generate cache key based on keyword set
const keywordHash = keywords
  .map((k: any) => k.keyword)
  .sort()
  .join(",");

const cacheKey = getCacheKey("generateClusters", {
  projectId: args.projectId,
  keywordHash,
});

// Try cache
const cached = await cache.get(ctx, cacheKey);
if (cached) {
  console.log("Cache hit for keyword clustering");
  // Create clusters from cached data
  for (const cluster of cached.clusters) {
    await ctx.runMutation((api as any).seo.keywordClusters.createCluster, cluster);
  }
  return { success: true, count: cached.clusters.length, cached: true };
}

console.log("Cache miss for keyword clustering");
```

After generating clusters, add:
```typescript
// Cache the result
await cache.set(ctx, cacheKey, { clusters }, CACHE_TTL.KEYWORD_CLUSTERING);
```

---

## Step 7: Add Caching to Quarterly Planning

**File**: `convex/content/quarterlyPlanActions.ts`

Add imports:
```typescript
import { cache, getCacheKey, CACHE_TTL } from "../cache";
```

After getting clusters, before generating plan:

```typescript
// Generate cache key
const cacheKey = getCacheKey("generatePlan", {
  projectId: args.projectId,
  contentVelocity: args.contentVelocity,
  clusterCount: clusters.length,
});

// Try cache
const cached = await cache.get(ctx, cacheKey);
if (cached) {
  console.log("Cache hit for quarterly planning");
  const planId = await ctx.runMutation(
    (api as any).content.quarterlyPlans.createQuarterlyPlan,
    {
      ...args,
      assumptions: cached.assumptions,
      goals: cached.goals,
    }
  );
  return { success: true, planId, cached: true, ...cached };
}

console.log("Cache miss for quarterly planning");
```

After generating assumptions, add:
```typescript
// Cache the result
await cache.set(
  ctx,
  cacheKey,
  { assumptions, goals },
  CACHE_TTL.QUARTERLY_PLANNING
);
```

---

## Step 8: Deploy and Test

```bash
# Deploy to Convex
npx convex dev --once

# If successful, test in the app:
# 1. Generate a brief
# 2. Delete the brief
# 3. Generate the same brief again
# 4. Check Convex logs for "Cache hit" message
```

---

## Step 9: Update Frontend (Optional)

Show cache status to users in `app/content/page.tsx`:

```typescript
const result = await generateBriefAction({ briefId, projectId, clusterId });

if (result.cached) {
  alert('Brief generated (from cache) - instant!');
} else {
  alert('Brief generated successfully!');
}
```

---

## Verification Checklist

- [ ] Package installed
- [ ] `convex.config.ts` updated
- [ ] `convex/cache.ts` created
- [ ] Brief generation cached
- [ ] Draft generation cached
- [ ] Keyword clustering cached
- [ ] Quarterly planning cached
- [ ] `npx convex dev --once` succeeds
- [ ] Test cache hit (generate same content twice)
- [ ] Check Convex logs for cache messages

---

## Troubleshooting

**Build fails with "Cannot find module '@convex-dev/action-cache'"**
- Run `npm install` again
- Delete `node_modules` and run `npm install`

**TypeScript errors on `components.actionCache`**
- Run `npx convex dev --once` to regenerate types
- The component must be registered in `convex.config.ts` first

**Cache not working (always cache miss)**
- Check cache key generation - params must be identical
- Check Convex logs for error messages
- Verify TTL is not 0

**Want to clear cache manually**
- In Convex dashboard, go to the `actionCache` component tables
- Delete entries manually or wait for TTL expiration

---

## Expected Results

After implementation:
- ✅ First generation: "Cache miss" in logs, normal speed
- ✅ Second generation (same params): "Cache hit" in logs, instant response
- ✅ 60-80% reduction in OpenAI API calls over time
- ✅ 10x faster responses for cached operations
- ✅ No quality degradation

---

## Next Steps After Completion

1. Monitor cache hit rates in Convex dashboard
2. Adjust TTLs based on usage patterns
3. Add cache invalidation if needed
4. Track cost savings in OpenAI dashboard
5. Test rate limiting (see `docs/tickets/TICKET-RATE-LIMIT-TESTING.md`)

---

## Files to Reference

- Implementation Plan: `.gemini/antigravity/brain/.../implementation_plan.md`
- Rate Limit Testing: `docs/tickets/TICKET-RATE-LIMIT-TESTING.md`
- Workflows Guide: `docs/WORKFLOWS.md`

Good luck! 🚀

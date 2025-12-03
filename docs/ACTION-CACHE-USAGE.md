# Action Cache Usage Guide

## Problem Explanation

The error "Expected 2 arguments, but got 1" occurred because the `ActionCache` constructor requires **two arguments**:

1. **Component reference**: `components.actionCache`
2. **Options object** containing:
   - `action`: The internal action to cache (required)
   - `name`: Identifier for the cache (optional)
   - `ttl`: Time-to-live in milliseconds (optional)

## Solution

The `cache.ts` file has been updated to export the component reference instead of creating a generic cache instance. You'll create specific cache instances in the files where you define the actions you want to cache.

## How to Use ActionCache

### Step 1: Define an Internal Action

First, create an internal action that performs an expensive operation:

```typescript
// convex/myActions.ts
import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const myExpensiveAction = internalAction({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    // Expensive operation (API call, complex computation, etc.)
    const result = await someExpensiveOperation(text);
    return result;
  },
});
```

### Step 2: Create a Cache Instance

Create an `ActionCache` instance for that specific action:

```typescript
// convex/myActions.ts
import { ActionCache, actionCacheComponent, CACHE_TTL } from "./cache";
import { internal } from "./_generated/api";

const myCache = new ActionCache(actionCacheComponent, {
  action: internal.myActions.myExpensiveAction,
  name: "myExpensiveAction-v1", // Optional: version identifier
  ttl: CACHE_TTL.BRIEF_GENERATION, // Optional: 7 days
});
```

### Step 3: Use the Cache

Use the cache in your public action or query:

```typescript
// convex/myActions.ts
import { action } from "./_generated/server";

export const myPublicAction = action({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    // This will cache the result based on the args
    const result = await myCache.fetch(ctx, { text: args.text });
    return result;
  },
});
```

## Complete Example

Here's a complete example for caching brief generation:

```typescript
// convex/content/briefActions.ts
import { action, internalAction } from "../_generated/server";
import { ActionCache, actionCacheComponent, CACHE_TTL } from "../cache";
import { internal } from "../_generated/api";
import { v } from "convex/values";

// Internal action that does the expensive work
export const generateBriefInternal = internalAction({
  args: { 
    keyword: v.string(),
    projectId: v.id("projects")
  },
  handler: async (ctx, args) => {
    // Expensive AI operation
    const brief = await generateBriefWithAI(args.keyword);
    return brief;
  },
});

// Create cache instance
const briefCache = new ActionCache(actionCacheComponent, {
  action: internal.content.briefActions.generateBriefInternal,
  name: "brief-generation-v1",
  ttl: CACHE_TTL.BRIEF_GENERATION, // 7 days
});

// Public action that uses the cache
export const generateBrief = action({
  args: { 
    keyword: v.string(),
    projectId: v.id("projects")
  },
  handler: async (ctx, args) => {
    // This will return cached result if available
    const brief = await briefCache.fetch(ctx, args);
    return brief;
  },
});
```

## Key Points

- Each `ActionCache` instance is tied to a **specific action**
- The cache key is automatically generated from the arguments
- Use `ttl` to set expiration time (optional)
- Use `name` to version your cache (useful when changing the action logic)
- The `getCacheKey` helper in `cache.ts` is available if you need custom cache key generation

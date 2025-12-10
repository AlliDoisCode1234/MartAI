---
description: Investigate and fix performance issues
---

# Performance Investigation Workflow

## When to Use

- Slow page loads
- Laggy UI interactions
- High API latency
- Timeout errors
- Memory issues

## Phase 1: Identify the Bottleneck

### Frontend vs Backend?

```typescript
// Add timing to suspect component
console.time('ComponentRender');
// ... component logic
console.timeEnd('ComponentRender');
```

Check Network tab:

- Slow queries? → Backend
- Fast queries, slow render? → Frontend

### Convex Query Performance

```typescript
// In query handler, add timing
console.time('queryName');
const result = await ctx.db.query('table').collect();
console.timeEnd('queryName');
```

Check Convex dashboard Logs tab.

## Phase 2: Common Issues

### Frontend

| Issue                | Symptom             | Fix               |
| -------------------- | ------------------- | ----------------- |
| Too many re-renders  | Laggy typing/clicks | Memoize, use refs |
| Large component tree | Slow initial load   | Code splitting    |
| Unoptimized images   | Slow page load      | Use Next/Image    |
| Memory leak          | Increasing RAM      | Clean up effects  |

### Backend (Convex)

| Issue              | Symptom              | Fix                 |
| ------------------ | -------------------- | ------------------- |
| Missing index      | Slow queries         | Add index to schema |
| N+1 queries        | Multiple round trips | Batch or join data  |
| Large result sets  | Timeout              | Pagination, limit   |
| Expensive AI calls | Long waits           | Cache results       |

## Phase 3: Fixes

### Add Missing Index

```typescript
// convex/schema.ts
keywords: defineTable({
  projectId: v.id('projects'),
  keyword: v.string(),
}).index('by_project', ['projectId']); // ADD THIS
```

### Use Action Cache

```typescript
import { actionCache } from '../index';

export const expensiveAction = action({
  handler: async (ctx, args) => {
    return await actionCache.fetch(ctx, 'cache-key', async () => {
      // expensive operation
    });
  },
});
```

### Paginate Large Results

```typescript
export const getItems = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db.query('items').paginate(args.paginationOpts);
  },
});
```

## Phase 4: Verify

- Re-measure timing
- Compare before/after
- Monitor in production

---

## Quick Checks

```bash
# Check bundle size
npm run build
# Look at output sizes

# Check for unused deps
npx depcheck
```

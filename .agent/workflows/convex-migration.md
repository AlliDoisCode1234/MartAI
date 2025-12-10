---
description: Schema changes with data migration for Convex
---

# Convex Migration Workflow

## When to Use

- Adding required fields to existing tables
- Renaming fields
- Changing field types
- Restructuring data

## The Safe Pattern

### Phase 1: Add New (Optional)

```typescript
// convex/schema.ts
users: defineTable({
  name: v.string(),
  email: v.optional(v.string()), // NEW - optional first
});
```

```bash
npx convex dev --once
```

### Phase 2: Backfill Data

```typescript
// convex/migrations.ts
export const backfillEmails = mutation({
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    for (const user of users) {
      if (!user.email) {
        await ctx.db.patch(user._id, {
          email: `${user.name}@placeholder.com`, // or derive from data
        });
      }
    }
    return { updated: users.length };
  },
});
```

Run in dashboard or via script.

### Phase 3: Make Required

```typescript
// After ALL records have the field
users: defineTable({
  name: v.string(),
  email: v.string(), // Now required
});
```

```bash
npx convex dev --once
```

### Phase 4: Update Code

- Update all queries/mutations to use new field
- Remove fallback handling

---

## Field Rename Pattern

1. Add new field (optional)
2. Backfill from old field
3. Update code to use new field
4. Remove old field from schema

---

## Dangerous Operations

> [!CAUTION]
> These can cause data loss:
>
> - Removing fields with data
> - Changing field types incompatibly
> - Dropping tables

Always:

1. Backup data first (export from dashboard)
2. Test on dev deployment
3. Have rollback plan

---

## Quick Reference

```bash
# After schema change
npx convex dev --once

# Run migration
npx convex run migrations:backfillEmails

# Check data
# Use Convex dashboard Data tab
```

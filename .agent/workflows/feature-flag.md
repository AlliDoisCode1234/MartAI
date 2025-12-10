---
description: Safely ship new features with feature flags
---

# Feature Flag Workflow

## When to Use

- New user-facing features that might need rollback
- Experimental features for testing
- Gradual rollout to user segments
- A/B testing

## Implementation Pattern

### 1. Add Flag to User/Project

```typescript
// In convex/schema.ts, add to relevant table
featureFlags: v.optional(v.object({
  newFeatureName: v.optional(v.boolean()),
})),
```

### 2. Create Flag Check Helper

```typescript
// lib/featureFlags.ts
export function hasFeature(
  user: { featureFlags?: { [key: string]: boolean } } | null,
  feature: string
): boolean {
  return user?.featureFlags?.[feature] === true;
}
```

### 3. Use in Components

```tsx
const { user } = useAuth();

{
  hasFeature(user, 'newDashboard') && <NewDashboard />;
}
```

### 4. Admin Toggle (optional)

Add to admin portal to enable/disable per user.

## Rollout Stages

1. **Dev only**: Enable for your user ID
2. **Internal**: Enable for admin users
3. **Beta**: Enable for opted-in users
4. **GA**: Enable for all, remove flag

## Cleanup

After GA:

1. Remove flag checks from code
2. Remove flag from schema
3. Deploy

---

## Quick Rollback

```typescript
// In Convex dashboard or admin mutation
await ctx.db.patch(userId, {
  featureFlags: { ...user.featureFlags, newFeature: false },
});
```

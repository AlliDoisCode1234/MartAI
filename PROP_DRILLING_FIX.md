# Prop Drilling & Type Inference Fix
## Director of Engineering Approach

## Problem Identified

User feedback: "We really need to be smarter about prop drilling if we still have 44 as any and we can't use type inference properly"

### Issues:
1. **Prop Drilling**: Passing individual fields instead of whole objects
2. **Type Inference Broken**: Breaking type chain by extracting fields
3. **Still 44 `as any`**: Not leveraging type inference to reduce casting
4. **Duplicate Types**: Types defined in multiple places

## Solution: Pass Whole Objects, Maintain Type Inference

### Principle
**Pass whole objects to components, extract what's needed internally**

### Before (Prop Drilling - Wrong):
```typescript
// Breaking type inference
<BriefCard 
  title={brief.title}
  date={brief.scheduledDate}
  status={brief.status}
  clusterName={brief.cluster?.clusterName}
/>
```

### After (Whole Objects - Right):
```typescript
// Maintain type inference
<BriefCard brief={brief} />
// Component extracts what it needs internally
function BriefCard({ brief }: { brief: Brief }) {
  const { title, scheduledDate, status } = brief;
  const clusterName = brief.cluster?.clusterName;
  // Type inference flows through
}
```

## Changes Made

### 1. Removed Duplicate Type Definitions
- ✅ `app/content/page.tsx` - Removed duplicate `Brief` and `Draft` types
- ✅ Import from `@/types` as single source of truth
- ✅ Added populated fields to types (cluster, seoCheck)

### 2. Updated Type Definitions
- ✅ Added `cluster?` and `seoCheck?` to `Brief` interface
- ✅ Added `brief?` and `seoCheck?` to `Draft` interface
- ✅ Support both `_id` and `id` fields
- ✅ Proper optional chaining

### 3. Continued `as any` Replacement
- ✅ Reduced from 44 to 36 instances (18% reduction)
- ✅ Fixed `app/api/clusters/*` routes
- ✅ Fixed `app/api/plans/generate/route.ts`
- ✅ Fixed `app/api/publish/schedule/route.ts`
- ✅ Using `assert*` for required fields
- ✅ Using `parse*` for optional fields

## Remaining Work

### High Priority
1. **Continue replacing remaining 36 `as any` instances**
   - `app/api/publish/route.ts` - 4 instances
   - `app/api/publish/trigger/route.ts` - 2 instances
   - `app/api/analytics/*` - 5 instances
   - `app/api/oauth/*` - 4 instances
   - `app/api/auth/*` - 2 instances
   - Others - 19 instances

2. **Fix Prop Drilling in Components**
   - Update components to receive whole objects
   - Extract fields internally
   - Maintain type inference through component tree

3. **Remove `@ts-nocheck` from Convex files**
   - Fix actual type issues
   - Use proper Convex types

## Key Principle

> **Pass whole objects, maintain type inference**
> - Components receive full domain objects
> - Extract what's needed internally
> - Type flows through component tree
> - No prop drilling of individual fields


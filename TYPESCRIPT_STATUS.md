# TypeScript Refactoring Status
## Director of Engineering Review - Current State

## ✅ Completed

1. **Created `lib/typeGuards.ts`**
   - `assert*` functions that validate and throw (no null returns for required fields)
   - `parse*` functions that return null ONLY for truly optional schema fields
   - Validates Convex ID format: `tableName_xxxxx`
   - Type guaranteed after assertion

2. **Created `types/index.ts`**
   - Centralized type definitions
   - Single source of truth
   - Component prop types for whole objects
   - Proper Convex ID type handling

3. **Updated `lib/convexClient.ts`**
   - Generic type parameters for type safety
   - Proper error handling

4. **Refactored `app/api/competitors/route.ts`**
   - Replaced all `as any` with `assertProjectId`, `assertCompetitorId`
   - Types reflect reality after validation

5. **Started refactoring `app/api/briefs/route.ts`**
   - Using `assertBriefId` for required fields
   - Using `parseClusterId` for optional fields
   - Fixed api import issues

## 🔄 In Progress

1. **Replace remaining `as any` in API routes** (~100+ instances remaining)
   - High priority: `app/api/analytics/sync/route.ts` (8 instances)
   - High priority: `app/api/drafts/route.ts` (6 instances)
   - High priority: `app/api/drafts/generate/route.ts` (4 instances)
   - All other API routes need systematic replacement

2. **Update components to receive whole objects**
   - `src/components/DraggableBriefList.tsx` - started
   - `app/strategy/page.tsx` - needs full refactor
   - `app/content/page.tsx` - needs full refactor
   - All other components

3. **Remove duplicate type definitions**
   - Brief, KeywordCluster, Draft, QuarterlyPlan defined in multiple places
   - Import from `@/types` instead

## ⏳ Pending

1. **Remove `@ts-nocheck` from Convex files**
   - Fix actual type issues
   - Use proper Convex types
   - 7 files with `@ts-nocheck`

2. **Fix Brief type consistency**
   - Support both `_id` and `id` fields
   - Update all usages

3. **Add runtime validation**
   - ID format validation
   - Type guards at API boundaries

## Key Principles Established

1. **Types reflect reality, not convenience**
   - If API validates and returns 400, field is REQUIRED
   - After validation, type is guaranteed (no null)
   - Only use `| null` when schema has `v.optional()`

2. **Validate at boundaries, guarantee after**
   - API routes validate input
   - Type guards throw on invalid, narrow on valid
   - After assertion, type is guaranteed

3. **Pass whole objects, maintain inference**
   - Components receive full domain objects
   - Don't destructure and pass individual fields
   - Type flows through component tree

4. **No `as any`, no `@ts-nocheck`**
   - Fix root cause, don't suppress
   - Use proper Convex types
   - Type guards handle validation

## Next Steps

1. Systematically replace all `as any` in remaining API routes
2. Update all components to receive whole objects
3. Remove duplicate type definitions
4. Remove `@ts-nocheck` from Convex files
5. Add comprehensive type tests


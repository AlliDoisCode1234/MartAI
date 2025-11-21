# TypeScript Refactoring Plan
## Making MartAI Type-Safe and DRY

## Issues Found

### 1. Excessive `as any` Usage (106 instances across 58 files)
- **Primary Issue**: Convex ID type casting with `as any`
- **Location**: All API routes, especially when passing IDs to Convex
- **Impact**: Loss of type safety, potential runtime errors

### 2. Duplicate Type Definitions
- `Brief` defined in: `app/strategy/page.tsx`, `app/content/page.tsx`, `src/components/DraggableBriefList.tsx`
- `KeywordCluster` defined in: `app/strategy/page.tsx`, multiple lib files
- `Draft` defined in: `app/content/page.tsx`
- `QuarterlyPlan` defined in: `app/strategy/page.tsx`, `lib/quarterlyPlanning.ts`

### 3. `@ts-nocheck` in Convex Files (7 files)
- All Convex backend files have `@ts-nocheck`
- Prevents type checking on backend logic

### 4. Component Props Not Passing Whole Objects
- Components receive individual props instead of whole objects
- Breaks type inference chain
- Example: `DraggableBriefList` receives `briefs: Brief[]` but should receive `plan: QuarterlyPlan`

## Solution Strategy

### Phase 1: Centralized Types ✅
- Created `types/index.ts` with all domain types
- Created `lib/types.ts` with type-safe ID conversion helpers
- Updated `lib/convexClient.ts` with generic type parameters

### Phase 2: Replace `as any` with Type Helpers
- Use `requireProjectId()`, `requireBriefId()`, etc. instead of `as any`
- Systematic replacement across all API routes
- Maintain type safety throughout

### Phase 3: Remove Duplicate Type Definitions
- Import from `@/types` instead of defining inline
- Update all components and pages
- Single source of truth

### Phase 4: Pass Whole Objects to Components
- Update component props to accept whole objects
- Maintain type inference through component tree
- Example: `<BriefCard brief={brief} />` instead of `<BriefCard title={brief.title} date={brief.scheduledDate} />`

### Phase 5: Remove `@ts-nocheck` Where Possible
- Fix type issues in Convex files
- Use proper Convex types from `_generated`
- Keep `@ts-nocheck` only where absolutely necessary

## Implementation Order

1. ✅ Create centralized types file
2. ✅ Create type-safe ID helpers
3. 🔄 Replace `as any` in API routes (in progress)
4. ⏳ Update components to use centralized types
5. ⏳ Refactor components to pass whole objects
6. ⏳ Remove `@ts-nocheck` from Convex files
7. ⏳ Add type guards and validation

## Files to Refactor

### High Priority (Most `as any` usage)
- `app/api/analytics/sync/route.ts` - 8 instances
- `app/api/drafts/route.ts` - 6 instances
- `app/api/drafts/generate/route.ts` - 4 instances
- `app/api/briefs/route.ts` - 3 instances
- `app/api/publish/now/route.ts` - 3 instances
- `app/api/publish/schedule/route.ts` - 3 instances

### Medium Priority (Component refactoring)
- `src/components/DraggableBriefList.tsx` - Use centralized Brief type
- `app/strategy/page.tsx` - Use centralized types, pass whole objects
- `app/content/page.tsx` - Use centralized types
- `app/analytics/page.tsx` - Use centralized types

### Low Priority (Cleanup)
- Remove duplicate type definitions
- Add JSDoc comments to types
- Create type guard functions
- Add runtime validation

## Type Safety Goals

1. **Zero `as any` casts** - Use type helpers instead
2. **Single source of truth** - All types in `types/index.ts`
3. **Full type inference** - Pass whole objects, not individual props
4. **Runtime safety** - Type guards and validation
5. **DRY principle** - No duplicate type definitions


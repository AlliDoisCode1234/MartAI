# LDD: Unified Loading State Architecture

## Problem Statement

The codebase has inconsistent handling of loading states, empty states, and skeletons across pages. This leads to:

- Flash of wrong content during auth/data loading
- Inconsistent user experience across pages
- Duplicated loading patterns in each page
- No standardized skeleton/empty state usage

## Current State Audit

### Existing Shared Components (✅ Good)

| Component      | Location                             | Theme Support | Usage                 |
| -------------- | ------------------------------------ | ------------- | --------------------- |
| `LoadingState` | `src/components/shared/LoadingState` | Light only    | Spinner + message     |
| `EmptyState`   | `src/components/shared/EmptyState`   | Light + Dark  | Icon + title + CTA    |
| `ErrorState`   | `src/components/shared/ErrorState`   | Light only    | Alert + action button |

### Existing Skeleton Components

| Component              | Location                       | Theme |
| ---------------------- | ------------------------------ | ----- |
| `StrategySkeleton`     | `src/components/strategy/`     | Dark  |
| `DashboardSkeleton`    | `src/components/dashboard/`    | Light |
| `ContentSkeleton`      | `src/components/content/`      | Light |
| `PublishSkeleton`      | `src/components/publish/`      | Dark  |
| `AnalyticsSkeleton`    | `src/components/analytics/`    | Light |
| `CompetitorsSkeleton`  | `src/components/competitors/`  | Light |
| `IntegrationsSkeleton` | `src/components/integrations/` | Light |
| `ApplySkeleton`        | `src/components/apply/`        | Light |

### Pages with `useQuery` (Need Loading States)

Found **50+ useQuery calls** across **20+ pages**:

| Page                | Queries | Current Loading Handling |
| ------------------- | ------- | ------------------------ |
| `/dashboard`        | 1       | Custom inline            |
| `/studio/strategy`  | 4       | StrategySkeleton ✅      |
| `/studio/insights`  | 2       | Custom guards ✅         |
| `/studio/calendar`  | 2       | None ❌                  |
| `/studio/library`   | 1       | None ❌                  |
| `/studio/create`    | 1       | None ❌                  |
| `/content`          | 1       | Inline check             |
| `/calendar`         | 1       | Inline check             |
| `/competitors`      | 2       | CompetitorsSkeleton ✅   |
| `/admin/page`       | 1       | None ❌                  |
| `/admin/users`      | 1       | Custom inline            |
| `/admin/users/[id]` | 3       | Custom inline            |
| `/onboarding`       | 0       | Guards ✅                |

---

## Proposed Solution: Unified State Pattern

### 1. State Hierarchy (Every Page)

```
┌─────────────────────────────────────────┐
│  1. Auth Guard                          │
│     if (authLoading) → FullPageLoader   │
│     if (!user) → Redirect to /login     │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│  2. Data Loading Guard                  │
│     if (data === undefined) → Skeleton  │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│  3. Empty State Guard                   │
│     if (data.length === 0) → EmptyState │
└───────────────┬─────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│  4. Main Content                        │
│     Render actual UI                    │
└─────────────────────────────────────────┘
```

### 2. Enhanced Shared Components

#### A. Update `LoadingState` for Dark Theme

```typescript
type Props = {
  message?: string;
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark'; // NEW
};
```

#### B. Update `ErrorState` for Dark Theme

```typescript
type Props = {
  // ... existing
  theme?: 'light' | 'dark'; // NEW
};
```

#### C. Create `PageGuard` Utility Hook

```typescript
// src/lib/hooks/usePageGuard.ts
export function usePageGuard(options: { requireAuth?: boolean; requireProject?: boolean }) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { projectId, isLoading: projectLoading } = useProject();

  return {
    isLoading: authLoading || (options.requireProject && projectLoading),
    shouldRedirect: options.requireAuth && !isAuthenticated,
    redirectTo: '/auth/login',
    hasAccess: isAuthenticated && (!options.requireProject || projectId),
  };
}
```

### 3. Implementation Phases

#### Phase 1: Enhance Shared Components (3 pts)

- Add `theme` prop to `LoadingState`
- Add `theme` prop to `ErrorState`
- Export all from `@/src/components/shared`

#### Phase 2: Create Page Guard Hook (2 pts)

- Create `usePageGuard` hook
- Handle auth + project loading in one place

#### Phase 3: Migrate Priority Pages (5 pts)

| Priority | Page          | Change                          |
| -------- | ------------- | ------------------------------- |
| P0       | `/onboarding` | Already fixed ✅                |
| P0       | `/dashboard`  | Add guards + DashboardSkeleton  |
| P0       | `/studio/*`   | Consistent dark theme skeletons |
| P1       | `/admin/*`    | Add guards + admin skeleton     |
| P2       | `/settings`   | Add guards                      |

#### Phase 4: Audit Remaining Pages (3 pts)

- Review all pages for consistent pattern
- Add skeletons where missing

---

## Verification Plan

### Automated

```bash
# No TypeScript errors
npx tsc --noEmit

# No missing loading states (grep audit)
grep -r "useQuery" app/ --include="*.tsx" | wc -l
# Should match documented pages
```

### Manual

1. Navigate to each page as logged-out user → Should redirect
2. Navigate as new user (no data) → Should show empty state
3. Navigate with data → Should show content
4. Refresh mid-load → Should show skeleton, not flash

---

## Success Metrics

| Metric                    | Before | After   |
| ------------------------- | ------ | ------- |
| Pages with proper guards  | 3/20   | 20/20   |
| Consistent skeleton usage | No     | Yes     |
| Flash of wrong content    | Common | Never   |
| Time to audit new page    | N/A    | < 5 min |

---

## Files to Modify

### Phase 1: Shared Components

- `src/components/shared/LoadingState/index.tsx` - Add theme prop
- `src/components/shared/ErrorState/index.tsx` - Add theme prop

### Phase 2: Hook

- `src/lib/hooks/usePageGuard.ts` [NEW]

### Phase 3: Priority Pages

- `app/dashboard/page.tsx`
- `app/studio/calendar/page.tsx`
- `app/studio/library/page.tsx`
- `app/studio/create/page.tsx`
- `app/admin/page.tsx`

---

## Risks & Mitigations

| Risk                         | Mitigation                          |
| ---------------------------- | ----------------------------------- |
| Breaking existing pages      | Incremental rollout, test each page |
| Dark/light theme mismatch    | Use `theme` prop consistently       |
| Performance impact of guards | Guards are O(1), negligible         |

---

## Acceptance Criteria

- [ ] All pages have 3-layer guards (auth → loading → empty)
- [ ] Consistent skeleton usage matching page theme
- [ ] No flash of wrong content on any page
- [ ] Shared components support dark theme
- [ ] `usePageGuard` hook simplifies auth checks

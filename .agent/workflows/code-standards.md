---
description: Pre-flight checklist before writing or committing any code
---

# Code Standards Checklist

**Run this checklist BEFORE writing any new component or file.**

## Component Structure

// turbo-all

- [ ] **One component per file** - If you're defining multiple components, STOP and split them
- [ ] **Props type named `Props`** - Not ComponentNameProps, just `Props`
- [ ] **Component hierarchy comment** at top of every component file:
  ```tsx
  /**
   * ComponentName
   *
   * Component Hierarchy:
   * App → Parent → ThisComponent
   */
  ```

## Reusability

- [ ] **Constants extracted** - No inline magic strings/numbers, use `lib/constants/`
- [ ] **Types extracted** - Shared types go in `types/` directory
- [ ] **Utils extracted** - Helper functions go in `lib/utils/`
- [ ] **DRY check** - Does similar code exist elsewhere? Reuse it.

## Data Handling

- [ ] **Pass whole objects down** - Destructure in child, not parent
- [ ] **Never return more data than UI needs** - Filter in backend
- [ ] **Sanitize input and output** - Browser is hostile environment

## Security

- [ ] **No private data exposed** - Check what's returned from queries
- [ ] **No emojis in code** - Use icons from icon library
- [ ] **Auth checks present** - All mutations/queries start with auth check

## Before Committing

1. Run `npx tsc --noEmit --skipLibCheck`
2. Check file line count - if >200 lines, consider splitting
3. Review imports - are they from shared locations?
4. Check for `as any` - if present, is it documented and justified?

## Quick Reference

| Type       | Location               |
| ---------- | ---------------------- |
| Constants  | `lib/constants/`       |
| Types      | `types/`               |
| Utils      | `lib/utils/`           |
| Hooks      | `hooks/`               |
| Components | `components/{domain}/` |

## Violation Examples

**BAD** (multiple components):

```tsx
function HelperCard() { ... }
function MainCard() { ... }
export default function Page() { ... }
```

**GOOD** (one per file):

```tsx
// components/cards/HelperCard.tsx
export function HelperCard() { ... }

// page.tsx
import { HelperCard } from '@/components/cards/HelperCard';
export default function Page() { ... }
```

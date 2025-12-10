---
description: Self-review checklist before committing code
---

# Code Review Workflow

## Before Every Commit

Run through this checklist to catch issues before they reach the repo.

### 1. Type Safety Check

```bash
npx tsc --noEmit --skipLibCheck
```

- [ ] No TypeScript errors
- [ ] No `as any` without justification comment
- [ ] No implicit `any` parameters

### 2. Build Check

```bash
npm run build
```

- [ ] Build succeeds
- [ ] No warnings worth addressing

### 3. Code Quality

- [ ] **DRY**: No duplicated logic (extract to helper/hook)
- [ ] **Single Responsibility**: Each function does one thing
- [ ] **Naming**: Variables/functions clearly describe purpose
- [ ] **Comments**: Complex logic is explained

### 4. Convex Specific

- [ ] Ran `npx convex dev --once` after schema changes
- [ ] Mutations/queries have proper validation
- [ ] No sensitive data in logs
- [ ] Rate limits on expensive operations

### 5. Component Standards

- [ ] One component per file
- [ ] `Props` interface named `Props`
- [ ] Component hierarchy comment at top
- [ ] No inline styles (use design system)

### 6. Security

- [ ] No secrets in code
- [ ] Inputs validated/sanitized
- [ ] Auth checks on protected routes
- [ ] CSRF tokens on state-changing operations

### 7. Commit Message

```bash
git commit -m "type(scope): description"
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`

---

## Quick Version

```bash
# Run before committing
npx tsc --noEmit --skipLibCheck && npm run build
```

If both pass, you're probably good!

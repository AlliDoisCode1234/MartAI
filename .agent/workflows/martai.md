---
description: Comprehensive MartAI development workflow - refresh context, research, plan, implement, verify
---

# MartAI Development Workflow

## Overview

This workflow ensures systematic, high-quality development on the MartAI codebase. It builds context progressively and uses all available tools to deliver DRY, scalable, testable solutions.

**Core Principle**: UNDERSTAND BEFORE CHANGING. Never make changes without first understanding the current state, patterns, and dependencies.

---

## The Iron Laws

1. **NO CHANGES WITHOUT CONTEXT** - Always refresh understanding of affected code before editing
2. **CONVEX FIRST** - Run `npx convex dev --once` after schema changes (PowerShell hates `&&`)
3. **ONE COMPONENT PER FILE** - Modular, reusable, with hierarchy comments
4. **PROPS = Props** - Use `Props` nomenclature, pass whole objects down
5. **DRY EVERYTHING** - Extract, reuse, modularize

---

## Phase 0: Context Refresh (ALWAYS DO THIS FIRST)

Before ANY work, refresh your understanding:

### Step 0.1: Check Project State

```
View: PROJECT_STATUS.md
View: ROADMAP.md
```

- What phase are we in?
- What was recently completed?
- What's the current focus?

### Step 0.2: Check Convex Components

```
List: convex/convex.config.ts
List: convex/index.ts
```

- What Convex components are installed?
- @convex-dev/auth, @convex-dev/rate-limiter, @convex-dev/action-cache, @convex-dev/workflow
- Can any help with this task?

### Step 0.3: Understand Schema

```
View: convex/schema.ts (relevant tables)
```

- What tables are involved?
- What are the relationships?
- What fields exist?

### Step 0.4: Check Related Code

```
Search for existing patterns
Find similar implementations
```

- Is there existing code that does something similar?
- What patterns are already established?
- Don't reinvent - reuse

---

## Phase 1: Planning

### Step 1.1: Define the Task

- What exactly needs to be done?
- What are the acceptance criteria?
- What could go wrong?

### Step 1.2: Research Best Practices

```
@web research if the proposed approach is optimal
```

- Is there a better pattern?
- What do the docs recommend?
- Are there Convex-specific solutions?

### Step 1.3: Create Implementation Plan

```
Write: implementation_plan.md
```

- Proposed changes by component
- Verification steps
- Rollback strategy

### Step 1.4: Self-Review the Plan

- Is this DRY?
- Is this scalable?
- Is this testable?
- Does this follow existing patterns?
- Could a Convex component solve this better?

---

## Phase 2: Implementation

### Step 2.1: Schema Changes (if any)

```
Edit: convex/schema.ts
Run: npx convex dev --once
```

- Add/modify tables
- Regenerate types
- NEVER skip the regeneration

### Step 2.2: Backend Changes

```
Edit: convex/*
```

- Actions, mutations, queries
- Follow existing patterns
- Use type-safe Convex patterns

### Step 2.3: Frontend Changes

```
Edit: app/*, src/components/*
```

- One component per file
- Add component hierarchy comment at top
- Use `Props` interface naming
- Pass whole objects, destructure in child

### Step 2.4: Component Hierarchy Comment Format

```typescript
/**
 * Component Hierarchy:
 * App > Layout > Dashboard > ThisComponent
 *
 * Props drilled from: Dashboard
 * Props passed to: ChildComponent
 */
interface Props {
  project: Project;
  // ...
}
```

---

## Phase 3: Verification

### Step 3.1: Type Check

```bash
npx tsc --noEmit
```

- Fix any type errors
- NO `as any` unless absolutely necessary (document why)

### Step 3.2: Build Check

```bash
npm run build
```

- Must pass before committing
- Fix any build errors

### Step 3.3: Dev Server Test

```bash
npm run dev
```

- Test the feature manually
- Check browser console for errors
- Verify the UI works as expected

### Step 3.4: Update Documentation

```
Update: PROJECT_STATUS.md (if significant)
Update: ROADMAP.md (if milestone completed)
```

---

## Phase 4: Commit & Push

### Step 4.1: Stage Changes

```bash
git add -A
```

### Step 4.2: Commit with Conventional Format

```bash
git commit -m "type(scope): description"
```

Types: feat, fix, refactor, docs, chore, test

### Step 4.3: Push

```bash
git push
```

---

## Red Flags - STOP and Follow Process

If you catch yourself:

- Editing code without viewing it first
- Making changes without understanding dependencies
- Skipping `npx convex dev --once` after schema changes
- Creating multiple components in one file
- Using `as any` without justification
- Not checking for existing patterns
- Proposing solutions without research

**STOP. Return to Phase 0.**

---

## Quick Reference

| Task                    | Command/Action                 |
| ----------------------- | ------------------------------ |
| Regenerate Convex types | `npx convex dev --once`        |
| Type check              | `npx tsc --noEmit`             |
| Build                   | `npm run build`                |
| Dev server              | `npm run dev`                  |
| Find patterns           | `grep_search` for similar code |
| Check schema            | `view convex/schema.ts`        |
| Check status            | `view PROJECT_STATUS.md`       |

---

## Convex Components Available

| Component                  | Purpose               | When to Use             |
| -------------------------- | --------------------- | ----------------------- |
| `@convex-dev/auth`         | Authentication        | User auth, sessions     |
| `@convex-dev/rate-limiter` | Rate limiting         | API abuse prevention    |
| `@convex-dev/action-cache` | Caching               | Expensive AI operations |
| `@convex-dev/workflow`     | Durable workflows     | Multi-step processes    |
| `@convex-dev/aggregate`    | Analytics aggregation | Counts, sums, metrics   |

**Always check if a Convex component can solve the problem before building custom.**

---

## Integration with Other Workflows

- **For bugs**: Use `/debugging-workflow` first
- **For features**: Use this workflow
- **For cleanup**: Use this workflow with focus on Phase 0 context gathering

---

## Growing Context Checklist

Each session, ensure you understand:

- [ ] Current phase (PROJECT_STATUS.md)
- [ ] Recent changes (git log -5)
- [ ] Active features (ROADMAP.md priorities)
- [ ] Schema structure (convex/schema.ts)
- [ ] Component patterns (src/components/)
- [ ] Convex components available (convex/convex.config.ts)

# MartAI Board Decisions Log

> **Purpose**: Track Board of Directors decisions for institutional memory.  
> **Format**: Each decision includes context, Board input, outcome, and lessons learned.  
> **Total Decisions**: 4 | **Success Rate**: 75% (3 ✅, 1 🔄)

---

## Quick Reference

| ID  | Decision                      | Date       | Domain      | Confidence | Status |
| --- | ----------------------------- | ---------- | ----------- | ---------- | ------ |
| #4  | Security Rules Implementation | 2024-12-13 | Security    | 0.95       | ✅     |
| #3  | Type Safety Guardrails        | 2024-12-10 | Engineering | 0.80       | 🔄     |
| #2  | `as any` Cleanup Approach     | 2024-12-10 | Type Safety | 0.85       | ✅     |
| #1  | Add THEO to Board             | 2024-12-10 | Engineering | 0.95       | ✅     |

---

## Decision #4: Security Rules Implementation

**Date**: 2024-12-13  
**Domain**: Security  
**Confidence**: 0.95  
**Related Files**: `docs/SECURITY_POLICY.md`, `.agent/workflows/security-rules.md`, `.agent/rules.md`

### Context

Security audit revealed 30+ unprotected mutations, data leakage through console.logs, and a backdoor endpoint (`createTestProject`). Need comprehensive security policy.

### Board Input

| Board Member    | Input                                                                           |
| --------------- | ------------------------------------------------------------------------------- |
| TYLER (CTO)     | "Security is non-negotiable. Defense in depth - every mutation needs auth."     |
| OSCAR (COO)     | "Rules must be documented, enforced in code review, and checked automatically." |
| KHANH (Dir Eng) | "Use existing RBAC helpers, never roll your own auth checks."                   |
| SAM (QA)        | "Every mutation needs the 'who can do this?' question answered."                |
| THEO (TS)       | "Type-safe security patterns prevent mistakes."                                 |

### Decision

1. Add auth checks to all 30+ unprotected mutations
2. Create `docs/SECURITY_POLICY.md` with comprehensive rules
3. Create `/security-rules` workflow for mutation implementation
4. Add security rules to `.agent/rules.md` for enforcement
5. Remove data-leaking console.logs
6. Gate `createTestProject` behind `requireSuperAdmin()`

### Outcome

✅ **Successful** - All rules implemented, 6 files secured, policy documented

### Lessons Learned

- RBAC helpers (`requireProjectAccess`, `requireAdmin`) are powerful when used consistently
- Console.log statements should never include full objects or args

---

## Decision #3: Type Safety Guardrails

**Date**: 2024-12-10  
**Domain**: Engineering / Process  
**Confidence**: 0.80

### Context

How to maintain type safety across all features going forward.

### Board Input

| Board Member | Input                                         |
| ------------ | --------------------------------------------- |
| THEO         | "`typedHelpers.ts` as single source of truth" |
| KHANH        | "Pre-commit type check"                       |
| KATE         | "Add to Definition of Done"                   |
| PAIGE        | "Track `as any` count as metric"              |

### Decision

1. Add `npm run type-check` to pre-commit
2. Track `as any` count in PROJECT_STATUS.md
3. THEO reviews all PRs touching types
4. `typedHelpers.ts` is canonical type location

### Outcome

🔄 **In Progress** - Guardrails defined, implementation pending

---

## Decision #2: `as any` Cleanup Approach

**Date**: 2024-12-10  
**Domain**: Type Safety  
**Confidence**: 0.85

### Context

41 `as any` casts identified. Need systematic approach to reduce while documenting necessary ones.

### Board Input

| Board Member | Input                                                                   |
| ------------ | ----------------------------------------------------------------------- |
| THEO         | "Categorize by necessity - some are unavoidable with Convex components" |
| KHANH        | "Document all remaining casts"                                          |
| SAM          | "Add comments explaining each one"                                      |

### Decision

1. Remove avoidable casts using proper API paths and branded types
2. Document remaining necessary casts in `typedHelpers.ts`
3. Use bracket notation for nested Convex APIs

### Outcome

✅ **Successful** - Reduced from 41 → 21 (49%), all documented

---

## Decision #1: Add THEO TypeScript Wizard to Board

**Date**: 2024-12-10  
**Domain**: Engineering / Type Safety  
**Confidence**: 0.95

### Context

Need expert guidance on TypeScript patterns, branded types, and when `as any` is acceptable.

### Board Input

| Board Member | Input                                     |
| ------------ | ----------------------------------------- |
| KHANH        | "Type expertise needs representation"     |
| SAM          | "Types are tests - we need a type expert" |

### Decision

Add THEO persona to Board with focus on type safety, branded types, and `as any` review.

### Outcome

✅ **Successful** - THEO integrated into workflow, consulted on type cleanup

---

## Confidence Trends

| Domain      | Decisions | Avg Confidence | Trend       |
| ----------- | --------- | -------------- | ----------- |
| Security    | 1         | 0.95           | 🆕 New      |
| Type Safety | 2         | 0.90           | ↑ Improving |
| Engineering | 2         | 0.88           | ↑ Improving |

---

## Decision Template

Use this template when adding new Board decisions:

```markdown
## Decision #N: [Title]

**Date**: YYYY-MM-DD  
**Domain**: [Security/Engineering/Product/etc]  
**Confidence**: [0.0-1.0]  
**Related Files**: [optional list of files]

### Context

[Brief description of the problem]

### Board Input

| Board Member | Input     |
| ------------ | --------- |
| [NAME]       | "[quote]" |

### Decision

1. [Action item]
2. [Action item]

### Outcome

[✅ Successful / ❌ Failed / 🔄 In Progress] - [Description]

### Lessons Learned

- [Key takeaway]
```

---

## How to Use This Log

1. **Before decisions**: Search for similar past decisions by domain
2. **During decisions**: Document Board input in real-time
3. **After decisions**: Add entry with confidence score
4. **After outcomes**: Update status with ✅/❌/🔄 and lessons learned
5. **Quarterly**: Review confidence trends, identify patterns

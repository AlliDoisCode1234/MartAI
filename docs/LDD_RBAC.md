# LDD: Enterprise RBAC + RLS Architecture

**Author**: MartAI Engineering
**Status**: Draft
**Version**: 1.0
**Last Updated**: 2025-12-30

---

## Executive Summary

This document defines MartAI's comprehensive Role-Based Access Control (RBAC) and Row-Level Security (RLS) architecture, inspired by enterprise SaaS platforms like Salesforce and HubSpot.

> [!IMPORTANT]
> Security is non-negotiable. Every public function must implement access control. Default to deny.

---

## Table of Contents

1. [Security Layers](#security-layers)
2. [Role Hierarchy](#role-hierarchy)
3. [Permission Matrix](#permission-matrix)
4. [Row-Level Security](#row-level-security)
5. [UI Permission Gating](#ui-permission-gating)
6. [Implementation Status](#implementation-status)
7. [Migration Plan](#migration-plan)

---

## Security Layers

MartAI implements a 4-layer security model:

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Authentication (AuthN)                            │
│  "Who are you?"                                             │
│  → Convex Auth (Magic Link, Google OAuth)                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Role-Based Access Control (RBAC)                  │
│  "What can your role do?"                                   │
│  → convex/lib/rbac.ts                                       │
│  → Permissions: admin, super_admin, user, viewer            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Row-Level Security (RLS)                          │
│  "Which records can you access?"                            │
│  → convex/lib/rls.ts                                        │
│  → Scoping: Own data vs project-scoped vs admin access      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: Field-Level Security (FLS)                        │
│  "Which fields are visible/editable?"                       │
│  → filterUserFields() patterns in queries                   │
│  → Never expose: passwordHash, refreshTokens                │
└─────────────────────────────────────────────────────────────┘
```

---

## Role Hierarchy

### Portal Roles (Global)

| Role          | Level | Description                          | Use Case                    |
| ------------- | ----- | ------------------------------------ | --------------------------- |
| `super_admin` | 100   | Full system access                   | Founders, engineering leads |
| `admin`       | 80    | Admin portal access, user management | Support team                |
| `user`        | 20    | Standard member access               | Paying customers            |
| `viewer`      | 10    | Read-only access                     | Team members (future)       |

### Hierarchy Rule

> Higher role levels inherit all permissions from lower levels.

```typescript
// convex/lib/rbac.ts
const ADMIN_ROLE_LEVEL: Record<AdminRole, number> = {
  super_admin: 100,
  admin: 80,
  user: 20, // Changed from 50 to match typical SaaS
  viewer: 10,
};
```

### Organization Roles (Per-Organization)

| Role     | Level | Description                        |
| -------- | ----- | ---------------------------------- |
| `owner`  | 100   | Organization creator, full control |
| `admin`  | 80    | Can manage team, billing           |
| `editor` | 50    | Can create/edit content            |
| `viewer` | 10    | Read-only access                   |

---

## Permission Matrix

### Legend

- ✅ = Always allowed
- 🔑 = Own data only
- 📊 = Project-scoped (via ownership)
- ❌ = Never allowed

### Users Entity

| Permission       | super_admin | admin | user | viewer |
| ---------------- | :---------: | :---: | :--: | :----: |
| View all users   |     ✅      |  ✅   |  ❌  |   ❌   |
| View own profile |     ✅      |  ✅   |  ✅  |   ✅   |
| Edit own profile |     ✅      |  ✅   |  ✅  |   ❌   |
| Edit any user    |     ✅      |  ✅   |  ❌  |   ❌   |
| Change user role |     ✅      |  ❌   |  ❌  |   ❌   |
| Delete user      |     ✅      |  ❌   |  ❌  |   ❌   |
| Reset onboarding |     ✅      |  ✅   |  ❌  |   ❌   |
| View BI/Funnels  |     ✅      |  ❌   |  ❌  |   ❌   |

### Projects Entity

| Permission         | super_admin | admin |      user       | viewer |
| ------------------ | :---------: | :---: | :-------------: | :----: |
| View all projects  |     ✅      |  ✅   |       ❌        |   ❌   |
| View own projects  |     ✅      |  ✅   |       📊        |   📊   |
| Create project     |     ✅      |  ✅   | 🔑 (tier limit) |   ❌   |
| Edit project       |     ✅      |  ✅   |       📊        |   ❌   |
| Delete project     |     ✅      |  ❌   |       📊        |   ❌   |
| Transfer ownership |     ✅      |  ❌   |       ❌        |   ❌   |

### Keywords Entity

| Permission             | super_admin | admin |    user    | viewer |
| ---------------------- | :---------: | :---: | :--------: | :----: |
| View all keywords      |     ✅      |  ✅   |     ❌     |   ❌   |
| View project keywords  |     ✅      |  ✅   |     📊     |   📊   |
| Generate keywords (AI) |     ✅      |  ❌   | 📊 (quota) |   ❌   |
| Add manual keyword     |     ✅      |  ✅   |     📊     |   ❌   |
| Edit keyword           |     ✅      |  ✅   |     📊     |   ❌   |
| Delete keyword         |     ✅      |  ✅   |     📊     |   ❌   |
| Seed keyword library   |     ✅      |  ❌   |     ❌     |   ❌   |

### Clusters & Briefs

| Permission    | super_admin | admin |    user    | viewer |
| ------------- | :---------: | :---: | :--------: | :----: |
| View          |     ✅      |  ✅   |     📊     |   📊   |
| Generate (AI) |     ✅      |  ❌   | 📊 (quota) |   ❌   |
| Create/Edit   |     ✅      |  ✅   |     📊     |   ❌   |
| Delete        |     ✅      |  ✅   |     📊     |   ❌   |
| Approve       |     ✅      |  ✅   |     📊     |   ❌   |

### Content / Drafts

| Permission           | super_admin | admin |    user    | viewer |
| -------------------- | :---------: | :---: | :--------: | :----: |
| View                 |     ✅      |  ✅   |     📊     |   📊   |
| Generate draft (AI)  |     ✅      |  ❌   | 📊 (quota) |   ❌   |
| Edit                 |     ✅      |  ✅   |     📊     |   ❌   |
| Delete               |     ✅      |  ✅   |     📊     |   ❌   |
| Publish to WordPress |     ✅      |  ✅   |     📊     |   ❌   |
| Schedule             |     ✅      |  ✅   |     📊     |   ❌   |

### Integrations

| Permission         | super_admin | admin | user | viewer |
| ------------------ | :---------: | :---: | :--: | :----: |
| Connect GA4/GSC/WP |     ✅      |  ✅   |  🔑  |   ❌   |
| Disconnect         |     ✅      |  ✅   |  🔑  |   ❌   |
| View OAuth tokens  |     ✅      |  ❌   |  ❌  |   ❌   |
| Rotate tokens      |     ✅      |  ❌   |  ❌  |   ❌   |

### Billing & Subscriptions

| Permission             | super_admin | admin | user | viewer |
| ---------------------- | :---------: | :---: | :--: | :----: |
| View own subscription  |     ✅      |  ✅   |  🔑  |   🔑   |
| View all subscriptions |     ✅      |  ❌   |  ❌  |   ❌   |
| Upgrade/downgrade      |     ✅      |  ✅   |  🔑  |   ❌   |
| Cancel                 |     ✅      |  ✅   |  🔑  |   ❌   |
| Grant credits          |     ✅      |  ❌   |  ❌  |   ❌   |
| Override limits        |     ✅      |  ❌   |  ❌  |   ❌   |
| Issue refund           |     ✅      |  ❌   |  ❌  |   ❌   |

### AI Cost Management (super_admin only)

| Permission                       | super_admin | admin | user | viewer |
| -------------------------------- | :---------: | :---: | :--: | :----: |
| View AI cost dashboard           |     ✅      |  ❌   |  ❌  |   ❌   |
| View cost by user (with filters) |     ✅      |  ❌   |  ❌  |   ❌   |
| View cost by project             |     ✅      |  ❌   |  ❌  |   ❌   |
| View cost by action type         |     ✅      |  ❌   |  ❌  |   ❌   |
| Search/filter cost logs          |     ✅      |  ❌   |  ❌  |   ❌   |
| Export cost reports              |     ✅      |  ❌   |  ❌  |   ❌   |
| Set cost alerts                  |     ✅      |  ❌   |  ❌  |   ❌   |

> [!NOTE]
> AI costs include: keyword generation, cluster generation, brief creation, draft generation, SEO scoring, and other AI-powered features. Each action should log `tokensUsed`, `model`, `cost`, `userId`, `projectId`, and `timestamp`.

---

## Row-Level Security

### Existing Implementation

Located in `convex/lib/rls.ts`:

```typescript
// Rule pattern for project-scoped data
keywords: {
  read: async (ruleCtx, keyword) => {
    if (isAdmin) return true;           // Admins see all
    if (!userId) return false;          // Unauthenticated = deny
    const project = await ruleCtx.db.get(keyword.projectId);
    return project?.userId === userId;  // Owner only
  },
  modify: async (ruleCtx, keyword) => {
    // Same logic for writes
  },
},
```

### Table Coverage

| Table              | RLS Status     | Scope                    |
| ------------------ | -------------- | ------------------------ |
| `users`            | ✅ Implemented | Self or Admin            |
| `projects`         | ✅ Implemented | Owner or Admin           |
| `keywords`         | ✅ Implemented | Project-scoped           |
| `keywordClusters`  | ✅ Implemented | Project-scoped           |
| `briefs`           | ✅ Implemented | Project-scoped           |
| `competitors`      | ✅ Implemented | Project-scoped           |
| `apiKeys`          | ✅ Implemented | User-scoped              |
| `subscriptions`    | ✅ Implemented | User-scoped              |
| `quarterlyPlans`   | ✅ Implemented | Project-scoped           |
| `prospects`        | ✅ Implemented | Admin only               |
| `prospectDetails`  | ✅ Implemented | Admin only               |
| `drafts`           | ⚠️ Missing     | Should be project-scoped |
| `contentPieces`    | ⚠️ Missing     | Should be project-scoped |
| `contentCalendars` | ⚠️ Missing     | Should be project-scoped |
| `contentTemplates` | ⚠️ Missing     | Should be admin-managed  |
| `analyticsEvents`  | ⚠️ Missing     | Should be admin only     |
| `organizations`    | ⚠️ Missing     | Should be member-scoped  |
| `teamMembers`      | ⚠️ Missing     | Should be org-scoped     |

### Usage Pattern

```typescript
// Use wrapped queries/mutations for automatic RLS
import { queryWithRLS, mutationWithRLS } from './lib/rls';

export const listKeywords = queryWithRLS({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // RLS automatically filters to authorized records
    return await ctx.db
      .query('keywords')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});
```

---

## UI Permission Gating

### Navigation Visibility

| Menu Item      | super_admin | admin | user |  viewer   |
| -------------- | :---------: | :---: | :--: | :-------: |
| Dashboard      |     ✅      |  ✅   |  ✅  |    ✅     |
| Content Studio |     ✅      |  ✅   |  ✅  | ✅ (read) |
| Strategy       |     ✅      |  ✅   |  ✅  | ✅ (read) |
| Calendar       |     ✅      |  ✅   |  ✅  | ✅ (read) |
| Settings       |     ✅      |  ✅   |  ✅  |    ❌     |
| Admin Portal   |     ✅      |  ✅   |  ❌  |    ❌     |

### Admin Portal Navigation

| Menu Item        | super_admin |     admin      |
| ---------------- | :---------: | :------------: |
| Dashboard        |     ✅      |       ✅       |
| Users            |     ✅      |       ✅       |
| Projects (all)   |     ✅      |       ✅       |
| Keywords Library |     ✅      | ✅ (view only) |
| BI / Funnels     |     ✅      |       ❌       |
| Costs            |     ✅      |       ❌       |
| System Settings  |     ✅      |       ❌       |
| Audit Logs       |     ✅      | ✅ (view only) |

### Action Button Visibility

```typescript
// Proposed usePermission hook
function usePermission(permission: Permission): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return hasPermission(user.role, permission);
}

// Usage in component
function DeleteButton({ projectId }: Props) {
  const canDelete = usePermission('projects.delete');
  if (!canDelete) return null;
  return <Button>Delete</Button>;
}
```

---

## Implementation Status

### Current State

| Component       | Status      | Location                                  |
| --------------- | ----------- | ----------------------------------------- |
| RBAC helpers    | ✅ Complete | `convex/lib/rbac.ts`                      |
| RLS wrapper     | ✅ Complete | `convex/lib/rls.ts`                       |
| AdminGuard      | ✅ Fixed    | `src/components/admin/AdminGuard.tsx`     |
| AuthProvider    | ✅ Complete | `src/providers/AuthProvider/index.tsx`    |
| ProjectProvider | ✅ Complete | `src/providers/ProjectProvider/index.tsx` |

### Gaps to Fill

| Gap                          | Priority | Effort |
| ---------------------------- | -------- | ------ |
| Add missing tables to RLS    | P0       | 3 pts  |
| Create `usePermission` hook  | P1       | 2 pts  |
| Add UI button gating         | P1       | 3 pts  |
| Audit all mutations for RBAC | P1       | 5 pts  |
| Add audit logging            | P2       | 5 pts  |

---

## Migration Plan

### Phase 1: Complete RLS Coverage (P0)

Add missing tables to `convex/lib/rls.ts`:

```typescript
// drafts: project-scoped
drafts: {
  read: async (ruleCtx, draft) => {
    if (isAdmin) return true;
    if (!userId) return false;
    const project = await ruleCtx.db.get(draft.projectId);
    return project?.userId === userId;
  },
  modify: async (ruleCtx, draft) => {
    if (isAdmin) return true;
    if (!userId) return false;
    const project = await ruleCtx.db.get(draft.projectId);
    return project?.userId === userId;
  },
},

// contentPieces: project-scoped
contentPieces: { /* same pattern */ },

// contentCalendars: project-scoped
contentCalendars: { /* same pattern */ },

// contentTemplates: admin only
contentTemplates: {
  read: async () => true,  // Templates are readable by all
  modify: async () => isSuperAdmin,  // Only super_admin can modify
},

// analyticsEvents: admin only
analyticsEvents: {
  read: async () => isAdmin,
  modify: async () => isAdmin,
},
```

### Phase 2: Permission Hook (P1)

Create `src/lib/usePermission.ts`:

```typescript
type Permission =
  | 'users.view'
  | 'users.edit'
  | 'users.delete'
  | 'users.changeRole'
  | 'projects.view'
  | 'projects.create'
  | 'projects.edit'
  | 'projects.delete'
  | 'keywords.generate'
  | 'keywords.seed'
  | 'content.generate'
  | 'content.publish'
  | 'billing.view'
  | 'billing.override'
  | 'admin.access'
  | 'admin.bi'
  | 'admin.system';

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  super_admin: ['*'], // All permissions
  admin: ['users.view', 'users.edit', 'projects.view', 'admin.access'],
  user: ['projects.view', 'projects.create', 'content.generate'],
  viewer: ['projects.view'],
};

export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();
  if (!user?.role) return false;

  const perms = ROLE_PERMISSIONS[user.role as AdminRole] || [];
  return perms.includes('*') || perms.includes(permission);
}
```

### Phase 3: UI Gating (P1)

Create wrapper component:

```typescript
// src/components/shared/PermissionGate.tsx
interface Props {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: Props) {
  const hasPermission = usePermission(permission);
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

// Usage
<PermissionGate permission="projects.delete">
  <DeleteButton />
</PermissionGate>
```

### Phase 4: Audit Logging (P2)

```typescript
// convex/lib/audit.ts
export async function logAudit(
  ctx: MutationCtx,
  action: string,
  targetId: Id<any>,
  details?: Record<string, unknown>
) {
  const userId = await auth.getUserId(ctx);
  await ctx.db.insert('auditLogs', {
    userId,
    action,
    targetId,
    details,
    timestamp: Date.now(),
    ip: 'server', // Would need middleware for real IP
  });
}
```

---

## Board Approval

### TYLER (CTO)

> Solid 4-layer security model. Priority order is correct. P0 is completing RLS coverage.

### KHANH (Dir Eng)

> Existing foundation is good. Main gaps are missing tables in RLS and no UI permission hook.

### SAM (QA)

> Need test matrix for all RBAC scenarios. Each role × each action × each entity.

### THEO (TypeScript)

> Permission type is well-defined. Consider branded types for role validation.

**Decision**: Implement in priority order (P0 → P1 → P2)
**Confidence**: 0.92

---

## References

- [Convex Row Level Security](https://stack.convex.dev/row-level-security)
- [Salesforce Security Best Practices](https://developer.salesforce.com/docs/atlas.en-us.securityImplGuide.meta/securityImplGuide/)
- [HubSpot User Permissions](https://knowledge.hubspot.com/settings/hubspot-user-permissions-guide)

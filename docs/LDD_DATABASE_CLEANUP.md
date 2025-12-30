# LDD: Convex Database & Schema Cleanup

## The Problem

### Symptoms

- High rate limits during testing (resources exhausted)
- 55 tables in schema.ts (1347 lines)
- Legacy/unused tables consuming storage and indexes
- Deprecated data structures alongside new ones

### Root Causes

| Issue                                                          | Impact                             |
| -------------------------------------------------------------- | ---------------------------------- |
| Legacy auth tables (`legacyUsers`, `legacySessions`)           | Unused since Convex Auth migration |
| Duplicate content models (`briefs`, `drafts`, `contentPieces`) | Confusion, orphan records          |
| Old prospect flow tables                                       | May have stale test data           |
| Missing cascade deletes                                        | Orphan records accumulate          |
| Excessive test data                                            | Rate limit consumption             |

---

## Schema Inventory (55 Tables)

### Category: Auth & Users (5 tables)

| Table                         | Purpose                       | Status        | Action       |
| ----------------------------- | ----------------------------- | ------------- | ------------ |
| `users`                       | Main user table (Convex Auth) | ✅ Active     | Keep         |
| `legacyUsers`                 | Old auth system               | ❌ Deprecated | **DELETE**   |
| `legacySessions`              | Old session tokens            | ❌ Deprecated | **DELETE**   |
| `passwordResetTokens`         | Password reset                | ⚠️ Review     | Keep if used |
| `...authTables` (Convex Auth) | Auth system tables            | ✅ Active     | Keep         |

### Category: Content Creation (6 tables)

| Table              | Purpose             | Status         | Action                  |
| ------------------ | ------------------- | -------------- | ----------------------- |
| `briefs`           | Old brief creation  | ⚠️ Migrating   | **DEPRECATE** (Phase 2) |
| `drafts`           | Old draft content   | ⚠️ Migrating   | **DEPRECATE** (Phase 2) |
| `briefVersions`    | Brief history       | ⚠️ Orphan risk | Review                  |
| `contentPieces`    | NEW unified model   | ✅ Active      | Keep                    |
| `contentCalendars` | Calendar scheduling | ✅ Active      | Keep                    |
| `contentTemplates` | Content templates   | ✅ Active      | Keep                    |

### Category: SEO & Analytics (12 tables)

| Table                 | Purpose                | Status    | Action      |
| --------------------- | ---------------------- | --------- | ----------- |
| `keywords`            | Keyword research       | ✅ Active | Keep        |
| `keywordClusters`     | Topic clusters         | ✅ Active | Keep        |
| `keywordIdeas`        | AI keyword suggestions | ✅ Active | Keep        |
| `keywordLibrary`      | Saved keywords         | ⚠️ Review | Check usage |
| `seoAudits`           | Site audits            | ✅ Active | Keep        |
| `rankings`            | Position tracking      | ⚠️ Review | Check usage |
| `seoStatistics`       | SEO metrics            | ⚠️ Review | Check usage |
| `analyticsData`       | GA4 data cache         | ✅ Active | Keep        |
| `gscKeywordSnapshots` | GSC data cache         | ✅ Active | Keep        |
| `serpAnalyses`        | SERP analysis          | ✅ Active | Keep        |
| `competitorAnalytics` | Competitor data        | ✅ Active | Keep        |
| `analyticsEvents`     | Event tracking         | ⚠️ Review | TTL needed? |

### Category: Projects & Organizations (6 tables)

| Table                     | Purpose         | Status    | Action  |
| ------------------------- | --------------- | --------- | ------- |
| `projects`                | User projects   | ✅ Active | Keep    |
| `organizations`           | Team orgs       | ✅ Active | Keep    |
| `teamMembers`             | Org members     | ✅ Active | Keep    |
| `organizationInvitations` | Pending invites | ⚠️ Review | Add TTL |
| `ga4Connections`          | GA4 OAuth       | ✅ Active | Keep    |
| `gscConnections`          | GSC OAuth       | ✅ Active | Keep    |

### Category: Billing & Usage (4 tables)

| Table               | Purpose              | Status    | Action  |
| ------------------- | -------------------- | --------- | ------- |
| `subscriptions`     | Stripe subscriptions | ✅ Active | Keep    |
| `usageLimits`       | Usage tracking       | ✅ Active | Keep    |
| `apiKeys`           | API access           | ✅ Active | Keep    |
| `apiAccessRequests` | API requests         | ⚠️ Review | Add TTL |

### Category: AI & Generation (5 tables)

| Table              | Purpose              | Status             | Action      |
| ------------------ | -------------------- | ------------------ | ----------- |
| `aiReports`        | AI-generated reports | ✅ Active          | Keep        |
| `aiGenerations`    | Generation logs      | ⚠️ Bloat risk      | **ADD TTL** |
| `aiProviders`      | Provider config      | ✅ Active          | Keep        |
| `aiModels`         | Model config         | ✅ Active          | Keep        |
| `aiProviderHealth` | Health status        | ⚠️ Frequent writes | **ADD TTL** |
| `aiRoutingLogs`    | Routing decisions    | ⚠️ Bloat risk      | **ADD TTL** |

### Category: Prospects & Legacy (6 tables)

| Table             | Purpose          | Status         | Action               |
| ----------------- | ---------------- | -------------- | -------------------- |
| `prospects`       | Lead capture     | ⚠️ Review      | Keep (sales)         |
| `prospectDetails` | Prospect data    | ⚠️ Orphan risk | Merge or clean       |
| `submittedUrls`   | Prospect URLs    | ⚠️ Orphan risk | Clean                |
| `clients`         | Old client model | ⚠️ Review      | Migrate to projects? |
| `oauthTokens`     | OAuth storage    | ⚠️ Review      | Audit tokens         |
| `generatedPages`  | Old page gen     | ❌ Deprecated? | **REVIEW**           |

### Category: Platform & Webhooks (5 tables)

| Table                 | Purpose            | Status        | Action      |
| --------------------- | ------------------ | ------------- | ----------- |
| `platformConnections` | CMS connections    | ✅ Active     | Keep        |
| `scheduledPosts`      | Post scheduling    | ✅ Active     | Keep        |
| `contentChecks`       | Content validation | ✅ Active     | Keep        |
| `webhooks`            | Webhook configs    | ✅ Active     | Keep        |
| `webhookDeliveries`   | Delivery logs      | ⚠️ Bloat risk | **ADD TTL** |

### Category: Misc (6 tables)

| Table            | Purpose         | Status        | Action      |
| ---------------- | --------------- | ------------- | ----------- |
| `personas`       | Brand personas  | ✅ Active     | Keep        |
| `competitors`    | Competitor list | ✅ Active     | Keep        |
| `insights`       | AI insights     | ✅ Active     | Keep        |
| `projectScores`  | Score history   | ⚠️ Bloat risk | **ADD TTL** |
| `quarterlyPlans` | Content plans   | ✅ Active     | Keep        |

---

## Security Audit (per /security-rules)

### ❌ Violations Found

| Table               | Issue                                            | Severity  |
| ------------------- | ------------------------------------------------ | --------- |
| `oauthTokens`       | Stores refresh tokens - needs encryption at rest | 🔴 High   |
| `apiKeys`           | `keyHash` used but original key logged?          | 🟡 Medium |
| `legacySessions`    | Contains tokens that should be deleted           | 🟡 Medium |
| `aiRoutingLogs`     | May contain PII in error messages                | 🟡 Medium |
| `webhookDeliveries` | Payload may contain sensitive data               | 🟡 Medium |

### ✅ Patterns Followed

| Pattern                 | Tables                      |
| ----------------------- | --------------------------- |
| Auth check in mutations | Most tables                 |
| Ownership validation    | `projects`, `organizations` |
| Rate limiting           | `usageLimits`               |

---

## Code Standards Audit (per /code-standards)

### ❌ Schema Issues

| Issue                | Location                             | Fix             |
| -------------------- | ------------------------------------ | --------------- |
| Schema file too long | 1347 lines                           | Split by domain |
| Legacy code present  | `legacyUsers`, `legacySessions`      | Delete          |
| Duplicate models     | `briefs`+`drafts` vs `contentPieces` | Migrate         |

### Recommendation: Schema Split

```
convex/schema/
├── index.ts          # Main export + auth tables
├── users.ts          # User-related tables
├── content.ts        # Content creation tables
├── seo.ts            # SEO/analytics tables
├── billing.ts        # Subscriptions/usage tables
├── ai.ts             # AI provider tables
└── legacy.ts         # Deprecated (for migration)
```

---

## Proposed Cleanup Plan

### Phase 1: Immediate Cleanup (Day 1)

| Action               | Tables                                                   | Impact                  |
| -------------------- | -------------------------------------------------------- | ----------------------- |
| Delete legacy tables | `legacyUsers`, `legacySessions`                          | Remove unused code      |
| Clear test data      | All tables                                               | Reduce rate limit usage |
| Add TTL indexes      | `aiRoutingLogs`, `webhookDeliveries`, `aiProviderHealth` | Prevent bloat           |

### Phase 2: Content Migration (Week 1)

| Action          | From                | To                        |
| --------------- | ------------------- | ------------------------- |
| Migrate data    | `briefs` + `drafts` | `contentPieces`           |
| Mark deprecated | `briefs`, `drafts`  | Add `_DEPRECATED_` prefix |
| Update queries  | All content queries | Use `contentPieces`       |

### Phase 3: Schema Refactor (Week 2)

| Action              | Impact                 |
| ------------------- | ---------------------- |
| Split schema.ts     | Better maintainability |
| Add cascade deletes | Prevent orphans        |
| Document all tables | Improve onboarding     |

---

## Board Consultation

### C-Suite

**ALEX (CEO)**:

> "Database bloat is operational debt. 55 tables is too many for our stage. Prioritize: 1) Stop the bleeding (delete legacy), 2) Migrate to unified models, 3) Document everything."

**BILL (CFO)**:

> "Database costs scale with storage + reads. If we're hitting rate limits on test data, we're wasting money. Clear test data immediately, add TTLs to prevent recurrence."

**CLARA (CMO)**:

> "No marketing impact, but cleaner data = better analytics. Support this cleanup."

**OSCAR (COO)**:

> "Process recommendation: Create a runbook for database maintenance. Schedule monthly cleanup. Add monitoring for table sizes."

**TYLER (CTO)**:

> "Technical recommendations:
>
> 1. Use `convex dashboard` to check table sizes
> 2. Legacy auth tables are dead code - delete immediately
> 3. Schema split is good practice but Phase 3 priority
> 4. TTLs are critical for log tables"

### Product & Engineering

**KATE (PO)**:

> "Scope this properly:
>
> - Phase 1: 0.5 days (delete legacy, clear data)
> - Phase 2: 2 days (content migration)
> - Phase 3: 1 day (schema split)
>   Total: ~4 days, spread across sprints"

**PAIGE (PM)**:

> "User impact: None if done correctly. This is infrastructure work that improves reliability."

**KHANH (Eng)**:

> "Code quality: 1347-line schema is a code smell. Split by domain is correct approach. Use barrel exports."

**SAM (QA)**:

> "Edge cases for cleanup:
>
> - Foreign key references to deleted tables
> - In-flight queries during migration
> - Rollback plan if migration fails
> - Test data vs real data identification"

**THEO (TypeScript)**:

> "Type safety: Deleting tables requires updating all type references. Run `npx tsc --noEmit` after changes."

**CONVEX (Platform)**:

> "Convex-specific:
>
> 1. Can't delete tables with data - clear first
> 2. Use `internalMutation` for bulk deletes
> 3. Index on `createdAt` enables TTL via cron
> 4. Schema changes require `npx convex dev --once`"

### Design & GTM

**MART (SEO)**: _"No direct impact on SEO features. Support cleanup."_

**LAURA (UX)**: _"No UI changes required."_

**BARRY (Sales)**: _"Keep prospect tables - we need that for sales tracking."_

---

## Data Cleanup Script (Phase 1)

```typescript
// convex/admin/cleanupDatabase.ts
import { internalMutation } from '../_generated/server';
import { v } from 'convex/values';

export const clearLegacyData = internalMutation({
  args: {
    dryRun: v.boolean(),
    olderThanDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cutoff = args.olderThanDays ? Date.now() - args.olderThanDays * 24 * 60 * 60 * 1000 : 0;

    const stats = {
      legacyUsers: 0,
      legacySessions: 0,
      aiRoutingLogs: 0,
      webhookDeliveries: 0,
    };

    // Clear legacy auth
    const legacyUsers = await ctx.db.query('legacyUsers').collect();
    stats.legacyUsers = legacyUsers.length;

    const legacySessions = await ctx.db.query('legacySessions').collect();
    stats.legacySessions = legacySessions.length;

    // Clear old logs (>7 days)
    const oldLogs = await ctx.db
      .query('aiRoutingLogs')
      .filter((q) => q.lt(q.field('createdAt'), cutoff))
      .collect();
    stats.aiRoutingLogs = oldLogs.length;

    if (!args.dryRun) {
      for (const user of legacyUsers) {
        await ctx.db.delete(user._id);
      }
      for (const session of legacySessions) {
        await ctx.db.delete(session._id);
      }
      for (const log of oldLogs) {
        await ctx.db.delete(log._id);
      }
    }

    return {
      dryRun: args.dryRun,
      deleted: stats,
    };
  },
});
```

---

## Decision

### Board Vote

| Member | Vote | Condition                  |
| ------ | ---- | -------------------------- |
| ALEX   | ✅   | Prioritize legacy deletion |
| BILL   | ✅   | Add cost monitoring        |
| CLARA  | ✅   | -                          |
| OSCAR  | ✅   | Create runbook             |
| TYLER  | ✅   | Split schema in Phase 3    |
| KATE   | ✅   | Scope correctly            |
| PAIGE  | ✅   | -                          |
| KHANH  | ✅   | Follow code standards      |
| SAM    | ✅   | Add rollback plan          |
| THEO   | ✅   | Verify types after         |
| CONVEX | ✅   | Use internalMutation       |
| MART   | ✅   | -                          |
| LAURA  | ✅   | -                          |
| BARRY  | ✅   | Keep prospect tables       |

**APPROVED** (14/14)

**Confidence**: 0.95 (Very High)

---

## Success Metrics

| Metric            | Before   | Target  |
| ----------------- | -------- | ------- |
| Schema lines      | 1347     | <800    |
| Tables            | 55       | ~45     |
| Rate limit errors | Frequent | Zero    |
| Legacy code       | Present  | Deleted |

---

_LDD authored with full Board review. December 30, 2024._

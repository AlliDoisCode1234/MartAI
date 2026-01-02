# LDD: Mutation Health Audit

## Executive Summary

Analyzed **90+ `ctx.db.patch` operations** across 40+ Convex files. The main write conflict issue (onboarding) has been fixed. Remaining patterns are mostly safe but some require monitoring.

---

## Write Conflict Risk Assessment

### ✅ FIXED: Onboarding Flow (was Critical)

**Status:** Resolved in this session

| Before                      | After                |
| --------------------------- | -------------------- |
| 5.6K retries, 1.2K failures | Single batched write |

[See fix](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/onboarding.ts#L53-L97)

---

### 🟡 MONITOR: Dual Document Patches (Backend-Only)

These mutations patch **two different documents** within a single mutation. This is **safe** (single transaction) but worth documenting.

| File                                                                                                                                  | Function                      | Tables Patched            | Risk |
| ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------- | ---- |
| [subscriptionLifecycle.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/subscriptions/subscriptionLifecycle.ts#L264-L273) | `transitionToMaintenanceMode` | `subscriptions` + `users` | Low  |
| [subscriptionLifecycle.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/subscriptions/subscriptionLifecycle.ts#L290-L304) | `reactivateSubscription`      | `subscriptions` + `users` | Low  |
| [subscriptionLifecycle.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/subscriptions/subscriptionLifecycle.ts#L324-L335) | `cancelSubscription`          | `subscriptions` + `users` | Low  |
| [subscriptionLifecycle.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/subscriptions/subscriptionLifecycle.ts#L362-L373) | `adminActivateSubscription`   | `subscriptions` + `users` | Low  |
| [subscriptionLifecycle.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/subscriptions/subscriptionLifecycle.ts#L402-L411) | `adminChangeSubscriptionPlan` | `subscriptions` + `users` | Low  |
| [prospects.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/prospects/prospects.ts#L400-L413)                             | `convertProspectToUser`       | `prospects` + `users`     | Low  |

**Verdict:** ✅ Safe - all within single transaction

---

### ✅ SAFE: Frontend Call Patterns

| Page                                                                                                           | Mutations   | Pattern               | Status   |
| -------------------------------------------------------------------------------------------------------------- | ----------- | --------------------- | -------- |
| [integrations/page.tsx](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/app/integrations/page.tsx#L248-L276) | GA4 + GSC   | Sequential with await | ✅ Safe  |
| [onboarding/page.tsx](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/app/onboarding/page.tsx)               | Steps       | **Now batched**       | ✅ Fixed |
| [studio/strategy/page.tsx](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/app/studio/strategy/page.tsx)     | Keywords    | Single mutation       | ✅ Safe  |
| [admin/users/page.tsx](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/app/admin/users/page.tsx)             | Status/Role | User-initiated (rare) | ✅ Safe  |

---

## Scheduler Patterns (runAfter)

Fire-and-forget patterns that could create background load:

| File                                                                                                           | Trigger         | Target Action       | Risk |
| -------------------------------------------------------------------------------------------------------------- | --------------- | ------------------- | ---- |
| [onboarding.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/onboarding.ts#L201)                   | `markComplete`  | HubSpot sync        | Low  |
| [prospects.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/prospects/prospects.ts#L340)           | Prospect create | HubSpot sync        | Low  |
| [keywords.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/seo/keywords.ts#L43)                    | Keyword create  | Engagement tracking | Low  |
| [scheduledPosts.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/publishing/scheduledPosts.ts#L34) | Schedule        | Publish action      | Low  |
| [apiAccessRequests.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/apiAccessRequests.ts#L50)      | Request create  | HubSpot sync        | Low  |

**Verdict:** ✅ All fire-and-forget to external services. No user-facing impact.

---

## High-Volume Tables (Monitor for Growth)

| Table               | Write Frequency | TTL Strategy       | Status      |
| ------------------- | --------------- | ------------------ | ----------- |
| `analyticsEvents`   | High            | Add 30-day TTL     | ⚠️ Consider |
| `aiRoutingLogs`     | Medium          | Add 7-day TTL      | ⚠️ Consider |
| `webhookDeliveries` | Medium          | Add 7-day TTL      | ⚠️ Consider |
| `aiProviderHealth`  | Low             | Already time-boxed | ✅ Safe     |
| `aiGenerations`     | Medium          | Add 90-day TTL     | ⚠️ Consider |

---

## Recommendations

### 1. Immediate: None Required

The main write conflict (onboarding) has been fixed.

### 2. Short-Term: Add TTL Cleanup (Priority: Medium)

Add cron job to clean old log data.

### 3. Long-Term: Schema Split (Priority: Low)

Consider splitting the 1300-line schema.

---

## Patterns to Avoid

### ❌ Don't: Parallel mutations to same document

```typescript
// BAD - causes write conflicts
await updateStep({ step: 'a' });
await updateStep({ step: 'b' }); // Racing!
```

### ✅ Do: Batch into single write

```typescript
// GOOD - single atomic write
await updateMultipleSteps({
  steps: [{ step: 'a' }, { step: 'b' }],
});
```

---

## Health Dashboard Metrics to Monitor

| Metric                                    | Target   | Status     |
| ----------------------------------------- | -------- | ---------- |
| `onboarding:updateOnboardingStep` retries | <100/day | ✅ Fixed   |
| `onboarding:updateMultipleSteps` errors   | 0        | 🆕 New     |
| `users:completeOnboarding` failures       | 0        | Monitoring |
| `projects:createProject` retries          | <10/day  | Monitoring |

---

_LDD authored January 2, 2026_

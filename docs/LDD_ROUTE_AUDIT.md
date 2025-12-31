# LDD: Comprehensive Route, Redirect, and CTA Audit

**Created**: December 30, 2025  
**Status**: Approved - Implementing  
**Priority**: P0  
**Scope**: Marketing, Member Portal, Admin Portal

---

## Route Inventory

### Marketing (Public)

| Route        | Status    | Action           |
| ------------ | --------- | ---------------- |
| `/`          | ✅ Active | Landing page     |
| `/pricing`   | ✅ Active | Pricing page     |
| `/about`     | ⚠️ Check  | May need polish  |
| `/apply`     | ⚠️ Check  | Beta application |
| `/thank-you` | ✅ Active | Post-signup      |

### Auth

| Route                  | Status    | Action         |
| ---------------------- | --------- | -------------- |
| `/auth/login`          | ✅ Active | Login          |
| `/auth/signup`         | ✅ Active | Signup         |
| `/auth/reset-password` | ✅ Active | Password reset |
| `/auth/admin`          | ✅ Active | Admin login    |

### Member Portal

| Route                | Status    | Action                   |
| -------------------- | --------- | ------------------------ |
| `/dashboard`         | ✅ Active | Executive glance         |
| `/onboarding`        | ✅ Active | User onboarding          |
| `/onboarding/reveal` | ✅ Active | Keyword reveal           |
| `/settings`          | ✅ Active | User settings            |
| `/profile`           | ⚠️ Check  | May redirect to settings |
| `/projects`          | ⚠️ Check  | Multi-project support    |
| `/subscription`      | ⚠️ Check  | Subscription management  |

### Content Studio

| Route                 | Status    | Action                   |
| --------------------- | --------- | ------------------------ |
| `/studio`             | ✅ Active | Studio home              |
| `/studio/strategy`    | ✅ Active | Strategy planning        |
| `/studio/calendar`    | ✅ Active | Content calendar         |
| `/studio/library`     | ✅ Active | Content library          |
| `/studio/create`      | ✅ Active | Content creation         |
| `/studio/insights`    | ⚠️ Check  | May be "coming soon"     |
| `/studio/settings`    | ⚠️ Check  | Studio-specific settings |
| `/studio/[contentId]` | ✅ Active | Content editor           |

### Legacy (Redirect)

| Route           | Target             | Status           |
| --------------- | ------------------ | ---------------- |
| `/calendar`     | `/studio/calendar` | ✅ 301           |
| `/content`      | `/studio/library`  | ✅ 301           |
| `/strategy`     | `/studio/strategy` | ✅ 301           |
| `/analytics`    | ?                  | ⚠️ Need redirect |
| `/competitors`  | ?                  | ⚠️ Need redirect |
| `/keywords`     | ?                  | ⚠️ Need redirect |
| `/integrations` | ?                  | ⚠️ Need redirect |
| `/assistant`    | ?                  | ⚠️ Need redirect |
| `/publish`      | ?                  | ⚠️ Need redirect |

### Admin Portal

| Route                   | Status    | Action              |
| ----------------------- | --------- | ------------------- |
| `/admin`                | ✅ Active | Admin dashboard     |
| `/admin/users`          | ✅ Active | User management     |
| `/admin/users/[userId]` | ✅ Active | User detail         |
| `/admin/keywords`       | ✅ Active | Keyword management  |
| `/admin/analytics`      | ✅ Active | Platform analytics  |
| `/admin/costs`          | ✅ Active | Cost tracking       |
| `/admin/ai-providers`   | ✅ Active | AI provider config  |
| `/admin/serp`           | ✅ Active | SERP analysis       |
| `/admin/analysis`       | ✅ Active | Content analysis    |
| `/admin/prospects`      | ✅ Active | Prospect management |

---

## Implementation Plan

### Phase 1: Legacy Route Redirects (middleware.ts)

Add redirects for orphaned routes:

- `/analytics` → `/studio/insights`
- `/competitors` → `/studio/strategy`
- `/keywords` → `/studio/strategy`
- `/integrations` → `/settings`
- `/assistant` → `/studio`
- `/publish` → `/studio/library`

### Phase 2: Build Missing Pages

1. `/studio/insights` - If "coming soon", build analytics dashboard
2. `/studio/settings` - If missing, create studio-specific settings

### Phase 3: Dark Theme Fixes

1. KeywordsPreview.tsx
2. ClusterGrid.tsx empty states
3. Score Breakdown panel
4. All remaining light-themed elements

### Phase 4: CTA Audit

Ensure all CTAs point to correct consolidated routes.

---

## Files to Modify

1. `middleware.ts` - Add legacy redirects
2. `app/studio/insights/page.tsx` - Build or polish
3. `app/studio/settings/page.tsx` - Build or polish
4. Strategy components - Dark theme fixes
5. Navigation components - CTA updates

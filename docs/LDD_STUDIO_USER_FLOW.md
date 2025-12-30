# LDD: Content Studio User Flow Audit

## Flow Inventory

### Navigation Links Found

| Source File         | Component       | Link Target                        | Purpose                           |
| ------------------- | --------------- | ---------------------------------- | --------------------------------- |
| `StudioSidebar.tsx` | NavItem         | `/studio`                          | Home                              |
| `StudioSidebar.tsx` | NavItem         | `/studio/library`                  | Library                           |
| `StudioSidebar.tsx` | NavItem         | `/studio/create`                   | Create                            |
| `StudioSidebar.tsx` | NavItem         | `/studio/insights`                 | Insights (⚠️ NOT IMPLEMENTED)     |
| `StudioSidebar.tsx` | NavItem         | `/studio/settings`                 | Settings (⚠️ NOT IMPLEMENTED)     |
| `page.tsx` (Home)   | QuickCreateCard | `/studio/create?type=blog`         | Create Blog                       |
| `page.tsx` (Home)   | QuickCreateCard | `/studio/create?type=pillar`       | Create Pillar                     |
| `page.tsx` (Home)   | QuickCreateCard | `/studio/create?fromStrategy=true` | Create from Strategy              |
| `page.tsx` (Home)   | Button          | `/studio/create`                   | New Content                       |
| `page.tsx` (Home)   | Button          | `/studio/library`                  | View All                          |
| `library/page.tsx`  | Button          | `/studio/create`                   | New Content                       |
| `library/page.tsx`  | Button          | `/studio/create`                   | Create Your First Piece           |
| `create/page.tsx`   | Back Button     | `/studio`                          | Back to Home                      |
| `create/page.tsx`   | Cancel Button   | `/studio`                          | Cancel                            |
| `create/page.tsx`   | router.push     | `/studio/library`                  | After Generation                  |
| `ContentCard.tsx`   | Card Link       | `/studio/${contentPiece._id}`      | Edit Content (⚠️ NOT IMPLEMENTED) |

---

## Issues Found

### 1. Missing Routes (404)

| Route                 | Status | Fix                     |
| --------------------- | ------ | ----------------------- |
| `/studio/insights`    | ❌ 404 | Create placeholder page |
| `/studio/settings`    | ❌ 404 | Create placeholder page |
| `/studio/[contentId]` | ❌ 404 | Create editor page      |

### 2. Flow Gaps

| Gap                                 | Impact                | Fix                    |
| ----------------------------------- | --------------------- | ---------------------- |
| No way back to main app             | Users stuck in Studio | Add "Exit Studio" link |
| Insights/Settings deadends          | Broken nav            | Placeholder pages      |
| ContentCard links to missing editor | Cards unclickable     | Create editor page     |

---

## Board Consultation

**ALEX (CEO)**: _"User flow is critical for adoption. A broken link = lost user trust. Fix all 404s immediately."_

**LAURA (UX)**: _"Add exit path to main app. Users shouldn't feel trapped in sub-portal."_

**KATE (PO)**: _"Scope: 3 placeholder pages + exit link. 1 hour max."_

**SAM (QA)**: _"Test all links systematically. Use browser to verify each one."_

**KHANH (Eng)**: _"Placeholder pages pattern: 'Coming Soon' UI. Reusable component."_

---

## Proposed Fixes

### Phase 1: Immediate (Placeholder Pages)

1. Create `/studio/insights/page.tsx` - "Coming Soon"
2. Create `/studio/settings/page.tsx` - "Coming Soon"
3. Create `/studio/[contentId]/page.tsx` - Basic editor shell

### Phase 2: Exit Path

4. Add "Exit to Dashboard" link in sidebar

---

## Board Decision

**APPROVED** (Quick fix, low risk)
**Confidence**: 0.92

---

## Verification Plan

After fixes, test complete flow:

1. Navigate to /studio
2. Click all sidebar links
3. Click all quick create cards
4. Navigate to library
5. Click create button
6. Complete create flow
7. Return home

_LDD completed for User Flow Audit. December 30, 2024._

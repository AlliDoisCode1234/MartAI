# LDD: Content Calendar UI

## Context

MartAI now auto-generates 6-month content calendars during onboarding. We need a UI to display, manage, and interact with these generated calendar items in the Content Studio.

---

## Competitive Research

### Primary Inspiration

| Product        | Key Pattern                                            | Adopt? |
| -------------- | ------------------------------------------------------ | ------ |
| **Clearscope** | Content Inventory with A+/B/C grades, GSC integration  | ✅     |
| **SurferSEO**  | Topical Maps for content clusters, real-time scoring   | ✅     |
| **CoSchedule** | Hybrid Kanban + Calendar views, color-coding by status | ✅     |
| **Notion**     | Toggle between Calendar/Kanban/Table views             | ✅     |

### Key Findings

1. **Hybrid Views Win** - Best tools offer Calendar + Kanban toggle
2. **Color-Coding Essential** - Visual status identification (draft=gray, scheduled=purple, published=green)
3. **Drag-and-Drop** - Reschedule by dragging cards to new dates
4. **SEO Score Integration** - Show A+/B/C badge on each card
5. **Content Type Icons** - Quick visual identification (blog, service, homepage)

---

## Design Inspiration: CoSchedule + Clearscope Hybrid

```
┌────────────────────────────────────────────────────────────────┐
│  Content Calendar                    [+ Create] [⊞ Views ▼]   │
├────────────────────────────────────────────────────────────────┤
│  ◀ December 2025                                          ▶   │
├──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────────────┤
│ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ Sun  │              │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤ FILTERS      │
│      │ 1    │ 2    │ 3    │ 4    │ 5    │ 6    │              │
│      │ ┌──┐ │      │      │      │      │      │ ○ All        │
│      │ │📝│ │      │      │      │      │      │ ● P0 Only    │
│      │ │A+│ │      │      │      │      │      │ ○ Published  │
│      │ └──┘ │      │      │      │      │      │              │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤ CONTENT TYPES│
│ 7    │ 8    │ 9    │ 10   │ 11   │ 12   │ 13   │              │
│ ┌──┐ │      │ ┌──┐ │      │      │      │      │ [x] Blog     │
│ │🏠│ │      │ │📦│ │      │      │      │      │ [x] Service  │
│ │B+ │ │      │ │G │ │      │      │      │      │ [x] Homepage │
│ └──┘ │      │ └──┘ │      │      │      │      │              │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────────────┘

Legend: 📝=Blog, 🏠=Homepage, 📦=Service, G=Generating
```

---

## Proposed UI Components

### 1. ContentCalendarView (`app/studio/calendar/page.tsx`)

- Month grid view (default)
- Navigation (prev/next month)
- Filter sidebar
- View toggle (Calendar/Kanban/Table)

### 2. CalendarCard (`src/components/studio/CalendarCard.tsx`)

- Content type icon
- SEO grade badge (A+/B/C)
- Title (truncated)
- Status color indicator
- Drag-and-drop support

### 3. KanbanBoard (`src/components/studio/KanbanBoard.tsx`)

Columns:

- **Draft** (gray) - Generated, not started
- **In Progress** (blue) - Being written
- **Scheduled** (purple) - Date set
- **Published** (green) - Live

### 4. CalendarFilters (`src/components/studio/CalendarFilters.tsx`)

- Priority filter (P0/P1/P2)
- Content type filter
- Date range picker
- Search by title/keyword

---

## Board Consultation

### C-Suite Leadership

#### ALEX (CEO) says:

> "This is the 'aha moment' after onboarding. User lands on a full calendar — magic. Make it beautiful. First impression matters."

#### BILL (CFO) says:

> "One dev sprint to build calendar UI. If it increases trial-to-paid by 5%, ROI is immediate. Calendar = activation metric."

#### CLARA (CMO) says:

> "The calendar screenshot will be our hero image for landing page. Make it demo-worthy. CoSchedule's visual is what we're competing with."

---

### Product & Engineering

#### PAIGE (PM) says:

> **User Story**: "As a user who just completed onboarding, I want to see my auto-generated content calendar so I understand what MartAI will help me create."
>
> **Success Metric**: Time to first content piece < 60 seconds from calendar view.

#### KHANH (Eng) says:

> "We already have `listScheduled` query and `scheduledDate` field. UI is composition, not new backend. Low risk."

#### LAURA (UX) says:

> "Color-coding MUST be consistent with existing status colors. Purple=scheduled, green=published. Add content type icons from react-icons."

---

### Design & GTM

#### MART (SEO) says:

> "Show SEO potential on each card. Not just status, but 'this keyword has 10K volume'. Make users excited about what they're creating."

#### BARRY (Sales) says:

> "In demos, I want to say 'You just gave us your URL. Look — 6 months of content, planned.' That's the close."

---

## Implementation Plan

### Phase 1: Basic Calendar View (MVP)

| File                                     | Description                     |
| ---------------------------------------- | ------------------------------- |
| `app/studio/calendar/page.tsx`           | Month grid with cards           |
| `src/components/studio/CalendarCard.tsx` | Content card component          |
| `convex/contentPieces.ts`                | Add `listByScheduledDate` query |

### Phase 2: Views & Filters

| File                                        | Description               |
| ------------------------------------------- | ------------------------- |
| `src/components/studio/KanbanBoard.tsx`     | Status-based columns      |
| `src/components/studio/CalendarFilters.tsx` | Priority/type filters     |
| View toggle switcher                        | Calendar ↔ Kanban ↔ Table |

### Phase 3: Interactions

| Feature         | Description                    |
| --------------- | ------------------------------ |
| Drag-and-drop   | Reschedule by dragging         |
| Quick actions   | Generate, edit, schedule       |
| Bulk operations | Select multiple, bulk schedule |

---

## Verification Plan

### Automated

- Calendar renders with mock data
- Filter queries work correctly
- Card click navigates to editor

### Manual

- Complete onboarding → see calendar
- Drag card to new date → date updates
- Demo to user for feedback

---

**Decision**: APPROVED for Phase 1

**Confidence**: 0.90 (High — strong Board alignment, low engineering risk)

**Rationale**: Calendar UI is the "activation moment" between onboarding and content creation. Competitive research confirms hybrid views are standard.

---

_LDD authored with competitive research and Board consultation. December 30, 2024._

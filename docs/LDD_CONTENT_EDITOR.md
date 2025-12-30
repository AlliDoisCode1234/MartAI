# LDD: Content Editor Redesign

## Context

The Content Editor (`/content`) is where users create briefs and drafts. Currently functional but aesthetically "not nice" — generic UI, poor information architecture, code-standards violations.

---

## Root Cause Analysis (per /debugging-workflow)

### Phase 1: What's Wrong?

**Code Issues** (per /code-standards):

- `app/content/page.tsx` is **798 lines** (max should be 150)
- Multiple components defined inline (`TemplateBasedBriefCreator`, etc.)
- Magic strings scattered throughout
- No visual feedback system beyond Alerts

**UI Issues** (per /Laura - UX):

- **No toolbar** in Lexical editor (can't format text)
- **Generic gray metrics bar** at bottom of editor
- **Tab interface** feels cramped and basic
- **No visual hierarchy** between Brief/Draft sections
- **Plain inputs** for titles, H2s, FAQs
- **Alert boxes** for feedback (should use toast or inline)

**UX Issues** (per /Paige - PM):

- No clear "success" state after saving
- No autosave indication
- "Generate Draft" disabled state unclear
- No preview mode

### Phase 2: Pattern Analysis

Competing content editors (Notion, Linear, Craft) share:

1. **Floating toolbar** for formatting
2. **Command palette** (/) for inserting blocks
3. **Clean canvas** focus mode
4. **Subtle status indicators**
5. **Smooth transitions** between states

---

## Design Inspiration (Web Research)

### Primary Inspiration: **Clearscope + Craft Hybrid**

Just as we took Duolingo inspiration for user flow, we take **Clearscope** for SEO editor and **Craft** for writing experience:

| Product        | What to Adopt                                       | Why                                            |
| -------------- | --------------------------------------------------- | ---------------------------------------------- |
| **Clearscope** | Content grade (A+/B/C), clean writer-friendly UI    | SEO-focused, praised for "intuitive interface" |
| **Craft**      | Beautiful document-centric design, distraction-free | Elegant, minimal, focused                      |
| **Notion**     | "/" command palette, floating toolbar               | Familiar UX pattern                            |
| **SurferSEO**  | Real-time SEO sidebar, content score                | Interactive feedback                           |

### Key Patterns to Implement

1. **Content Grade Badge** (Clearscope-style)
   - Large A+/B/C grade in top-right corner
   - Color-coded: Green → Yellow → Red
   - Updates real-time as user writes

2. **Floating Toolbar** (Notion-style)
   - Appears on text selection
   - Bold, Italic, H2, Link, Highlight
   - Dark background, rounded corners

3. **SEO Checklist Sidebar** (SurferSEO-style)
   - Collapsible right panel
   - Green checkmarks for passed items
   - Word count, H2 count, internal links

4. **Distraction-Free Canvas** (Craft-style)
   - Large white canvas, generous padding
   - 18px body text, system font
   - Subtle borders only

### Visual Reference

```
┌───────────────────────────────────────────────────────┐
│  Content Editor                        [A+ SEO Score] │
│  "How to Optimize Landing Pages"                      │
├───────────────────────────────────────────────────────┤
│                                    │ ✓ Words 800+     │
│  ▌Floating toolbar▌                │ ✓ H2s 5+        │
│                                    │ ○ Links 3+      │
│  ## Introduction                   │ ✓ Meta title    │
│                                    │                 │
│  Write content here...             │ [Generate Draft]│
│                                    │                 │
│                      [Saved ✓]     │                 │
└───────────────────────────────────────────────────────┘
```

---

## Proposed Improvements

### P0: Code Standards Compliance

| Issue             | Fix                                      |
| ----------------- | ---------------------------------------- |
| 798-line page     | Extract to 5-6 smaller components        |
| Inline components | Move to `components/content/`            |
| Magic strings     | Move to `lib/constants/contentEditor.ts` |

### P0: Editor Core

| Feature       | Current            | Proposed                                   |
| ------------- | ------------------ | ------------------------------------------ |
| Toolbar       | None               | Floating bar: Bold, Italic, H2, List, Link |
| Status bar    | Gray bar at bottom | Subtle pill badges inline                  |
| Save feedback | `alert()`          | Toast notification                         |
| Autosave      | None               | Debounced save with indicator              |

### P1: Visual Polish

| Area          | Current         | Proposed                         |
| ------------- | --------------- | -------------------------------- |
| Editor canvas | Gray border box | Clean white, subtle shadow       |
| Tabs          | Default Chakra  | Underline style, animated        |
| Cards         | Plain white     | Subtle gradients, better spacing |
| Empty states  | Alert boxes     | Illustrated empty states         |

### P2: Advanced Features

- Command palette (/) for inserting blocks
- Keyboard shortcuts (Cmd+B, Cmd+I)
- Preview mode toggle
- Version history sidebar

---

## Board Consultation

### C-Suite

**ALEX (CEO)**:

> "Content creation is our core loop. This directly impacts user retention. P0 priority for any visual improvements that reduce friction."

**BILL (CFO)**:

> "What's the dev time estimate? If it's 1 week and improves retention by even 5%, ROI is strong. Keep scope tight."

**CLARA (CMO)**:

> "The editor is where users spend most time. It should feel premium. Competitors have polished editors — we can't look dated."

**OSCAR (COO)**:

> "798 lines is a maintenance nightmare. Fix code structure FIRST, then add features. Otherwise we're building on sand."

**TYLER (CTO)**:

> "Lexical is solid but underutilized. We're not using its toolbar capabilities. Extract into proper component architecture before adding complexity."

---

### Product & Engineering

**KATE (PO)**:

> "MoSCoW: MUST = code extraction + toolbar. SHOULD = save UX. COULD = autosave. WON'T = command palette (Phase 2)."

**PAIGE (PM)**:

> "User story: 'As a content creator, I want clear formatting controls so I can style my content without guessing.' Success metric: Draft completion rate +10%."

**KHANH (Eng Dir)**:

> "798 lines is tech debt landmine. Before ANY feature work, refactor to components. Estimate: 2hrs to extract, then features are easier."

**SAM (QA)**:

> "Edge cases to test: Empty brief, network failure during save, concurrent edits. Current code has no error boundaries in editor."

**THEO (TS)**:

> "I see `as any` casts on lines 220-223. These should use proper Convex API types. Also, `formData` state could use a reducer pattern."

**CONVEX (Platform)**:

> "Use Convex's real-time subscriptions for draft content instead of manual fetch. Would enable true autosave with conflict resolution."

---

### Design & GTM

**MART (SEO Expert)**:

> "The SEO metrics bar is good but hidden. Make SEO score more prominent — users want to see their content improves with each edit."

**LAURA (UI/UX)**:

> "Nielsen violations: No system status (autosave), no undo feedback, hidden affordances (no format buttons). Fix visibility first."

**BARRY (Sales)**:

> "In demos, the editor is where I spend most time. A polished editor = easier close. Current one looks like 'early beta'."

---

## Implementation Plan

### Phase 1: Refactor (P0) — 2 hours

1. Extract `ContentEditorPage` wrapper (data fetching)
2. Extract `BriefTab` component
3. Extract `DraftTab` component
4. Extract `EditorToolbar` component
5. Move constants to `lib/constants/contentEditor.ts`

### Phase 2: Toolbar (P0) — 2 hours

1. Add Lexical `ToolbarPlugin` with Bold, Italic, H2, List, Link
2. Style toolbar with Chakra (floating or sticky top)
3. Add keyboard shortcuts

### Phase 3: Save UX (P1) — 1 hour

1. Replace `alert()` with Chakra `toast()`
2. Add save indicator ("Saved" badge that fades)
3. Add loading skeleton during generation

### Phase 4: Visual Polish (P1) — 2 hours

1. Update editor canvas styling
2. Add animated tab underline
3. Improve card shadows and spacing
4. Add illustrated empty states

---

## Security Checklist (per /security-rules)

- [x] **Auth check**: `useAuth` present at top
- [x] **Ownership check**: Brief/Draft fetched by `briefId`
- [ ] **Input validation**: `formData` not sanitized before save
- [ ] **Error sanitization**: Using `sanitizeErrorMessage` ✅
- [ ] **Return filtering**: Full draft object returned (could leak)

---

## Decision

**APPROVED for Phase 1-3**

**Rationale**: Code refactoring is blocking all future improvements. Toolbar is table stakes. Save UX directly impacts user confidence. Visual polish can follow.

**Confidence**: 0.85 (High — Board consensus on refactor-first approach)

---

## Metrics to Track

| Metric                  | Current | Target  |
| ----------------------- | ------- | ------- |
| `page.tsx` line count   | 798     | <150    |
| Component files         | 1       | 5-6     |
| Draft completion rate   | TBD     | +10%    |
| User feedback on editor | TBD     | NPS >40 |

---

_LDD authored with Board consultation. December 30, 2024._

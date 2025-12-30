# Board Review: Launch Checklist & Component Consolidation

**Context**: Review LDD_LAUNCH_CHECKLIST.md and identify shared component opportunities to reduce code duplication and improve maintainability.

---

## C-Suite Leadership

### ALEX (CEO) says:

> This is exactly the kind of housekeeping we need before launch. DRY code means faster iteration post-launch. The 6-week timeline is aggressive but achievable if we parallelize properly. My concern: are we cutting scope or quality to hit the date? **Component consolidation should happen BEFORE Sprint A**, not during.

### BILL (CFO) says:

> Every duplicate component is double the maintenance cost. If we have 4 StatCard implementations, that's 4x the bug surface and 4x the time to update styling. The ROI on consolidation is clear: 2-3 days now saves weeks later. **Invest in the shared component library first.**

### CLARA (CMO) says:

> Consistent UI = stronger brand. Users shouldn't see jarring differences between Dashboard and Studio pages. The dark theme polish we just did is great, but it revealed inconsistency. **UX-003 (Empty States) should use a unified EmptyState component with theme variants.**

### OSCAR (COO) says:

> Four StatCard variants is a process smell. Who owns the shared component library? We need clear ownership before launch. **Document component ownership in the README.**

### TYLER (CTO) says:

> The architecture is sound, but we're violating DRY. The pattern I see:
>
> - `shared/StatItem` (24 lines) - uses emojis, basic
> - `shared/StatsCard` (24 lines) - landing page specific
> - `dashboard/StatCard` (87 lines) - light theme, rich features
> - `strategy/StrategyStatCards` (72 lines) - dark theme, simpler
>
> **Recommendation**: Consolidate into ONE `shared/MetricCard` with theme prop.

---

## Product & Engineering

### KATE says:

> Component consolidation is **Sprint 0** work - it should happen before we start the backlog. Add a new ticket:
>
> ```
> CODE-003: Component Consolidation
> Priority: P0
> Effort: 5 pts (2-3 days)
> Sprint: 0 (Pre-Sprint A)
> ```

### PAIGE says:

> The user story for UX-003 (Empty States) should explicitly state "reuse shared EmptyState component". Don't create 5 custom empty states. **Update acceptance criteria.**

### KHANH says:

> The component audit reveals:
> | Pattern | Count | Recommendation |
> |---------|-------|----------------|
> | StatCard variants | 4 | Consolidate to 1 |
> | EmptyState | 1 (light only) | Add theme support |
> | CTAButton | 1 | Extend for dark theme |
> | Modal patterns | ~5 | Consider shared Modal shell |
>
> **Tech debt: ~150 lines of duplicate code.** Worth 2-3 days to fix.

### SAM says:

> If we consolidate components, we need tests for the shared versions. **Add to TEST-001 scope:**
>
> - Test shared/MetricCard (new consolidated component)
> - Test shared/EmptyState with dark theme
> - Test shared/CTAButton variants

### THEO says:

> The Props types are inconsistent across StatCard variants:
>
> - `dashboard/StatCard`: Uses IconType (good)
> - `shared/StatItem`: Uses string for icon (bad - emojis)
> - `strategy/StrategyStatCards`: Inline stats array (ok)
>
> **Recommendation**: Create branded type `MetricCardProps` and use across all instances.

---

## Design & GTM

### MART says:

> Users don't care about our component architecture, but they DO notice when the Dashboard looks different from the Studio. **Consistency = trust. Polish the shared components.**

### LAURA says:

> Design system concerns:
>
> 1. **EmptyState uses `brand.light`** - needs dark theme support
> 2. **StatsCard uses hardcoded `bg="white"`** - needs theme variant
> 3. **4 stat card designs** - should be ONE with size variants (sm, md, lg)
>
> **Deliverable**: Update shared components to support `theme="light" | "dark"` prop.

### BARRY says:

> For demos, I need the product to look polished. Inconsistent cards between pages is a red flag for prospects. **Fix this before the working demo in Sprint 3.**

---

## Decision: Component Consolidation Ticket

**Add to Sprint 0 (Pre-Sprint A):**

### CODE-003: Component Consolidation

| Field        | Value            |
| ------------ | ---------------- |
| Priority     | P0               |
| Effort       | 5 pts (2-3 days) |
| Dependencies | None             |

**Scope**:

1. **Create `shared/MetricCard`** - Unified stat card with:
   - Props: `icon`, `label`, `value`, `trend?`, `color`, `theme`
   - Supports light/dark themes via `theme` prop
   - Replaces: `dashboard/StatCard`, `strategy/StrategyStatCards`, `shared/StatItem`

2. **Update `shared/EmptyState`**:
   - Add `theme?: 'light' | 'dark'` prop
   - Use `useColorModeValue` for automatic theme detection
   - Add MartCharacter integration for illustrations

3. **Update `shared/CTAButton`**:
   - Add dark theme variant
   - Ensure consistent hover states

4. **Migrate usages**:
   - Update `app/dashboard/page.tsx`
   - Update `app/studio/strategy/page.tsx`
   - Update any other stat card usages

**Acceptance Criteria**:

```gherkin
Given I view the Dashboard (light theme)
When I compare it to the Studio (dark theme)
Then the stat cards have identical structure
And only the colors differ based on theme
```

---

## Revised Dependency Graph

```text
CODE-003 (Component Consolidation) ─────────────────────┐
    ↓                                                    │
BILL-001 ─→ BILL-002                                     │
                                                         ├──→ QUAL-001 ──→ 🚀
WP-001 → WP-002                                          │
                                                         │
UX-001 → UX-002                                          │
UX-003 (uses unified EmptyState) ───────────────────────┘
                                                         │
SEC-001 → SEC-002 ──────────────────────────────────────┘
```

---

## Revised Sprint Schedule

### Sprint 0: Foundation (1-2 days)

- **CODE-003: Component Consolidation** (NEW)

### Sprint A (Week 1-2)

- BILL-001: Stripe Integration
- BILL-002: Subscription Limits
- SEC-001: Rotate Secrets

### Sprint B (Week 3-4)

- WP-001: WordPress E2E
- WP-002: WordPress Settings
- UX-001: Phase-Based Flow

### Sprint C (Week 5-6)

- UX-002: Mart Guide
- UX-003: Empty States (use unified EmptyState)
- UX-004: Error Handling
- SEC-002: Security Audit
- TEST-001: Unit Tests

### Sprint D (Week 7-8)

- QUAL-001: E2E Testing
- UX-005: Accessibility
- UX-006: Analytics Events
- UX-007: Email Triggers
- NOTIFY-001: Notifications
- **LAUNCH** 🚀

---

## Confidence: 0.92 (High)

All personas agree on the fundamental need for component consolidation. The only debate is timing (Sprint 0 vs Sprint A), and the consensus is Sprint 0 to avoid carrying tech debt into the main sprints.

---

## Action Items

1. [ ] Create `CODE-003: Component Consolidation` ticket in PRODUCTION_BACKLOG.md
2. [ ] Update LDD_LAUNCH_CHECKLIST.md with Sprint 0
3. [ ] Create `shared/MetricCard` component
4. [ ] Update `shared/EmptyState` with theme support
5. [ ] Migrate all usages

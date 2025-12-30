# MartAI Launch Checklist - LDDs & Tickets

**Created**: December 30, 2025  
**Target Launch**: Mid-February 2026  
**Status**: Ready to Execute

---

## Quick Reference

| Phase | Focus                   | Tickets                              | Est. Days |
| ----- | ----------------------- | ------------------------------------ | --------- |
| **0** | Component Consolidation | CODE-003                             | 2-3       |
| **1** | Billing & Payments      | BILL-001, BILL-002                   | 5         |
| **2** | Publishing Integration  | WP-001, WP-002                       | 5         |
| **3** | UX Polish               | UX-001 to UX-004                     | 7         |
| **4** | Security & Testing      | SEC-001, SEC-002, QUAL-001, TEST-001 | 7         |
| **5** | Launch Prep             | NOTIFY-001, UX-005 to UX-007         | 5         |

**Total**: ~32 days (7 weeks)

---

## Phase 0: Component Consolidation (Per Board Review)

> **Board Decision**: Consolidate shared components before main backlog to avoid carrying tech debt. Confidence: 0.92

### CODE-003: Component Consolidation

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| **Priority**     | P0 - Foundation                         |
| **Effort**       | 5 pts (2-3 days)                        |
| **Dependencies** | None                                    |
| **Board Review** | `docs/BOARD_REVIEW_LAUNCH_CHECKLIST.md` |

**Scope**:

1. Create `shared/MetricCard` - unified stat card with theme support
2. Update `shared/EmptyState` - add dark theme support
3. Update `shared/CTAButton` - add dark theme variant
4. Migrate all usages from duplicate components

**Components to Consolidate**:

- `dashboard/StatCard` (87 lines) → `shared/MetricCard`
- `strategy/StrategyStatCards` (72 lines) → `shared/MetricCard`
- `shared/StatItem` (24 lines) → `shared/MetricCard`
- `shared/StatsCard` (24 lines) → DELETE (landing page specific)

**Acceptance Criteria**:

```gherkin
Given I view Dashboard (light theme) and Studio (dark theme)
When I compare the stat cards
Then they have identical structure, only colors differ
```

---

> Without billing, no revenue. This is the top priority.

---

### BILL-001: Stripe Billing Integration

| Field            | Value               |
| ---------------- | ------------------- |
| **Priority**     | P0 - Launch Blocker |
| **Effort**       | 8 pts (3-4 days)    |
| **Dependencies** | None                |

**Scope**:

1. Configure Stripe products (Solo $49, Growth $149)
2. Implement checkout flow from Pricing page
3. Handle webhook events (subscription.created, updated, cancelled)
4. Store subscription status in `subscriptions` table
5. Display current plan in Settings

**Acceptance Criteria**:

```gherkin
Given I am on the Pricing page
When I click "Subscribe to Growth"
Then Stripe Checkout opens
And after payment, my tier updates to "growth"
```

**Files to Modify**:

- `convex/stripe/checkout.ts` - Checkout session creation
- `convex/stripe/webhooks.ts` - Handle events
- `app/pricing/page.tsx` - Connect to checkout
- `app/settings/page.tsx` - Display current plan

---

### BILL-002: Subscription Limit Enforcement

| Field            | Value               |
| ---------------- | ------------------- |
| **Priority**     | P0 - Launch Blocker |
| **Effort**       | 5 pts (2-3 days)    |
| **Dependencies** | BILL-001            |

**Scope**:

1. Check tier on project creation (Solo: 1, Growth: 3)
2. Block AI actions for non-paying users
3. Show upgrade CTAs when limits reached
4. Tier-based rate limits

**Acceptance Criteria**:

```gherkin
Given I am on Solo tier with 1 project
When I try to create a second project
Then I see "Upgrade to Growth for more projects"
```

**Files to Modify**:

- `convex/projects/mutations.ts` - Add tier check
- `convex/lib/authHelpers.ts` - Add `getTierLimits()`
- All AI action files - Check subscription status

---

## Phase 2: Publishing Integration

---

### WP-001: WordPress E2E Testing

| Field            | Value            |
| ---------------- | ---------------- |
| **Priority**     | P0               |
| **Effort**       | 5 pts (2-3 days) |
| **Dependencies** | None             |

**Scope**:

1. Test WordPress OAuth flow end-to-end
2. Test publish flow with real WordPress site
3. Test error handling (invalid credentials, network)
4. Document setup in user guide

**Acceptance Criteria**:

```gherkin
Given I have connected WordPress in Settings
When I click "Publish" on a draft
Then the post appears on my WordPress site
And I see a success toast with the post URL
```

---

### WP-002: WordPress Settings UI

| Field            | Value            |
| ---------------- | ---------------- |
| **Priority**     | P0               |
| **Effort**       | 3 pts (1-2 days) |
| **Dependencies** | WP-001           |

**Scope**:

1. Add WordPress section to Settings page
2. Show connected site URL or "Connect" button
3. Disconnect functionality
4. Error states

**Files to Modify**:

- `app/settings/page.tsx` - Add WordPress section
- Use existing `WordPressConnect` component

---

## Phase 3: UX Polish

---

### UX-001: Phase-Based User Flow

| Field            | Value                            |
| ---------------- | -------------------------------- |
| **Priority**     | P0                               |
| **Effort**       | 8 pts (3-4 days)                 |
| **Dependencies** | None                             |
| **LDD**          | `docs/LDD_SEAMLESS_USER_FLOW.md` |

**Scope**:

1. Create `useUserPhase` hook
2. Gate sidebar routes based on phase (first project only)
3. Add "Next Step" CTAs to core pages
4. Unlock all routes after first project completion

**Key Logic**:

```typescript
type Phase = 'keyword_discovery' | 'clustering' | 'planning' | 'creation' | 'publishing';

function useUserPhase(projectId: Id<'projects'>) {
  // Returns: currentPhase, nextAction, isFirstProject
}
```

---

### UX-002: Mart Guide Component

| Field            | Value            |
| ---------------- | ---------------- |
| **Priority**     | P1               |
| **Effort**       | 5 pts (2-3 days) |
| **Dependencies** | UX-001           |

**Scope**:

1. Create `MartGuide` floating component
2. Page-specific welcome messages
3. "Next action" suggestions
4. Dismissible with "Don't show again" option
5. Celebration animations on milestones

---

### UX-003: Empty State Designs

| Field            | Value            |
| ---------------- | ---------------- |
| **Priority**     | P1               |
| **Effort**       | 5 pts (2-3 days) |
| **Dependencies** | None             |

**Scope**:
Create helpful empty states for:

- `/studio/strategy` - No keywords yet
- `/studio/calendar` - Calendar is empty
- `/studio/library` - No content yet
- `/studio` (Home) - Get started message

Each includes: Message, Mart illustration, Primary CTA

---

### UX-004: Error Handling Flows

| Field            | Value            |
| ---------------- | ---------------- |
| **Priority**     | P1               |
| **Effort**       | 3 pts (1-2 days) |
| **Dependencies** | None             |

**Scope**:

1. OAuth failure recovery
2. AI timeout messaging
3. Network error handling
4. Rate limit exceeded messaging

---

## Phase 4: Security & Testing

---

### SEC-001: Rotate All Secrets

| Field            | Value         |
| ---------------- | ------------- |
| **Priority**     | P0            |
| **Effort**       | 2 pts (1 day) |
| **Dependencies** | None          |

**Checklist**:

- [ ] Generate new JWT_SECRET
- [ ] Generate new CSRF_SECRET
- [ ] Generate new CRON_SECRET
- [ ] Rotate OpenAI API key
- [ ] Rotate Google OAuth credentials
- [ ] Update Vercel environment variables
- [ ] Revoke old tokens where possible

---

### SEC-002: Security Audit Checklist

| Field            | Value            |
| ---------------- | ---------------- |
| **Priority**     | P0               |
| **Effort**       | 5 pts (2-3 days) |
| **Dependencies** | SEC-001          |

**Audit Items**:

- [ ] No secrets in git history
- [ ] CORS configured correctly
- [ ] Rate limiting active on all AI endpoints
- [ ] All API endpoints require authentication
- [ ] Input validation on all mutations
- [ ] XSS protections in place
- [ ] CSRF tokens validated
- [ ] Content Security Policy headers

---

### QUAL-001: Critical Path E2E Testing

| Field            | Value                 |
| ---------------- | --------------------- |
| **Priority**     | P0                    |
| **Effort**       | 8 pts (3-4 days)      |
| **Dependencies** | All Phase 1-3 tickets |

**Test Flows**:

1. Signup → Onboarding → Studio (keywords visible)
2. Strategy → Keywords → Clusters → Briefs
3. Briefs → Drafts → (WordPress Publish)
4. Billing → Upgrade → Limits enforced
5. Settings → Profile, Integrations

---

### TEST-001: Unit Test Coverage

| Field            | Value                   |
| ---------------- | ----------------------- |
| **Priority**     | P1                      |
| **Effort**       | 8 pts (3-4 days)        |
| **Dependencies** | None (can run parallel) |

**Targets**:

- Core CRUD: 80% coverage
- Security functions: 100% coverage
- Integration tests: 50% coverage

---

## Phase 5: Launch Prep

---

### NOTIFY-001: Notification System

| Field            | Value             |
| ---------------- | ----------------- |
| **Priority**     | P1                |
| **Effort**       | 5 pts (2-3 days)  |
| **Dependencies** | RESEND-001 (Done) |

**Scope**:

1. In-app notification bell
2. Notification preferences in Settings
3. Types: Content published, Keywords found, Rate limit warning

---

### UX-005: Accessibility (WCAG 2.1 AA)

| Field            | Value            |
| ---------------- | ---------------- |
| **Priority**     | P0               |
| **Effort**       | 5 pts (2-3 days) |
| **Dependencies** | None             |

**Checklist**:

- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] ARIA labels
- [ ] Color contrast ≥ 4.5:1
- [ ] Skip to main content link
- [ ] Alt text on images

---

### UX-006: Analytics Event Tracking

| Field            | Value            |
| ---------------- | ---------------- |
| **Priority**     | P1               |
| **Effort**       | 3 pts (1-2 days) |
| **Dependencies** | None             |

**Key Events**:

1. `signup_complete`
2. `onboarding_complete`
3. `first_keyword_created`
4. `first_brief_created`
5. `first_content_published`
6. `subscription_started`

---

### UX-007: Email Notification Triggers

| Field            | Value             |
| ---------------- | ----------------- |
| **Priority**     | P1                |
| **Effort**       | 5 pts (2-3 days)  |
| **Dependencies** | RESEND-001 (Done) |

**Emails**:

1. Welcome email (on signup)
2. Onboarding complete
3. First content published
4. 7-day inactivity reminder
5. Subscription reminder (trial end)
6. Weekly digest

---

## Dependency Graph

```text
BILL-001 ──────────────────────────────┐
    ↓                                   │
BILL-002                                │
                                        ├──→ QUAL-001 ──→ 🚀 LAUNCH
WP-001 → WP-002                         │
                                        │
UX-001 → UX-002                         │
                                        │
SEC-001 → SEC-002 ─────────────────────┘
```

---

## Sprint Schedule

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
- UX-003: Empty States
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

## Success Metrics

| Metric        | Target             | Measurement      |
| ------------- | ------------------ | ---------------- |
| Build Status  | Green              | CI/CD            |
| Test Coverage | 60%+               | Vitest           |
| Response Time | <600ms p95         | Vercel Analytics |
| Uptime        | 99.5%+             | Monitoring       |
| Accessibility | WCAG AA            | Lighthouse       |
| Security      | No critical issues | Audit            |

---

## Quick Command Reference

```bash
# Run tests
npm run test

# Check types
npm run typecheck

# Security audit
npm audit

# Database backup
npx convex export

# Deploy to production
npx vercel --prod
```

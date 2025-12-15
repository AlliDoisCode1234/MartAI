# MartAI Production Launch Plan

**Created**: December 12, 2025  
**Target Launch**: Mid-February 2026  
**Total Effort**: 50 story points / 4 sprints (8 weeks)

---

## Ticket Summary

| ID             | Title                               | Pts | Sprint | Status         |
| -------------- | ----------------------------------- | --- | ------ | -------------- |
| ENV-001        | Environment Variable Setup          | 2   | 1      | ✅ Done        |
| AUTH-002       | Fix Onboarding Keyword/MR           | 3   | 1      | 🔄 In Progress |
| ADMIN-001      | Fix View User Button                | 1   | 1      | ✅ Done        |
| **RESEND-001** | **Set Resend API Key**              | 1   | 1      | 🔲 Todo        |
| **AGENT-001**  | **Generate Convex Types for Agent** | 1   | 1      | 🔲 Todo        |
| **RESEND-002** | **Add Magic Link UI**               | 2   | 1      | 🔲 Todo        |
| BILL-001       | Polar Billing Integration           | 8   | 2      | 🔲 Todo        |
| BILL-002       | Subscription Limit Enforcement      | 5   | 2      | 🔲 Todo        |
| ADMIN-002      | Enhance User Detail Page            | 5   | 2      | ✅ Done        |
| WP-001         | WordPress E2E Testing               | 5   | 3      | 🔲 Todo        |
| WP-002         | WordPress Settings UI               | 3   | 3      | 🔲 Todo        |
| SEC-001        | Rotate All Secrets                  | 2   | 3      | 🔲 Todo        |
| ADMIN-003      | User Engagement Milestones          | 3   | 3      | ✅ Done        |
| SEC-002        | Security Audit Checklist            | 5   | 4      | 🔲 Todo        |
| QUAL-001       | Critical Path E2E Testing           | 8   | 4      | 🔲 Todo        |

---

## Executive Summary

MartAI is feature-complete for MVP. This plan addresses 9 production blockers in dependency order, plus environment setup and security requirements.

> [!IMPORTANT]
> All tickets are P0 (must-have for launch). Future features are deferred post-launch.

---

## Board of Directors Approval

| Persona   | Input                                                 |
| --------- | ----------------------------------------------------- |
| **MART**  | Fix onboarding first - user value is #1 priority      |
| **KATE**  | 4 sprints is realistic. Don't cut corners on billing. |
| **BILL**  | No revenue without Polar. This is critical path.      |
| **KHANH** | Security audit non-negotiable. Rotate all secrets.    |
| **SAM**   | E2E tests required before launch. No manual QA only.  |
| **BARRY** | Need working demo by Sprint 3 for sales calls.        |

**Confidence**: 0.9 (High - all personas agree)

---

## Production Backlog (Ordered by Dependencies)

### Sprint 1: Foundation (Week 1-2)

---

#### ENV-001: Environment Variable Setup & Documentation

| Field            | Value             |
| ---------------- | ----------------- |
| **Priority**     | P0                |
| **Story Points** | 2                 |
| **Dependencies** | None (Start here) |

**User Story**:

> As a DevOps engineer deploying MartAI, I want clear documentation of all required environment variables so that I can deploy to production without guessing.

**Definition of Ready**:

- [ ] Current `.env.example` reviewed
- [ ] All services identified (Convex, OpenAI, Polar, Google, WordPress)
- [ ] Production URLs known

**Acceptance Criteria**:

```gherkin
Given I am setting up production deployment
When I follow the ENV_SETUP.md guide
Then all required variables are documented with:
  - Description of what each var does
  - Where to get the value (console URL)
  - Command to generate secrets
```

**Definition of Done**:

- [ ] `docs/ENV_SETUP.md` created with step-by-step guide
- [ ] `.env.example` updated with all production vars
- [ ] Secret generation commands documented
- [ ] Tested by deploying to Vercel staging

---

#### AUTH-002: Fix Onboarding Keyword & MR Generation

| Field            | Value |
| ---------------- | ----- |
| **Priority**     | P0    |
| **Story Points** | 3     |
| **Dependencies** | None  |

**User Story**:

> As a new user completing onboarding, I want keywords and MR score generated automatically so that I see value immediately after signup.

**Definition of Ready**:

- [ ] Current onboarding flow traced
- [ ] Toast notifications added (done)
- [ ] Convex logs accessible

**Acceptance Criteria**:

```gherkin
Given I complete onboarding with website "example.com"
When the project is created
Then:
  - At least 8 keywords are generated
  - MR score shows a number (not "-")
  - Success toast appears
```

**Definition of Done**:

- [ ] Keywords generated 100% of the time after onboarding
- [ ] MR score > 0 after onboarding
- [ ] No console errors during flow
- [ ] Tested with 3 different website URLs

---

#### ADMIN-001: Fix View User Button in Admin Portal

| Field            | Value |
| ---------------- | ----- |
| **Priority**     | P0    |
| **Story Points** | 1     |
| **Dependencies** | None  |

**User Story**:

> As an admin, I want the View User button in the users table to navigate to the user detail page so that I can manage individual users.

**Root Cause**:

The `IconButton` uses `as="a"` pattern which doesn't work properly with Next.js App Router. Should use Next.js `Link` component.

**Acceptance Criteria**:

```gherkin
Given I am on the Admin Users page
When I click the View icon for any user
Then I navigate to /admin/users/[userId] detail page
```

**Definition of Done**:

- [ ] Replace `as="a"` with Next.js Link wrapper
- [ ] Remove Reset button from users table (keep only on detail page)
- [ ] Verify navigation works in Firefox, Chrome, Safari
- [ ] No console errors

---

### Sprint 2: Billing (Week 3-4)

---

#### BILL-001: Polar Billing Integration

| Field            | Value   |
| ---------------- | ------- |
| **Priority**     | P0      |
| **Story Points** | 8       |
| **Dependencies** | ENV-001 |

**User Story**:

> As a business owner, I want users to subscribe and pay for their tier so that we generate revenue.

**Definition of Ready**:

- [ ] Polar account created
- [ ] Product tiers defined (Solo $49, Growth $149)
- [ ] `@convex-dev/polar` component installed (done)
- [ ] Polar API keys in `.env`

**Acceptance Criteria**:

```gherkin
Given I am a free user
When I click "Upgrade to Growth"
Then:
  - Polar checkout flow opens
  - After payment, my tier updates to "growth"
  - Rate limits reflect new tier

Given I am a paying subscriber
When I view my account
Then I see my current plan and billing date
```

**Definition of Done**:

- [ ] Checkout flow works end-to-end
- [ ] Subscription stored in Convex
- [ ] Webhook handles subscription events
- [ ] Cancellation flow works
- [ ] Tested in Polar sandbox mode

---

#### BILL-002: Subscription Limit Enforcement

| Field            | Value    |
| ---------------- | -------- |
| **Priority**     | P0       |
| **Story Points** | 5        |
| **Dependencies** | BILL-001 |

**User Story**:

> As a paying customer, I want my tier limits enforced fairly so that I get what I pay for.

**Definition of Ready**:

- [ ] Tier limits defined (Solo: 1 project, Growth: 3 projects)
- [ ] Rate limiter configured per tier
- [ ] BILL-001 complete

**Acceptance Criteria**:

```gherkin
Given I am on Solo tier
When I try to create a second project
Then I see "Upgrade to create more projects" message

Given I am on Growth tier
When I generate keywords
Then rate limit is 500/hour (not 100/hour)
```

**Definition of Done**:

- [ ] Project limits enforced
- [ ] Rate limits vary by tier
- [ ] Upgrade CTAs shown at limit
- [ ] Grace period for downgrade (30 days)

---

#### ADMIN-002: Enhance User Detail Page

| Field            | Value     |
| ---------------- | --------- |
| **Priority**     | P0        |
| **Story Points** | 5         |
| **Dependencies** | ADMIN-001 |

**User Story**:

> As a support admin, I want a comprehensive user detail page so that I can manage users without engineering help.

**Definition of Ready**:

- [ ] ADMIN-001 complete (navigation works)
- [ ] User schema understood
- [ ] Admin mutations identified

**Acceptance Criteria**:

```gherkin
Given I am on a user's detail page
When I view the page
Then I see:
  - User header (avatar, name, email, role, status)
  - Quick stats (plan, projects, engagement score)
  - Onboarding journey progress
  - All user projects listed
  - Action buttons for user management

Given I am on a user's detail page
When I click "Reset Onboarding"
Then the user's onboarding state is reset
  And a confirmation toast appears
```

**Definition of Done**:

- [ ] Reset Onboarding moved from table to detail page only
- [ ] User engagement milestones displayed (if available)
- [ ] All projects listed with links
- [ ] Danger zone section for destructive actions
- [ ] Confirmation modals for state changes

---

### Sprint 3: WordPress Publishing (Week 5-6)

---

#### WP-001: WordPress Integration E2E Testing

| Field            | Value    |
| ---------------- | -------- |
| **Priority**     | P0       |
| **Story Points** | 5        |
| **Dependencies** | AUTH-002 |

**User Story**:

> As a content creator, I want to publish drafts directly to my WordPress site so that I don't have to copy/paste content.

**Definition of Ready**:

- [ ] WordPress test site available
- [ ] WordPress OAuth apps created
- [ ] Content mappers implemented (done)

**Acceptance Criteria**:

```gherkin
Given I have connected my WordPress site
When I click "Publish to WordPress" on a draft
Then:
  - Post appears on my WordPress site
  - Featured image is uploaded
  - Categories/tags are applied
  - Success toast shows post URL
```

**Definition of Done**:

- [ ] Publish flow works with real WordPress site
- [ ] Error handling for connection issues
- [ ] Draft/Publish/Schedule options work
- [ ] Documented in user guide

---

#### WP-002: Wire WordPressConnect to Settings Page

| Field            | Value  |
| ---------------- | ------ |
| **Priority**     | P0     |
| **Story Points** | 3      |
| **Dependencies** | WP-001 |

**User Story**:

> As a user with a WordPress site, I want to connect my site from settings so that I can enable publishing.

**Definition of Ready**:

- [ ] `WordPressConnect` component exists (done)
- [ ] WP-001 tested and working

**Acceptance Criteria**:

```gherkin
Given I am on the Settings page
When I click "Connect WordPress"
Then OAuth flow starts and returns to Settings with connected status
```

**Definition of Done**:

- [ ] WordPress section added to Settings page
- [ ] Connect/Disconnect buttons work
- [ ] Connected site URL displayed
- [ ] Error states handled

---

#### SEC-001: Rotate All Secrets Before Launch

| Field            | Value   |
| ---------------- | ------- |
| **Priority**     | P0      |
| **Story Points** | 2       |
| **Dependencies** | ENV-001 |

**User Story**:

> As a security officer, I want all production secrets rotated from dev values so that we don't launch with compromised credentials.

**Definition of Ready**:

- [ ] List of all secrets in `.env.example`
- [ ] Access to all third-party consoles

**Acceptance Criteria**:

```gherkin
Given I am preparing for production launch
When I run the secret rotation checklist
Then all secrets are:
  - Newly generated (not from dev)
  - Stored in Vercel env vars
  - Removed from any git history
```

**Definition of Done**:

- [ ] All secrets regenerated
- [ ] Old secrets revoked where possible
- [ ] Vercel env vars updated
- [ ] Checklist documented

---

#### ADMIN-003: User Engagement Milestones Schema

| Field            | Value     |
| ---------------- | --------- |
| **Priority**     | P1        |
| **Story Points** | 3         |
| **Dependencies** | ADMIN-002 |

**User Story**:

> As a product manager, I want to track user engagement milestones so that we can analyze activation funnels and identify dropoff points.

**Board of Directors Input**:

- **CLARA (CMO)**: Critical for AARRR metrics - need first keyword → cluster → brief → draft → publish funnel
- **BILL (CFO)**: Enables LTV prediction based on engagement velocity
- **OSCAR (COO)**: Helps support identify where users get stuck

**Definition of Ready**:

- [ ] Schema design approved
- [ ] Triggering events identified
- [ ] Admin detail page ready to display milestones

**Schema Design**:

```typescript
engagementMilestones: v.optional(
  v.object({
    firstKeywordCreatedAt: v.optional(v.number()),
    firstClusterCreatedAt: v.optional(v.number()),
    firstBriefCreatedAt: v.optional(v.number()),
    firstDraftCreatedAt: v.optional(v.number()),
    firstContentPublishedAt: v.optional(v.number()),
    firstGa4ConnectedAt: v.optional(v.number()),
    firstGscConnectedAt: v.optional(v.number()),
    firstWordPressConnectedAt: v.optional(v.number()),
    totalKeywords: v.optional(v.number()),
    totalClusters: v.optional(v.number()),
    totalBriefs: v.optional(v.number()),
    totalDrafts: v.optional(v.number()),
    totalPublished: v.optional(v.number()),
  })
);
```

**Acceptance Criteria**:

```gherkin
Given a user creates their first keyword
When the keyword is saved
Then the user's firstKeywordCreatedAt is set (if not already set)
  And totalKeywords is incremented

Given I view a user in the admin portal
When the user has engagement milestones
Then I see a timeline of their journey with timestamps
```

**Definition of Done**:

- [ ] Schema extended with engagementMilestones
- [ ] Triggers added to keyword, cluster, brief, draft, publish actions
- [ ] Milestones displayed on admin user detail page
- [ ] Existing users backfilled where data exists

---

### Sprint 4: Security & QA (Week 7-8)

---

#### SEC-002: Security Audit Checklist

| Field            | Value   |
| ---------------- | ------- |
| **Priority**     | P0      |
| **Story Points** | 5       |
| **Dependencies** | SEC-001 |

**User Story**:

> As a product owner, I want a security review completed so that we don't expose customer data.

**Definition of Ready**:

- [ ] All secrets rotated (SEC-001)
- [ ] OWASP Top 10 checklist available

**Acceptance Criteria**:

```gherkin
Given I am reviewing security before launch
When I complete the audit checklist
Then I have verified:
  - No secrets in git history
  - CORS configured correctly
  - Rate limiting active
  - API endpoints authenticated
  - No SQL injection risks
  - XSS protections in place
```

**Definition of Done**:

- [ ] Audit checklist document created
- [ ] All items verified
- [ ] Any issues fixed
- [ ] Sign-off from team lead

---

#### QUAL-001: Critical Path E2E Testing

| Field            | Value            |
| ---------------- | ---------------- |
| **Priority**     | P0               |
| **Story Points** | 8                |
| **Dependencies** | WP-002, AUTH-002 |

**User Story**:

> As a QA engineer, I want documented test cases for the full user journey so that we catch regressions before launch.

**Definition of Ready**:

- [ ] All prior tickets complete
- [ ] Test account credentials available
- [ ] Production-like staging environment

**Acceptance Criteria**:

```gherkin
Given I have the E2E test suite
When I run through all test cases
Then I have verified:
  - Signup → Onboarding → Home (keywords visible)
  - Strategy → Keywords → Clusters → Briefs
  - Briefs → Drafts → WordPress Publish
  - Billing → Upgrade → Limits enforced
```

**Definition of Done**:

- [ ] Test cases documented
- [ ] All paths tested manually
- [ ] Critical bugs fixed
- [ ] Test results logged
- [ ] Go/No-Go decision documented

---

## Environment Variable Setup Guide

### Required for Production

| Variable                 | Description           | How to Get                                              |
| ------------------------ | --------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | [Convex Dashboard](https://dashboard.convex.dev)        |
| `CONVEX_DEPLOYMENT`      | Deployment name       | Convex Dashboard                                        |
| `OPENAI_API_KEY`         | OpenAI API key        | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `JWT_SECRET`             | JWT signing secret    | Generate (see below)                                    |
| `JWT_REFRESH_SECRET`     | Refresh token secret  | Generate                                                |
| `CSRF_SECRET`            | CSRF protection       | Generate                                                |
| `CRON_SECRET`            | Cron job auth         | Generate                                                |

### Generate Secrets

```bash
# Run this for each secret you need
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Required for Billing (Polar)

| Variable                | Description          | How to Get                                   |
| ----------------------- | -------------------- | -------------------------------------------- |
| `POLAR_ACCESS_TOKEN`    | Polar API token      | [Polar Dashboard](https://polar.sh/settings) |
| `POLAR_WEBHOOK_SECRET`  | Webhook verification | Polar webhook settings                       |
| `POLAR_ORGANIZATION_ID` | Your org ID          | Polar Dashboard                              |

### Required for WordPress

| Variable                  | Description  | How to Get                                                   |
| ------------------------- | ------------ | ------------------------------------------------------------ |
| `WORDPRESS_CLIENT_ID`     | OAuth app ID | [WordPress Developer](https://developer.wordpress.com/apps/) |
| `WORDPRESS_CLIENT_SECRET` | OAuth secret | Same as above                                                |

### Required for Google Analytics/GSC

| Variable               | Description     | How to Get                                                                |
| ---------------------- | --------------- | ------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | OAuth client ID | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | OAuth secret    | Same as above                                                             |

---

## Timeline

```mermaid
gantt
    title MartAI Production Launch
    dateFormat YYYY-MM-DD
    section Sprint 1
    ENV-001 Env Setup           :2025-12-16, 5d
    AUTH-002 Fix Onboarding     :2025-12-16, 7d
    section Sprint 2
    BILL-001 Polar Integration  :2025-12-30, 10d
    BILL-002 Limit Enforcement  :2026-01-06, 5d
    section Sprint 3
    WP-001 WordPress E2E        :2026-01-13, 7d
    WP-002 Settings UI          :2026-01-20, 3d
    SEC-001 Rotate Secrets      :2026-01-20, 2d
    section Sprint 4
    SEC-002 Security Audit      :2026-01-27, 5d
    QUAL-001 E2E Testing        :2026-01-27, 10d
    section Launch
    Production Launch           :milestone, 2026-02-10, 0d
```

---

## Future State (Post-Launch P1/P2)

### Admin Portal User Management

| Ticket    | Description                          | Priority | Points |
| --------- | ------------------------------------ | -------- | ------ |
| ADMIN-004 | Account Management (password, email) | P1       | 5      |
| ADMIN-005 | Subscription Management              | P1       | 5      |
| ADMIN-006 | Admin Audit Logs                     | P1       | 5      |
| ADMIN-007 | BI Dashboard - Engagement Funnel     | P2       | 8      |
| ADMIN-008 | User Impersonation (Non-Prod Only)   | P1       | 8      |

> [!WARNING]
> **ADMIN-008 requires BOD review before implementation.** This feature allows admins to log in as users for debugging/support. Security-sensitive - must be blocked in production environment.

### Integrations & Platform

| Ticket   | Description              | Priority | Points |
| -------- | ------------------------ | -------- | ------ |
| ACT-001  | Activity Logs for Orgs   | P1       | 5      |
| API-002  | Swagger UI for Docs      | P2       | 3      |
| WEB-001  | Webflow Integration      | P2       | 8      |
| SHOP-001 | Shopify Integration      | P2       | 8      |
| PERF-001 | Performance Optimization | P2       | 5      |

### UX Polish

| Ticket | Description                           | Priority | Points |
| ------ | ------------------------------------- | -------- | ------ |
| UX-001 | Skeleton Loading (35 pages)           | P1       | 8      |
| UX-002 | Smooth Transitions & Micro-animations | P2       | 5      |

> [!NOTE]
> **UX-001**: Replace all spinner/loading text with dimension-matched skeleton components. Reusable skeletons created in `components/skeletons/`. Target: Premium, seamless loading experience.

---

## Appendix: Story Point Reference

| Points | Complexity | Example                       |
| ------ | ---------- | ----------------------------- |
| 1      | Trivial    | Fix typo, update copy         |
| 2      | Simple     | Add env var, single component |
| 3      | Small      | New UI section, simple query  |
| 5      | Medium     | New feature, E2E flow         |
| 8      | Large      | Integration, complex logic    |
| 13     | XL         | Major new system              |

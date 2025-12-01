# MartAI Feature Tickets

**Goal**: Build MartAI by using MartAI. Focus on CRUD, simplicity, and business value.

## Phase 1: Foundation & Dogfooding (Immediate)

### [ ] Ticket-001: Project Onboarding Verification
- **Goal**: Ensure we can create the "MartAI" project in the system.
- **Tasks**:
  - [ ] Manual test of Signup/Login.
  - [ ] Manual test of Project Creation Wizard.
  - [ ] Verify data in Convex Dashboard.
  - [ ] Fix any UI/UX bugs found during this process.

### [ ] Ticket-002: Keyword Intelligence (Dogfooding) - DEFERRED
- **Goal**: Generate keyword clusters for MartAI's own marketing.
- **Status**: Deferred due to missing OpenAI Key in Convex env.
- **Tasks**:
  - [ ] Input seed keywords.
  - [ ] Run Keyword Clustering algorithm.
  - [ ] Verify cluster quality.

### [ ] Ticket-003: Strategic Planning
- **Goal**: Create a Q1 Content Plan for MartAI.
- **Tasks**:
  - [ ] Use the "Generate Quarterly Plan" feature.
  - [ ] Set velocity: 3 posts/week.
  - [ ] Review generated calendar.
  - [ ] **Deliverable**: A populated 12-week calendar in the dashboard.

### [ ] Ticket-004: Content Engine - Briefs - DEFERRED
- **Goal**: Generate briefs for the first week of content.
- **Status**: Deferred due to missing OpenAI Key.
- **Tasks**:
  - [ ] Select top 3 clusters.
  - [ ] Generate Briefs.

### [ ] Ticket-005: Content Engine - Drafts - DEFERRED
- **Goal**: Generate full articles from briefs.
- **Status**: Deferred due to missing OpenAI Key.
- **Tasks**:
  - [ ] Run Draft Generation.
  - [ ] Review content quality.

## Phase 2: Publishing & Integration

### [ ] Ticket-006: WordPress Adapter MVP
- **Goal**: Publish the 3 articles to a WordPress site (or mock).
- **Tasks**:
  - [ ] Implement `app/api/publish/route.ts` for WordPress.
  - [ ] Test with a dev site or local WP.
  - [ ] Verify formatting (H2s, lists, images).

### [ ] Ticket-007: Analytics Setup
- **Goal**: Connect GSC/GA4 to track performance.
- **Tasks**:
  - [ ] Implement OAuth flow for GSC.
  - [ ] Fetch initial data (if any).
  - [ ] Display simple "Traffic" chart.

## Phase 3: Polish & Scale

### [ ] Ticket-008: UI/UX Polish
- **Goal**: Make it look "Premium" as per design guidelines.
- **Tasks**:
  - [ ] Review dashboard aesthetics.
  - [ ] Add micro-animations (framer-motion).
  - [ ] Improve loading states.

### [x] Ticket-009: Infrastructure Hardening
- **Goal**: Ensure reliability.
- **Tasks**:
  - [x] Add error boundaries.
  - [ ] Set up Sentry (if requested).
  - [x] Finalize CI/CD.
